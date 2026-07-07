"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { CarFilterTabs } from "@/components/sections/car-filter-tabs";

type CarType = "BEV" | "CSH" | "ICE";

type Model = {
  id: string;
  name: string;
  subtitle: string;
  watermark: string;
  image: string;
  type: string;
  slug: string;
  specs: Array<{ label: string; value: string }>;
};

const defaultModels: Model[] = [
  {
    id: "car-1",
    name: "CHERY Q",
    subtitle: "ELECTRIC HATCHBACK",
    watermark: "CHERY Q",
    image: "/figma/chery q/hero.png",
    type: "BEV",
    slug: "chery-q",
    specs: [
      { label: "Motor power (kW)", value: "70" },
      { label: "Max torque (Nm)", value: "150" },
      { label: "Battery capacity (kWh)", value: "35" },
      { label: "Range (km)", value: "320" },
    ],
  },
  {
    id: "car-2",
    name: "CHERY E5",
    subtitle: "ELECTRIC CROSSOVER",
    watermark: "CHERY E5",
    image: "/figma/chery e5/hero.png",
    type: "BEV",
    slug: "chery-e5",
    specs: [
      { label: "Motor power (kW/PS)", value: "150/204" },
      { label: "Max torque (Nm)", value: "310" },
      { label: "Battery capacity (kWh)", value: "60.5" },
      { label: "Range (km)", value: "520" },
    ],
  },
  {
    id: "car-3",
    name: "CHERY J6",
    subtitle: "ELECTRIC OFF-ROAD SUV",
    watermark: "CHERY J6",
    image: "/figma/J6/hero.png",
    type: "BEV",
    slug: "chery-j6",
    specs: [
      { label: "Motor power (kW)", value: "135" },
      { label: "Max torque (Nm)", value: "220" },
      { label: "Battery capacity (kWh)", value: "69.6" },
      { label: "Range (km)", value: "430" },
    ],
  },
];

interface ApiCarSpec {
  label: string;
  value: string;
}

interface ApiCar {
  id: string;
  name: string;
  subtitle: string | null;
  thumbnail: string | null;
  type: string;
  slug: string;
  specs?: ApiCarSpec[];
}

function mapApiCarsToModels(data: ApiCar[]): Model[] {
  return data.map((car) => ({
    id: car.id,
    name: car.name.toUpperCase(),
    subtitle: car.subtitle || "CSH",
    watermark: car.name.toUpperCase(),
    image: car.thumbnail || "/figma/car-q.png",
    type: car.type || "ICE",
    slug: car.slug,
    specs: (car.specs || []).map((spec: ApiCarSpec) => ({
      label: spec.label,
      value: spec.value,
    })),
  }));
}

interface CarShowcaseProps {
  /** Server-fetched cars for the default (BEV) filter — avoids a client-side
   *  placeholder-then-swap flash on first paint. */
  initialCars?: ApiCar[];
}

export function CarShowcase({ initialCars }: CarShowcaseProps) {
  const initialModels =
    initialCars && initialCars.length > 0 ? mapApiCarsToModels(initialCars) : defaultModels;

  const [models, setModels] = useState<Model[]>(initialModels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<CarType>("BEV");
  const isFirstRender = useRef(true);

  useEffect(() => {
    // The initial BEV data already came from the server, so skip the redundant
    // client-side refetch on mount — only fetch when the filter actually changes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (activeFilter === "BEV" && initialCars && initialCars.length > 0) {
        return;
      }
    }

    const url = `/api/cars?type=${activeFilter}&t=${Date.now()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setModels(mapApiCarsToModels(data as ApiCar[]));
          setActiveIndex(0); // Reset to first car when filter changes
        }
      })
      .catch(console.error);
  }, [activeFilter, initialCars]);

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

  const getFilterDescription = (filter: CarType): string => {
    switch (filter) {
      case "BEV":
        return "Kendaraan listrik masa depan dengan teknologi baterai terdepan dan performa tinggi yang ramah lingkungan.";
      case "CSH":
        return "Teknologi Hybrid terdepan yang mengombinasikan efisiensi listrik dan keandalan mesin konvensional.";
      case "ICE":
        return "Performa optimal dengan mesin konvensional terpercaya, dirancang untuk memenuhi kebutuhan berkendara Anda.";
    }
  };

  // Filter specs based on type - show only relevant specs
  const getFilteredSpecs = (model: Model) => {
    if (!model.specs) return [];
    
    const filterLabel = (label: string) => {
      const lower = label.toLowerCase();
      // Always show these
      if (lower.includes("power") || lower.includes("torque") || lower.includes("dimensions")) {
        return true;
      }
      // BEV: show battery and range
      if (model.type === "BEV" && (lower.includes("battery") || lower.includes("range"))) {
        return true;
      }
      // CSH/ICE: show engine capacity
      if ((model.type === "CSH" || model.type === "ICE") && lower.includes("engine")) {
        return true;
      }
      return false;
    };

    return model.specs.filter(spec => filterLabel(spec.label));
  };

  const filteredSpecs = getFilteredSpecs(model);

  return (
    <section
      id="car-showcase"
      aria-labelledby="car-showcase-heading"
      className="relative bg-muted py-section-y"
    >
      <Container className="flex flex-col items-center gap-8 text-center">
        <CarFilterTabs onFilterChange={setActiveFilter} activeFilter={activeFilter} />

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
          <p className="text-body-lg max-w-2xl text-muted-foreground">
            {getFilterDescription(activeFilter)}
          </p>
        </div>

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

        {filteredSpecs && filteredSpecs.length > 0 && (
          <div className="flex w-full flex-wrap justify-center gap-4 pt-2">
            {filteredSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-4 shadow-lg min-w-[140px] flex-1 max-w-[200px]"
              >
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {spec.label}
                </span>
                <span className="text-base font-bold text-foreground">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}

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
            render={<Link href={`/models/${model.slug}`} />}
          >
            Lihat Lebih Detail
          </Button>
        </div>
      </Container>
    </section>
  );
}