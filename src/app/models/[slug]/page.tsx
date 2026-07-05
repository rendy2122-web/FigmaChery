"use client";

import { useState, useEffect, use } from "react";
import HeroSection from "@/components/product/hero-section";
import HeroSlide from "@/components/product/hero-slide";
import FeaturesGrid from "@/components/product/features-grid";
import SpecComparison from "@/components/product/spec-comparison";
import CustomerReviews from "@/components/product/customer-reviews";
import BookingForm from "@/components/product/booking-form";

interface CarData {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price_from: string;
  type: string;
  images: { url: string }[];
  color_images?: { color_name: string; color_hex: string; image_url: string }[];
  specs: { label: string; value: string }[];
  highlights: { title: string; description: string; iconName: string }[];
  interiorImage?: string;
  techImage?: string;
  features: { name: string; description: string }[];
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [car, setCar] = useState<CarData | null>(null);
  const [allCars, setAllCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"test" | "prebook">("test");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/cars/by-slug/${slug}`);
        const data = await res.json();
        setCar(data);

        const allRes = await fetch("/api/cars");
        const allData = await allRes.json();
        setAllCars(allData);
      } catch (err) {
        console.error("Failed to fetch car:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleOpenBooking = (type: "test" | "prebook") => {
    setBookingType(type);
    setIsBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#DA291C] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Car not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <HeroSlide slug={car.slug} />
      <HeroSection car={car} onOpenBooking={handleOpenBooking} />
      <FeaturesGrid car={car} />
      <SpecComparison cars={allCars} />
      <CustomerReviews car={car} allCars={allCars} />

      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        type={bookingType}
        cars={allCars}
        activeCar={car}
      />
    </div>
  );
}