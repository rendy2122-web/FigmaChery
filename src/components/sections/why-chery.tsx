import {
  BadgeCheckIcon,
  CreditCardIcon,
  TruckIcon,
  Building2Icon,
  AwardIcon,
  HeadsetIcon,
} from "lucide-react";
import { Section } from "@/components/layout/section";

const benefits = [
  {
    icon: BadgeCheckIcon,
    title: "Dealer Resmi Chery Indonesia",
    description: "Beli kendaraan Chery Anda hanya di dealer resmi Chery Indonesia",
  },
  {
    icon: CreditCardIcon,
    title: "Kredit Tanpa Bunga",
    description:
      "Leading the industry with cutting-edge EV, Hybrid, and intelligent technology.",
  },
  {
    icon: TruckIcon,
    title: "Pengiriman ke Jabodetabek",
    description: "Trusted by 12M+ owners across 80+ countries worldwide.",
  },
  {
    icon: Building2Icon,
    title: "Dealer Resmi Cibubur",
    description:
      "World-class design and features at an accessible price point.",
  },
  {
    icon: AwardIcon,
    title: "Garansi 5 Tahun/100.000 KM",
    description:
      "World-class design and features at an accessible price point.",
  },
  {
    icon: HeadsetIcon,
    title: "Customer Care 24/7",
    description:
      "World-class design and features at an accessible price point.",
  },
];

export function WhyChery() {
  return (
    <Section
      id="why-chery"
      aria-labelledby="why-chery-heading"
      className="bg-foreground text-background"
    >
      <div className="mb-16 flex flex-col gap-4 text-center">
        <span className="text-eyebrow font-medium uppercase tracking-widest text-background/60">
          Mengapa Beli Chery Di Sini
        </span>
        <h2
          id="why-chery-heading"
          className="text-h1 font-heading font-bold text-background text-balance"
        >
          Dealer Resmi Chery Terpercaya di Cibubur, Makassar, dan Pare –
          Pilihan Utama Anda
        </h2>
        <p className="text-body-lg mx-auto max-w-2xl text-background/60">
          Komitmen kami: harga resmi, layanan transparan, dan after-sales
          kami yang lengkap
        </p>
      </div>

      <ul className="grid grid-cols-1 divide-y divide-background/10 border-t border-background/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex flex-col gap-4 py-10 sm:px-8">
            <div className="flex size-14 items-center justify-center rounded-full bg-background/10">
              <Icon className="size-6 text-background" aria-hidden="true" />
            </div>
            <h3 className="text-h4 font-heading font-bold text-background">
              {title}
            </h3>
            <p className="text-sm text-background/50">{description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
