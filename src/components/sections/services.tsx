import { Section } from "@/components/layout/section";
import { SectionIcon } from "@/components/sections/section-icon";
import { getServicesSection } from "@/lib/data/homepage-sections";

export function Services() {
  const { header, services } = getServicesSection();

  return (
    <Section id="services" aria-labelledby="services-heading" className="bg-white py-24 sm:py-32">
      <div className="mb-20 flex flex-col gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#DA291C]">
          {header.eyebrow}
        </span>
        <h2
          id="services-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight"
        >
          {header.heading}
        </h2>
        <p className="text-base sm:text-lg mx-auto max-w-2xl text-slate-500 font-medium">
          {header.subtext}
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {services.map(({ icon, title, description }) => (
          <li
            key={title}
            className="group flex flex-col items-center text-center gap-5 p-8 lg:p-10 rounded-sm bg-slate-50/50 border border-slate-100 hover:border-[#DA291C]/20 hover:bg-white hover:shadow-2xl hover:shadow-[#DA291C]/4 transition-all duration-500 ease-out hover:-translate-y-1.5"
          >
            <div className="flex size-14 items-center justify-center rounded-sm bg-white border border-slate-150 text-slate-600 group-hover:bg-[#DA291C] group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:rotate-6 shadow-sm">
              <SectionIcon
                name={icon}
                className="size-6 transition-transform duration-300 group-hover:scale-110"
              />
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
