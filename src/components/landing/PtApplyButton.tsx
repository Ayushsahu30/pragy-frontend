"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ChatIcon, CloseIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui";
import { site } from "@/content/site";
import { ApiError } from "@/lib/auth";
import { ptApi } from "@/lib/pt";
import { useSession } from "@/lib/session";

type Application = {
  name: string;
  age: string;
  email: string;
  height: string;
  weight: string;
  improve: string[];
};

/** Options for "Things you want to improve". Pick one or more. */
const improveOptions = ["Jawline", "Face fat", "Hair", "Overall appearance"];

/** The message WhatsApp opens with. */
function buildMessage(a: Application): string {
  return (
    `Hi, I am ${a.name}, age ${a.age}, height ${a.height} cm, weight ${a.weight} kg. ` +
    `My email is ${a.email}. I want to improve: ${a.improve.join(", ")}. I would like to apply for personal coaching.`
  );
}

const fieldClass =
  "h-[52px] w-full rounded-[14px] border border-field bg-white px-4 font-sans text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rust";

/**
 * "Apply for personal training" button and the form it opens.
 * On submit, the application is saved in the backend (so the team has it even
 * if the WhatsApp message is never sent), then WhatsApp opens on the team's
 * number with the message filled in. Logged-in users get name and email filled in.
 */
export default function PtApplyButton({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const id = useId();
  const session = useSession();
  const user = session.status === "signed-in" ? session.user : null;
  const prefill: Partial<Record<keyof Application, string>> = { name: user?.name ?? "", email: user?.email ?? "" };

  function open() {
    setError("");
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const read = (key: string) => String(data.get(key) ?? "").trim();
    const application: Application = {
      name: read("name"),
      age: read("age"),
      email: read("email"),
      height: read("height"),
      weight: read("weight"),
      improve: data.getAll("improve").map(String),
    };

    if (application.improve.length === 0) {
      setError("Please choose at least one thing you want to improve.");
      return;
    }

    if (!site.whatsappNumber) {
      setError("Applications open soon. Please check back in a little while.");
      return;
    }

    // Open the WhatsApp tab now, while the click still counts: browsers block
    // tabs opened later, after waiting for the server.
    const tab = window.open("", "_blank");
    if (tab) tab.opener = null;
    setError("");
    setBusy(true);
    try {
      await ptApi.apply({
        name: application.name,
        age: Number(application.age),
        email: application.email,
        heightCm: Number(application.height),
        weightKg: Number(application.weight),
        improve: application.improve,
      });
    } catch (e) {
      // Wrong details: let them fix the form. Anything else (server down, already
      // applied): still continue to WhatsApp, the team gets the message there.
      if (e instanceof ApiError && e.status === 400) {
        tab?.close();
        setError(e.message);
        setBusy(false);
        return;
      }
    }
    setBusy(false);

    const url = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(buildMessage(application))}`;
    if (tab) tab.location.href = url;
    else window.location.href = url;
    form.reset();
    close();
  }

  const fields: {
    name: Exclude<keyof Application, "improve">;
    label: string;
    type: string;
    autoComplete?: string;
    inputMode?: "numeric" | "email" | "text";
    min?: number;
    max?: number;
    suffix?: string;
  }[] = [
    { name: "name", label: "Full name", type: "text", autoComplete: "name" },
    { name: "age", label: "Age", type: "number", inputMode: "numeric", min: 16, max: 80 },
    { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email" },
    { name: "height", label: "Height", type: "number", inputMode: "numeric", min: 120, max: 230, suffix: "cm" },
    { name: "weight", label: "Weight", type: "number", inputMode: "numeric", min: 30, max: 250, suffix: "kg" },
  ];

  return (
    <>
      <button type="button" onClick={open} className={buttonClass("peach", `cursor-pointer border-0 font-sans ${className}`)}>
        <ChatIcon />
        Apply for Personal Coaching
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-32px)] w-[min(520px,calc(100%-32px))] overflow-y-auto rounded-[28px] bg-white p-0 text-ink shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop:bg-[rgba(42,36,32,0.8)]"
      >
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">Takes under a minute</span>
              <h3 id={`${id}-title`} className="m-0 font-serif text-[36px] font-medium leading-[1.1]">
                Personal coaching application
              </h3>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
            >
              <CloseIcon />
            </button>
          </div>

          <form key={user?.id ?? "guest"} onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label htmlFor={`${id}-${field.name}`} className="text-sm font-semibold">
                  {field.label}
                  {field.suffix && <span className="font-normal text-ink-soft"> ({field.suffix})</span>}
                </label>
                <input
                  id={`${id}-${field.name}`}
                  name={field.name}
                  type={field.type}
                  required
                  autoComplete={field.autoComplete}
                  defaultValue={prefill[field.name] || undefined}
                  inputMode={field.inputMode}
                  min={field.min}
                  max={field.max}
                  className={fieldClass}
                />
              </div>
            ))}

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-1.5 p-0 text-sm font-semibold">
                Things you want to improve <span className="font-normal text-ink-soft">(choose one or more)</span>
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {improveOptions.map((option) => (
                  <label
                    key={option}
                    className="flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-[14px] border border-field bg-white px-3.5 text-[15px] has-[:checked]:border-ink has-[:checked]:bg-peach has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-rust"
                  >
                    <input type="checkbox" name="improve" value={option} className="h-4.5 w-4.5 flex-none accent-ink" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className={buttonClass("dark", "mt-1 cursor-pointer border-0 font-sans disabled:opacity-60")}
            >
              {busy ? "Saving…" : "Continue on WhatsApp"}
            </button>
          </form>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink-soft">WhatsApp opens with a message like</span>
            <p className="m-0 rounded-[4px_18px_18px_18px] bg-peach px-4.5 py-4 text-[15px] leading-[1.5]">
              Hi, I am [Name], age [Age], height [Height] cm, weight [Weight] kg. My email is [Email]. I want to
              improve: [Your choices]. I would like to apply for personal coaching.
            </p>
            <span className="text-[13px] text-ink-soft">Your details are shared with my team so they can contact you.</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
