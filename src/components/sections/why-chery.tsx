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
    description: "Jaminan keaslian unit dan layanan prima langsung dari jaringan dealer resmi terpercaya Chery Indonesia.",
  },
  {
    icon: CreditCardIcon,
    title: "Kredit Tanpa Bunga",
    description: "Fasilitas pembiayaan eksklusif dengan bunga 0% dan tenor fleksibel sesuai kebutuhan finansial Anda.",
  },
  {
    icon: TruckIcon,
    title: "Pengiriman ke Jabodetabek",
    description: "Layanan pengiriman kendaraan yang aman, cepat, dan profesional langsung ke alamat garasi rumah Anda.",
  },
  {
    icon: Building2Icon,
    title: "Dealer Resmi Cibubur",
    description: "Layanan sales, servis berkala dengan mekanik bersertifikat, dan penyediaan suku cadang resmi terlengkap.",
  },
  {
    icon: AwardIcon,
    title: "Garansi 5 Tahun/100.000 KM",
    description: "Garansi suku cadang komprehensif untuk ketenangan pikiran berkendara Anda bersama keluarga.",
  },
  {
    icon: HeadsetIcon,
    title: "Customer Care 24/7",
    description: "Layanan bantuan darurat jalan raya dan layanan pelanggan yang responsif siap siaga setiap saat.",
  },
];

export function WhyChery() {
  return (
    <Section
      id="why-chery"
      aria-labelledby="why-chery-heading"
      className="bg-[#0B0B0C] text-white py-24 sm:py-32"
    >
      <div className="mb-20 flex flex-col gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#DA291C]">
          Mengapa Beli Chery Di Sini
        </span>
        <h2
          id="why-chery-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Dealer Resmi Chery Terpercaya di Cibubur, Makassar, dan Pare &ndash; Pilihan Utama Anda
        </h2>
        <p className="text-base sm:text-lg mx-auto max-w-2xl text-slate-400 font-medium">
          Komitmen kami: harga resmi, layanan transparan, dan program after-sales terlengkap untuk kenyamanan Anda
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {benefits.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="group flex flex-col items-center text-center gap-5 p-8 rounded-sm bg-gradient-to-b from-[#141415] to-[#0E0E0F] border border-white/[0.03] hover:border-[#DA291C]/40 hover:shadow-2xl hover:shadow-[#DA291C]/5 transition-all duration-500 ease-out hover:-translate-y-1.5"
          >
            <div className="flex size-14 items-center justify-center rounded-sm bg-white/[0.02] border border-white/[0.06] text-slate-400 group-hover:bg-[#DA291C] group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:rotate-6">
              <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-2">
              {title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
