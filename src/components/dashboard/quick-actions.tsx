import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CarIcon, FileTextIcon } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      href: "/dashboard/cars/new",
      label: "Tambah Mobil",
      icon: CarIcon,
      description: "Tambahkan model mobil baru",
    },
    {
      href: "/dashboard/articles/new",
      label: "Tulis Artikel",
      icon: FileTextIcon,
      description: "Buat artikel atau berita",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Aksi Cepat
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-deep hover:bg-brand-deep/5 transition-all"
            >
              <div className="size-12 rounded-full bg-brand-deep/10 flex items-center justify-center">
                <Icon className="size-6 text-brand-deep" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}