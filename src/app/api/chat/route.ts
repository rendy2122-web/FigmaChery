import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1]?.content || "";
    const query = lastMessage.toLowerCase();

    // Fetch all active cars from the database
    const cars = db.prepare("SELECT * FROM cars WHERE deleted_at IS NULL AND status = 'published'").all() as any[];

    let reply = "";

    // 1. Comparison query (e.g. banding, vs, komparasi)
    if (query.includes("banding") || query.includes("vs") || query.includes("komparasi")) {
      const matchedCars = cars.filter(c => 
        query.includes(c.name.toLowerCase()) || 
        query.includes(c.slug.replace(/-/g, " "))
      );

      if (matchedCars.length >= 2) {
        const carA = matchedCars[0];
        const carB = matchedCars[1];
        
        const formatPrice = (val: string) => {
          if (!val) return "-";
          return val.includes(".") ? `Rp ${val}` : `Rp ${parseInt(val).toLocaleString("id-ID")}`;
        };

        reply = `Berikut adalah perbandingan ringkas antara **${carA.name}** dan **${carB.name}** dari database terbaru kami:\n\n` +
          `• **Kategori / Tipe**: ${carA.subtitle || "-"} (${carA.type}) vs ${carB.subtitle || "-"} (${carB.type})\n` +
          `• **Harga OTR Spesial**: ${formatPrice(carA.price_from)} vs ${formatPrice(carB.price_from)}\n` +
          `• **Deskripsi Ringkas**:\n` +
          `  - *${carA.name}*: ${carA.description ? carA.description.substring(0, 120) + "..." : "-"}\n` +
          `  - *${carB.name}*: ${carB.description ? carB.description.substring(0, 120) + "..." : "-"}\n\n` +
          `Untuk membandingkan spesifikasi teknis (sasis, mesin, ADAS, baterai) yang lebih lengkap dan interaktif, Anda dapat menggunakan modul **Komparasi Spesifikasi Interaktif** di halaman produk ini!`;
      } else {
        // Find E5 and J6 as default samples
        const omodaE5 = cars.find(c => c.name.toLowerCase().includes("e5")) || cars[1] || cars[0];
        const cheryQ = cars.find(c => c.name.toLowerCase().includes("q")) || cars[0];
        
        const formatPrice = (val: string) => {
          if (!val) return "-";
          return val.includes(".") ? `Rp ${val}` : `Rp ${parseInt(val).toLocaleString("id-ID")}`;
        };

        reply = `Anda dapat membandingkan berbagai tipe mobil Chery. Sebagai contoh, perbandingan tipe mobil listrik (BEV) terpopuler kami:\n\n` +
          `• **${cheryQ.name}** (${cheryQ.subtitle}): Mulai dari ${formatPrice(cheryQ.price_from)}\n` +
          `• **${omodaE5.name}** (${omodaE5.subtitle}): Mulai dari ${formatPrice(omodaE5.price_from)}\n\n` +
          `Silakan gunakan modul **Komparasi Spesifikasi Interaktif** di halaman ini untuk membandingkan spesifikasi sasis, mesin, dan roda secara detail!`;
      }
    } 
    // 2. Price query (e.g. harga, price, berapa, otr)
    else if (query.includes("harga") || query.includes("price") || query.includes("berapa") || query.includes("otr")) {
      const formatPrice = (val: string) => {
        if (!val) return "-";
        return val.includes(".") ? `Rp ${val}` : `Rp ${parseInt(val).toLocaleString("id-ID")}`;
      };

      const carLines = cars
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(c => `• **${c.name}** (${c.type}): Mulai dari ${formatPrice(c.price_from)}`)
        .join("\n");

      reply = `Berikut adalah daftar lengkap harga OTR spesial lineup kendaraan Chery ter-update di database kami:\n\n${carLines}\n\n*Harga OTR dapat berubah sewaktu-waktu. Anda juga bisa mengklik tombol **Simulasi Kredit** di bagian navbar atas untuk menghitung simulasi angsuran cicilan bulanan!*`;
    }
    // 3. Test Drive booking query
    else if (query.includes("test") || query.includes("drive") || query.includes("booking") || query.includes("coba") || query.includes("pesan")) {
      reply = `Tentu! Untuk menjadwalkan **Test Drive** secara gratis untuk mobil Chery pilihan Anda, silakan klik tombol merah **Book Test Drive** di bagian atas navbar, atau isi formulir di bagian bawah halaman detail produk. Tim sales kami akan segera menghubungi Anda untuk konfirmasi jadwal!`;
    }
    // 4. EV / Battery / LFP / CSH query
    else if (query.includes("ev") || query.includes("listrik") || query.includes("baterai") || query.includes("lfp") || query.includes("hybrid")) {
      const evCars = cars.filter(c => c.type === "BEV" || c.type === "CSH");
      const evList = evCars.map(c => `• **${c.name}** (${c.type}): ${c.subtitle || "-"}`).join("\n");
      reply = `Chery menawarkan teknologi energi terbarukan kelas dunia baik Electric (BEV) maupun Charged Sustainable Hybrid (CSH):\n\n${evList}\n\nSalah satu model unggulan listrik kami adalah **OMODA E5** dengan baterai 61 kWh LFP aman rendaman air IP68 dan memiliki jarak tempuh mencapai **430 km** (WLTP)!`;
    }
    // 5. Default General Response (welcomes the user and lists all updated cars)
    else {
      const carNames = cars.map(c => `• **${c.name}** (${c.type})`).join("\n");
      reply = `Halo! Saya **CHIVA** (Chery Intelligent Virtual Assistant).\n\nAda yang bisa saya bantu mengenai lineup mobil Chery ter-update kami di database?\n\n${carNames}\n\nSilakan tanyakan kepada saya mengenai **harga**, **perbandingan spesifikasi**, atau **cara menjadwalkan test drive**!`;
    }

    return NextResponse.json({ content: reply });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 550 });
  }
}
