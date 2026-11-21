"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClass, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";
import { formatIST, formatPaise, type OrderSummary, paymentsApi } from "@/lib/payments";
import { isPtProduct, PT_PLANS_PATH } from "@/lib/pt";
import { useSession } from "@/lib/session";

/** How long to wait for Razorpay's confirmation before showing "still confirming". */
const WAIT_SECONDS = 40;

/**
 * Shown after the payment window closes successfully. This page only shows
 * the order's status from the backend; it does not give access itself.
 */
export default function PaymentSuccess() {
  const router = useRouter();
  const orderId = useSearchParams().get("order") ?? "";
  const session = useSession();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent(`/payment/success?order=${orderId}`)}`);
  }, [session.status, router, orderId]);

  // Ask the backend until the payment is confirmed (usually instant).
  useEffect(() => {
    if (session.status !== "signed-in" || !orderId) return;
    let stopped = false;
    const started = Date.now();
    async function check() {
      if (stopped) return;
      try {
        const latest = await paymentsApi.order(orderId);
        if (stopped) return;
        setOrder(latest);
        if (latest.status !== "CREATED") return;
      } catch {
        // try again below
      }
      if (Date.now() - started > WAIT_SECONDS * 1000) {
        setGaveUp(true);
        return;
      }
      setTimeout(check, 2000);
    }
    void check();
    return () => {
      stopped = true;
    };
  }, [session.status, orderId]);

  const paid = order?.status === "PAID";
  const failed = order?.status === "FAILED";
  const coaching = Boolean(order && isPtProduct(order.product.slug));
  const retry = !order ? "/webinar" : coaching ? PT_PLANS_PATH : order.product.slug === "pdf-course" ? "/pdf-course" : "/webinar";

  return (
    <section className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[640px] flex-col items-start gap-5">
        <Eyebrow>{paid ? "Payment received" : failed ? "Payment failed" : "Confirming payment"}</Eyebrow>
        <h1 className="m-0 font-serif text-[clamp(44px,6vw,68px)] font-medium leading-none">
          {paid ? "You're in." : failed ? "That didn't go through." : "One moment…"}
        </h1>

        {paid && order ? (
          <>
            <p className="m-0 text-[17px] text-ink-soft">
              Your payment of <strong className="text-ink">{formatPaise(order.amountPaise)}</strong> is confirmed. A
              receipt is on its way to your email.
            </p>
            {order.webinar && (
              <div className="w-full rounded-3xl border border-line bg-white p-6">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Your webinar</p>
                <p className="m-0 mt-2 font-serif text-[28px] font-medium leading-[1.15]">{order.webinar.title}</p>
                <p className="m-0 mt-1 text-[15px] text-ink-soft">{formatIST(order.webinar.startsAt)}</p>
                <p className="m-0 mt-3 text-sm text-ink-soft">The joining link is in My account.</p>
              </div>
            )}
            {order.access && (
              <div className="w-full rounded-3xl border border-line bg-white p-6">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  {coaching ? "Your coaching plan" : "Your course"}
                </p>
                <p className="m-0 mt-2 font-serif text-[28px] font-medium leading-[1.15]">{order.product.name}</p>
                <p className="m-0 mt-1 text-[15px] text-ink-soft">
                  {order.access.endsAt
                    ? `Access until ${new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(order.access.endsAt))}`
                    : "Access does not expire"}
                </p>
                {coaching && (
                  <p className="m-0 mt-3 text-sm text-ink-soft">
                    My team will message you on WhatsApp to begin your onboarding.
                  </p>
                )}
              </div>
            )}
            {coaching ? (
              <Link href="/dashboard#coaching" className={buttonClass("dark")}>
                Open My account
              </Link>
            ) : order.access ? (
              <Link href="/courses/pdf" className={buttonClass("dark")}>
                Open the course
              </Link>
            ) : (
              <Link href="/dashboard#webinars" className={buttonClass("dark")}>
                Open My account
              </Link>
            )}
          </>
        ) : failed ? (
          <>
            <p className="m-0 text-[17px] text-ink-soft">Nothing was bought. If money was taken, it is refunded automatically.</p>
            <Link href={retry} className={buttonClass("dark")}>
              Try again
            </Link>
          </>
        ) : gaveUp ? (
          <p role="status" className="m-0 text-[17px] text-ink-soft">
            We are still waiting for the bank to confirm your payment. This page will not update by itself: check{" "}
            <Link href="/dashboard#webinars" className="font-semibold text-ink underline underline-offset-4">
              My account
            </Link>{" "}
            in a few minutes. If it doesn&apos;t appear within an hour, message us on WhatsApp at +{site.whatsappNumber}.
          </p>
        ) : (
          <p role="status" className="m-0 text-[17px] text-ink-soft">
            We are confirming your payment with the bank. Please keep this page open.
          </p>
        )}
      </div>
    </section>
  );
}
