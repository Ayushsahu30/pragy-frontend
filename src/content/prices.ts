/**
 * Every price shown on the website lives in this one file.
 * Source: "Pragy Looksmaxing Brochure".
 *
 * Change a number here and it updates on every page that shows it.
 *
 * `gst` controls how a price is written:
 *   "extra"     -> "₹999 + GST"
 *   "included"  -> "₹15,000" (pages add "All prices include GST.")
 *   left out    -> "₹799" (GST not confirmed with the client yet)
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
  teamCall: { amount: 999, gst: "extra" },
  consultation: { amount: 4499, gst: "extra" },
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
 * All plan prices include GST.
 */
export const ptPlans: {
  id: "premium" | "elite" | "diamond";
  name: string;
  gst: "included";
  prices: Record<PlanDuration, number>;
}[] = [
  { id: "premium", name: "Premium", gst: "included", prices: { "1m": 15000, "3m": 35000, "6m": 60000 } },
  { id: "elite", name: "Elite", gst: "included", prices: { "1m": 20000, "3m": 55000, "6m": 90000 } },
  { id: "diamond", name: "Diamond", gst: "included", prices: { "1m": 30000, "3m": 70000, "6m": 120000 } },
];
