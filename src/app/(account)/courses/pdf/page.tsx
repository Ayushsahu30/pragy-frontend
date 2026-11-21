import type { Metadata } from "next";
import PdfReader from "@/components/courses/PdfReader";

export const metadata: Metadata = {
  title: "PDF course",
  robots: { index: false },
};

export default function PdfCourseReaderPage() {
  return <PdfReader />;
}
