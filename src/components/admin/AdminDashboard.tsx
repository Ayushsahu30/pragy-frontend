"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClass, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";
import { adminApi, type AdminOverview, type AdminUserPage } from "@/lib/admin";
import { ApiError } from "@/lib/auth";
import { refreshSession, signOut, useSession } from "@/lib/session";

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#users", label: "Users" },
];

const date = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const formatDate = (iso: string | null) => (iso ? date.format(new Date(iso)) : "—");

const badge = "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold";

/**
 * The admin area. This page only shows what the backend returns: every
 * /admin call is checked on the server, so hiding this page is not the lock.
 */
export default function AdminDashboard() {
  const router = useRouter();
  const session = useSession();
  const isAdmin = session.status === "signed-in" && session.user.role === "ADMIN";

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // search, applied after typing stops
  const [page, setPage] = useState(1);
  // The last loaded page, with the search and page it belongs to.
  const [loaded, setLoaded] = useState<{ key: string; data: AdminUserPage } | null>(null);
  const key = `${query}|${page}`;
  const result = loaded?.data ?? null;
  const loading = loaded?.key !== key;
  const [error, setError] = useState("");

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent("/admin")}`);
  }, [session.status, router]);

  /** Login ended or role removed: update the page's idea of who is logged in. */
  function handleError(e: unknown) {
    if (e instanceof ApiError && ["NOT_SIGNED_IN", "SIGNED_IN_ELSEWHERE", "NOT_ADMIN"].includes(e.code)) {
      void refreshSession();
      return;
    }
    setError(e instanceof ApiError ? e.message : "Something went wrong. Please reload the page.");
  }

  useEffect(() => {
    if (!isAdmin) return;
    adminApi.overview().then(setOverview, handleError);
  }, [isAdmin]);

  // Wait until typing stops before searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!isAdmin) return;
    let current = true;
    adminApi.users(query, page).then((data) => {
      if (current) setLoaded({ key: `${query}|${page}`, data });
    }, handleError);
    return () => {
      current = false;
    };
  }, [isAdmin, query, page]);

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

  const { user } = session;
  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;

  async function logOut() {
    await signOut();
    router.replace("/");
  }

  const stats: [string, number | undefined][] = [
    ["Total users", overview?.totalUsers],
    ["New this week", overview?.newThisWeek],
    ["Agreed to tips & offers", overview?.marketingOptIns],
    ["Profile not finished", overview?.profileMissing],
    ["Admins", overview?.admins],
  ];

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
            {navItems.map((item, index) => (
              <li key={item.href} className="flex-none">
                <a
                  href={item.href}
                  className={`flex min-h-[46px] items-center whitespace-nowrap rounded-[14px] px-3.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach ${
                    index === 0 ? "bg-[#5a4c40] font-semibold text-white" : "text-[#e9e1d8] hover:bg-[#5a4c40]"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
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
        <section id="overview" aria-labelledby="admin-title" className="flex scroll-mt-6 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Eyebrow>Admin</Eyebrow>
            <h1 id="admin-title" className="m-0 font-serif text-[clamp(42px,4.6vw,60px)] font-medium leading-none">
              Hello, {(user.name ?? "").trim().split(/\s+/)[0] || "admin"}.
            </h1>
            <p className="m-0 text-ink-soft">Sales, orders, bookings and webinars will appear here as they are built.</p>
          </div>
          {error && (
            <p role="alert" className="m-0 rounded-2xl bg-white p-3.5 text-sm text-rust-dark">
              {error}
            </p>
          )}
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
            {stats.map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse rounded-[20px] border border-line bg-white px-4 py-3.5">
                <dt className="text-[13px] text-ink-soft">{label}</dt>
                <dd className="m-0 font-serif text-[36px] font-semibold leading-none">{value ?? "…"}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="users" aria-labelledby="admin-users" className="flex scroll-mt-6 flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="admin-users" className="m-0 font-serif text-[clamp(32px,3.4vw,40px)] font-medium leading-[1.1]">
              Users
            </h2>
            <div className="flex w-full max-w-[360px] flex-col gap-1.5">
              <label htmlFor="admin-search" className="text-sm font-semibold">
                Search by email, name or phone
              </label>
              <input
                id="admin-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                maxLength={100}
                placeholder="e.g. gmail.com or 98765"
                className="h-[48px] w-full rounded-[14px] border border-field bg-white px-4 font-sans text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rust"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-line bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[13px] text-ink-soft">
                  <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Phone</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Joined</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Last login</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody aria-busy={loading}>
                {result?.users.map((u) => (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold">{u.name ?? <span className="font-normal text-ink-soft">Not given</span>}</td>
                    <td className="break-all px-4 py-3">{u.email}</td>
                    <td className="whitespace-nowrap px-4 py-3">{u.phone ?? <span className="text-ink-soft">—</span>}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(u.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(u.lastLoginAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {u.role === "ADMIN" && <span className={`${badge} bg-ink text-white`}>Admin</span>}
                        {u.google && <span className={`${badge} bg-sand`}>Google</span>}
                        {u.marketingConsent && <span className={`${badge} bg-peach`}>Tips & offers</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {result && result.users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                      {query ? `No users match “${query}”.` : "No users yet."}
                    </td>
                  </tr>
                )}
                {!result && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                      Loading users…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {result && result.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
              <span role="status">
                {result.total} {result.total === 1 ? "user" : "users"}
                {query && ` matching “${query}”`} · page {result.page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className={buttonClass("outline", "min-h-11 cursor-pointer bg-white px-4 font-sans disabled:cursor-default disabled:opacity-40")}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className={buttonClass("outline", "min-h-11 cursor-pointer bg-white px-4 font-sans disabled:cursor-default disabled:opacity-40")}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
