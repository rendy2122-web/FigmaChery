# CI/CD Pipeline

## Overview

Project ini menggunakan GitHub Actions untuk build Docker image, push ke GitHub Container Registry (GHCR), dan deploy ke server via SSH.

## Workflows

### 1. CI — Lint Check
**File**: `.github/workflows/ci.yml`

| Trigger | Action |
|---|---|
| Push ke `main`, `develop` | Lint |
| Pull Request ke `main`, `develop` | Lint |

### 2. CD — Build, Push & Deploy
**File**: `.github/workflows/cd.yml`

| Trigger | Action |
|---|---|
| Push ke `main` | Build → Push → Deploy |
| `workflow_dispatch` | Build → Push → Deploy (opsional) |

**Steps:**
1. Checkout code
2. Login ke GHCR
3. Build Docker image (single-stage, Alpine)
4. Push ke `ghcr.io/{owner}/{repo}:latest` + SHA tag
5. SSH ke server, `docker compose pull && up -d`, run seed

## Required Secrets & Variables

Tambahkan di **Settings → Secrets and variables → Actions**:

### Variables

| Name | Description |
|---|---|
| `SERVER_HOST` | IP/hostname server |
| `SERVER_USER` | SSH username |
| `SERVER_PATH` | Path project di server (tempat `docker-compose.yml`) |

### Secrets

| Name | Description |
|---|---|
| `SERVER_SSH_KEY` | Private SSH key untuk autentikasi |

## Server Setup

Di server, pastikan ada file `.env` di `$SERVER_PATH`:

```bash
GHCR_IMAGE=ghcr.io/rendy2122-web/figmachery
AUTH_SECRET=your-generated-secret
AUTH_URL=https://your-domain.com
PORT=3000
```

Generate `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Docker Compose Files

| File | Purpose |
|---|---|
| `docker-compose.yml` | Production — pull image from GHCR |
| `docker-compose.override.yml` | Development — build locally, hot reload |

## Cara Menambahkan Secrets di GitHub

1. Buka repository di GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret**
4. Masukkan nama secret dan value
5. Klik **Add secret**

## Monitoring

### View Workflow Runs
1. Buka repository di GitHub
2. Klik tab **Actions**
3. Pilih workflow yang ingin dilihat
4. Klik pada workflow run untuk detail

### Deployment Status
- Setiap push ke `main` akan trigger CI/CD
- Status deployment akan muncul di tab Actions
- Notifikasi akan muncul jika deployment berhasil/gagal

## Troubleshooting

### CI Build Gagal
- Check logs di tab Actions
- Pastikan `npm run build` berhasil di lokal
- Pastikan tidak ada linting errors

### CD Deployment Gagal
- Check secrets sudah di-set dengan benar
- Check Vercel/Netlify project settings
- Pastikan build berhasil sebelum deploy

## Best Practices

1. **Jangan commit secrets** ke repository
2. **Test di lokal** sebelum push ke GitHub
3. **Monitor Actions** setelah push untuk memastikan CI/CD berjalan
4. **Use branch protection** untuk `main` branch
5. **Require CI to pass** sebelum merge PR

## Branch Strategy

- `main`: Production branch, auto-deploy
- `develop`: Development branch, auto-deploy ke staging
- `feature/*`: Feature branches, hanya CI (no deploy)

## Rollback

Jika deployment gagal:
1. Buka Vercel/Netlify dashboard
2. Pilih deployment sebelumnya yang berhasil
3. Click "Promote to Production"

Atau via Git:
```bash
git revert HEAD
git push origin main