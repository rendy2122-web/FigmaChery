import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStatsRow, getRecentActivity as getRecentActivityRows } from "@/lib/data/dashboard-stats";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get stats - single query optimization (exclude soft deleted)
  const statsRow = getDashboardStatsRow();

  const stats = [
    { label: "Total Mobil", value: statsRow.cars, href: "/dashboard/cars" },
    { label: "Total Artikel", value: statsRow.articles, href: "/dashboard/articles" },
    { label: "Total Dealer", value: statsRow.dealers, href: "/dashboard/dealers" },
    { label: "Total Promosi", value: statsRow.promotions, href: "/dashboard/promotions" },
  ];

  // Recent activity (exclude soft deleted)
  const recentActivity = getRecentActivityRows(5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Selamat datang, {session.user.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />
    </div>
  );
}