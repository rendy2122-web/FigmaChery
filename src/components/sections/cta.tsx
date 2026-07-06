import Link from "next/link";
import { ClockIcon, StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { getCtaSection } from "@/lib/data/homepage-sections";
import { getSettingsMap } from "@/lib/data/settings";

export function CTA() {
  const { header } = getCtaSection();
  const settings = getSettingsMap();
  const phone = settings.contact_phone || "+62 895 2707 2446";
  const phoneHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const operatingHours = settings.operating_hours || "Senin - Sabtu, 08.00 - 17.00";
  const showroomAddress = settings.showroom_address || "";

  return (
    <Section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-gradient-to-br from-[#720D2B] via-[#4F071C] to-[#2B020B] text-white py-24 sm:py-32"
    >
      {/* Premium ambient glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-[600px] rounded-full bg-[#DA291C]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[600px] rounded-full bg-white/5 blur-[120px]" />

      <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center max-w-7xl mx-auto px-4">
        <div
          className="flex flex-col gap-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8E8E]">
            {header.eyebrow}
          </span>
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white leading-tight"
          >
            {header.heading}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row mt-2">
            <Button
              className="h-12 px-6 rounded-sm text-xs font-bold uppercase tracking-wider bg-white text-slate-950 hover:bg-slate-950 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              render={<Link href={phoneHref} />}
            >
              Jadwalkan Test Drive
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6 rounded-sm text-xs font-bold uppercase tracking-wider border border-white/20 bg-transparent text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              render={<Link href={phoneHref} />}
            >
              {phone}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:max-w-xl lg:ml-auto">
          {/* Card 1 */}
          <div
            className="group flex flex-col gap-4 p-8 rounded-sm bg-white/[0.03] border border-white/[0.05] hover:border-white/20 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(255,255,255,0.02)] opacity-0 animate-fade-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <ClockIcon className="size-7 text-white/80 group-hover:text-[#FF8E8E] group-hover:scale-105 transition-all duration-300" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Jam Operasional</span>
              <span className="text-base font-bold text-white tracking-tight mt-1">
                {operatingHours}
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="group flex flex-col gap-4 p-8 rounded-sm bg-white/[0.03] border border-white/[0.05] hover:border-white/20 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(255,255,255,0.02)] opacity-0 animate-fade-up"
            style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}
          >
            <StoreIcon className="size-7 text-white/80 group-hover:text-[#FF8E8E] group-hover:scale-105 transition-all duration-300" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Show Room</span>
              <span className="text-xs text-white/85 leading-relaxed font-sans mt-1">
                {showroomAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
