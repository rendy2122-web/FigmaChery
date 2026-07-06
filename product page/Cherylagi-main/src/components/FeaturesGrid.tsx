import React from "react";
import { Zap, ShieldCheck, Tv, Compass, Flame, Layers, Volume2, Volume, Sparkles, CheckCircle } from "lucide-react";
import { CarModel } from "../types";

interface FeaturesGridProps {
  activeModel: CarModel;
}

export default function FeaturesGrid({ activeModel }: FeaturesGridProps) {
  // Helper to resolve icon from string
  const renderIcon = (iconName: string) => {
    const classes = "w-6 h-6 text-[#DA291C] stroke-[2.2]";
    switch (iconName) {
      case "Zap":
        return <Zap className={classes} />;
      case "ShieldCheck":
        return <ShieldCheck className={classes} />;
      case "Tv":
        return <Tv className={classes} />;
      case "Compass":
        return <Compass className={classes} />;
      case "Flame":
        return <Flame className={classes} />;
      case "Layers":
        return <Layers className={classes} />;
      case "Volume2":
        return <Volume2 className={classes} />;
      case "Volume":
        return <Volume className={classes} />;
      case "Sparkles":
        return <Sparkles className={classes} />;
      default:
        return <CheckCircle className={classes} />;
    }
  };

  return (
    <section id="features" className="bg-white text-[#1A1A1A] py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#DA291C] font-mono font-bold block mb-2">
            Inovasi Tanpa Batas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A]">
            Fitur Utama {activeModel.name}
          </h2>
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            Menyatukan kemewahan interior, ketangguhan sasis keselamatan, serta kecanggihan teknologi digital untuk menciptakan standar baru dalam berkendara.
          </p>
        </div>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Highlights List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {activeModel.highlights.map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-slate-50/70 border border-slate-100 rounded-sm flex flex-col justify-between hover:border-slate-300 transition-all duration-300 group shadow-sm"
              >
                <div className="p-3 bg-slate-100 border border-slate-200/50 rounded-sm w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  {renderIcon(item.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A] mb-2 font-sans group-hover:text-[#DA291C] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Luxury Cockpit Interior Card */}
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-100 rounded-sm overflow-hidden flex flex-col justify-between group shadow-sm">
            <div className="relative h-48 sm:h-64 overflow-hidden">
              <img
                src={activeModel.interiorImage}
                alt="Chery Luxury Cabin"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
              <span className="absolute top-4 right-4 bg-[#DA291C] text-white text-[10px] font-bold uppercase py-1 px-2.5 rounded-sm tracking-wider">
                Luxury Cabin
              </span>
            </div>
            <div className="p-6 sm:p-8 font-sans">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                Kenyamanan Kabin Kelas VIP
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manjakan indra Anda dengan pelapis jok bertekstur premium lembut, pencahayaan ambient LED dinamis yang menyatu, serta kesenyapan ruang kabin (NVH) luar biasa yang didesain secara akustik untuk perjalanan tanpa hambatan.
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Explanation: Tech & Safety Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-50 border border-slate-100 rounded-sm p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#DA291C] font-mono font-bold block">
              Sasis & Keamanan Aktif
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight">
              Struktur Bodi Baja Super Kuat & Sertifikasi Keselamatan Internasional
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Komitmen keselamatan Chery dibuktikan dengan penggunaan baja berkekuatan ultra-tinggi (Ultra High Strength Steel) di atas 78% pada struktur rangka mobil. Ini dikombinasikan dengan perlindungan sensor cerdas ADAS yang siap memprediksi dan memitigasi bahaya kecelakaan secara otonom dalam milidetik.
            </p>
            
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#DA291C] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-600">
                  <strong className="text-[#1A1A1A] font-extrabold">Teknologi Pelindung Tabrakan Bodi:</strong> Distribusi beban energi tabrakan multi-arah untuk perlindungan maksimal penghuni kabin.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#DA291C] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-600">
                  <strong className="text-[#1A1A1A] font-extrabold">Sistem Manajemen Suhu Cerdas (Khusus EV):</strong> Baterai LFP terlindungi penuh dari thermal runaway melalui cairan pendingin bersirkulasi konstan.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#DA291C] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-600">
                  <strong className="text-[#1A1A1A] font-extrabold">Kamera Pengawas 540-Derajat:</strong> Memberikan pandangan panorama di sekeliling kendaraan serta area di bawah kolong mobil secara transparan.
                </span>
              </div>
            </div>
          </div>

          <div className="relative rounded-sm overflow-hidden group border border-slate-200 shadow-sm">
            <img 
              src={activeModel.techImage} 
              alt="Chery Safety Tech Chassis" 
              className="w-full h-auto object-cover aspect-video transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
