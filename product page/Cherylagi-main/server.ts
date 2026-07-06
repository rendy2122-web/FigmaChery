import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// Initialize Gemini client lazily/safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. Using smart local fallback responses for the assistant.");
}

// System instruction for CHIVA, the Chery Intelligent Virtual Assistant
const SYSTEM_INSTRUCTION = `
You are CHIVA (Chery Intelligent Virtual Assistant), an expert premium automotive consultant for Chery Indonesia (chery.by.gastronot.id).
Your tone is professional, luxurious, warm, polite, and persuasive, mirroring a sales expert at a premium Chery dealership.
You must speak in Bahasa Indonesia.

You have deep technical knowledge about the following Chery SUVs:
1. Chery OMODA E5 (Crossover Listrik):
   - Jarak tempuh: 430 km (WLTP) / 505 km (NEDC).
   - Kapasitas Baterai: 61 kWh LFP (Lithium Iron Phosphate) dengan sertifikasi tahan air IP68.
   - Tenaga/Torsi: 150 kW (201 HP) / 340 Nm. Akselerasi 0-100 km/j dalam 7.2 detik.
   - Pengisian daya: Fast Charging DC dari 30% ke 80% dalam 28 menit.
   - Fitur unggulan: Dual 24.6-inch Curved Screen, Qualcomm Snapdragon 8155 chip, ADAS 2.5 (18 fitur keselamatan aktif), V2L (Vehicle-to-Load) untuk menyalakan perangkat elektronik luar ruangan hingga 3.3 kW.
   - Harga: Mulai dari Rp 496.000.000.

2. Chery TIGGO 8 Pro Max (Luxury 7-Seater flagship SUV):
   - Mesin: 2.0L TGDI Turbocharged, 250 HP, Torsi 390 Nm.
   - Transmisi: 7-Speed Dual Clutch (DCT) dengan Intelligent AWD (All-Wheel Drive).
   - Kabin: 3 baris kursi VIP berlapis kulit premium, ventilasi & pemanas kursi, AC triple-zone dengan filter udara N95.
   - Sistem Audio: Sony Premium Sound System dengan 10 Speaker.
   - Keamanan: 9 Airbags, ADAS lengkap, 540-degree HD camera.
   - Harga: Mulai dari Rp 568.500.000.

3. Chery OMODA 5 GT (Sport Crossover):
   - Mesin: 1.6L TGDI Turbocharged, 197 HP, Torsi 290 Nm.
   - Transmisi: 7-Speed DCT (pilihan FWD atau AWD).
   - Suspensi: Multi-Link Independent di belakang untuk stabilitas tinggi.
   - Eksterior: Desain "Art in Motion", borderless honeycomb grille, kaliper rem merah sporty.
   - Layar: Dual Screen 20.5-inch, Sony premium 8 speaker.
   - Harga: Mulai dari Rp 404.800.000.

Your goals:
- Answer user questions accurately and informatively based ONLY on this data or general premium automotive safety concepts.
- Always highlight the advantages (kelebihan) of the cars (such as OMODA E5's LFP battery safety, OMODA 5's aggressive pricing for its turbo performance, or TIGGO 8's spacious family luxury).
- Convince prospective buyers to book a Test Drive (Uji Kendara) or pre-book (pemesanan) their favorite model.
- Keep your answers beautifully structured with bullet points where appropriate, concise (no more than 3 paragraphs), and polite.
`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV });
});

