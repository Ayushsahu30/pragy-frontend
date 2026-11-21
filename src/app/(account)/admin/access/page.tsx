import type { Metadata } from "next";
import AdminAccess from "@/components/admin/AdminAccess";

export const metadata: Metadata = {
  title: "People & access · Admin",
  robots: { index: false },
};

export default function Page() {
  return <AdminAccess />;
}
