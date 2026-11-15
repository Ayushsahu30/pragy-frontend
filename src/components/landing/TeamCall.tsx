import { ButtonLink, Eyebrow } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatINR } from "@/lib/format";

export default function TeamCall() {
  const price = formatINR(prices.teamCall.amount);

  const points = [
    { title: "The right place for you", text: "My team tells you which course or plan fits you." },
    { title: "Not joining? Money back", text: "Refunded in full if you decide not to join." },
    { title: "Joining? It counts", text: `If you join, the ${price} comes off the price.` },
  ];

  return (
    <section id="start" aria-label="Where to start" className="scroll-mt-28 px-6 pb-20 md:pb-26">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-9 rounded-[36px] bg-peach px-[clamp(24px,5vw,72px)] py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
            <Eyebrow className="text-rust-dark">Still confused?</Eyebrow>
            <h2 className="m-0 max-w-[700px] font-serif text-[clamp(40px,5vw,64px)] font-medium leading-[1.04] tracking-[-0.01em]">
              Not sure where to start? Start with a {price} call.
            </h2>
            <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">
              Talk to my team. They look at your goal and tell you exactly where you should begin. If you decide not to
              join, you get your money back.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="font-serif text-[80px] font-medium leading-none">{price}</span>
              <span className="inline-block rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white">
                100% refundable
              </span>
            </div>
            {prices.teamCall.gst === "extra" && <span className="text-sm text-ink-soft">+ GST</span>}
            <ButtonLink href="/team-call" variant="rust">
              Book my {price} call
            </ButtonLink>
          </div>
        </div>

        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {points.map((point) => (
            <li key={point.title} className="rounded-[20px] bg-white p-5.5">
              <h3 className="m-0 font-serif text-[26px] font-semibold leading-[1.15]">{point.title}</h3>
              <p className="m-0 mt-1.5 text-[15px] text-ink-soft">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
