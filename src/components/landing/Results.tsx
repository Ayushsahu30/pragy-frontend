import { ArrowRightIcon } from "@/components/icons";
import { Eyebrow, PhotoPlaceholder, Section, sectionTitleClass } from "@/components/ui";
import { site } from "@/content/site";

const process = ["Understand where you are", "Build your plan", "Guide you through it"];

// TODO(client): Gaurav's time frame and words, then two more clients.
const featured = {
  name: "Gaurav",
  summary: "[Time taken] · Face, posture, oral health and body composition",
  quote: "[His result, in his own words. One or two lines.]",
};

const moreClients = ["Client name", "Client name"];

export default function Results() {
  return (
    <Section id="results" label="Client transformations" className="bg-cream" innerClassName="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Eyebrow>Client results</Eyebrow>
        <h2 className={`${sectionTitleClass} max-w-[760px]`}>
          How I help clients <em>transform.</em>
        </h2>
      </div>

      <ol className="m-0 flex list-none flex-wrap gap-3 p-0">
        {process.map((step, index) => (
          <li
            key={step}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-2.5 pl-2.5 pr-5 text-[15px] font-semibold"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-peach text-sm font-bold"
            >
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <article className="flex flex-wrap items-center gap-x-12 gap-y-7 rounded-[28px] border border-line bg-white p-5 sm:p-7">
        <div className="grid min-w-0 flex-[1.2_1_340px] grid-cols-2 gap-2.5">
          <PhotoPlaceholder label="Before" className="h-[clamp(220px,40vw,340px)] rounded-[20px]" />
          <PhotoPlaceholder dark label="After" className="h-[clamp(220px,40vw,340px)] rounded-[20px]" />
        </div>
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
          <span className="text-sm font-semibold text-rust">{featured.summary}</span>
          <blockquote className="m-0 font-serif text-[clamp(28px,3vw,38px)] font-medium italic leading-[1.2]">
            “{featured.quote}”
          </blockquote>
          <span className="text-base text-ink-soft">{featured.name}</span>
        </div>
      </article>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 p-0">
        {moreClients.map((client, index) => (
          <li
            key={index}
            className="flex flex-wrap items-center gap-5 rounded-[28px] border border-line bg-white p-5.5"
          >
            <div className="grid min-w-0 flex-[1_1_220px] grid-cols-2 gap-2">
              <PhotoPlaceholder label="Before" className="h-[180px] rounded-2xl" />
              <PhotoPlaceholder dark label="After" className="h-[180px] rounded-2xl" />
            </div>
            <div className="min-w-0 flex-[1_1_200px]">
              <h3 className="m-0 font-serif text-[30px] font-medium leading-[1.1]">[{client}]</h3>
              <span className="text-sm font-semibold text-rust">[Time taken] · [What changed]</span>
              <p className="m-0 mt-2 text-[15px] text-ink-soft">[Their result, in their own words.]</p>
            </div>
          </li>
        ))}
      </ul>

      <a
        href={site.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 rounded py-2 font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
      >
        More results on my Instagram @{site.instagram.handle}
        <ArrowRightIcon />
      </a>
    </Section>
  );
}
