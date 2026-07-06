"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRightIcon, ClockIcon } from "lucide-react";
import type { Article } from "@/lib/news-data";

export function NewsCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow duration-500 hover:shadow-xl hover:shadow-black/[0.06]"
    >
      <Link href={`/news/${article.slug}`} className="contents">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {article.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ClockIcon className="size-3.5" aria-hidden="true" />
            {article.date} &middot; {article.readTime}
          </span>

          <h3 className="text-lg font-heading font-bold leading-snug tracking-tight text-foreground line-clamp-2 transition-colors duration-300 group-hover:text-brand-deep">
            {article.title}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              {article.author}
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground transition-all duration-300 group-hover:bg-brand-deep group-hover:text-white">
              <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
