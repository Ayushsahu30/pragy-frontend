"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

const LENGTH = 6;

/**
 * Six boxes for the email code. Typing moves to the next box, Backspace
 * moves back, and pasting the whole code fills all six. Phones can fill
 * it in from the email automatically.
 */
export default function CodeInput({
  value,
  onChange,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");
  const focusBox = (index: number) => refs.current[Math.max(0, Math.min(LENGTH - 1, index))]?.focus();

  function setDigitsFrom(index: number, typed: string) {
    const clean = typed.replace(/\D/g, "");
    if (!clean) return;
    const next = digits.slice();
    for (let i = 0; i < clean.length && index + i < LENGTH; i++) next[index + i] = clean[i];
    onChange(next.join("").slice(0, LENGTH));
    focusBox(index + clean.length);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = digits.slice();
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        focusBox(index - 1);
      }
      onChange(next.join(""));
    } else if (event.key === "ArrowLeft") {
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      focusBox(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    setDigitsFrom(index, event.clipboardData.getData("text"));
  }

  const firstEmpty = digits.findIndex((d) => !d);

  return (
    <fieldset className="m-0 border-0 p-0" disabled={disabled}>
      <legend className="mb-2.5 p-0 text-sm font-semibold">Your code</legend>
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
        {digits.map((digit, index) => {
          const active = index === (firstEmpty === -1 ? LENGTH - 1 : firstEmpty);
          return (
            <input
              key={index}
              ref={(el) => {
                refs.current[index] = el;
              }}
              aria-label={`Digit ${index + 1}`}
              aria-invalid={invalid || undefined}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={LENGTH}
              value={digit}
              onChange={(e) => setDigitsFrom(index, e.target.value.slice(digit ? 1 : 0) || e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(index, e)}
              onFocus={(e) => e.target.select()}
              className={`h-14 min-w-0 rounded-2xl border-2 bg-white text-center font-serif text-[28px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rust sm:h-16 sm:text-[32px] ${
                invalid
                  ? "border-rust"
                  : digit
                    ? "border-ink"
                    : active
                      ? "border-rust bg-peach"
                      : "border-field"
              }`}
            />
          );
        })}
      </div>
    </fieldset>
  );
}
