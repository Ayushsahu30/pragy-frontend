"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileForm from "@/components/auth/ProfileForm";
import { buttonClass, Eyebrow } from "@/components/ui";
import { prices } from "@/content/prices";
import { site } from "@/content/site";
import { formatINR } from "@/lib/format";
import { signOut, useSession } from "@/lib/session";

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#courses", label: "My courses" },
  { href: "#calls", label: "My calls" },
  { href: "#payments", label: "Payments & receipts" },
  { href: "#profile", label: "Profile" },
];

const sectionTitle = "m-0 font-serif text-[clamp(32px,3.4vw,40px)] font-medium leading-[1.1]";
const card = "rounded-3xl border border-line bg-white p-6";
const emptyCard = "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-field bg-white px-6 py-8 text-center";

/**
 * "My account" for a new user (design: "Dashboard – New user"). Courses, calls
 * and payments are empty until buying is built (Phases 4 to 7).
 */
export default function Dashboard() {
  const router = useRouter();
  const session = useSession();

  // Not logged in (or logged out from another device): go to login, then come back.
  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent("/dashboard")}`);
    if (session.status === "signed-in" && session.user.needsProfile) router.replace(`/welcome?next=${encodeURIComponent("/dashboard")}`);
  }, [session, router]);

  if (session.status !== "signed-in") {
    return (
      <main id="main" className="flex min-h-dvh items-center justify-center bg-cream">
        <p className="m-0 text-ink-soft">Loading your account…</p>
      </main>
    );
  }

  const { user } = session;
  const firstName = (user.name ?? "").trim().split(/\s+/)[0] || "there";

  async function logOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <aside className="flex flex-col gap-6 bg-ink px-6 py-6 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-[280px] lg:flex-none lg:gap-8 lg:py-8">
        <Link
          href="/"
          className="w-fit rounded font-serif text-[30px] font-semibold leading-none text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
        >
          {site.name}
        </Link>
        <nav aria-label="Dashboard">
          <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 text-[15px] lg:flex-col">
            {navItems.map((item, index) => (
              <li key={item.href} className="flex-none">
                <a
                  href={item.href}
                  className={`flex min-h-[46px] items-center whitespace-nowrap rounded-[14px] px-3.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach ${
                    index === 0 ? "bg-[#5a4c40] font-semibold text-white" : "text-[#e9e1d8] hover:bg-[#5a4c40]"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-3 border-t border-[#5a4c40] pt-5 lg:mt-auto lg:flex-col lg:items-stretch">
          <Link href="/#start" className={buttonClass("peach", "min-h-[50px] px-5")}>
            Book a call
          </Link>
          <button
            type="button"
            onClick={logOut}
            className="min-h-11 cursor-pointer rounded border-0 bg-transparent p-0 text-left font-sans text-[15px] text-[#e9e1d8] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
          >
            Log out
          </button>
        </div>
      </aside>

      <main id="main" className="flex min-w-0 flex-1 flex-col gap-9 px-[clamp(20px,4vw,56px)] pb-20 pt-10">
        <section id="overview" aria-labelledby="dash-title" className="flex scroll-mt-6 flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="flex flex-col gap-2">
            <Eyebrow>My dashboard</Eyebrow>
            <h1 id="dash-title" className="m-0 font-serif text-[clamp(42px,4.6vw,60px)] font-medium leading-none">
              Welcome, {firstName}.
            </h1>
          </div>
          <dl className="m-0 grid w-full max-w-[440px] grid-cols-3 gap-2.5">
            {[
              ["0", "Active courses"],
              ["0", "Upcoming calls"],
              ["0", "Payments"],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse rounded-[20px] border border-line bg-white px-4 py-3.5">
                <dt className="text-[13px] text-ink-soft">{label}</dt>
                <dd className="m-0 font-serif text-[36px] font-semibold leading-none">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-3xl bg-ink p-6 text-white">
          <div>
            <Eyebrow className="text-peach">Start here</Eyebrow>
            <h2 className="m-0 mb-1 mt-1 font-serif text-[30px] font-medium leading-[1.1]">Not sure where to begin?</h2>
            <p className="m-0 text-[15px] text-[#e9e1d8]">
              Book the {formatINR(prices.teamCall.amount)} discovery session, refunded if you don&apos;t join, or browse
              the courses.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/team-call" className={buttonClass("peach", "min-h-[50px] px-5")}>
              Book {formatINR(prices.teamCall.amount)} call
            </Link>
            <Link href="/#courses" className={buttonClass("outlineLight", "min-h-[50px] px-5")}>
              Browse courses
            </Link>
          </div>
        </div>

        <section id="courses" aria-labelledby="dash-courses" className="flex scroll-mt-6 flex-col gap-4">
          <h2 id="dash-courses" className={sectionTitle}>
            My courses
          </h2>
          <div className={emptyCard}>
            <h3 className="m-0 font-serif text-[28px] font-medium leading-[1.15]">No courses yet</h3>
            <p className="m-0 max-w-[420px] text-[15px] text-ink-soft">Courses you buy appear here with their access period.</p>
            <Link href="/#courses" className={buttonClass("dark", "min-h-[50px] px-5")}>
              Browse courses
            </Link>
          </div>
        </section>

        <section id="calls" aria-labelledby="dash-calls" className="flex scroll-mt-6 flex-col gap-4">
          <h2 id="dash-calls" className={sectionTitle}>
            My calls
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
            {[
              {
                eyebrow: `Discovery session · ${formatINR(prices.teamCall.amount)}`,
                title: "With my team",
                note: "100% refundable if you decide not to join.",
                href: "/team-call",
                cta: `Book ${formatINR(prices.teamCall.amount)} call`,
              },
              {
                eyebrow: `Private consultation · ${formatINR(prices.consultation.amount)}`,
                title: `With ${site.trainerName}`,
                note: "Non-refundable. Pick your time slot, then pay.",
                href: "/consultation",
                cta: "Book a private session",
              },
            ].map((call) => (
              <article key={call.title} className={`${card} flex flex-col gap-3.5`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Eyebrow>{call.eyebrow}</Eyebrow>
                    <h3 className="m-0 mt-0.5 font-serif text-[30px] font-medium leading-[1.1]">{call.title}</h3>
                  </div>
                  <span className="flex-none rounded-full bg-sand px-3 py-1 text-xs font-semibold">Not booked</span>
                </div>
                <p className="m-0 text-sm text-ink-soft">{call.note}</p>
                <Link href={call.href} className={buttonClass("dark", "mt-auto min-h-[50px] px-5")}>
                  {call.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="payments" aria-labelledby="dash-payments" className="flex scroll-mt-6 flex-col gap-4">
          <h2 id="dash-payments" className={sectionTitle}>
            Payments &amp; receipts
          </h2>
          <div className={emptyCard}>
            <h3 className="m-0 font-serif text-[26px] font-medium">No payments yet</h3>
            <p className="m-0 text-[15px] text-ink-soft">Receipts for everything you buy will appear here.</p>
          </div>
        </section>

        <section id="profile" aria-labelledby="dash-profile" className="flex scroll-mt-6 flex-col gap-4">
          <h2 id="dash-profile" className={sectionTitle}>
            Profile
          </h2>
          <div className={`${card} flex flex-wrap gap-x-12 gap-y-6`}>
            <div
              aria-hidden="true"
              className="flex h-24 w-24 flex-none items-center justify-center rounded-full bg-peach font-serif text-[40px] font-semibold"
            >
              {(user.name || user.email).trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-[1_1_280px]">
              <ProfileForm user={user} submitLabel="Save changes" />
              <p className="m-0 mt-4 text-[13px] text-ink-soft">Your account works on one device at a time.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
