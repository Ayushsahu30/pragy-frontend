import { ButtonLink, Eyebrow } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

// "On the call" points from page 9 of the brochure.
const onTheCall = [
  { title: "Your goal", text: "You tell us your goal and where you are today." },
  { title: "The plans, explained", text: "We explain Premium, Elite and Diamond in plain words." },
  { title: "No pressure", text: "You leave knowing which plan suits you, with no pressure." },
];

export default function TeamCall() {
  const price = formatINR(prices.teamCall.amount);

  return (
    <section id="start" aria-label="Call with the team" className="scroll-mt-28 px-6 pb-20 md:pb-26">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-9 rounded-[36px] bg-peach px-[clamp(24px,5vw,72px)] py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
            <Eyebrow className="text-rust-dark">Not sure which plan?</Eyebrow>
            <h2 className="m-0 max-w-[700px] font-serif text-[clamp(40px,5vw,64px)] font-medium leading-[1.04] tracking-[-0.01em]">
              Talk to the team.
            </h2>
            <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
              A short call where my team explains how the coaching works and which plan fits your goal.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
              <span className="font-serif text-[80px] font-medium leading-none">{price}</span>
              {prices.teamCall.gst === "extra" && <span className="pb-2 text-lg text-ink-soft">+ GST</span>}
            </div>
            <span className="inline-block rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white">
              Full refund if you don’t join
            </span>
            <ButtonLink href="/team-call" variant="rust" className="mt-1">
              Book the {price} call
            </ButtonLink>
          </div>
        </div>

        <p className="m-0 max-w-[760px] text-ink-soft">
          Your {price} is <strong className="font-semibold text-ink">fully adjusted</strong> in your plan if you join. If
          you decide not to join, you get a <strong className="font-semibold text-ink">full refund</strong> of the call
          fee.
        </p>

        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {onTheCall.map((item) => (
            <li key={item.title} className="rounded-[20px] bg-white p-6">
              <h3 className="m-0 font-serif text-[26px] font-semibold leading-[1.15]">{item.title}</h3>
              <p className="m-0 mt-1.5 text-[15px] text-ink-soft">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
