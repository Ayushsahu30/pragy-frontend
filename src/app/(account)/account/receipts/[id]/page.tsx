import type { Metadata } from "next";
import { Suspense } from "react";
import ReceiptView from "@/components/account/ReceiptView";

export const metadata: Metadata = {
  title: "Receipt",
  robots: { index: false },
};

export default function ReceiptPage() {
  return (
    <Suspense>
      <ReceiptView />
    </Suspense>
  );
}
