import Consultation from "@/components/landing/Consultation";
import Courses from "@/components/landing/Courses";
import Faq from "@/components/landing/Faq";
import Hero from "@/components/landing/Hero";
import HowToStart from "@/components/landing/HowToStart";
import Journey from "@/components/landing/Journey";
import PersonalTraining from "@/components/landing/PersonalTraining";
import OnePromise from "@/components/landing/Promise";
import Results from "@/components/landing/Results";
import TeamCall from "@/components/landing/TeamCall";
import Trainer from "@/components/landing/Trainer";
import WhatYouGet from "@/components/landing/WhatYouGet";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatYouGet />
      <Trainer />
      <Journey />
      <OnePromise />
      <Results />
      <Courses />
      <TeamCall />
      <Consultation />
      <PersonalTraining />
      <HowToStart />
      <Faq />
    </>
  );
}
