"use client";

import Link from "next/link";
import { useSession } from "@/lib/session";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/**
 * Logged out: "Log in / Sign up". Logged in: the user's initial and "My account",
 * linking to the dashboard. While checking, an empty space of the same size
 * so the header does not jump.
 */
export default function AccountButton() {
  const session = useSession();

  if (session.status === "loading") {
    return <span aria-hidden="true" className="inline-block h-12 w-[84px] sm:w-[150px]" />;
  }

  if (session.status === "signed-out") {
    return (
      <Link
        href="/login"
        className={`inline-flex min-h-[48px] items-center justify-center rounded-full border border-ink px-5 text-[15px] font-semibold text-ink no-underline transition-colors hover:bg-white ${focus}`}
      >
        <span className="sm:hidden">Log in</span>
        <span className="hidden sm:inline">Log in / Sign up</span>
      </Link>
    );
  }

  const { user } = session;
  const label = user.name || user.email;
  const initial = label.trim().charAt(0).toUpperCase() || "?";

  return (
    <Link
      href="/dashboard"
      aria-label={`My account: ${label}`}
      className={`inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-1.5 text-[15px] font-semibold text-ink no-underline transition-colors hover:border-ink sm:pr-4 ${focus}`}
    >
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-peach font-serif text-lg font-semibold">
        {initial}
      </span>
      <span className="hidden sm:inline">My account</span>
    </Link>
  );
}
