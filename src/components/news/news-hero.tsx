"use client";

import { motion } from "motion/react";

export function NewsHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/40 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-brand-deep/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-[300px] w-[300px] rounded-full bg-gold/15 blur-[100px]"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-gutter text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 text-eyebrow font-bold uppercase tracking-widest text-brand-deep"
        >
          <span className="h-px w-8 bg-gold" aria-hidden="true" />
          Newsroom Chery Indonesia
          <span className="h-px w-8 bg-gold" aria-hidden="true" />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-display font-heading font-black leading-tight tracking-tight text-foreground"
        >
          Kabar &amp; Wawasan Terbaru
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-body-lg max-w-2xl text-muted-foreground"
        >
          Ikuti perkembangan terbaru, teknologi otomotif inovatif, serta
          panduan perawatan berkendara terbaik langsung dari para ahli Chery
          Indonesia.
        </motion.p>
      </div>
    </section>
  );
}
