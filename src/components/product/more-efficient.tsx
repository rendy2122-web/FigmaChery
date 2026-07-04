"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const techs = [
  {
    id: "dhe",
    name: "Dedicated Hybrid Engine (DHE)",
    image: "/figma/pdp/dhe-banner.png",
  },
  {
    id: "dht",
    name: "Dedicated Hybrid Transmission (DHT)",
    image: "/figma/pdp/dht-banner.png",
  },
  {
    id: "dhb",
    name: "Dedicated Hybrid Battery (DHB)",
    image: "/figma/pdp/dhb-banner.png",
  },
];

export function MoreEfficient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = techs[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex((index + techs.length) % techs.length);
  };

  return (
    <section
      id="more-efficient"
      aria-labelledby="more-efficient-heading"
      className="bg-background py-section-y"
    >
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h2
            id="more-efficient-heading"
            className="text-h1 font-heading font-bold text-foreground"
          >
            More Efficient
          </h2>
          <p className="text-body-lg max-w-2xl text-muted-foreground">
            Experience Chery&apos;s Intelligent Hybrid Technology. Go
            further with minimal fuel consumption, thanks to the
            harmonious blend of innovative DHE, DHT, and DHB.
          </p>
        </div>

        <div className="relative flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous technology"
            onClick={() => goTo(activeIndex - 1)}
            className="hidden shrink-0 items-center justify-center text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:flex"
          >
            <ChevronLeftIcon className="size-6" aria-hidden="true" />
          </button>

          <div className="relative flex-1 overflow-hidden rounded-lg">
            <Image
              key={active.id}
              src={active.image}
              alt={active.name}
              width={920}
              height={601}
              className="h-96 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3 className="absolute bottom-6 left-6 max-w-[60%] font-heading text-xl font-medium text-white sm:text-2xl">
              {active.name}
            </h3>

            <div className="absolute right-6 bottom-6 flex gap-2">
              {techs.map((tech, i) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${tech.name}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  className="relative h-16 w-24 overflow-hidden rounded-md ring-2 ring-white/80"
                >
                  <Image
                    src={tech.image}
                    alt=""
                    width={160}
                    height={105}
                    className="h-full w-full object-cover"
                  />
                  {i !== activeIndex && (
                    <span className="absolute inset-0 bg-black/60" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next technology"
            onClick={() => goTo(activeIndex + 1)}
            className="hidden shrink-0 items-center justify-center text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:flex"
          >
            <ChevronRightIcon className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
