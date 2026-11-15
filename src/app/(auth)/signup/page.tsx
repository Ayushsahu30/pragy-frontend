import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFlow from "@/components/auth/AuthFlow";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false },
};

export default function SignUpPage() {
  return (
    <Suspense>
      <AuthFlow mode="signup" />
    </Suspense>
  );
}
