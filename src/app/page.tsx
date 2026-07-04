import {
  Hero,
  CarShowcase,
  WhyChery,
  SpecialOffers,
  Services,
  Dealerships,
  News,
  CTA,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <CarShowcase />
      <WhyChery />
      <SpecialOffers />
      <Services />
      <Dealerships />
      <News />
      <CTA />
    </>
  );
}
