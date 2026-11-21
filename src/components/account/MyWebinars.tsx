"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { formatIST, type MyWebinar, paymentsApi } from "@/lib/payments";

/** The "Join" button appears this long before the start. */
const JOIN_EARLY_MINUTES = 15;

/** Dashboard section: webinars the user bought, with the joining link. */
export default function MyWebinars({ sectionTitle }: { sectionTitle: string }) {
  const [webinars, setWebinars] = useState<MyWebinar[] | null>(null);
  const [failed, setFailed] = useState(false);
  // The current time, refreshed every minute, so the Join button appears on time.
  const [now, setNow] = useState(0);

  useEffect(() => {
    paymentsApi.myWebinars().then(
      (r) => {
        setNow(Date.now());
        setWebinars(r.webinars);
      },
      () => setFailed(true),
    );
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="webinars" aria-labelledby="dash-webinars" className="flex scroll-mt-6 flex-col gap-4">
      <h2 id="dash-webinars" className={sectionTitle}>
        My webinars
      </h2>

      {failed ? (
        <p className="m-0 text-[15px] text-ink-soft">We couldn&apos;t load your webinars. Please reload the page.</p>
      ) : !webinars ? (
        <p className="m-0 text-[15px] text-ink-soft">Loading…</p>
      ) : webinars.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-field bg-white px-6 py-8 text-center">
          <h3 className="m-0 font-serif text-[28px] font-medium leading-[1.15]">No webinars yet</h3>
          <p className="m-0 max-w-[420px] text-[15px] text-ink-soft">Book a seat and the date and joining link appear here.</p>
          <Link href="/webinar" className={buttonClass("dark", "min-h-[50px] px-5")}>
            See the next webinar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
          {webinars.map((w) => (
            <WebinarCard key={w.id} webinar={w} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}

function WebinarCard({ webinar, now }: { webinar: MyWebinar; now: number }) {
  const start = new Date(webinar.startsAt).getTime();
  const end = start + webinar.durationMinutes * 60_000;
  const cancelled = webinar.status === "CANCELLED";
  const over = webinar.status === "FINISHED" || now > end;
  const joinable = !cancelled && !over && now >= start - JOIN_EARLY_MINUTES * 60_000;

  const badge = cancelled ? "Cancelled" : over ? "Finished" : "Booked";

  return (
    <article className="flex flex-col gap-3.5 rounded-3xl border border-line bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-rust">Live webinar</p>
          <h3 className="m-0 mt-0.5 font-serif text-[28px] font-medium leading-[1.15]">{webinar.title}</h3>
        </div>
        <span className="flex-none rounded-full bg-sand px-3 py-1 text-xs font-semibold">{badge}</span>
      </div>
      <p className="m-0 text-[15px] text-ink-soft">
        {formatIST(webinar.startsAt)} · {webinar.durationMinutes} minutes
      </p>

      {cancelled ? (
        <p className="m-0 text-sm text-ink-soft">This webinar was cancelled. Your payment is refunded automatically.</p>
      ) : over ? null : webinar.meetingUrl ? (
        joinable ? (
          <a
            href={webinar.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("dark", "mt-auto min-h-[50px] px-5")}
          >
            Join the webinar
          </a>
        ) : (
          <p className="m-0 text-sm text-ink-soft">
            The <strong className="text-ink">Join</strong> button appears here {JOIN_EARLY_MINUTES} minutes before the
            start. Joining link:{" "}
            <a href={webinar.meetingUrl} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-ink underline underline-offset-4">
              {webinar.meetingUrl}
            </a>
          </p>
        )
      ) : (
        <p className="m-0 text-sm text-ink-soft">The joining link appears here before the webinar starts.</p>
      )}
    </article>
  );
}
