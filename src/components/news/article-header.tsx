"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { ArticleShare } from "@/components/news/article-share";
import type { Article } from "@/lib/news-data";

export function ArticleHeader({ article }: { article: Article }) {
  return (
    <header className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center"
      >
        <span className="rounded-full border border-brand-deep/30 bg-brand-deep/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-deep">
          {article.category}
        </span>
        <h1 className="text-h1 font-heading font-black leading-tight tracking-tight text-foreground">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserIcon className="size-4" aria-hidden="true" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="size-4" aria-hidden="true" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4" aria-hidden="true" />
            {article.readTime}
          </span>
        </div>

        <ArticleShare title={article.title} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto aspect-[16/8] w-full max-w-5xl overflow-hidden rounded-3xl bg-muted shadow-lg shadow-black/[0.05]"
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />
      </motion.div>
    </header>
  );
}
