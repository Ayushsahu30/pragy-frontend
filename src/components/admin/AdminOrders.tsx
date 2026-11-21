"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminShell, { adminErrorMessage, adminUi } from "@/components/admin/AdminShell";
import { type AdminOrder, type AdminOrderPage, formatIstDateTime, manageApi, productOptions } from "@/lib/admin";
import { formatPaise } from "@/lib/payments";

const statusLabel: Record<AdminOrder["status"], string> = {
  PAID: "Paid",
  REFUNDED: "Refunded",
  CREATED: "Not paid yet",
  FAILED: "Failed",
};
const statusStyle: Record<AdminOrder["status"], string> = {
  PAID: "bg-peach",
  REFUNDED: "bg-sand",
  CREATED: "border border-line",
  FAILED: "border border-line text-rust-dark",
};

/** Admin: every order, with filters and a refund button. */
export default function AdminOrders() {
  return (
    <AdminShell
      title="Orders & refunds"
      intro="Every purchase, newest first. Only the ₹999 discovery call can be refunded (and seats in a webinar you cancelled); everything else is non-refundable. A refund goes back through Razorpay (5–7 working days to reach the customer) and ends the access that came with the order at once. Razorpay keeps its fee."
    >
      <OrdersContent />
    </AdminShell>
  );
}

