import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllSeoMetadataForAdmin } from "@/lib/data/seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

const KNOWN_PAGES = [
  { page: "home", label: "Beranda" },
  { page: "news", label: "Berita & Artikel" },
];

export default async function SeoPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const configured = getAllSeoMetadataForAdmin();
  const configuredKeys = new Set(configured.map((row) => row.page));

  const pages = [
    ...KNOWN_PAGES,
    ...configured
      .filter((row) => !KNOWN_PAGES.some((p) => p.page === row.page))
      .map((row) => ({ page: row.page, label: row.page })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO</h1>
        <p className="mt-1 text-sm text-gray-600">
          Kelola meta title, description, dan pengaturan SEO lainnya per halaman
        </p>
      </div>

      <div className="space-y-3">
        {pages.map(({ page, label }) => {
          const row = configured.find((r) => r.page === page);
          return (
            <Card key={page} className="p-5 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-bold text-sm text-gray-900">{label}</span>
                <span className="text-xs text-gray-500 truncate">
                  {row?.title || "Belum dikonfigurasi — menggunakan judul default"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {configuredKeys.has(page) ? (
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                    Dikonfigurasi
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <Link href={`/dashboard/seo/${page}/edit`}>
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="size-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
