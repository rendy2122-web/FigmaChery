import Link from "next/link";
import { PhoneIcon, MailIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";
import { getPublishedCars } from "@/lib/data/cars";
import { getSettingsMap } from "@/lib/data/settings";

export function Footer() {
  const year = new Date().getFullYear();

  let cars: any[] = [];
  try {
    const res = getPublishedCars();
    if (Array.isArray(res)) {
      cars = res;
    }
  } catch (error) {
    console.error("Error loading cars in footer:", error);
  }
  
  const bevModels = cars.filter((c) => c.type === "BEV");
  const cshModels = cars.filter((c) => c.type === "CSH");
  const iceModels = cars.filter((c) => c.type === "ICE");

  const settings = getSettingsMap();
  const contactPhone = settings.contact_phone || "+62 895 2707 2446";
  const contactEmail = settings.contact_email || "sales@chery-cibubur.id";
  const phoneHref = `tel:${contactPhone.replace(/[^0-9+]/g, "")}`;

  const contact = [
    { icon: PhoneIcon, label: contactPhone, href: phoneHref },
    { icon: MailIcon, label: contactEmail, href: `mailto:${contactEmail}` },
  ];

  const social = [
    { icon: FacebookIcon, label: "Facebook", href: settings.facebook_url || "#" },
    { icon: InstagramIcon, label: "Instagram", href: settings.instagram_url || "#" },
    { icon: YoutubeIcon, label: "YouTube", href: settings.youtube_url || "#" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] text-white">
      <Container className="py-section-y-sm">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2.5fr_1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo variant="light" />
            <p className="max-w-xs text-sm text-white/60">
              Experience the future of driving with Chery. Innovation,
              safety, and style in every journey.
            </p>
          </div>

          <nav aria-label="Product Line-up" className="flex flex-col gap-4">
            <h2 className="font-heading text-lg font-semibold text-white">
              Product
            </h2>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-1">
              {/* BEV Category */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DA291C]">
                  BEV
                </span>
                <ul className="flex flex-col gap-2.5">
                  {bevModels.map((model) => (
                    <li key={model.id}>
                      <Link
                        href={`/models/${model.slug}`}
                        className="text-xs text-white/60 transition-colors hover:text-[#DA291C]"
                      >
                        {model.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CSH Category */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DA291C]">
                  CSH
                </span>
                <ul className="flex flex-col gap-2.5">
                  {cshModels.map((model) => (
                    <li key={model.id}>
                      <Link
                        href={`/models/${model.slug}`}
                        className="text-xs text-white/60 transition-colors hover:text-[#DA291C]"
                      >
                        {model.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ICE Category */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DA291C]">
                  ICE
                </span>
                <ul className="flex flex-col gap-2.5">
                  {iceModels.map((model) => (
                    <li key={model.id}>
                      <Link
                        href={`/models/${model.slug}`}
                        className="text-xs text-white/60 transition-colors hover:text-[#DA291C]"
                      >
                        {model.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
