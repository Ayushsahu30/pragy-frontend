import Image from "next/image";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";

// "What we work on" cards: a real client's before/after collage on each
// (before on the left, after on the right). Leave `image` empty to show the
// plain coloured card instead.
const examples: { title: string; image: string; alt: string; card: string; muted: string }[] = [
  {
    title: "Physique & Nutrition",
    image: "/images/card-physique-nutrition-before-after.jpg",
    alt: "Client before and after: from a soft midsection to a leaner, more muscular physique",
    card: "bg-peach text-ink",
    muted: "text-ink-soft",
  },
  {
    title: "Facial Aesthetics",
    image: "/images/card-facial-aesthetics-before-after.jpg",
    alt: "Client before and after: a sharper, more defined face",
    card: "bg-ink text-white",
    muted: "text-mist",
  },
  {
    title: "Skin, Hair & Grooming",
    image: "/images/card-skin-hair-grooming-before-after.jpg",
    alt: "Client before and after: a styled haircut and clearer skin",
    card: "border border-ink bg-cream text-ink",
    muted: "text-ink-soft",
  },
  {
    title: "Posture, Style & Presence",
    image: "/images/card-posture-style-presence-before-after.jpg",
    alt: "Client before and after: a more confident look, hairstyle and presence",
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
            I help people look their <em>best.</em>
          </h1>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            I’m {site.trainerName}, and I help people improve their overall appearance through a structured,
            personalized approach to maximizing your looks.
          </p>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            Our approach covers every major aspect of your appearance, including facial aesthetics, physique, skin
            health, hair, grooming, posture, and personal style.
          </p>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            We start by identifying the areas with the greatest potential for improvement, then build a personalized
            strategy to help you work on them systematically. From understanding what needs attention to implementing
            the right changes, we guide you through the process of improving your appearance.
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
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-3.5">
            {examples.map((example) => (
              <li
                key={example.title}
                className={`relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-3xl p-4 sm:min-h-[240px] sm:p-5.5 ${
                  example.image ? "bg-ink text-white" : example.card
                }`}
              >
                {example.image ? (
                  <>
                    <Image
                      src={example.image}
                      alt={example.alt}
                      fill
                      sizes="(min-width: 1024px) 270px, 50vw"
                      className="object-cover object-top"
                    />
                    {/* Dark fade at the bottom so the title stays readable on any photo. */}
                    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:left-3 sm:top-3 sm:text-[11px]">
                      Before
                    </span>
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-peach px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink sm:right-3 sm:top-3 sm:text-[11px]">
                      After
                    </span>
                  </>
                ) : (
                  <span
                    aria-hidden="true"
                    className={`absolute left-4 top-4 text-[11px] font-semibold tracking-[0.18em] sm:left-5.5 sm:top-5.5 ${example.muted}`}
                  >
                    [EXAMPLE PHOTO]
                  </span>
                )}
                <h2 className="relative m-0 font-serif text-[22px] font-medium leading-[1.1] sm:text-[30px]">{example.title}</h2>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
