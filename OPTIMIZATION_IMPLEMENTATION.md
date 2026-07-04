# Internal Optimization Implementation Plan

## Files to Modify

### 1. Database & Schema
- `prisma/schema.prisma` - Add indexes

### 2. API Routes (Add caching, validation, error handling)
- `src/app/api/cars/route.ts`
- `src/app/api/articles/route.ts`
- `src/app/api/dealers/route.ts`
- `src/app/api/homepage/hero/route.ts`

### 3. Next.js Configuration
- `next.config.ts` - Add production optimizations

### 4. Environment & Security
- `.env` - Generate secure AUTH_SECRET

### 5. Loading & Error Pages
- `src/app/loading.tsx`
- `src/app/error.tsx`
- `src/app/(dashboard)/dashboard/loading.tsx`
- `src/app/(dashboard)/dashboard/error.tsx`

### 6. Component Optimization
- `src/components/sections/hero.tsx` - Remove unnecessary client-side fetching
- `src/components/sections/dealerships.tsx` - Optimize rendering
- `src/components/sections/car-showcase.tsx` - Add dynamic import

### 7. Shared Utilities
- `src/lib/api-validation.ts` - Zod schemas
- `src/lib/rate-limit.ts` - Rate limiting utility

---

## Implementation Order

1. Database indexes (Prisma migration)
2. API route optimization (caching, validation, error handling)
3. Next.js config optimization
4. Security improvements
5. Loading & error pages
6. Component optimization
7. Shared utilities

---

## Constraints Checklist

✅ No UI/UX changes
✅ No CMS structure changes
✅ No database structure changes (only indexes)
✅ No page flow changes
✅ No API response format changes
✅ No public routing changes
✅ No feature removal
✅ Internal refactor only