"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { dealerSlug } from "@/lib/dealer-slug";

type Dealer = {
  id: string;
  name: string;
  city: string;
  phone: string;
  image: string;
};

const defaultDealers: Dealer[] = [
  {
    id: "cibubur",
    name: "Chery Cibubur",
    city: "Jakarta",
    phone: "+62 895 2707 2446",
    image: "/figma/dealer-cibubur.png",
  },
];

export function Dealerships() {
  const [dealers, setDealers] = useState<Dealer[]>(defaultDealers);

  useEffect(() => {
    fetch("/api/dealers?t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDealers(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Section
      id="dealerships"
      aria-labelledby="dealerships-heading"
      className="bg-[#FAF9F9] py-24 sm:py-32"
    >
      <div className="mb-20 flex flex-col gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#DA291C]">
          Dealerships
        </span>
        <h2
          id="dealerships-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 leading-tight"
        >
          Kunjungi Dealer Resmi Kami Hari Ini
        </h2>
        <p className="text-base sm:text-lg mx-auto max-w-2xl text-slate-500 font-medium leading-relaxed">
          Nikmati kemudahan simulasi kredit, promo eksklusif, brosur digital, dan test drive langsung di dealer eksklusif kami.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto px-4">
        {dealers.map((dealer, idx) => (
          <div 
            key={dealer.id} 
            className="group flex flex-col overflow-hidden rounded-sm bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-500 ease-out opacity-0 animate-fade-up"
            style={{ animationDelay: `${(idx + 1) * 150}ms`, animationFillMode: 'forwards' }}
          >
            <div className="relative overflow-hidden aspect-[4/3] rounded-t-sm bg-slate-100">
              <Image
                src={dealer.image}
                alt={dealer.name}
                width={389}
                height={289}
                className="h-full w-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-6 p-6 flex-1 justify-between">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/dealers/${dealerSlug(dealer.name)}`}
                  className="w-fit"
                >
                  <h3 className="text-lg font-bold text-slate-950 tracking-tight transition-colors duration-300 group-hover:text-[#DA291C]">
                    {dealer.name}
                  </h3>
                </Link>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{dealer.city}</p>
              </div>
              <div className="flex flex-col gap-2.5">
                <Button
                  className="w-full bg-[#DA291C] hover:bg-slate-950 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                  render={<Link href="/booking" />}
                >
                  Jadwalkan Test Drive
                </Button>
                <Button
                  variant="outline"
                  className="w-full border border-slate-250 text-slate-700 hover:bg-[#DA291C]/5 hover:text-[#DA291C] hover:border-[#DA291C]/30 font-bold text-xs uppercase tracking-wider py-3.5 rounded-sm transition-all duration-300 flex items-center justify-center"
                  render={<Link href={`/dealers/${dealerSlug(dealer.name)}`} />}
                >
                  Lihat Detail Dealer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}