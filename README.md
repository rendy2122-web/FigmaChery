# Chery Automotive Website

Modern premium automotive website built from Figma design, featuring car showcases, dealer locator, booking system, and CMS dashboard.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS v4** + shadcn/ui
- **SQLite** (via better-sqlite3)
- **Prisma 6** (migrations)
- **NextAuth v5** (authentication)
- **Docker** (containerized deployment)

## Getting Started

### Local development (without Docker)

```bash
npm install
npx prisma migrate deploy
npx tsx src/lib/db/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker development

```bash
# Create .env file
echo 'AUTH_SECRET=dev-secret-change-in-production' > .env

# Start with hot reload
docker compose up --build
```

The `docker-compose.override.yml` automatically enables hot reload, mounts source code, and uses development mode.

### Production build

```bash
docker build -t figmachery .
docker run -p 3000:3000 figmachery
```

## Admin Dashboard

| Route | Description |
|---|---|
| `/login` | Admin login |
| `/dashboard` | Overview (stats, activity) |
| `/dashboard/articles` | Articles CRUD |
| `/dashboard/cars` | Cars CRUD |
| `/dashboard/dealers` | Dealers CRUD |
| `/dashboard/hero` | Hero slideshow editor |
| `/dashboard/media` | Media library |

Default credentials (from seed): `admin@chery.com` / `admin123`

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── (dashboard)/         # Admin dashboard
│   ├── api/                 # API routes
│   └── booking/             # Test drive booking
├── components/
│   ├── booking/             # Booking form
│   ├── cms/                 # Dashboard forms & tables
│   ├── dashboard/           # Dashboard layout
│   ├── layout/              # Public layout (navbar, footer)
│   ├── product/             # Product page sections
│   ├── sections/            # Homepage sections
│   └── ui/                  # shadcn/ui components
└── lib/
    ├── auth.ts              # NextAuth config
    └── db/
        ├── index.ts         # SQLite connection & schema
        └── seed.ts          # Database seed data
```

## Deployment

Docker image is built and pushed to GitHub Container Registry via GitHub Actions.

```bash
# On server, create .env:
GHCR_IMAGE=ghcr.io/your-org/figmachery
AUTH_SECRET=your-secret
AUTH_URL=https://your-domain.com

# Pull and run
docker compose pull
docker compose up -d
```

See `.github/workflows/` for CI/CD pipeline details.
