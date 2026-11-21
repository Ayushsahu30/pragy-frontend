import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentSuccess from "@/components/payments/PaymentSuccess";

export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
