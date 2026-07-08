import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBreadcrumb } from "@/components/product/breadcrumb";
import { Section } from "@/components/layout/section";
import { ReadingProgress } from "@/components/news/reading-progress";
import { ArticleHeader } from "@/components/news/article-header";
import { RelatedArticles } from "@/components/news/related-articles";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/news-data";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = getRelatedArticles(article);

  return (
    <>
      <ReadingProgress />

      <ProductBreadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Berita", href: "/news" },
          { label: article.title },
        ]}
      />

      <Section id="article" aria-labelledby="article-heading" className="pb-0">
        <ArticleHeader article={article} />

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-6">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-body-lg leading-relaxed text-foreground/85">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section id="related-articles" aria-label="Artikel terkait">
        <RelatedArticles articles={related} />
      </Section>
    </>
  );
}
