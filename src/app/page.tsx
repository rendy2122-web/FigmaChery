import { Suspense, lazy } from "react";
import { Hero } from "@/components/sections";
import { LoadingSection } from "@/components/ui/skeleton";

// Dynamic imports for below-fold sections to reduce initial bundle
const CarShowcase = lazy(() => import("@/components/sections/car-showcase").then(m => ({ default: m.CarShowcase })));
const WhyChery = lazy(() => import("@/components/sections/why-chery").then(m => ({ default: m.WhyChery })));
const SpecialOffers = lazy(() => import("@/components/sections/special-offers").then(m => ({ default: m.SpecialOffers })));
const Services = lazy(() => import("@/components/sections/services").then(m => ({ default: m.Services })));
const Dealerships = lazy(() => import("@/components/sections/dealerships").then(m => ({ default: m.Dealerships })));
const News = lazy(() => import("@/components/sections/news").then(m => ({ default: m.News })));
const CTA = lazy(() => import("@/components/sections/cta").then(m => ({ default: m.CTA })));

// ISR: Revalidate homepage every hour
export const revalidate = 3600;

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
        <CTA />
      </Suspense>
    </>
  );
}
