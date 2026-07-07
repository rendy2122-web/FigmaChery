"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Car {
  id: string;
  name: string;
  type: string;
  price_from: string;
  specs: { label: string; value: string }[];
}

interface SpecComparisonProps {
  cars: Car[];
  currentCarId?: string;
}

export default function SpecComparison({ cars, currentCarId }: SpecComparisonProps) {
  const [modelAId, setModelAId] = useState<string>(() => {
    if (!cars || cars.length === 0) return "";
    return currentCarId ? (cars.find(c => c.id === currentCarId)?.id || cars[0].id) : cars[0].id;
  });
  const [modelBId, setModelBId] = useState<string>(() => {
    if (!cars || cars.length === 0) return "";
    const defaultA = currentCarId ? (cars.find(c => c.id === currentCarId)?.id || cars[0].id) : cars[0].id;
    return cars.find(c => c.id !== defaultA)?.id || cars[1]?.id || cars[0].id;
  });
  
  // Accordion state with Ringkasan Utama & Performa Mesin open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Ringkasan Utama": true,
    "Performa & Mesin": true,
    "Dimensi & Kapasitas": false,
    "Suspensi & Roda": false,
    "Teknologi & Keamanan": false,
  });

  const modelA = cars.find((m) => m.id === modelAId) || cars[0];
  const modelB = cars.find((m) => m.id === modelBId) || cars[1];

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const getSpecValue = (car: Car | undefined, label: string): string => {
    if (!car) return "-";
    
    if (label === "price_from") {
      const price = car.price_from;
      if (!price) return "-";
      return price.includes(".") ? `Rp ${price}` : `Rp ${parseInt(price || "0").toLocaleString("id-ID")}`;
    }
    
    // Perform loose matching to handle variations in label naming
    const normalizedLabel = label.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    const spec = car.specs?.find((s) => {
      const sNorm = s.label.toLowerCase().replace(/[^a-z0-9]/g, "");
      // Check for exact normalized match, or key substrings
      if (sNorm === normalizedLabel) return true;
      if (normalizedLabel.includes("power") && sNorm.includes("power")) return true;
      if (normalizedLabel.includes("torque") && sNorm.includes("torque")) return true;
      if (normalizedLabel.includes("dimensions") && sNorm.includes("dimensions")) return true;
      if (normalizedLabel.includes("battery") && sNorm.includes("battery")) return true;
      if (normalizedLabel.includes("range") && sNorm.includes("range")) return true;
      if (normalizedLabel.includes("engine") && sNorm.includes("engine")) return true;
      return false;
    });
    
    if (spec?.value) return spec.value;
    
    // Return default values for common specs
    const defaults: Record<string, string> = {
      "type": car.type || "ICE",
      "warranty": "10 Tahun / 1.000.000 KM",
      "seats": ["car-5", "car-7", "car-12", "car-13"].includes(car.id) ? "7 Seater" : "5 Seater",
      "trunk_capacity": ["car-5", "car-13"].includes(car.id) ? "193 L" : "450 L",
      "front_suspension": "MacPherson Strut",
      "rear_suspension": ["car-5", "car-10", "car-13"].includes(car.id) ? "Multi-Link" : "Torsion Beam",
      "wheel_size": ["car-5", "car-10", "car-13"].includes(car.id) ? "18 inch" : "17 inch",
      "drive_type": car.id === "car-13" ? "AWD" : "FWD",
      "brake_system": "ABS + EBD + BA",
      "safety_features": "ESC, TCS, HSA, TPMS",
      "ADAS": ["car-13", "car-5", "car-10", "car-2", "car-3", "car-7", "car-12"].includes(car.id)
        ? "Advanced ADAS (ACC, AEB, LKA, BSD, LDW)"
        : ["car-1"].includes(car.id)
        ? "Tidak Tersedia"
        : "Standard ADAS (ACC, AEB, BSD)",
      "Airbags": car.id === "car-13" 
        ? "9 Airbags" 
        : ["car-1"].includes(car.id) 
        ? "2 Airbags" 
        : ["car-4", "car-6", "car-9", "car-11"].includes(car.id)
        ? "4 Airbags"
        : "6 Airbags",
    };
    
    return defaults[label] || "-";
  };

  const comparisonSections = [
    {
      title: "Ringkasan Utama",
      specs: [
        { name: "Tipe Kendaraan", label: "type" },
        { name: "Harga OTR Mulai", label: "price_from" },
        { name: "Tipe Energi", label: "type" },
        { name: "Garansi Mesin", label: "warranty" },
      ]
    },
    {
      title: "Performa & Mesin",
      specs: [
        { name: "Tenaga Maksimal", label: "Maximum power (kW/PS)" },
        { name: "Torsi Maksimal", label: "Maximum torque (NM)" },
        { name: "Kapasitas Baterai / Mesin", label: "Battery capacity (kWh)" },
        { name: "Jarak Tempuh", label: "Range (km)" },
        { name: "Kapasitas Mesin (cc)", label: "Engine capacity (cc)" },
      ]
    },
    {
      title: "Dimensi & Kapasitas",
      specs: [
        { name: "Panjang x Lebar x Tinggi", label: "Dimensions (L x W x H) (mm.)" },
        { name: "Jumlah Kursi", label: "seats" },
        { name: "Kapasitas Bagasi (L)", label: "trunk_capacity" },
      ]
    },
    {
      title: "Suspensi & Roda",
      specs: [
        { name: "Tipe Suspensi Depan", label: "front_suspension" },
        { name: "Tipe Suspensi Belakang", label: "rear_suspension" },
        { name: "Ukuran Ban", label: "wheel_size" },
        { name: "Sistem Penggerak", label: "drive_type" },
      ]
    },
    {
      title: "Teknologi & Keamanan",
      specs: [
        { name: "Sistem ADAS", label: "ADAS" },
        { name: "Jumlah Airbags", label: "Airbags" },
        { name: "Sistem Rem", label: "brake_system" },
        { name: "Fitur Keselamatan", label: "safety_features" },
      ]
    }
  ];

  return (
    <section id="comparison" className="bg-[#FAF9F9] text-[#1A1A1A] py-24 sm:py-32 border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#DA291C] font-mono font-bold block mb-3">Perbandingan Cerdas</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 leading-tight">Komparasi Spesifikasi Interaktif</h2>
          <p className="mt-4 text-slate-500 text-base leading-relaxed font-medium">Pilih dua tipe mobil Chery yang ingin Anda bandingkan secara langsung.</p>
        </div>

        {/* Dropdown Selector Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Card A */}
          <div className="p-6 bg-white border border-slate-100 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:border-[#DA291C]/15 hover:-translate-y-1 transition-all duration-500 ease-out">
            <div className="space-y-1 font-sans">
              <span className="block text-[8px] text-slate-400 uppercase font-black tracking-widest font-mono">Pilih Kendaraan A</span>
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block">{modelA?.name}</span>
            </div>
            <div className="relative inline-block w-full sm:w-56">
              <select 
                value={modelAId} 
                onChange={(e) => setModelAId(e.target.value)} 
                className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-800 py-3 px-4 pr-10 rounded-sm text-xs font-bold font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#DA291C] shadow-xs transition-colors"
              >
                {cars.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Card B */}
          <div className="p-6 bg-white border border-slate-100 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:border-[#DA291C]/15 hover:-translate-y-1 transition-all duration-500 ease-out">
            <div className="space-y-1 font-sans">
              <span className="block text-[8px] text-slate-400 uppercase font-black tracking-widest font-mono">Pilih Kendaraan B</span>
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block">{modelB?.name}</span>
            </div>
            <div className="relative inline-block w-full sm:w-56">
              <select 
                value={modelBId} 
                onChange={(e) => setModelBId(e.target.value)} 
                className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-800 py-3 px-4 pr-10 rounded-sm text-xs font-bold font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#DA291C] shadow-xs transition-colors"
              >
                {cars.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.id === modelAId}>
                    {m.name} {m.id === modelAId ? "(Aktif di A)" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Main Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="border border-slate-100 rounded-sm overflow-hidden bg-white shadow-md hover:shadow-2xl hover:shadow-slate-250/30 transition-all duration-500 ease-out"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-slate-50 p-6 border-b border-slate-100 items-center text-center font-sans">
            <div className="text-left text-xs uppercase font-black text-slate-400 tracking-widest">Spesifikasi Teknis</div>
            <div className="font-heading font-black text-sm sm:text-base text-[#DA291C] tracking-tight">{modelA?.name}</div>
            <div className="font-heading font-black text-sm sm:text-base text-slate-950 tracking-tight">{modelB?.name}</div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparisonSections.map((section, secIdx) => {
              const isOpen = !!openSections[section.title];
              return (
                <div key={secIdx} className="space-y-0 font-sans">
                  {/* Section Separator Button (Clickable to toggle collapse) */}
                  <button 
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/50 py-4 px-6 border-b border-slate-100 transition-colors focus:outline-none cursor-pointer group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                      {section.title}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#DA291C]" : "group-hover:text-slate-600"}`} 
                    />
                  </button>

                  {/* Collapsible content with smooth height transition */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-slate-100">
                          {section.specs.map((spec, specIdx) => {
                            const specLabel = spec.label;
                            const valA = modelA ? getSpecValue(modelA, specLabel) : "-";
                            const valB = modelB ? getSpecValue(modelB, specLabel) : "-";
                            const isDifferent = valA !== valB;

                            return (
                              <div key={specIdx} className="grid grid-cols-3 p-5 sm:p-6 text-xs sm:text-sm items-center text-center hover:bg-slate-50/40 transition-colors">
                                <div className="text-left font-bold text-slate-500 pr-2 tracking-tight">{spec.name}</div>
                                <div className={`px-3 py-2 font-semibold ${isDifferent ? "text-[#DA291C] bg-[#DA291C]/3 rounded-sm" : "text-slate-800"}`}>{valA}</div>
                                <div className={`px-3 py-2 font-semibold ${isDifferent ? "text-slate-950 bg-slate-100/50 rounded-sm" : "text-slate-800"}`}>{valB}</div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Warning Note */}
        <div className="mt-8 flex items-start sm:items-center gap-3.5 bg-white border border-slate-100 p-5 rounded-sm text-xs text-slate-500 font-sans shadow-xs">
          <HelpCircle className="w-5 h-5 text-[#DA291C] shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">Spesifikasi di atas dapat berubah sewaktu-waktu oleh ATPM Chery Indonesia. Untuk penawaran skema cicilan kredit tenor hingga 7 tahun dan promo DP murah khusus, silakan tanyakan kepada sales kami.</p>
        </div>

      </div>
    </section>
  );
}