"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { site } from "@/content/site";
import { ApiError } from "@/lib/auth";
import { formatINR } from "@/lib/format";
import { checkout, formatIST, formatPaise, type NextWebinar, paymentsApi } from "@/lib/payments";
import { useSession } from "@/lib/session";

type Loaded = { webinar: NextWebinar | null; owned: boolean };

/**
 * The webinar's price box: the next session from the backend, and buying it.
 * Access is given by the backend only after Razorpay confirms the payment.
 */
export default function WebinarBuyBox() {
  const router = useRouter();
  const session = useSession();
  const signedIn = session.status === "signed-in";

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // The next webinar, and whether this user already has a seat in it.
  useEffect(() => {
    if (session.status === "loading") return;
    let current = true;
    Promise.all([
      paymentsApi.nextWebinar(),
      signedIn ? paymentsApi.myWebinars().catch(() => ({ webinars: [] })) : Promise.resolve({ webinars: [] }),
    ]).then(
      ([next, mine]) => {
        if (!current) return;
        const webinar = next.webinar;
        setLoaded({ webinar, owned: Boolean(webinar && mine.webinars.some((w) => w.id === webinar.id)) });
      },
      () => current && setLoaded({ webinar: null, owned: false }),
    );
    return () => {
      current = false;
    };
  }, [session.status, signedIn]);

  async function buy(webinar: NextWebinar) {
    setMessage("");
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent("/webinar")}`);
      return;
    }
    setBusy(true);
    try {
      const details = await paymentsApi.startWebinarOrder(webinar.id);
      const outcome = await checkout(details, site.name);
      if (outcome.result === "paid") {
        router.push(`/payment/success?order=${encodeURIComponent(outcome.orderId)}`);
        return;
      }
      if (outcome.result === "failed") {
        router.push(`/payment/failed?product=webinar&reason=${encodeURIComponent(outcome.reason)}`);
        return;
      }
      setMessage("Payment not completed. You can try again whenever you are ready.");
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "We couldn't open the payment window. Please try again.");
    }
    setBusy(false);
  }

  const webinar = loaded?.webinar ?? null;
  const price = webinar ? formatPaise(webinar.pricePaise) : formatINR(prices.webinar.amount);

  return (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Webinar seat</span>
      <span className="font-serif text-[68px] font-medium leading-none">{price}</span>
      <hr className="m-0 border-0 border-t border-line" />

      {!loaded ? (
        <p className="m-0 text-[15px] text-ink-soft">Checking the next date…</p>
      ) : webinar ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-ink-soft">
          <li>
            <strong className="font-semibold text-ink">{webinar.title}</strong>
          </li>
          <li>
            Next session: <strong className="font-semibold text-ink">{formatIST(webinar.startsAt)}</strong> (
            {webinar.durationMinutes} minutes)
          </li>
          <li>Non-refundable, unless the webinar is cancelled.</li>
        </ul>
      ) : (
        <p className="m-0 text-[15px] text-ink-soft">
          The next date will be announced soon. Follow{" "}
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-4">
            @{site.instagram.handle}
          </a>{" "}
          to hear first.
        </p>
      )}

      {message && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {message}
        </p>
      )}

      {loaded?.owned ? (
        <Link href="/dashboard#webinars" className={buttonClass("dark", "mt-2 self-stretch")}>
          You have a seat. See it in My account
        </Link>
      ) : webinar ? (
        <button
          type="button"
          onClick={() => buy(webinar)}
          disabled={busy || session.status === "loading"}
          className={buttonClass("dark", "mt-2 cursor-pointer self-stretch border-0 font-sans disabled:opacity-60")}
        >
          {busy ? "Opening payment…" : signedIn ? `Book my seat · ${price}` : "Log in to book my seat"}
        </button>
      ) : (
        <button type="button" disabled className={buttonClass("dark", "mt-2 self-stretch border-0 font-sans opacity-60")}>
          Coming soon
        </button>
      )}
      {webinar && !loaded?.owned && (
        <span className="text-center text-sm text-ink-soft">Secure payment by Razorpay: UPI, cards and netbanking.</span>
      )}
    </>
  );
}
