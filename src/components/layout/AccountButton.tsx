import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";

/**
 * Logged out: "Log in" button (login and sign up are the same page, since
 * there are no passwords).
 * Logged in: the user's initial, linking to their dashboard.
 */
export default function AccountButton({ user }: { user: CurrentUser | null }) {
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

  if (!user) {
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

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <Link
      href="/dashboard"
      aria-label={`My account: ${user.name}`}
      className={`inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 text-[15px] font-semibold text-ink no-underline transition-colors hover:border-ink ${focus}`}
    >
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-peach font-serif text-lg font-semibold">
        {initial}
      </span>
      <span className="hidden sm:inline">My account</span>
    </Link>
  );
}
