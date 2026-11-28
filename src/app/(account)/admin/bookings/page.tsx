import type { Metadata } from "next";
import AdminBookings from "@/components/admin/AdminBookings";

export const metadata: Metadata = {
  title: "Bookings · Admin",
  robots: { index: false },
};

export default function Page() {
  return <AdminBookings />;
}
