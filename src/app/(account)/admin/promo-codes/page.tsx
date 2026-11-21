import type { Metadata } from "next";
import AdminPromoCodes from "@/components/admin/AdminPromoCodes";

export const metadata: Metadata = {
  title: "Promo codes · Admin",
  robots: { index: false },
};

export default function Page() {
  return <AdminPromoCodes />;
}
