"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminPtLeads from "@/components/admin/AdminPtLeads";
import AdminSales from "@/components/admin/AdminSales";
import AdminShell, { adminErrorMessage, adminUi } from "@/components/admin/AdminShell";
import { adminApi, type AdminOverview, type AdminUserPage, downloadCsv, formatIstDateTime, manageApi } from "@/lib/admin";
import { formatPaise } from "@/lib/payments";
import { useSession } from "@/lib/session";

const date = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const formatDate = (iso: string | null) => (iso ? date.format(new Date(iso)) : "—");

/**
 * The admin overview: sales and user numbers, the users list and coaching
 * applications. This page only shows what the backend returns: every /admin
 * call is checked on the server, so hiding this page is not the lock.
 */
export default function AdminDashboard() {
  const session = useSession();
  const name = session.status === "signed-in" ? (session.user.name ?? "").trim().split(/\s+/)[0] : "";
  return (
    <AdminShell title={`Hello, ${name || "admin"}.`}>
      <OverviewContent />
    </AdminShell>
  );
}

function OverviewContent() {
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

  const handleError = useCallback((e: unknown) => setError(adminErrorMessage(e)), []);
  const [exporting, setExporting] = useState<"" | "marketing" | "all">("");

  /** Downloads users as a spreadsheet. Each download is recorded in the activity log. */
  async function exportUsers(scope: "marketing" | "all") {
    setExporting(scope);
    try {
      const { users } = await manageApi.exportUsers(scope);
      downloadCsv(`users-${scope === "marketing" ? "agreed-to-messages" : "all"}-${new Date().toISOString().slice(0, 10)}.csv`, [
        ["Name", "Email", "Phone", "Agreed to tips & offers", "Agreed on (IST)", "Joined (IST)", "Last login (IST)"],
        ...users.map((u) => [
          u.name,
          u.email,
          u.phone,
          u.marketingConsent ? "yes" : "no",
          u.marketingConsentAt ? formatIstDateTime(u.marketingConsentAt) : "",
          formatIstDateTime(u.createdAt),
          u.lastLoginAt ? formatIstDateTime(u.lastLoginAt) : "",
        ]),
      ]);
    } catch (e) {
      handleError(e);
    }
    setExporting("");
  }

  useEffect(() => {
    adminApi.overview().then(setOverview, handleError);
  }, [handleError]);

  // Wait until typing stops before searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let current = true;
    adminApi.users(query, page).then((data) => {
      if (current) setLoaded({ key: `${query}|${page}`, data });
    }, handleError);
    return () => {
      current = false;
    };
  }, [query, page, handleError]);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;

  const sales: [string, string, string][] = [
    [
      "Sales this month",
      overview ? formatPaise(overview.salesThisMonthPaise) : "…",
      overview ? `${overview.salesThisMonthCount} paid orders` : "",
    ],
    ["Sales so far", overview ? formatPaise(overview.salesPaise) : "…", overview ? `${overview.salesCount} paid orders` : ""],
  ];
  const stats: [string, number | undefined][] = [
    ["Total users", overview?.totalUsers],
    ["New this week", overview?.newThisWeek],
    ["Agreed to tips & offers", overview?.marketingOptIns],
    ["Profile not finished", overview?.profileMissing],
    ["Admins", overview?.admins],
  ];

  return (
    <>
      <section id="overview" aria-label="Numbers" className="flex scroll-mt-6 flex-col gap-3">
        {error && (
          <p role="alert" className={adminUi.error}>
            {error}
          </p>
        )}
        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
          {sales.map(([label, value, note]) => (
            <div key={label} className="flex flex-col-reverse gap-1 rounded-[20px] border border-ink bg-white px-4 py-3.5">
              <dt className="text-[13px] text-ink-soft">
                {label}
                {note && <span className="block">{note}, refunds not counted</span>}
              </dt>
              <dd className="m-0 font-serif text-[36px] font-semibold leading-none">{value}</dd>
            </div>
          ))}
        </dl>
        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
          {stats.map(([label, value]) => (
            <div key={label} className="flex flex-col-reverse rounded-[20px] border border-line bg-white px-4 py-3.5">
              <dt className="text-[13px] text-ink-soft">{label}</dt>
              <dd className="m-0 font-serif text-[36px] font-semibold leading-none">{value ?? "…"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <AdminSales onError={handleError} />

      <section id="users" aria-labelledby="admin-users" className="flex scroll-mt-6 flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="admin-users" className={adminUi.sectionTitle}>
            Users
          </h2>
          <div className="flex w-full max-w-[360px] flex-col gap-1.5">
            <label htmlFor="admin-search" className={adminUi.label}>
              Search by email, name or phone
            </label>
            <input
              id="admin-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              maxLength={100}
              placeholder="e.g. gmail.com or 98765"
              className={adminUi.input}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-soft">Download users (CSV):</span>
          <button
            type="button"
            onClick={() => exportUsers("marketing")}
            disabled={exporting !== ""}
            className={`${adminUi.smallButton()} bg-white`}
          >
            {exporting === "marketing" ? "Preparing…" : "Agreed to tips & offers (for messages)"}
          </button>
          <button
            type="button"
            onClick={() => exportUsers("all")}
            disabled={exporting !== ""}
            className={`${adminUi.smallButton()} bg-white`}
          >
            {exporting === "all" ? "Preparing…" : "Everyone (your records only)"}
          </button>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-line bg-white">
          <table className={`${adminUi.table} min-w-[760px]`}>
            <thead>
              <tr className="border-b border-line text-[13px] text-ink-soft">
                <th scope="col" className={adminUi.th}>Name</th>
                <th scope="col" className={adminUi.th}>Email</th>
                <th scope="col" className={adminUi.th}>Phone</th>
                <th scope="col" className={adminUi.th}>Joined</th>
                <th scope="col" className={adminUi.th}>Last login</th>
                <th scope="col" className={adminUi.th}>Details</th>
              </tr>
            </thead>
            <tbody aria-busy={loading}>
              {result?.users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className={`${adminUi.td} font-semibold`}>
                    <Link
                      href={`/admin/access?email=${encodeURIComponent(u.email)}`}
                      className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
                    >
                      {u.name ?? <span className="font-normal text-ink-soft">Not given</span>}
                    </Link>
                  </td>
                  <td className={`${adminUi.td} break-all`}>{u.email}</td>
                  <td className={`${adminUi.td} whitespace-nowrap`}>{u.phone ?? <span className="text-ink-soft">—</span>}</td>
                  <td className={`${adminUi.td} whitespace-nowrap`}>{formatDate(u.createdAt)}</td>
                  <td className={`${adminUi.td} whitespace-nowrap`}>{formatDate(u.lastLoginAt)}</td>
                  <td className={adminUi.td}>
                    <div className="flex flex-wrap gap-1.5">
                      {u.role === "ADMIN" && <span className={`${adminUi.badge} bg-ink text-white`}>Admin</span>}
                      {u.addedByAdmin && <span className={`${adminUi.badge} border border-ink`}>Added by admin</span>}
                      {u.google && <span className={`${adminUi.badge} bg-sand`}>Google</span>}
                      {u.marketingConsent && <span className={`${adminUi.badge} bg-peach`}>Tips & offers</span>}
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
                className={`${adminUi.smallButton()} bg-white`}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className={`${adminUi.smallButton()} bg-white`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <AdminPtLeads onError={handleError} />
    </>
  );
}
