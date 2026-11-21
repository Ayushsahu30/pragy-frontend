/**
 * Every price shown on the website lives in this one file.
 * Source: "Pragy Looksmaxing Brochure".
 *
 * Change a number here and it updates on every page that shows it.
 *
 * Pragy sells as an individual and is not registered for GST, so no price
 * mentions GST: the amount shown is the full amount paid. If he registers for
 * GST later, set `gst` to change how a price is written:
 *   "extra"     -> "₹999 + GST"
 *   "included"  -> "₹15,000" (pages add "Includes GST.")
 *   left out    -> "₹799"
 *
 * Note: from Phase 4 the backend also needs these amounts, because the
 * backend (not the browser) decides what a customer pays. Keep both in sync.
 */

export type Price = {
  amount: number;
  gst?: "extra" | "included";
};

export const prices = {
  webinar: { amount: 250 },
  pdfCourse: { amount: 799 },
  videoCourse: { amount: 3000 },
  teamCall: { amount: 999 },
  consultation: { amount: 4499 },
} satisfies Record<string, Price>;

/** Value of the Skool community bonus that comes with every PT plan. */
export const skoolBonusValuePerMonth = 3000;

export type PlanDuration = "1m" | "3m" | "6m";

export const planDurations: { id: PlanDuration; label: string; months: number }[] = [
  { id: "1m", label: "1 month", months: 1 },
  { id: "3m", label: "3 months", months: 3 },
  { id: "6m", label: "6 months", months: 6 },
];

/**
 * Personal training plans. These prices are NOT shown on the public pages;
 * they appear only on the hidden plans page linked from the brochure.
 * (The brochure says "GST included"; on the site the price is simply the full amount.)
 */
export const ptPlans: {
  id: "premium" | "elite" | "diamond";
  name: string;
  prices: Record<PlanDuration, number>;
}[] = [
  { id: "premium", name: "Premium", prices: { "1m": 15000, "3m": 35000, "6m": 60000 } },
  { id: "elite", name: "Elite", prices: { "1m": 20000, "3m": 55000, "6m": 90000 } },
  { id: "diamond", name: "Diamond", prices: { "1m": 30000, "3m": 70000, "6m": 120000 } },
];
