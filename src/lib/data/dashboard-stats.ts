import db from "@/lib/db";

export interface DashboardStatsRow {
  cars: number;
  articles: number;
  dealers: number;
  promotions: number;
}

export function getDashboardStatsRow(): DashboardStatsRow {
  return db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM cars WHERE deleted_at IS NULL) as cars,
        (SELECT COUNT(*) FROM articles WHERE deleted_at IS NULL) as articles,
        (SELECT COUNT(*) FROM dealers WHERE deleted_at IS NULL) as dealers,
        (SELECT COUNT(*) FROM promotions) as promotions`
    )
    .get() as DashboardStatsRow;
}

export interface RecentItem {
  id: string;
  type: "car" | "article";
  title: string;
  time: string;
  href: string;
}

export function getRecentActivity(limit = 5): RecentItem[] {
  const recentCars = db
    .prepare(
      "SELECT id, name, updated_at FROM cars WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 3"
    )
    .all() as { id: string; name: string; updated_at: string }[];

  const recentArticles = db
    .prepare(
      "SELECT id, title, updated_at FROM articles WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 3"
    )
    .all() as { id: string; title: string; updated_at: string }[];

  const combined: RecentItem[] = [
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
  ];

  return combined
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);
}
