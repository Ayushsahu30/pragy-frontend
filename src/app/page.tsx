import Consultation from "@/components/landing/Consultation";
import Courses from "@/components/landing/Courses";
import Faq from "@/components/landing/Faq";
import Hero from "@/components/landing/Hero";
import Journey from "@/components/landing/Journey";
import PersonalTraining from "@/components/landing/PersonalTraining";
import Results from "@/components/landing/Results";
import TeamCall from "@/components/landing/TeamCall";
import Trainer from "@/components/landing/Trainer";

// Section order and wording follow the "Version D – French Beige" design.
export default function Home() {
  return (
    <>
      <Hero />
      <Trainer />
      <Journey />
      <Results />
      <Courses />
      <TeamCall />
      <Consultation />
      <PersonalTraining />
      <Faq />
    </>
  );
}
