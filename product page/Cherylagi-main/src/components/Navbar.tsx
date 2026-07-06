import React from "react";
import { Car, Menu, X, Sliders, MessageSquare, ShieldCheck } from "lucide-react";
import { CarModel } from "../types";

interface NavbarProps {
  models: CarModel[];
  activeModel: CarModel;
  onSelectModel: (model: CarModel) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenBooking: (type: "test" | "prebook") => void;
}

export default function Navbar({
  models,
  activeModel,
  onSelectModel,
  onScrollToSection,
  onOpenBooking
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 text-[#1A1A1A] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-sm bg-[#DA291C] shadow-sm">
              <Car className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="font-sans font-black text-2xl tracking-tighter text-[#1A1A1A]">
                CHERY
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-[#DA291C] font-mono font-bold leading-none mt-0.5">
                Indonesia BY GASTRONOT
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Model Selector Pill */}
            <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200/50">
              {models.map((model) => {
                const isActive = model.id === activeModel.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => onSelectModel(model)}
                    className={`px-4 py-1.5 rounded-sm text-xs font-bold tracking-wide transition-all duration-300 ${
                      isActive
                        ? "bg-[#DA291C] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {model.name.replace("Chery ", "")}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-6 text-sm font-semibold">
              <button
                onClick={() => onScrollToSection("features")}
                className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                Fitur Unggulan
              </button>
              <button
                onClick={() => onScrollToSection("comparison")}
                className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <Sliders className="w-4 h-4 text-[#DA291C]" />
                Bandingkan Specs
              </button>
              <button
                onClick={() => onScrollToSection("reviews")}
                className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4 text-[#DA291C]" />
                Ulasan Pemilik
              </button>
            </div>

            {/* CTA Book Test Drive */}
            <button
              onClick={() => onOpenBooking("test")}
              className="bg-transparent hover:bg-slate-50 text-[#1A1A1A] border border-slate-200 py-2.5 px-5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-300"
            >
              Book Test Drive
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-4">
          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono pl-3 mb-2">
              Pilih Model Chery
            </span>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 rounded-sm border border-slate-200/50">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model);
                    setIsOpen(false);
                  }}
                  className={`py-2 px-1 rounded-sm text-[10px] font-bold text-center transition-all duration-200 ${
                    model.id === activeModel.id
                      ? "bg-[#DA291C] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  {model.name.replace("Chery ", "")}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-2 pl-3">
            <button
              onClick={() => {
                onScrollToSection("features");
                setIsOpen(false);
              }}
              className="block text-left w-full text-slate-600 hover:text-[#1A1A1A] font-bold py-1 text-sm"
            >
              Fitur Unggulan
            </button>
            <button
              onClick={() => {
                onScrollToSection("comparison");
                setIsOpen(false);
              }}
              className="block text-left w-full text-slate-600 hover:text-[#1A1A1A] font-bold py-1 text-sm"
            >
              Perbandingan Spesifikasi
            </button>
            <button
              onClick={() => {
                onScrollToSection("reviews");
                setIsOpen(false);
              }}
              className="block text-left w-full text-slate-600 hover:text-[#1A1A1A] font-bold py-1 text-sm"
            >
              Ulasan Pengguna
            </button>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onOpenBooking("test");
                setIsOpen(false);
              }}
              className="block text-center w-full bg-white text-[#1A1A1A] border border-slate-200 font-bold py-3 rounded-sm text-xs uppercase tracking-wider hover:bg-slate-50"
            >
              Book Test Drive
            </button>
            <button
              onClick={() => {
                onOpenBooking("prebook");
                setIsOpen(false);
              }}
              className="block text-center w-full bg-[#DA291C] text-white font-bold py-3 rounded-sm text-xs uppercase tracking-wider hover:bg-red-700 shadow-sm"
            >
              Pre-Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
