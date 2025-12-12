import { ReactNode } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";

export const metadata = {
  title: "Admin Dashboard - FujiViewTech",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