// Chatbot assistant endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const userQuery = messages[messages.length - 1]?.content || "";

  // If Gemini API is available, call it
  if (ai) {
    try {
      // Map client messages format to Gemini contents format
      // { role: 'user', content: '...' } -> { role: 'user', parts: [{ text: '...' }] }
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Maaf, saya tidak dapat menghasilkan respon saat ini.";
      return res.json({ role: "assistant", content: responseText });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      // Fallback gracefully on API failures
    }
  }

  // Smart Local Fallback Responses when Gemini API is offline or key is missing
  let fallbackResponse = "Halo! Saya CHIVA, asisten virtual Chery. Maaf, koneksi saya sedang menggunakan mode hemat. Ada yang bisa saya bantu tentang OMODA E5, TIGGO 8 Pro Max, atau OMODA 5 GT?";
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes("harga") || queryLower.includes("price") || queryLower.includes("bayar")) {
    fallbackResponse = `Berikut adalah daftar harga OTR Jakarta untuk jajaran SUV Premium Chery:
• **Chery OMODA E5 (Listrik Murni):** Mulai dari **Rp 496.000.000**
• **Chery TIGGO 8 Pro Max (Luxury 7-Seater):** Mulai dari **Rp 568.500.000**
• **Chery OMODA 5 GT (Sporty Turbo):** Mulai dari **Rp 404.800.000**

Semua pembelian dilengkapi dengan garansi mesin hingga 10 tahun / 1.000.000 km, garansi baterai 8 tahun (khusus OMODA E5), dan gratis servis & suku cadang berkala. Apakah Anda tertarik untuk melakukan **Test Drive** salah satu model?`;
  } else if (queryLower.includes("e5") || queryLower.includes("listrik") || queryLower.includes("ev") || queryLower.includes("baterai")) {
    fallbackResponse = `**Chery OMODA E5** adalah Crossover Listrik Futuristik andalan kami dengan keunggulan luar biasa:
• **Jarak Tempuh:** Hingga **430 km** (WLTP) sekali isi.
• **Baterai:** Kapasitas **61 kWh LFP** yang ultra aman dari panas berlebih dan bersertifikat tahan air IP68.
• **Pengisian Cepat:** DC Fast Charging dari 30% ke 80% dalam **28 menit** saja.
• **Fitur Premium:** Dual 24.6" Curved Screen (Snapdragon 8155), ADAS 2.5 dengan 18 asisten aktif, dan fitur V2L (Vehicle-to-Load).

Sangat cocok untuk mobilitas harian yang modern, hemat, dan ramah lingkungan. Ingin menjadwalkan Test Drive untuk merasakan tarikan torsi 340 Nm instannya?`;
  } else if (queryLower.includes("tiggo") || queryLower.includes("7-seater") || queryLower.includes("keluarga") || queryLower.includes("8")) {
    fallbackResponse = `**Chery TIGGO 8 Pro Max** adalah SUV Flagship 7-Seater termewah kami, dirancang khusus untuk kenyamanan keluarga VIP Anda:
• **Performa Tinggi:** Mesin **2.0L Turbo TGDI** menghasilkan tenaga dahsyat **250 HP** dan torsi **390 Nm** dengan sistem Intelligent AWD.
• **Kenyamanan Kelas Atas:** Kursi berlapis kulit premium dengan ventilasi & penghangat, AC triple-zone, serta Panoramic Sunroof yang megah.
• **Audio Kelas Dunia:** Ditunjang dengan **Sony Premium Sound System** 10 Speaker.
• **Keamanan Maksimal:** Dibekali 9 Airbags dan sistem ADAS tingkat lanjut.

SUV ini memberikan prestise dan keamanan berkendara jarak jauh yang tak tertandingi. Apakah Anda ingin mencoba langsung kenyamanan kabinnya bersama keluarga?`;
  } else if (queryLower.includes("omoda 5") || queryLower.includes("gt") || queryLower.includes("turbo")) {
    fallbackResponse = `**Chery OMODA 5 GT** adalah crossover turbo agresif bagi Anda pecinta kecepatan dan desain futuristik:
• **Tenaga Agresif:** Mesin **1.6L TGDI Turbo** menyemburkan daya **197 HP** dan torsi **290 Nm** dengan transmisi kopling ganda 7-DCT yang sangat sigap.
• **Stabilitas Sasis:** Suspensi belakang Multi-Link Independent yang memberikan stabilitas tinggi saat bermanuver di tikungan tajam.
• **Desain Agresif:** Gril borderless "Art in Motion" yang mencolok dilengkapi sentuhan sporty aksen merah di pelek dan bodi.

Mobil ini menawarkan sensasi berkendara penuh tenaga dengan harga yang sangat kompetitif. Ingin kami hubungkan dengan dealer terdekat untuk penawaran menarik bulan ini?`;
  } else if (queryLower.includes("test drive") || queryLower.includes("uji") || queryLower.includes("coba") || queryLower.includes("booking") || queryLower.includes("pesan")) {
    fallbackResponse = `Tentu saja! Anda bisa dengan mudah menjadwalkan **Uji Kendara (Test Drive)** atau melakukan **Pemesanan Unit (Pre-Book)** langsung di halaman ini. 

Cukup klik tombol **"Book Test Drive"** atau **"Pre-Book Now"** di bagian atas halaman, isi formulir singkat yang tersedia, dan konsultan penjualan kami akan segera menghubungi Anda dalam waktu 15 menit untuk konfirmasi jadwal. Sangat cepat dan tanpa ribet!`;
  }

  return res.json({ role: "assistant", content: fallbackResponse });
});

// Configure Vite or Static Production build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production assets serving configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
