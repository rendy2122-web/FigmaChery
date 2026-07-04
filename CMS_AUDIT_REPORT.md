# CMS Audit Report - Chery Indonesia

## CMS MATURITY SCORE: 6.5/10
## SECURITY SCORE: 5.5/10  
## SCALABILITY SCORE: 4/10
## MAINTAINABILITY SCORE: 6/10
## RISK LEVEL: HIGH (SQLite + missing pagination + no soft delete)

---

## 1. ARCHITECTURE STANDARD

### ✅ Sudah Sesuai Standard

| Aspek | Status | Alasan |
|-------|--------|--------|
| Struktur folder App Router | ✅ | Route groups `(dashboard)` & `(auth)` clean |
| Separation of concerns | ✅ | CMS components di folder `components/cms/`, dashboard di `components/dashboard/` |
| Server Components | ✅ | Dashboard pages server-rendered, session check di layout |
| Form component reusable | ✅ | `car-form.tsx`, `article-form.tsx`, `dealer-form.tsx` reusable untuk create/edit |
| API route naming | ✅ | RESTful: `/api/cars`, `/api/cars/[id]` |

### ⚠️ Perlu Perbaikan

| Aspek | Masalah | Solusi |
|-------|---------|--------|
| **Auth duplikasi** | Setiap dashboard page mengulang `auth()` + `redirect()` (7x redundancy) | Pindahkan ke layout → sudah ada di `dashboard/layout.tsx` tapi pages tetap mengulang |
| **No pagination** | Semua list page fetch ALL records | Tambahkan query params `?page=1&limit=20` |
| **Form state management** | `useState` manual untuk setiap field | Bisa gunakan React Hook Form untuk skala besar |
| **No TypeScript strict** | Banyak `as any` casting | Gunakan Prisma generated types |

### ❌ Tidak Sesuai Standard

| Aspek | Masalah |
|-------|---------|
| **Dashboard auth redundancy** | Dashboard page line 9-13: `auth()` + `redirect()` sudah ada di layout → duplikasi dan extra DB call |
| **API tidak konsisten** | `cars/route.ts` pakai `randomUUID` dari crypto, `dealers/[id]` pakai `dealer-${Date.now()}` |
| **No error boundaries** | Tidak ada error.tsx untuk setiap CMS route |

---

## 2. SECURITY STANDARD

### Risk Level: MEDIUM-HIGH

### Critical Issues

| Issue | Risk | Detail |
|-------|------|--------|
| **No CSRF Protection** | 🔴 HIGH | API POST/PUT tidak ada CSRF token. Bisa diserang dari external site |
| **Media Upload tanpa validasi** | 🔴 HIGH | `api/media/upload/route.ts` - tidak ada validasi file type, size limit, atau sanitization filename |
| **SQL Injection via raw SQL** | 🟡 MEDIUM | Banyak query pakai `db.prepare()` dengan concatenation meski parameterized, masih ada risk human error |
| **Default AUTH_SECRET** | 🟡 MEDIUM | `"dev-secret-do-not-use-in-production"` - bisa dibaca oleh siapa saja |

### Findings Detail

**Role-based access control**
- ✅ Admin vs editor role sudah di schema
- ✅ Dashboard layout sudah cek session
- ⚠️ TAPI: `middleware.ts` hanya protect `/login`, bukan `/dashboard/*`
  - Proteksi dashboard hanya di layout level, bukan middleware level
  - Jika ada route yang lupa cek session, bisa diakses tanpa login

**API Protection**
- ✅ POST/PUT/DELETE sudah cek `session?.user`
- ⚠️ GET API publik bisa diakses siapa saja (already intended)
- ⚠️ Rate limit baru ditambahkan di sebagian route (`dealers/route.ts`)

**Password Security**
- ✅ Password hashed dengan `bcryptjs` (10 salt rounds)
- ✅ Default credentials jelas di seed

### 🚀 Security Improvements (Prioritas)

