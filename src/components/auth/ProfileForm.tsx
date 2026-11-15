"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui";
import { ApiError, authApi, type PublicUser } from "@/lib/auth";
import { setSignedIn } from "@/lib/session";

const fieldClass =
  "h-[52px] w-full rounded-[14px] border border-field bg-white px-4 font-sans text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rust";

/**
 * Name, phone and marketing consent. Used on the first-login step (/welcome)
 * and in the dashboard's Profile section.
 */
export default function ProfileForm({
  user,
  submitLabel,
  onSaved,
}: {
  user: PublicUser;
  submitLabel: string;
  onSaved?: (user: PublicUser) => void;
}) {
  const id = useId();
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [consent, setConsent] = useState(user.marketingConsent);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const { user: updated } = await authApi.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        marketingConsent: consent,
      });
      setSignedIn(updated);
      setSaved(true);
      onSaved?.(updated);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-name`} className="text-sm font-semibold">
          Full name
        </label>
        <input
          id={`${id}-name`}
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-phone`} className="text-sm font-semibold">
          Phone number
        </label>
        <input
          id={`${id}-phone`}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-describedby={`${id}-phone-hint`}
          className={fieldClass}
        />
        <span id={`${id}-phone-hint`} className="text-[13px] text-ink-soft">
          So my team can reach you about your calls and coaching.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-email`} className="text-sm font-semibold">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          value={user.email}
          readOnly
          aria-describedby={`${id}-email-hint`}
          className="h-[52px] w-full rounded-[14px] border border-sand bg-cream px-4 font-sans text-[15px] text-ink-soft"
        />
        <span id={`${id}-email-hint`} className="text-[13px] text-ink-soft">
          You log in with this email. To change it, contact support.
        </span>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-cream p-4 text-[15px]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4.5 w-4.5 flex-none accent-ink"
        />
        <span>Send me tips, offers and updates by email, SMS or WhatsApp. You can stop anytime.</span>
      </label>

      {error && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {error}
        </p>
      )}
      {saved && !error && (
        <p role="status" className="m-0 text-sm font-semibold text-ink">
          Saved.
        </p>
      )}

      <button type="submit" disabled={busy} className={buttonClass("dark", "w-full cursor-pointer border-0 font-sans disabled:opacity-60 sm:w-fit")}>
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
