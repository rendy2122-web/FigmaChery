import Link from "next/link";
import Image from "next/image";
import { ClockIcon, ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { getAllArticles } from "@/lib/news-data";

const articles = getAllArticles().slice(0, 3);

export function News() {
  return (
    <Section id="news" aria-labelledby="news-heading" className="bg-white py-24 sm:py-32">
      <div className="mb-20 flex flex-col gap-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#DA291C]">
          Info &amp; Tips Otomotif
        </span>
        <h2
          id="news-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight"
        >
          Artikel Terbaru Seputar Chery
        </h2>
        <p className="text-base sm:text-lg mx-auto max-w-2xl text-slate-500 font-medium leading-relaxed">
          Ikuti perkembangan terbaru, teknologi otomotif inovatif, serta panduan perawatan berkendara terbaik langsung dari para ahli Chery.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto px-4">
        {articles.map((article, idx) => (
          <article
            key={article.id}
            className="group flex flex-col justify-between overflow-hidden rounded-sm bg-slate-50/50 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-500 ease-out opacity-0 animate-fade-up"
            style={{ animationDelay: `${(idx + 1) * 150}ms`, animationFillMode: 'forwards' }}
          >
            <div className="relative overflow-hidden aspect-[16/10] rounded-t-sm bg-slate-100">
              <Image
                src={article.image}
                alt={article.title}
                width={389}
                height={224}
                className="h-full w-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6 justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-sm bg-white border border-slate-150 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600 shadow-xs group-hover:bg-[#DA291C] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <ClockIcon className="size-3.5" aria-hidden="true" />
                  {article.date}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#DA291C] transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {article.author}
                </span>
                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#DA291C] hover:text-slate-950 transition-colors duration-300"
                >
                  Read More
                  <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl justify-center px-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-900 transition-all duration-300 hover:border-[#DA291C] hover:text-[#DA291C]"
        >
          Lihat Semua Artikel
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
