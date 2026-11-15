import { ButtonLink, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";

// "Some examples of what we help with" cards, from the Version D design.
const examples = [
  {
    title: "Physique",
    text: "Example: fat loss, weight gain or muscle, with a training plan matched to your body and goal.",
    card: "bg-peach text-ink",
    muted: "text-ink-soft",
  },
  {
    title: "Nutrition",
    text: "Example: a diet plan you can follow with normal home food.",
    card: "bg-ink text-white",
    muted: "text-mist",
  },
  {
    title: "Grooming and skin",
    text: "Example: a simple daily routine for skin, hair and beard.",
    card: "border border-ink bg-cream text-ink",
    muted: "text-ink-soft",
  },
  {
    title: "Style and presence",
    text: "Example: clothes, posture and habits that make you look sharper.",
    card: "bg-sand text-ink",
    muted: "text-ink-soft",
  },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12">
        <div className="flex min-w-0 flex-[1.1_1_380px] flex-col items-start gap-6">
          <Eyebrow>What I do</Eyebrow>
          <h1
            id="hero-title"
            className="m-0 font-serif text-[clamp(52px,6.6vw,96px)] font-medium leading-[0.98] tracking-[-0.01em]"
          >
            I help people look their <em>best.</em>
          </h1>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            I’m {site.trainerName}, and looksmaxing is what I do. On this website you can book a 1-on-1 session with
            me, take my courses, be part of my community, or get personal coaching.
          </p>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            I show you what to work on first and guide you until the change is visible. More than{" "}
            {site.stats.followers.replace("+", "")} people follow my work.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ButtonLink href="#courses" variant="outline">
              See courses
            </ButtonLink>
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-3.5">
          <p className="m-0 text-[15px] font-semibold">Some examples of what I help with</p>
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
