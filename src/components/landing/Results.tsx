import { ArrowRightIcon } from "@/components/icons";
import { Eyebrow, Photo, Section, sectionTitleClass } from "@/components/ui";
import { site } from "@/content/site";

// Real clients. `areas` is shown only when filled in.
type Client = { name: string; areas: string[]; before: string; after: string };

const clients: Client[] = [
  {
    name: "Gaurav",
    areas: ["Eye area", "Hairstyle", "Jawline", "Physique"],
    before: "/images/result-gaurav-before.jpg",
    after: "/images/result-gaurav-after.jpg",
  },
  {
    name: "Jegtej",
    areas: [],
    before: "/images/result-jegtej-before.jpg",
    after: "/images/result-jegtej-after.jpg",
  },
  {
    name: "Assam",
    areas: [],
    before: "/images/result-assam-before.jpg",
    after: "/images/result-assam-after.jpg",
  },
];

const [featured, ...moreClients] = clients;

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
          <Photo
            src={featured.before}
            alt={`${featured.name} before coaching`}
            sizes="(min-width: 1024px) 300px, 50vw"
            label="Before"
            className="h-[clamp(220px,40vw,340px)] rounded-[20px]"
          />
          <Photo
            src={featured.after}
            alt={`${featured.name} after coaching`}
            sizes="(min-width: 1024px) 300px, 50vw"
            label="After"
            labelTone="peach"
            className="h-[clamp(220px,40vw,340px)] rounded-[20px]"
          />
        </div>
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          <h3 className="m-0 font-serif text-[clamp(36px,4vw,48px)] font-medium leading-none">{featured.name}</h3>
          {featured.areas.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-semibold text-rust">Areas worked on</span>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {featured.areas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-line bg-cream px-4 py-2 text-[15px] font-semibold text-ink"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 p-0">
        {moreClients.map((client) => (
          <li
            key={client.name}
            className="flex flex-wrap items-center gap-5 rounded-[28px] border border-line bg-white p-5.5"
          >
            <div className="grid min-w-0 flex-[1_1_220px] grid-cols-2 gap-2">
              <Photo
                src={client.before}
                alt={`${client.name} before coaching`}
                sizes="(min-width: 1024px) 160px, 45vw"
                label="Before"
                className="h-[180px] rounded-2xl"
              />
              <Photo
                src={client.after}
                alt={`${client.name} after coaching`}
                sizes="(min-width: 1024px) 160px, 45vw"
                label="After"
                labelTone="peach"
                className="h-[180px] rounded-2xl"
              />
            </div>
            <div className="min-w-0 flex-[1_1_200px]">
              <h3 className="m-0 font-serif text-[30px] font-medium leading-[1.1]">{client.name}</h3>
              {client.areas.length > 0 && (
                <span className="text-sm font-semibold text-rust">Areas worked on: {client.areas.join(" · ")}</span>
              )}
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
