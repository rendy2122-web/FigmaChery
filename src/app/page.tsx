import type { Metadata } from "next";
import { Suspense, lazy } from "react";
import { Hero } from "@/components/sections";
import { LoadingSection } from "@/components/ui/skeleton";
import { getSeoMetadata } from "@/lib/data/seo";

// Dynamic imports for below-fold sections to reduce initial bundle
const CarShowcase = lazy(() => import("@/components/sections/car-showcase").then(m => ({ default: m.CarShowcase })));
const WhyChery = lazy(() => import("@/components/sections/why-chery").then(m => ({ default: m.WhyChery })));
const SpecialOffers = lazy(() => import("@/components/sections/special-offers").then(m => ({ default: m.SpecialOffers })));
const Services = lazy(() => import("@/components/sections/services").then(m => ({ default: m.Services })));
const Dealerships = lazy(() => import("@/components/sections/dealerships").then(m => ({ default: m.Dealerships })));
const News = lazy(() => import("@/components/sections/news").then(m => ({ default: m.News })));
const FAQ = lazy(() => import("@/components/sections/faq").then(m => ({ default: m.FAQ })));
const CTA = lazy(() => import("@/components/sections/cta").then(m => ({ default: m.CTA })));

export const dynamic = "force-dynamic";

const DEFAULT_TITLE = "Dealer Resmi Chery Indonesia — Tiggo, Omoda, E5 & Lini Hybrid/EV";
const DEFAULT_DESCRIPTION =
  "Jelajahi lineup lengkap Chery Indonesia: BEV, hybrid CSH, dan ICE. Simulasi kredit, jadwalkan test drive, dan temukan dealer resmi terdekat di Cibubur, Makassar, dan Pare-pare.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeoMetadata("home");

  const title = seo?.title || DEFAULT_TITLE;
  const description = seo?.description || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    keywords: seo?.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: seo?.canonical ? { canonical: seo.canonical } : undefined,
    robots: seo?.no_index ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
    },
  };
}

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingSection />}>
        <CarShowcase />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <WhyChery />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <SpecialOffers />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <Services />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <Dealerships />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <News />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <CTA />
      </Suspense>
    </>
  );
}
