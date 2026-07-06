"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FrownIcon } from "lucide-react";
import { FeaturedArticle } from "@/components/news/featured-article";
import { NewsCard } from "@/components/news/news-card";
import type { Article } from "@/lib/news-data";

type Category = { label: string; slug: string; count: number };

export function NewsExplorer({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const [activeSlug, setActiveSlug] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeSlug === "all") return articles;
    return articles.filter((a) => a.categorySlug === activeSlug);
  }, [articles, activeSlug]);

  const [featured, ...rest] = filtered;

  const tabs = [{ label: "Semua", slug: "all", count: articles.length }, ...categories];

  return (
    <div className="flex flex-col gap-12">
      <div
        role="tablist"
        aria-label="Filter kategori artikel"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {tabs.map((tab) => {
          const isActive = tab.slug === activeSlug;
          return (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSlug(tab.slug)}
              className="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300"
            >
              {isActive && (
                <motion.span
                  layoutId="news-category-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-brand-deep shadow-sm shadow-brand-deep/30"
                />
              )}
              <span
                className={`relative z-10 ${isActive ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 ${isActive ? "text-white/70" : "text-muted-foreground/60"}`}
                >
                  ({tab.count})
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          {featured ? (
            <>
              <FeaturedArticle article={featured} />
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article, i) => (
                    <NewsCard key={article.id} article={article} index={i} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
              <FrownIcon className="size-8" aria-hidden="true" />
              <p className="text-sm font-medium">
                Belum ada artikel untuk kategori ini.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