1. **🔥 CRITICAL: Tambahkan middleware protection untuk dashboard**
   ```typescript
   // middleware.ts - harus redirect /dashboard/* jika tidak login
   if (pathname.startsWith("/dashboard") && !sessionCookie) {
     return NextResponse.redirect(new URL("/login", req.url));
   }
   ```

2. **🔥 CRITICAL: Validasi file upload**
   ```typescript
   // Batasi file type dan size
   const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
   const MAX_SIZE = 5 * 1024 * 1024; // 5MB
   if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
     return NextResponse.json({ error: "File tidak valid" }, { status: 400 });
   }
   ```

3. **⚠️ HIGH: Generate AUTH_SECRET production**
   ```bash
   openssl rand -base64 32
   ```

4. **⚠️ HIGH: CSRF Protection untuk API mutasi**
   ```typescript
   // Di middleware atau API helper
   if (req.method !== 'GET') {
     const origin = req.headers.get('origin');
     if (origin && !origin.includes(process.env.NEXT_PUBLIC_APP_URL)) {
       return NextResponse.json({ error: "CSRF detected" }, { status: 403 });
     }
   }
   ```

---

## 3. DATA INTEGRITY & VALIDATION

### ✅ Good Practice

| Aspek | Detail |
|-------|--------|
| Slug unique di database | ✅ `@unique` constraint di Prisma |
| Cascade delete | ✅ `onDelete: Cascade` untuk relasi |
| Status fields | ✅ `draft/published` untuk content management |
| Zod validation | ✅ Sudah diterapkan di `api-validation.ts` untuk beberapa route |

### ⚠️ Risks

| Risk | Severity | Detail |
|------|----------|--------|
| **No soft delete** | 🔴 HIGH | Delete permanent tanpa recovery. `DELETE FROM dealers WHERE id = ?` langsung hapus data |
| **No scheduled publish** | 🟡 MEDIUM | `scheduledAt` field ada tapi tidak ada cron job untuk auto-publish |
| **No validation before delete** | 🟡 MEDIUM | Bisa hapus car yang punya images/features/specs → cascade delete bisa hapus banyak data tanpa konfirmasi |
| **Slug not regenerated on update** | 🟡 MEDIUM | Jika user ganti title tapi lupa ganti slug, URL jadi mismatch |
| **No draft auto-save** | 🟢 LOW | Content writer bisa kehilangan draft jika browser crash |

### 🚀 Improvements

1. **Add soft delete**:
   ```prisma
   model Car {
     deletedAt DateTime?
   }
   // Update queries: WHERE deletedAt IS NULL
   ```

2. **Auto-schedule publishing**:
   ```typescript
   // API endpoint untuk cron job
   // GET /api/cron/publish-scheduled
   db.prepare(`
     UPDATE articles 
     SET status = 'published', published_at = ?
     WHERE status = 'scheduled' AND scheduled_at <= ?
   `).run(now, now);
   ```

3. **Delete confirmation checks**:
   ```typescript
   // Sebelum delete, cek relasi
   const relatedImages = db.prepare("SELECT COUNT(*) as count FROM car_images WHERE car_id = ?").get(id);
   if (totalRelations > 0) {
     return NextResponse.json({ 
       error: `Mobil ini memiliki ${totalRelations} data terkait. Yakin hapus?` 
     }, { status: 409 });
   }
   ```

---

## 4. PERFORMANCE CMS

### Critical Performance Issues

| Issue | Impact | Detail |
|-------|--------|--------|
| **❌ No pagination** | 🔴 HIGH | `CarsPage` fetch ALL cars. Jika 1000+ mobil, query `SELECT * sort_order ASC` full table scan |
| **❌ Multiple query dashboard** | 🟡 MEDIUM | Dashboard page execute 6+ queries: `COUNT(*)` x4 + `ORDER BY` x2 |
| **⚠️ No search/filter** | 🟡 MEDIUM | Tidak ada pencarian di list pages. Admin harus scroll semua data |
| **✅ Indexes sudah ada** | 🟢 LOW | 6 indexes sudah ditambahkan |

