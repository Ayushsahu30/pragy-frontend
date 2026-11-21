import type { Metadata } from "next";
import AdminOrders from "@/components/admin/AdminOrders";

export const metadata: Metadata = {
  title: "Orders & refunds · Admin",
  robots: { index: false },
};

export default function Page() {
  return <AdminOrders />;
}
