"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import CodeInput from "@/components/auth/CodeInput";
import { ArrowRightIcon } from "@/components/icons";
import { buttonClass, Eyebrow } from "@/components/ui";
import { ApiError, authApi, googleErrors, safeNext } from "@/lib/auth";
import { setSignedIn, useSession } from "@/lib/session";

/** Google's "G" logo, as Google asks it to be shown on sign-in buttons. */
function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const RESEND_SECONDS = 30;
const fieldClass =
  "h-[54px] w-full rounded-[14px] border border-field bg-white px-4 font-sans text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rust";

type Mode = "login" | "signup";

/**
 * Log in and sign up. Both work the same way (there are no passwords):
 * 1. enter your email (and name, when signing up), 2. enter the 6-digit code.
 * New accounts then go to the profile step at /welcome.
 */
export default function AuthFlow({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const session = useSession();

  const [step, setStep] = useState<"email" | "code">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [resendIn, setResendIn] = useState(0);

  // Logged in (already, or just now): go on, via the profile step if details are missing.
  const needsProfile = session.status === "signed-in" && session.user.needsProfile;
  useEffect(() => {
    if (session.status !== "signed-in") return;
    router.replace(needsProfile ? `/welcome?next=${encodeURIComponent(next)}` : next);
  }, [session.status, needsProfile, next, router]);

  // Show "Continue with Google" only when the backend has it switched on.
  const [googleOn, setGoogleOn] = useState(false);
  useEffect(() => {
    authApi.options().then(
      (o) => setGoogleOn(o.google),
      () => setGoogleOn(false),
    );
  }, []);
  const googleError = googleErrors[params.get("error") ?? ""];

  // Countdown for "Resend code".
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  async function sendCode(event?: FormEvent) {
    event?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await authApi.requestCode(email);
      setCode("");
      setStep("code");
      setResendIn(RESEND_SECONDS);
    } catch (e) {
      const apiError = e instanceof ApiError ? e : new ApiError("UNKNOWN", "Something went wrong. Please try again.", 0);
      // The previous code is still valid: go to the code step anyway.
      if (apiError.code === "WAIT_BEFORE_RESEND" && step === "email") {
        setStep("code");
        setResendIn(apiError.retryAfterSeconds ?? RESEND_SECONDS);
      } else {
        setError(apiError);
        if (apiError.retryAfterSeconds) setResendIn(apiError.retryAfterSeconds);
      }
    } finally {
      setBusy(false);
    }
  }

  async function verify(event?: FormEvent) {
    event?.preventDefault();
    if (code.length !== 6) {
      setError(new ApiError("CODE_INCOMPLETE", "Please enter all 6 digits.", 400));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      let { user } = await authApi.verifyCode(email, code);
      // Save the name typed on the sign-up form.
      if (mode === "signup" && name.trim() && !user.name) {
        ({ user } = await authApi.updateProfile({ name: name.trim() }));
      }
      // The effect above moves on once the session updates.
      setSignedIn(user);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError("UNKNOWN", "Something went wrong. Please try again.", 0));
      setBusy(false);
    }
  }

  const otherMode =
    mode === "login"
      ? { text: "New here?", link: "Create an account", href: "/signup" }
      : { text: "Already have an account?", link: "Log in", href: "/login" };
  const otherHref = params.get("next") ? `${otherMode.href}?next=${encodeURIComponent(next)}` : otherMode.href;

  const errorBox = error && (
    <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
      {error.message}
      {error.code === "CODE_WRONG" && error.attemptsLeft !== undefined && ` ${error.attemptsLeft} tries left.`}
    </p>
  );

  if (step === "code") {
    return (
      <div className="flex w-full max-w-[440px] flex-col gap-6">
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setError(null);
          }}
          className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded border-0 bg-transparent p-0 font-sans text-[15px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
        >
          <ArrowRightIcon className="rotate-180" />
          Back
        </button>

        <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-peach">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <Eyebrow>Check your email</Eyebrow>
          <h1 className="m-0 font-serif text-[clamp(40px,5vw,52px)] font-medium leading-[1.02]">Enter the 6-digit code.</h1>
          <p className="m-0 text-ink-soft">
            We sent a code to <strong className="font-semibold text-ink">{email}</strong>. It expires in 10 minutes.
          </p>
        </div>

        <form onSubmit={verify} className="flex flex-col gap-4.5">
          <CodeInput value={code} onChange={setCode} disabled={busy} invalid={error?.code === "CODE_WRONG"} />
          {errorBox}
          <button type="submit" disabled={busy} className={buttonClass("dark", "w-full cursor-pointer border-0 font-sans disabled:opacity-60")}>
            {busy ? "Checking…" : "Verify and continue"}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-ink-soft">
          <span>Didn&apos;t get it? Check your spam folder.</span>
          {resendIn > 0 ? (
            <span>
              Resend code in <strong className="font-semibold text-ink">0:{String(resendIn).padStart(2, "0")}</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => sendCode()}
              disabled={busy}
              className="min-h-11 cursor-pointer rounded border-0 bg-transparent p-0 font-sans text-sm font-semibold text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
            >
              Resend code
            </button>
          )}
        </div>
        <div className="rounded-2xl bg-cream px-4 py-3.5 text-sm text-ink-soft">
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError(null);
            }}
            className="cursor-pointer rounded border-0 bg-transparent p-0 font-sans text-sm font-semibold text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
          >
            Change email address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-6">
      {session.status === "signed-out" && session.reason === "elsewhere" && (
        <p role="status" className="m-0 rounded-2xl border border-line bg-cream p-4 text-[15px] text-ink">
          You were logged out because your account was used on another device. Log in again to continue here.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Eyebrow>{mode === "login" ? "Log in" : "Sign up"}</Eyebrow>
        <h1 className="m-0 font-serif text-[clamp(44px,5vw,56px)] font-medium leading-none">
          {mode === "login" ? "Welcome back." : "Create your account."}
        </h1>
        <p className="m-0 text-ink-soft">
          {mode === "login"
            ? "Enter your email and we will send you a one-time code. No password needed."
            : "Takes under a minute. We will email you a one-time code. No password needed."}
        </p>
      </div>

      {googleError && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {googleError}
        </p>
      )}

      {googleOn && (
        <>
          <a
            href={`/api/auth/google?next=${encodeURIComponent(next)}`}
            className={buttonClass("outline", "w-full gap-3 bg-white font-sans")}
          >
            <GoogleIcon />
            Continue with Google
          </a>
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <span className="h-px flex-1 bg-sand" />
            or use your email
            <span className="h-px flex-1 bg-sand" />
          </div>
        </>
      )}

      <form onSubmit={sendCode} className="flex flex-col gap-4">
        {mode === "signup" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-name" className="text-sm font-semibold">
              Full name
            </label>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-email" className="text-sm font-semibold">
            Email address
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className={fieldClass}
          />
        </div>
        {errorBox}
        <button type="submit" disabled={busy} className={buttonClass("dark", "w-full cursor-pointer border-0 font-sans disabled:opacity-60")}>
          {busy ? "Sending…" : "Send code"}
          {!busy && <ArrowRightIcon />}
        </button>
      </form>

      <div className="h-px bg-sand" />
      <p className="m-0 text-[15px] text-ink-soft">
        {otherMode.text}{" "}
        <Link href={otherHref} className="font-semibold text-ink underline underline-offset-4">
          {otherMode.link}
        </Link>
      </p>
      <p className="m-0 text-xs text-ink-soft">
        One account works on one device at a time. By continuing you agree to our{" "}
        <Link href="/terms" className="text-ink underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-ink underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
