import React, { useState } from "react";
import { Sliders, Check, HelpCircle, ArrowRight, ChevronDown } from "lucide-react";
import { CarModel } from "../types";

interface SpecComparisonProps {
  models: CarModel[];
}

export default function SpecComparison({ models }: SpecComparisonProps) {
  // Local state to hold chosen models for Comparison Card A and Comparison Card B
  const [modelAId, setModelAId] = useState<string>("omoda-e5");
  const [modelBId, setModelBId] = useState<string>("tiggo-8-pro-max");

  const modelA = models.find((m) => m.id === modelAId) || models[0];
  const modelB = models.find((m) => m.id === modelBId) || models[1];

  // Technical specifications matrix to map over
  const comparisonSections = [
    {
      title: "Ringkasan Utama",
      specs: [
        { name: "Tipe Kendaraan", getValue: (m: CarModel) => m.typeName },
        { name: "Harga OTR Mulai", getValue: (m: CarModel) => m.basePrice },
        { name: "Tipe Energi", getValue: (m: CarModel) => m.type === "EV" ? "100% Listrik" : "Bensin Turbo" },
      ]
    },
    {
      title: "Performa & Mesin",
      specs: [
        { name: "Kapasitas / Baterai", getValue: (m: CarModel) => m.type === "EV" ? "61 kWh LFP" : m.id === "tiggo-8-pro-max" ? "1.998 cc (Turbo)" : "1.598 cc (Turbo)" },
        { name: "Tenaga Maksimal", getValue: (m: CarModel) => m.type === "EV" ? "150 kW (201 HP)" : m.id === "tiggo-8-pro-max" ? "250 HP" : "197 HP" },
        { name: "Torsi Maksimal", getValue: (m: CarModel) => m.type === "EV" ? "340 Nm" : m.id === "tiggo-8-pro-max" ? "390 Nm" : "290 Nm" },
        { name: "Transmisi", getValue: (m: CarModel) => m.type === "EV" ? "Automatic Single Reduction Gear" : "7-Speed Dual Clutch (DCT)" },
        { name: "Sistem Penggerak", getValue: (m: CarModel) => m.type === "EV" ? "Front-Wheel Drive (FWD)" : m.id === "tiggo-8-pro-max" ? "All-Wheel Drive (AWD)" : "FWD / AWD" },
      ]
    },
    {
      title: "Dimensi & Kapasitas",
      specs: [
        { name: "Panjang x Lebar x Tinggi", getValue: (m: CarModel) => m.id === "omoda-e5" ? "4.424 x 1.830 x 1.588 mm" : m.id === "tiggo-8-pro-max" ? "4.722 x 1.860 x 1.705 mm" : "4.400 x 1.830 x 1.588 mm" },
        { name: "Jarak Sumbu Roda", getValue: (m: CarModel) => m.id === "tiggo-8-pro-max" ? "2.710 mm" : "2.630 mm" },
        { name: "Kapasitas Tempat Duduk", getValue: (m: CarModel) => m.id === "tiggo-8-pro-max" ? "7 Seater (Kabin Luas VIP)" : "5 Seater (Sport Crossover)" },
        { name: "Suspensi Belakang", getValue: (m: CarModel) => "Multi-Link Independent" },
        { name: "Ukuran Velg & Ban", getValue: (m: CarModel) => m.id === "tiggo-8-pro-max" ? "19-inch (235/50 R19)" : "18-inch (215/55 R18)" },
      ]
    },
    {
      title: "Teknologi & Keamanan",
      specs: [
        { name: "Sistem ADAS", getValue: (m: CarModel) => m.type === "EV" ? "ADAS 2.5 (18 Fitur Aktif)" : "ADAS Aktif Pintar" },
        { name: "Jumlah Airbags", getValue: (m: CarModel) => m.id === "tiggo-8-pro-max" ? "9 Airbags" : "6 Airbags" },
        { name: "Sistem Audio Premium", getValue: (m: CarModel) => m.id === "tiggo-8-pro-max" ? "Sony 10 Speakers" : m.id === "omoda-e5" ? "Sony Premium Audio System" : "Sony 8 Speakers" },
        { name: "Layar Panoramic Dashboard", getValue: (m: CarModel) => m.id === "omoda-e5" ? "Dual 24.6-inch Curved Screen" : m.id === "tiggo-8-pro-max" ? "Dual screen HD" : "Dual screen 20.5-inch" },
      ]
    }
  ];

  return (
    <section id="comparison" className="bg-white text-[#1A1A1A] py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#DA291C] font-mono font-bold block mb-2">
            Perbandingan Cerdas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A]">
            Komparasi Spesifikasi Interaktif
          </h2>
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            Pilih dua tipe mobil Chery yang ingin Anda bandingkan secara langsung untuk menganalisis keunggulan mesin, fitur kenyamanan, keamanan aktif, hingga efisiensi harga.
          </p>
        </div>

        {/* Dynamic Selectors Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Selector A */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="block text-[10px] text-[#DA291C] uppercase font-bold tracking-widest font-mono">
                Pilih Kendaraan A
              </span>
              <span className="text-lg font-bold text-[#1A1A1A] block">
                {modelA.name}
              </span>
            </div>
            <div className="relative inline-block w-full sm:w-56">
              <select
                value={modelAId}
                onChange={(e) => setModelAId(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-800 py-3 px-4 pr-10 rounded-sm text-xs font-bold font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#DA291C] shadow-sm"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Selector B */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="block text-[10px] text-[#DA291C] uppercase font-bold tracking-widest font-mono">
                Pilih Kendaraan B
              </span>
              <span className="text-lg font-bold text-[#1A1A1A] block">
                {modelB.name}
              </span>
            </div>
            <div className="relative inline-block w-full sm:w-56">
              <select
                value={modelBId}
                onChange={(e) => setModelBId(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-800 py-3 px-4 pr-10 rounded-sm text-xs font-bold font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#DA291C] shadow-sm"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.id === modelAId}>
                    {m.name} {m.id === modelAId ? "(Aktif di A)" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm">
          
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-slate-50 p-6 border-b border-slate-200 items-center text-center font-sans">
            <div className="text-left text-xs uppercase font-extrabold text-slate-500 tracking-wider">
              Spesifikasi Teknis
            </div>
            <div className="font-extrabold text-sm sm:text-base text-[#DA291C]">
              {modelA.name}
            </div>
            <div className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">
              {modelB.name}
            </div>
          </div>

          {/* Body Sections */}
          <div className="divide-y divide-slate-200">
            {comparisonSections.map((section, secIdx) => (
              <div key={secIdx} className="space-y-0 font-sans">
                {/* Category Header */}
                <div className="bg-slate-50 py-3.5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60">
                  {section.title}
                </div>
                
                {/* Section Specs */}
                <div className="divide-y divide-slate-100">
                  {section.specs.map((spec, specIdx) => {
                    const valA = spec.getValue(modelA);
                    const valB = spec.getValue(modelB);
                    const isDifferent = valA !== valB;

                    return (
                      <div 
                        key={specIdx} 
                        className="grid grid-cols-3 p-5 sm:p-6 text-xs sm:text-sm items-center text-center hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Spec Name */}
                        <div className="text-left font-semibold text-slate-500 pr-2">
                          {spec.name}
                        </div>
                        
                        {/* Value A */}
                        <div className={`px-2 font-medium ${isDifferent ? "text-[#DA291C] font-bold bg-red-50/40 rounded-sm py-1.5" : "text-slate-800"}`}>
                          {valA}
                        </div>
                        
                        {/* Value B */}
                        <div className={`px-2 font-medium ${isDifferent ? "text-[#1A1A1A] font-bold bg-slate-100/50 rounded-sm py-1.5" : "text-slate-800"}`}>
                          {valB}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Spec Footnote */}
        <div className="mt-6 flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-4 rounded-sm text-xs text-slate-500 font-sans">
          <HelpCircle className="w-5 h-5 text-[#DA291C] shrink-0" />
          <p>
            Spesifikasi di atas dapat berubah sewaktu-waktu oleh ATPM Chery Indonesia. Untuk penawaran skema cicilan kredit tenor hingga 7 tahun dan promo DP murah khusus, silakan tanyakan kepada **CHIVA AI** kami di pojok kanan bawah.
          </p>
        </div>

      </div>
    </section>
  );
}
