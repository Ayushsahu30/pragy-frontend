import { ArrowRightIcon } from "@/components/icons";
import { Eyebrow, PhotoPlaceholder, Section, sectionTitleClass } from "@/components/ui";
import { site } from "@/content/site";

// TODO(client): Gaurav's time frame and his words, then clients 2 to 4.
const featured = {
  name: "Gaurav",
  duration: "[X months] transformation",
  areas: "Face, posture, oral health and body composition",
  quote: "[His result, in his own words. One or two lines.]",
};

const moreClients = ["Client 2", "Client 3", "Client 4"];

export default function Results() {
  return (
    <Section id="results" label="Client results" className="bg-cream" innerClassName="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Eyebrow>The proof</Eyebrow>
        <h2 className={`${sectionTitleClass} max-w-[760px]`}>
          Real people. <em>Real change.</em>
        </h2>
      </div>

      <article className="flex flex-wrap items-center gap-x-12 gap-y-7 rounded-[28px] border border-line bg-white p-5 sm:p-7">
        <div className="grid min-w-0 flex-[1.2_1_340px] grid-cols-2 gap-2.5">
          <PhotoPlaceholder label="Before" className="h-[clamp(220px,40vw,340px)] rounded-[20px]" />
          <PhotoPlaceholder dark label="After" className="h-[clamp(220px,40vw,340px)] rounded-[20px]" />
        </div>
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
          <span className="text-sm font-semibold text-rust">
            {featured.duration} · {featured.areas}
          </span>
          <blockquote className="m-0 font-serif text-[clamp(28px,3vw,38px)] font-medium italic leading-[1.2]">
            “{featured.quote}”
          </blockquote>
          <span className="text-base text-ink-soft">{featured.name}</span>
        </div>
      </article>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 p-0">
        {moreClients.map((client) => (
          <li key={client} className="flex flex-col gap-4 rounded-[28px] border border-line bg-white p-5">
            <div className="grid grid-cols-2 gap-2">
              <PhotoPlaceholder label="Before" className="h-[180px] rounded-2xl" />
              <PhotoPlaceholder dark label="After" className="h-[180px] rounded-2xl" />
            </div>
            <div>
              <h3 className="m-0 font-serif text-[30px] font-medium leading-[1.1]">[{client}]</h3>
              <span className="text-sm font-semibold text-rust">[Time taken] · [What changed]</span>
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
        More results on Instagram @{site.instagram.handle}
        <ArrowRightIcon />
      </a>
    </Section>
  );
}
