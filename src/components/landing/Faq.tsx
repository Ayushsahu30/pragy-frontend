import { PlusIcon } from "@/components/icons";
import { Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

const team = formatINR(prices.teamCall.amount);

const questions = [
  {
    q: "Where should I start?",
    a: `If you’re unsure, book the ${team} discovery session. My team will understand your goals and recommend the most suitable starting point.`,
  },
  {
    q: `Is the ${team} discovery session refundable?`,
    a: "Yes. If you decide not to join a programme, the entire amount is refunded. Ask for the refund on WhatsApp within 15 days of booking. If you join, the payment is adjusted against your programme price.",
  },
  {
    q: `Is the ${formatINR(prices.consultation.amount)} private consultation refundable?`,
    a: "No. This is a separate, non-refundable 30-minute consultation directly with Pragy.",
  },
  {
    q: "Can I get a refund on anything else?",
    a: "No. Only the discovery session is refundable. Courses, the private consultation and coaching plans are non-refundable. A webinar is refunded only if it is cancelled.",
  },
  {
    q: "Can you help with both weight loss and muscle gain?",
    a: "Yes. Physique and body composition are among the areas covered through personalised coaching.",
  },
  {
    q: "How long do I get access to the PDF course?",
    a: "The PDF course comes with 30 days of access.",
  },
  {
    q: `What is included in the ${formatINR(prices.videoCourse.amount)} course?`,
    a: "The complete video course, access to the Skool community and additional member resources.",
  },
  {
    q: "Do I need personal coaching to improve my appearance?",
    a: "No. You can start with the self-paced courses. Personal coaching is for people who want individualised guidance and ongoing support.",
  },
  {
    q: "How do I apply for personal coaching?",
    a: "Complete the application form on this website. You’ll be redirected to WhatsApp to send your details to my team.",
  },
];

export default function Faq() {
  return (
    <Section id="faq" label="Frequently asked questions" innerClassName="flex flex-wrap gap-x-16 gap-y-10">
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className={sectionTitleClass}>
          Frequently asked <em>questions.</em>
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
