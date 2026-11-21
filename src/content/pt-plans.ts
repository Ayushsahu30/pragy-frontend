/**
 * Words on the hidden personal coaching plans page, from the
 * "Pragy Looksmaxing Brochure" (pages 3, 6, 7 and 8). Prices are in prices.ts.
 */

export const ptPlansPage = {
  eyebrow: "Personal coaching plans",
  title: "Pick your plan.",
  intro:
    "Always one on one with me. Your facial analysis is done by me, personally. Your plan is built by me for your face, not copied from a template. When you message, you are talking to me.",
  bonus: "Bonus: Skool community access for as long as your plan runs.",
  afterPayment: "After you pay, my team messages you on WhatsApp to begin your onboarding.",
  notSure: "Not sure which plan? Book a call with my team. They explain Premium, Elite and Diamond in plain words.",
  safety: "We never ask for your OTP, UPI PIN or card CVV. Pay only on this page.",
};

export const ptPlanDetails: Record<
  "premium" | "elite" | "diamond",
  { label: string; tagline: string; bestFor: string; includes: string[] }
> = {
  premium: {
    label: "Plan one",
    tagline: "The complete plan, built by me. A strategy call each month and a weekly check-in.",
    bestFor: "you want a clear plan and a regular touchpoint with me.",
    includes: [
      "Facial analysis by Pragy",
      "1 strategy call every month",
      "Personalised diet and workout plan",
      "Personalised face routine",
      "Weekly chat with Pragy",
      "Community support",
    ],
  },
  elite: {
    label: "Plan two",
    tagline: "More of me. A video call every 15 days to update your plan, and a check-in every other day.",
    bestFor: "you want your plan updated often and regular eyes on your progress.",
    includes: [
      "Facial analysis by Pragy",
      "2 video calls a month, one every 15 days, to check in and update your plan",
      "Check-in and chat with Pragy on alternate days",
      "Personalised face, workout, diet and routine plans",
      "Community support",
    ],
  },
  diamond: {
    label: "Plan three",
    tagline: "Maximum attention. Two video calls with me every week and your questions answered daily.",
    bestFor: "you want the fastest, closest, most hands-on version of working with me.",
    includes: [
      "Facial analysis by Pragy",
      "2 video calls with Pragy every week",
      "Check-in on alternate days",
      "Daily questions and answers with Pragy",
      "Personalised face, workout, diet and routine plans",
      "Community support",
    ],
  },
};
