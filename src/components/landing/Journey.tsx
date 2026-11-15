import { Eyebrow, PhotoPlaceholder, Section, sectionTitleClass } from "@/components/ui";

// Pragy's story, from page 2 of the brochure.
const steps = [
  { title: "Where I started", text: "I was fat. So I started going to the gym.", photo: "Before photo" },
  {
    title: "The weight came off",
    text: "I lost the weight, but my face did not change. That was the part I had missed.",
    photo: "After the weight loss",
  },
  {
    title: "Face first",
    text: "Then I started putting my face first: the skin, the grooming, the posture, the details nobody explains. That is when everything changed.",
    photo: "Face-first progress",
  },
  {
    title: "Today",
    text: "Now I teach exactly that, one on one, so you do not spend years figuring it out the way I did.",
    photo: "Now photo",
  },
];

export default function Journey() {
  return (
    <Section id="journey" label="Pragy's own journey" innerClassName="flex flex-col gap-14">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <div className="flex flex-col gap-4">
          <Eyebrow>My own journey</Eyebrow>
          <h2 className={`${sectionTitleClass} max-w-[760px]`}>
            I went through it <em>first.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[360px] text-ink-soft">I follow the same method I now teach.</p>
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
                <h3 className="m-0 mb-1 font-serif text-[36px] font-medium leading-[1.1]">{step.title}</h3>
                <p className="m-0 text-base text-ink-soft">{step.text}</p>
              </div>
              <PhotoPlaceholder
                dark={isLast}
                label={step.photo}
                className="h-[220px] min-w-0 max-w-[380px] flex-[1_1_260px] rounded-3xl"
              />
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
