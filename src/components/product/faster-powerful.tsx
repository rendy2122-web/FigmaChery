import Image from "next/image";

const stats = [
  { label: "Drive Motor", value: "204 PS" },
  { label: "Peak Torque", value: "310 Nm" },
];

export function FasterPowerful() {
  return (
    <section
      id="faster-powerful"
      aria-labelledby="faster-powerful-heading"
      className="bg-muted py-section-y"
    >
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src="/figma/pdp/faster-powerful-main.png"
            alt="Chery Tiggo Cross CSH engine bay"
            width={1248}
            height={729}
            className="h-[500px] w-full object-cover lg:h-[729px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

          <div className="absolute inset-y-0 left-0 flex w-full max-w-lg flex-col justify-center gap-10 p-8 lg:p-16">
            <div className="flex flex-col gap-4">
              <h2
                id="faster-powerful-heading"
                className="text-h1 font-heading font-bold text-white"
              >
                Faster & More Powerful
              </h2>
              <p className="text-body-lg text-white/70">
                Our car includes engine that has peak power of 96 PS, peak
                torque of 120 Nm. Along with acceleration speed of 8 second
                on maximum speed of 100 Km/h.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative flex flex-col justify-between gap-6 overflow-hidden p-5"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
                  }}
                >
                  <Image
                    src="/figma/pdp/highlight-card-bg.png"
                    alt=""
                    fill
                    className="object-cover"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <span className="relative w-fit rounded bg-black px-3 py-1.5 text-sm text-white">
                    {stat.label}
                  </span>
                  <span className="relative font-heading text-3xl font-medium text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
