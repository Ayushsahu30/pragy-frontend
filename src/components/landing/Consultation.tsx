import { CheckCircleIcon } from "@/components/icons";
import { ButtonLink, Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

const points = [
  "Your current physique and appearance goals.",
  "Your skincare, grooming and lifestyle routine.",
  "Areas you want to improve.",
  "What I would prioritise in your situation.",
  "Your next steps.",
];

export default function Consultation() {
  return (
    <Section
      id="one-on-one"
      label="Private consultation with Pragy"
      className="bg-cream"
      innerClassName="flex flex-col items-center gap-10 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <Eyebrow>Direct access to Pragy</Eyebrow>
        <h2 className={`${sectionTitleClass} max-w-[820px]`}>
          Want my personal <em>advice?</em>
        </h2>
        <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
          Sometimes you don’t need an entire coaching programme. You just need an experienced perspective on your
          current situation.
        </p>
        <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
          Book a private 30-minute consultation with me. During the session, we can discuss:
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
            {prices.consultation.gst === "extra" && "+ GST · "}30 minutes · Private 1-on-1 session
          </span>
          <ButtonLink href="/consultation" className="self-stretch">
            Book a Private Session
          </ButtonLink>
        </div>
      </div>

      <p className="m-0 max-w-[620px] text-[15px] text-ink-soft">
        This session is non-refundable. If you’re unsure whether you need personal guidance, start with the
        refundable discovery session.
      </p>
    </Section>
  );
}
