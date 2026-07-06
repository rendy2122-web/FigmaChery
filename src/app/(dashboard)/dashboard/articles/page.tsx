import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllArticlesForAdmin } from "@/lib/data/articles";
import { ArticlesTable } from "@/components/cms/articles-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function ArticlesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get all articles with category
  const articles = getAllArticlesForAdmin() as any[];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Artikel</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola berita dan artikel
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button>
            <PlusIcon className="size-4 mr-2" />
            Tambah Artikel
          </Button>
        </Link>
      </div>

      {/* Articles Table */}
      <ArticlesTable articles={articles} />
    </div>
  );
}