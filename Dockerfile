# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────
# Stage 1: Base — install dependencies
# ──────────────────────────────────────────────
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY package.json package-lock.json* ./

# Install all dependencies (including dev, needed for prisma generate & next build)
RUN npm ci

# ──────────────────────────────────────────────
# Stage 2: Builder — compile & build
# ──────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ──────────────────────────────────────────────
# Stage 3: Runner — minimal production image
# ──────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma artifacts (schema + migrations for runtime migrations)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Copy better-sqlite3 native binding (already compiled for alpine)
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Copy seed dependencies (needed at runtime for prisma migrate deploy + seed)
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/src/lib/db ./src/lib/db

# Ensure data and uploads directories exist and are writable
RUN mkdir -p /app/prisma/data /app/public/uploads && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations, seed, then start
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/lib/db/seed.ts && node server.js"]
