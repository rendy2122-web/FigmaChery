import { z } from "zod";

// Car schemas
export const createCarSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  priceFrom: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const updateCarSchema = createCarSchema.partial();

// Article schemas
export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  publishedAt: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
});

export const updateArticleSchema = createArticleSchema.partial();

// Dealer schemas
export const createDealerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  city: z.string().min(1, "City is required").max(255),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  mapsEmbed: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  sortOrder: z.number().int().optional().default(0),
});

export const updateDealerSchema = createDealerSchema.partial();

// Hero slides schema
export const heroSlideSchema = z.object({
  id: z.string(),
  model: z.string(),
  modelLogo: z.string(),
  banner: z.string(),
  priceFrom: z.string(),
  caption: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

export const heroSlidesSchema = z.array(heroSlideSchema);