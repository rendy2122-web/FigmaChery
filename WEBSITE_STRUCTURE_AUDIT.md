# Website Structure Audit - Chery Indonesia

## Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Custom shadcn/ui components

---

## Public-Facing Pages

### Homepage (`/`)
**Main Sections:**
1. **Hero Section** (`src/components/sections/hero.tsx`)
   - Dynamic carousel with 3 slides (Tiggo Cross CSH, Tiggo 9 CSH, J6)
   - Model logos, banners, pricing, CTAs
   - Data source: `homepage_sections` table (metadata JSON)

2. **Car Showcase** (`src/components/sections/car-showcase.tsx`)
   - Displays featured cars
   - Car cards with images, names, prices

3. **Why Chery** (`src/components/sections/why-chery.tsx`)
   - Brand value propositions
   - Features and benefits

4. **Services** (`src/components/sections/services.tsx`)
   - Service offerings
   - Icons and descriptions

5. **Special Offers** (`src/components/sections/special-offers.tsx`)
   - Promotional content
   - Dynamic from promotions table

6. **News/Articles** (`src/components/sections/news.tsx`)
   - Latest articles and updates
   - From articles table

7. **Dealerships** (`src/components/sections/dealerships.tsx`)
   - Dealer locations (Cibubur, Makassar, Pare-pare)
   - Images, contact info, test drive booking
   - Data source: `/api/dealers`

8. **CTA Section** (`src/components/sections/cta.tsx`)
   - Call-to-action for contact/sales

### Booking Page (`/booking`)
- **Component**: `src/components/booking/booking-form.tsx`
- Test drive booking form
- Dealer selection
- Customer information collection

### Car Model Pages
- **Tiggo Cross CSH**: `/models/tiggo-cross-csh`
  - Product sections: hero, efficiency, performance, comfort, colors, safety, pricing
  - Dynamic sections from `product_sections` table

### Authentication
- **Login Page**: `/(auth)/login/page.tsx`
  - Admin/editor login
  - NextAuth.js authentication

---

## Admin Dashboard (`/(dashboard)/dashboard/`)

### Dashboard Home (`/`)
- **Stats Cards**: Overview metrics (cars, articles, dealers, views)
- **Activity Feed**: Recent activities
- **Quick Actions**: Shortcuts to common tasks

### Cars Management (`/cars`)
- **List Page**: `/cars` - Cars table with CRUD operations
- **New Car**: `/cars/new` - Create new car
- **Edit Car**: `/cars/[id]/edit` - Update car details
- **API**: `/api/cars` - REST endpoints

### Articles Management (`/articles`)
- **List Page**: `/articles` - Articles table
- **New Article**: `/articles/new` - Create article
- **Edit Article**: `/articles/[id]/edit` - Update article
- **API**: `/api/articles` - REST endpoints

### Dealers Management (`/dealers`)
- **List Page**: `/dealers` - Dealers table
- **New Dealer**: `/dealers/new` - Create dealer
- **Edit Dealer**: `/dealers/[id]/edit` - Update dealer
- **API**: `/api/dealers` - REST endpoints

### Media Management (`/media`)
- **Upload Page**: `/media/upload` - Upload images/files
- **API**: `/api/media/upload` - Upload endpoint
- **API**: `/api/media/[id]` - Media operations

### Hero Management (`/hero`)
- **Page**: `/hero` - Manage homepage hero slides
- **API**: `/api/homepage/hero` - Hero section CRUD

### Product Sections (`/products/[id]/sections`)
- Manage product sections for each car
- **API**: `/api/products/[id]/sections` - Sections CRUD

---

## Database Schema

### Core Models

#### User
- id, email, name, password, role (admin/editor)
- createdAt, updatedAt

#### Car
- id, name, slug, subtitle, description
- priceFrom, status (draft/published), featured, sortOrder
- Relations: images, specs, features, promotions

#### CarImage
- id, carId, url, alt, sortOrder

#### CarSpec
- id, carId, label, value, sortOrder

