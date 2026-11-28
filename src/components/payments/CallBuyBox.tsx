"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useId, useMemo, useState } from "react";
import PromoCodeField from "@/components/payments/PromoCodeField";
import { buttonClass } from "@/components/ui";
import type { Product } from "@/content/products";
import { site } from "@/content/site";
import { ApiError } from "@/lib/auth";
import {
  type CallProduct,
  callPages,
  callsApi,
  formatCallTime,
  formatDay,
  formatTime,
  istDayKey,
  type MyCall,
} from "@/lib/calls";
import { formatINR } from "@/lib/format";
import { checkout, formatPaise, paymentsApi, type PromoPreview } from "@/lib/payments";
import { useSession } from "@/lib/session";

/** Reads ?rebook=<booking id> (from My account) without blocking the page. */
function RebookParam({ onRebook }: { onRebook: (id: string) => void }) {
  const id = useSearchParams().get("rebook");
  useEffect(() => {
    if (id) onRebook(id);
  }, [id, onRebook]);
  return null;
}

/**
 * Price box for a call: pick a free time (from Pragy's Cal.com), pay, and the
 * call is booked with a Google Meet link. With ?rebook=<id> it picks a new
 * time for a paid call that could not be booked, without paying again.
 */
export default function CallBuyBox({ product, slug }: { product: Product; slug: CallProduct }) {
  const router = useRouter();
  const session = useSession();
  const signedIn = session.status === "signed-in";
  const id = useId();

  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsError, setSlotsError] = useState("");
  const [reload, setReload] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [mine, setMine] = useState<MyCall | null>(null);
  const [rebookId, setRebookId] = useState<string | null>(null);
  const [promo, setPromo] = useState<PromoPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const onRebook = useCallback((value: string) => setRebookId(value), []);

  // Free times. Reloaded after a time turns out to be taken.
  useEffect(() => {
    let current = true;
    callsApi.slots(slug).then(
      (r) => {
        if (!current) return;
        setSlots(r.slots);
        setSlotsError("");
      },
      (e: unknown) => {
        if (!current) return;
        setSlots([]);
        setSlotsError(e instanceof ApiError ? e.message : "We couldn't load the free times. Please try again.");
      },
    );
    return () => {
      current = false;
    };
  }, [slug, reload]);

  // Logged in: has this person already booked this call?
  useEffect(() => {
    if (!signedIn) return;
    callsApi.mine().then(
      (r) => setMine(r.calls.find((c) => c.productSlug === slug && !c.refunded && c.status !== "CANCELLED") ?? null),
      () => undefined,
    );
  }, [signedIn, slug]);

  const days = useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const s of slots ?? []) groups.set(istDayKey(s), [...(groups.get(istDayKey(s)) ?? []), s]);
    return [...groups.entries()];
  }, [slots]);
  const selectedDay = day && days.some(([d]) => d === day) ? day : (days[0]?.[0] ?? null);
  const times = days.find(([d]) => d === selectedDay)?.[1] ?? [];
  const rebooking = Boolean(rebookId && mine?.id === rebookId && mine.status === "NEEDS_NEW_TIME");
  const amountLabel = promo && promo.product === slug ? formatPaise(promo.amountPaise) : formatINR(product.price.amount);

  function slotTaken(e: unknown) {
    if (e instanceof ApiError && e.code === "SLOT_NOT_AVAILABLE") {
      setPicked(null);
      setReload((r) => r + 1);
    }
    setMessage(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
  }

  async function buy() {
    setMessage("");
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(callPages[slug])}`);
      return;
    }
    if (!picked) return;
    setBusy(true);
    try {
      const outcome = await checkout(await paymentsApi.startCallOrder(slug, picked, promo?.code), site.name);
      if (outcome.result === "paid") {
        router.push(`/payment/success?order=${encodeURIComponent(outcome.orderId)}`);
        return;
      }
      if (outcome.result === "failed") {
        router.push(`/payment/failed?product=${slug}&reason=${encodeURIComponent(outcome.reason)}`);
        return;
      }
      setMessage("Payment not completed. The time is kept for you for a few minutes; you can try again.");
    } catch (e) {
      slotTaken(e);
    }
    setBusy(false);
  }

  async function rebook() {
    if (!rebookId || !picked) return;
    setMessage("");
    setBusy(true);
    try {
      await callsApi.rebook(rebookId, picked);
      router.push("/dashboard#calls");
      return;
    } catch (e) {
      slotTaken(e);
    }
    setBusy(false);
  }

  const header = (
    <>
      <Suspense fallback={null}>
        <RebookParam onRebook={onRebook} />
      </Suspense>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{product.priceLabel}</span>
      <span className="font-serif text-[68px] font-medium leading-none">{formatINR(product.price.amount)}</span>
      <hr className="m-0 border-0 border-t border-line" />
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-ink-soft">
        {product.priceNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </>
  );

  // Already booked (and not waiting for a new time): show it instead of the picker.
  if (mine && !rebooking) {
    return (
      <>
        {header}
        <div className="rounded-2xl bg-cream p-4 text-[15px]">
          {mine.status === "NEEDS_NEW_TIME" ? (
            <>Your payment is received, but your time was taken. Pick a new time in My account.</>
          ) : (
            <>
              You have booked this call for <strong>{formatCallTime(mine.startsAt)}</strong>.
            </>
          )}
        </div>
        <Link href="/dashboard#calls" className={buttonClass("dark", "self-stretch")}>
          Open My account
        </Link>
      </>
    );
  }

  return (
    <>
      {header}

      {rebooking && (
        <p className="m-0 rounded-2xl bg-peach p-3.5 text-sm text-ink">
          Your payment is received. Pick a new time for your call; you won&apos;t pay again.
        </p>
      )}

      <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
        <legend className="mb-2 p-0 text-sm font-semibold">
          Pick a time <span className="font-normal text-ink-soft">(Indian time, IST)</span>
        </legend>

        {slots === null ? (
          <p className="m-0 text-[15px] text-ink-soft">Loading free times…</p>
        ) : slotsError ? (
          <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
            {slotsError}
          </p>
        ) : days.length === 0 ? (
          <p className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-ink">
            No free times in the next three weeks. Message us on{" "}
            <a
              href={`https://wa.me/${site.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline underline-offset-4"
            >
              WhatsApp
            </a>{" "}
            and we&apos;ll find one.
          </p>
        ) : (
          <>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup" aria-label="Day">
              {days.map(([d, list]) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={d === selectedDay}
                  onClick={() => {
                    setDay(d);
                    setPicked(null);
                  }}
                  className={`flex min-h-[56px] flex-none cursor-pointer flex-col items-center justify-center rounded-[14px] border px-3.5 font-sans text-sm ${
                    d === selectedDay ? "border-ink bg-ink text-white" : "border-field bg-white text-ink hover:border-ink"
                  }`}
                >
                  <span className="font-semibold">{formatDay(list[0])}</span>
                  <span className={d === selectedDay ? "text-xs text-mist" : "text-xs text-ink-soft"}>
                    {list.length} {list.length === 1 ? "time" : "times"}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby={`${id}-times`}>
              <span id={`${id}-times`} className="sr-only">
                Time on {selectedDay ? formatDay(times[0]) : ""}
              </span>
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={t === picked}
                  onClick={() => setPicked(t)}
                  className={`min-h-[48px] cursor-pointer rounded-[14px] border font-sans text-[15px] font-semibold ${
                    t === picked ? "border-ink bg-peach text-ink" : "border-field bg-white text-ink hover:border-ink"
                  }`}
                >
                  {formatTime(t)}
                </button>
              ))}
            </div>
          </>
        )}
      </fieldset>

      {picked && (
        <p className="m-0 text-[15px]">
          Your call: <strong>{formatCallTime(picked)}</strong>, 30 minutes on Google Meet.
        </p>
      )}

      {signedIn && !rebooking && <PromoCodeField product={slug} applied={promo} onChange={setPromo} />}

      {message && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={rebooking ? rebook : buy}
        disabled={busy || (signedIn && !picked)}
        className={buttonClass("dark", "cursor-pointer self-stretch border-0 font-sans disabled:cursor-not-allowed disabled:opacity-60")}
      >
        {busy
          ? rebooking
            ? "Booking…"
            : "Opening payment…"
          : !signedIn
            ? "Log in to book"
            : rebooking
              ? picked
                ? "Book this new time"
                : "Pick a time above"
              : picked
                ? `Pay ${amountLabel} and book`
                : "Pick a time above"}
      </button>
      {!rebooking && (
        <span className="text-center text-sm text-ink-soft">
          The time is booked as soon as you pay. Secure payment by Razorpay: UPI, cards and netbanking.
        </span>
      )}
    </>
  );
}
