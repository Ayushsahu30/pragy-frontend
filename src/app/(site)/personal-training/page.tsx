import type { Metadata } from "next";
import PersonalTraining from "@/components/landing/PersonalTraining";

export const metadata: Metadata = {
  title: "Personal coaching",
  description: "Apply for personal coaching with Pragy: a plan built around you, with guidance throughout the process.",
};

export default function PersonalTrainingPage() {
  return <PersonalTraining asPage />;
}
