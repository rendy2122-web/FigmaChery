"use client";

import { useState, useEffect } from "react";
import { ProductBreadcrumb } from "@/components/product/breadcrumb";
import { ProductHeroBanner } from "@/components/product/hero-banner";
import { MoreEfficient } from "@/components/product/more-efficient";
import { FasterPowerful } from "@/components/product/faster-powerful";
import { SmarterComfortable } from "@/components/product/smarter-comfortable";
import { ColorOptions } from "@/components/product/color-options";
import { DynamicsSafety } from "@/components/product/dynamics-safety";
import { VariantPricing } from "@/components/product/variant-pricing";

export default function TiggoCrossCshPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/car-1/sections")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSections(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const getSection = (type: string) => sections.find(s => s.section_type === type && s.is_active);

  return (
    <>
      <ProductBreadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "CSH", href: "/" },
          { label: "Tiggo Cross CSH" },
        ]}
      />
      <ProductHeroBanner />
      <MoreEfficient />
      <FasterPowerful />
      <SmarterComfortable />
      <ColorOptions />
      <DynamicsSafety />
      <VariantPricing />
    </>
  );
}