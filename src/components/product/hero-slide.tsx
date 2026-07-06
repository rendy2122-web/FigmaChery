"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface Slide {
  type: "image" | "video";
  src: string;
  poster?: string;
}

interface HeroSlideProps {
  slug: string;
  heroImage?: string;
}

// Map slug to figma folder name (some use different casing/spacing)
function slugToFolder(slug: string): string {
  const map: Record<string, string> = {
    "chery-q": "chery q",
    "chery-e5": "chery e5",
    "chery-j6": "J6",
    "chery-c5-csh": "chery c5 csh",
    "tiggo-9-csh": "tiggo 9 csh",
    "tiggo-cross-csh": "tiggo cross csh",
    "tiggo-8-csh": "tiggo 8 csh",
    "chery-c5": "chery c5",
    "tiggo-cross-sport": "tiggo cross sport",
    "omoda-5-gt": "Omoda 5 GT",
    "tiggo-cross": "tiggo cross",
    "tiggo-8": "tiggo 8",
    "tiggo-8-pro-max": "tiggo 8 pro max",
  };
  return map[slug] || slug;
}

export default function HeroSlide({ slug, heroImage }: HeroSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const folder = slugToFolder(slug);

  const slides: Slide[] = [
    {
      type: "image",
      src: heroImage || `/figma/${folder}/hero.png`,
    },
    {
      type: "video",
      src: `/figma/${folder}/video.mp4`,
      poster: heroImage || `/figma/${folder}/hero.png`,
    },
    {
      type: "image",
      src: `/figma/${folder}/interior.png`,
    },
  ];

  const totalSlides = slides.length;

  const goTo = useCallback((index: number) => {
    setCurrentIndex((index + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Auto-slide with pause on hover
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, totalSlides]);

  return (
    <section
      className="relative w-full h-screen mt-[-80px] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`slide-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slides[currentIndex]?.type === "video" ? (
            <video
              key={currentIndex}
              src={slides[currentIndex].src}
              poster={slides[currentIndex].poster}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={slides[currentIndex]?.src}
              alt={`Hero slide ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={currentIndex === 0}
            />
          )}

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/40 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/40 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="size-6" />
      </button>

      {/* Bottom controls: dots + play/pause */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex items-center gap-3">
        {/* Dots */}
        <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex size-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      </div>

      {/* Slide counter shifted below navbar */}
      <div className="absolute right-6 top-24 z-20 rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        {currentIndex + 1} / {totalSlides}
      </div>
    </section>
  );
}