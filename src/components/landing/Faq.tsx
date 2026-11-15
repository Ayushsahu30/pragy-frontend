import { PlusIcon } from "@/components/icons";
import { Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices, ptPlans } from "@/content/prices";
import { formatINR } from "@/lib/format";

const team = formatINR(prices.teamCall.amount);
const consultation = formatINR(prices.consultation.amount);

const questions = [
  {
    q: "Where should I start?",
    a: `If you are unsure, book the ${team} call with the team. We will point you to the right course or plan.`,
  },
  {
    q: `Is the ${team} call refundable?`,
    a: `Yes. If you decide not to join after the call, you get a full refund. If you join, the ${team} is fully adjusted in your plan.`,
  },
  {
    q: `Is the ${consultation} consultation refundable?`,
    a: "No. The 30-minute consultation with Pragy is not refundable.",
  },
  {
    q: "Is this only about the face?",
    a: "No. Looksmaxing covers your whole look: fat loss, weight gain, gym training, diet, skin, grooming, posture and oral health.",
  },
  {
    q: "Can you help me lose weight or gain weight?",
    a: "Yes. Fat loss, weight gain and building muscle are a core part of the coaching. Your diet and workout plan is built for your body and your goal.",
  },
  {
    q: "Who builds my plan?",
    a: "Pragy, personally. Your plan is built by him for your body and your goals, not copied from a template.",
  },
  {
    q: "How long do I keep the PDF course?",
    a: "You get 30 days of access from the day you buy it.",
  },
  {
    q: `What is in the ${formatINR(prices.videoCourse.amount)} course?`,
    a: "The full video course and our Skool community, plus member-only extras on this website.",
  },
  {
    q: "How much does personal training cost?",
    a: `There are three plans (${ptPlans.map((p) => p.name).join(", ")}) for 1, 3 or 6 months. Apply through the form and the team shares the details on WhatsApp.`,
  },
];

export default function Faq() {
  return (
    <Section id="faq" label="Frequently asked questions" className="bg-cream" innerClassName="flex flex-wrap gap-x-16 gap-y-10">
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
