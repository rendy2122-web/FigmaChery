# CI/CD Setup Guide

## Overview

Project ini menggunakan GitHub Actions untuk Continuous Integration (CI) dan Continuous Deployment (CD).

## Workflows

### 1. CI (Continuous Integration)
**File**: `.github/workflows/ci.yml`

**Trigger**: Push ke branch `main` atau `develop`, Pull Request ke `main` atau `develop`

**Steps**:
1. Checkout code
2. Setup Node.js v20
3. Install dependencies (`npm ci`)
4. Run linting (`npm run lint`)
5. Build project (`npm run build`)
6. Run tests (jika ada)

### 2. CD (Continuous Deployment)
**File**: `.github/workflows/cd.yml`

**Trigger**: Push ke branch `main` atau setelah CI berhasil

**Steps**:
1. Checkout code
2. Setup Node.js v20
3. Install dependencies
4. Build project
5. Deploy ke Vercel (primary)
6. Notify deployment status

## Setup Secrets

Untuk mengaktifkan deployment, tambahkan secrets berikut di GitHub repository:

### Vercel (Recommended)
1. Buat akun di [Vercel](https://vercel.com)
2. Import project dari GitHub
3. Dapatkan token dari Vercel Settings
4. Tambahkan secrets di GitHub:
   - `VERCEL_TOKEN`: Token dari Vercel
   - `VERCEL_ORG_ID`: Organization ID dari Vercel
   - `VERCEL_PROJECT_ID`: Project ID dari Vercel

### Netlify (Alternative)
1. Buat akun di [Netlify](https://netlify.com)
2. Dapatkan auth token dan site ID
3. Tambahkan secrets:
   - `NETLIFY_AUTH_TOKEN`: Auth token dari Netlify
   - `NETLIFY_SITE_ID`: Site ID dari Netlify

### Railway (Alternative - untuk database/backend)
1. Buat akun di [Railway](https://railway.app)
2. Deploy database
3. Tambahkan secrets:
   - `RAILWAY_TOKEN`: Token dari Railway
   - `RAILWAY_SERVICE`: Service name dari Railway

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