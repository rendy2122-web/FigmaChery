import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarBySlugForPublic, getPublishedCars } from "@/lib/data/cars";
import { getAllPublishedTestimonials } from "@/lib/data/testimonials";
import { ProductDetailClient, type CarData } from "@/components/product/product-detail-client";

export function generateStaticParams() {
  return getPublishedCars().map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlugForPublic(slug);
  if (!car) return {};

  const title = car.subtitle ? `${car.name} — ${car.subtitle}` : car.name;
  const description = car.description
    ? car.description.slice(0, 160)
    : `Simak spesifikasi, harga, dan promo terbaru ${car.name} dari Chery Indonesia.`;
  const ogImage = car.thumbnail || car.images?.[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

/**
 * DB fields are nullable at the schema level; every seeded car has them
 * populated, but the presentational components (hero-section, spec-comparison,
 * etc.) declare non-nullable string props, so we coerce once here at the
 * server/client boundary rather than loosening every child component's contract.
 */
function toDetailCarData(row: NonNullable<ReturnType<typeof getCarBySlugForPublic>>): CarData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    price_from: row.price_from ?? "",
    type: row.type,
    thumbnail: row.thumbnail ?? undefined,
    images: row.images ?? [],
    color_images: row.color_images,
    specs: row.specs ?? [],
    highlights: row.highlights ?? [],
    interiorImage: row.interiorImage,
    exteriorImage: row.exteriorImage,
    carImage: row.carImage,
    techImage: row.techImage,
  };
}

function toListCarData(row: ReturnType<typeof getPublishedCars>[number]): CarData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    price_from: row.price_from ?? "",
    type: row.type,
    thumbnail: row.thumbnail ?? undefined,
    images: [],
    specs: row.specs ?? [],
    highlights: [],
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carRow = getCarBySlugForPublic(slug);

  if (!carRow) notFound();

  const allCarsRows = getPublishedCars();
  const testimonials = getAllPublishedTestimonials();

  const car = toDetailCarData(carRow);
  const allCars = allCarsRows.map(toListCarData);

  return <ProductDetailClient car={car} allCars={allCars} testimonials={testimonials} />;
}
