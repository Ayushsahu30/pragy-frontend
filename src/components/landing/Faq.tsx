import { PlusIcon } from "@/components/icons";
import { Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

const team = formatINR(prices.teamCall.amount);

const questions = [
  {
    q: "Where should I start?",
    a: `If you are unsure, book the ${team} discovery call. My team will point you to the right course or plan.`,
  },
  {
    q: `Is the ${team} call refundable?`,
    a: "Yes. If you decide not to join after the call, it is refunded in full. If you join, it comes off the price.",
  },
  {
    q: `Is the ${formatINR(prices.consultation.amount)} call refundable?`,
    a: "No. The 1-on-1 call with me is not refundable.",
  },
  {
    q: "Can you help me lose weight or gain weight?",
    a: "Yes. Fat loss, weight gain and building muscle are a big part of what I teach, along with diet, skin, grooming and posture.",
  },
  {
    q: "How long do I keep the PDF course?",
    a: "You get 30 days of access from the day you buy it.",
  },
  {
    q: `What is in the ${formatINR(prices.videoCourse.amount)} course?`,
    a: "My full video course and my Skool community, plus member-only extras.",
  },
];

export default function Faq() {
  return (
    <Section id="faq" label="Frequently asked questions" innerClassName="flex flex-wrap gap-x-16 gap-y-10">
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className={sectionTitleClass}>
          Questions, <em>answered.</em>
        </h2>
      </div>
      <div className="flex min-w-0 flex-[2_1_480px] flex-col border-b border-sand">
        {questions.map((item, index) => (
          <details key={item.q} className={`group border-t ${index === 0 ? "border-ink" : "border-sand"}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 font-serif text-[26px] font-medium leading-[1.2] sm:text-[28px]">{item.q}</h3>
              <PlusIcon className="flex-none transition-transform group-open:rotate-45" />
            </summary>
            <p className="m-0 pb-6 text-[15px] text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
