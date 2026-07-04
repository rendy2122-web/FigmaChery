import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get stats
  const totalCars = db.prepare("SELECT COUNT(*) as count FROM cars").get() as { count: number };
  const totalArticles = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number };
  const totalDealers = db.prepare("SELECT COUNT(*) as count FROM dealers").get() as { count: number };
  const totalPromotions = db.prepare("SELECT COUNT(*) as count FROM promotions").get() as { count: number };

  const stats = [
    { label: "Total Mobil", value: totalCars.count, href: "/dashboard/cars" },
    { label: "Total Artikel", value: totalArticles.count, href: "/dashboard/articles" },
    { label: "Total Dealer", value: totalDealers.count, href: "/dashboard/dealers" },
    { label: "Total Promosi", value: totalPromotions.count, href: "/dashboard/promotions" },
  ];

  // Get recent activity (last 5 updated items)
  const recentCars = db.prepare(`
    SELECT id, name, updated_at FROM cars ORDER BY updated_at DESC LIMIT 3
  `).all() as any[];

  const recentArticles = db.prepare(`
    SELECT id, title, updated_at FROM articles ORDER BY updated_at DESC LIMIT 3
  `).all() as any[];

  const recentActivity = [
    ...recentCars.map((item) => ({
      id: item.id,
      type: "car" as const,
      title: item.name,
      time: item.updated_at,
      href: `/dashboard/cars`,
    })),
    ...recentArticles.map((item) => ({
      id: item.id,
      type: "article" as const,
      title: item.title,
      time: item.updated_at,
      href: `/dashboard/articles`,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

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