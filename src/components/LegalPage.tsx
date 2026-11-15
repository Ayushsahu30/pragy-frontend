import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui";

/** Shared layout for the legal pages. Styles plain h2, p, ul and a inside. */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[760px] flex-col gap-4">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="m-0 font-serif text-[clamp(44px,6vw,72px)] font-medium leading-none tracking-[-0.01em]">{title}</h1>
        <p className="m-0 text-sm text-ink-soft">Last updated: {updated}</p>
        <div className="mt-6 flex flex-col gap-4 text-base text-ink-soft [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:m-0 [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-[32px] [&_h2]:font-medium [&_h2]:leading-[1.15] [&_h2]:text-ink [&_li]:mt-1.5 [&_p]:m-0 [&_strong]:text-ink [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </article>
  );
}
