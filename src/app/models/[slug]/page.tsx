"use client";

import { useState, useEffect, use } from "react";
import HeroSection from "@/components/product/hero-section";
import FeaturesGrid from "@/components/product/features-grid";
import SpecComparison from "@/components/product/spec-comparison";
import CustomerReviews from "@/components/product/customer-reviews";
import BookingForm from "@/components/product/booking-form";
import CheryAssistant from "@/components/product/chery-assistant";

interface CarData {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price_from: string;
  type: string;
  images: { url: string }[];
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
      <HeroSection car={car} onOpenBooking={handleOpenBooking} />
      <FeaturesGrid car={car} />
      <SpecComparison cars={allCars} />
      <CustomerReviews car={car} allCars={allCars} />

      {/* Footer */}
      <footer className="bg-[#1A1A1A] border-t border-slate-800 text-slate-400 py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-slate-800 pb-12 mb-10">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#DA291C]">
                  <svg className="w-5.5 h-5.5 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div>
                  <span className="font-sans font-black text-xl tracking-tighter text-white">CHERY</span>
                  <span className="block text-[8px] uppercase tracking-[0.25em] text-[#DA291C] font-mono font-medium leading-none">Indonesia BY GASTRONOT</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Chery Indonesia berkomitmen menghadirkan kendaraan ramah lingkungan, mewah, bertenaga turbo, dan dilengkapi fitur keselamatan asisten pengemudi (ADAS) termutakhir di kelasnya.
              </p>
            </div>
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Kontak</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-2">
                  <span>Call Center: **1500-790** (24 Jam)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Email: **support@chery.id**</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>PT Chery Motor Indonesia, Jakarta Selatan</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>&copy; {new Date().getFullYear()} Chery Indonesia. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>

      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        type={bookingType}
        cars={allCars}
        activeCar={car}
      />

      <CheryAssistant />
    </div>
  );
}