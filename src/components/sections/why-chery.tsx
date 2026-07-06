import { Section } from "@/components/layout/section";
import { SectionIcon } from "@/components/sections/section-icon";
import { getWhyCherySection } from "@/lib/data/homepage-sections";

export function WhyChery() {
  const { header, benefits } = getWhyCherySection();

  return (
    <Section
      id="why-chery"
      aria-labelledby="why-chery-heading"
      className="bg-[#0B0B0C] text-white py-24 sm:py-32"
    >
      <div className="mb-20 flex flex-col gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#DA291C]">
          {header.eyebrow}
        </span>
        <h2
          id="why-chery-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          {header.heading}
        </h2>
        <p className="text-base sm:text-lg mx-auto max-w-2xl text-slate-400 font-medium">
          {header.subtext}
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {benefits.map(({ icon, title, description }) => (
          <li
            key={title}
            className="group flex flex-col items-center text-center gap-5 p-8 rounded-sm bg-gradient-to-b from-[#141415] to-[#0E0E0F] border border-white/[0.03] hover:border-[#DA291C]/40 hover:shadow-2xl hover:shadow-[#DA291C]/5 transition-all duration-500 ease-out hover:-translate-y-1.5"
          >
            <div className="flex size-14 items-center justify-center rounded-sm bg-white/[0.02] border border-white/[0.06] text-slate-400 group-hover:bg-[#DA291C] group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:rotate-6">
              <SectionIcon
                name={icon}
                className="size-6 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-2">
              {title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
