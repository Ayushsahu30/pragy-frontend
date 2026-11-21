"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import type { Product } from "@/content/products";
import { site } from "@/content/site";
import { ApiError } from "@/lib/auth";
import { formatINR } from "@/lib/format";
import { checkout, courseApi, paymentsApi } from "@/lib/payments";
import { useSession } from "@/lib/session";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** "owned" = active access; "preparing" = access, but the file is not uploaded yet. */
type State = "loading" | "buy" | "owned" | "preparing";

/** The PDF course's price box: buy it, or open it if you already have access. */
export default function CourseBuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const session = useSession();
  const signedIn = session.status === "signed-in";

  const [checked, setChecked] = useState<State>("loading");
  const [endsAt, setEndsAt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  // Visitors who are not logged in can always buy (after logging in).
  const state: State = session.status === "signed-out" ? "buy" : checked;

  // Logged in: does this user already have access?
  useEffect(() => {
    if (!signedIn) return;
    let current = true;
    courseApi.info().then(
      (info) => {
        if (!current) return;
        setEndsAt(info.endsAt);
        setChecked("owned");
      },
      (e: unknown) => {
        if (!current) return;
        setChecked(e instanceof ApiError && e.code === "COURSE_NOT_READY" ? "preparing" : "buy");
      },
    );
    return () => {
      current = false;
    };
  }, [session.status, signedIn]);

  async function buy() {
    setMessage("");
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent("/pdf-course")}`);
      return;
    }
    setBusy(true);
    try {
      const outcome = await checkout(await paymentsApi.startCourseOrder(), site.name);
      if (outcome.result === "paid") {
        router.push(`/payment/success?order=${encodeURIComponent(outcome.orderId)}`);
        return;
      }
      if (outcome.result === "failed") {
        router.push(`/payment/failed?product=pdf-course&reason=${encodeURIComponent(outcome.reason)}`);
        return;
      }
      setMessage("Payment not completed. You can try again whenever you are ready.");
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "We couldn't open the payment window. Please try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{product.priceLabel}</span>
      <span className="font-serif text-[68px] font-medium leading-none">{formatINR(product.price.amount)}</span>
      <hr className="m-0 border-0 border-t border-line" />
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-ink-soft">
        {product.priceNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      {message && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {message}
        </p>
      )}

      {state === "owned" ? (
        <>
          <Link href="/courses/pdf" className={buttonClass("dark", "mt-2 self-stretch")}>
            Open the course
          </Link>
          <span className="text-center text-sm text-ink-soft">
            {endsAt ? `Your access runs until ${dateFormat.format(new Date(endsAt))}.` : "You have access."}
          </span>
        </>
      ) : state === "preparing" ? (
        <p className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-ink">
          You have access. The course is being prepared and will open here soon.
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={buy}
            disabled={busy || state === "loading"}
            className={buttonClass("dark", "mt-2 cursor-pointer self-stretch border-0 font-sans disabled:opacity-60")}
          >
            {busy ? "Opening payment…" : signedIn ? `${product.cta.label} · ${formatINR(product.price.amount)}` : "Log in to buy"}
          </button>
          <span className="text-center text-sm text-ink-soft">Secure payment by Razorpay: UPI, cards and netbanking.</span>
        </>
      )}
    </>
  );
}
