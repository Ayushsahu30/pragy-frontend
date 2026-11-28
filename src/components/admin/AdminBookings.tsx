"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminShell, { adminErrorMessage, adminUi } from "@/components/admin/AdminShell";
import { type AdminBooking, downloadCsv, formatIstDateTime, manageApi } from "@/lib/admin";
import { callNames } from "@/lib/calls";
import { formatPaise } from "@/lib/payments";

type When = "upcoming" | "past" | "attention";

const tabs: { id: When; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "attention", label: "Needs a new time" },
  { id: "past", label: "Past & cancelled" },
];

/** Admin: paid calls booked through Cal.com. */
export default function AdminBookings() {
  return (
    <AdminShell
      title="Bookings"
      intro="Paid discovery calls and consultations. They are also in Pragy's Google Calendar and on Cal.com. To move or cancel a call, do it in Cal.com; this list follows. Refund a discovery call in Orders & refunds."
    >
      <BookingsContent />
    </AdminShell>
  );
}

function BookingsContent() {
  const [when, setWhen] = useState<When>("upcoming");
  const [loaded, setLoaded] = useState<{ when: When; attention: number; bookings: AdminBooking[] } | null>(null);
  const [error, setError] = useState("");
  const handleError = useCallback((e: unknown) => setError(adminErrorMessage(e)), []);
  const result = loaded?.when === when ? loaded : null;

  useEffect(() => {
    let current = true;
    manageApi.bookings(when).then((r) => current && setLoaded({ ...r, when }), handleError);
    return () => {
      current = false;
    };
  }, [when, handleError]);

  function download() {
    if (!result) return;
    downloadCsv(`bookings-${when}-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["When (IST)", "Call", "Name", "Email", "Phone", "Status", "Paid (₹)", "Meet link"],
      ...result.bookings.map((b) => [
        formatIstDateTime(b.startsAt),
        callNames[b.productSlug],
        b.user.name,
        b.user.email,
        b.user.phone,
        b.order.status === "REFUNDED" ? "Refunded" : b.status,
        b.order.amountPaise / 100,
        b.meetingUrl,
      ]),
    ]);
  }

  return (
    <section aria-label="Bookings" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Which bookings">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={when === t.id}
              onClick={() => setWhen(t.id)}
              className={`min-h-11 cursor-pointer rounded-full border px-4 font-sans text-sm font-semibold ${
                when === t.id ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
              }`}
            >
              {t.label}
              {t.id === "attention" && (loaded?.attention ?? 0) > 0 && (
                <span className="ml-2 rounded-full bg-rust px-2 py-0.5 text-xs text-white">{loaded?.attention}</span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={download}
          disabled={!result || result.bookings.length === 0}
          className={`${adminUi.smallButton()} bg-white`}
        >
          Download (CSV)
        </button>
      </div>

      {when === "attention" && (
        <p className="m-0 text-sm text-ink-soft">
          These people paid, but their time was taken before the booking. They see &ldquo;Pick a new time&rdquo; in My
          account. If they don&apos;t, message them; a discovery call can also be refunded.
        </p>
      )}

      {error && (
        <p role="alert" className={adminUi.error}>
          {error}
        </p>
      )}

      <div className="relative overflow-x-auto rounded-3xl border border-line bg-white">
        <table className={`${adminUi.table} min-w-[900px]`}>
          <thead>
            <tr className="border-b border-line text-[13px] text-ink-soft">
              <th scope="col" className={adminUi.th}>When (IST)</th>
              <th scope="col" className={adminUi.th}>Call</th>
              <th scope="col" className={adminUi.th}>Customer</th>
              <th scope="col" className={`${adminUi.th} text-right`}>Paid</th>
              <th scope="col" className={adminUi.th}>Status</th>
              <th scope="col" className={adminUi.th}>Meet</th>
            </tr>
          </thead>
          <tbody>
            {result?.bookings.map((b) => (
              <tr key={b.id} className="border-b border-line align-top last:border-0">
                <td className={`${adminUi.td} whitespace-nowrap font-semibold`}>{formatIstDateTime(b.startsAt)}</td>
                <td className={adminUi.td}>{callNames[b.productSlug]}</td>
                <td className={`${adminUi.td} min-w-[220px]`}>
                  <Link
                    href={`/admin/access?email=${encodeURIComponent(b.user.email)}`}
                    className="block font-semibold text-ink underline decoration-line underline-offset-4"
                  >
                    {b.user.name ?? b.user.email}
                  </Link>
                  <span className="block break-all text-ink-soft">{b.user.email}</span>
                  {b.user.phone && <span className="block text-ink-soft">{b.user.phone}</span>}
                </td>
                <td className={`${adminUi.td} whitespace-nowrap text-right tabular-nums`}>
                  {formatPaise(b.order.amountPaise)}
                </td>
                <td className={adminUi.td}>
                  <span
                    className={`${adminUi.badge} ${
                      b.status === "NEEDS_NEW_TIME"
                        ? "bg-rust text-white"
                        : b.status === "CANCELLED" || b.order.status === "REFUNDED"
                          ? "bg-sand"
                          : "bg-peach"
                    }`}
                  >
                    {b.order.status === "REFUNDED"
                      ? "Refunded"
                      : b.status === "NEEDS_NEW_TIME"
                        ? "Needs a new time"
                        : b.status === "CANCELLED"
                          ? "Cancelled"
                          : "Booked"}
                  </span>
                </td>
                <td className={adminUi.td}>
                  {b.meetingUrl && b.status === "BOOKED" ? (
                    <a
                      href={b.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink underline underline-offset-4"
                    >
                      Open
                    </a>
                  ) : (
                    <span className="text-ink-soft">—</span>
                  )}
                </td>
              </tr>
            ))}
            {result && result.bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  {when === "attention" ? "Nothing needs attention." : "No bookings here yet."}
                </td>
              </tr>
            )}
            {!result && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  Loading bookings…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
