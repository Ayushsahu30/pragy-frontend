"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { adminApi, type AdminPtLeadPage } from "@/lib/admin";

const date = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

/** Admin: personal coaching applications from the "Apply" form, newest first. */
export default function AdminPtLeads({ onError }: { onError: (e: unknown) => void }) {
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState<{ page: number; data: AdminPtLeadPage } | null>(null);
  const result = loaded?.data ?? null;
  const loading = loaded?.page !== page;
  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;

  useEffect(() => {
    let current = true;
    adminApi.ptLeads(page).then((data) => {
      if (current) setLoaded({ page, data });
    }, onError);
    return () => {
      current = false;
    };
  }, [page, onError]);

  return (
    <section id="pt-leads" aria-labelledby="admin-pt-leads" className="flex scroll-mt-6 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="admin-pt-leads" className="m-0 font-serif text-[clamp(32px,3.4vw,40px)] font-medium leading-[1.1]">
          Coaching applications
        </h2>
        <p className="m-0 text-sm text-ink-soft">
          Saved when someone sends the &ldquo;Apply for personal coaching&rdquo; form, even if they never send the
          WhatsApp message.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-line bg-white">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[13px] text-ink-soft">
              <th scope="col" className="px-4 py-3 font-semibold">Applied</th>
              <th scope="col" className="px-4 py-3 font-semibold">Name</th>
              <th scope="col" className="px-4 py-3 font-semibold">Email</th>
              <th scope="col" className="px-4 py-3 font-semibold">Phone</th>
              <th scope="col" className="px-4 py-3 font-semibold">Age · height · weight</th>
              <th scope="col" className="px-4 py-3 font-semibold">Wants to improve</th>
            </tr>
          </thead>
          <tbody aria-busy={loading}>
            {result?.leads.map((l) => (
              <tr key={l.id} className="border-b border-line last:border-0">
                <td className="whitespace-nowrap px-4 py-3">{date.format(new Date(l.createdAt))}</td>
                <td className="px-4 py-3 font-semibold">{l.name}</td>
                <td className="break-all px-4 py-3">{l.email}</td>
                <td className="whitespace-nowrap px-4 py-3">{l.phone ?? <span className="text-ink-soft">—</span>}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {l.age} yrs · {l.heightCm} cm · {l.weightKg} kg
                </td>
                <td className="px-4 py-3">{l.improve.join(", ")}</td>
              </tr>
            ))}
            {result && result.leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No applications yet.
                </td>
              </tr>
            )}
            {!result && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
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
  );
}
