import { Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

// From page 11 of the brochure.
const steps = [
  {
    title: "Pick your path",
    text: `A course, personal training, or a call. Not sure? Book the ${formatINR(prices.teamCall.amount)} call with the team. Just want advice? Book the 30-minute consultation with me.`,
  },
  { title: "Pay securely", text: "Pay on this website with UPI, card or net banking." },
  { title: "We message you", text: "You get a message from us to begin your onboarding." },
];

export default function HowToStart() {
  return (
    <Section id="how-to-start" label="How to start" innerClassName="flex flex-wrap gap-x-16 gap-y-10">
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
        <Eyebrow>Ready?</Eyebrow>
        <h2 className={sectionTitleClass}>
          How to <em>start.</em>
        </h2>
      </div>
      <ol className="m-0 flex min-w-0 flex-[2_1_480px] list-none flex-col p-0">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-6 border-t border-sand py-6 last:border-b">
            <span aria-hidden="true" className="w-8 flex-none font-serif text-[44px] font-medium leading-none text-rust">
              {index + 1}
            </span>
            <div>
              <h3 className="m-0 font-serif text-[30px] font-medium leading-[1.15]">{step.title}</h3>
              <p className="m-0 mt-1 text-base text-ink-soft">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
