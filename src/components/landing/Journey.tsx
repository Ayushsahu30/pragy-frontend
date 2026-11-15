import { Eyebrow, Photo, Section, sectionTitleClass } from "@/components/ui";

// TODO(client): add the month and year of each photo; empty dates are hidden.
const steps = [
  {
    date: "",
    title: "The Starting Point",
    text: "I was overweight. My first step was getting into the gym and taking control of my physique.",
    photo: { src: "/images/journey-01-starting-point.jpg", alt: "Pragy before his transformation", position: "50% 50%" },
  },
  {
    date: "",
    title: "Building My Physique",
    text: "I started losing weight and developing a better understanding of training and nutrition.",
    photo: { src: "/images/journey-02-building-my-physique.jpg", alt: "Pragy flexing during his physique progress", position: "50% 50%" },
  },
  {
    date: "",
    title: "Understanding Looksmaxing",
    photo: { src: "/images/journey-03-understanding-looksmaxing.jpg", alt: "Pragy in glasses and a teal shirt at India Gate", position: "50% 50%" },
    text: "I realised that physique was only one part of the equation. I began paying attention to skin, grooming, facial aesthetics and posture.",
  },
  {
    date: "",
    title: "What I Do Today",
    photo: { src: "/images/journey-04-what-i-do-today.jpg", alt: "Pragy today, with styled hair and a black jacket", position: "50% 50%" },
    text: "I now use that knowledge to educate others and help them approach their own appearance goals with a structured plan.",
  },
];

export default function Journey() {
  return (
    <Section id="journey" label="My transformation" innerClassName="flex flex-col gap-14">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <div className="flex flex-col gap-4">
          <Eyebrow>My transformation</Eyebrow>
          <h2 className={`${sectionTitleClass} max-w-[760px]`}>
            I started by working on <em>myself.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[360px] text-ink-soft">The approach I teach today developed through my own journey.</p>
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
              <Photo
                src={step.photo.src}
                alt={step.photo.alt}
                sizes="(min-width: 768px) 380px, 100vw"
                position={step.photo.position}
                className="h-[220px] min-w-0 max-w-[380px] flex-[1_1_260px] rounded-3xl"
              />
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
