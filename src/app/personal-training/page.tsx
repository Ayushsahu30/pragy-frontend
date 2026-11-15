import type { Metadata } from "next";
import PersonalTraining from "@/components/landing/PersonalTraining";

export const metadata: Metadata = {
  title: "Personal training",
  description: "Apply for one on one personal training with Pragy.",
};

export default function PersonalTrainingPage() {
  return <PersonalTraining asPage />;
}
