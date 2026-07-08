import Image from "next/image";
import { CheckIcon } from "lucide-react";
import { SectionIcon } from "@/components/sections/section-icon";
import type { ProductSectionData } from "@/components/product/product-detail-client";

interface CustomProductSectionsProps {
  sections?: ProductSectionData[];
}

/** Renders admin-authored content blocks from the dashboard's "Product
 *  Sections" editor — a free-form complement to the fixed sections (hero,
 *  specs, gallery) for anything car-specific that doesn't fit those slots. */
export default function CustomProductSections({ sections }: CustomProductSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <section aria-label="Informasi tambahan produk" className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {sections.map((section, index) => {
          const imageFirst = index % 2 === 1;

          return (
            <div
              key={section.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <div className={imageFirst ? "lg:order-2" : ""}>
                {section.icon && (
                  <div className="mb-4 flex size-12 items-center justify-center rounded-sm bg-[#DA291C]/10 text-[#DA291C]">
                    <SectionIcon name={section.icon} className="size-6" />
                  </div>
                )}
                {section.title && (
                  <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-950 leading-tight">
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-[#DA291C]">
                    {section.subtitle}
                  </p>
                )}
                {section.content && (
                  <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                    {section.content}
                  </p>
                )}
                {section.features.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {section.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon className="size-5 text-[#DA291C] shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {section.image && (
                <div className={`relative aspect-[4/3] rounded-sm overflow-hidden bg-slate-100 ${imageFirst ? "lg:order-1" : ""}`}>
                  <Image
                    src={section.image}
                    alt={section.title || ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
