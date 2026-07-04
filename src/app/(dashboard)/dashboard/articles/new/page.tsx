import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArticleForm } from "@/components/cms/article-form";
import db from "@/lib/db";

export default async function NewArticlePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get categories from database
  const categories = db.prepare("SELECT * FROM categories ORDER BY name").all();

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