"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useBookingModal } from "@/components/product/booking-modal-provider";

interface Spec {
  label: string;
  value: string;
}

interface CarSummary {
  id: string;
  name: string;
  slug: string;
  price_from: string;
  thumbnail?: string;
  images?: { url: string }[];
  specs?: Spec[];
}

interface OtherProductsCarouselProps {
  currentCarId: string;
  cars: CarSummary[];
  whatsappNumber?: string;
}

function formatSpecLabel(label: string) {
  return label.replace(/\s*\([^)]*\)/g, "").trim();
}

export default function OtherProductsCarousel({
  currentCarId,
  cars,
  whatsappNumber = "6289527072446",
}: OtherProductsCarouselProps) {
  const others = cars.filter((c) => c.id !== currentCarId);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { openBookingModal } = useBookingModal();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = cardRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: track, threshold: [0.6] }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [others.length]);

  if (others.length === 0) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const card = cardRefs.current[0];
    const track = trackRef.current;
    if (!card || !track) return;
    const gap = 24;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  return (
    <section
      id="other-products"
      aria-labelledby="other-products-heading"
      className="bg-[#e5e5e5] py-20"
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <motion.h2
          id="other-products-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center text-3xl font-black uppercase tracking-tight text-[#1a1a1a] sm:text-4xl"
        >
          Other Chery Products
        </motion.h2>

        <div className="relative flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Sebelumnya"
            className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#1a1a1a] shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md active:scale-95 sm:flex"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <div
            ref={trackRef}
            className="no-scrollbar flex flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth"
          >
            {others.map((car, i) => {
              const specs = (car.specs ?? []).slice(0, 3);
              const image = car.thumbnail || car.images?.[0]?.url || "";
              const waMessage = encodeURIComponent(
                `Halo, saya ingin meminta brosur untuk ${car.name}.`
              );

              return (
                <motion.div
                  key={car.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group w-[260px] shrink-0 snap-start sm:w-[290px]"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.09)]">
                    <Link
                      href={`/models/${car.slug}`}
                      className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-neutral-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={car.name}
                        className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    <Link href={`/models/${car.slug}`}>
                      <h3 className="text-lg font-semibold text-[#1a1a1a] transition-colors duration-300 group-hover:text-black">
                        {car.name}
                      </h3>
                    </Link>

                    <div className="mt-3">
                      <span className="block text-xs text-neutral-500">Starts From</span>
                      <span className="block text-xl font-bold text-[#1a1a1a]">
                        IDR {car.price_from}
                      </span>
                      <span className="block text-[11px] text-neutral-400">*OTR Jakarta</span>
                    </div>

                    {specs.length > 0 && (
                      <div className="mt-4">
                        <span className="block text-sm font-medium text-neutral-800">
                          Highlight Specs
                        </span>
                        <ul className="mt-2 space-y-1.5">
                          {specs.map((s) => (
                            <li
                              key={s.label}
                              className="flex items-start gap-2 text-[13px] leading-snug text-neutral-500"
                            >
                              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-400" aria-hidden="true" />
                              {formatSpecLabel(s.label)} {s.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openBookingModal("test", car.id)}
                          className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-xs font-semibold text-[#1a1a1a] transition-colors duration-300 hover:border-[#1a1a1a]"
                        >
                          Test Drive
                        </button>
                        <Link
                          href={`/models/${car.slug}`}
                          className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#111111] text-xs font-semibold text-white transition-colors duration-300 hover:bg-black"
                        >
                          See Detail
                        </Link>
                      </div>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#a08768] text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#8f7658]"
                      >
                        <Download className="size-4" aria-hidden="true" />
                        Download Brochure
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Selanjutnya"
            className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#1a1a1a] shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md active:scale-95 sm:flex"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        {others.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {others.map((car, i) => (
              <button
                key={car.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Ke ${car.name}`}
                aria-current={i === activeIndex}
                className="relative h-1.5 rounded-full bg-neutral-400/40 transition-all duration-300"
                style={{ width: i === activeIndex ? 28 : 8 }}
              >
                {i === activeIndex && (
                  <motion.span
                    layoutId="other-products-dot"
                    className="absolute inset-0 rounded-full bg-[#1a1a1a]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
