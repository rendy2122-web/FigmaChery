"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRightIcon, ClockIcon, SparkleIcon } from "lucide-react";
import type { Article } from "@/lib/news-data";

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm"
    >
      <Link
        href={`/news/${article.slug}`}
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        <div className="relative aspect-[16/11] overflow-hidden bg-muted lg:aspect-auto">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-r" />
          <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg shadow-gold/30">
            <SparkleIcon className="size-3" aria-hidden="true" />
            Sorotan Utama
          </span>
        </div>

        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-14">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-brand-deep/30 bg-brand-deep/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-deep">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ClockIcon className="size-3.5" aria-hidden="true" />
              {article.date} &middot; {article.readTime}
            </span>
          </div>

          <h2 className="text-h3 font-heading font-bold leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-deep">
            {article.title}
          </h2>

          <p className="text-body-lg leading-relaxed text-muted-foreground line-clamp-3">
            {article.excerpt}
          </p>

          <div className="mt-2 flex items-center justify-between border-t border-border pt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              {article.author}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-deep">
              Baca Selengkapnya
              <ArrowRightIcon
                className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