function OrdersContent() {
  const [status, setStatus] = useState("PAID");
  const [product, setProduct] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loaded, setLoaded] = useState<{ key: string; data: AdminOrderPage } | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refunding, setRefunding] = useState<AdminOrder | null>(null);
  const key = `${status}|${product}|${query}|${page}|${reload}`;
  const result = loaded?.data ?? null;
  const loading = loaded?.key !== key;
  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;

  const handleError = useCallback((e: unknown) => setError(adminErrorMessage(e)), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let current = true;
    const k = `${status}|${product}|${query}|${page}|${reload}`;
    manageApi.orders({ status, product, search: query, page }).then((data) => {
      if (current) setLoaded({ key: k, data });
    }, handleError);
    return () => {
      current = false;
    };
  }, [status, product, query, page, reload, handleError]);

  return (
    <section aria-label="Orders" className="flex flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="order-status" className={adminUi.label}>
            Status
          </label>
          <select
            id="order-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={adminUi.input}
          >
            <option value="PAID">Paid</option>
            <option value="REFUNDED">Refunded</option>
            <option value="CREATED">Not paid yet</option>
            <option value="FAILED">Failed</option>
            <option value="">All</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="order-product" className={adminUi.label}>
            Product
          </label>
          <select
            id="order-product"
            value={product}
            onChange={(e) => {
              setProduct(e.target.value);
              setPage(1);
            }}
            className={adminUi.input}
          >
            <option value="">All products</option>
            <option value="webinar">Webinar seats</option>
            <option value="pdf-course">PDF course</option>
            <option value="pt">All coaching plans</option>
            {productOptions
              .filter((p) => p.slug.startsWith("pt-"))
              .map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.label}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="order-search" className={adminUi.label}>
            Buyer&apos;s email, name or phone
          </label>
          <input
            id="order-search"
            type="search"
            value={search}
            maxLength={100}
            onChange={(e) => setSearch(e.target.value)}
            className={adminUi.input}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className={adminUi.error}>
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className={adminUi.success}>
          {notice}
        </p>
      )}

      <div className="relative overflow-x-auto rounded-3xl border border-line bg-white">
        <table className={`${adminUi.table} min-w-[980px]`}>
          <thead>
            <tr className="border-b border-line text-[13px] text-ink-soft">
              <th scope="col" className={adminUi.th}>Date</th>
              <th scope="col" className={adminUi.th}>Buyer</th>
              <th scope="col" className={adminUi.th}>What</th>
              <th scope="col" className={`${adminUi.th} text-right`}>Paid</th>
              <th scope="col" className={adminUi.th}>Status</th>
              <th scope="col" className={adminUi.th}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody aria-busy={loading}>
            {result?.orders.map((o) => (
              <tr key={o.id} className="border-b border-line align-top last:border-0">
                <td className={`${adminUi.td} whitespace-nowrap`}>{formatIstDateTime(o.paidAt ?? o.createdAt)}</td>
                <td className={`${adminUi.td} min-w-[220px]`}>
                  <span className="block font-semibold">{o.buyer.name ?? "—"}</span>
                  <span className="block break-all text-ink-soft">{o.buyer.email}</span>
                  {o.buyer.phone && <span className="block text-ink-soft">{o.buyer.phone}</span>}
                </td>
                <td className={adminUi.td}>
                  {o.item}
                  {o.manual && (
                    <span className="mt-1 block text-ink-soft">
                      <span className={`${adminUi.badge} bg-sand`}>Manual</span> {o.note}
                    </span>
                  )}
                  {o.promoCode && (
                    <span className="mt-1 block text-ink-soft">
                      Code {o.promoCode}: −{formatPaise(o.discountPaise)}
                    </span>
                  )}
                </td>
                <td className={`${adminUi.td} whitespace-nowrap text-right font-semibold tabular-nums`}>
                  {formatPaise(o.amountPaise)}
                </td>
                <td className={adminUi.td}>
                  <span className={`${adminUi.badge} ${statusStyle[o.status]}`}>{statusLabel[o.status]}</span>
                  {o.refundedAt && <span className="mt-1 block text-ink-soft">{formatIstDateTime(o.refundedAt)}</span>}
                </td>
                <td className={`${adminUi.td} text-right`}>
                  {o.refundable && (
                    <button
                      type="button"
                      onClick={() => {
                        setNotice("");
                        setError("");
                        setRefunding(o);
                      }}
                      className={`${adminUi.smallButton()} bg-white`}
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {result && result.orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No orders match these filters.
                </td>
              </tr>
            )}
            {!result && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  Loading orders…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result && result.total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
          <span role="status">
            {result.total} {result.total === 1 ? "order" : "orders"} · {formatPaise(result.totalPaise)} in total · page{" "}
            {result.page} of {totalPages}
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

      <RefundDialog
        order={refunding}
        onClose={() => setRefunding(null)}
        onDone={(o) => {
          setRefunding(null);
          setNotice(`Refunded ${formatPaise(o.amountPaise)} to ${o.buyer.email}. Their access has ended.`);
          setReload((r) => r + 1);
        }}
      />
    </section>
  );
}

/** "Are you sure?" before a refund. The refund itself happens on the server. */
function RefundDialog({
  order,
  onClose,
  onDone,
}: {
  order: AdminOrder | null;
  onClose: () => void;
  onDone: (order: AdminOrder) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (order && !dialog.open) dialog.showModal();
    if (!order && dialog.open) dialog.close();
  }, [order]);

  async function confirm() {
    if (!order) return;
    setBusy(true);
    setError("");
    try {
      await manageApi.refund(order.id, reason.trim());
      setReason("");
      onDone(order);
    } catch (e) {
      setError(adminErrorMessage(e));
    }
    setBusy(false);
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="refund-title"
      className="fixed inset-0 m-auto h-fit w-[min(480px,calc(100%-32px))] rounded-[28px] bg-white p-0 text-ink shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop:bg-[rgba(42,36,32,0.8)]"
    >
      {order && (
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <h2 id="refund-title" className="m-0 font-serif text-[32px] font-medium leading-[1.1]">
            Refund {formatPaise(order.amountPaise)}?
          </h2>
          <p className="m-0 text-[15px] text-ink-soft">
            <strong className="text-ink">{order.item}</strong> for {order.buyer.email}. The money goes back to the same
            card, UPI or bank account through Razorpay, and their access ends now. This can&apos;t be undone.
          </p>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="refund-reason" className={adminUi.label}>
              Reason <span className="font-normal text-ink-soft">(optional, saved in the activity log)</span>
            </label>
            <input
              id="refund-reason"
              value={reason}
              maxLength={300}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Did not join after the discovery call"
              className={adminUi.input}
            />
          </div>
          {error && (
            <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onClose} disabled={busy} className={`${adminUi.smallButton()} bg-white`}>
              Cancel
            </button>
            <button type="button" onClick={confirm} disabled={busy} className={adminUi.smallButton("dark")}>
              {busy ? "Refunding…" : `Yes, refund ${formatPaise(order.amountPaise)}`}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
