"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";

type Car = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

const types = ["BEV", "CSH", "ICE"] as const;

export function MobileModelMenu() {
  const [cars, setCars] = useState<Car[]>([]);
  const [openType, setOpenType] = useState<string | null>("BEV");

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data: Car[]) => {
        if (Array.isArray(data)) setCars(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-base font-bold text-brand-deep">
        Model
      </span>
      <div className="flex flex-col pl-4">
        {types.map((type) => {
          const carsForType = cars.filter((c) => c.type === type);
          const isOpen = openType === type;
          return (
            <div key={type}>
              <button
                type="button"
                onClick={() => setOpenType(isOpen ? null : type)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-deep/70"
              >
                {type}
                <ChevronDownIcon
                  className={isOpen ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="pb-2">
                  {carsForType.map((car) => (
                    <SheetClose
                      key={car.id}
                      render={
                        <Link
                          href={`/models/${car.slug}`}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {car.name}
                        </Link>
                      }
                    />
                  ))}
                  {carsForType.length === 0 && (
                    <span className="block px-3 py-2 text-sm text-muted-foreground">
                      Loading&hellip;
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
