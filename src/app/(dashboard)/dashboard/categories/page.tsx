import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/data/articles";
import { CategoriesManager } from "@/components/cms/categories-manager";

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const categories = getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kategori Artikel</h1>
        <p className="mt-1 text-sm text-gray-600">
          Kelola kategori yang tersedia saat membuat atau mengedit artikel
        </p>
      </div>

      <CategoriesManager categories={categories} />
    </div>
  );
}
