"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  model: string;
  modelLogo: string;
  banner: string;
  priceFrom: string;
  caption?: string;
  ctaText?: string;
  ctaLink?: string;
};

const defaultSlides: Slide[] = [
  {
    id: "default-1",
    model: "Tiggo Cross CSH",
    modelLogo: "/figma/model-logo.png",
    banner: "/figma/hero-banner.png",
    priceFrom: "329.800.000",
    caption: "Mulai Dari",
    ctaText: "Jadwalkan Test Drive",
    ctaLink: "/booking",
  },
];

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    fetch("/api/homepage/hero?t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(console.error);
  }, []);

  const slide = slides[activeSlide] || slides[0];

  const goTo = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative mt-[-80px]">
      <div className="relative">
        <Image
          key={slide.id}
          src={slide.banner}
          alt={`Chery ${slide.model} in motion`}
          width={1440}
          height={944}
          priority={activeSlide === 0}
          className="h-screen w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-8 px-4 pb-6 sm:px-10 sm:pb-10 lg:px-24 lg:pb-24">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <Image
                src={slide.modelLogo}
                alt={slide.model}
                width={300}
                height={19}
                className="h-4 w-auto self-start opacity-90 sm:h-[19px]"
              />
              <h1
                id="hero-heading"
                className="font-heading text-[32px] leading-[38px] font-bold text-white sm:text-[40px] sm:leading-[47px]"
              >
                {slide.caption || "Mulai Dari"} {slide.priceFrom}
              </h1>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button
                className="h-11 rounded px-5 text-base font-bold bg-white text-foreground hover:bg-white/90"
                render={<Link href={slide.ctaLink || "/booking"} />}
              >
                {slide.ctaText || "Jadwalkan Test Drive"}
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded px-5 text-base font-bold border-white/80 bg-transparent text-white hover:bg-white/10 hover:text-white"
                render={<Link href="#cta" />}
              >
                Hubungi Sales Kami
              </Button>
            </div>
          </div>
        </div>

        <ol
          aria-label="Slide indicators"
          className="absolute top-1/2 right-4 hidden -translate-y-1/2 flex-col items-center gap-3 sm:right-10 sm:flex lg:right-24"
        >
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.model}`}
                aria-current={i === activeSlide ? "true" : undefined}
                onClick={() => goTo(i)}
                className={
                  i === activeSlide
                    ? "block size-3 rounded-full bg-white"
                    : "block size-3 rounded-full border border-white/70 transition-colors hover:border-white"
                }
              />
            </li>
          ))}
        </ol>

        <div className="absolute right-4 bottom-6 flex items-center gap-2 sm:right-10 sm:bottom-10 lg:right-24 lg:bottom-24">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(activeSlide - 1)}
            className="flex size-10 items-center justify-center rounded-md border border-white/70 bg-black text-white transition-colors hover:bg-black/70"
          >
            <ChevronLeftIcon className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(activeSlide + 1)}
            className="flex size-10 items-center justify-center rounded-md border border-white/70 bg-black text-white transition-colors hover:bg-black/70"
          >
            <ChevronRightIcon className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