### Dashboard Stats Query Analysis

```typescript
// Current: 4 separate COUNT queries
const totalCars = db.prepare("SELECT COUNT(*) as count FROM cars").get();
const totalArticles = db.prepare("SELECT COUNT(*) as count FROM articles").get();
const totalDealers = db.prepare("SELECT COUNT(*) as count FROM dealers").get();
const totalPromotions = db.prepare("SELECT COUNT(*) as count FROM promotions").get();

// Better: Single query
const [cars, articles, dealers, promotions] = db.prepare(`
  SELECT 
    (SELECT COUNT(*) FROM cars) as cars,
    (SELECT COUNT(*) FROM articles) as articles,
    (SELECT COUNT(*) FROM dealers) as dealers,
    (SELECT COUNT(*) FROM promotions) as promotions
`).get();
```

### 🚀 Performance Recommendations

1. **Immediate - Add pagination**:
   ```typescript
   // API
   const page = parseInt(searchParams.get('page') || '1');
   const limit = parseInt(searchParams.get('limit') || '20');
   const offset = (page - 1) * limit;
   const cars = db.prepare(`
     SELECT * FROM cars ORDER BY created_at DESC LIMIT ? OFFSET ?
   `).all(limit, offset);
   ```

2. **Add search/filter**:
   ```typescript
   const search = searchParams.get('q');
   if (search) {
     query += " WHERE name LIKE ?";
     params.push(`%${search}%`);
   }
   ```

3. **Dashboard query optimization**:
   ```typescript
   // Gunakan single query untuk stats
   const stats = db.prepare(`
     SELECT 
       (SELECT COUNT(*) FROM cars) as cars,
       (SELECT COUNT(*) FROM articles) as articles,
       (SELECT COUNT(*) FROM dealers) as dealers,
       (SELECT COUNT(*) FROM promotions) as promotions
   `).get();
   ```

---

## 5. UX ADMIN EXPERIENCE

### ✅ Good Practice

| Aspek | Status |
|-------|--------|
| Form validasi client-side | ✅ Required fields marked |
| Error message dari API | ✅ Ditampilkan di form |
| Loading state | ✅ Button disabled + text "Menyimpan..." |
| Auto-slug generation | ✅ Dari name → slug otomatis |
| Image preview | ✅ Setelah upload |

### ⚠️ Areas for Improvement

| Issue | Severity | Suggestion |
|-------|----------|------------|
| **No delete confirmation modal** | 🔴 HIGH | "Apakah Anda yakin?" modal sebelum DELETE |
| **No preview before publish** | 🟡 MEDIUM | Button "Preview" untuk lihat tampilan sebelum publish |
| **No auto-save draft** | 🟡 MEDIUM | Simpan draft otomatis setiap 30 detik |
| **Rich text editor** | 🟡 MEDIUM | Article form pakai `<textarea>`, belum support formatting (bold, images, etc.) |
| **No bulk actions** | 🟢 LOW | Pilih multiple items untuk batch publish/delete |
| **No sorting in table** | 🟢 LOW | Kolom tabel tidak bisa diklik untuk sort |
| **No export/import** | 🟢 LOW | Export CSV untuk data analisis |

### 🚀 UX Improvements (No Design Change)

1. **Add confirmation before delete**:
   ```typescript
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   
   // Modal sederhana
   {showDeleteModal && (
     <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
       <div className="bg-white p-6 rounded-lg">
         <p>Hapus data ini? Tindakan ini tidak bisa dibatalkan.</p>
         <button onClick={handleDelete}>Ya, Hapus</button>
         <button onClick={() => setShowDeleteModal(false)}>Batal</button>
       </div>
     </div>
   )}
   ```

2. **Add auto-save draft**:
   ```typescript
   useEffect(() => {
     const timer = setTimeout(() => {
       if (formData.name) {
         localStorage.setItem(`draft-car-${car?.id || 'new'}`, JSON.stringify(formData));
       }
     }, 30000);
     return () => clearTimeout(timer);
   }, [formData]);
   ```

