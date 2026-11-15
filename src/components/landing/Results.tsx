import { ArrowRightIcon } from "@/components/icons";
import { Eyebrow, PhotoPlaceholder, Section, sectionTitleClass } from "@/components/ui";
import { site } from "@/content/site";

// TODO(client): duration, verified areas and testimonial for each client.
const featured = {
  name: "Gaurav",
  summary: "[Duration of coaching] · Areas worked on: [Verified areas]",
  quote: "[Actual client testimonial.]",
};

const moreClients = ["Client Name", "Client Name"];

export default function Results() {
  return (
    <Section id="results" label="Client transformations" className="bg-cream" innerClassName="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Eyebrow>Real people. Real progress.</Eyebrow>
        <h2 className={`${sectionTitleClass} max-w-[760px]`}>
          The results of having a structured <em>approach.</em>
        </h2>
      </div>

      <p className="m-0 max-w-[640px] text-[19px] text-ink-soft">
        Everyone starts from a different place. The objective is to understand what needs improvement and work
        consistently towards it.
      </p>

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
              <span className="text-sm font-semibold text-rust">[Duration of coaching] · Areas worked on: [Verified areas]</span>
              <p className="m-0 mt-2 text-[15px] text-ink-soft">“[Actual client testimonial.]”</p>
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
        More transformations and client experiences on Instagram @{site.instagram.handle}
        <ArrowRightIcon />
      </a>
    </Section>
  );
}
