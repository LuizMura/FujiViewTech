"use client";

import AdminHeader from "../AdminHeader";
import DashboardCategoryTable from "@/components/admin/DashboardCategoryTable";
import TopArticlesRanking from "@/components/admin/TopArticlesRanking";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-[#bfc7d5] mb-4 md:mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          <div className="md:col-span-3">
            <DashboardCategoryTable />
          </div>
          <div className="md:col-span-2">
            <TopArticlesRanking />
          </div>
        </div>
      </main>
    </div>
  );
}