3. **Improve error feedback**:
   ```typescript
   // Current: generic error
   setError("Terjadi kesalahan");
   
   // Better: specific error
   if (response.status === 409) {
     setError("Slug sudah digunakan. Silakan gunakan slug lain.");
   } else if (response.status === 413) {
     setError("File terlalu besar. Maksimal 5MB.");
   }
   ```

---

## 6. SCALABILITY & MAINTAINABILITY

### SQLite Bottleneck (CRITICAL)

| Concern | Detail |
|---------|--------|
| **Concurrent writes** | SQLite tidak handle concurrent writes dengan baik. Jika 5 admin save bersamaan → `SQL_BUSY` error |
| **Data size limit** | SQLite optimal untuk < 100MB. Jika ribuan artikel + images → performa drop drastis |
| **No replication** | Tidak bisa horizontal scaling. Semua traffic ke 1 file database |

### Scalability Assessment

| Skenario | Ready? | Notes |
|----------|--------|-------|
| 1000+ articles | ❌ | No pagination, no search, full table scan |
| 50+ dealers | ⚠️ | Indexes help, but no pagination |
| 10+ admin users | ❌ | SQLite concurrent write bottleneck |
| 100K+ monthly visitors | ⚠️ | ISR + caching sudah baik, tapi SQLite jadi bottleneck |
| Multi-language content | ❌ | No i18n support in schema |
| Media CDN | ❌ | Images disimpan di `public/figma/` (local filesystem) |

### 🚀 Scalability Roadmap

**Short term (1-2 weeks):**
1. ✅ Add indexes (done)
2. ⬜ Add pagination ke semua list pages
3. ⬜ Tambah search/filter
4. ⬜ Optimasi dashboard queries (single query)

**Medium term (1-2 months):**
5. ⬜ Migrate PostgreSQL
6. ⬜ Cloud storage (S3/Cloudinary) untuk media
7. ⬜ Redis caching untuk API
8. ⬜ Implement soft delete

**Long term (3-6 months):**
9. ⬜ RBAC granular (super admin, content manager, sales)
10. ⬜ Activity log + audit trail
11. ⬜ i18n support
12. ⬜ WYSIWYG editor
13. ⬜ Bulk operations

---

## 7. ENTERPRISE READINESS CHECKLIST

### Tim Marketing
| Kriteria | Ready? | Notes |
|----------|--------|-------|
| Scheduling content | ⚠️ | Field ada, cron belum |
| SEO metadata | ✅ | Sudah ada model SEOMetadata |
| Social media preview (OG) | ✅ | Ada di root layout |
| Analytics | ❌ | Belum terintegrasi Google Analytics / similar |
| A/B testing | ❌ | Tidak support |

### Tim Content
| Kriteria | Ready? | Notes |
|----------|--------|-------|
| Rich text editor | ❌ | Plain `<textarea>` |
| Image upload | ✅ | Media management ada |
| Draft management | ⚠️ | Manual save, no auto-save |
| Preview before publish | ❌ | Tidak ada |
| Version history | ❌ | Tidak support |
| Bulk publish | ❌ | Tidak ada |

### Tim Sales
| Kriteria | Ready? | Notes |
|----------|--------|-------|
| Dealer management | ✅ | CRUD + image + maps |
| Promotion management | ✅ | CRUD + scheduling |
| Booking management | ❌ | No bookings dashboard |
| WhatsApp integration | ✅ | WhatsApp button |

### Production Environment
| Kriteria | Ready? | Notes |
|----------|--------|-------|
| Error monitoring | ❌ | No Sentry / error tracking |
| Logging | ⚠️ | Hanya `console.error` |
| CI/CD | ✅ | Workflows sudah ada |
| Backup strategy | ❌ | No database backup |
| Rate limiting | ⚠️ | Partial (baru beberapa route) |
| HTTPS | ⚠️ | Tergantung deployment |
| Environment separation | ✅ | `.env` configuration |

---

## 🔴 CRITICAL ISSUES (Harus diperbaiki segera)

