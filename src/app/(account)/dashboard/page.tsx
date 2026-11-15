import type { Metadata } from "next";
import Dashboard from "@/components/account/Dashboard";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false },
};

export default function DashboardPage() {
  return <Dashboard />;
}
