import { call } from "@/lib/auth";

/** Admin API. The backend checks the admin role on every call. */

export type AdminOverview = AdminSales & {
  totalUsers: number;
  newThisWeek: number;
  marketingOptIns: number;
  profileMissing: number;
  admins: number;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  marketingConsent: boolean;
  google: boolean;
  /** Account made by an admin in Manual access. */
  addedByAdmin: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export type AdminUserPage = { total: number; page: number; pageSize: number; users: AdminUser[] };

export type AdminPtLead = {
  id: string;
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  improve: string[];
  status: LeadStatus;
  statusChangedAt: string | null;
  createdAt: string;
  /** From their account, when they applied while logged in. */
  phone: string | null;
};

export type AdminPtLeadPage = { total: number; page: number; pageSize: number; leads: AdminPtLead[] };

export const adminApi = {
  ptLeads: (page: number, status?: LeadStatus) =>
    call<AdminPtLeadPage>(`/admin/pt-leads?page=${page}${status ? `&status=${status}` : ""}`),

  overview: () => call<AdminOverview>("/admin/overview"),

  users: (search: string, page: number) => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    return call<AdminUserPage>(`/admin/users?${params.toString()}`);
  },
};

// ---- Phase 8: management ----

export type AdminSales = {
  salesPaise: number;
  salesCount: number;
  salesThisMonthPaise: number;
  salesThisMonthCount: number;
};

export type AdminWebinar = {
  id: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  pricePaise: number;
  meetingUrl: string | null;
  status: "UPCOMING" | "FINISHED" | "CANCELLED";
  seatsSold: number;
};

export type WebinarInput = {
  title: string;
  /** With its offset, e.g. "2026-12-14T19:00:00+05:30". */
  startsAt: string;
  durationMinutes: number;
  pricePaise: number;
  meetingUrl: string | null;
};

export type WebinarBuyer = {
  name: string | null;
  email: string;
  phone: string | null;
  boughtAt: string;
  orderId: string;
  amountPaise: number;
  manual: boolean;
};

export type AdminOrder = {
  id: string;
  status: "CREATED" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  paidAt: string | null;
  refundedAt: string | null;
  amountPaise: number;
  discountPaise: number;
  promoCode: string | null;
  manual: boolean;
  note: string | null;
  item: string;
  productSlug: string;
  buyer: { email: string; name: string | null; phone: string | null };
  paymentId: string | null;
  /** Only the ₹999 discovery call, or a seat in a cancelled webinar (checked again on the server). */
  refundable: boolean;
};

export type AdminOrderPage = { total: number; totalPaise: number; page: number; pageSize: number; orders: AdminOrder[] };

export type PromoCode = {
  id: string;
  code: string;
  kind: "PERCENT" | "AMOUNT";
  value: number;
  productSlugs: string[];
  startsAt: string | null;
  endsAt: string | null;
  maxUses: number | null;
  active: boolean;
  note: string | null;
  createdAt: string;
  createdBy: string;
  uses: number;
  discountGivenPaise: number;
};

export type PromoInput = {
  code: string;
  kind: "PERCENT" | "AMOUNT";
  value: number;
  productSlugs: string[];
  startsAt: string | null;
  endsAt: string | null;
  maxUses: number | null;
  note: string;
};

export type Member = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  accesses: {
    id: string;
    startsAt: string;
    endsAt: string | null;
    active: boolean;
    product: { slug: string; name: string; badge: string | null };
    order: { id: string; manual: boolean; note: string | null; status: string };
  }[];
  orders: {
    id: string;
    status: "PAID" | "REFUNDED";
    amountPaise: number;
    discountPaise: number;
    manual: boolean;
    paidAt: string | null;
    refundedAt: string | null;
    product: { name: string };
    webinar: { title: string } | null;
    promoCode: { code: string } | null;
  }[];
  webinarRegistrations: {
    webinar: { id: string; title: string; startsAt: string; status: string };
    order: { id: string; manual: boolean };
  }[];
};

export type GrantInput = {
  email: string;
  name: string;
  product: string;
  webinarId?: string;
  days: number | null;
  amountPaise: number;
  note: string;
  sendEmail: boolean;
};

export type AuditEntry = {
  id: string;
  action: string;
  targetId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  actor: string;
};

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

export type LeadStatus = "NEW" | "CONTACTED" | "BOUGHT" | "NOT_INTERESTED";

export const leadStatusLabel: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  BOUGHT: "Bought",
  NOT_INTERESTED: "Not interested",
};

export type SalesReport = {
  days: number;
  from: string;
  totalPaise: number;
  count: number;
  byProduct: { slug: string; name: string; count: number; paise: number }[];
  byDay: { date: string; count: number; paise: number }[];
};

export type ExportedUser = {
  name: string | null;
  email: string;
  phone: string | null;
  marketingConsent: boolean;
  marketingConsentAt: string | null;
  createdAt: string;
  lastLoginAt: string | null;
};

export type ExportedLead = {
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  age: number;
  heightCm: number;
  weightKg: number;
  improve: string[];
  status: LeadStatus;
};

/** The extra admin check: a code emailed to the admin. */
export const adminVerifyApi = {
  status: () => call<{ verified: boolean; email: string }>("/admin/verify"),
  request: () => call<{ ok: true }>("/admin/verify/request", { method: "POST" }),
  confirm: (code: string) =>
    call<{ verified: true }>("/admin/verify/confirm", { method: "POST", body: JSON.stringify({ code }) }),
};

