import { call } from "@/lib/auth";
import type { PlanDuration } from "@/content/prices";

/**
 * Address of the hidden personal coaching plans page. It is printed in the
 * brochure, so it must NEVER change (the backend's reminder email uses it too:
 * PT_PLANS_PATH in access-reminders.service.ts).
 */
export const PT_PLANS_PATH = "/coaching-plans/xbddw8c64heb";

/** The product the backend sells for a plan and duration, e.g. "pt-elite-3m". */
export const ptProductSlug = (planId: string, duration: PlanDuration) => `pt-${planId}-${duration}`;

export const isPtProduct = (slug: string) => slug.startsWith("pt-");

export type PtApplication = {
  name: string;
  age: number;
  email: string;
  heightCm: number;
  weightKg: number;
  improve: string[];
};

export const ptApi = {
  /** Saves a coaching application. No login needed. */
  apply: (application: PtApplication) =>
    call<{ id: string }>("/pt/leads", { method: "POST", body: JSON.stringify(application) }),
};
