import Link from "next/link";
import { ClockIcon, StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

export function CTA() {
  return (
    <Section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-brand-deep text-white"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-8">
          <h2
            id="cta-heading"
            className="text-h1 font-heading font-bold text-white text-balance"
          >
            Hubungi Sales Kami Hari Ini
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 rounded px-5 text-base font-bold bg-white text-brand-deep hover:bg-white/90"
              render={<Link href="tel:+6289527072446" />}
            >
              Jadwalkan Test Drive
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded px-5 text-base font-bold border-white bg-transparent text-white hover:bg-white/10"
              render={<Link href="tel:+6289527072446" />}
            >
              +62 895 2707 2446
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-white/20 border border-white/20 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col gap-3 p-8">
            <ClockIcon className="size-8 text-white" aria-hidden="true" />
            <span className="text-sm text-white/70">Jam Operasional</span>
            <span className="text-lg font-heading font-bold text-white">
              Senin - Sabtu, 08.00 - 17.00
            </span>
          </div>
          <div className="flex flex-col gap-3 p-8">
            <StoreIcon className="size-8 text-white" aria-hidden="true" />
            <span className="text-sm text-white/70">Show Room</span>
            <span className="text-lg font-heading font-bold text-white">
              Jl. Alternatif Cibubur No.KM. 6, Nagrak, Kec. Gn. Putri,
              Kabupaten Bogor, Jawa Barat 16967
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