| # | Issue | Priority | Estimasi |
|---|-------|----------|----------|
| 1 | **CSRF protection** untuk semua API mutasi | 🔴 CRITICAL | 1 hari |
| 2 | **Middleware protect dashboard routes** | 🔴 CRITICAL | 2 jam |
| 3 | **File upload validation** (type + size limit) | 🔴 CRITICAL | 1 hari |
| 4 | **Generate production AUTH_SECRET** | 🔴 CRITICAL | 5 menit |
| 5 | **SQLite → PostgreSQL migration plan** | 🔴 CRITICAL | 1 minggu |

## 🟡 HIGH PRIORITY

| # | Issue | Estimasi |
|---|-------|----------|
| 6 | Add pagination ke semua list pages | 2 hari |
| 7 | Add search/filter | 1 hari |
| 8 | Add soft delete | 1 hari |
| 9 | Delete confirmation modal | 1 hari |
| 10 | Optimasi dashboard queries | 4 jam |
| 11 | Article scheduling cron | 1 hari |
| 12 | Auto-save draft | 1 hari |

## 🟢 MEDIUM PRIORITY

| # | Issue | Estimasi |
|---|-------|----------|
| 13 | Rich text editor untuk articles | 2 hari |
| 14 | Preview before publish | 2 hari |
| 15 | Error monitoring (Sentry) | 1 hari |
| 16 | Database backup automation | 4 jam |
| 17 | Export CSV | 1 hari |
| 18 | Sorting in tables | 1 hari |

## ⚪ LOW PRIORITY

| # | Issue | Estimasi |
|---|-------|----------|
| 19 | i18n support | 1 minggu |
| 20 | RBAC granular | 3 hari |
| 21 | Activity log audit trail | 2 hari |
| 22 | WYSIWYG editor | 1 minggu |
| 23 | Bulk operations | 2 hari |
| 24 | Version history | 1 minggu |

## ⚡ QUICK WINS (< 3 hari)

| # | Issue | Time |
|---|-------|------|
| 1 | Middleware dashboard protection | 2 jam |
| 2 | Generate AUTH_SECRET | 5 menit |
| 3 | File upload validation | 4 jam |
| 4 | Dashboard query optimization | 4 jam |
| 5 | Search/filter | 1 hari |
| 6 | Delete confirmation modal | 1 hari |
| 7 | Auto-save draft | 4 jam |

## 📈 LONG TERM ROADMAP (6 bulan)

**Bulan 1: Foundation**
- Migrate PostgreSQL
- Pagination + search
- Soft delete + validation
- CSRF + security hardening

**Bulan 2: Content Experience**
- Rich text editor
- Preview + auto-save
- Scheduled publishing
- Bulk operations

**Bulan 3: Analytics & Monitoring**
- Sentry error tracking
- Google Analytics
- Database backup
- Activity log

**Bulan 4: Advanced Features**
- RBAC granular
- i18n multi language
- Export/import CSV
- Version history

**Bulan 5: Scaling**
- Redis caching
- CDN for media
- Load testing
- Performance optimization

**Bulan 6: Enterprise**
- Audit trail complete
- Compliance check
- Disaster recovery
- 99.9% uptime target

---

## Kesimpulan

CMS ini **cukup baik untuk tahap development/MVP** dengan skor **6.5/10**. 
Namun **belum production-ready** karena:

1. **SQLite** menjadi bottleneck utama untuk multi-user
2. **Keamanan perlu hardening** (CSRF, middleware, upload)
3. **UX admin perlu improvement** (pagination, search, preview, auto-save)
4. **Data integrity risk** (no soft delete, no scheduled publish)

**Rekomendasi**: 
- Target production minimum → selesaikan 5 CRITICAL + 5 HIGH PRIORITY issues (estimasi: 2-3 minggu)
- Target enterprise → full roadmap 6 bulan

**Jika tidak diperbaiki**: Website berisiko data loss, security breach, dan performance degradation saat traffic/scaling naik.