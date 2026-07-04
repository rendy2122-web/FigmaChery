import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Stat {
  label: string;
  value: number;
  href: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}