#### CarFeature
- id, carId, title, description, icon, sortOrder

#### Article
- id, title, slug, excerpt, content
- featuredImage, status (draft/published/scheduled)
- publishedAt, scheduledAt, views
- categoryId, seo, tags

#### Category
- id, name, slug, description

#### Tag
- id, name, slug

#### Dealer
- id, name, city, address, phone, email
- whatsapp, image, mapsEmbed
- status (active/inactive), sortOrder

#### Promotion
- id, title, slug, description
- bannerImage, ctaText, ctaLink
- startDate, endDate, status (draft/active/expired)
- featured, sortOrder, carId

#### Media
- id, filename, originalName, mimeType, size
- url, folder, alt, width, height

#### HomepageSection
- id, section (hero, cta, etc.)
- title, subtitle, description, image
- ctaText, ctaLink, isActive, sortOrder
- metadata (JSON for flexible data)

#### Setting
- id, key, value, type (text/textarea/json/image)
- group (general/social/contact/footer)

#### SEOMetadata
- id, page (home/cars/articles/etc.)
- title, description, keywords, ogImage
- canonical, noIndex

---

## API Routes

### Public APIs
- `GET /api/dealers` - Fetch active dealers
- `GET /api/cars` - Fetch published cars
- `GET /api/articles` - Fetch published articles
- `GET /api/homepage/hero` - Fetch hero slides

### Admin APIs (Protected)
- `POST /api/auth/[...nextauth]` - Authentication
- `CRUD /api/cars` - Car management
- `CRUD /api/articles` - Article management
- `CRUD /api/dealers` - Dealer management
- `CRUD /api/media/*` - Media management
- `CRUD /api/homepage/hero` - Hero management
- `CRUD /api/products/[id]/sections` - Product sections

---

## Component Architecture

### Layout Components
- `layout/navbar.tsx` - Main navigation
- `layout/footer.tsx` - Footer
- `layout/container.tsx` - Content container
- `layout/section.tsx` - Section wrapper
- `layout/logo.tsx` - Logo component
- `layout/whatsapp-button.tsx` - Floating WhatsApp button

### Section Components (Homepage)
- `sections/hero.tsx` - Hero carousel
- `sections/car-showcase.tsx` - Car grid
- `sections/why-chery.tsx` - Brand values
- `sections/services.tsx` - Services
- `sections/special-offers.tsx` - Promotions
- `sections/news.tsx` - Articles
- `sections/dealerships.tsx` - Dealer locations
- `sections/cta.tsx` - Call-to-action

### Product Components
- `product/hero-banner.tsx` - Product hero
- `product/more-efficient.tsx` - Efficiency section
- `product/faster-powerful.tsx` - Performance section
- `product/smarter-comfortable.tsx` - Comfort section
- `product/color-options.tsx` - Colors
- `product/dynamics-safety.tsx` - Safety
- `product/variant-pricing.tsx` - Pricing
- `product/breadcrumb.tsx` - Breadcrumb navigation

### CMS Components
- `cms/car-form.tsx` - Car create/edit form
- `cms/cars-table.tsx` - Cars list table
- `cms/article-form.tsx` - Article create/edit form
- `cms/articles-table.tsx` - Articles list table
- `cms/dealer-form.tsx` - Dealer create/edit form
- `cms/media-table.tsx` - Media library table

### Dashboard Components
- `dashboard/stats-cards.tsx` - Statistics overview
- `dashboard/activity-feed.tsx` - Recent activities
- `dashboard/quick-actions.tsx` - Quick action buttons
- `dashboard/sidebar.tsx` - Sidebar navigation
- `dashboard/navbar.tsx` - Dashboard header

### UI Components
- `ui/button.tsx` - Button
- `ui/card.tsx` - Card
- `ui/badge.tsx` - Badge
- `ui/navigation-menu.tsx` - Navigation
- `ui/separator.tsx` - Separator
- `ui/sheet.tsx` - Sheet/dialog
- `ui/skeleton.tsx` - Loading skeleton
- `ui/social-icons.tsx` - Social media icons
- `ui/aspect-ratio.tsx` - Aspect ratio wrapper

