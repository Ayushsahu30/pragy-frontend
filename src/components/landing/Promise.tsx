import { Eyebrow, Section, sectionTitleClass } from "@/components/ui";

const points = [
  { title: "Not a template", text: "Every body is different, so every plan is." },
  { title: "Not a bot", text: "No app, no automated replies. A person who knows your body and your goals." },
];

export default function OnePromise() {
  return (
    <Section id="promise" label="One promise" className="pt-0 md:pt-0" innerClassName="flex flex-wrap gap-x-16 gap-y-10">
      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
        <Eyebrow>Before you read anything else</Eyebrow>
        <h2 className={sectionTitleClass}>
          One <em>promise.</em>
        </h2>
      </div>

      <div className="flex min-w-0 flex-[1.6_1_480px] flex-col gap-6">
        <div className="flex flex-col gap-5 rounded-[28px] border border-ink bg-cream p-7 sm:p-9">
          <p className="m-0 font-serif text-[clamp(32px,3.6vw,44px)] font-medium leading-[1.08]">
            Always one on one with Pragy.
          </p>
          <hr className="m-0 border-0 border-t border-sand" />
          <p className="m-0 text-ink-soft">
            Your analysis is done by me, personally. Your diet, workout and looks plan is built by me for your body and
            your goals, not copied from a template.
          </p>
          <p className="m-0 text-ink-soft">When you message, you are talking to me.</p>
        </div>

        <ol className="m-0 flex list-none flex-col p-0">
          {points.map((point, index) => (
            <li key={point.title} className="flex gap-5 border-b border-sand py-5 last:border-b-0">
              <span aria-hidden="true" className="w-10 flex-none font-serif text-[32px] font-semibold leading-none text-rust">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="m-0 text-[17px] font-semibold">{point.title}</h3>
                <p className="m-0 text-[15px] text-ink-soft">{point.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
