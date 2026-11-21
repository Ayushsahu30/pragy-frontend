import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentFailedActions from "@/components/payments/PaymentFailedActions";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Payment failed",
  robots: { index: false },
};

export default function PaymentFailedPage() {
  return (
    <section className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[640px] flex-col items-start gap-5">
        <Eyebrow>Payment failed</Eyebrow>
        <h1 className="m-0 font-serif text-[clamp(44px,6vw,68px)] font-medium leading-none">
          That didn&apos;t go through.
        </h1>
        <p className="m-0 text-[17px] text-ink-soft">
          Nothing was booked. If money was taken from your account, the bank returns it automatically, usually within 5
          to 7 working days.
        </p>
        <Suspense>
          <PaymentFailedActions />
        </Suspense>
      </div>
    </section>
  );
}
