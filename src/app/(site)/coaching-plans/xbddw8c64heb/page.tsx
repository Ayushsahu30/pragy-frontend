import type { Metadata } from "next";
import PtPlans from "@/components/payments/PtPlans";

/**
 * Hidden personal coaching plans page. Its address is printed in the brochure:
 * never rename this folder (see PT_PLANS_PATH in src/lib/pt.ts).
 * Nothing on the site links here, and search engines are told not to list it.
 */
export const metadata: Metadata = {
  title: "Personal coaching plans",
  description: "Premium, Elite and Diamond personal coaching plans with Pragy.",
  robots: { index: false, follow: false, nocache: true },
};

export default function CoachingPlansPage() {
  return <PtPlans />;
}
