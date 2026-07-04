"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

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
    fetch("/api/dealers")
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
      className="bg-muted"
    >
      <div className="mb-16 flex flex-col gap-4 text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Dealerships
        </span>
        <h2
          id="dealerships-heading"
          className="text-h1 font-heading font-bold text-foreground"
        >
          Kunjungi Dealer Kami Hari Ini
        </h2>
        <p className="text-body-lg mx-auto max-w-2xl text-muted-foreground">
          Nikmati kemudahan simulasi kredit, promo eksklusif, brosur
          digital, dan test drive langsung di dealer eklusif kami.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {dealers.map((dealer) => (
          <div key={dealer.id} className="flex flex-col gap-6">
            <Image
              src={dealer.image}
              alt={dealer.name}
              width={389}
              height={409}
              className="aspect-[389/409] w-full rounded-lg object-cover"
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-h4 font-heading font-bold text-foreground">
                  {dealer.name}
                </h3>
                <p className="text-sm text-muted-foreground">{dealer.city}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="h-12 w-full rounded text-sm font-semibold bg-brand-deep text-white hover:bg-brand-deep/90"
                  render={<Link href="/booking" />}
                >
                  Jadwalkan Test Drive
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded text-sm font-semibold border-border text-brand-deep hover:bg-brand-deep/5"
                  render={<Link href={`tel:${dealer.phone.replace(/\s/g, "")}`} />}
                >
                  {dealer.phone}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}