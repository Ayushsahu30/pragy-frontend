import type { Metadata } from "next";
import AdminWebinars from "@/components/admin/AdminWebinars";

export const metadata: Metadata = {
  title: "Webinars · Admin",
  robots: { index: false },
};

export default function Page() {
  return <AdminWebinars />;
}
