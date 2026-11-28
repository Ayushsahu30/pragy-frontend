"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LockedProducts from "@/components/account/LockedProducts";
import MyCalls from "@/components/account/MyCalls";
import MyCourses from "@/components/account/MyCourses";
import MyPayments from "@/components/account/MyPayments";
import MyVault from "@/components/account/MyVault";
import MyWebinars from "@/components/account/MyWebinars";
import ProfileForm from "@/components/auth/ProfileForm";
import { buttonClass, Eyebrow } from "@/components/ui";
import { prices } from "@/content/prices";
import { site } from "@/content/site";
import { accountApi, type AccountOverview, formatDate } from "@/lib/account";
import { formatINR } from "@/lib/format";
import { isPtProduct } from "@/lib/pt";
import { signOut, useSession } from "@/lib/session";

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#webinars", label: "My webinars" },
  { href: "#courses", label: "My courses" },
  { href: "#vault", label: "Members' vault" },
  { href: "#calls", label: "My calls" },
  { href: "#payments", label: "Payments & receipts" },
  { href: "#profile", label: "Profile" },
];

const sectionTitle = "m-0 font-serif text-[clamp(32px,3.4vw,40px)] font-medium leading-[1.1]";
const card = "rounded-3xl border border-line bg-white p-6";

/**
 * "My account": what the user owns, badges, webinars, courses, vault, calls,
 * payments and profile. Calls are added in Phase 7.
 */
export default function Dashboard() {
  const router = useRouter();
  const session = useSession();
  const [overview, setOverview] = useState<AccountOverview | null>(null);
  const ready = session.status === "signed-in" && !session.user.needsProfile;

  // Owned products, badges and counts.
  useEffect(() => {
    if (!ready) return;
    accountApi.overview().then(setOverview, () => undefined);
  }, [ready]);

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
  // The running personal coaching plan, if any.
  const coachingPlan = overview?.products.find((p) => p.active && isPtProduct(p.slug)) ?? null;
  const nav = coachingPlan
    ? [...navItems.slice(0, 1), { href: "#coaching", label: "My coaching" }, ...navItems.slice(1)]
    : navItems;
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
            {nav.map((item, index) => (
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
          {user.role === "ADMIN" && (
            <Link href="/admin" className={buttonClass("outlineLight", "min-h-[50px] px-5")}>
              Admin
            </Link>
          )}
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
            {overview && overview.badges.length > 0 && (
              <ul aria-label="Your badges" className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
                {overview.badges.map((b) => (
                  <li key={b.label} className="rounded-full bg-peach px-3.5 py-1.5 text-sm font-semibold">
                    {b.label}
                    {b.endsAt && <span className="font-normal text-ink-soft"> · until {formatDate(b.endsAt)}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <dl className="m-0 grid w-full max-w-[440px] grid-cols-3 gap-2.5">
            {[
              [overview ? String(overview.stats.activeCourses) : "…", "Active courses"],
              [overview ? String(overview.stats.upcomingWebinars) : "…", "Upcoming webinars"],
              [overview ? String(overview.stats.payments) : "…", "Payments"],
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

        {coachingPlan && (
          <section id="coaching" aria-labelledby="dash-coaching" className="flex scroll-mt-6 flex-col gap-4">
            <h2 id="dash-coaching" className={sectionTitle}>
              My coaching
            </h2>
            <article className={`${card} flex flex-col gap-3.5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-rust">Personal coaching</p>
                  <h3 className="m-0 mt-0.5 font-serif text-[28px] font-medium leading-[1.15]">{coachingPlan.name}</h3>
                </div>
                <span className="flex-none rounded-full bg-peach px-3 py-1 text-xs font-semibold">Active</span>
              </div>
              <p className="m-0 text-[15px] text-ink-soft">
                {coachingPlan.endsAt ? `Your plan runs until ${formatDate(coachingPlan.endsAt)}.` : "Your plan is active."} My team
                messages you on WhatsApp for onboarding and check-ins.
              </p>
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("dark", "min-h-[50px] self-start px-5")}
              >
                Message my team on WhatsApp
              </a>
            </article>
          </section>
        )}

        <MyWebinars sectionTitle={sectionTitle} />

        <MyCourses sectionTitle={sectionTitle} />

        <MyVault sectionTitle={sectionTitle} isMember={(overview?.stats.activeCourses ?? 0) > 0} />

        {overview && (
          <LockedProducts
            sectionTitle={sectionTitle}
            owned={
              new Set([
                ...overview.products.filter((p) => p.active).map((p) => p.slug),
                ...(overview.stats.upcomingWebinars > 0 ? ["webinar"] : []),
                ...(coachingPlan ? ["personal-training"] : []),
              ])
            }
          />
        )}

        <MyCalls sectionTitle={sectionTitle} />

        <MyPayments sectionTitle={sectionTitle} />

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
