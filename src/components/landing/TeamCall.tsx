import { ButtonLink, Eyebrow } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

export default function TeamCall() {
  const price = formatINR(prices.teamCall.amount);

  const points = [
    "Discuss your appearance goals.",
    "Understand which areas need attention.",
    "Get a recommendation on where to start.",
  ];

  return (
    <section id="start" aria-label="Discovery session" className="scroll-mt-28 px-6 pb-20 md:pb-26">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-9 rounded-[36px] bg-peach px-[clamp(24px,5vw,72px)] py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
            <Eyebrow className="text-rust-dark">Not sure where to start?</Eyebrow>
            <h2 className="m-0 max-w-[700px] font-serif text-[clamp(40px,5vw,64px)] font-medium leading-[1.04] tracking-[-0.01em]">
              Let’s figure that out first.
            </h2>
            <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
              Not everyone needs the same approach. Book a discovery session with my team. We’ll understand your goals,
              assess where you currently stand and help you identify the right course or coaching option.
            </p>
            <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
              If you decide to join one of our programmes, your {price} payment is adjusted against the programme price.
              If you decide not to proceed, you receive a full refund. Ask for it on WhatsApp within 15 days of
              booking.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="font-serif text-[80px] font-medium leading-none">{price}</span>
              <span className="inline-block rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white">
                100% refundable if you decide not to join.
              </span>
            </div>
            {prices.teamCall.gst === "extra" && <span className="text-sm text-ink-soft">+ GST</span>}
            <ButtonLink href="/team-call" variant="rust">
              Book Your Discovery Session
            </ButtonLink>
          </div>
        </div>

        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {points.map((point) => (
            <li key={point} className="rounded-[20px] bg-white p-5.5">
              <h3 className="m-0 font-serif text-[26px] font-semibold leading-[1.15]">{point}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
