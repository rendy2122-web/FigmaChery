"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckIcon, MailIcon, SendIcon } from "lucide-react";

export function NewsletterCta() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitted");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl bg-brand-deep px-8 py-14 text-center sm:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gold/20 blur-[80px]"
      />

      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-5">
        <span className="flex size-12 items-center justify-center rounded-full border border-gold/40 bg-white/10 text-gold">
          <MailIcon className="size-5" aria-hidden="true" />
        </span>
        <h2 className="text-h3 font-heading font-bold text-white">
          Jangan Lewatkan Update Terbaru
        </h2>
        <p className="text-body-lg text-white/75">
          Berlangganan untuk mendapatkan berita, promo eksklusif, dan tips
          perawatan kendaraan Chery langsung ke email Anda.
        </p>

        {status === "idle" ? (
          <form
            onSubmit={handleSubmit}
            className="mt-2 flex w-full flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Alamat email
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Alamat email Anda"
              className="h-[52px] w-full rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/50 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-bold text-black transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              Berlangganan
              <SendIcon className="size-4" aria-hidden="true" />
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
          >
            <CheckIcon className="size-4 text-gold" aria-hidden="true" />
            Terima kasih! Anda akan menerima update terbaru dari kami.
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
