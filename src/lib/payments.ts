import { ApiError, call } from "@/lib/auth";

/** Buying and webinars. The backend decides every price and checks every payment. */

export type NextWebinar = {
  id: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  pricePaise: number;
};

export type MyWebinar = {
  id: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  status: "UPCOMING" | "FINISHED" | "CANCELLED";
  meetingUrl: string | null;
};

export type CheckoutDetails = {
  orderId: string;
  razorpayOrderId: string;
  keyId: string;
  amountPaise: number;
  discountPaise: number;
  currency: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
};

export type OrderStatus = "CREATED" | "PAID" | "FAILED" | "REFUNDED";

/** What a promo code takes off, for one product. */
export type PromoPreview = {
  code: string;
  /** The product it was checked for. */
  product: string;
  pricePaise: number;
  discountPaise: number;
  amountPaise: number;
};

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  amountPaise: number;
  discountPaise: number;
  promoCode: string | null;
  manual: boolean;
  refundedAt: string | null;
  currency: string;
  buyer: { name: string | null; email: string; phone: string | null };
  /** Razorpay's payment id, once paid. */
  paymentId: string | null;
  product: { slug: string; name: string };
  webinar: { id: string; title: string; startsAt: string } | null;
  /** For courses: when access ends (null = never). */
  access: { endsAt: string | null } | null;
  /** For calls: the booked time and Meet link (PENDING until booked). */
  call: {
    startsAt: string;
    status: "BOOKED" | "NEEDS_NEW_TIME" | "CANCELLED" | "PENDING";
    meetingUrl: string | null;
    discountCode: string | null;
  } | null;
  paidAt: string | null;
};

/** The PDF course for a user with access. */
export type CourseInfo = { pageCount: number; lastPage: number; endsAt: string | null };

export const paymentsApi = {
  nextWebinar: () => call<{ webinar: NextWebinar | null }>("/webinars/next"),

  myWebinars: () => call<{ webinars: MyWebinar[] }>("/webinars/mine"),

  startWebinarOrder: (webinarId: string, promoCode?: string) =>
    call<CheckoutDetails>("/payments/orders", {
      method: "POST",
      body: JSON.stringify({ product: "webinar", webinarId, promoCode }),
    }),

  startCourseOrder: (promoCode?: string) =>
    call<CheckoutDetails>("/payments/orders", {
      method: "POST",
      body: JSON.stringify({ product: "pdf-course", promoCode }),
    }),

  /** A paid call at the picked time. */
  startCallOrder: (product: "team-call" | "consultation", slotStart: string, promoCode?: string) =>
    call<CheckoutDetails>("/payments/orders", {
      method: "POST",
      body: JSON.stringify({ product, slotStart, promoCode }),
    }),

  /** A personal coaching plan, e.g. "pt-elite-3m". */
  startPlanOrder: (product: string, promoCode?: string) =>
    call<CheckoutDetails>("/payments/orders", { method: "POST", body: JSON.stringify({ product, promoCode }) }),

  /** What a promo code would take off. Fails with the reason when it can't be used. */
  checkPromo: async (input: { product: string; webinarId?: string; promoCode: string }): Promise<PromoPreview> => ({
    ...(await call<Omit<PromoPreview, "product">>("/payments/promo-check", {
      method: "POST",
      body: JSON.stringify(input),
    })),
    product: input.product,
  }),

  confirm: (input: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    call<{ orderId: string; status: OrderStatus }>("/payments/confirm", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  order: (orderId: string) => call<OrderSummary>(`/payments/orders/${encodeURIComponent(orderId)}`),
};

export const courseApi = {
  /** Fails with ApiError code NO_ACCESS when the user has no active access. */
  info: () => call<CourseInfo>("/courses/pdf"),

  saveProgress: (page: number) =>
    call<{ ok: true }>("/courses/pdf/progress", { method: "PUT", body: JSON.stringify({ page }) }),

  /** One watermarked page as an image. */
  async page(page: number): Promise<Blob> {
    const res = await fetch(`/api/courses/pdf/pages/${page}`, { credentials: "same-origin", cache: "no-store" });
    if (res.ok) return res.blob();
    const body = (await res.json().catch(() => null)) as { code?: string; message?: string } | null;
    throw new ApiError(body?.code ?? `HTTP_${res.status}`, body?.message ?? "This page could not be loaded.", res.status);
  },
};

/**
 * The whole payment, after the backend created the order: opens Razorpay's
 * window and, when paid, asks the backend to check Razorpay's signature.
 * Access is given by the backend, never by this function.
 */
export async function checkout(
  details: CheckoutDetails,
  brandName: string,
): Promise<{ result: "paid"; orderId: string } | { result: "closed" } | { result: "failed"; reason: string }> {
  const outcome = await openCheckout(details, brandName);
  if (outcome.result !== "paid") return outcome;
  await paymentsApi
    .confirm({
      razorpayOrderId: outcome.response.razorpay_order_id,
      razorpayPaymentId: outcome.response.razorpay_payment_id,
      razorpaySignature: outcome.response.razorpay_signature,
    })
    .catch(() => undefined); // Razorpay's webhook can still confirm it; the success page waits for it
  return { result: "paid", orderId: details.orderId };
}

/** "Sun, 14 Dec 2026, 7:00 pm IST". Webinars run on Indian time. */
export function formatIST(iso: string): string {
  const text = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
  return `${text} IST`;
}

/** Paise to "₹250" or "₹1,20,000". */
export function formatPaise(paise: number): string {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(paise / 100)}`;
}

// ---- Razorpay's payment window (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/) ----

type RazorpaySuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayFailure = { error?: { description?: string } };

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccess) => void;
  modal: { ondismiss: () => void };
};

type RazorpayWindow = { open: () => void; on: (event: "payment.failed", cb: (r: RazorpayFailure) => void) => void };

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayWindow;
  }
}

let scriptPromise: Promise<void> | null = null;

/** Loads Razorpay's checkout script once. */
function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Razorpay could not load"));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Opens the payment window. Resolves with Razorpay's signed result when the
 * customer pays, or "closed" / "failed" (with Razorpay's reason) otherwise.
 */
export async function openCheckout(
  details: CheckoutDetails,
  brandName: string,
): Promise<{ result: "paid"; response: RazorpaySuccess } | { result: "closed" } | { result: "failed"; reason: string }> {
  await loadRazorpay();
  return new Promise((resolve) => {
    let lastFailure: string | null = null;
    const rzp = new window.Razorpay!({
      key: details.keyId,
      amount: details.amountPaise,
      currency: details.currency,
      order_id: details.razorpayOrderId,
      name: brandName,
      description: details.description,
      prefill: details.prefill,
      theme: { color: "#483c32" },
      handler: (response) => resolve({ result: "paid", response }),
      modal: {
        // Closed without paying. If a payment failed before, report that reason.
        ondismiss: () => resolve(lastFailure ? { result: "failed", reason: lastFailure } : { result: "closed" }),
      },
    });
    // The window lets the customer retry after a failure, so only remember it.
    rzp.on("payment.failed", (r) => {
      lastFailure = r.error?.description ?? "The payment did not go through.";
    });
    rzp.open();
  });
}
