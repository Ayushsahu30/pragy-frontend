import { call } from "@/lib/auth";

/** My account data from the backend: what the user owns, badges, payments, vault. */

export type AccountOverview = {
  products: { slug: string; name: string; startsAt: string; endsAt: string | null; active: boolean }[];
  badges: { label: string; productSlug: string; endsAt: string | null }[];
  stats: { activeCourses: number; upcomingWebinars: number; payments: number };
};

export type OrderListItem = {
  id: string;
  status: "PAID" | "REFUNDED";
  amountPaise: number;
  item: string;
  productSlug: string;
  paidAt: string | null;
};

export type VaultItem = {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  sizeBytes: number;
};

export const accountApi = {
  overview: () => call<AccountOverview>("/account/overview"),
  orders: () => call<{ orders: OrderListItem[] }>("/payments/orders"),
  vault: () => call<{ items: VaultItem[] }>("/vault"),
};

/** Address of a vault file's download (the backend checks access again). */
export const vaultFileHref = (id: string) => `/api/vault/${encodeURIComponent(id)}/file`;

/** "1.2 MB", "340 KB". */
export function formatSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

/** "21 Dec 2026", in Indian time. */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso));