### Booking Components
- `booking/booking-form.tsx` - Booking form
- `booking/breadcrumb.tsx` - Booking breadcrumb

---

## Static Assets

### Images (`public/figma/`)
- **Dealers**: dealer-cibubur.png, dealer-makassar.png, dealer-parepare.png
- **Cars**: car-q.png, car-j6.png, car-e5.png, car-c5csh.png
- **Hero Banners**: hero-banner.png, hero-banner-j6.png, hero-banner-tiggo9.png
- **Model Logos**: model-logo.png, model-logo-j6.png, model-logo-tiggo9.png
- **Promos**: promo-1.png, promo-2.png, promo-3.png
- **Articles**: article-1.png, article-2.png, article-3.png

### Other Assets
- `public/chery-logo.png` - Main logo
- `public/*.svg` - Icon assets

---

## Key Features

### Public Features
1. **Dynamic Homepage**: Hero carousel, sections from database
2. **Car Catalog**: Published cars with details
3. **Test Drive Booking**: Form with dealer selection
4. **Article/News**: Blog-style content
5. **Dealer Locator**: Dealer information and contact
6. **Promotions**: Special offers display
7. **SEO Optimization**: Meta tags, sitemap, robots.txt
8. **WhatsApp Integration**: Floating WhatsApp button

### Admin Features
1. **Authentication**: Secure login with NextAuth
2. **Car Management**: CRUD operations for cars
3. **Article Management**: CRUD with scheduling
4. **Dealer Management**: CRUD for dealer info
5. **Media Library**: Upload and manage images
6. **Hero Management**: Dynamic homepage slides
7. **Product Sections**: Customizable product pages
8. **Dashboard Analytics**: Stats and activity feed

---

## Page Routes Summary

### Public Routes
- `/` - Homepage
- `/booking` - Test drive booking
- `/models/tiggo-cross-csh` - Product page
- `/login` - Admin login

### Admin Routes (Protected)
- `/dashboard` - Dashboard home
- `/dashboard/cars` - Cars list
- `/dashboard/cars/new` - New car
- `/dashboard/cars/[id]/edit` - Edit car
- `/dashboard/articles` - Articles list
- `/dashboard/articles/new` - New article
- `/dashboard/articles/[id]/edit` - Edit article
- `/dashboard/dealers` - Dealers list
- `/dashboard/dealers/new` - New dealer
- `/dashboard/dealers/[id]/edit` - Edit dealer
- `/dashboard/media` - Media library
- `/dashboard/media/upload` - Upload media
- `/dashboard/hero` - Hero management
- `/dashboard/products/[id]/sections` - Product sections

### API Routes
- `/api/auth/*` - Authentication
- `/api/cars` - Cars CRUD
- `/api/articles` - Articles CRUD
- `/api/dealers` - Dealers CRUD
- `/api/media/*` - Media operations
- `/api/homepage/hero` - Hero management
- `/api/products/[id]/sections` - Product sections

---

## Database Tables
1. users
2. cars
3. car_images
4. car_specs
5. car_features
6. categories
7. articles
8. tags
9. article_tags
10. dealers
11. promotions
12. media
13. homepage_sections
14. settings
15. seo_metadata

---

## Authentication & Authorization
- **Provider**: NextAuth.js
- **Roles**: admin, editor
- **Protected Routes**: Dashboard pages (via middleware)
- **Default Credentials**: admin@chery.com / admin123

---

## Development Setup
- **Package Manager**: npm
- **Dev Server**: `npm run dev` (port 3000)
- **Database**: SQLite (prisma/dev.db)
- **Migrations**: `npx prisma migrate dev`
- **Seed Data**: `npx prisma db seed`

---

## Notes for Audit
- All images stored in `public/figma/` directory
- Database uses SQLite for development
- Admin dashboard protected by authentication middleware
- Content managed through database with Prisma ORM
- Responsive design with Tailwind CSS
- Indonesian language content