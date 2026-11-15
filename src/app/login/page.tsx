import type { Metadata } from "next";
import { ButtonLink, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Log in or sign up",
  robots: { index: false },
};

// Placeholder. The real login (Google and email code) is built in Phase 3.
export default function LoginPage() {
  return (
    <section aria-labelledby="login-title" className="px-6 py-20 md:py-26">
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-5 rounded-[28px] border border-line bg-cream p-8 text-center sm:p-10">
        <Eyebrow>Your account</Eyebrow>
        <h1 id="login-title" className="m-0 font-serif text-[44px] font-medium leading-[1.05]">
          Log in or sign up
        </h1>
        <p className="m-0 text-ink-soft">
          Sign in with Google or with a code sent to your email. No passwords. Accounts open soon.
        </p>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
