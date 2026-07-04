import Link from "next/link";
import { PhoneIcon, MailIcon, ClockIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";

const models = ["Tiggo 8", "C5", "Tiggo 9"];

const contact = [
  { icon: PhoneIcon, label: "+62 895 2707 2446", href: "tel:+6289527072446" },
  {
    icon: MailIcon,
    label: "sales@chery-cibubur.id",
    href: "mailto:sales@chery-cibubur.id",
  },
  { icon: ClockIcon, label: "+62 895 2707 2446", href: "tel:+6289527072446" },
];

const social = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] text-white">
      <Container className="py-section-y-sm">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo variant="light" />
            <p className="max-w-xs text-sm text-white/60">
              Experience the future of driving with Chery. Innovation,
              safety, and style in every journey.
            </p>
          </div>

          <nav aria-label="Mobile Cherry">
            <h2 className="mb-4 font-heading text-lg font-semibold text-white">
              Mobile Cherry
            </h2>
            <ul className="flex flex-col gap-3">
              {models.map((model) => (
                <li key={model}>
                  <Link
                    href="#car-showcase"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {model}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Kontak Sales">
            <h2 className="mb-4 font-heading text-lg font-semibold text-white">
              Kontak Sales
            </h2>
            <ul className="flex flex-col gap-3">
              {contact.map(({ icon: Icon, label, href }, i) => (
                <li key={i}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Ikuti Kami">
            <h2 className="mb-4 font-heading text-lg font-semibold text-white">
              Ikuti Kami
            </h2>
            <ul className="flex items-center gap-3">
              {social.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    aria-label={label}
                    className="flex size-12 items-center justify-center rounded-lg bg-[#171717] text-white transition-colors hover:bg-white/10"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 border-t border-white/10 pt-6">
          <p className="text-sm text-white/40">
            &copy; {year} Chery Indonesia. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
