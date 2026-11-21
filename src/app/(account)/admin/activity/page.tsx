import type { Metadata } from "next";
import AdminActivity from "@/components/admin/AdminActivity";

export const metadata: Metadata = {
  title: "Activity log · Admin",
  robots: { index: false },
};

export default function Page() {
  return <AdminActivity />;
}
