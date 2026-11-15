import PtApplyButton from "@/components/landing/PtApplyButton";
import { Eyebrow, PhotoPlaceholder } from "@/components/ui";
import { ptPlans } from "@/content/prices";

const steps = [
  "Tap “Apply for personal training”",
  "Fill in the short form that opens",
  "WhatsApp opens with your message ready. Just press send",
];

/**
 * Personal training. No prices here on purpose: the team shares them on
 * WhatsApp after the application.
 * `asPage` makes the heading the page's main heading (h1) on /personal-training.
 */
export default function PersonalTraining({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? "h1" : "h2";
  const planNames = ptPlans.map((plan) => plan.name);
  const planList = `${planNames.slice(0, -1).join(", ")} and ${planNames.at(-1)}`;

  return (
    <section
      id="personal-training"
      aria-label="Personal training"
      className="scroll-mt-28 bg-ink px-6 py-20 text-white md:py-26"
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12">
        <div className="flex min-w-0 flex-[1.1_1_360px] flex-col items-start gap-6">
          <Eyebrow className="text-peach">Personal training</Eyebrow>
          <Heading className="m-0 font-serif text-[clamp(40px,5vw,64px)] font-medium leading-[1.04] tracking-[-0.01em]">
            Want Pragy to coach you <em className="text-peach">personally?</em>
          </Heading>
          <p className="m-0 max-w-[560px] text-[19px] text-mist">
            Three plans: {planList}, for 1, 3 or 6 months. Personal training is by application. Fill in a short form and
            WhatsApp opens with your message ready to send to the team.
          </p>
          <ol className="m-0 flex list-none flex-col gap-3.5 p-0 text-base leading-[1.4]">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink-deep text-[15px] font-bold text-peach"
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <PtApplyButton />
          <span className="text-sm text-mist">No payment at this step. The team replies on WhatsApp with the plan details.</span>
        </div>

        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5">
          <PhotoPlaceholder
            dark
            label="Video of Pragy explaining personal training"
            className="aspect-[4/5] max-h-[620px] w-full rounded-b-[28px] rounded-t-[220px]"
          />
        </div>
      </div>
    </section>
  );
}
