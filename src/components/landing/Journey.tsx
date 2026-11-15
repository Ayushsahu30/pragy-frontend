import { Eyebrow, PhotoPlaceholder, Section, sectionTitleClass } from "@/components/ui";

// TODO(client): add the month and year of each photo; empty dates are hidden.
const steps = [
  { date: "", title: "Where I started", text: "I was overweight, so I started going to the gym." },
  { date: "", title: "First changes", text: "I lost the weight, but my face had not changed yet." },
  { date: "", title: "Halfway", text: "I started working on my skin, grooming and posture too." },
  { date: "", title: "Today", text: "I now teach the same method to others." },
];

export default function Journey() {
  return (
    <Section id="journey" label="Trainer transformation" innerClassName="flex flex-col gap-14">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <div className="flex flex-col gap-4">
          <Eyebrow>My own journey</Eyebrow>
          <h2 className={`${sectionTitleClass} max-w-[760px]`}>
            My transformation <em>over time.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[360px] text-ink-soft">I followed the same method I now teach.</p>
      </div>

      <ol className="m-0 flex list-none flex-col p-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li
              key={step.title}
              className={`flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-sand py-7 ${isLast ? "border-b" : ""}`}
            >
              <span
                aria-hidden="true"
                className={`flex h-16 w-16 flex-none items-center justify-center rounded-full font-serif text-[28px] font-semibold ${
                  isLast ? "bg-ink text-white" : "bg-peach text-ink"
                }`}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-[1_1_260px]">
                {step.date && <span className="text-[13px] font-semibold text-rust">{step.date}</span>}
                <h3 className="m-0 mb-1 mt-0.5 font-serif text-[36px] font-medium leading-[1.1]">{step.title}</h3>
                <p className="m-0 text-base text-ink-soft">{step.text}</p>
              </div>
              <PhotoPlaceholder
                dark={isLast}
                label="Photo"
                className="h-[220px] min-w-0 max-w-[380px] flex-[1_1_260px] rounded-3xl"
              />
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
