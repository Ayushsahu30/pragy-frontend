import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

type Locked = { slug: string; eyebrow: string; title: string; note: string; href: string; cta: string };

/** Everything that can be unlocked, in the order shown. */
const all: Locked[] = [
  {
    slug: "pdf-course",
    eyebrow: `PDF course · ${formatINR(prices.pdfCourse.amount)}`,
    title: "The Starter Guide",
    note: "Read it here for 30 days. Unlocks the PDF Member badge and bonus files.",
    href: "/pdf-course",
    cta: "See the course",
  },
  {
    slug: "webinar",
    eyebrow: `Live webinar · ${formatINR(prices.webinar.amount)}`,
    title: "Webinar with Pragy",
    note: "Join the next live session and ask your questions.",
    href: "/webinar",
    cta: "See the next date",
  },
  {
    slug: "video-course",
    eyebrow: `Video course · ${formatINR(prices.videoCourse.amount)}`,
    title: "Video course & community",
    note: "The full video course with the members' community.",
    href: "/video-course",
    cta: "See the course",
  },
  {
    slug: "personal-training",
    eyebrow: "Personal coaching",
    title: "Coaching with Pragy",
    note: "A plan built around you, with regular check-ins.",
    href: "/personal-training",
    cta: "Apply for coaching",
  },
];

/** "Locked" cards: what the user does not have yet, linking to each sales page. */
export default function LockedProducts({ owned, sectionTitle }: { owned: Set<string>; sectionTitle: string }) {
  const locked = all.filter((p) => !owned.has(p.slug));
  if (locked.length === 0) return null;

  return (
    <section id="explore" aria-labelledby="dash-explore" className="flex scroll-mt-6 flex-col gap-4">
      <h2 id="dash-explore" className={sectionTitle}>
        Unlock more
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
        {locked.map((p) => (
          <article key={p.slug} className="flex flex-col gap-3 rounded-3xl border border-line bg-white/70 p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{p.eyebrow}</p>
              <span className="flex-none rounded-full bg-sand px-2.5 py-1 text-xs font-semibold">
                <LockIcon /> Locked
              </span>
            </div>
            <h3 className="m-0 font-serif text-[24px] font-medium leading-[1.15]">{p.title}</h3>
            <p className="m-0 text-sm text-ink-soft">{p.note}</p>
            <Link href={p.href} className={buttonClass("outline", "mt-auto min-h-[46px] bg-white px-5")}>
              {p.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="mr-1 inline align-[-1px]">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
