"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClass, Eyebrow } from "@/components/ui";
import { prices } from "@/content/prices";
import { site } from "@/content/site";
import { type CallProduct, callNames, callPages, callsApi, formatCallTime, type MyCall } from "@/lib/calls";
import { formatINR } from "@/lib/format";
import { PT_PLANS_PATH } from "@/lib/pt";

const card = "rounded-3xl border border-line bg-white p-6";

const offers: Record<CallProduct, { eyebrow: string; title: string; note: string; cta: string }> = {
  "team-call": {
    eyebrow: `Discovery session · ${formatINR(prices.teamCall.amount)}`,
    title: "With my team",
    note: "100% refundable if you decide not to join.",
    cta: `Book ${formatINR(prices.teamCall.amount)} call`,
  },
  consultation: {
    eyebrow: `Private consultation · ${formatINR(prices.consultation.amount)}`,
    title: `With ${site.trainerName}`,
    note: "Non-refundable. Pick your time slot, then pay.",
    cta: "Book a private session",
  },
};

/** Dashboard section: booked calls (with Meet links), and the calls not booked yet. */
export default function MyCalls({ sectionTitle }: { sectionTitle: string }) {
  const [calls, setCalls] = useState<MyCall[] | null>(null);
  // When the list was loaded, to tell past calls from upcoming ones.
  const [now, setNow] = useState(0);

  useEffect(() => {
    callsApi.mine().then(
      (r) => {
        setCalls(r.calls);
        setNow(Date.now());
      },
      () => setCalls([]),
    );
  }, []);

  const live = (calls ?? []).filter((c) => !c.refunded && c.status !== "CANCELLED");
  const booked = new Set(live.map((c) => c.productSlug));
  const notBooked = (Object.keys(offers) as CallProduct[]).filter((p) => !booked.has(p));

  return (
    <section id="calls" aria-labelledby="dash-calls" className="flex scroll-mt-6 flex-col gap-4">
      <h2 id="dash-calls" className={sectionTitle}>
        My calls
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
        {live.map((c) => {
          const past = new Date(c.endsAt).getTime() < now;
          return (
            <article key={c.id} className={`${card} flex flex-col gap-3.5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Eyebrow>{c.productSlug === "team-call" ? "Discovery session" : "Private consultation"}</Eyebrow>
                  <h3 className="m-0 mt-0.5 font-serif text-[28px] font-medium leading-[1.15]">{callNames[c.productSlug]}</h3>
                </div>
                <span
                  className={`flex-none rounded-full px-3 py-1 text-xs font-semibold ${
                    c.status === "NEEDS_NEW_TIME" ? "bg-rust text-white" : past ? "bg-sand" : "bg-peach"
                  }`}
                >
                  {c.status === "NEEDS_NEW_TIME" ? "Pick a new time" : past ? "Done" : "Booked"}
                </span>
              </div>

              {c.status === "NEEDS_NEW_TIME" ? (
                <>
                  <p className="m-0 text-[15px] text-ink-soft">
                    Your payment is received, but the time you picked was taken just before. Pick a new time; you
                    won&apos;t pay again.
                  </p>
                  <Link
                    href={`${callPages[c.productSlug]}?rebook=${encodeURIComponent(c.id)}`}
                    className={buttonClass("dark", "mt-auto min-h-[50px] px-5")}
                  >
                    Pick a new time
                  </Link>
                </>
              ) : (
                <>
                  <p className="m-0 text-[15px]">
                    <strong>{formatCallTime(c.startsAt)}</strong>
                    <span className="text-ink-soft"> · 30 minutes on Google Meet</span>
                  </p>
                  {!past && (
                    <p className="m-0 text-sm text-ink-soft">
                      To move it, use the link in the confirmation email from Cal.com.
                    </p>
                  )}
                  {!past && c.meetingUrl && (
                    <a
                      href={c.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass("dark", "mt-auto min-h-[50px] px-5")}
                    >
                      Join on Google Meet
                    </a>
                  )}
                </>
              )}

              {c.discountCode && (
                <div className="rounded-2xl bg-cream p-4 text-sm">
                  {c.discountCodeUsed ? (
                    <>Your {formatINR(prices.teamCall.amount)} credit was used for your coaching plan.</>
                  ) : (
                    <>
                      Your {formatINR(prices.teamCall.amount)} is adjusted if you join personal coaching. Use code{" "}
                      <strong className="font-mono text-[15px]">{c.discountCode}</strong> when buying a{" "}
                      <Link href={PT_PLANS_PATH} className="font-semibold text-ink underline underline-offset-4">
                        coaching plan
                      </Link>
                      .
                    </>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {calls &&
          notBooked.map((p) => (
            <article key={p} className={`${card} flex flex-col gap-3.5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Eyebrow>{offers[p].eyebrow}</Eyebrow>
                  <h3 className="m-0 mt-0.5 font-serif text-[30px] font-medium leading-[1.1]">{offers[p].title}</h3>
                </div>
                <span className="flex-none rounded-full bg-sand px-3 py-1 text-xs font-semibold">Not booked</span>
              </div>
              <p className="m-0 text-sm text-ink-soft">{offers[p].note}</p>
              <Link href={callPages[p]} className={buttonClass("dark", "mt-auto min-h-[50px] px-5")}>
                {offers[p].cta}
              </Link>
            </article>
          ))}

        {!calls && <p className="m-0 text-[15px] text-ink-soft">Loading…</p>}
      </div>
    </section>
  );
}
