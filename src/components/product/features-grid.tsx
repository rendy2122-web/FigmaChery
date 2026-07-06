"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Zap, ShieldCheck, Tv, Compass, Flame, Layers, Volume2, Volume, Sparkles, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface CarData {
  slug: string;
  highlights: { title: string; description: string; iconName: string }[];
  interiorImage?: string;
  techImage?: string;
}

interface FeaturesGridProps {
  car: CarData;
}

const getFolderName = (slug: string): string => {
  switch (slug) {
    case "chery-q": return "chery q";
    case "chery-e5": return "chery e5";
    case "chery-j6": return "J6";
    case "chery-c5-csh": return "chery c5 csh";
    case "chery-c5": return "chery c5";
    case "omoda-5-gt": return "Omoda 5 GT";
    case "tiggo-9-csh": return "tiggo 9 csh";
    case "tiggo-cross-csh": return "tiggo cross csh";
    case "tiggo-8-csh": return "tiggo 8 csh";
    case "tiggo-cross-sport": return "tiggo cross sport";
    case "tiggo-cross": return "tiggo cross";
    case "tiggo-8": return "tiggo 8";
    case "tiggo-8-pro-max": return "tiggo 8 pro max";
    default: return slug.replace(/-/g, " ");
  }
};

export default function FeaturesGrid({ car }: FeaturesGridProps) {
  const folderName = getFolderName(car.slug || "");

  const comfortSlides = [
    car.interiorImage || `/figma/${folderName}/interior.png`,
    `/figma/${folderName}/exterior.png`,
    `/figma/${folderName}/car.png`,
  ];

  const techSlides = [
    car.techImage || `/figma/${folderName}/feature.png`,
    "/figma/pdp/dinamika-safety-image.png",
    "/figma/pdp/silent-start-banner.png",
  ];

  const [comfortIdx, setComfortIdx] = useState(0);
  const [techIdx, setTechIdx] = useState(0);

  // Auto-slide Comfort (Section 3)
  useEffect(() => {
    const timer = setInterval(() => {
      setComfortIdx((prev) => (prev + 1) % comfortSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [comfortSlides.length]);

  // Auto-slide Tech (Section 4)
  useEffect(() => {
    const timer = setInterval(() => {
      setTechIdx((prev) => (prev + 1) % techSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [techSlides.length]);

  const prevComfort = (e: React.MouseEvent) => {
    e.stopPropagation();
    setComfortIdx((prev) => (prev - 1 + comfortSlides.length) % comfortSlides.length);
  };
  const nextComfort = (e: React.MouseEvent) => {
    e.stopPropagation();
    setComfortIdx((prev) => (prev + 1) % comfortSlides.length);
  };

  const prevTech = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTechIdx((prev) => (prev - 1 + techSlides.length) % techSlides.length);
  };
  const nextTech = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTechIdx((prev) => (prev + 1) % techSlides.length);
  };

  const renderIcon = (iconName: string) => {
    const classes = "w-5 h-5 text-[#DA291C] stroke-[2.2]";
    switch (iconName) {
      case "Zap": return <Zap className={classes} />;
      case "ShieldCheck": return <ShieldCheck className={classes} />;
      case "Tv": return <Tv className={classes} />;
      case "Compass": return <Compass className={classes} />;
      case "Flame": return <Flame className={classes} />;
      case "Layers": return <Layers className={classes} />;
      case "Volume2": return <Volume2 className={classes} />;
      case "Volume": return <Volume className={classes} />;
      case "Sparkles": return <Sparkles className={classes} />;
      default: return <CheckCircle className={classes} />;
    }
  };

  return (
    <section id="features" className="bg-[#FAF9F9] text-[#1A1A1A] py-24 sm:py-32 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#DA291C] font-mono font-bold block mb-3">Inovasi Tanpa Batas</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 leading-tight">Fitur Utama</h2>
          <p className="mt-4 text-slate-500 text-base leading-relaxed font-medium">Menyatukan kemewahan kabin interior, ketangguhan sasis keselamatan, serta kecanggihan teknologi digital Chery.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          {/* Highlight Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {car.highlights?.slice(0, 4).map((item, index) => (
              <div 
                key={index} 
                className="group flex flex-col justify-between p-8 rounded-sm bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:border-[#DA291C]/15 hover:-translate-y-1.5 transition-all duration-500 ease-out opacity-0 animate-fade-up"
                style={{ animationDelay: `${(index + 1) * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex size-12 items-center justify-center rounded-sm bg-slate-50 border border-slate-150 text-[#DA291C] group-hover:bg-[#DA291C] group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:rotate-6 shadow-xs mb-6">
                  {renderIcon(item.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#DA291C] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 3: Comfort Slideshow Card */}
          <div 
            className="group lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-sm bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-500 ease-out opacity-0 animate-fade-up"
            style={{ animationDelay: "750ms", animationFillMode: 'forwards' }}
          >
            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
              <Image
                src={comfortSlides[comfortIdx]}
                alt="Luxury Cabin Slideshow"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-all duration-1000 ease-in-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Badge */}
              <span className="absolute top-4 right-4 z-10 bg-[#DA291C] text-white text-[9px] font-black uppercase py-1.5 px-3 rounded-sm tracking-widest shadow-md">
                Luxury Cabin
              </span>

              {/* Slider Arrows */}
              <button 
                onClick={prevComfort}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-300 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button 
                onClick={nextComfort}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-300 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {comfortSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setComfortIdx(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === comfortIdx ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="p-8 font-sans flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Kenyamanan Kabin Kelas VIP</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Manjakan perjalanan Anda dengan jok ergonomis bertekstur premium super lembut, dynamic LED ambient lighting, serta tingkat kesenyapan ruang kabin yang superior.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Chassis & Safety Slideshow Block */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-slate-100 rounded-sm p-8 sm:p-12 shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 ease-out opacity-0 animate-fade-up"
          style={{ animationDelay: "900ms", animationFillMode: 'forwards' }}
        >
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#DA291C] font-mono font-bold block">Sasis & Keamanan Aktif</span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-950 leading-tight">Struktur Bodi Baja Super Kuat & Sertifikasi Internasional</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-sans">Komitmen keselamatan berkendara Chery dibuktikan dengan penggunaan baja berkekuatan ultra-tinggi di atas 78% pada struktur rangka bodi, dipadukan dengan modul sensor cerdas ADAS.</p>
            <div className="space-y-3.5 pt-2">
              {[
                "Teknologi Pelindung Tabrakan Bodi: Distribusi beban energi multi-arah",
                "Sistem Manajemen Suhu Cerdas: Baterai terlindungi dari thermal runaway",
                "Kamera Pengawas 540-Derajat: Pandangan panorama sekeliling kendaraan"
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#DA291C] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Slideshow */}
          <div className="relative rounded-sm overflow-hidden group border border-slate-100 shadow-sm bg-slate-100 aspect-video">
            <Image
              src={techSlides[techIdx]}
              alt="Safety Tech Slideshow"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-1000 ease-in-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Slider Arrows */}
            <button 
              onClick={prevTech}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-300 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button 
              onClick={nextTech}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-300 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {techSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setTechIdx(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === techIdx ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}