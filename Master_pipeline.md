MASTER PIPELINE

Project:  
Chery Automotive Website

Goal:  
Build a modern premium automotive website from Figma design.

Rules:

* Mobile first

* SEO friendly

* Accessibility friendly

* Fast loading

* Reusable components

* Premium UI quality

* Production-ready code

Workflow:

1. Analyze Figma

2. Build section by section

3. Review

4. Revise

5. Deploy

Commands:

* LOCK

* REVISE

* EXPLAIN

* TEST

* ABORT

Deployment:

* Docker single-stage (node:22-alpine)
* CI: lint on PRs
* CD: build → push to GHCR → SSH deploy
* `docker compose up --build` (dev), `docker compose up -d` (prod)
* `.env` required: AUTH_SECRET, AUTH_URL
