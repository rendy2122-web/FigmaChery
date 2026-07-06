import db from "./index";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, name, password, role)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run("user-1", "admin@chery.com", "Admin", hashedPassword, "admin");
  console.log("✓ Created admin user (email: admin@chery.com, password: admin123)");

  // Seed default categories
  const categoryStmt = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, slug, description)
    VALUES (?, ?, ?, ?)
  `);
  
  categoryStmt.run("cat-1", "News", "news", "Latest news and updates");
  categoryStmt.run("cat-2", "Events", "events", "Events and promotions");
  categoryStmt.run("cat-3", "Tips", "tips", "Tips and guides");
  categoryStmt.run("cat-4", "Press Release", "press-release", "Official press releases");
  categoryStmt.run("cat-5", "Technology", "technology", "Technology deep-dives");
  categoryStmt.run("cat-6", "Ownership Tips", "ownership-tips", "Maintenance and ownership guides");
  console.log("✓ Created default categories");

  // ────────────────────────────────────────────────────────
  // SEED ARTICLES — migrated from the previous static news-data.ts
  // so the public /news pages can be reconnected to the real CMS.
  // ────────────────────────────────────────────────────────
  console.log("  Clearing existing article data...");
  db.prepare("DELETE FROM articles").run();

  const articleStmt = db.prepare(`
    INSERT INTO articles (id, title, slug, excerpt, content, featured_image, category_id, status, published_at, author, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, 0)
  `);

  articleStmt.run(
    "sales-record",
    "Chery Indonesia Raih Pertumbuhan Penjualan Rekor Tertinggi Sepanjang Sejarah",
    "chery-indonesia-rekor-penjualan-tertinggi",
    "Chery Indonesia mencatat rekor penjualan tertinggi sepanjang sejarah dengan pertumbuhan signifikan sebesar 150% pada semester pertama ini.",
    [
      "Chery Indonesia mencatat pencapaian bersejarah dengan membukukan pertumbuhan penjualan sebesar 150% dibandingkan periode yang sama tahun lalu. Pencapaian ini menjadikan Chery sebagai salah satu merek yang tumbuh paling cepat di pasar otomotif nasional pada semester pertama tahun ini.",
      "Pertumbuhan ini didorong oleh kuatnya penerimaan pasar terhadap lini produk hybrid dan electric vehicle (EV) Chery, termasuk Tiggo Cross CSH, Tiggo 8 CSH, dan Chery Q yang terus menjadi favorit konsumen Indonesia yang mencari kendaraan efisien tanpa mengorbankan performa dan kenyamanan.",
      "\"Pencapaian ini adalah bukti nyata kepercayaan konsumen Indonesia terhadap kualitas dan inovasi yang kami hadirkan,\" ujar perwakilan manajemen Chery Indonesia. \"Kami akan terus memperluas jaringan dealer dan layanan purna jual agar semakin banyak masyarakat dapat merasakan pengalaman berkendara Chery.\"",
      "Selain pertumbuhan penjualan, Chery Indonesia juga mengumumkan penambahan lebih dari 20 titik dealer resmi baru yang tersebar di berbagai kota besar, termasuk Cibubur, Makassar, dan Pare-pare, guna memastikan aksesibilitas layanan yang lebih merata bagi pelanggan di seluruh Indonesia.",
      "Dengan momentum pertumbuhan ini, Chery Indonesia optimistis akan terus memperkuat posisinya sebagai salah satu pemain utama di industri otomotif nasional, khususnya di segmen kendaraan elektrifikasi yang semakin diminati oleh konsumen modern.",
    ].join("\n\n"),
    "/figma/article-1.png",
    "cat-4",
    "2026-06-15 09:00:00",
    "Chery Indonesia"
  );

  articleStmt.run(
    "shs-safety",
    "Mengenal Chery Safety Handling System (SHS): Inovasi Keamanan Standard Global",
    "mengenal-chery-safety-handling-system",
    "Pelajari bagaimana kecanggihan teknologi Chery SHS (Safety Handling System) memberikan perlindungan dan kestabilan berkendara maksimal di segala medan.",
    [
      "Keamanan berkendara adalah prioritas utama dalam setiap rekayasa kendaraan Chery. Salah satu inovasi unggulan yang tertanam di seluruh lini model adalah Chery Safety Handling System (SHS), sebuah sistem terintegrasi yang dirancang untuk menjaga stabilitas kendaraan dalam berbagai kondisi jalan.",
      "SHS menggabungkan sistem kontrol stabilitas elektronik, distribusi pengereman berbasis sensor real-time, dan struktur sasis dengan rigiditas tinggi. Kombinasi ini memungkinkan kendaraan tetap stabil saat bermanuver mendadak, melintasi jalan basah, maupun saat menikung pada kecepatan tinggi.",
      "Selain itu, SHS juga terintegrasi dengan Advanced Driver Assistance System (ADAS) yang mencakup fitur seperti Adaptive Cruise Control, Lane Keeping Assist, dan Automatic Emergency Braking, memberikan lapisan perlindungan tambahan bagi pengemudi dan penumpang.",
      "Seluruh kendaraan Chery yang dilengkapi SHS telah melalui pengujian tabrak internal yang ketat serta memenuhi standar keselamatan ASEAN NCAP, menegaskan komitmen Chery terhadap keselamatan berkendara kelas dunia.",
      "\"Kami percaya bahwa teknologi terbaik adalah teknologi yang melindungi penggunanya tanpa mereka sadari,\" jelas Tim Teknis Chery Indonesia. \"SHS bekerja secara senyap di balik layar, siap merespons dalam hitungan milidetik ketika dibutuhkan.\"",
    ].join("\n\n"),
    "/figma/article-2.png",
    "cat-5",
    "2026-06-10 09:00:00",
    "Tim Teknis"
  );

  articleStmt.run(
    "rainy-season-tips",
    "Panduan Lengkap Merawat Mobil Hybrid Chery Tetap Prima di Musim Hujan",
    "panduan-merawat-mobil-hybrid-musim-hujan",
    "Panduan praktis dan tips perawatan lengkap dari para ahli agar mesin hybrid Chery Anda tetap bekerja prima dan aman selama menghadapi musim hujan.",
    [
      "Musim hujan membawa tantangan tersendiri bagi perawatan kendaraan, termasuk mobil hybrid. Meski teknologi hybrid Chery telah dirancang dengan sertifikasi tahan air IP68 pada komponen baterai, perawatan rutin tetap penting untuk menjaga performa optimal.",
      "Pertama, pastikan area sekitar port pengisian daya dan komponen elektrikal selalu bersih dan kering. Hindari mencuci kendaraan dengan tekanan air tinggi secara langsung ke area tersebut, meskipun sudah memiliki sertifikasi tahan air.",
      "Kedua, periksa kondisi ban secara berkala. Musim hujan meningkatkan risiko aquaplaning, sehingga kedalaman alur ban dan tekanan udara yang sesuai menjadi krusial untuk menjaga traksi dan stabilitas kendaraan di jalan basah.",
      "Ketiga, jangan lupakan perawatan sistem rem dan wiper. Sistem pengereman regeneratif pada mobil hybrid bekerja secara berbeda dari mobil konvensional, sehingga pemeriksaan berkala oleh teknisi bersertifikasi Chery sangat dianjurkan untuk memastikan respons pengereman tetap optimal.",
      "Terakhir, manfaatkan layanan servis berkala di dealer resmi Chery terdekat. Tim teknisi kami menggunakan peralatan diagnostik khusus untuk memastikan seluruh sistem hybrid, termasuk baterai dan motor listrik, tetap dalam kondisi prima menghadapi segala cuaca.",
    ].join("\n\n"),
    "/figma/article-3.png",
    "cat-6",
    "2026-06-05 09:00:00",
    "Tim After Sales"
  );

  articleStmt.run(
    "ev-charging-network",
    "Chery Perluas Jaringan Pengisian Daya untuk Dukung Ekosistem Kendaraan Listrik",
    "ekspansi-jaringan-pengisian-daya-chery",
    "Chery Indonesia berkolaborasi dengan mitra strategis untuk memperluas jaringan stasiun pengisian daya di kota-kota besar demi mendukung adopsi kendaraan listrik.",
    [
      "Sebagai bagian dari komitmen mendukung ekosistem kendaraan listrik nasional, Chery Indonesia mengumumkan kemitraan strategis untuk memperluas jaringan stasiun pengisian daya (charging station) di berbagai kota besar di Indonesia.",
      "Kemitraan ini akan menghadirkan ratusan titik pengisian daya baru yang tersebar di area perkotaan, pusat perbelanjaan, dan jalur utama antar kota, memudahkan pemilik kendaraan listrik Chery untuk melakukan pengisian daya kapan pun dibutuhkan.",
      "\"Infrastruktur pengisian daya yang memadai adalah kunci untuk mempercepat adopsi kendaraan listrik di Indonesia,\" ujar manajemen Chery Indonesia. \"Kami berkomitmen untuk terus berinvestasi dalam ekosistem ini demi kenyamanan pelanggan kami.\"",
      "Selain memperluas jaringan fisik, Chery juga menghadirkan aplikasi pintar yang memungkinkan pengguna untuk mencari, memesan, dan memantau status pengisian daya secara real-time langsung dari perangkat mobile mereka.",
    ].join("\n\n"),
    "/figma/promo-1.png",
    "cat-1",
    "2026-05-28 09:00:00",
    "Chery Indonesia"
  );

  articleStmt.run(
    "test-drive-experience",
    "Rasakan Pengalaman Test Drive Eksklusif di Seluruh Dealer Chery",
    "pengalaman-test-drive-eksklusif-chery",
    "Chery Indonesia menghadirkan program test drive eksklusif yang memungkinkan calon pelanggan merasakan langsung performa dan kenyamanan setiap lini model.",
    [
      "Chery Indonesia kembali menghadirkan program test drive eksklusif di seluruh jaringan dealer resmi, memberikan kesempatan bagi calon pelanggan untuk merasakan langsung performa, kenyamanan, dan teknologi canggih dari setiap lini model Chery.",
      "Program ini mencakup seluruh rentang produk, mulai dari Chery Q yang lincah untuk perkotaan, hingga Tiggo 9 CSH yang mewah dan penuh teknologi untuk keluarga modern. Setiap sesi test drive didampingi oleh konsultan penjualan profesional yang siap menjelaskan detail fitur setiap kendaraan.",
      "Calon pelanggan dapat menjadwalkan sesi test drive secara mudah melalui website resmi atau langsung mengunjungi dealer terdekat. Tim Chery Indonesia berkomitmen untuk memastikan setiap pengalaman test drive berjalan nyaman dan informatif.",
      "\"Kami ingin setiap calon pelanggan merasakan sendiri kualitas Chery sebelum memutuskan untuk membeli,\" ujar Tim Marketing Chery Indonesia. \"Pengalaman langsung adalah cara terbaik untuk membuktikan komitmen kami terhadap kualitas.\"",
    ].join("\n\n"),
    "/figma/promo-2.png",
    "cat-2",
    "2026-05-20 09:00:00",
    "Tim Marketing"
  );

  articleStmt.run(
    "warranty-program",
    "Chery Perkenalkan Program Garansi Diperpanjang untuk Ketenangan Pelanggan",
    "program-garansi-diperpanjang-chery",
    "Program garansi diperpanjang hingga 10 tahun memberikan ketenangan pikiran ekstra bagi setiap pemilik kendaraan Chery di Indonesia.",
    [
      "Chery Indonesia memperkenalkan program garansi diperpanjang yang mencakup perlindungan mesin dan komponen utama hingga 10 tahun atau 1.000.000 kilometer, memberikan ketenangan pikiran ekstra bagi setiap pelanggan setia Chery.",
      "Program ini berlaku untuk seluruh lini produk, termasuk kendaraan hybrid dan listrik, dengan cakupan khusus untuk komponen baterai dan motor listrik yang menjadi jantung dari teknologi elektrifikasi Chery.",
      "\"Kami memahami bahwa membeli kendaraan adalah investasi jangka panjang,\" ujar Tim After Sales Chery Indonesia. \"Program garansi diperpanjang ini adalah wujud komitmen kami untuk mendampingi pelanggan sepanjang perjalanan kepemilikan kendaraan mereka.\"",
      "Pelanggan dapat mendaftarkan kendaraan mereka ke dalam program ini melalui dealer resmi Chery terdekat, dengan proses yang mudah dan tanpa biaya tambahan untuk pembelian kendaraan baru.",
    ].join("\n\n"),
    "/figma/promo-3.png",
    "cat-6",
    "2026-05-12 09:00:00",
    "Tim After Sales"
  );

  console.log("✓ Created 6 articles (migrated from static news data)");

  // Seed default dealers
  const dealerStmt = db.prepare(`
    INSERT OR IGNORE INTO dealers (id, name, city, address, phone, whatsapp, image, status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  dealerStmt.run("dealer-1", "Chery Cibubur", "Jakarta", "Jl. Alternatif Cibubur No.KM. 6, Nagrak, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16967", "+62 895 2707 2446", "6289527072446", "/figma/dealer-cibubur.png", "active", 1);
  dealerStmt.run("dealer-2", "Chery Makassar", "Sulawesi Selatan", "Makassar, Sulawesi Selatan", "+62 895 2707 2446", "6289527072446", "/figma/dealer-makassar.png", "active", 2);
  dealerStmt.run("dealer-3", "Chery Pare-pare", "Sulawesi Selatan", "Pare-pare, Sulawesi Selatan", "+62 895 2707 2446", "6289527072446", "/figma/dealer-parepare.png", "active", 3);
  console.log("✓ Created default dealers");

  // Seed default settings
  const settingStmt = db.prepare(`
    INSERT OR IGNORE INTO settings (id, key, value, type, "group")
    VALUES (?, ?, ?, ?, ?)
  `);
  
  settingStmt.run("setting-1", "site_name", "Chery Indonesia", "text", "general");
  settingStmt.run("setting-2", "site_description", "Experience the future of driving with Chery", "text", "general");
  settingStmt.run("setting-3", "contact_email", "sales@chery-cibubur.id", "text", "contact");
  settingStmt.run("setting-4", "contact_phone", "+62 895 2707 2446", "text", "contact");
  settingStmt.run("setting-5", "facebook_url", "https://facebook.com/cheryindonesia", "text", "social");
  settingStmt.run("setting-6", "instagram_url", "https://instagram.com/cheryindonesia", "text", "social");
  settingStmt.run("setting-7", "youtube_url", "https://youtube.com/cheryindonesia", "text", "social");
  settingStmt.run("setting-8", "operating_hours", "Senin - Sabtu, 08.00 - 17.00", "text", "contact");
  settingStmt.run(
    "setting-9",
    "showroom_address",
    "Jl. Alternatif Cibubur No.KM. 6, Nagrak, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16967",
    "text",
    "contact"
  );
  console.log("✓ Created default settings");

  // Delete existing data in correct order (respecting foreign keys)
  console.log("  Clearing existing car data...");
  db.prepare("DELETE FROM product_sections").run();
  db.prepare("DELETE FROM promotions").run();
  db.prepare("DELETE FROM car_features").run();
  db.prepare("DELETE FROM car_specs").run();
  db.prepare("DELETE FROM car_images").run();
  db.prepare("DELETE FROM cars").run();

  // ────────────────────────────────────────────────────────
  // SEED CARS — real Chery Indonesia lineup as of 2025-2026
  // Partitioned by: BEV, CSH, ICE
  // ────────────────────────────────────────────────────────
  const carStmt = db.prepare(`
    INSERT INTO cars (id, name, slug, subtitle, description, price_from, type, status, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // ===================== BEV =====================

  // 1. CHERY Q BEV
  carStmt.run("car-1", "CHERY Q", "chery-q", "ELECTRIC HATCHBACK", 
    "CHERY Q menghadirkan hatchback listrik modern yang stylish dan efisien untuk mobilitas perkotaan. Dengan desain kompak dan lincah, Chery Q menjadi solusi transportasi ramah lingkungan yang sempurna untuk generasi muda urban yang mengutamakan gaya dan kepraktisan.",
    "329.800.000", "BEV", "published", 1, 1);

  // 2. CHERY E5 BEV
  carStmt.run("car-2", "CHERY E5", "chery-e5", "ELECTRIC CROSSOVER",
    "CHERY E5 menghadirkan crossover listrik premium dengan desain elegan dan teknologi canggih. Diciptakan untuk profesional modern yang menginginkan kendaraan ramah lingkungan tanpa mengorbankan kenyamanan dan performa, dengan interior luas serta fitur keselamatan ADAS terkini.",
    "799.900.000", "BEV", "published", 1, 2);

  // 3. J6 BEV
  carStmt.run("car-3", "CHERY J6", "chery-j6", "ELECTRIC OFF-ROAD SUV",
    "CHERY J6 adalah SUV off-road listrik flagship dengan desain boxy futuristik yang memukau dan performa bertenaga. Diciptakan untuk petualang modern yang menginginkan perpaduan sempurna antara ketangguhan medan berat, teknologi baterai canggih, dan kesenyapan berkendara.",
    "739.900.000", "BEV", "published", 1, 3);

  // ===================== CSH (Charged Sustainable Hybrid) =====================

  // 4. CHERY C5 CSH
  carStmt.run("car-4", "CHERY C5 CSH", "chery-c5-csh", "PLUG-IN HYBRID CROSSOVER",
    "CHERY C5 CSH menghadirkan crossover hybrid elegan dengan teknologi plug-in hybrid yang efisien. Diciptakan untuk profesional urban yang menginginkan gaya premium tanpa mengorbankan efisiensi bahan bakar, menawarkan kombinasi sempurna antara performa tangguh dan ramah lingkungan.",
    "739.900.000", "CSH", "published", 1, 4);

  // 5. TIGGO 9 CSH
  carStmt.run("car-5", "TIGGO 9 CSH", "tiggo-9-csh", "PLUG-IN HYBRID 7-SEATER SUV",
    "TIGGO 9 CSH adalah SUV hybrid flagship yang menggabungkan kemewahan kelas atas dengan teknologi ramah lingkungan. Diciptakan untuk keluarga modern yang menginginkan kendaraan besar dengan efisiensi bahan bakar superior, kabin premium 7-seater, dan performa hybrid yang tangguh.",
    "849.900.000", "CSH", "published", 1, 5);

  // 6. TIGGO CROSS CSH
  carStmt.run("car-6", "TIGGO CROSS CSH", "tiggo-cross-csh", "PLUG-IN HYBRID CROSSOVER",
    "TIGGO CROSS CSH menghadirkan compact SUV hybrid dengan desain crossover modern dan teknologi hybrid cerdas. Diciptakan untuk keluarga muda yang aktif dan peduli lingkungan, menawarkan efisiensi bahan bakar maksimal, ruang kabin fleksibel, dan fitur keselamatan lengkap.",
    "429.900.000", "CSH", "published", 1, 6);

  // 7. TIGGO 8 CSH
  carStmt.run("car-7", "TIGGO 8 CSH", "tiggo-8-csh", "PLUG-IN HYBRID 7-SEATER SUV",
    "TIGGO 8 CSH adalah SUV hybrid 7-seater premium yang menggabungkan kenyamanan keluarga dengan teknologi hybrid terkini. Diciptakan untuk keluarga besar yang mengutamakan kemewahan dan kepraktisan, menawarkan kabin luas, fitur hiburan lengkap, dan efisiensi bahan bakar superior.",
    "668.500.000", "CSH", "published", 1, 7);

  // ===================== ICE (Internal Combustion Engine) =====================

  // 8. CHERY C5 ICE
  carStmt.run("car-8", "CHERY C5", "chery-c5", "PREMIUM CROSSOVER SUV",
    "CHERY C5 menghadirkan crossover bensin elegan dengan performa tangguh dan konsumsi bahan bakar irit. Diciptakan untuk keluarga modern yang menghargai kenyamanan berkendara dan keandalan mesin bensin konvensional, dengan desain premium dan fitur keselamatan lengkap.",
    "659.900.000", "ICE", "published", 1, 8);

  // 9. TIGGO CROSS SPORT
  carStmt.run("car-9", "TIGGO CROSS SPORT", "tiggo-cross-sport", "COMPACT SPORTY SUV",
    "TIGGO CROSS SPORT adalah varian sporty dari Tiggo Cross dengan tampilan lebih agresif dan dinamis. Diciptakan untuk pengendara muda yang menginginkan SUV crossover berkarakter sporty dengan performa mesin bensin bertenaga, desain modern, dan harga terjangkau.",
    "399.900.000", "ICE", "published", 1, 9);

  // 10. OMODA 5 GT
  carStmt.run("car-10", "OMODA 5 GT", "omoda-5-gt", "TURBO CROSSOVER SUV",
    "OMODA 5 GT menghadirkan crossover sporty dengan desain futuristik 'Art in Motion' yang agresif dan mesin 1.6L Turbocharged bertenaga 197 HP. Diciptakan bagi individu dinamis yang menginginkan gaya mencolok tanpa mengorbankan performa, dilengkapi suspensi Multi-Link dan asisten berkendara digital.",
    "404.800.000", "ICE", "published", 1, 10);

  // 11. TIGGO CROSS ICE
  carStmt.run("car-11", "TIGGO CROSS", "tiggo-cross", "COMPACT CROSSOVER SUV",
    "TIGGO CROSS adalah compact SUV bensin yang dirancang untuk mobilitas perkotaan yang praktis and efisien. Diciptakan bagi keluarga muda yang mencari SUV kompak dengan konsumsi bahan bakar irit, kabin yang luas, dan fitur keselamatan standar dengan harga bersahabat.",
    "329.800.000", "ICE", "published", 1, 11);

  // 12. TIGGO 8 ICE
  carStmt.run("car-12", "TIGGO 8", "tiggo-8", "7-SEATER FAMILY SUV",
    "TIGGO 8 adalah SUV 7-seater bensin premium dengan mesin bertenaga dan kabin mewah. Diciptakan untuk keluarga besar yang mengutamakan kenyamanan dan ruang luas, dilengkapi fitur keselamatan ADAS terkini, sistem hiburan canggih, dan desain eksterior yang berwibawa.",
    "568.500.000", "ICE", "published", 1, 12);

  // 13. TIGGO 8 PRO MAX ICE
  carStmt.run("car-13", "TIGGO 8 PRO MAX", "tiggo-8-pro-max", "FLAGSHIP 7-SEATER AWD SUV",
    "TIGGO 8 PRO MAX adalah SUV 7-seater flagship dengan mesin 2.0L Turbocharged bertenaga 250 HP dan AWD untuk ketangguhan di semua medan. Diciptakan bagi keluarga besar yang menginginkan kemewahan kelas VIP, menawarkan kabin spacious dengan 7 tempat duduk premium, sistem audio Sony 10 speaker, suspensi Comfort Plus, dan fitur keselamatan ADAS 9 airbags untuk perlindungan maksimal.",
    "585.500.000", "ICE", "published", 1, 13);

  console.log("✓ Created 13 cars — BEV: 3, CSH: 4, ICE: 6");

  // ────────────────────────────────────────────────────────
  // SEED CAR IMAGES
  // ────────────────────────────────────────────────────────
  const carImageStmt = db.prepare(`
    INSERT OR IGNORE INTO car_images (id, car_id, url, alt, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Main images (thumbnails)
  carImageStmt.run("car-img-1", "car-1", "/figma/car-q.png", "CHERY Q BEV", 1);
  carImageStmt.run("car-img-2", "car-2", "/figma/car-e5.png", "CHERY E5 BEV", 1);
  carImageStmt.run("car-img-3", "car-3", "/figma/car-j6.png", "CHERY J6 BEV", 1);
  carImageStmt.run("car-img-4", "car-4", "/figma/chery-c5-csh.webp", "CHERY C5 CSH", 1);
  carImageStmt.run("car-img-5", "car-5", "/figma/tiggo-9-csh.webp", "TIGGO 9 CSH", 1);
  carImageStmt.run("car-img-6", "car-6", "/figma/tiggo-cross-csh.webp", "TIGGO CROSS CSH", 1);
  carImageStmt.run("car-img-7", "car-7", "/figma/tiggo-8-csh.webp", "TIGGO 8 CSH", 1);
  carImageStmt.run("car-img-8", "car-8", "/figma/chery-c5.webp", "CHERY C5 ICE", 1);
  carImageStmt.run("car-img-9", "car-9", "/figma/tiggo-cross-sport.webp", "TIGGO CROSS SPORT", 1);
  carImageStmt.run("car-img-10", "car-10", "/figma/omoda-5-gt.webp", "OMODA 5 GT", 1);
  carImageStmt.run("car-img-11", "car-11", "/figma/tiggo-cross.webp", "TIGGO CROSS ICE", 1);
  carImageStmt.run("car-img-12", "car-12", "/figma/tiggo-8.webp", "TIGGO 8 ICE", 1);
  carImageStmt.run("car-img-13", "car-13", "/figma/tiggo-8-pro-max.webp", "TIGGO 8 PRO MAX", 1);
  console.log("✓ Created main car images");

  // ────────────────────────────────────────────────────────
  // SEED CAR COLOR VARIANT IMAGES — only 6 of 13 cars have real
  // distinct per-color product shots pulled from chery.co.id; the
  // rest intentionally have none (hero-section.tsx hides the color
  // picker for cars without real color_images rows).
  // ────────────────────────────────────────────────────────
  db.prepare("DELETE FROM car_images WHERE color_name IS NOT NULL").run();

  const colorImageStmt = db.prepare(`
    INSERT INTO car_images (id, car_id, url, alt, sort_order, color_name, color_hex)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const colorImages: [string, string, string, string, string][] = [
    // car-1 CHERY Q
    ["car-1", "/figma/cheryq-oat.png", "CHERY Q — Oat", "Oat", "#C9BFA3"],
    ["car-1", "/figma/cheryq-purple.png", "CHERY Q — Purple", "Purple", "#9B72B0"],
    ["car-1", "/figma/cheryq-white.png", "CHERY Q — White", "White", "#F2F2ED"],
    // car-2 CHERY E5
    ["car-2", "/figma/e5-black.png", "CHERY E5 — Black", "Black", "#141414"],
    ["car-2", "/figma/e5-green.png", "CHERY E5 — Green", "Green", "#2F4A3D"],
    ["car-2", "/figma/e5-grey.png", "CHERY E5 — Grey", "Grey", "#8A8D90"],
    ["car-2", "/figma/e5-white.png", "CHERY E5 — White", "White", "#F2F2ED"],
    ["car-2", "/figma/e5-white-twotone.png", "CHERY E5 — White Two-Tone", "White Two-Tone", "#E8E8E0"],
    // car-3 CHERY J6
    ["car-3", "/figma/j6-black.webp", "CHERY J6 — Black", "Black", "#141414"],
    ["car-3", "/figma/j6-green.webp", "CHERY J6 — Green", "Green", "#2F4A3D"],
    ["car-3", "/figma/j6-grey.webp", "CHERY J6 — Grey", "Grey", "#8A8D90"],
    ["car-3", "/figma/j6-white.webp", "CHERY J6 — White", "White", "#F2F2ED"],
    // car-4 CHERY C5 CSH
    ["car-4", "/figma/c5csh-black.webp", "CHERY C5 CSH — Black", "Black", "#141414"],
    ["car-4", "/figma/c5csh-red.webp", "CHERY C5 CSH — Red", "Red", "#B91C2C"],
    ["car-4", "/figma/c5csh-white.webp", "CHERY C5 CSH — White", "White", "#F2F2ED"],
    ["car-4", "/figma/c5csh-white-twotone.webp", "CHERY C5 CSH — White Two-Tone", "White Two-Tone", "#E8E8E0"],
    // car-5 TIGGO 9 CSH
    ["car-5", "/figma/t9csh-black.png", "TIGGO 9 CSH — Black", "Black", "#141414"],
    ["car-5", "/figma/t9csh-green.png", "TIGGO 9 CSH — Green", "Green", "#1F3D2E"],
    ["car-5", "/figma/t9csh-grey.png", "TIGGO 9 CSH — Grey", "Grey", "#8A8D90"],
    ["car-5", "/figma/t9csh-white.png", "TIGGO 9 CSH — White", "White", "#F2F2ED"],
    // car-7 TIGGO 8 CSH
    ["car-7", "/figma/t8csh-black.png", "TIGGO 8 CSH — Black", "Black", "#141414"],
    ["car-7", "/figma/t8csh-green.png", "TIGGO 8 CSH — Green", "Green", "#1F3D2E"],
    ["car-7", "/figma/t8csh-grey.png", "TIGGO 8 CSH — Grey", "Grey", "#8A8D90"],
    ["car-7", "/figma/t8csh-white.png", "TIGGO 8 CSH — White", "White", "#F2F2ED"],
    // car-6 TIGGO CROSS CSH
    ["car-6", "/figma/tiggocrosscsh-black-platinum.png", "TIGGO CROSS CSH — Black Platinum", "Black Platinum", "#1C1C1E"],
    ["car-6", "/figma/New-TCCSH-Grey-Tech.png", "TIGGO CROSS CSH — Grey Tech", "Grey Tech", "#6E7175"],
    ["car-6", "/figma/tccsh-red-ruby.png", "TIGGO CROSS CSH — Red Ruby", "Red Ruby", "#8B1E2E"],
    ["car-6", "/figma/tccsh-silver-moonlight.png", "TIGGO CROSS CSH — Silver Moonlight", "Silver Moonlight", "#C7C9CC"],
    ["car-6", "/figma/tccsh-white-howlite.png", "TIGGO CROSS CSH — White Howlite", "White Howlite", "#F2F1EC"],
    // car-8 CHERY C5 (ICE)
    ["car-8", "/figma/C5 ice-Black-Platinum.png", "CHERY C5 — Black Platinum", "Black Platinum", "#1C1C1E"],
    ["car-8", "/figma/C5 ice-White-Howlite.png", "CHERY C5 — White Howlite", "White Howlite", "#F2F1EC"],
    // car-9 TIGGO CROSS SPORT
    ["car-9", "/figma/tcscsh-black-platinum.png", "TIGGO CROSS SPORT — Black Platinum", "Black Platinum", "#1C1C1E"],
    ["car-9", "/figma/tcscsh-red-ruby.png", "TIGGO CROSS SPORT — Red Ruby", "Red Ruby", "#8B1E2E"],
    ["car-9", "/figma/tcscsh-silver-moonlight.png", "TIGGO CROSS SPORT — Silver Moonlight", "Silver Moonlight", "#C7C9CC"],
    ["car-9", "/figma/tcscsh-white-howlite.png", "TIGGO CROSS SPORT — White Howlite", "White Howlite", "#F2F1EC"],
    // car-10 OMODA 5 GT
    ["car-10", "/figma/omoda 5 gt white-howlite-black-car-desktop.webp", "OMODA 5 GT — White Howlite Black", "White Howlite Black", "#D9D9D2"],
    // car-11 TIGGO CROSS (ICE)
    ["car-11", "/figma/tc ice red-ruby-car-desktop.png", "TIGGO CROSS — Red Ruby", "Red Ruby", "#8B1E2E"],
    ["car-11", "/figma/tc ice silver-moonlight-car-desktop.png", "TIGGO CROSS — Silver Moonlight", "Silver Moonlight", "#C7C9CC"],
    ["car-11", "/figma/tc ice black-platinum-car-desktop.png", "TIGGO CROSS — Black Platinum", "Black Platinum", "#1C1C1E"],
    ["car-11", "/figma/tc ice white-howlite-car-desktop.png", "TIGGO CROSS — White Howlite", "White Howlite", "#F2F1EC"],
    // car-12 TIGGO 8 (ICE)
    ["car-12", "/figma/tiggo 8 white-howlite-desktop.png", "TIGGO 8 — White Howlite", "White Howlite", "#F2F1EC"],
    ["car-12", "/figma/tiggo 8 black-platinum-desktop.png", "TIGGO 8 — Black Platinum", "Black Platinum", "#1C1C1E"],
    ["car-12", "/figma/tiggo 8 blue-sapphire-desktop.png", "TIGGO 8 — Blue Sapphire", "Blue Sapphire", "#1E3A5F"],
    ["car-12", "/figma/tiggo 8 grey-morganite-desktop.png", "TIGGO 8 — Grey Morganite", "Grey Morganite", "#9B9488"],
    // car-13 TIGGO 8 PRO MAX
    ["car-13", "/figma/tiggo 8 pro max carbon-crystal-black.png", "TIGGO 8 PRO MAX — Carbon Crystal Black", "Carbon Crystal Black", "#0D0D0D"],
    ["car-13", "/figma/tiggo 8 pro max khaki-white.png", "TIGGO 8 PRO MAX — Khaki White", "Khaki White", "#EDE8DD"],
  ];

  colorImages.forEach(([carId, url, alt, colorName, colorHex], i) => {
    colorImageStmt.run(`car-color-img-${i + 1}`, carId, url, alt, i + 1, colorName, colorHex);
  });

  console.log(`✓ Created ${colorImages.length} color variant images across 13 models`);

  // ────────────────────────────────────────────────────────
  // SEED CAR SPECS
  // ────────────────────────────────────────────────────────
  const carSpecStmt = db.prepare(`
    INSERT OR IGNORE INTO car_specs (id, car_id, label, value, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertSpecs = (carId: string, specs: { label: string; value: string }[]) => {
    specs.forEach((spec, idx) => {
      carSpecStmt.run(`spec-${carId}-${idx}`, carId, spec.label, spec.value, idx);
    });
  };

  // 1. CHERY Q BEV
  insertSpecs("car-1", [
    { label: "Motor power (kW)", value: "70" },
    { label: "Max torque (Nm)", value: "150" },
    { label: "Battery capacity (kWh)", value: "35" },
    { label: "Range (km)", value: "320" },
    { label: "Dimensions (L x W x H) (mm)", value: "3950 x 1811 x 1568" },
  ]);

  // 2. CHERY E5 BEV
  insertSpecs("car-2", [
    { label: "Maximum power (kW/PS)", value: "150/204" },
    { label: "Maximum torque (NM)", value: "310" },
    { label: "Battery capacity (kWh)", value: "60.5" },
    { label: "Range (km)", value: "520" },
    { label: "Dimensions (L x W x H) (mm)", value: "4780 x 1893 x 1515" },
  ]);

  // 3. CHERY J6 BEV
  insertSpecs("car-3", [
    { label: "Maximum power (kW/PS)", value: "150/204" },
    { label: "Maximum torque (NM)", value: "310" },
    { label: "Battery capacity (kWh)", value: "60.5" },
    { label: "Range (km)", value: "460" },
    { label: "Dimensions (L x W x H) (mm)", value: "4750 x 1865 x 1710" },
  ]);

  // 4. CHERY C5 CSH
  insertSpecs("car-4", [
    { label: "Maximum power (kW/PS)", value: "145/197" },
    { label: "Maximum torque (NM)", value: "300" },
    { label: "Battery capacity (kWh)", value: "19.3" },
    { label: "Dimensions (L x W x H) (mm)", value: "4780 x 1893 x 1515" },
  ]);

  // 5. TIGGO 9 CSH
  insertSpecs("car-5", [
    { label: "Maximum power (kW/PS)", value: "185/251" },
    { label: "Maximum torque (NM)", value: "385" },
    { label: "Battery capacity (kWh)", value: "34.5" },
    { label: "Dimensions (L x W x H) (mm)", value: "4820 x 1930 x 1710" },
    { label: "Seating capacity", value: "7 seater" },
  ]);

  // 6. TIGGO CROSS CSH
  insertSpecs("car-6", [
    { label: "Maximum power (kW/PS)", value: "125/170" },
    { label: "Maximum torque (NM)", value: "280" },
    { label: "Battery capacity (kWh)", value: "19.3" },
    { label: "Dimensions (L x W x H) (mm)", value: "4310 x 1830 x 1610" },
  ]);

  // 7. TIGGO 8 CSH
  insertSpecs("car-7", [
    { label: "Maximum power (kW/PS)", value: "145/197" },
    { label: "Maximum torque (NM)", value: "290" },
    { label: "Battery capacity (kWh)", value: "19.3" },
    { label: "Dimensions (L x W x H) (mm)", value: "4722 x 1860 x 1705" },
    { label: "Seating capacity", value: "7 seater" },
  ]);

  // 8. CHERY C5 ICE
  insertSpecs("car-8", [
    { label: "Maximum power (kW/PS)", value: "115/156" },
    { label: "Maximum torque (NM)", value: "230" },
    { label: "Engine capacity (cc)", value: "1498" },
    { label: "Dimensions (L x W x H) (mm)", value: "4780 x 1893 x 1515" },
  ]);

  // 9. TIGGO CROSS SPORT
  insertSpecs("car-9", [
    { label: "Maximum power (kW/PS)", value: "90/122" },
    { label: "Maximum torque (NM)", value: "148" },
    { label: "Engine capacity (cc)", value: "1498" },
    { label: "Dimensions (L x W x H) (mm)", value: "4310 x 1830 x 1610" },
  ]);

  // 10. OMODA 5 GT
  insertSpecs("car-10", [
    { label: "Maximum power (kW/PS)", value: "145/197" },
    { label: "Maximum torque (NM)", value: "290" },
    { label: "Engine capacity (cc)", value: "1598" },
    { label: "Dimensions (L x W x H) (mm)", value: "4400 x 1830 x 1588" },
  ]);

  // 11. TIGGO CROSS ICE
  insertSpecs("car-11", [
    { label: "Maximum power (kW/PS)", value: "90/122" },
    { label: "Maximum torque (NM)", value: "148" },
    { label: "Engine capacity (cc)", value: "1498" },
    { label: "Dimensions (L x W x H) (mm)", value: "4310 x 1830 x 1610" },
  ]);

  // 12. TIGGO 8 ICE
  insertSpecs("car-12", [
    { label: "Maximum power (kW/PS)", value: "184/250" },
    { label: "Maximum torque (NM)", value: "390" },
    { label: "Engine capacity (cc)", value: "1998" },
    { label: "Dimensions (L x W x H) (mm)", value: "4722 x 1860 x 1705" },
    { label: "Seating capacity", value: "7 seater" },
  ]);

  // 13. TIGGO 8 PRO MAX ICE
  insertSpecs("car-13", [
    { label: "Maximum power (kW/PS)", value: "184/250" },
    { label: "Maximum torque (NM)", value: "390" },
    { label: "Engine capacity (cc)", value: "1998" },
    { label: "Dimensions (L x W x H) (mm)", value: "4722 x 1860 x 1705" },
    { label: "Seating capacity", value: "7 seater" },
    { label: "Audio system", value: "Sony 10 Speaker" },
    { label: "Drivetrain", value: "AWD" },
  ]);

  console.log("✓ Created car specs for all 13 cars");

  // ────────────────────────────────────────────────────────
  // SEED CAR FEATURES (highlights)
  // ────────────────────────────────────────────────────────
  const carFeatureStmt = db.prepare(`
    INSERT OR IGNORE INTO car_features (id, car_id, title, description, icon, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // 1. CHERY Q BEV
  carFeatureStmt.run("feat-1", "car-1", "Listrik Murni", "Performa responsif dan senyap dengan emisi nol untuk lingkungan yang lebih baik.", "Zap", 0);
  carFeatureStmt.run("feat-2", "car-1", "Desain Kompak Modern", "Tampilan stylish dan lincah, cocok untuk mobilitas perkotaan.", "Car", 1);
  carFeatureStmt.run("feat-3", "car-1", "Efisiensi Energi", "Konsumsi efisien dengan biaya operasional lebih rendah.", "Battery", 2);
  carFeatureStmt.run("feat-4", "car-1", "Fitur Keselamatan", "Perlindungan maksimal dengan fitur keselamatan ADAS standar.", "Shield", 3);

  // 2. CHERY E5 BEV
  carFeatureStmt.run("feat-5", "car-2", "Baterai 60.5 kWh", "Jangkauan hingga 520 km WLTP untuk perjalanan bebas khawatir.", "Battery", 0);
  carFeatureStmt.run("feat-6", "car-2", "Interior Premium", "Kabin luas dengan material premium dan kenyamanan kelas atas.", "Crown", 1);
  carFeatureStmt.run("feat-7", "car-2", "Teknologi Cerdas", "Sistem infotainment canggih dengan konektivitas penuh.", "Monitor", 2);
  carFeatureStmt.run("feat-8", "car-2", "ADAS Lengkap", "Sistem keselamatan aktif untuk perlindungan maksimal.", "Shield", 3);

  // 3. CHERY J6 BEV
  carFeatureStmt.run("feat-9", "car-3", "Desain Futuristik", "Tampilan avant-garde yang memukau di setiap sudut jalan.", "Sparkles", 0);
  carFeatureStmt.run("feat-10", "car-3", "Performa 204 HP", "Mesin listrik bertenaga untuk akselerasi instan yang memuaskan.", "Zap", 1);
  carFeatureStmt.run("feat-11", "car-3", "Kabin Mewah", "Interior premium dengan material berkualitas tinggi.", "Crown", 2);
  carFeatureStmt.run("feat-12", "car-3", "Range 460 km", "Jangkauan luas untuk mobilitas harian tanpa batas.", "Battery", 3);

  // 4. CHERY C5 CSH
  carFeatureStmt.run("feat-13", "car-4", "Hybrid Efisien", "Teknologi plug-in hybrid untuk efisiensi bahan bakar maksimal.", "Battery", 0);
  carFeatureStmt.run("feat-14", "car-4", "Desain Elegan", "Tampilan premium dengan garis desain yang halus dan modern.", "Car", 1);
  carFeatureStmt.run("feat-15", "car-4", "Kabin Luas", "Ruang interior lega dengan kenyamanan kelas sedan premium.", "Crown", 2);
  carFeatureStmt.run("feat-16", "car-4", "Keselamatan ADAS", "Fitur keselamatan aktif dan pasif yang komprehensif.", "Shield", 3);

  // 5. TIGGO 9 CSH
  carFeatureStmt.run("feat-17", "car-5", "Hybrid 251 HP", "Performa tangguh dengan kombinasi mesin turbo dan motor listrik.", "Zap", 0);
  carFeatureStmt.run("feat-18", "car-5", "Kabin 7-Seater VIP", "Ruang mewah untuk 7 penumpang dengan kenyamanan kelas satu.", "Users", 1);
  carFeatureStmt.run("feat-19", "car-5", "Interior Premium", "Material jok berkualitas tinggi dengan fitur pemanas dan ventilasi.", "Crown", 2);
  carFeatureStmt.run("feat-20", "car-5", "Suspensi Adaptif", "Kenyamanan berkendara optimal di segala medan.", "Compass", 3);

  // 6. TIGGO CROSS CSH
  carFeatureStmt.run("feat-21", "car-6", "Hybrid Compact", "Efisiensi hybrid dalam bodi compact SUV yang praktis.", "Battery", 0);
  carFeatureStmt.run("feat-22", "car-6", "Desain Crossover", "Tampilan crossover modern yang sporty dan stylish.", "Car", 1);
  carFeatureStmt.run("feat-23", "car-6", "Hemat BBM", "Konsumsi bahan bakar super irit berkat teknologi hybrid.", "Fuel", 2);
  carFeatureStmt.run("feat-24", "car-6", "Kabin Fleksibel", "Ruang kabin yang dapat diatur sesuai kebutuhan.", "Layers", 3);

  // 7. TIGGO 8 CSH
  carFeatureStmt.run("feat-25", "car-7", "Hybrid 7-Seater", "SUV keluarga hybrid dengan kapasitas 7 penumpang.", "Users", 0);
  carFeatureStmt.run("feat-26", "car-7", "Kabin Mewah", "Interior luas dan nyaman dengan fitur hiburan lengkap.", "Crown", 1);
  carFeatureStmt.run("feat-27", "car-7", "Efisiensi Hybrid", "Konsumsi BBM lebih irit dengan bantuan motor listrik.", "Battery", 2);
  carFeatureStmt.run("feat-28", "car-7", "Keselamatan Keluarga", "Fitur keselamatan lengkap untuk perlindungan seluruh keluarga.", "Shield", 3);

  // 8. CHERY C5 ICE
  carFeatureStmt.run("feat-29", "car-8", "Mesin Bertenaga", "Mesin 1.5L Turbo 156 HP dengan transmisi CVT responsif.", "Flame", 0);
  carFeatureStmt.run("feat-30", "car-8", "Desain Premium", "Tampilan elegan dengan detail krom yang mewah.", "Car", 1);
  carFeatureStmt.run("feat-31", "car-8", "Kabin Luas", "Ruang interior lega dengan material premium untuk kenyamanan.", "Crown", 2);
  carFeatureStmt.run("feat-32", "car-8", "Fitur Lengkap", "Dilengkapi berbagai fitur kemudahan dan keselamatan.", "Shield", 3);

  // 9. TIGGO CROSS SPORT
  carFeatureStmt.run("feat-33", "car-9", "Tampilan Sporty", "Aksen sporty dengan body kit agresif dan velg alloy.", "Sparkles", 0);
  carFeatureStmt.run("feat-34", "car-9", "Mesin Responsif", "Mesin 1.5L bertenaga dengan akselerasi responsif.", "Flame", 1);
  carFeatureStmt.run("feat-35", "car-9", "Compact & Lincah", "Ukuran kompak ideal untuk mobilitas perkotaan.", "Car", 2);
  carFeatureStmt.run("feat-36", "car-9", "Harga Terjangkau", "SUV sporty dengan harga yang bersahabat.", "Wallet", 3);

  // 10. OMODA 5 GT
  carFeatureStmt.run("feat-37", "car-10", "Mesin 1.6 TGDI 197 HP", "Performa sporty dengan akselerasi yang memacu adrenalin.", "Flame", 0);
  carFeatureStmt.run("feat-38", "car-10", "Art in Motion Design", "Desain crossover futuristik dengan siluet dinamis dan tegas.", "Sparkles", 1);
  carFeatureStmt.run("feat-39", "car-10", "Dual Screen 20.5-inch", "Layar instrumen dan hiburan ganda beresolusi tinggi.", "Monitor", 2);
  carFeatureStmt.run("feat-40", "car-10", "Suspensi Multi-Link", "Kestabilan optimal dan handling presisi di setiap kecepatan.", "Compass", 3);

  // 11. TIGGO CROSS ICE
  carFeatureStmt.run("feat-41", "car-11", "Mesin Irit", "Mesin 1.5L bertenaga dengan konsumsi BBM yang efisien.", "Fuel", 0);
  carFeatureStmt.run("feat-42", "car-11", "SUV Kompak", "Ukuran ideal untuk mobilitas keluarga di perkotaan.", "Car", 1);
  carFeatureStmt.run("feat-43", "car-11", "Kabin Lapang", "Ruang kabin luas dengan konfigurasi kursi fleksibel.", "Layers", 2);
  carFeatureStmt.run("feat-44", "car-11", "Harga Bersahabat", "SUV berkualitas dengan harga yang terjangkau.", "Wallet", 3);

  // 12. TIGGO 8 ICE
  carFeatureStmt.run("feat-45", "car-12", "Mesin 2.0L Turbo 250 HP", "Performa tangguh untuk segala kondisi jalan.", "Flame", 0);
  carFeatureStmt.run("feat-46", "car-12", "Kabin 7-Seater", "Ruang kabin luas untuk 7 penumpang dengan kenyamanan VIP.", "Users", 1);
  carFeatureStmt.run("feat-47", "car-12", "Interior Mewah", "Material premium dengan desain interior berkelas.", "Crown", 2);
  carFeatureStmt.run("feat-48", "car-12", "ADAS 9 Airbags", "Perlindungan maksimal dengan 9 airbags dan fitur ADAS.", "Shield", 3);

  // 13. TIGGO 8 PRO MAX ICE
  carFeatureStmt.run("feat-49", "car-13", "Mesin 2.0L Turbo 250 HP", "Performa tangguh dengan AWD untuk ketangguhan di semua medan.", "Flame", 0);
  carFeatureStmt.run("feat-50", "car-13", "Kabin VIP 7-Seater", "Ruang kabin luas dengan 7 tempat duduk premium kelas VIP.", "Users", 1);
  carFeatureStmt.run("feat-51", "car-13", "Sistem Audio Sony 10 Speaker", "Pengalaman audio premium dengan 10 speaker untuk hiburan terbaik.", "Volume2", 2);
  carFeatureStmt.run("feat-52", "car-13", "ADAS 9 Airbags", "Sistem keselamatan aktif dengan 9 airbags untuk perlindungan maksimal.", "Shield", 3);

  console.log("✓ Created car features for all 13 cars");

  // ────────────────────────────────────────────────────────
  // SEED HOMEPAGE HERO SLIDES
  // ────────────────────────────────────────────────────────
  const heroSlides = JSON.stringify([
    {
      id: "tiggo-cross-csh",
      model: "Tiggo Cross CSH",
      modelLogo: "/figma/model-logo.png",
      banner: "/figma/hero-banner.png",
      priceFrom: "429.900.000",
      caption: "Mulai Dari",
      ctaText: "Jadwalkan Test Drive",
      ctaLink: "/booking"
    },
    {
      id: "tiggo-9-csh",
      model: "Tiggo 9 CSH",
      modelLogo: "/figma/model-logo-tiggo9.png",
      banner: "/figma/hero-banner-tiggo9.png",
      priceFrom: "849.900.000",
      caption: "Mulai Dari",
      ctaText: "Jadwalkan Test Drive",
      ctaLink: "/booking"
    },
    {
      id: "chery-j6",
      model: "J6",
      modelLogo: "/figma/model-logo-j6.png",
      banner: "/figma/hero-banner-j6.png",
      priceFrom: "739.900.000",
      caption: "Mulai Dari",
      ctaText: "Jadwalkan Test Drive",
      ctaLink: "/booking"
    }
  ]);

  db.prepare("DELETE FROM homepage_sections WHERE section = 'hero'").run();
  db.prepare(`
    INSERT INTO homepage_sections (id, section, title, subtitle, description, metadata, is_active)
    VALUES (?, 'hero', 'Hero Banner', 'Chery Slideshow', 'Hero carousel slides', ?, 1)
  `).run("section-hero", heroSlides);

  // Seed CTA section — title/subtitle here are the real displayed eyebrow/heading text
  db.prepare("DELETE FROM homepage_sections WHERE section = 'cta'").run();
  db.prepare(`
    INSERT INTO homepage_sections (id, section, title, subtitle, description, is_active)
    VALUES (?, 'cta', 'Hubungi Kami', 'Hubungi Sales Kami Hari Ini', 'Bottom-of-homepage contact CTA', 1)
  `).run("section-cta");

  console.log("✓ Created hero slides (3 slides with banners, captions, CTAs)");

  // ────────────────────────────────────────────────────────
  // SEED WHY CHERY / SERVICES / SPECIAL OFFERS — migrated from
  // previously-hardcoded homepage section components.
  // ────────────────────────────────────────────────────────
  const whyCheryBenefits = JSON.stringify([
    {
      icon: "BadgeCheckIcon",
      title: "Dealer Resmi Chery Indonesia",
      description: "Jaminan keaslian unit dan layanan prima langsung dari jaringan dealer resmi terpercaya Chery Indonesia.",
    },
    {
      icon: "CreditCardIcon",
      title: "Kredit Tanpa Bunga",
      description: "Fasilitas pembiayaan eksklusif dengan bunga 0% dan tenor fleksibel sesuai kebutuhan finansial Anda.",
    },
    {
      icon: "TruckIcon",
      title: "Pengiriman ke Jabodetabek",
      description: "Layanan pengiriman kendaraan yang aman, cepat, dan profesional langsung ke alamat garasi rumah Anda.",
    },
    {
      icon: "Building2Icon",
      title: "Dealer Resmi Cibubur",
      description: "Layanan sales, servis berkala dengan mekanik bersertifikat, dan penyediaan suku cadang resmi terlengkap.",
    },
    {
      icon: "AwardIcon",
      title: "Garansi 5 Tahun/100.000 KM",
      description: "Garansi suku cadang komprehensif untuk ketenangan pikiran berkendara Anda bersama keluarga.",
    },
    {
      icon: "HeadsetIcon",
      title: "Customer Care 24/7",
      description: "Layanan bantuan darurat jalan raya dan layanan pelanggan yang responsif siap siaga setiap saat.",
    },
  ]);

  db.prepare("DELETE FROM homepage_sections WHERE section = 'why-chery'").run();
  db.prepare(`
    INSERT INTO homepage_sections (id, section, title, subtitle, description, metadata, is_active)
    VALUES (?, 'why-chery', 'Mengapa Beli Chery Di Sini', 'Dealer Resmi Chery Terpercaya di Cibubur, Makassar, dan Pare – Pilihan Utama Anda', 'Komitmen kami: harga resmi, layanan transparan, dan program after-sales terlengkap untuk kenyamanan Anda', ?, 1)
  `).run("section-why-chery", whyCheryBenefits);

  const serviceCards = JSON.stringify([
    {
      icon: "CarIcon",
      title: "Penjualan Unit Chery",
      description: "Jelajahi lini kendaraan Chery terbaru dengan penawaran eksklusif, konsultasi spesifikasi detail, dan unit test drive yang siap Anda coba langsung.",
    },
    {
      icon: "CreditCardIcon",
      title: "Kredit Mobil Chery",
      description: "Dapatkan kemudahan skema pembiayaan dengan suku bunga kompetitif, DP ringan, serta proses pengajuan yang cepat dan transparan.",
    },
    {
      icon: "HandshakeIcon",
      title: "Servis Berkala & Dukungan",
      description: "Perawatan rutin dan perbaikan kendaraan Anda ditangani oleh teknisi bersertifikasi global dengan peralatan diagnosis modern.",
    },
    {
      icon: "SettingsIcon",
      title: "Suku Cadang Asli",
      description: "Penyediaan suku cadang orisinal (Genuine Parts) bergaransi resmi untuk menjamin keselamatan dan performa maksimal mobil Anda.",
    },
  ]);

  db.prepare("DELETE FROM homepage_sections WHERE section = 'services'").run();
  db.prepare(`
    INSERT INTO homepage_sections (id, section, title, subtitle, description, metadata, is_active)
    VALUES (?, 'services', 'Layanan Lengkap', 'Semua Layanan Terbaik yang Anda Butuhkan Ada di Sini', 'Kami berkomitmen menghadirkan ekosistem layanan purna jual lengkap demi kenyamanan, keselamatan, dan kepuasan berkendara Anda.', ?, 1)
  `).run("section-services", serviceCards);

  const specialOffers = JSON.stringify([
    {
      id: "dp-10",
      image: "/figma/promo-1.png",
      badge: { label: "Limited Offer", variant: "dark" },
      title: "DP Mulai 10%",
      tag: "Khusus Tiggo 8",
      description: "Miliki Chery Tiggo 8 dengan DP ringan mulai 10% dan tenor hingga 60 bulan.",
      validUntil: "Valid until: 30 Juni 2026",
    },
    {
      id: "bonus-service",
      image: "/figma/promo-2.png",
      badge: { label: "Special Promo", variant: "light" },
      title: "Bonus Service 3 Tahun",
      tag: "Untuk Pembelian Omoda 5",
      description: "Dapatkan gratis service hingga 3 tahun untuk setiap pembelian Omoda 5 baru.",
      validUntil: "Valid until: 31 Juli 2026",
    },
    {
      id: "trade-in",
      image: "/figma/promo-3.png",
      title: "Trade-In Bonus",
      tag: "Harga Terbaik untuk Mobil Lama",
      description: "Tukar tambah mobil lama Anda dengan harga terbaik + bonus tambahan untuk pembelian model Chery apa pun.",
      validUntil: "Valid until: 30 Juni 2026",
    },
  ]);

  db.prepare("DELETE FROM homepage_sections WHERE section = 'special-offers'").run();
  db.prepare(`
    INSERT INTO homepage_sections (id, section, title, subtitle, description, metadata, is_active)
    VALUES (?, 'special-offers', 'Program Promo Spesial', 'Special Offers', 'Penawaran eksklusif dengan waktu terbatas untuk membantu Anda membawa pulang kendaraan Chery impian dengan berbagai keuntungan menarik.', ?, 1)
  `).run("section-special-offers", specialOffers);

  console.log("✓ Created why-chery, services, and special-offers homepage sections");

  // ────────────────────────────────────────────────────────
  // SEED TESTIMONIALS — replaces the old localStorage-only fake
  // reviews with real, shared rows tied to actual car ids.
  // ────────────────────────────────────────────────────────
  db.prepare("DELETE FROM testimonials").run();

  const testimonialStmt = db.prepare(`
    INSERT INTO testimonials (id, car_id, author_name, rating, comment, verified, likes, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 1, ?, 'published', ?, ?)
  `);

  const testimonials: [string, string, string, number, string, number, string][] = [
    [
      "testi-1", "car-1", "Hendra Gunawan", 4,
      "CHERY Q ini pas banget buat mobilitas harian di kota. Kompak, gampang diparkir, dan tenaga listriknya responsif untuk stop-and-go di kemacetan Jakarta. Fitur keselamatannya juga lengkap untuk kelas hatchback listrik.",
      12, "2026-06-20 10:00:00",
    ],
    [
      "testi-2", "car-2", "Sari Indah", 5,
      "Sudah 2 bulan pakai CHERY E5 dan sangat puas. Jangkauan baterainya realistis untuk perjalanan luar kota, interior terasa premium, dan fitur ADAS-nya bikin tenang saat bawa keluarga di tol.",
      27, "2026-06-15 09:30:00",
    ],
    [
      "testi-3", "car-3", "Kevin Chandra", 5,
      "CHERY J6 adalah SUV listrik yang bikin surprised. Akselerasinya halus dan senyap, kabin lega untuk keluarga, dan pengisian dayanya cukup cepat di rumah maupun SPKLU. Recommended untuk yang mau upgrade ke EV.",
      19, "2026-06-08 14:00:00",
    ],
    [
      "testi-4", "car-4", "Ahmad Fauzi", 4,
      "CHERY C5 CSH desainnya elegan dan teknologi hybrid-nya benar-benar menghemat konsumsi bahan bakar dibanding sedan konvensional yang saya pakai sebelumnya. Interior clean, Apple CarPlay & Android Auto terintegrasi mulus.",
      14, "2026-05-30 11:15:00",
    ],
    [
      "testi-5", "car-5", "Budi Santoso", 5,
      "TIGGO 9 CSH ini kelas premium banget untuk keluarga besar saya. Kabin luas, jok nyaman untuk perjalanan jauh, dan sistem hybrid-nya bikin konsumsi BBM jauh lebih irit tanpa mengorbankan tenaga.",
      31, "2026-05-22 16:20:00",
    ],
    [
      "testi-6", "car-6", "Rizki Hidayat", 4,
      "Baru 3 minggu pakai TIGGO CROSS CSH, sejauh ini puas dengan efisiensi bahan bakarnya di rute tol harian. Fitur infotainment lengkap dan suspensinya nyaman untuk jalan yang kurang mulus.",
      9, "2026-05-14 08:45:00",
    ],
    [
      "testi-7", "car-7", "Linda Wijaya", 5,
      "TIGGO 8 CSH pilihan tepat untuk keluarga besar yang butuh 7 seater tapi tetap irit. Fitur keselamatannya lengkap, dan kabin baris ketiga masih nyaman untuk orang dewasa, tidak sekadar formalitas.",
      22, "2026-05-05 13:00:00",
    ],
    [
      "testi-8", "car-8", "Maria Susanti", 4,
      "CHERY C5 dengan mesin turbo-nya bertenaga tapi tetap halus. Harga yang ditawarkan sangat kompetitif untuk sedan dengan spesifikasi selengkap ini. Pelayanan di dealer juga ramah dan profesional.",
      16, "2026-04-28 10:30:00",
    ],
    [
      "testi-9", "car-10", "Andi Wijaya", 5,
      "Sudah 3 bulan pakai OMODA 5 GT dan sangat puas! Desainnya yang futuristik selalu dapat perhatian di jalan, handling-nya tangkas, dan fitur ADAS-nya sangat membantu saat macet. Highly recommended!",
      24, "2026-04-20 09:00:00",
    ],
    [
      "testi-10", "car-13", "Diana Putri", 5,
      "TIGGO 8 PRO MAX adalah pilihan terbaik untuk keluarga besar saya. 7 tempat duduk yang lapang, anak-anak nyaman di kursi ketiga, dan tenaga mesinnya tangguh bahkan saat mobil terisi penuh. Pelayanan after-sales juga memuaskan.",
      18, "2026-04-10 15:00:00",
    ],
  ];

  for (const [id, carId, authorName, rating, comment, likes, createdAt] of testimonials) {
    testimonialStmt.run(id, carId, authorName, rating, comment, likes, createdAt, createdAt);
  }

  console.log("✓ Created 10 testimonials tied to real car records");

  // ────────────────────────────────────────────────────────
  // SEED FAQS
  // ────────────────────────────────────────────────────────
  db.prepare("DELETE FROM faqs").run();

  const faqStmt = db.prepare(`
    INSERT INTO faqs (id, question, answer, category, sort_order, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'published', ?, ?)
  `);

  const faqs: [string, string, string, string, number][] = [
    [
      "faq-1",
      "Berapa lama masa garansi kendaraan Chery?",
      "Seluruh lini kendaraan Chery di Indonesia dilengkapi garansi mesin hingga 10 tahun atau 1.000.000 KM (mana yang tercapai lebih dulu), termasuk untuk komponen baterai dan motor listrik pada model hybrid maupun full-electric.",
      "Garansi",
      1,
    ],
    [
      "faq-2",
      "Bagaimana cara menjadwalkan test drive?",
      "Anda dapat menjadwalkan test drive langsung melalui halaman Booking di website ini, memilih model dan dealer terdekat, atau menghubungi tim sales kami via WhatsApp. Konsultan kami akan mengonfirmasi jadwal dalam waktu 1x24 jam.",
      "Test Drive",
      2,
    ],
    [
      "faq-3",
      "Apakah tersedia simulasi kredit sebelum membeli?",
      "Ya, gunakan Kalkulator Simulasi Kredit yang tersedia di menu navigasi untuk memperkirakan uang muka, margin, dan estimasi angsuran bulanan sebelum mengajukan pembiayaan resmi melalui mitra pembiayaan Chery.",
      "Pembiayaan",
      3,
    ],
    [
      "faq-4",
      "Berapa lama waktu pengisian daya untuk mobil listrik Chery?",
      "Waktu pengisian bervariasi tergantung model dan sumber daya. Menggunakan home charger AC, pengisian penuh umumnya membutuhkan 6-8 jam semalaman. Dengan fast charging DC di SPKLU, baterai dapat terisi hingga 80% dalam waktu sekitar 30-40 menit.",
      "Kendaraan Listrik",
      4,
    ],
    [
      "faq-5",
      "Apakah Chery menerima tukar tambah (trade-in) mobil lama?",
      "Ya, seluruh dealer resmi Chery menerima trade-in mobil lama dari merek apa pun dengan penawaran harga terbaik berdasarkan kondisi kendaraan, yang dapat langsung dipotongkan sebagai uang muka pembelian mobil Chery baru.",
      "Pembelian",
      5,
    ],
    [
      "faq-6",
      "Di kota mana saja dealer resmi Chery tersedia?",
      "Saat ini Chery Indonesia memiliki dealer resmi di Cibubur (Jabodetabek), Makassar, dan Pare-pare, dengan rencana perluasan jaringan ke kota-kota besar lainnya. Cek halaman Dealer untuk detail lokasi dan kontak masing-masing cabang.",
      "Dealer",
      6,
    ],
    [
      "faq-7",
      "Apa saja yang termasuk dalam layanan servis berkala?",
      "Layanan servis berkala mencakup pemeriksaan menyeluruh mesin/motor listrik, sistem pengereman, kelistrikan, penggantian oli dan filter (untuk model ICE/hybrid), serta pembaruan software kendaraan, seluruhnya ditangani teknisi bersertifikasi Chery menggunakan suku cadang asli.",
      "Servis",
      7,
    ],
    [
      "faq-8",
      "Apakah bisa membeli mobil Chery secara online sepenuhnya?",
      "Anda dapat melakukan pre-booking dan simulasi kredit sepenuhnya online melalui website ini. Untuk penandatanganan kontrak pembiayaan dan serah terima unit, tetap diperlukan kunjungan ke dealer resmi sesuai regulasi yang berlaku.",
      "Pembelian",
      8,
    ],
  ];

  const now = new Date().toISOString();
  for (const [id, question, answer, category, sortOrder] of faqs) {
    faqStmt.run(id, question, answer, category, sortOrder, now, now);
  }

  console.log("✓ Created 8 FAQs");

  // ────────────────────────────────────────────────────────
  // SEED SEO METADATA — admin-overridable per-page SEO for
  // pages without an underlying content record (home, news list).
  // ────────────────────────────────────────────────────────
  db.prepare("DELETE FROM seo_metadata").run();

  const seoStmt = db.prepare(`
    INSERT INTO seo_metadata (id, page, title, description, keywords, og_image, no_index, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
  `);

  const seoNow = new Date().toISOString();

  seoStmt.run(
    "seo-home",
    "home",
    "Dealer Resmi Chery Indonesia — Tiggo, Omoda, E5 & Lini Hybrid/EV",
    "Jelajahi lineup lengkap Chery Indonesia: BEV, hybrid CSH, dan ICE. Simulasi kredit, jadwalkan test drive, dan temukan dealer resmi terdekat di Cibubur, Makassar, dan Pare-pare.",
    "Chery Indonesia, dealer Chery, Tiggo, Omoda, Chery E5, mobil listrik, mobil hybrid, test drive Chery",
    "/og-image.jpg",
    seoNow,
    seoNow
  );

  seoStmt.run(
    "seo-news",
    "news",
    "Berita & Artikel Chery Indonesia",
    "Ikuti berita, wawasan teknologi, dan tips perawatan kendaraan terbaru dari Chery Indonesia.",
    "berita Chery, artikel otomotif, tips perawatan mobil, teknologi Chery",
    null,
    seoNow,
    seoNow
  );

  console.log("✓ Created SEO metadata overrides (home, news)");

  console.log("\n✅ Database seeded successfully!");
  console.log("\nDefault admin credentials:");
  console.log("Email: admin@chery.com");
  console.log("Password: admin123");
}

seed().catch(console.error);