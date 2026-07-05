import { CarIcon, CreditCardIcon, HandshakeIcon, SettingsIcon } from "lucide-react";
import { Section } from "@/components/layout/section";

const services = [
  {
    icon: CarIcon,
    title: "Penjualan Unit Chery",
    description: "Jelajahi lini kendaraan Chery terbaru dengan penawaran eksklusif, konsultasi spesifikasi detail, dan unit test drive yang siap Anda coba langsung.",
  },
  {
    icon: CreditCardIcon,
    title: "Kredit Mobil Chery",
    description: "Dapatkan kemudahan skema pembiayaan dengan suku bunga kompetitif, DP ringan, serta proses pengajuan yang cepat dan transparan.",
  },
  {
    icon: HandshakeIcon,
    title: "Servis Berkala & Dukungan",
    description: "Perawatan rutin dan perbaikan kendaraan Anda ditangani oleh teknisi bersertifikasi global dengan peralatan diagnosis modern.",
  },
  {
    icon: SettingsIcon,
    title: "Suku Cadang Asli",
    description: "Penyediaan suku cadang orisinal (Genuine Parts) bergaransi resmi untuk menjamin keselamatan dan performa maksimal mobil Anda.",
  },
];

export function Services() {
  return (
    <Section id="services" aria-labelledby="services-heading" className="bg-white py-24 sm:py-32">
      <div className="mb-20 flex flex-col gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#DA291C]">
          Layanan Lengkap
        </span>
        <h2
          id="services-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight"
        >
          Semua Layanan Terbaik yang Anda Butuhkan Ada di Sini
        </h2>
        <p className="text-base sm:text-lg mx-auto max-w-2xl text-slate-500 font-medium">
          Kami berkomitmen menghadirkan ekosistem layanan purna jual lengkap demi kenyamanan, keselamatan, dan kepuasan berkendara Anda.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {services.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="group flex flex-col items-center text-center gap-5 p-8 lg:p-10 rounded-sm bg-slate-50/50 border border-slate-100 hover:border-[#DA291C]/20 hover:bg-white hover:shadow-2xl hover:shadow-[#DA291C]/4 transition-all duration-500 ease-out hover:-translate-y-1.5"
          >
            <div className="flex size-14 items-center justify-center rounded-sm bg-white border border-slate-150 text-slate-600 group-hover:bg-[#DA291C] group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:rotate-6 shadow-sm">
              <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-2">
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