export type AdminBooking = {
  id: string;
  productSlug: "team-call" | "consultation";
  startsAt: string;
  endsAt: string;
  status: "BOOKED" | "NEEDS_NEW_TIME" | "CANCELLED";
  meetingUrl: string | null;
  discountCode: string | null;
  user: { name: string | null; email: string; phone: string | null };
  order: { id: string; amountPaise: number; status: string; paidAt: string | null };
};

export const manageApi = {
  bookings: (when: "upcoming" | "past" | "attention") =>
    call<{ when: string; attention: number; bookings: AdminBooking[] }>(`/admin/bookings?when=${when}`),

  setLeadStatus: (id: string, status: LeadStatus) =>
    call<{ id: string; status: LeadStatus }>(`/admin/pt-leads/${encodeURIComponent(id)}`, json("PATCH", { status })),
  exportLeads: () => call<{ leads: ExportedLead[] }>("/admin/pt-leads/export"),
  exportUsers: (scope: "marketing" | "all") => call<{ users: ExportedUser[] }>(`/admin/export/users?scope=${scope}`),
  sales: (days: number) => call<SalesReport>(`/admin/sales?days=${days}`),

  webinars: () => call<{ webinars: AdminWebinar[] }>("/admin/webinars"),
  createWebinar: (input: WebinarInput) => call<AdminWebinar>("/admin/webinars", json("POST", input)),
  updateWebinar: (id: string, input: Partial<WebinarInput> & { status?: AdminWebinar["status"] }) =>
    call<AdminWebinar>(`/admin/webinars/${encodeURIComponent(id)}`, json("PATCH", input)),
  webinarBuyers: (id: string) =>
    call<{ webinar: { id: string; title: string; startsAt: string }; buyers: WebinarBuyer[] }>(
      `/admin/webinars/${encodeURIComponent(id)}/buyers`,
    ),

  orders: (filters: { status?: string; product?: string; search?: string; page: number }) => {
    const params = new URLSearchParams({ page: String(filters.page) });
    if (filters.status) params.set("status", filters.status);
    if (filters.product) params.set("product", filters.product);
    if (filters.search) params.set("search", filters.search);
    return call<AdminOrderPage>(`/admin/orders?${params.toString()}`);
  },
  refund: (id: string, reason: string) =>
    call<{ id: string; status: "REFUNDED" }>(
      `/admin/orders/${encodeURIComponent(id)}/refund`,
      json("POST", { confirm: true, reason: reason || undefined }),
    ),

  promoCodes: () => call<{ codes: PromoCode[] }>("/admin/promo-codes"),
  createPromo: (input: PromoInput) => call<PromoCode>("/admin/promo-codes", json("POST", input)),
  setPromoActive: (id: string, active: boolean) =>
    call<PromoCode>(`/admin/promo-codes/${encodeURIComponent(id)}`, json("PATCH", { active })),

  member: (email: string) => call<Member>(`/admin/members?email=${encodeURIComponent(email)}`),
  grant: (input: GrantInput) =>
    call<{ orderId: string; email: string; newAccount: boolean; endsAt: string | null; emailed: boolean }>(
      "/admin/access",
      json("POST", { ...input, webinarId: input.product === "webinar" ? input.webinarId : undefined }),
    ),
  endAccess: (id: string) => call<{ id: string }>(`/admin/access/${encodeURIComponent(id)}/end`, json("POST")),

  audit: (page: number) =>
    call<{ total: number; page: number; pageSize: number; entries: AuditEntry[] }>(`/admin/audit?page=${page}`),
};

/** Products an admin can pick, in the order shown. */
export const productOptions: { slug: string; label: string }[] = [
  { slug: "webinar", label: "Webinar seat" },
  { slug: "pdf-course", label: "PDF course" },
  { slug: "video-course", label: "Video course & community (Community Member badge)" },
  ...(["premium", "elite", "diamond"] as const).flatMap((plan) =>
    (["1m", "3m", "6m"] as const).map((d) => ({
      slug: `pt-${plan}-${d}`,
      label: `Coaching: ${plan[0].toUpperCase()}${plan.slice(1)}, ${d === "1m" ? "1 month" : d === "3m" ? "3 months" : "6 months"}`,
    })),
  ),
];

export const productLabel = (slug: string) => productOptions.find((p) => p.slug === slug)?.label ?? slug;

/** "2026-12-14T19:00" typed in Indian time -> "2026-12-14T19:00:00+05:30". */
export const istInputToIso = (local: string) => `${local}:00+05:30`;

/** An ISO date -> "2026-12-14T19:00" in Indian time, for a datetime-local field. */
export const isoToIstInput = (iso: string) =>
  new Date(new Date(iso).getTime() + 5.5 * 3_600_000).toISOString().slice(0, 16);

/** "14 Dec 2026, 7:00 pm" in Indian time. */
export const formatIstDateTime = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date(iso))
    : "—";

/** Builds a CSV file from rows and starts its download. */
export function downloadCsv(filename: string, rows: (string | number | null)[][]) {
  const cell = (v: string | number | null) => {
    const s = v === null ? "" : String(v);
    // Quote everything; neutralise spreadsheet formulas.
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const csv = "\uFEFF" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
