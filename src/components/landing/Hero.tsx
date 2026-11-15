import { ButtonLink, Eyebrow, PhotoPlaceholder } from "@/components/ui";
import { site } from "@/content/site";

export default function Hero() {
  // Numbers the client has not sent yet are left out.
  const stats = [
    { value: site.stats.followers, label: "Instagram followers" },
    { value: site.stats.clientsCoached, label: "Clients coached" },
    { value: site.stats.countries, label: "Countries" },
  ].filter((stat) => stat.value);

  return (
    <section aria-labelledby="hero-title" className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12">
        <div className="flex min-w-0 flex-[1.1_1_380px] flex-col items-start gap-6">
          <Eyebrow>Your guide to working with Pragy</Eyebrow>
          <h1
            id="hero-title"
            className="m-0 font-serif text-[clamp(52px,6.6vw,96px)] font-medium leading-[0.98] tracking-[-0.01em]"
          >
            Looksmaxing, <em>one on one.</em>
          </h1>
          <p className="m-0 max-w-[560px] text-[19px] text-ink-soft">
            Fat loss, weight gain, gym, diet, skin, grooming and posture. One plan built by Pragy himself for your body
            and your goals, not copied from a template.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ButtonLink href="#start">Find the right plan</ButtonLink>
            <ButtonLink href="#courses" variant="outline">
              See courses
            </ButtonLink>
          </div>

          {stats.length > 0 && (
            <dl className="m-0 mt-6 flex w-full flex-wrap gap-x-12 gap-y-4 border-t border-line pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="text-sm text-ink-soft">{stat.label}</dt>
                  <dd className="m-0 font-serif text-[44px] font-medium leading-none">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="min-w-0 flex-[1_1_360px]">
          <PhotoPlaceholder
            label="Cover photo of Pragy"
            className="aspect-[4/5] max-h-[640px] w-full rounded-b-[28px] rounded-t-[220px]"
          />
        </div>
      </div>
    </section>
  );
}
