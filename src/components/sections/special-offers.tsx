import Link from "next/link";
import Image from "next/image";
import { ClockIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { getSpecialOffersSection } from "@/lib/data/homepage-sections";

export function SpecialOffers() {
  const { header, offers } = getSpecialOffersSection();

  return (
    <Section
      id="special-offers"
      aria-labelledby="special-offers-heading"
      className="bg-gradient-to-b from-[#720D2B] via-[#4F071C] to-[#2B020B] text-white py-24 sm:py-32"
    >
      <div className="mx-auto mb-20 flex max-w-2xl flex-col items-center gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF8E8E]">
          {header.eyebrow}
        </span>
        <h2
          id="special-offers-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white leading-tight"
        >
          {header.heading}
        </h2>
        <p className="text-base sm:text-lg text-white/70 font-medium leading-relaxed">
          {header.subtext}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto px-4">
        {offers.map((offer, idx) => (
          <div
            key={offer.id}
            className="group flex flex-col justify-between overflow-hidden rounded-sm bg-white/[0.03] border border-white/[0.05] hover:border-white/20 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(218,41,28,0.18)] opacity-0 animate-fade-up"
            style={{ animationDelay: `${(idx + 1) * 150}ms`, animationFillMode: 'forwards' }}
          >
            <div className="relative overflow-hidden aspect-[4/3] rounded-t-sm">
              <Image
                src={offer.image}
                alt={offer.title}
                width={389}
                height={289}
                className="h-full w-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
              />
              {offer.badge && (
                <span
                  className={
                    offer.badge.variant === "dark"
                      ? "absolute top-4 left-4 z-10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-sm bg-[#DA291C] text-white border border-white/10 shadow-md"
                      : "absolute top-4 left-4 z-10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-sm bg-white text-slate-950 border border-transparent shadow-md"
                  }
                >
                  {offer.badge.label}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 p-6 flex-1">
              <div className="flex flex-col gap-3 flex-1">
                <span className="w-fit rounded-sm bg-white/5 border border-white/15 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white/80">
                  {offer.tag}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#FF8E8E] transition-colors duration-300">
                  {offer.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans line-clamp-3">{offer.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-white/45 mt-auto">
                  <ClockIcon className="size-3.5" aria-hidden="true" />
                  {offer.validUntil}
                </div>
              </div>

              <Button
                className="mt-4 h-11 w-full rounded-sm px-5 text-xs font-bold uppercase tracking-wider bg-white text-slate-950 hover:bg-[#DA291C] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                render={<Link href="#cta" />}
              >
                Claim Promo
                <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
