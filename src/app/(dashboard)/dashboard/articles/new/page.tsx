import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArticleForm } from "@/components/cms/article-form";
import { getCategories } from "@/lib/data/articles";

export default async function NewArticlePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get categories from database
  const categories = getCategories();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Artikel Baru</h1>
        <p className="mt-1 text-sm text-gray-600">
          Buat artikel atau berita baru
        </p>
      </div>

      {/* Article Form */}
      <ArticleForm categories={categories} />
    </div>
  );
}