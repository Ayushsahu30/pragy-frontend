import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFlow from "@/components/auth/AuthFlow";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    // AuthFlow reads ?next= from the address, which needs a Suspense boundary.
    <Suspense>
      <AuthFlow mode="login" />
    </Suspense>
  );
}
