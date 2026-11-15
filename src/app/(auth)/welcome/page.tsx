import type { Metadata } from "next";
import { Suspense } from "react";
import WelcomeStep from "@/components/auth/WelcomeStep";

export const metadata: Metadata = {
  title: "Your details",
  robots: { index: false },
};

export default function WelcomePage() {
  return (
    <Suspense>
      <WelcomeStep />
    </Suspense>
  );
}
