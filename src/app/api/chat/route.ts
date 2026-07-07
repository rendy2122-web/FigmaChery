import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCarWithDetailsById } from "@/lib/data/cars";
import { getActiveDealers } from "@/lib/data/dealers";
import { getPublishedFaqs, type Faq } from "@/lib/data/faqs";

export const dynamic = "force-dynamic";

interface CarDbRow {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  price_from: string | null;
  type: string;
  status: string;
  sort_order: number;
}

function formatPrice(val: string | null): string {
  if (!val) return "-";
  return val.includes(".") ? `Rp ${val}` : `Rp ${parseInt(val).toLocaleString("id-ID")}`;
}

function findMentionedCars(cars: CarDbRow[], query: string): CarDbRow[] {
  return cars.filter(
    (c) => query.includes(c.name.toLowerCase()) || query.includes(c.slug.replace(/-/g, " "))
  );
}

// Words too common in Indonesian questions to be useful for FAQ matching.
const STOPWORDS = new Set([
  "apa", "apakah", "yang", "untuk", "dengan", "dari", "dan", "atau", "bisa",
  "saja", "adalah", "ini", "itu", "saya", "anda", "kami", "kita", "mana",
  "berapa", "lama", "cara", "bagaimana", "gimana", "dong", "kah", "ada",
  "akan", "dapat", "juga",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/** Simple keyword-overlap FAQ matcher — needs 2+ shared significant words to fire. */
function findBestFaqMatch(faqs: Faq[], query: string): Faq | null {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return null;

  let best: Faq | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const overlap = tokenize(faq.question).filter((t) => queryTokens.has(t)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      best = faq;
    }
  }

  return bestScore >= 2 ? best : null;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1]?.content || "";
    const query = lastMessage.toLowerCase();

    const cars = db
      .prepare("SELECT * FROM cars WHERE deleted_at IS NULL AND status = 'published'")
      .all() as CarDbRow[];

    let reply = "";
    // High buying-intent replies (dealer, single-car detail, price, test drive)
    // set this so the client can proactively offer to connect the user to sales.
    let suggestLead = false;
    let carInterest: string | null = null;
    const matchedCars = findMentionedCars(cars, query);
    const isComparisonQuery =
      query.includes("banding") || query.includes("vs") || query.includes("komparasi");

    // 1. Comparison query — two or more models named, or explicit comparison wording
    if (isComparisonQuery || matchedCars.length >= 2) {
      if (matchedCars.length >= 2) {
        const carA = matchedCars[0];
        const carB = matchedCars[1];

        reply = `Berikut adalah perbandingan ringkas antara **${carA.name}** dan **${carB.name}** dari database terbaru kami:\n\n` +
          `• **Kategori / Tipe**: ${carA.subtitle || "-"} (${carA.type}) vs ${carB.subtitle || "-"} (${carB.type})\n` +
          `• **Harga OTR Spesial**: ${formatPrice(carA.price_from)} vs ${formatPrice(carB.price_from)}\n` +
          `• **Deskripsi Ringkas**:\n` +
          `  - *${carA.name}*: ${carA.description ? carA.description.substring(0, 120) + "..." : "-"}\n` +
          `  - *${carB.name}*: ${carB.description ? carB.description.substring(0, 120) + "..." : "-"}\n\n` +
          `Untuk membandingkan spesifikasi teknis (sasis, mesin, ADAS, baterai) yang lebih lengkap dan interaktif, Anda dapat menggunakan modul **Komparasi Spesifikasi Interaktif** di halaman produk ini!`;
      } else {
        const omodaE5 = cars.find((c) => c.name.toLowerCase().includes("e5")) || cars[1] || cars[0];
        const cheryQ = cars.find((c) => c.name.toLowerCase().includes("q")) || cars[0];

        reply = `Anda dapat membandingkan berbagai tipe mobil Chery. Sebagai contoh, perbandingan tipe mobil listrik (BEV) terpopuler kami:\n\n` +
          `• **${cheryQ.name}** (${cheryQ.subtitle}): Mulai dari ${formatPrice(cheryQ.price_from)}\n` +
          `• **${omodaE5.name}** (${omodaE5.subtitle}): Mulai dari ${formatPrice(omodaE5.price_from)}\n\n` +
          `Silakan gunakan modul **Komparasi Spesifikasi Interaktif** di halaman ini untuk membandingkan spesifikasi sasis, mesin, dan roda secara detail!`;
      }
    }
    // 2. Dealer / location query
    else if (
      query.includes("dealer") ||
      query.includes("lokasi") ||
      query.includes("alamat") ||
      query.includes("cabang") ||
      query.includes("showroom") ||
      query.includes("kota")
    ) {
      const dealers = getActiveDealers();
      if (dealers.length > 0) {
        const dealerLines = dealers
          .map((d) => `• **${d.name}** (${d.city})\n  ${d.address}\n  Telp/WA: ${d.phone}`)
          .join("\n\n");
        reply = `Berikut daftar dealer resmi Chery Indonesia yang tersedia saat ini:\n\n${dealerLines}\n\nAnda dapat langsung mengunjungi salah satu dealer terdekat atau menjadwalkan test drive melalui tombol **Book Test Drive**!`;
        suggestLead = true;
      } else {
        reply = `Saat ini informasi dealer sedang diperbarui. Silakan hubungi tim sales kami melalui tombol WhatsApp untuk info dealer terdekat.`;
      }
    }
    // 3. Single specific car mentioned — give a focused detail answer (specs, features, price, colors)
    else if (matchedCars.length === 1) {
      const car = matchedCars[0];
      const details = getCarWithDetailsById(car.id);
      suggestLead = true;
      carInterest = car.name;

      if (details) {
        const keySpecs = details.specs.slice(0, 5);
        const specLines = keySpecs.map((s) => `• **${s.label}**: ${s.value}`).join("\n");

        const topFeatures = details.features.slice(0, 3);
        const featureLines = topFeatures
          .map((f) => `• **${f.title}**${f.description ? ` — ${f.description}` : ""}`)
          .join("\n");

        const colorNames = [
          ...new Set(details.images.filter((i) => i.color_name).map((i) => i.color_name)),
        ];
        const colorLine =
          colorNames.length > 0 ? `\n\n**Pilihan Warna**: ${colorNames.join(", ")}` : "";

        reply = `**${car.name}** — ${car.subtitle || car.type}\n\n` +
          `**Harga OTR Spesial**: Mulai dari ${formatPrice(car.price_from)}\n\n` +
          (specLines ? `**Spesifikasi Utama**:\n${specLines}\n\n` : "") +
          (featureLines ? `**Keunggulan**:\n${featureLines}` : "") +
          colorLine +
          `\n\nLihat detail lengkap dan galeri foto di halaman **/models/${car.slug}**, atau klik **Book Test Drive** untuk mencobanya langsung!`;
      } else {
        reply = `**${car.name}** — ${car.subtitle || car.type}. Harga mulai dari ${formatPrice(car.price_from)}. Kunjungi halaman **/models/${car.slug}** untuk detail lengkap!`;
      }
    }
    // 4. Price query (general, no specific car named)
    else if (
      query.includes("harga") ||
      query.includes("price") ||
      query.includes("otr") ||
      query.includes("biaya") ||
      query.includes("cicilan") ||
      query.includes("kredit")
    ) {
      const carLines = cars
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((c) => `• **${c.name}** (${c.type}): Mulai dari ${formatPrice(c.price_from)}`)
        .join("\n");

      reply = `Berikut adalah daftar lengkap harga OTR spesial lineup kendaraan Chery ter-update di database kami:\n\n${carLines}\n\n*Harga OTR dapat berubah sewaktu-waktu. Anda juga bisa mengklik tombol **Simulasi Kredit** di bagian navbar atas untuk menghitung simulasi angsuran cicilan bulanan!*`;
      suggestLead = true;
    }
    // 5. Test Drive booking query
    else if (
      query.includes("test") ||
      query.includes("drive") ||
      query.includes("booking") ||
      query.includes("coba") ||
      query.includes("pesan")
    ) {
      reply = `Tentu! Untuk menjadwalkan **Test Drive** secara gratis untuk mobil Chery pilihan Anda, silakan klik tombol merah **Book Test Drive** di bagian atas navbar, atau isi formulir di bagian bawah halaman detail produk. Tim sales kami akan segera menghubungi Anda untuk konfirmasi jadwal!`;
      suggestLead = true;
    }
    // 6. EV / Battery / LFP / CSH query
    else if (
      query.includes("ev") ||
      query.includes("listrik") ||
      query.includes("baterai") ||
      query.includes("lfp") ||
      query.includes("hybrid") ||
      query.includes("ngecas") ||
      query.includes("charging")
    ) {
      const evCars = cars.filter((c) => c.type === "BEV" || c.type === "CSH");
      const evList = evCars.map((c) => `• **${c.name}** (${c.type}): ${c.subtitle || "-"}`).join("\n");
      reply = `Chery menawarkan teknologi energi terbarukan kelas dunia baik Electric (BEV) maupun Charged Sustainable Hybrid (CSH):\n\n${evList}\n\nSalah satu model unggulan listrik kami adalah **OMODA E5** dengan baterai 61 kWh LFP aman rendaman air IP68 dan memiliki jarak tempuh mencapai **430 km** (WLTP)!`;
    }
    // 7. Broad safety net — matches against curated FAQ content (garansi, trade-in,
    // servis berkala, waktu pengisian daya, beli online, dll.)
    else {
      const faqMatch = findBestFaqMatch(getPublishedFaqs(), query);
      if (faqMatch) {
        reply = `${faqMatch.answer}\n\n*Ada pertanyaan lain seputar mobil Chery? Saya siap membantu!*`;
      } else {
        // 8. Default — general welcome + capability menu
        const carNames = cars.map((c) => `• **${c.name}** (${c.type})`).join("\n");
        reply = `Halo! Saya **CHIVA** (Chery Intelligent Virtual Assistant).\n\nAda yang bisa saya bantu mengenai lineup mobil Chery ter-update kami di database?\n\n${carNames}\n\nSilakan tanyakan kepada saya mengenai **harga**, **spesifikasi & fitur per mobil**, **perbandingan model**, **lokasi dealer**, **garansi**, **trade-in**, atau **cara menjadwalkan test drive**!`;
      }
    }

    return NextResponse.json({ content: reply, suggestLead, carInterest });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
  }
}
