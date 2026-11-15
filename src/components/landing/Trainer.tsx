import { InstagramIcon, YouTubeIcon } from "@/components/icons";
import { ButtonLink, Eyebrow, Photo, Section } from "@/components/ui";
import { site } from "@/content/site";

export default function Trainer() {
  return (
    <Section
      id="trainer"
      label="Meet Pragy"
      className="bg-ink text-white"
      innerClassName="flex flex-wrap items-stretch gap-x-16 gap-y-12"
    >
      <div className="flex min-w-0 flex-[1.3_1_380px] flex-col items-start gap-6">
        <Eyebrow className="text-peach">Meet {site.trainerName}</Eyebrow>
        <h2 className="m-0 font-serif text-[clamp(48px,6vw,84px)] font-medium leading-none tracking-[-0.01em]">
          The person behind <em className="text-peach">the method.</em>
        </h2>
        <p className="m-0 max-w-[600px] text-[19px] text-mist">
          I’m {site.fullName}. My interest in looksmaxing started with my own transformation. I began by working on my
          physique, losing weight and building muscle.
        </p>
        <p className="m-0 max-w-[600px] text-[19px] text-mist">
          But along the way, I realised something: improving your appearance involves much more than just going to the
          gym. I started exploring facial aesthetics, skincare, grooming, nutrition, posture and the different factors
          that contribute to overall appearance.
        </p>
        <p className="m-0 max-w-[600px] text-[19px] text-mist">
          Today, I share what I’ve learned through educational content and personalised coaching. My approach is simple:
          understand the individual, identify the priorities and build a practical strategy around them.
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

        <div className="flex flex-wrap gap-3">
          <ButtonLink href={site.instagram.url} external variant="light">
            <InstagramIcon />
            Follow My Journey on Instagram
          </ButtonLink>
          <ButtonLink href={site.youtube.url} external variant="outlineLight">
            <YouTubeIcon />
            Watch on YouTube
          </ButtonLink>
        </div>
      </div>

      <div className="grid min-w-0 flex-[1_1_340px] grid-cols-2 gap-4">
        <Photo
          src="/images/meet-pragy-main-photo.jpg"
          alt="Pragy in a blue shirt and white trousers in front of a palace"
          sizes="(min-width: 1024px) 540px, 100vw"
          position="50% 42%"
          className="col-span-2 min-h-[360px] rounded-b-3xl rounded-t-[180px]"
        />
        <Photo
          src="/images/meet-pragy-post-1.jpg"
          alt="Pragy sitting on stone steps in a checked shirt and sunglasses"
          sizes="(min-width: 1024px) 270px, 50vw"
          position="50% 8%"
          className="min-h-[150px] rounded-3xl"
        />
        <Photo
          src="/images/meet-pragy-post-2.jpg"
          alt="Pragy at the gym in a black tank top"
          sizes="(min-width: 1024px) 270px, 50vw"
          position="50% 20%"
          className="min-h-[150px] rounded-3xl"
        />
      </div>
    </Section>
  );
}
