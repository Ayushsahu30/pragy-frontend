"use client";

import { useEffect, useId, useState } from "react";
import { ApiError } from "@/lib/auth";
import { formatPaise, paymentsApi, type PromoPreview } from "@/lib/payments";

/**
 * "Have a promo code?" under a price. Checks the code with the backend and
 * shows the new total; the backend checks it again when the order is made.
 * Only for logged-in visitors (codes are once per person).
 */
export default function PromoCodeField({
  product,
  webinarId,
  applied,
  onChange,
}: {
  product: string;
  webinarId?: string;
  applied: PromoPreview | null;
  onChange: (preview: PromoPreview | null) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // The product changed (e.g. another plan length): check the code again.
  const appliedCode = applied?.code;
  const appliedFor = applied?.product;
  useEffect(() => {
    if (!appliedCode || appliedFor === product) return;
    let current = true;
    paymentsApi.checkPromo({ product, webinarId, promoCode: appliedCode }).then(
      (p) => current && onChange(p),
      (e: unknown) => {
        if (!current) return;
        onChange(null);
        setOpen(true);
        setCode(appliedCode);
        setError(e instanceof ApiError ? e.message : "This code could not be checked.");
      },
    );
    return () => {
      current = false;
    };
  }, [appliedCode, appliedFor, product, webinarId, onChange]);

  async function apply() {
    const typed = code.trim().toUpperCase();
    if (!typed) return;
    setBusy(true);
    setError("");
    try {
      onChange(await paymentsApi.checkPromo({ product, webinarId, promoCode: typed }));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "This code could not be checked. Please try again.");
    }
    setBusy(false);
  }

  if (applied) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream px-4 py-3 text-sm">
        <span>
          Code <strong className="font-mono">{applied.code}</strong>: −{formatPaise(applied.discountPaise)}. You pay{" "}
          <strong>{formatPaise(applied.amountPaise)}</strong>.
        </span>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setCode("");
          }}
          className="min-h-11 cursor-pointer border-0 bg-transparent p-0 font-sans text-sm font-semibold text-ink underline underline-offset-4"
        >
          Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 cursor-pointer self-start border-0 bg-transparent p-0 font-sans text-sm font-semibold text-ink underline underline-offset-4"
      >
        Have a promo code?
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`${id}-code`} className="text-sm font-semibold">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-code`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void apply();
            }
          }}
          maxLength={30}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="h-[48px] min-w-0 flex-1 rounded-[14px] border border-field bg-white px-4 font-mono text-[15px] uppercase text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rust"
        />
        <button
          type="button"
          onClick={apply}
          disabled={busy || !code.trim()}
          className="min-h-[48px] cursor-pointer rounded-full border border-ink bg-white px-5 font-sans text-[15px] font-semibold text-ink hover:bg-cream disabled:cursor-default disabled:opacity-50"
        >
          {busy ? "Checking…" : "Apply"}
        </button>
      </div>
      {error && (
        <p role="alert" className="m-0 text-sm text-rust-dark">
          {error}
        </p>
      )}
    </div>
  );
}
