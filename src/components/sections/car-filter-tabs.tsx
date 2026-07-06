"use client";

import { useState } from "react";

type CarType = "BEV" | "CSH" | "ICE";

interface CarFilterTabsProps {
  onFilterChange: (type: CarType) => void;
  activeFilter: CarType;
}

export function CarFilterTabs({ onFilterChange, activeFilter }: CarFilterTabsProps) {
  const tabs: { label: string; value: CarType }[] = [
    { label: "BEV", value: "BEV" },
    { label: "CSH", value: "CSH" },
    { label: "ICE", value: "ICE" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onFilterChange(tab.value)}
          aria-pressed={activeFilter === tab.value}
          className={`
            px-6 py-3 rounded-full text-sm font-medium transition-all duration-200
            ${
              activeFilter === tab.value
                ? "bg-brand-deep text-white shadow-md"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-deep hover:text-brand-deep"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}