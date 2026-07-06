"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, Flame, Cpu, Compass, Sliders, Palette, CreditCard } from "lucide-react";

interface CarData {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  price_from: string;
  description: string;
  images: { url: string }[];
  color_images?: { color_name: string; color_hex: string; image_url: string }[];
}

interface HeroSectionProps {
  car: CarData;
  onOpenBooking: (type: "test" | "prebook") => void;
}

export default function HeroSection({ car, onOpenBooking }: HeroSectionProps) {
  const [selectedColor, setSelectedColor] = useState(0);

  // Only 6 of 13 models currently have real, distinct per-color product shots.
  // Rather than showing a fake color picker that doesn't actually change the
  // image (and a badge that claims a color the picture doesn't match), the
  // picker only renders when the car actually has color_images.
  const hasColorOptions = Boolean(car.color_images && car.color_images.length > 0);
  const colors = hasColorOptions
    ? car.color_images!.map((ci) => ({ name: ci.color_name, hex: ci.color_hex }))
    : [];

  const displayImage = hasColorOptions
    ? car.color_images![selectedColor]?.image_url
    : car.images?.[0]?.url || "/figma/car-q.png";

  const isEV = car.type === "BEV";

  const getPowerIcon = () => {
    return isEV ? <Zap className="w-5 h-5 text-[#DA291C]" /> : <Flame className="w-5 h-5 text-[#DA291C]" />;
  };

  const getPowerLabel = () => {
    if (isEV) return "150 kW (201 HP)";
    if (car.id === "car-10") return "184/250";
    return "145/197";
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF9F9] text-[#1A1A1A] py-16 lg:py-24 border-b border-slate-100">
      {/* Decorative luxury gradient ambient lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#DA291C]/2 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-slate-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Specs, Price, CTA with entrance animation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-center space-y-6 z-10"
          >
            <div>
              {/* Type Badge with icon */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase border mb-4 bg-red-50 text-[#DA291C] border-[#DA291C]/15">
                {getPowerIcon()}
                {car.type} - {car.subtitle}
              </span>

              {/* Car Name - Large and Bold */}
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1A1A1A] leading-none mb-3">
                {car.name}
              </h1>

              {/* Tagline - Red Color */}
              <p className="text-lg sm:text-xl font-bold text-[#DA291C] font-heading mb-5">
                {car.subtitle}
              </p>

              {/* Price Box - Expensive Luxury Shadow Card */}
              <div className="p-5 bg-white border border-slate-100 rounded-sm shadow-xl shadow-slate-150/30 inline-block">
                <span className="block text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold font-mono">Harga OTR Spesial</span>
                <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#DA291C] block mt-1.5">
                  Rp {car.price_from?.includes(".") ? car.price_from : parseInt(car.price_from || "0").toLocaleString("id-ID")}
                </span>
                <span className="block text-[9px] text-slate-400 mt-1.5 font-medium">* OTR DKI Jakarta & Tangerang, subsidi EV berlaku.</span>
              </div>
            </div>

            {/* Description - Dynamic from database */}
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-sans">
              {car.description || "Nikmati pengalaman berkendara terbaik dengan teknologi dan desain premium dari Chery."}
            </p>

            {/* Spec Grid - Clean Luxury Card */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-5 bg-white border border-slate-100 rounded-sm shadow-xs hover:shadow-md transition-all duration-300 font-sans">
              <div className="text-center lg:text-left border-r border-slate-100 pr-2">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                  {isEV ? "Jarak Tempuh" : "Tipe Mesin"}
                </span>
                <span className="text-xs sm:text-[13px] font-black text-slate-900 block mt-1 tracking-tight">
                  {isEV ? "430 Km (WLTP)" : car.id === "car-10" ? "2.0L Turbo" : "1.6L Turbo"}
                </span>
              </div>
              <div className="text-center lg:text-left border-r border-slate-100 px-2">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">Performa Maks</span>
                <span className="text-xs sm:text-[13px] font-black text-slate-900 block mt-1 tracking-tight">{getPowerLabel()}</span>
              </div>
              <div className="text-center lg:text-left pl-2">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">Transmisi / Charge</span>
                <span className="text-xs sm:text-[13px] font-black text-slate-900 block mt-1 tracking-tight">{isEV ? "DC 80kW Fast" : "7-Speed DCT"}</span>
              </div>
            </div>

            {/* Buttons - Premium Transitions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              <button 
                onClick={() => onOpenBooking("prebook")} 
                className="flex-1 bg-[#DA291C] hover:bg-slate-950 text-white font-bold py-4 px-6 rounded-sm text-xs uppercase tracking-widest transition-all duration-500 shadow-lg shadow-[#DA291C]/10 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Pre-Book Sekarang
              </button>
              <button 
                onClick={() => onOpenBooking("test")} 
                className="flex-1 bg-transparent hover:bg-[#DA291C]/5 text-slate-800 hover:text-[#DA291C] border border-slate-200 hover:border-[#DA291C]/30 font-bold py-4 px-6 rounded-sm text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2"
              >
                Book Test Drive
              </button>
            </div>
          </motion.div>

          {/* Right Column: Interactive Color Selector & Car Showcase Card with entrance animation */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center items-center relative space-y-6"
          >
            {/* Luxury Car Display Pod */}
            <div className="w-full relative bg-gradient-to-br from-white to-slate-50/80 border border-slate-100 rounded-sm p-6 sm:p-10 lg:p-12 flex flex-col items-center overflow-hidden group shadow-sm hover:shadow-2xl hover:border-slate-200/50 transition-all duration-500 ease-out">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Dynamic glowing shadow matching the selected color */}
              <div
                className="absolute -bottom-16 w-3/4 h-32 blur-[80px] opacity-25 rounded-full transition-all duration-1000 ease-out scale-100 group-hover:scale-110"
                style={{ backgroundColor: hasColorOptions ? colors[selectedColor].hex : "#c4c4c4" }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${car.id}-${selectedColor}`}
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-48 sm:h-64 lg:h-80 flex items-center justify-center z-10 select-none relative"
                >
                  <Image
                    src={displayImage}
                    alt={hasColorOptions ? `${car.name} - ${colors[selectedColor]?.name}` : car.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="w-11/12 h-4 bg-slate-900/10 rounded-full filter blur-md -mt-2 z-0 opacity-80" />

              {/* Tiny Floating Color Tag — only shown when the model has real color variants */}
              {hasColorOptions && (
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-slate-100 py-1.5 px-3 rounded-sm text-[10px] font-bold text-slate-500 shadow-xs">
                  <Palette className="w-3.5 h-3.5 text-[#DA291C]" />
                  <span>Warna: <span className="text-[#1A1A1A] font-extrabold">{colors[selectedColor].name}</span></span>
                </div>
              )}
            </div>

            {/* Premium Selector Card — only rendered when the model has real color variants */}
            {hasColorOptions && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-slate-100 rounded-sm shadow-xs hover:shadow-md transition-all duration-300 gap-4">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2 font-sans uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-[#DA291C] animate-pulse" /> Ubah Warna Tampilan Eksterior:
                </span>
                <div className="flex items-center gap-4">
                  {colors.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      className={`relative w-8 h-8 rounded-full border focus:outline-none transition-all duration-500 flex items-center justify-center ${i === selectedColor ? "border-[#DA291C] scale-115 shadow-lg shadow-[#DA291C]/20" : "border-transparent hover:scale-105"}`}
                      title={color.name}
                    >
                      <span className="w-6 h-6 rounded-full block border border-black/5" style={{ backgroundColor: color.hex }} />
                      {i === selectedColor && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DA291C] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DA291C]"></span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Secondary Cards (Garansi & Safety) */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="group/card flex items-center gap-3.5 p-4 bg-white border border-slate-100 shadow-sm rounded-sm hover:shadow-xl hover:shadow-slate-150/30 hover:border-[#DA291C]/10 hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-sm text-[#DA291C] group-hover/card:bg-[#DA291C] group-hover/card:text-white transition-all duration-300">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                </div>
                <div className="font-sans">
                  <h4 className="text-[11px] font-bold text-slate-900 group-hover/card:text-[#DA291C] transition-colors duration-300">Garansi Mesin 10 Tahun</h4>
                  <p className="text-[9px] text-slate-400 leading-none mt-1">Atau 1.000.000 KM pertama</p>
                </div>
              </div>
              <div className="group/card flex items-center gap-3.5 p-4 bg-white border border-slate-100 shadow-sm rounded-sm hover:shadow-xl hover:shadow-slate-150/30 hover:border-[#DA291C]/10 hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-sm text-[#DA291C] group-hover/card:bg-[#DA291C] group-hover/card:text-white transition-all duration-300">
                  <Cpu className="w-4 h-4 shrink-0" />
                </div>
                <div className="font-sans">
                  <h4 className="text-[11px] font-bold text-slate-900 group-hover/card:text-[#DA291C] transition-colors duration-300">5-Star Safety Rated</h4>
                  <p className="text-[9px] text-slate-400 leading-none mt-1">Sertifikasi Euro NCAP bintang 5</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}