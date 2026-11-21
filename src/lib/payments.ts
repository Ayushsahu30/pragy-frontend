import { call } from "@/lib/auth";

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
  currency: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
};

export type OrderStatus = "CREATED" | "PAID" | "FAILED" | "REFUNDED";

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  amountPaise: number;
  product: { slug: string; name: string };
  webinar: { id: string; title: string; startsAt: string } | null;
  paidAt: string | null;
};

export const paymentsApi = {
  nextWebinar: () => call<{ webinar: NextWebinar | null }>("/webinars/next"),

  myWebinars: () => call<{ webinars: MyWebinar[] }>("/webinars/mine"),

  startWebinarOrder: (webinarId: string) =>
    call<CheckoutDetails>("/payments/orders", {
      method: "POST",
      body: JSON.stringify({ product: "webinar", webinarId }),
    }),

  confirm: (input: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    call<{ orderId: string; status: OrderStatus }>("/payments/confirm", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  order: (orderId: string) => call<OrderSummary>(`/payments/orders/${encodeURIComponent(orderId)}`),
};

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
