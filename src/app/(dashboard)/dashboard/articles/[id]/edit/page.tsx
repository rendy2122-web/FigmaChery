import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArticleForm } from "@/components/cms/article-form";
import db from "@/lib/db";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  // Get article and categories data
  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as any;
  const categories = db.prepare("SELECT * FROM categories ORDER BY name").all();

  if (!article) {
    redirect("/dashboard/articles");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Artikel</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update artikel: {article.title}
        </p>
      </div>

      {/* Article Form */}
      <ArticleForm article={article} categories={categories} />
    </div>
  );
}