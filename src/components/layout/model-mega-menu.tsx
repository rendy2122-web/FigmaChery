"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Car = {
  id: string;
  name: string;
  slug: string;
  type: string;
  thumbnail: string | null;
};

const types = ["BEV", "CSH", "ICE"] as const;

export function ModelMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [activeType, setActiveType] = useState<string>("BEV");
  const [activeCarId, setActiveCarId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data: Car[]) => {
        if (!Array.isArray(data)) return;
        setCars(data);
        const first = data.find((c) => c.type === "BEV") ?? data[0];
        if (first) setActiveCarId(first.id);
      })
      .catch(console.error);
  }, []);

  const carsForType = cars.filter((c) => c.type === activeType);
  const activeCar = carsForType.find((c) => c.id === activeCarId) ?? carsForType[0];

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    const first = cars.find((c) => c.type === type);
    setActiveCarId(first?.id ?? null);
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex gap-2 border-b border-border pb-6">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            aria-pressed={activeType === type}
            className={
              activeType === type
                ? "rounded-full bg-brand-deep px-6 py-2.5 text-sm font-bold text-white transition-colors"
                : "rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            }
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-10">
        <div>
          <span className="mb-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Select a Car Model
          </span>
          <ul className="flex flex-col gap-1">
            {carsForType.map((car) => (
              <li key={car.id}>
                <button
                  type="button"
                  onClick={() => setActiveCarId(car.id)}
                  aria-current={car.id === activeCar?.id ? "true" : undefined}
                  className={
                    car.id === activeCar?.id
                      ? "block w-full rounded-lg bg-muted px-4 py-3 text-left text-sm font-bold text-foreground"
                      : "block w-full rounded-lg px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  }
                >
                  {car.name}
                </button>
              </li>
            ))}
            {carsForType.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground">
                Loading&hellip;
              </li>
            )}
          </ul>
        </div>

        <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 rounded-lg bg-muted p-10">
          {activeCar && (
            <>
              <span className="font-heading text-2xl font-bold text-foreground">
                {activeCar.name}
              </span>
              {activeCar.thumbnail && (
                <Image
                  key={activeCar.id}
                  src={activeCar.thumbnail}
                  alt={activeCar.name}
                  width={480}
                  height={220}
                  className="h-auto w-full max-w-lg object-contain"
                />
              )}
              <Button
                className="h-11 rounded px-8 text-base font-bold bg-brand-deep text-white hover:bg-brand-deep/90"
                render={<Link href={`/models/${activeCar.slug}`} onClick={onNavigate} />}
              >
                Explore
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
