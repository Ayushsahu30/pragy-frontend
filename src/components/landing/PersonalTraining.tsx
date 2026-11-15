import PtApplyButton from "@/components/landing/PtApplyButton";
import { Eyebrow, PhotoPlaceholder } from "@/components/ui";


/**
 * Personal training. No prices here on purpose: the team shares them on
 * WhatsApp after the application.
 * `asPage` makes the heading the page's main heading (h1) on /personal-training.
 */
export default function PersonalTraining({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? "h1" : "h2";

  return (
    <section
      id="personal-training"
      aria-label="Personal coaching"
      className="scroll-mt-28 bg-ink px-6 py-20 text-white md:py-26"
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12">
        <div className="flex min-w-0 flex-[1.1_1_360px] flex-col items-start gap-6">
          <Eyebrow className="text-peach">Personal coaching</Eyebrow>
          <Heading className="m-0 font-serif text-[clamp(40px,5vw,64px)] font-medium leading-[1.04] tracking-[-0.01em]">
            A plan built around you. <em className="text-peach">Guidance throughout the process.</em>
          </Heading>
          <p className="m-0 max-w-[560px] text-[19px] text-mist">
            If you’re serious about improving your appearance and want ongoing personal guidance, you can apply to work
            with me.
          </p>
          <p className="m-0 max-w-[560px] text-[19px] text-mist">
            This isn’t a generic routine sent to everyone. The approach is built around your current situation, goals,
            lifestyle and progress.
          </p>
          <p className="m-0 max-w-[560px] text-[19px] text-mist">
            Depending on your requirements, coaching may include personalised physique and training guidance, nutrition
            and dietary planning, skincare and hair care routines, appearance and grooming recommendations, progress
            reviews and plan adjustments, and ongoing guidance and accountability.
          </p>
          <PtApplyButton />
          <span className="text-sm text-mist">Applying is free. There is no payment at this stage.</span>
        </div>

        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5">
          <PhotoPlaceholder
            dark
            label="Video of Pragy"
            className="aspect-[4/5] max-h-[620px] w-full rounded-b-[28px] rounded-t-[220px]"
          />
          <span className="text-sm text-mist">Watch: How my personal coaching works.</span>
        </div>
      </div>
    </section>
  );
}
