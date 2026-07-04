import { CarIcon, CreditCardIcon, HandshakeIcon, SettingsIcon } from "lucide-react";
import { Section } from "@/components/layout/section";

const services = [
  {
    icon: CarIcon,
    title: "Penjualan Unit Chery",
    description: "Korem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: CreditCardIcon,
    title: "Kredit Mobil Chery",
    description: "Corem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: HandshakeIcon,
    title: "Service Berkala & Support",
    description: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: SettingsIcon,
    title: "Suku Cadang Asli",
    description: "Yorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export function Services() {
  return (
    <Section id="services" aria-labelledby="services-heading">
      <div className="mb-16 flex flex-col gap-4 text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Layanan Lengkap
        </span>
        <h2
          id="services-heading"
          className="text-h1 font-heading font-bold text-foreground"
        >
          Semua Layanan Yang Kamu Butuhkan Ada Di Sini
        </h2>
        <p className="text-body-lg mx-auto max-w-2xl text-muted-foreground">
          Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis.
        </p>
      </div>

      <ul className="grid grid-cols-1 divide-y divide-border border border-border sm:grid-cols-2 sm:divide-x">
        {services.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex flex-col gap-6 p-10">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Icon className="size-6 text-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-h4 font-heading font-bold text-foreground">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
