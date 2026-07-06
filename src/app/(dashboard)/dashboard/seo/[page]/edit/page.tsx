import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSeoMetadata } from "@/lib/data/seo";
import { SeoForm } from "@/components/cms/seo-form";

const PAGE_LABELS: Record<string, string> = {
  home: "Beranda",
  news: "Berita & Artikel",
};

export default async function EditSeoPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { page } = await params;
  const seo = getSeoMetadata(page);
  const pageLabel = PAGE_LABELS[page] || page;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO: {pageLabel}</h1>
        <p className="mt-1 text-sm text-gray-600">
          Atur meta title, description, dan pengaturan SEO untuk halaman ini
        </p>
      </div>

      <SeoForm page={page} pageLabel={pageLabel} seo={seo} />
    </div>
  );
}
