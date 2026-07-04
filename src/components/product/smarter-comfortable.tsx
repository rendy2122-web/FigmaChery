"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Figma only defines one real slide for this carousel (no sibling variant set
// like Hero Carousel had) — the peek previews reuse the same asset since no
// other distinct slide content exists in the design file.
const slideImage = "/figma/pdp/silent-start-banner.png";
const slideTitle = "Silent Start (Engine Off, Battery Full)";
const slideCount = 5;

export function SmarterComfortable() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    setActiveIndex((index + slideCount) % slideCount);
  };

  return (
    <section
      id="smarter-comfortable"
      aria-labelledby="smarter-comfortable-heading"
      className="overflow-hidden bg-background py-section-y"
    >
      <div className="mx-auto mb-10 flex max-w-7xl flex-col items-center gap-4 px-gutter text-center">
        <h2
          id="smarter-comfortable-heading"
          className="text-h1 font-heading font-bold text-foreground"
        >
          Smarter & Comfortable
        </h2>
        <p className="text-body-lg max-w-2xl text-muted-foreground">
          Step into a world of luxury and sophistication with the premium
          and futuristic interior of the TIGGO CROSS CSH Hybrid.
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute left-[8%] hidden aspect-[920/587] w-[18%] scale-95 rounded-lg opacity-40 blur-[1px] sm:block">
          <Image
            src={slideImage}
            alt=""
            fill
            aria-hidden="true"
            className="rounded-lg object-cover"
          />
        </div>

        <div className="relative z-10 aspect-[920/587] w-full max-w-3xl overflow-hidden rounded-lg">
          <Image
            src={slideImage}
            alt={slideTitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-8 left-8 max-w-md font-heading text-2xl font-medium text-white sm:text-4xl">
            {slideTitle}
          </h3>
        </div>

        <div className="absolute right-[8%] hidden aspect-[920/587] w-[18%] scale-95 rounded-lg opacity-40 blur-[1px] sm:block">
          <Image
            src={slideImage}
            alt=""
            fill
            aria-hidden="true"
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goTo(activeIndex - 1)}
          className="flex size-8 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </button>

        <ol className="flex items-center gap-3" aria-label="Slide indicators">
          {Array.from({ length: slideCount }).map((_, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => goTo(i)}
                className={
                  i === activeIndex
                    ? "block size-2.5 rounded-full bg-brand-deep"
                    : "block size-2.5 rounded-full bg-border"
                }
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          aria-label="Next"
          onClick={() => goTo(activeIndex + 1)}
          className="flex size-8 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
