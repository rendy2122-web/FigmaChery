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

  // Get stats - single query optimization (exclude soft deleted)
  const statsRow = db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM cars WHERE deleted_at IS NULL) as cars,
      (SELECT COUNT(*) FROM articles WHERE deleted_at IS NULL) as articles,
      (SELECT COUNT(*) FROM dealers WHERE deleted_at IS NULL) as dealers,
      (SELECT COUNT(*) FROM promotions) as promotions
  `).get() as { cars: number; articles: number; dealers: number; promotions: number };

  const stats = [
    { label: "Total Mobil", value: statsRow.cars, href: "/dashboard/cars" },
    { label: "Total Artikel", value: statsRow.articles, href: "/dashboard/articles" },
    { label: "Total Dealer", value: statsRow.dealers, href: "/dashboard/dealers" },
    { label: "Total Promosi", value: statsRow.promotions, href: "/dashboard/promotions" },
  ];

  // Recent activity (exclude soft deleted)
  const recentCars = db.prepare(`
    SELECT id, name, updated_at FROM cars WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 3
  `).all() as any[];

  const recentArticles = db.prepare(`
    SELECT id, title, updated_at FROM articles WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 3
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