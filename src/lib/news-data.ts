import {
  getPublishedArticles,
  getArticleBySlugForPublic,
  type PublicArticleRow,
} from "@/lib/data/articles";

export type Article = {
  id: string;
  slug: string;
  image: string;
  category: string;
  categorySlug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  readTime: string;
};

/** Reading speed used to estimate reading time from word count (id-ID average). */
const WORDS_PER_MINUTE = 150;

function splitParagraphs(content: string): string[] {
  const byBlankLine = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (byBlankLine.length > 1) return byBlankLine;

  // Fall back to single newlines for plain-textarea content with no blank lines.
  return content
    .split(/\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} menit baca`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function toPublicArticle(row: PublicArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    image: row.featured_image || "/figma/article-1.png",
    category: row.category_name || "Umum",
    categorySlug: row.category_slug || "umum",
    date: formatDate(row.published_at),
    title: row.title,
    excerpt: row.excerpt || "",
    content: splitParagraphs(row.content),
    author: row.author || "Chery Indonesia",
    readTime: estimateReadTime(row.content),
  };
}

export function getAllArticles(): Article[] {
  return getPublishedArticles().map(toPublicArticle);
}

export function getArticleBySlug(slug: string): Article | undefined {
  const row = getArticleBySlugForPublic(slug);
  return row ? toPublicArticle(row) : undefined;
}

export function getRelatedArticles(current: Article, limit = 3): Article[] {
  const all = getAllArticles().filter((a) => a.id !== current.id);
  const sameCategory = all.filter((a) => a.categorySlug === current.categorySlug);
  const rest = all.filter((a) => a.categorySlug !== current.categorySlug);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getCategories(): { label: string; slug: string; count: number }[] {
  const map = new Map<string, { label: string; slug: string; count: number }>();
  for (const a of getAllArticles()) {
    const existing = map.get(a.categorySlug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(a.categorySlug, { label: a.category, slug: a.categorySlug, count: 1 });
    }
  }
  return Array.from(map.values());
}
