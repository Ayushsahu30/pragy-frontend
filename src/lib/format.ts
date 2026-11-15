import type { Price } from "@/content/prices";

// "en-IN" groups digits the Indian way: 1,20,000
const inr = new Intl.NumberFormat("en-IN");

/** 120000 -> "₹1,20,000" */
export function formatINR(amount: number): string {
  return `₹${inr.format(amount)}`;
}

/** Price with its GST note, e.g. "₹999 + GST". */
export function formatPrice(price: Price): string {
  return price.gst === "extra" ? `${formatINR(price.amount)} + GST` : formatINR(price.amount);
}

/** Shows `value`, or a visible "[placeholder]" while the client has not sent it. */
export function orPlaceholder(value: string, placeholder: string): string {
  return value.trim() ? value : `[${placeholder}]`;
}
