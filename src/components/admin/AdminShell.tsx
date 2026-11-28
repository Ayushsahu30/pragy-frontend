"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState, type ReactNode } from "react";
import CodeInput from "@/components/auth/CodeInput";
import { buttonClass, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";
import { adminVerifyApi } from "@/lib/admin";
import { ApiError } from "@/lib/auth";
import { refreshSession, signOut, useSession } from "@/lib/session";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders & refunds" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/webinars", label: "Webinars" },
  { href: "/admin/promo-codes", label: "Promo codes" },
  { href: "/admin/access", label: "People & access" },
  { href: "/admin/activity", label: "Activity log" },
];

/** Shared look for admin forms and tables. */
export const adminUi = {
  sectionTitle: "m-0 font-serif text-[clamp(32px,3.4vw,40px)] font-medium leading-[1.1]",
  card: "rounded-3xl border border-line bg-white p-6",
  label: "text-sm font-semibold",
  input:
    "h-[48px] w-full rounded-[14px] border border-field bg-white px-4 font-sans text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rust",
  table: "w-full border-collapse text-left text-sm",
  th: "px-4 py-3 font-semibold",
  td: "px-4 py-3",
  badge: "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
  smallButton: (variant: "dark" | "outline" = "outline") =>
    buttonClass(variant, "min-h-11 cursor-pointer px-4 font-sans disabled:cursor-default disabled:opacity-40"),
  error: "m-0 rounded-2xl bg-white p-3.5 text-sm text-rust-dark",
  success: "m-0 rounded-2xl bg-peach p-3.5 text-sm text-ink",
};

/**
 * Turns an admin API error into a message. When the login ended or the admin
 * role was removed, the session is refreshed instead (the shell then shows the
 * right screen).
 */
export function adminErrorMessage(e: unknown): string {
  if (e instanceof ApiError && ["NOT_SIGNED_IN", "SIGNED_IN_ELSEWHERE", "NOT_ADMIN"].includes(e.code)) {
    void refreshSession();
    return "";
  }
  // The 12-hour admin check ran out: reload, and the code screen shows again.
  if (e instanceof ApiError && e.code === "ADMIN_VERIFY_REQUIRED") {
    window.location.reload();
    return "";
  }
  return e instanceof ApiError ? e.message : "Something went wrong. Please reload the page.";
}

/**
 * Frame for every admin page: checks the admin role (the backend checks it
 * again on every call) and shows the admin menu.
 */
