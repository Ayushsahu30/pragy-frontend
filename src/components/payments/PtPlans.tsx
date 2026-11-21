"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { CheckCircleIcon } from "@/components/icons";
import PromoCodeField from "@/components/payments/PromoCodeField";
import { buttonClass, Eyebrow } from "@/components/ui";
import { type PlanDuration, planDurations, prices, ptPlans, skoolBonusValuePerMonth } from "@/content/prices";
import { ptPlanDetails, ptPlansPage } from "@/content/pt-plans";
import { site } from "@/content/site";
import { accountApi, formatDate } from "@/lib/account";
import { ApiError } from "@/lib/auth";
import { formatINR } from "@/lib/format";
import { checkout, formatPaise, paymentsApi, type PromoPreview } from "@/lib/payments";
import { isPtProduct, PT_PLANS_PATH, ptProductSlug } from "@/lib/pt";
import { useSession } from "@/lib/session";

type CurrentPlan = { name: string; endsAt: string | null } | null;

/**
 * The hidden plans page: the 3 personal coaching plans, each with 1, 3 or 6
 * months. Buying needs a login; the backend decides the price.
 */
export default function PtPlans() {
  const session = useSession();
  const signedIn = session.status === "signed-in";
  const [current, setCurrent] = useState<CurrentPlan>(null);

  // Logged in: does this user already have a plan running?
  useEffect(() => {
    if (!signedIn) return;
    accountApi.overview().then(
      (o) => {
        const plan = o.products.find((p) => p.active && isPtProduct(p.slug));
        setCurrent(plan ? { name: plan.name, endsAt: plan.endsAt } : null);
      },
      () => undefined,
    );
  }, [signedIn]);

  return (
    <section aria-labelledby="plans-title" className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <div className="flex max-w-[760px] flex-col items-start gap-5">
          <Eyebrow>{ptPlansPage.eyebrow}</Eyebrow>
          <h1
            id="plans-title"
            className="m-0 font-serif text-[clamp(48px,6vw,84px)] font-medium leading-none tracking-[-0.01em]"
          >
            {ptPlansPage.title}
          </h1>
          <p className="m-0 text-[19px] text-ink-soft">{ptPlansPage.intro}</p>
        </div>

        {signedIn && current && (
          <p role="status" className="m-0 rounded-3xl border border-ink bg-white p-5 text-[15px]">
            You already have <strong>{current.name}</strong>
            {current.endsAt ? ` until ${formatDate(current.endsAt)}` : ""}. To change or extend it, message my team on{" "}
            <a
              href={`https://wa.me/${site.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline underline-offset-4"
            >
              WhatsApp
            </a>
            .
          </p>
        )}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-stretch gap-5">
          {ptPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} locked={Boolean(current)} />
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-sand pt-6 text-[15px] text-ink-soft">
          <p className="m-0">{ptPlansPage.afterPayment}</p>
          <p className="m-0">
            {ptPlansPage.notSure}{" "}
            <Link href="/team-call" className="font-semibold text-ink underline underline-offset-4">
              Book the {formatINR(prices.teamCall.amount)} call
            </Link>
          </p>
          <p className="m-0 text-sm">{ptPlansPage.safety}</p>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, locked }: { plan: (typeof ptPlans)[number]; locked: boolean }) {
  const router = useRouter();
  const session = useSession();
  const signedIn = session.status === "signed-in";
  const details = ptPlanDetails[plan.id];
  const id = useId();
  const [duration, setDuration] = useState<PlanDuration>("3m");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [promo, setPromo] = useState<PromoPreview | null>(null);
  const productSlug = ptProductSlug(plan.id, duration);
  // A code checked for another length is re-checked by PromoCodeField.
  const discounted = promo && promo.product === productSlug ? promo : null;
  const amount = plan.prices[duration];
  const amountLabel = discounted ? formatPaise(discounted.amountPaise) : formatINR(amount);
  const durationLabel = planDurations.find((d) => d.id === duration)!.label;

  async function buy() {
    setMessage("");
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(PT_PLANS_PATH)}`);
      return;
    }
    setBusy(true);
    try {
      const outcome = await checkout(await paymentsApi.startPlanOrder(productSlug, promo?.code), site.name);
      if (outcome.result === "paid") {
        router.push(`/payment/success?order=${encodeURIComponent(outcome.orderId)}`);
        return;
      }
      if (outcome.result === "failed") {
        router.push(`/payment/failed?product=pt&reason=${encodeURIComponent(outcome.reason)}`);
        return;
      }
      setMessage("Payment not completed. You can try again whenever you are ready.");
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "We couldn't open the payment window. Please try again.");
    }
    setBusy(false);
  }

  return (
    <article aria-labelledby={`${id}-name`} className="flex flex-col gap-5 rounded-[28px] border border-ink bg-white p-7 sm:p-8">
      <div className="flex flex-col gap-2">
        <Eyebrow>{details.label}</Eyebrow>
        <h2 id={`${id}-name`} className="m-0 font-serif text-[48px] font-medium leading-none">
          {plan.name}
        </h2>
        <p className="m-0 text-base text-ink">{details.tagline}</p>
        <p className="m-0 text-[15px] text-ink-soft">
          <strong className="font-semibold text-rust">Best for</strong> {details.bestFor}
        </p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 border-t border-line p-0 pt-5 text-[15px] leading-[1.4]">
        {details.includes.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckCircleIcon className="flex-none text-ink" />
            {item}
          </li>
        ))}
      </ul>

      <p className="m-0 rounded-2xl bg-cream p-4 text-sm text-ink">
        {ptPlansPage.bonus} <span className="text-ink-soft">(worth {formatINR(skoolBonusValuePerMonth)} a month)</span>
      </p>

      <fieldset className="m-0 mt-auto flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-sm font-semibold">Choose how long</legend>
        <div className="grid grid-cols-3 gap-2">
          {planDurations.map((d) => (
            <label
              key={d.id}
              className="flex min-h-[64px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-field bg-white px-1 text-center has-[:checked]:border-ink has-[:checked]:bg-peach has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-rust"
            >
              <input
                type="radio"
                name={`${id}-duration`}
                value={d.id}
                checked={duration === d.id}
                onChange={() => setDuration(d.id)}
                className="sr-only"
              />
              <span className="text-xs text-ink-soft">{d.label}</span>
              <span className="text-[15px] font-semibold">{formatINR(plan.prices[d.id])}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {signedIn && !locked && <PromoCodeField product={productSlug} applied={promo} onChange={setPromo} />}

      {message && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={buy}
        disabled={busy || locked}
        className={buttonClass("dark", "cursor-pointer self-stretch border-0 font-sans disabled:cursor-not-allowed disabled:opacity-60")}
      >
        {busy
          ? "Opening payment…"
          : signedIn
            ? `Buy ${plan.name}, ${durationLabel} · ${amountLabel}`
            : `Log in to buy · ${amountLabel}`}
      </button>
      <span className="text-center text-sm text-ink-soft">Secure payment by Razorpay: UPI, cards and netbanking.</span>
    </article>
  );
}
