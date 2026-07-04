# **CLAUDE RULES**

Stack:

* Next.js App Router  
* TypeScript  
* TailwindCSS  
* shadcn/ui

Rules:

* Follow Figma exactly  
* Use semantic HTML  
* Mobile-first responsive design  
* Reusable components only  
* No inline styles  
* Accessible UI required  
* Use clean typography hierarchy  
* Use premium spacing system  
* Optimize performance  
* Use loading states  
* Keep code modular

Sections:

* Navbar  
* Hero  
* Car showcase  
* Features  
* Specifications  
* Gallery  
* CTA  
* Footer

After every task:

* Show changed files  
* Explain implementation  
* Explain how to run

Docker:

* Single-stage Dockerfile (node:22-alpine)
* `docker compose up --build` for dev, `docker compose -f docker-compose.yml up -d` for prod
* `docker-compose.override.yml` auto-merged for dev
* Prisma CLI: `node node_modules/prisma/build/index.js` (not `npx prisma`)
* Server: `npm run start` (uses next start, not standalone)
* Volumes: prisma/data (SQLite), public/uploads (media)

