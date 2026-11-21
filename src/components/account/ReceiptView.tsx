"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui";
import { site } from "@/content/site";
import { ApiError } from "@/lib/auth";
import { formatIST, formatPaise, type OrderSummary, paymentsApi } from "@/lib/payments";
import { useSession } from "@/lib/session";

const longDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" });
const shortDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** A printable receipt for one of the user's payments. */
export default function ReceiptView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent(`/account/receipts/${id}`)}`);
  }, [session.status, router, id]);

  useEffect(() => {
    if (session.status !== "signed-in") return;
    paymentsApi.order(id).then(setOrder, (e: unknown) =>
      setError(e instanceof ApiError ? e.message : "This receipt could not be loaded."),
    );
  }, [session.status, id]);

  if (error) {
    return (
      <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <p className="m-0 font-serif text-[30px] font-medium">{error}</p>
        <Link href="/dashboard#payments" className={buttonClass("outline")}>
          Back to My account
        </Link>
      </main>
    );
  }
  if (!order) {
    return (
      <main id="main" className="flex min-h-dvh items-center justify-center bg-cream">
        <p className="m-0 text-ink-soft">Loading receipt…</p>
      </main>
    );
  }
  if (order.status !== "PAID" && order.status !== "REFUNDED") {
    return (
      <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <p className="m-0 font-serif text-[30px] font-medium">This order was not paid, so it has no receipt.</p>
        <Link href="/dashboard#payments" className={buttonClass("outline")}>
          Back to My account
        </Link>
      </main>
    );
  }

  const rows: [string, string][] = [
    ["Receipt number", order.id],
    ["Paid on", order.paidAt ? `${longDate.format(new Date(order.paidAt))} IST` : "—"],
    ["Payment ID", order.paymentId ?? "—"],
    ["Paid with", "Razorpay"],
    ["Status", order.status === "REFUNDED" ? "Refunded" : "Paid"],
  ];
  const detail = order.webinar
    ? `Live webinar on ${formatIST(order.webinar.startsAt)}`
    : order.access
      ? order.access.endsAt
        ? `Online access until ${shortDate.format(new Date(order.access.endsAt))}`
        : "Online access"
      : null;

  return (
    <main id="main" className="min-h-dvh bg-cream px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-5 flex max-w-[720px] flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard#payments" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink no-underline">
          <ArrowRightIcon className="rotate-180" />
          My account
        </Link>
        <button type="button" onClick={() => window.print()} className={buttonClass("dark", "cursor-pointer border-0 font-sans")}>
          Print / Save as PDF
        </button>
      </div>

      <article className="mx-auto max-w-[720px] rounded-3xl border border-line bg-white p-8 sm:p-12 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="m-0 font-serif text-[34px] font-semibold leading-none">{site.name}</p>
            <p className="m-0 mt-2 text-sm text-ink-soft">
              {site.businessName} · {site.businessType}
              <br />
              {site.businessAddress}
              <br />
              {site.supportEmail}
            </p>
          </div>
          <div className="text-right">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-rust">Payment receipt</p>
            <p className="m-0 mt-2 font-serif text-[40px] font-medium leading-none">{formatPaise(order.amountPaise)}</p>
          </div>
        </header>

        <section className="grid gap-6 border-b border-line py-6 sm:grid-cols-2">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Billed to</p>
            <p className="m-0 mt-2 font-semibold">{order.buyer.name ?? order.buyer.email}</p>
            <p className="m-0 text-sm text-ink-soft">{order.buyer.email}</p>
            {order.buyer.phone && <p className="m-0 text-sm text-ink-soft">{order.buyer.phone}</p>}
          </div>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-ink-soft">{label}</dt>
                <dd className="m-0 break-all text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <table className="mt-6 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-soft">
              <th scope="col" className="py-2 font-semibold">
                Item
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-3">
                <span className="font-semibold">{order.webinar?.title ?? order.product.name}</span>
                {detail && <span className="block text-ink-soft">{detail}</span>}
              </td>
              <td className="py-3 text-right font-semibold tabular-nums">{formatPaise(order.amountPaise)}</td>
            </tr>
            <tr>
              <td className="pt-3 font-semibold">Total paid ({order.currency})</td>
              <td className="pt-3 text-right font-serif text-[24px] font-semibold tabular-nums">{formatPaise(order.amountPaise)}</td>
            </tr>
          </tbody>
        </table>

        <p className="m-0 mt-8 text-xs text-ink-soft">
          This is a payment receipt, not a tax invoice. No GST was charged. Questions about this payment:{" "}
          {site.supportEmail}.
        </p>
      </article>
    </main>
  );
}
