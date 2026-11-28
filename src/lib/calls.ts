import { call } from "@/lib/auth";

/** Paid calls with Pragy, booked in his Cal.com after payment. */

export type CallProduct = "team-call" | "consultation";

export type MyCall = {
  id: string;
  productSlug: CallProduct;
  startsAt: string;
  endsAt: string;
  status: "BOOKED" | "NEEDS_NEW_TIME" | "CANCELLED";
  meetingUrl: string | null;
  /** Discovery call: the personal ₹999 code for a coaching plan. */
  discountCode: string | null;
  discountCodeUsed: boolean;
  refunded: boolean;
};

export const callPages: Record<CallProduct, string> = { "team-call": "/team-call", consultation: "/consultation" };

export const callNames: Record<CallProduct, string> = {
  "team-call": "Discovery call with my team",
  consultation: "Private consultation with Pragy",
};

export const callsApi = {
  /** Free start times (ISO), soonest first. Public. */
  slots: (product: CallProduct) => call<{ slots: string[] }>(`/calls/${product}/slots`),
  mine: () => call<{ calls: MyCall[] }>("/calls/mine"),
  rebook: (id: string, slotStart: string) =>
    call<{ id: string; status: string; startsAt: string; meetingUrl: string | null }>(
      `/calls/bookings/${encodeURIComponent(id)}/rebook`,
      { method: "POST", body: JSON.stringify({ slotStart }) },
    ),
};

const tz = "Asia/Kolkata";

/** "2026-11-24" in Indian time, for grouping times by day. */
export const istDayKey = (iso: string) =>
  new Date(new Date(iso).getTime() + 5.5 * 3_600_000).toISOString().slice(0, 10);

/** "Mon, 24 Nov" */
export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: tz }).format(new Date(iso));

/** "7:00 pm" */
export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(new Date(iso));

/** "Mon, 24 Nov, 7:00 pm IST" */
export const formatCallTime = (iso: string) => `${formatDay(iso)}, ${formatTime(iso)} IST`;
