import Image from "next/image";

const features = [
  { name: "17 ADAS Function", active: false },
  { name: "High-rigidity Vehicle Body", active: true },
  { name: "Aluminium Alloy Front Anti-Collision Beam", active: false },
  { name: "Surrounding 7 Airbags for Safety Protection", active: false },
  { name: "ANCAP Five-star Collision Safety", active: false },
];

export function DynamicsSafety() {
  return (
    <section
      id="dinamika-keamanan"
      aria-labelledby="dinamika-keamanan-heading"
      className="bg-background py-section-y"
    >
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h2
            id="dinamika-keamanan-heading"
            className="text-h1 font-heading font-bold text-foreground"
          >
            Dinamika & Keamanan
          </h2>
          <p className="text-body-lg max-w-2xl text-muted-foreground">
            Berkendara dengan tenang dalam perlindungan rangka mobil yang
            kokoh serta berbagai fitur keamanan canggih dari TIGGO CROSS
            CSH.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <ul className="flex flex-col gap-5">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-center gap-4">
                <span
                  className={
                    feature.active
                      ? "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-brand-deep bg-background"
                      : "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background"
                  }
                >
                  {feature.active && (
                    <span className="size-2.5 rounded-full bg-brand-deep" />
                  )}
                </span>
                <span
                  className={
                    feature.active
                      ? "font-heading text-xl font-semibold text-foreground"
                      : "font-heading text-xl font-medium text-muted-foreground"
                  }
                >
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>

          <Image
            src="/figma/pdp/dinamika-safety-image.png"
            alt="High-rigidity vehicle body structure"
            width={755}
            height={494}
            className="h-auto w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
