import Link from "next/link";
import Image from "next/image";
import { ClockIcon, ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/layout/section";

type Article = {
  id: string;
  image: string;
  category: string;
  date: string;
  title: string;
  description: string;
  author: string;
};

const articles: Article[] = [
  {
    id: "sales-record",
    image: "/figma/article-1.png",
    category: "Press Release",
    date: "15 Juni 2026",
    title: "Morem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Chery Indonesia mencatat rekor penjualan tertinggi sepanjang sejarah dengan pertumbuhan 150%…",
    author: "Chery Indonesia",
  },
  {
    id: "shs-safety",
    image: "/figma/article-2.png",
    category: "Technology",
    date: "10 Juni 2026",
    title: "Yorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Pelajari bagaimana Chery SHS (Safety Handling System) memberikan perlindungan maksimal bagi…",
    author: "Tim Teknis",
  },
  {
    id: "rainy-season-tips",
    image: "/figma/article-3.png",
    category: "Ownership Tips",
    date: "5 Juni 2026",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Panduan lengkap merawat Chery Hybrid Anda agar tetap prima dan aman selama musim hujan.",
    author: "Tim After Sales",
  },
];

export function News() {
  return (
    <Section id="news" aria-labelledby="news-heading">
      <div className="mb-16 flex flex-col gap-4 text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Info &amp; Tips Otomotif
        </span>
        <h2
          id="news-heading"
          className="text-h1 font-heading font-bold text-foreground"
        >
          Artikel Terbaru Seputar Chery
        </h2>
        <p className="text-body-lg mx-auto max-w-2xl text-muted-foreground">
          Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={article.image}
              alt={article.title}
              width={389}
              height={224}
              className="h-56 w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ClockIcon className="size-3" aria-hidden="true" />
                  {article.date}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {article.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <span className="text-xs text-muted-foreground/70">
                  {article.author}
                </span>
                <Link
                  href="#news"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
                >
                  Read More
                  <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
