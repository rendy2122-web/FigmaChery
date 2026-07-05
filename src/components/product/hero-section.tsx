"use client";

import { useState, useEffect } from "react";
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

  const mappedColors = car.color_images?.map(ci => ({ name: ci.color_name, hex: ci.color_hex }));
  const colors = mappedColors && mappedColors.length > 0 ? mappedColors : [
    { name: "Stellar Silver", hex: "#b4b8b5" },
    { name: "Space Green", hex: "#2e4a3f" },
    { name: "Phantom Black", hex: "#111111" },
    { name: "Starlight Mint", hex: "#a1cca5" }
  ];

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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 text-[#1A1A1A] py-12 lg:py-24 border-b border-slate-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#DA291C]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-slate-300/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 z-10">
            <div>
              {/* Type Badge with icon */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border mb-4 bg-red-50 text-[#DA291C] border-[#DA291C]/20">
                {getPowerIcon()}
                {car.type} - {car.subtitle}
              </span>

              {/* Car Name - Large and Bold */}
              <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-[#1A1A1A] leading-none mb-3">
                {car.name}
              </h1>

              {/* Tagline - Red Color */}
              <p className="text-lg sm:text-xl font-bold text-[#DA291C] font-sans mb-4">
                {car.subtitle}
              </p>

              {/* Price Box */}
              <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-sm inline-block">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Harga OTR Spesial</span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A1A]">
                  Rp {car.price_from?.includes(".") ? car.price_from : parseInt(car.price_from || "0").toLocaleString("id-ID")}
                </span>
                <span className="block text-[10px] text-slate-400 mt-1">*OTR DKI Jakarta & Tangerang, subsidi EV berlaku.</span>
              </div>
            </div>

             {/* Description - Dynamic from database */}
             <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-sans">
               {car.description || "Nikmati pengalaman berkendara terbaik dengan teknologi dan desain premium dari Chery."}
             </p>

            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-100/60 border border-slate-200/60 rounded-sm font-sans">
              <div className="text-center lg:text-left border-r border-slate-200 pr-2">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold font-mono">
                  {isEV ? "Jarak Tempuh" : "Tipe Mesin"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] block mt-1">
                  {isEV ? "430 Km (WLTP)" : car.id === "car-10" ? "2.0L Turbo" : "1.6L Turbo"}
                </span>
              </div>
              <div className="text-center lg:text-left border-r border-slate-200 px-2">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold font-mono">Performa Maks</span>
                <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] block mt-1">{getPowerLabel()}</span>
              </div>
              <div className="text-center lg:text-left pl-2">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold font-mono">Transmisi / Pengisi</span>
                <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] block mt-1">{isEV ? "DC 80kW Fast" : "7-Speed DCT"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              <button onClick={() => onOpenBooking("prebook")} className="flex-1 bg-[#DA291C] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-sm text-xs uppercase tracking-wider transition-all duration-300 shadow-sm shadow-[#DA291C]/15 flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Pre-Book Sekarang
              </button>
              <button onClick={() => onOpenBooking("test")} className="flex-1 bg-transparent hover:bg-white text-[#1A1A1A] border border-slate-300 hover:border-slate-400 font-bold py-4 px-6 rounded-sm text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2">
                Book Test Drive
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center items-center relative space-y-6">
            <div className="w-full relative bg-gradient-to-br from-slate-200/50 to-slate-100/30 border border-slate-200 rounded-xl p-6 sm:p-10 flex flex-col items-center overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              <div className="absolute -bottom-10 w-4/5 h-20 blur-[60px] opacity-15 rounded-full transition-all duration-700" style={{ backgroundColor: colors[selectedColor].hex }} />

              <AnimatePresence mode="wait">
                <motion.div key={`${car.id}-${selectedColor}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full h-48 sm:h-64 lg:h-80 flex items-center justify-center z-10 select-none relative">
                  <img 
                    src={car.color_images?.[selectedColor]?.image_url || car.images?.[0]?.url || "/figma/car-q.png"} 
                    alt={`${car.name} - ${colors[selectedColor]?.name || 'Default'}`} 
                    className="max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer" 
                  />
                </motion.div>
              </AnimatePresence>

              <div className="w-11/12 h-4 bg-slate-900/10 rounded-full filter blur-md -mt-2 z-0 opacity-80" />

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-slate-200 py-1.5 px-3 rounded-sm text-[10px] font-bold text-slate-500 shadow-sm">
                <Palette className="w-3.5 h-3.5 text-[#DA291C]" />
                <span>Warna: <span className="text-[#1A1A1A] font-extrabold">{colors[selectedColor].name}</span></span>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-100/50 border border-slate-200 rounded-lg gap-4">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-2 font-sans">
                <Sliders className="w-4 h-4 text-[#DA291C]" /> Ubah Warna Tampilan Eksterior:
              </span>
              <div className="flex items-center gap-3.5">
                {colors.map((color, i) => (
                  <button key={color.name} onClick={() => setSelectedColor(i)} className={`relative w-8 h-8 rounded-full border-2 focus:outline-none transition-all duration-300 flex items-center justify-center ${i === selectedColor ? "border-[#DA291C] scale-110 shadow-md shadow-[#DA291C]/25" : "border-slate-300 hover:border-slate-400"}`} title={color.name}>
                    <span className="w-5 h-5 rounded-full block border border-black/10" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 shadow-sm rounded-sm">
                <ShieldCheck className="w-5 h-5 text-[#DA291C] shrink-0" />
                <div className="font-sans">
                  <h4 className="text-[11px] font-bold text-[#1A1A1A]">Garansi Mesin 10 Tahun</h4>
                  <p className="text-[9px] text-slate-500 leading-none mt-0.5">Atau 1.000.000 KM pertama</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 shadow-sm rounded-sm">
                <Cpu className="w-5 h-5 text-[#DA291C] shrink-0" />
                <div className="font-sans">
                  <h4 className="text-[11px] font-bold text-[#1A1A1A]">5-Star Safety Rated</h4>
                  <p className="text-[9px] text-slate-500 leading-none mt-0.5">Sertifikasi Euro NCAP bintang 5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}