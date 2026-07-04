"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const colors = [
  { name: "Black Diamond", swatch: "bg-gradient-to-br from-neutral-700 to-black" },
  { name: "Graphite Gray", swatch: "bg-gradient-to-br from-zinc-400 to-zinc-600" },
  { name: "Passion Red", swatch: "bg-gradient-to-br from-brand to-brand-deep" },
  { name: "Silver Moonlight", swatch: "bg-gradient-to-br from-neutral-200 to-neutral-400" },
  { name: "Pearl White", swatch: "bg-gradient-to-br from-white to-neutral-200" },
];

export function ColorOptions() {
  const [activeIndex, setActiveIndex] = useState(3);
  const active = colors[activeIndex];

  return (
    <section
      id="opsi-warna"
      aria-labelledby="opsi-warna-heading"
      className="bg-muted py-section-y"
    >
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2
                id="opsi-warna-heading"
                className="text-h2 font-heading font-bold text-foreground"
              >
                Opsi Warna
              </h2>
              <p className="text-body-lg text-muted-foreground">
                Pancarkan kharismamu dengan TIGGO CROSS CH. Temukan warna
                yang mencerminkan kepribadianmu
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <ul className="flex max-w-64 flex-wrap gap-3">
                {colors.map((color, i) => (
                  <li key={color.name}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={color.name}
                      aria-current={i === activeIndex ? "true" : undefined}
                      className={
                        i === activeIndex
                          ? `size-14 rounded-full ${color.swatch} ring-2 ring-brand-deep ring-offset-2`
                          : `size-14 rounded-full ${color.swatch} ring-2 ring-transparent ring-offset-2 hover:ring-border`
                      }
                    />
                  </li>
                ))}
              </ul>
              <span className="font-heading text-lg tracking-wide text-foreground uppercase">
                {active.name}
              </span>
              <Button
                className="h-11 w-fit rounded px-5 text-base font-bold bg-brand-deep text-white hover:bg-brand-deep/90"
                render={<Link href="/booking" />}
              >
                Book Test Drive
              </Button>
            </div>
          </div>

          <div className="relative aspect-[503/832] w-full max-w-sm justify-self-end sm:max-w-md">
            <Image
              src="/figma/pdp/opsi-warna-video.png"
              alt=""
              fill
              aria-hidden="true"
              className="rounded-lg object-cover"
            />
            <Image
              src="/figma/pdp/black-platinum-car.png"
              alt={`Chery Tiggo Cross CSH — ${active.name}`}
              width={881}
              height={480}
              className="absolute bottom-[12%] left-1/2 w-[130%] max-w-none -translate-x-1/2 object-cover drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
