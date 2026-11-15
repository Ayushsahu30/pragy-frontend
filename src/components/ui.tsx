import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "dark" | "outline" | "peach" | "rust" | "light" | "outlineLight";

const buttonVariants: Record<ButtonVariant, string> = {
  dark: "bg-ink text-white hover:bg-ink-deep",
  outline: "border border-ink text-ink hover:bg-cream",
  peach: "bg-peach text-ink hover:bg-[#ffd9ae]",
  rust: "bg-rust text-white hover:bg-rust-dark",
  light: "bg-cream text-ink hover:bg-white",
  outlineLight: "border border-mist text-white hover:bg-ink-deep",
};

/** Class names for a pill button, for use on <a>, <Link> and <button>. */
export function buttonClass(variant: ButtonVariant = "dark", extra = ""): string {
  return [
    "inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-7",
    "text-[15px] font-semibold no-underline transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust",
    buttonVariants[variant],
    extra,
  ].join(" ");
}

export function ButtonLink({
  href,
  variant = "dark",
  className = "",
  external = false,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
  children: ReactNode;
}) {
  const classes = buttonClass(variant, className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Small uppercase label above a heading. */
export function Eyebrow({ children, className = "text-rust" }: { children: ReactNode; className?: string }) {
  return <span className={`text-xs font-semibold uppercase tracking-[0.22em] ${className}`}>{children}</span>;
}

/** Shared look for section headings (h2). */
export const sectionTitleClass =
  "m-0 font-serif text-[clamp(40px,5vw,64px)] font-medium leading-[1.04] tracking-[-0.01em]";

/** Full-width section with the standard side padding and centred content. */
export function Section({
  id,
  label,
  className = "",
  innerClassName = "",
  children,
}: {
  id?: string;
  label: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-label={label} className={`scroll-mt-28 px-6 py-20 md:py-26 ${className}`}>
      <div className={`mx-auto max-w-[1200px] ${innerClassName}`}>{children}</div>
    </section>
  );
}

/**
 * Grey box shown where a photo will go. Replace with <Image> once the
 * client sends the photos.
 */
export function PhotoPlaceholder({
  label,
  className = "",
  dark = false,
}: {
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`Photo coming soon: ${label}`}
      className={`flex items-center justify-center p-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] ${
        dark ? "bg-ink-deep text-mist" : "bg-sand text-ink-soft"
      } ${className}`}
    >
      [{label}]
    </div>
  );
}
