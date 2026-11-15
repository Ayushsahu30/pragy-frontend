import { ButtonLink, Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatPrice } from "@/lib/format";

export default function Courses() {
  return (
    <Section id="courses" label="Courses" innerClassName="flex flex-wrap gap-x-16 gap-y-10">
      <div className="flex min-w-0 flex-[1_1_300px] flex-col items-start gap-4">
        <Eyebrow>Courses</Eyebrow>
        <h2 className={sectionTitleClass}>Learn at your own pace.</h2>
        <p className="m-0 max-w-[360px] text-ink-soft">
          Every course unlocks in your private dashboard right after payment.
        </p>
      </div>

      <div className="flex min-w-0 flex-[2_1_480px] flex-col gap-4">
        <article className="flex flex-wrap items-center gap-x-7 gap-y-4 rounded-3xl border border-line px-7 py-6">
          <div className="min-w-0 flex-[1_1_260px]">
            <Eyebrow>Self-paced</Eyebrow>
            <h3 className="m-0 mb-1 mt-0.5 font-serif text-[34px] font-medium leading-[1.1]">PDF Course</h3>
            <p className="m-0 text-[15px] text-ink-soft">
              The entry-level guide, read inside our secure viewer. 30 days of access.
            </p>
          </div>
          <span className="font-serif text-[52px] font-medium leading-none">{formatPrice(prices.pdfCourse)}</span>
          <ButtonLink href="/pdf-course" variant="outline">
            Get the PDF course
          </ButtonLink>
        </article>

        <article className="flex flex-wrap items-center gap-x-7 gap-y-4 rounded-3xl bg-ink px-7 py-6 text-white">
          <div className="min-w-0 flex-[1_1_260px]">
            <Eyebrow className="text-peach">Most complete</Eyebrow>
            <h3 className="m-0 mb-1 mt-0.5 font-serif text-[34px] font-medium leading-[1.1]">Video Course + Community</h3>
            <p className="m-0 text-[15px] text-mist">
              The full video course and our Skool community, plus member-only extras on this site.
            </p>
          </div>
          <span className="font-serif text-[52px] font-medium leading-none">{formatPrice(prices.videoCourse)}</span>
          <ButtonLink href="/video-course" variant="peach">
            Join the course
          </ButtonLink>
        </article>
      </div>
    </Section>
  );
}
