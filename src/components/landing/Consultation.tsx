import { CheckCircleIcon } from "@/components/icons";
import { ButtonLink, Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

// "On the call" points from page 10 of the brochure.
const onTheCall = [
  "I look at where you are and what matters most for your body and your look",
  "I explain what you need to do, step by step, to get good results",
  "You ask me anything, and leave with a clear direction",
];

export default function Consultation() {
  return (
    <Section
      id="one-on-one"
      label="30-minute consultation with Pragy"
      className="bg-cream"
      innerClassName="flex flex-col items-center gap-10 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <Eyebrow>Just need advice?</Eyebrow>
        <h2 className={`${sectionTitleClass} max-w-[820px]`}>
          30 minutes <em>with me.</em>
        </h2>
        <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
          One call with Pragy to explain exactly what you need to do to get good results. No plan to join, no
          commitment.
        </p>
      </div>

      <div className="flex w-full max-w-[920px] flex-wrap items-center gap-x-12 gap-y-7 rounded-[28px] border border-ink bg-white p-7 text-left sm:p-9">
        <ul className="m-0 flex min-w-0 flex-[1.3_1_300px] list-none flex-col gap-3.5 p-0 text-base leading-[1.4]">
          {onTheCall.map((point) => (
            <li key={point} className="flex gap-3">
              <CheckCircleIcon className="flex-none text-ink" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex min-w-0 flex-[1_1_260px] flex-col items-start gap-3.5">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <span className="font-serif text-[68px] font-medium leading-none">{formatINR(prices.consultation.amount)}</span>
            {prices.consultation.gst === "extra" && <span className="pb-2 text-lg text-ink-soft">+ GST</span>}
          </div>
          <span className="text-sm text-ink-soft">30 minutes · 1:1 with Pragy</span>
          <span className="text-sm text-ink-soft">A one-time call. Every person books it once.</span>
          <ButtonLink href="/consultation" className="self-stretch">
            Book the consultation
          </ButtonLink>
          <span className="text-sm text-ink-soft">Pick your time slot, then pay.</span>
        </div>
      </div>

      <p className="m-0 max-w-[620px] text-[15px] text-ink-soft">
        This call is not refundable. If you are still unsure, start with the {formatINR(prices.teamCall.amount)} call
        with the team instead.
      </p>
    </Section>
  );
}
