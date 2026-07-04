import Link from "next/link";
import Image from "next/image";
import { ClockIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

type Offer = {
  id: string;
  image: string;
  badge?: { label: string; variant: "dark" | "light" };
  title: string;
  tag: string;
  description: string;
  validUntil: string;
};

const offers: Offer[] = [
  {
    id: "dp-10",
    image: "/figma/promo-1.png",
    badge: { label: "Limited Offer", variant: "dark" },
    title: "DP Mulai 10%",
    tag: "Khusus Tiggo 8",
    description:
      "Miliki Chery Tiggo 8 dengan DP ringan mulai 10% dan tenor hingga 60 bulan.",
    validUntil: "Valid until: 30 Juni 2026",
  },
  {
    id: "bonus-service",
    image: "/figma/promo-2.png",
    badge: { label: "Special Promo", variant: "light" },
    title: "Bonus Service 3 Tahun",
    tag: "Untuk Pembelian Omoda 5",
    description:
      "Dapatkan gratis service hingga 3 tahun untuk setiap pembelian Omoda 5 baru.",
    validUntil: "Valid until: 31 Juli 2026",
  },
  {
    id: "trade-in",
    image: "/figma/promo-3.png",
    title: "Trade-In Bonus",
    tag: "Harga Terbaik untuk Mobil Lama",
    description:
      "Tukar tambah mobil lama Anda dengan harga terbaik + bonus tambahan untuk pembelian model Chery apa pun.",
    validUntil: "Valid until: 30 Juni 2026",
  },
];

export function SpecialOffers() {
  return (
    <Section
      id="special-offers"
      aria-labelledby="special-offers-heading"
      className="bg-brand-deep text-white"
    >
      <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
        <span className="text-eyebrow font-medium uppercase tracking-widest text-white/70">
          Promotion
        </span>
        <h2
          id="special-offers-heading"
          className="text-h1 font-heading font-bold text-white"
        >
          Special Offers
        </h2>
        <p className="text-body-lg text-white/80">
          Limited-time promotions to help you drive home your dream Chery
          with amazing benefits.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex flex-col gap-6 rounded-xl bg-[#881337] p-2"
          >
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={offer.image}
                alt={offer.title}
                width={389}
                height={289}
                className="h-72 w-full object-cover"
              />
              {offer.badge && (
                <span
                  className={
                    offer.badge.variant === "dark"
                      ? "absolute top-3 left-3 rounded bg-[#881337] px-3 py-1.5 text-sm font-bold text-white"
                      : "absolute top-3 left-3 rounded bg-white px-3 py-1.5 text-sm font-bold text-[#881337]"
                  }
                >
                  {offer.badge.label}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 px-2 pb-2">
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-heading font-bold text-white">
                  {offer.title}
                </h3>
                <span className="w-fit rounded-full bg-[#e11d48] px-4 py-1.5 text-sm text-white">
                  {offer.tag}
                </span>
                <p className="text-sm text-white/90">{offer.description}</p>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <ClockIcon className="size-3.5" aria-hidden="true" />
                  {offer.validUntil}
                </div>
              </div>

              <Button
                className="h-11 w-full rounded px-5 text-base font-bold bg-white text-[#881337] hover:bg-white/90"
                render={<Link href="#cta" />}
              >
                Claim Promo
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
