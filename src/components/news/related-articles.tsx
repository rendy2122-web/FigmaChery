import { NewsCard } from "@/components/news/news-card";
import type { Article } from "@/lib/news-data";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <h2 className="text-h4 font-heading font-bold text-foreground">
          Artikel Terkait
        </h2>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </div>
  );
}
