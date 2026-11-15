import { Eyebrow, Section, sectionTitleClass } from "@/components/ui";

// Looksmaxing covers the whole look: body first, then face and the details.
const areas = [
  { title: "Fat loss", text: "Lose the weight with a diet and training plan you can actually follow. I lost it myself." },
  { title: "Weight gain and muscle", text: "Gain size the right way, with food and training matched to your body." },
  { title: "Gym and physique", text: "A workout plan built for your body, your goal and your schedule." },
  { title: "Diet and nutrition", text: "Meals planned around normal food, not a list you quit in a week." },
  { title: "Facial analysis", text: "I study your face myself and tell you what to prioritise first." },
  { title: "Skincare", text: "A routine built for your skin, with what to use, when and why." },
  { title: "Grooming", text: "Hair, beard and the small choices that frame your face." },
  { title: "Posture", text: "How you stand and carry yourself changes how your whole body reads." },
  { title: "Oral health", text: "Teeth, smile and mouth habits that support your overall look." },
];

// Card colours repeat in this order, as in the design.
const cardStyles = [
  { card: "bg-peach text-ink", muted: "text-ink-soft" },
  { card: "bg-ink text-white", muted: "text-mist" },
  { card: "border border-ink bg-cream text-ink", muted: "text-ink-soft" },
  { card: "bg-sand text-ink", muted: "text-ink-soft" },
];

export default function WhatYouGet() {
  return (
    <Section id="what-you-get" label="What you get" className="pt-0 md:pt-0" innerClassName="flex flex-col gap-12">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <div className="flex flex-col gap-4">
          <Eyebrow>What you get</Eyebrow>
          <h2 className={sectionTitleClass}>
            Your whole look, <em>covered.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[380px] text-ink-soft">
          Looksmaxing is more than skincare. It is your body, your diet, your face and how you carry yourself. Here is
          what I work on with you.
        </p>
      </div>

      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 p-0">
        {areas.map((area, index) => {
          const style = cardStyles[index % cardStyles.length];
          return (
            <li key={area.title} className={`flex min-h-[220px] flex-col justify-between gap-8 rounded-3xl p-6 ${style.card}`}>
              <span aria-hidden="true" className="font-serif text-[40px] font-medium leading-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="m-0 font-serif text-[30px] font-medium leading-[1.1]">{area.title}</h3>
                <p className={`m-0 text-[15px] leading-[1.5] ${style.muted}`}>{area.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
