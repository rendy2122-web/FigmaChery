import { Section } from "@/components/layout/section";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { getPublishedFaqs } from "@/lib/data/faqs";

export function FAQ() {
  const faqs = getPublishedFaqs();

  if (faqs.length === 0) return null;

  return (
    <Section id="faq" aria-labelledby="faq-heading" className="bg-slate-50 py-24 sm:py-32">
      <div className="mb-16 flex flex-col gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#DA291C]">
          Pertanyaan Umum
        </span>
        <h2
          id="faq-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight"
        >
          Ada Pertanyaan? Kami Punya Jawabannya
        </h2>
        <p className="text-base sm:text-lg mx-auto max-w-2xl text-slate-500 font-medium">
          Temukan jawaban seputar garansi, pembiayaan, test drive, dan layanan purna jual Chery Indonesia.
        </p>
      </div>

      <FaqAccordion faqs={faqs} />
    </Section>
  );
}
