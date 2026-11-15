import { InstagramIcon } from "@/components/icons";
import { ButtonLink, Eyebrow, PhotoPlaceholder, Section } from "@/components/ui";
import { site } from "@/content/site";

export default function Trainer() {
  return (
    <Section
      id="trainer"
      label="About the trainer"
      className="bg-ink text-white"
      innerClassName="flex flex-wrap items-stretch gap-x-16 gap-y-12"
    >
      <div className="flex min-w-0 flex-[1.3_1_380px] flex-col items-start gap-6">
        <Eyebrow className="text-peach">Meet your trainer</Eyebrow>
        <h2 className="m-0 font-serif text-[clamp(48px,6vw,84px)] font-medium leading-none tracking-[-0.01em]">
          Hey, I’m <em className="text-peach">{site.trainerName}.</em>
        </h2>
        <p className="m-0 max-w-[600px] text-[19px] text-mist">
          I lost the weight in the gym, then learned that skin, grooming and posture matter just as much. Today I
          teach the same method I used on myself.
        </p>

        <div className="mt-2 grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4">
          <div className="flex flex-col gap-1 rounded-3xl bg-ink-deep p-6">
            <span className="text-[13px] font-semibold text-mist">Instagram</span>
            <span className="break-words text-[22px] font-semibold">@{site.instagram.handle}</span>
          </div>
          <div className="flex flex-col rounded-3xl bg-peach p-6 text-ink">
            <span className="font-serif text-[56px] font-medium leading-none">{site.stats.followers}</span>
            <span className="text-sm text-ink-soft">Instagram followers</span>
          </div>
        </div>

        <ButtonLink href={site.instagram.url} external variant="light">
          <InstagramIcon />
          Follow me on Instagram
        </ButtonLink>
      </div>

      <div className="grid min-w-0 flex-[1_1_340px] grid-cols-2 gap-4">
        <PhotoPlaceholder dark label="Photo of Pragy" className="col-span-2 min-h-[360px] rounded-b-3xl rounded-t-[180px]" />
        <PhotoPlaceholder dark label="Post 1" className="min-h-[150px] rounded-3xl" />
        <PhotoPlaceholder dark label="Post 2" className="min-h-[150px] rounded-3xl" />
      </div>
    </Section>
  );
}
