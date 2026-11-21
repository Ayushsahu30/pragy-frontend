"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonClass } from "@/components/ui";
import { site } from "@/content/site";
import { PT_PLANS_PATH } from "@/lib/pt";

/** Where each product's "Try again" goes. */
const retryHref: Record<string, string> = { webinar: "/webinar", "pdf-course": "/pdf-course", pt: PT_PLANS_PATH };

/** The provider's reason and the buttons, read from ?product=...&reason=... */
export default function PaymentFailedActions() {
  const params = useSearchParams();
  const retry = retryHref[params.get("product") ?? ""] ?? "/";
  const reason = (params.get("reason") ?? "").slice(0, 200);

  return (
    <>
      {reason && (
        <p className="m-0 rounded-2xl bg-cream p-4 text-sm text-ink-soft">
          The payment provider said: <span className="text-ink">{reason}</span>
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Link href={retry} className={buttonClass("dark")}>
          Try again
        </Link>
        <a
          href={`https://wa.me/${site.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("outline")}
        >
          Get help on WhatsApp
        </a>
      </div>
    </>
  );
}