export default function AdminShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const isAdmin = session.status === "signed-in" && session.user.role === "ADMIN";
  // The extra check: has this login confirmed an emailed code (lasts 12 hours)?
  const [verify, setVerify] = useState<{ verified: boolean; email: string } | null>(null);

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [session.status, router, pathname]);

  useEffect(() => {
    if (!isAdmin) return;
    adminVerifyApi.status().then(setVerify, (e: unknown) => {
      adminErrorMessage(e);
    });
  }, [isAdmin]);

  if (session.status !== "signed-in") {
    return (
      <main id="main" className="flex min-h-dvh items-center justify-center bg-cream">
        <p className="m-0 text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <Eyebrow>Admin</Eyebrow>
        <h1 className="m-0 font-serif text-[clamp(36px,4vw,48px)] font-medium leading-none">This page is for admins only.</h1>
        <Link href="/dashboard" className={buttonClass("dark", "min-h-[50px] px-5")}>
          Go to my account
        </Link>
      </main>
    );
  }

  if (!verify) {
    return (
      <main id="main" className="flex min-h-dvh items-center justify-center bg-cream">
        <p className="m-0 text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (!verify.verified) {
    return <VerifyScreen email={verify.email} onVerified={() => setVerify({ ...verify, verified: true })} />;
  }

  async function logOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <aside className="flex flex-col gap-6 bg-ink px-6 py-6 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-[280px] lg:flex-none lg:gap-8 lg:py-8">
        <div className="flex items-baseline gap-3">
          <Link
            href="/"
            className="w-fit rounded font-serif text-[30px] font-semibold leading-none text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
          >
            {site.name}
          </Link>
          <span className="rounded-full bg-peach px-2.5 py-0.5 text-xs font-semibold text-ink">Admin</span>
        </div>
        <nav aria-label="Admin">
          <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 text-[15px] lg:flex-col">
            {navItems.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.href} className="flex-none">
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex min-h-[46px] items-center whitespace-nowrap rounded-[14px] px-3.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach ${
                      current ? "bg-[#5a4c40] font-semibold text-white" : "text-[#e9e1d8] hover:bg-[#5a4c40]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-3 border-t border-[#5a4c40] pt-5 lg:mt-auto lg:flex-col lg:items-stretch">
          <Link href="/dashboard" className={buttonClass("outlineLight", "min-h-[50px] px-5")}>
            My account
          </Link>
          <button
            type="button"
            onClick={logOut}
            className="min-h-11 cursor-pointer rounded border-0 bg-transparent p-0 text-left font-sans text-[15px] text-[#e9e1d8] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
          >
            Log out
          </button>
        </div>
      </aside>

      <main id="main" className="flex min-w-0 flex-1 flex-col gap-9 px-[clamp(20px,4vw,56px)] pb-20 pt-10">
        <div className="flex flex-col gap-2">
          <Eyebrow>Admin</Eyebrow>
          <h1 className="m-0 font-serif text-[clamp(42px,4.6vw,60px)] font-medium leading-none">{title}</h1>
          {intro && <p className="m-0 max-w-[720px] text-ink-soft">{intro}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}

/**
 * "Confirm it's you": the admin area opens only after a code emailed to the
 * admin's own address. It lasts 12 hours on this device.
 */
function VerifyScreen({ email, onVerified }: { email: string; onVerified: () => void }) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    setBusy(true);
    setError("");
    try {
      await adminVerifyApi.request();
      setSent(true);
    } catch (e) {
      setError(adminErrorMessage(e));
    }
    setBusy(false);
  }

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length !== 6) return;
    setBusy(true);
    setError("");
    try {
      await adminVerifyApi.confirm(code);
      onVerified();
      return;
    } catch (e) {
      setError(adminErrorMessage(e));
      setCode("");
    }
    setBusy(false);
  }

  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-cream px-6 py-12">
      <div className="flex w-full max-w-[440px] flex-col gap-5">
        <Eyebrow>Admin</Eyebrow>
        <h1 className="m-0 font-serif text-[clamp(36px,4vw,48px)] font-medium leading-none">Confirm it&apos;s you.</h1>
        <p className="m-0 text-[15px] text-ink-soft">
          For safety, the admin area needs a code we email to <strong className="text-ink">{email}</strong>. It stays
          open on this device for 12 hours.
        </p>
        {sent ? (
          <form onSubmit={confirm} className="flex flex-col gap-4">
            <CodeInput value={code} onChange={setCode} disabled={busy} />
            {error && (
              <p role="alert" className="m-0 rounded-2xl bg-white p-3.5 text-sm text-rust-dark">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className={buttonClass("dark", "cursor-pointer border-0 font-sans disabled:opacity-60")}
            >
              {busy ? "Checking…" : "Open the admin area"}
            </button>
            <button
              type="button"
              onClick={send}
              disabled={busy}
              className="min-h-11 cursor-pointer self-start border-0 bg-transparent p-0 font-sans text-sm font-semibold text-ink underline underline-offset-4"
            >
              Send a new code
            </button>
          </form>
        ) : (
          <>
            {error && (
              <p role="alert" className="m-0 rounded-2xl bg-white p-3.5 text-sm text-rust-dark">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={send}
              disabled={busy}
              className={buttonClass("dark", "cursor-pointer border-0 font-sans disabled:opacity-60")}
            >
              {busy ? "Sending…" : "Email me a code"}
            </button>
          </>
        )}
        <Link href="/dashboard" className="text-sm font-semibold text-ink underline underline-offset-4">
          Back to my account
        </Link>
      </div>
    </main>
  );
}
