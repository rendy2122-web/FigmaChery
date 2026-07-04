import { Card } from "@/components/ui/card";
import { CarIcon, FileTextIcon, TagIcon, StoreIcon } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  type: "car" | "article" | "promotion" | "dealer";
  title: string;
  time: string;
  href: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "car":
        return CarIcon;
      case "article":
        return FileTextIcon;
      case "promotion":
        return TagIcon;
      case "dealer":
        return StoreIcon;
      default:
        return CarIcon;
    }
  };

  const getLabel = (type: Activity["type"]) => {
    switch (type) {
      case "car":
        return "Mobil";
      case "article":
        return "Artikel";
      case "promotion":
        return "Promosi";
      case "dealer":
        return "Dealer";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Aktivitas Terbaru
      </h2>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Belum ada aktivitas
          </p>
        ) : (
          activities.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <Link
                key={activity.id}
                href={activity.href}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 size-10 rounded-lg bg-brand-deep/10 flex items-center justify-center">
                  <Icon className="size-5 text-brand-deep" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-brand-deep">
                      {getLabel(activity.type)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(activity.time)}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </Card>
  );
}