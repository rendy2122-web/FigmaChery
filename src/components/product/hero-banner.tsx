import Image from "next/image";

const specs = [
  { label: "ENGINE", value: "1,5L DHE" },
  { label: "LENGTH", value: "4330 NM" },
  { label: "POWER OUTPUT", value: "204 PS" },
  { label: "TORQUE", value: "310 Nm" },
];

export function ProductHeroBanner() {
  return (
    <section aria-labelledby="product-hero-heading">
      <h1 id="product-hero-heading" className="sr-only">
        Chery Tiggo Cross CSH
      </h1>
      <Image
        src="/figma/hero-banner.png"
        alt="Chery Tiggo Cross CSH in motion"
        width={1440}
        height={944}
        priority
        className="h-[420px] w-full object-cover sm:h-[560px] lg:h-[780px]"
      />

      <div className="bg-muted py-section-y">
        <div className="mx-auto max-w-7xl px-gutter">
          <Image
            src="/figma/pdp/highlight-specs-image.png"
            alt="Tiggo Cross CSH Hybrid highlight"
            width={1248}
            height={680}
            className="mb-10 h-auto w-full object-cover"
          />

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                  {spec.label}
                </span>
                <span className="text-h4 font-heading font-bold text-foreground">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
