"use client";

import { useState } from "react";
import HeroSection from "@/components/product/hero-section";
import HeroSlide from "@/components/product/hero-slide";
import FeaturesGrid from "@/components/product/features-grid";
import SpecComparison from "@/components/product/spec-comparison";
import CustomerReviews from "@/components/product/customer-reviews";
import OtherProductsCarousel from "@/components/product/other-products-carousel";
import BookingForm from "@/components/product/booking-form";
import type { TestimonialWithCar } from "@/lib/data/testimonials";

export interface CarData {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price_from: string;
  type: string;
  thumbnail?: string;
  images: { url: string }[];
  color_images?: { color_name: string; color_hex: string; image_url: string }[];
  specs: { label: string; value: string }[];
  highlights: { title: string; description: string; iconName: string }[];
  interiorImage?: string;
  techImage?: string;
}

export function ProductDetailClient({
  car,
  allCars,
  testimonials,
}: {
  car: CarData;
  allCars: CarData[];
  testimonials: TestimonialWithCar[];
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"test" | "prebook">("test");

  const handleOpenBooking = (type: "test" | "prebook") => {
    setBookingType(type);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <HeroSlide slug={car.slug} heroImage={car.images?.[0]?.url} />
      <HeroSection car={car} onOpenBooking={handleOpenBooking} />
      <FeaturesGrid car={car} />
      <SpecComparison cars={allCars} currentCarId={car.id} />
      <CustomerReviews car={car} allCars={allCars} initialTestimonials={testimonials} />
      <OtherProductsCarousel currentCarId={car.id} cars={allCars} />

      {isBookingOpen && (
        <BookingForm
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          type={bookingType}
          cars={allCars}
          activeCar={car}
        />
      )}
    </div>
  );
}
