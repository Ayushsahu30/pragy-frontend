"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ProfileForm from "@/components/auth/ProfileForm";
import { Eyebrow } from "@/components/ui";
import { safeNext } from "@/lib/auth";
import { useSession } from "@/lib/session";

/** First-login step: name, phone and marketing consent. */
export default function WelcomeStep() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const session = useSession();

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent("/welcome")}`);
  }, [session.status, router]);

  if (session.status !== "signed-in") {
    return <p className="m-0 text-ink-soft">Loading…</p>;
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Eyebrow>One last step</Eyebrow>
        <h1 className="m-0 font-serif text-[clamp(40px,5vw,52px)] font-medium leading-[1.02]">Tell us about you.</h1>
        <p className="m-0 text-ink-soft">This helps my team reach you about your courses, calls and coaching.</p>
      </div>
      <ProfileForm user={session.user} submitLabel="Continue" onSaved={() => router.replace(next)} />
    </div>
  );
}
