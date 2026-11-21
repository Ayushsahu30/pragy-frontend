"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { buttonClass, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";
import { ApiError } from "@/lib/auth";
import { refreshSession, signOut, useSession } from "@/lib/session";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders & refunds" },
  { href: "/admin/webinars", label: "Webinars" },
  { href: "/admin/promo-codes", label: "Promo codes" },
  { href: "/admin/access", label: "Manual access" },
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

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [session.status, router, pathname]);

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
