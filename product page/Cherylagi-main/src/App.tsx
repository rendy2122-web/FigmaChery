import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesGrid from "./components/FeaturesGrid";
import SpecComparison from "./components/SpecComparison";
import CustomerReviews from "./components/CustomerReviews";
import BookingForm from "./components/BookingForm";
import CheryAssistant from "./components/CheryAssistant";
import { CHERY_MODELS } from "./data/cheryData";
import { CarModel } from "./types";
import { Car, Sliders, MessageSquare, PhoneCall, ShieldCheck, Mail, MapPin } from "lucide-react";

export default function App() {
  const [activeModel, setActiveModel] = useState<CarModel>(CHERY_MODELS[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"test" | "prebook">("test");

  // Scroll to section helper
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Open booking modal
  const handleOpenBooking = (type: "test" | "prebook") => {
    setBookingType(type);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] selection:bg-[#DA291C]/10 selection:text-[#DA291C]">
      
      {/* 1. Navbar */}
      <Navbar
        models={CHERY_MODELS}
        activeModel={activeModel}
        onSelectModel={setActiveModel}
        onScrollToSection={handleScrollToSection}
        onOpenBooking={handleOpenBooking}
      />

      {/* 2. Hero Section (Interactive Color Selector & Showcase) */}
      <HeroSection 
        activeModel={activeModel} 
        onOpenBooking={handleOpenBooking} 
      />

      {/* 3. Bento Features Grid (Informative deep-dive specs & cabin lux) */}
      <FeaturesGrid 
        activeModel={activeModel} 
      />

      {/* 4. Specs Comparison (Interactive side-by-side matrices) */}
      <SpecComparison 
        models={CHERY_MODELS} 
      />

      {/* 5. Customer Reviews (Interactive owner logs with local storage) */}
      <CustomerReviews 
        activeModel={activeModel} 
      />

      {/* 6. Professional Footer with trust seals and contact details */}
      <footer className="bg-[#1A1A1A] border-t border-slate-800 text-slate-400 py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-slate-800 pb-12 mb-10">
            
            {/* Logo, tagline */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#DA291C]">
                  <Car className="w-5.5 h-5.5 text-white stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-sans font-black text-xl tracking-tighter text-white">
                    CHERY
                  </span>
                  <span className="block text-[8px] uppercase tracking-[0.25em] text-[#DA291C] font-mono font-medium leading-none">
                    Indonesia BY GASTRONOT
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Chery Indonesia berkomitmen menghadirkan kendaraan ramah lingkungan, mewah, bertenaga turbo, dan dilengkapi fitur keselamatan asisten pengemudi (ADAS) termutakhir di kelasnya.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Jelajahi SUV</h4>
              <ul className="space-y-2 text-xs">
                {CHERY_MODELS.map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => {
                        setActiveModel(m);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-[#DA291C] transition-colors text-left"
                    >
                      {m.name} {m.type === "EV" ? "(Electric)" : "(Turbo)"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support and Contact */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Kontak & Layanan Darurat</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#DA291C] shrink-0" />
                  <span>Call Center Chery: **1500-790** (24 Jam)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#DA291C] shrink-0" />
                  <span>Email: **support@chery.id**</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#DA291C] shrink-0" />
                  <span>PT Chery Motor Indonesia, Jakarta Selatan</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Copy & Legal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Chery Indonesia. Seluruh hak cipta dilindungi. Diinspirasi dari chery.by.gastronot.id.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
              <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
              <span className="hover:text-slate-400 cursor-pointer">Garansi 1.000.000 KM</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 7. Floating Chatbot Ambassador "CHIVA" */}
      <CheryAssistant />

      {/* 8. Booking modal (Test drive appointment or prebook payment setup) */}
      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        type={bookingType}
        models={CHERY_MODELS}
        activeModel={activeModel}
      />

    </div>
  );
}
