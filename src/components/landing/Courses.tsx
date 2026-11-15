import { ButtonLink, Eyebrow, Section, sectionTitleClass } from "@/components/ui";
import { prices } from "@/content/prices";
import { formatPrice } from "@/lib/format";

export default function Courses() {
  return (
    <Section id="courses" label="Learn with Pragy" innerClassName="flex flex-wrap gap-x-16 gap-y-10">
      <div className="flex min-w-0 flex-[1_1_300px] flex-col items-start gap-4">
        <Eyebrow>Learn with Pragy</Eyebrow>
        <h2 className={sectionTitleClass}>Everything you need to start improving, at your own pace.</h2>
        <p className="m-0 max-w-[360px] text-ink-soft">
          Access structured educational resources designed to help you understand looksmaxing and apply what you
          learn. Course access is unlocked in your private dashboard after successful payment.
        </p>
      </div>

      <div className="flex min-w-0 flex-[2_1_480px] flex-col gap-4">
        <article className="flex flex-wrap items-center gap-x-7 gap-y-4 rounded-3xl border border-line px-7 py-6">
          <div className="min-w-0 flex-[1_1_260px]">
            <Eyebrow>01 — The Starter Guide</Eyebrow>
            <h3 className="m-0 mb-1 mt-0.5 font-serif text-[34px] font-medium leading-[1.1]">PDF Course</h3>
            <p className="m-0 text-[15px] text-ink-soft">
              A practical introduction to my approach to maximizing your looks. Structured educational guide · Learn at your own
              pace · Read inside your private course dashboard · 30-day access.
            </p>
          </div>
          <span className="font-serif text-[52px] font-medium leading-none">{formatPrice(prices.pdfCourse)}</span>
          <ButtonLink href="/pdf-course" variant="outline">
            Get the Starter Guide
          </ButtonLink>
        </article>

        <article className="flex flex-wrap items-center gap-x-7 gap-y-4 rounded-3xl bg-ink px-7 py-6 text-white">
          <div className="min-w-0 flex-[1_1_260px]">
            <Eyebrow className="text-peach">02 — The Complete Experience</Eyebrow>
            <h3 className="m-0 mb-1 mt-0.5 font-serif text-[34px] font-medium leading-[1.1]">Video Course + Community</h3>
            <p className="m-0 text-[15px] text-mist">
              Go beyond reading. Learn through detailed video lessons and become part of the community. Full video course
              · Structured educational modules · Access to my Skool community · Member-only resources and extras · Learn
              at your own pace.
            </p>
          </div>
          <span className="font-serif text-[52px] font-medium leading-none">{formatPrice(prices.videoCourse)}</span>
          <ButtonLink href="/video-course" variant="peach">
            Join the Community
          </ButtonLink>
        </article>
      </div>
    </Section>
  );
}
