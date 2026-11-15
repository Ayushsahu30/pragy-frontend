import { ButtonLink, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";

// "What we work on" cards: client's wording, Version D card style.
const examples = [
  {
    title: "Physique & Nutrition",
    text: "Fat loss, muscle development, weight management, training and personalised nutrition built around your body and goals.",
    card: "bg-peach text-ink",
    muted: "text-ink-soft",
  },
  {
    title: "Facial Aesthetics",
    text: "Facial proportions, facial fat, appearance-related habits and realistic approaches to improving your facial presentation.",
    card: "bg-ink text-white",
    muted: "text-mist",
  },
  {
    title: "Skin, Hair & Grooming",
    text: "Skincare, hair care, beard grooming and the everyday details that influence how you present yourself.",
    card: "border border-ink bg-cream text-ink",
    muted: "text-ink-soft",
  },
  {
    title: "Posture, Style & Presence",
    text: "Posture, clothing, sleep and lifestyle habits that help you look and carry yourself better.",
    card: "bg-sand text-ink",
    muted: "text-ink-soft",
  },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12">
        <div className="flex min-w-0 flex-[1.1_1_380px] flex-col items-start gap-6">
          <Eyebrow>{site.name}</Eyebrow>
          <h1
            id="hero-title"
            className="m-0 font-serif text-[clamp(52px,6.6vw,96px)] font-medium leading-[0.98] tracking-[-0.01em]"
          >
            Look better. <em>With a plan.</em>
          </h1>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            A structured approach to looksmaxing. Your appearance is made up of more than one thing. Your physique,
            facial aesthetics, skin, hair, grooming, posture and personal style all play a role.
          </p>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            I’m {site.trainerName}. I help you understand what needs improvement, what deserves your attention first,
            and how to approach it with a structured plan.
          </p>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            Whether you’re starting from scratch or looking to refine what you’ve already built, I’ll help you find the
            right direction. {site.stats.followers} people follow my work.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ButtonLink href="#courses" variant="outline">
              Explore Courses
            </ButtonLink>
            <ButtonLink href="#personal-training" variant="outline">
              Work With Me
            </ButtonLink>
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-3.5">
          <p className="m-0 text-[15px] font-semibold">What we work on: a complete approach to improving your appearance.</p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5 p-0">
            {examples.map((example) => (
              <li
                key={example.title}
                className={`relative flex min-h-[240px] flex-col justify-end gap-1 rounded-3xl p-5.5 ${example.card}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-5.5 top-5.5 text-[11px] font-semibold tracking-[0.18em] ${example.muted}`}
                >
                  [EXAMPLE PHOTO]
                </span>
                <h2 className="m-0 font-serif text-[30px] font-medium leading-[1.1]">{example.title}</h2>
                <p className={`m-0 text-sm leading-[1.45] ${example.muted}`}>{example.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
