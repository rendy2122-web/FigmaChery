import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const specs = ["Mesin 1,5L DHE", "Panjang 4330 MM", "17 ADAS"];

export function VariantPricing() {
  return (
    <section
      id="varian-product"
      aria-labelledby="varian-product-heading"
      className="bg-muted py-section-y"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-10 px-gutter">
        <h2
          id="varian-product-heading"
          className="text-h1 font-heading font-bold text-foreground text-center"
        >
          Varian Tiggo Cross CSH
        </h2>

        <div className="flex w-full flex-col gap-8">
          <Image
            src="/figma/pdp/varian-thumbnail.png"
            alt="TIGGO CROSS CSH Hybrid"
            width={640}
            height={340}
            className="h-auto w-full object-cover"
          />

          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-2xl font-light text-foreground">
                TIGGO CROSS CSH Hybrid
              </h3>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Mulai dari
                </span>
                <span className="font-heading text-3xl font-medium text-foreground">
                  IDR 329.800.000
                </span>
                <span className="text-xs text-muted-foreground">
                  *OTR Jakarta
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm text-foreground">Spesifikasi</h4>
              <ul className="flex flex-col gap-1">
                {specs.map((spec) => (
                  <li
                    key={spec}
                    className="text-sm font-light text-foreground"
                  >
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 flex-1 rounded px-5 text-base font-bold bg-brand-deep text-white hover:bg-brand-deep/90"
              render={<Link href="/booking" />}
            >
              Jadwalkan Test Drive Gratis
            </Button>
            <Button
              variant="outline"
              className="h-11 flex-1 rounded px-5 text-base font-bold border-brand-deep text-brand-deep hover:bg-brand-deep/5"
              render={<Link href="/booking" />}
            >
              Pre-Book
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
