"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { CarFilterTabs } from "@/components/sections/car-filter-tabs";

type CarType = "ALL" | "BEV" | "CSH" | "ICE";

type Model = {
  id: string;
  name: string;
  subtitle: string;
  watermark: string;
  image: string;
  type: string;
};

const defaultModels: Model[] = [
  {
    id: "q",
    name: "CHERY Q",
    subtitle: "COMPACT SUV",
    watermark: "CHERY Q",
    image: "/figma/car-q.png",
    type: "ICE",
  },
];

const defaultSpecs = [
  { label: "Maximum power (kW/PS)", value: "90/122" },
  { label: "Maximum torque (NM)", value: "115" },
  { label: "Dimensions (L x W x H) (mm.)", value: "4195 x 1811 x 1568" },
];

export function CarShowcase() {
  const [models, setModels] = useState<Model[]>(defaultModels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<CarType>("ALL");

  useEffect(() => {
    const url = activeFilter === "ALL" ? "/api/cars" : `/api/cars?type=${activeFilter}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map cars API response to Model type
          const mapped = data.map((car: any) => ({
            id: car.id,
            name: car.name.toUpperCase(),
            subtitle: car.subtitle || "CSH",
            watermark: car.name.toUpperCase(),
            image: car.thumbnail || "/figma/car-q.png",
            type: car.type || "ICE",
          }));
          setModels(mapped);
          setActiveIndex(0); // Reset to first car when filter changes
        }
      })
      .catch(console.error);
  }, [activeFilter]);

  const model = models[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex((index + models.length) % models.length);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "BEV":
        return "bg-green-100 text-green-800";
      case "CSH":
        return "bg-blue-100 text-blue-800";
      case "ICE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section
      id="car-showcase"
      aria-labelledby="car-showcase-heading"
      className="relative bg-muted py-section-y"
    >
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Chery Future Innovation
          </span>
          <h2
            id="car-showcase-heading"
            className="text-h1 font-heading font-bold text-foreground"
          >
            Pilih Kendaraan Impian Anda
          </h2>
          <p className="text-body-lg max-w-xl text-muted-foreground">
            Temukan standar baru berkendara dengan kombinasi desain
            futuristik, performa tangguh, dan integrasi teknologi cerdas.
          </p>
        </div>

        <CarFilterTabs onFilterChange={setActiveFilter} activeFilter={activeFilter} />

        <div className="flex w-full flex-col items-center gap-8">
          <div className="relative flex w-full items-center justify-center overflow-hidden py-8">
            <button
              type="button"
              aria-label="Previous model"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:left-4"
            >
              <ChevronLeftIcon className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next model"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:right-4"
            >
              <ChevronRightIcon className="size-6" aria-hidden="true" />
            </button>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8vw] leading-none font-heading font-bold whitespace-nowrap text-foreground/5 select-none"
            >
              {model.watermark}
            </span>
            <Image
              key={model.id}
              src={model.image}
              alt={model.name}
              width={809}
              height={340}
              className="relative z-10 h-auto w-full max-w-3xl object-contain"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {models.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === activeIndex ? "true" : undefined}
                className={`
                  flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200
                  ${
                    i === activeIndex
                      ? "bg-brand-deep text-white shadow-md"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-deep hover:text-brand-deep"
                  }
                `}
              >
                <span>{m.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadgeColor(m.type)}`}>
                  {m.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 pt-2 sm:grid-cols-3">
          {defaultSpecs.map((spec) => (
            <div key={spec.label} className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {spec.label}
              </span>
              <span className="text-h3 font-heading font-bold text-foreground">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button
            className="h-11 rounded px-5 text-base font-bold bg-brand-deep text-white hover:bg-brand-deep/90"
            render={<Link href="/booking" />}
          >
            Book Test Drive
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded px-5 text-base font-bold border-brand-deep text-brand-deep hover:bg-brand-deep/5"
            render={<Link href="#cta" />}
          >
            Lihat Lebih Detail
          </Button>
        </div>
      </Container>
    </section>
  );
}