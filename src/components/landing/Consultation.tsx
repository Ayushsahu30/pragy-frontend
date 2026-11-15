import { CheckCircleIcon } from "@/components/icons";
import { ButtonLink, Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

const points = [
  "A private call, just you and me",
  "Pick your time slot, then pay",
  "Advice for your body, routine and goal",
];

export default function Consultation() {
  return (
    <Section
      id="one-on-one"
      label="1-on-1 call with Pragy"
      className="bg-cream"
      innerClassName="flex flex-col items-center gap-10 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <Eyebrow>Talk to me directly</Eyebrow>
        <h2 className={`${sectionTitleClass} max-w-[820px]`}>
          Want to talk to me <em>directly?</em>
        </h2>
        <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
          Book a private 30-minute call with me and get direct advice for your situation.
        </p>
      </div>

      <div className="flex w-full max-w-[920px] flex-wrap items-center gap-x-12 gap-y-7 rounded-[28px] border border-ink bg-white p-7 text-left sm:p-9">
        <ul className="m-0 flex min-w-0 flex-[1.3_1_300px] list-none flex-col gap-3.5 p-0 text-base leading-[1.4]">
          {points.map((point) => (
            <li key={point} className="flex gap-3">
              <CheckCircleIcon className="flex-none text-ink" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex min-w-0 flex-[1_1_260px] flex-col items-start gap-3.5">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="font-serif text-[68px] font-medium leading-none">{formatINR(prices.consultation.amount)}</span>
            <span className="inline-block rounded-full bg-peach px-4 py-2 text-[13px] font-semibold">Non-refundable</span>
          </div>
          <span className="text-sm text-ink-soft">
            {prices.consultation.gst === "extra" && "+ GST · "}30 minutes · 1-on-1 with me
          </span>
          <ButtonLink href="/consultation" className="self-stretch">
            Book my 1-on-1 call
          </ButtonLink>
        </div>
      </div>

      <p className="m-0 max-w-[620px] text-[15px] text-ink-soft">
        Please note: this call is not refundable. If you are still unsure, start with the{" "}
        {formatINR(prices.teamCall.amount)} discovery call instead.
      </p>
    </Section>
  );
}
