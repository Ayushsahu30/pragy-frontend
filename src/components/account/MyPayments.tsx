"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { accountApi, formatDate, type OrderListItem } from "@/lib/account";
import { formatPaise } from "@/lib/payments";

/** Dashboard section: every payment, with a link to its receipt. */
export default function MyPayments({ sectionTitle }: { sectionTitle: string }) {
  const [orders, setOrders] = useState<OrderListItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    accountApi.orders().then(
      (r) => setOrders(r.orders),
      () => setFailed(true),
    );
  }, []);

  return (
    <section id="payments" aria-labelledby="dash-payments" className="flex scroll-mt-6 flex-col gap-4">
      <h2 id="dash-payments" className={sectionTitle}>
        Payments &amp; receipts
      </h2>
      {failed ? (
        <p className="m-0 text-[15px] text-ink-soft">We couldn&apos;t load your payments. Please reload the page.</p>
      ) : !orders ? (
        <p className="m-0 text-[15px] text-ink-soft">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-field bg-white px-6 py-8 text-center">
          <h3 className="m-0 font-serif text-[26px] font-medium">No payments yet</h3>
          <p className="m-0 text-[15px] text-ink-soft">Receipts for everything you buy will appear here.</p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col overflow-hidden rounded-3xl border border-line bg-white p-0">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-5 py-4 last:border-0">
              <div className="min-w-0">
                <p className="m-0 font-semibold">{o.item}</p>
                <p className="m-0 text-sm text-ink-soft">{o.paidAt ? formatDate(o.paidAt) : "—"}</p>
              </div>
              <div className="flex items-center gap-4">
                {o.status === "REFUNDED" && <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold">Refunded</span>}
                <span className="font-semibold tabular-nums">{formatPaise(o.amountPaise)}</span>
                <Link
                  href={`/account/receipts/${encodeURIComponent(o.id)}`}
                  className="text-sm font-semibold text-ink underline underline-offset-4"
                >
                  Receipt
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
