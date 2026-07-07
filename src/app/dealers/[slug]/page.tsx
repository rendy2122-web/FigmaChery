import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react";
import { getActiveDealers } from "@/lib/data/dealers";
import { dealerSlug } from "@/lib/dealer-slug";
import { ProductBreadcrumb } from "@/components/product/breadcrumb";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { TestDriveButton } from "@/components/product/test-drive-button";
import { DealerBookingForm } from "@/components/booking/dealer-booking-form";

function getDealers() {
  return getActiveDealers();
}

function getDealerBySlug(slug: string) {
  return getDealers().find((d) => dealerSlug(d.name) === slug);
}

export function generateStaticParams() {
  return getDealers().map((d) => ({ slug: dealerSlug(d.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dealer = getDealerBySlug(slug);
  if (!dealer) return {};
  return {
    title: dealer.name,
    description: `${dealer.name} — ${dealer.address}. Kunjungi dealer resmi Chery untuk test drive, simulasi kredit, dan penawaran eksklusif.`,
  };
}

export default async function DealerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dealers = getDealers();
  const dealer = dealers.find((d) => dealerSlug(d.name) === slug);

  if (!dealer) notFound();

  const otherDealers = dealers.filter((d) => d.id !== dealer.id);
  const mapQuery = encodeURIComponent(dealer.address);

  return (
    <>
      <ProductBreadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Dealer", href: "/#dealerships" },
          { label: dealer.name },
        ]}
      />

      <section aria-labelledby="dealer-hero-heading" className="relative">
        <h1 id="dealer-hero-heading" className="sr-only">
          {dealer.name}
        </h1>
        {dealer.image && (
          <Image
            src={dealer.image}
            alt={dealer.name}
            width={1440}
            height={500}
            priority
            className="h-[320px] w-full object-cover sm:h-[420px]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-gutter pb-10">
          <span className="text-sm font-medium uppercase tracking-widest text-white/70">
            {dealer.city}
          </span>
          <h2 className="text-h1 font-heading font-bold text-white">
            {dealer.name}
          </h2>
        </div>
      </section>

      <Section id="dealer-info" aria-labelledby="dealer-info-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <h2 id="dealer-info-heading" className="sr-only">
              Informasi Dealer
            </h2>

            <div className="flex items-start gap-4">
              <MapPinIcon
                className="size-6 shrink-0 text-brand-deep"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  Alamat
                </span>
                <p className="text-sm text-muted-foreground">
                  {dealer.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ClockIcon
                className="size-6 shrink-0 text-brand-deep"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  Jam Operasional
                </span>
                <p className="text-sm text-muted-foreground">
                  Senin - Sabtu, 08.00 - 17.00
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <PhoneIcon
                className="size-6 shrink-0 text-brand-deep"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  Telepon
                </span>
                <p className="text-sm text-muted-foreground">
                  {dealer.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <TestDriveButton className="h-11 rounded px-6 text-base font-bold bg-brand-deep text-white hover:bg-brand-deep/90">
                Jadwalkan Test Drive
              </TestDriveButton>
              <Button
                variant="outline"
                className="h-11 rounded px-6 text-base font-bold border-brand-deep text-brand-deep hover:bg-brand-deep/5"
                render={
                  <Link
                    href={`https://wa.me/${dealer.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Chat WhatsApp
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg">
            <iframe
              title={`Peta lokasi ${dealer.name}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-80 w-full border-0 lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>

      <Section
        id="form-booking"
        aria-labelledby="form-booking-heading"
        className="bg-muted"
      >
        <h2 id="form-booking-heading" className="sr-only">
          Form Booking {dealer.name}
        </h2>
        <div className="mx-auto max-w-4xl rounded bg-background shadow-sm">
          <DealerBookingForm dealerName={dealer.name} whatsapp={dealer.whatsapp} />
        </div>
      </Section>

      {otherDealers.length > 0 && (
        <Section
          id="other-dealers"
          aria-labelledby="other-dealers-heading"
        >
          <h2
            id="other-dealers-heading"
            className="mb-8 text-h3 font-heading font-bold text-foreground"
          >
            Dealer Lainnya
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {otherDealers.map((d) => (
              <Link
                key={d.id}
                href={`/dealers/${dealerSlug(d.name)}`}
                className="flex items-center justify-between rounded-lg bg-muted p-6 transition-colors hover:bg-muted/70"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-lg font-bold text-foreground">
                    {d.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {d.city}
                  </span>
                </div>
                <span className="text-sm font-semibold text-brand-deep">
                  Lihat Detail
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
