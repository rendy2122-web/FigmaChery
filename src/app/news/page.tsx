import type { Metadata } from "next";
import { NewsHero } from "@/components/news/news-hero";
import { NewsExplorer } from "@/components/news/news-explorer";
import { NewsletterCta } from "@/components/news/newsletter-cta";
import { Section } from "@/components/layout/section";
import { getAllArticles, getCategories } from "@/lib/news-data";
import { getSeoMetadata } from "@/lib/data/seo";

const DEFAULT_TITLE = "Berita & Artikel";
const DEFAULT_DESCRIPTION =
  "Ikuti berita, wawasan teknologi, dan tips perawatan kendaraan terbaru dari Chery Indonesia.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeoMetadata("news");

  const title = seo?.title || DEFAULT_TITLE;
  const description = seo?.description || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    keywords: seo?.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: seo?.canonical ? { canonical: seo.canonical } : undefined,
    robots: seo?.no_index ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
    },
  };
}

export default function NewsPage() {
  const articles = getAllArticles();
  const categories = getCategories();

  return (
    <>
      <NewsHero />

      <Section id="news-explorer" aria-label="Daftar artikel">
        <NewsExplorer articles={articles} categories={categories} />
      </Section>

      <Section id="news-newsletter" aria-label="Berlangganan berita" className="pt-0">
        <NewsletterCta />
      </Section>
    </>
  );
}
