"use client";

import { useEffect, useState } from "react";
import AdminShell, { adminErrorMessage, adminUi } from "@/components/admin/AdminShell";
import { type AuditEntry, formatIstDateTime, manageApi, productLabel } from "@/lib/admin";
import { formatPaise } from "@/lib/payments";

/** Plain words for each logged action. */
function describe(e: AuditEntry): string {
  const d = (e.details ?? {}) as Record<string, string | number | null | string[]>;
  switch (e.action) {
    case "order.refund":
      return `Refunded ${formatPaise(Number(d.amountPaise))} to ${d.buyer}${d.reason ? ` (${d.reason})` : ""}`;
    case "access.grant":
      return `Gave ${productLabel(String(d.product))} to ${d.email}${d.newAccount ? " (new account)" : ""}: ${d.note}`;
    case "access.end":
      return `Ended ${productLabel(String(d.product))} for ${d.email}`;
    case "promo.create":
      return `Created code ${d.code}`;
    case "promo.enable":
      return `Switched on code ${d.code}`;
    case "promo.disable":
      return `Switched off code ${d.code}`;
    case "webinar.create":
      return `Scheduled webinar “${d.title}”`;
    case "webinar.update":
      return `Edited a webinar (${Array.isArray(d.changed) ? d.changed.join(", ") : ""})`;
    case "webinar.cancel":
      return "Cancelled a webinar";
    default:
      return e.action;
  }
}

/** Admin: who did what, newest first. Entries can't be changed. */
export default function AdminActivity() {
  return (
    <AdminShell
      title="Activity log"
      intro="Every refund, manual access, promo code and webinar change, with who did it and when. Entries can't be edited or deleted."
    >
      <ActivityContent />
    </AdminShell>
  );
}

function ActivityContent() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ total: number; pageSize: number; entries: AuditEntry[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    manageApi.audit(page).then(setData, (e: unknown) => setError(adminErrorMessage(e)));
  }, [page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <section aria-label="Activity" className="flex flex-col gap-4">
      {error && (
        <p role="alert" className={adminUi.error}>
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-3xl border border-line bg-white">
        <table className={`${adminUi.table} min-w-[640px]`}>
          <thead>
            <tr className="border-b border-line text-[13px] text-ink-soft">
              <th scope="col" className={adminUi.th}>When (IST)</th>
              <th scope="col" className={adminUi.th}>Who</th>
              <th scope="col" className={adminUi.th}>What</th>
            </tr>
          </thead>
          <tbody>
            {data?.entries.map((e) => (
              <tr key={e.id} className="border-b border-line align-top last:border-0">
                <td className={`${adminUi.td} whitespace-nowrap`}>{formatIstDateTime(e.createdAt)}</td>
                <td className={adminUi.td}>{e.actor}</td>
                <td className={adminUi.td}>{describe(e)}</td>
              </tr>
            ))}
            {data && data.entries.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                  Nothing yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data && data.total > data.pageSize && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className={`${adminUi.smallButton()} bg-white`}
          >
            Newer
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`${adminUi.smallButton()} bg-white`}
          >
            Older
          </button>
        </div>
      )}
    </section>
  );
}
