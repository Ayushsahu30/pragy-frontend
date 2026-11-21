"use client";

import { useEffect, useState } from "react";
import { adminUi } from "@/components/admin/AdminShell";
import { manageApi, type SalesReport } from "@/lib/admin";
import { formatPaise } from "@/lib/payments";

const dayLabel = (date: string) =>
  new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );

/** Admin: paid sales by product and by day (refunds not counted), in Indian time. */
export default function AdminSales({ onError }: { onError: (e: unknown) => void }) {
  const [days, setDays] = useState(30);
  const [report, setReport] = useState<SalesReport | null>(null);

  useEffect(() => {
    let current = true;
    manageApi.sales(days).then((r) => current && setReport(r), onError);
    return () => {
      current = false;
    };
  }, [days, onError]);

  const salesDays = report ? [...report.byDay].reverse().filter((d) => d.count > 0) : [];

  return (
    <section aria-labelledby="admin-sales" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="admin-sales" className={adminUi.sectionTitle}>
            Sales
          </h2>
          <p className="m-0 text-sm text-ink-soft">
            {report
              ? `${formatPaise(report.totalPaise)} from ${report.count} paid ${report.count === 1 ? "order" : "orders"}. Refunded orders are not counted; manual orders are.`
              : "Loading…"}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sales-days" className={adminUi.label}>
            Period
          </label>
          <select
            id="sales-days"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className={`${adminUi.input} w-[200px]`}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 12 months</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-x-auto rounded-3xl border border-line bg-white">
          <table className={adminUi.table}>
            <caption className="px-4 pt-4 text-left text-sm font-semibold">By product</caption>
            <thead>
              <tr className="border-b border-line text-[13px] text-ink-soft">
                <th scope="col" className={adminUi.th}>Product</th>
                <th scope="col" className={`${adminUi.th} text-right`}>Orders</th>
                <th scope="col" className={`${adminUi.th} text-right`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {report?.byProduct.map((p) => (
                <tr key={p.slug} className="border-b border-line last:border-0">
                  <td className={adminUi.td}>{p.name}</td>
                  <td className={`${adminUi.td} text-right tabular-nums`}>{p.count}</td>
                  <td className={`${adminUi.td} text-right font-semibold tabular-nums`}>{formatPaise(p.paise)}</td>
                </tr>
              ))}
              {report && report.byProduct.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-soft">
                    No sales in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="relative max-h-[420px] overflow-auto rounded-3xl border border-line bg-white">
          <table className={adminUi.table}>
            <caption className="px-4 pt-4 text-left text-sm font-semibold">By day (days with sales)</caption>
            <thead>
              <tr className="border-b border-line text-[13px] text-ink-soft">
                <th scope="col" className={adminUi.th}>Day</th>
                <th scope="col" className={`${adminUi.th} text-right`}>Orders</th>
                <th scope="col" className={`${adminUi.th} text-right`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesDays.map((d) => (
                <tr key={d.date} className="border-b border-line last:border-0">
                  <td className={`${adminUi.td} whitespace-nowrap`}>{dayLabel(d.date)}</td>
                  <td className={`${adminUi.td} text-right tabular-nums`}>{d.count}</td>
                  <td className={`${adminUi.td} text-right font-semibold tabular-nums`}>{formatPaise(d.paise)}</td>
                </tr>
              ))}
              {report && salesDays.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-soft">
                    No sales in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
