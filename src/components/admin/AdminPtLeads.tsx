"use client";

import { useEffect, useState } from "react";
import { adminUi } from "@/components/admin/AdminShell";
import {
  adminApi,
  type AdminPtLeadPage,
  downloadCsv,
  formatIstDateTime,
  type LeadStatus,
  leadStatusLabel,
  manageApi,
} from "@/lib/admin";

const statuses = Object.keys(leadStatusLabel) as LeadStatus[];

const statusStyle: Record<LeadStatus, string> = {
  NEW: "bg-peach",
  CONTACTED: "bg-sand",
  BOUGHT: "bg-ink text-white",
  NOT_INTERESTED: "border border-line",
};

/** Admin: personal coaching applications, with the team's status for each. */
export default function AdminPtLeads({ onError }: { onError: (e: unknown) => void }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<LeadStatus | "">("");
  const [reload, setReload] = useState(0);
  const [loaded, setLoaded] = useState<{ key: string; data: AdminPtLeadPage } | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const key = `${page}|${filter}|${reload}`;
  const result = loaded?.data ?? null;
  const loading = loaded?.key !== key;
  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;

  useEffect(() => {
    let current = true;
    const k = `${page}|${filter}|${reload}`;
    adminApi.ptLeads(page, filter || undefined).then((data) => {
      if (current) setLoaded({ key: k, data });
    }, onError);
    return () => {
      current = false;
    };
  }, [page, filter, reload, onError]);

  async function setStatus(id: string, status: LeadStatus) {
    setSaving(id);
    try {
      await manageApi.setLeadStatus(id, status);
      setReload((r) => r + 1);
    } catch (e) {
      onError(e);
    }
    setSaving(null);
  }

  async function download() {
    setDownloading(true);
    try {
      const { leads } = await manageApi.exportLeads();
      downloadCsv(`coaching-applications-${new Date().toISOString().slice(0, 10)}.csv`, [
        ["Applied (IST)", "Name", "Email", "Phone", "Age", "Height (cm)", "Weight (kg)", "Wants to improve", "Status"],
        ...leads.map((l) => [
          formatIstDateTime(l.createdAt),
          l.name,
          l.email,
          l.phone,
          l.age,
          l.heightCm,
          l.weightKg,
          l.improve.join(", "),
          leadStatusLabel[l.status],
        ]),
      ]);
    } catch (e) {
      onError(e);
    }
    setDownloading(false);
  }

  return (
    <section id="pt-leads" aria-labelledby="admin-pt-leads" className="flex scroll-mt-6 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="admin-pt-leads" className={adminUi.sectionTitle}>
            Coaching applications
          </h2>
          <p className="m-0 text-sm text-ink-soft">
            Saved when someone sends the &ldquo;Apply for personal coaching&rdquo; form, even if they never send the
            WhatsApp message. Set the status as your team works on each one.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-filter" className={adminUi.label}>
              Show
            </label>
            <select
              id="lead-filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as LeadStatus | "");
                setPage(1);
              }}
              className={`${adminUi.input} w-[200px]`}
            >
              <option value="">All applications</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {leadStatusLabel[s]}
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={download} disabled={downloading} className={`${adminUi.smallButton()} bg-white`}>
            {downloading ? "Preparing…" : "Download all (CSV)"}
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-3xl border border-line bg-white">
        <table className={`${adminUi.table} min-w-[980px]`}>
          <thead>
            <tr className="border-b border-line text-[13px] text-ink-soft">
              <th scope="col" className={adminUi.th}>Applied</th>
              <th scope="col" className={adminUi.th}>Name</th>
              <th scope="col" className={adminUi.th}>Email</th>
              <th scope="col" className={adminUi.th}>Phone</th>
              <th scope="col" className={adminUi.th}>Age · height · weight</th>
              <th scope="col" className={adminUi.th}>Wants to improve</th>
              <th scope="col" className={adminUi.th}>Status</th>
            </tr>
          </thead>
          <tbody aria-busy={loading}>
            {result?.leads.map((l) => (
              <tr key={l.id} className="border-b border-line align-top last:border-0">
                <td className={`${adminUi.td} whitespace-nowrap`}>{formatIstDateTime(l.createdAt)}</td>
                <td className={`${adminUi.td} font-semibold`}>{l.name}</td>
                <td className={`${adminUi.td} break-all`}>{l.email}</td>
                <td className={`${adminUi.td} whitespace-nowrap`}>{l.phone ?? <span className="text-ink-soft">—</span>}</td>
                <td className={`${adminUi.td} whitespace-nowrap`}>
                  {l.age} yrs · {l.heightCm} cm · {l.weightKg} kg
                </td>
                <td className={adminUi.td}>{l.improve.join(", ")}</td>
                <td className={adminUi.td}>
                  <label className="sr-only" htmlFor={`lead-${l.id}`}>
                    Status for {l.name}
                  </label>
                  <select
                    id={`lead-${l.id}`}
                    value={l.status}
                    disabled={saving === l.id}
                    onChange={(e) => setStatus(l.id, e.target.value as LeadStatus)}
                    className={`min-h-11 cursor-pointer rounded-full px-3 font-sans text-sm font-semibold ${statusStyle[l.status]}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {leadStatusLabel[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {result && result.leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-soft">
                  {filter ? `No applications marked “${leadStatusLabel[filter]}”.` : "No applications yet."}
                </td>
              </tr>
            )}
            {!result && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-soft">
                  Loading applications…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result && result.total > result.pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
          <span role="status">
            {result.total} applications · page {result.page} of {totalPages}
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
  );
}
