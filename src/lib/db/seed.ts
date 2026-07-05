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
  console.log("✓ Created default categories");

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
  carStmt.run("car-2", "CHERY E5", "chery-e5", "ELECTRIC SEDAN",
    "CHERY E5 menghadirkan sedan listrik premium dengan desain elegan dan teknologi canggih. Diciptakan untuk profesional modern yang menginginkan kendaraan ramah lingkungan tanpa mengorbankan kenyamanan dan performa, dengan interior luas serta fitur keselamatan ADAS terkini.",
    "799.900.000", "BEV", "published", 1, 2);

  // 3. J6 BEV
  carStmt.run("car-3", "CHERY J6", "chery-j6", "ELECTRIC SEDAN",
    "CHERY J6 adalah sedan listrik flagship dengan desain futuristik yang memukau dan performa bertenaga. Diciptakan untuk eksekutif yang menginginkan perpaduan sempurna antara kemewahan, teknologi baterai canggih, dan pengalaman berkendara senyap dengan jangkauan jauh.",
    "739.900.000", "BEV", "published", 1, 3);

  // ===================== CSH (Charged Sustainable Hybrid) =====================

  // 4. CHERY C5 CSH
  carStmt.run("car-4", "CHERY C5 CSH", "chery-c5-csh", "CHARGED SUSTAINABLE HYBRID",
    "CHERY C5 CSH menghadirkan sedan hybrid elegan dengan teknologi plug-in hybrid yang efisien. Diciptakan untuk profesional urban yang menginginkan gaya premium tanpa mengorbankan efisiensi bahan bakar, menawarkan kombinasi sempurna antara performa tangguh dan ramah lingkungan.",
    "739.900.000", "CSH", "published", 1, 4);

  // 5. TIGGO 9 CSH
  carStmt.run("car-5", "TIGGO 9 CSH", "tiggo-9-csh", "CHARGED SUSTAINABLE HYBRID",
    "TIGGO 9 CSH adalah SUV hybrid flagship yang menggabungkan kemewahan kelas atas dengan teknologi ramah lingkungan. Diciptakan untuk keluarga modern yang menginginkan kendaraan besar dengan efisiensi bahan bakar superior, kabin premium 7-seater, dan performa hybrid yang tangguh.",
    "849.900.000", "CSH", "published", 1, 5);

  // 6. TIGGO CROSS CSH
  carStmt.run("car-6", "TIGGO CROSS CSH", "tiggo-cross-csh", "CHARGED SUSTAINABLE HYBRID",
    "TIGGO CROSS CSH menghadirkan compact SUV hybrid dengan desain crossover modern dan teknologi hybrid cerdas. Diciptakan untuk keluarga muda yang aktif dan peduli lingkungan, menawarkan efisiensi bahan bakar maksimal, ruang kabin fleksibel, dan fitur keselamatan lengkap.",
    "429.900.000", "CSH", "published", 1, 6);

  // 7. TIGGO 8 CSH
  carStmt.run("car-7", "TIGGO 8 CSH", "tiggo-8-csh", "CHARGED SUSTAINABLE HYBRID",
    "TIGGO 8 CSH adalah SUV hybrid 7-seater premium yang menggabungkan kenyamanan keluarga dengan teknologi hybrid terkini. Diciptakan untuk keluarga besar yang mengutamakan kemewahan dan kepraktisan, menawarkan kabin luas, fitur hiburan lengkap, dan efisiensi bahan bakar superior.",
    "668.500.000", "CSH", "published", 1, 7);

  // ===================== ICE (Internal Combustion Engine) =====================

  // 8. CHERY C5 ICE
  carStmt.run("car-8", "CHERY C5", "chery-c5", "INTERNAL COMBUSTION ENGINE",
    "CHERY C5 menghadirkan sedan bensin elegan dengan performa tangguh dan konsumsi bahan bakar irit. Diciptakan untuk keluarga modern yang menghargai kenyamanan berkendara dan keandalan mesin bensin konvensional, dengan desain premium dan fitur keselamatan lengkap.",
    "659.900.000", "ICE", "published", 1, 8);

  // 9. TIGGO CROSS SPORT
  carStmt.run("car-9", "TIGGO CROSS SPORT", "tiggo-cross-sport", "INTERNAL COMBUSTION ENGINE",
    "TIGGO CROSS SPORT adalah varian sporty dari Tiggo Cross dengan tampilan lebih agresif dan dinamis. Diciptakan untuk pengendara muda yang menginginkan SUV crossover berkarakter sporty dengan performa mesin bensin bertenaga, desain modern, dan harga terjangkau.",
    "399.900.000", "ICE", "published", 1, 9);

  // 10. OMODA 5 GT
  carStmt.run("car-10", "OMODA 5 GT", "omoda-5-gt", "INTERNAL COMBUSTION ENGINE",
    "OMODA 5 GT menghadirkan crossover sporty dengan desain futuristik 'Art in Motion' yang agresif dan mesin 1.6L Turbocharged bertenaga 197 HP. Diciptakan bagi individu dinamis yang menginginkan gaya mencolok tanpa mengorbankan performa, dilengkapi suspensi Multi-Link dan asisten berkendara digital.",
    "404.800.000", "ICE", "published", 1, 10);

  // 11. TIGGO CROSS ICE
  carStmt.run("car-11", "TIGGO CROSS", "tiggo-cross", "INTERNAL COMBUSTION ENGINE",
    "TIGGO CROSS adalah compact SUV bensin yang dirancang untuk mobilitas perkotaan yang praktis dan efisien. Diciptakan bagi keluarga muda yang mencari SUV kompak dengan konsumsi bahan bakar irit, kabin yang luas, dan fitur keselamatan standar dengan harga bersahabat.",
    "329.800.000", "ICE", "published", 1, 11);

  // 12. TIGGO 8 ICE
  carStmt.run("car-12", "TIGGO 8", "tiggo-8", "INTERNAL COMBUSTION ENGINE",
    "TIGGO 8 adalah SUV 7-seater bensin premium dengan mesin bertenaga dan kabin mewah. Diciptakan untuk keluarga besar yang mengutamakan kenyamanan dan ruang luas, dilengkapi fitur keselamatan ADAS terkini, sistem hiburan canggih, dan desain eksterior yang berwibawa.",
    "568.500.000", "ICE", "published", 1, 12);

  // 13. TIGGO 8 PRO MAX ICE
  carStmt.run("car-13", "TIGGO 8 PRO MAX", "tiggo-8-pro-max", "INTERNAL COMBUSTION ENGINE",
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
  carImageStmt.run("car-img-4", "car-4", "/figma/car-c5.png", "CHERY C5 CSH", 1);
  carImageStmt.run("car-img-5", "car-5", "/figma/car-tiggo9.png", "TIGGO 9 CSH", 1);
  carImageStmt.run("car-img-6", "car-6", "/figma/car-tiggocross.png", "TIGGO CROSS CSH", 1);
  carImageStmt.run("car-img-7", "car-7", "/figma/car-tiggo8.png", "TIGGO 8 CSH", 1);
  carImageStmt.run("car-img-8", "car-8", "/figma/car-c5.png", "CHERY C5 ICE", 1);
  carImageStmt.run("car-img-9", "car-9", "/figma/car-tiggocross.png", "TIGGO CROSS SPORT", 1);
  carImageStmt.run("car-img-10", "car-10", "/figma/car-omoda5.png", "OMODA 5 GT", 1);
  carImageStmt.run("car-img-11", "car-11", "/figma/car-tiggocross.png", "TIGGO CROSS ICE", 1);
  carImageStmt.run("car-img-12", "car-12", "/figma/car-tiggo8.png", "TIGGO 8 ICE", 1);
  carImageStmt.run("car-img-13", "car-13", "/figma/car-tiggo8.png", "TIGGO 8 PRO MAX", 1);
  console.log("✓ Created main car images");

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

  // Seed CTA section
  db.prepare("DELETE FROM homepage_sections WHERE section = 'cta'").run();
  db.prepare(`
    INSERT INTO homepage_sections (id, section, title, subtitle, description, is_active)
    VALUES (?, 'cta', 'Hubungi Sales Kami Hari Ini', 'Rasakan pengalaman berkendara masa depan', 'Contact us today', 1)
  `).run("section-cta");

  console.log("✓ Created hero slides (3 slides with banners, captions, CTAs)");

  console.log("\n✅ Database seeded successfully!");
  console.log("\nDefault admin credentials:");
  console.log("Email: admin@chery.com");
  console.log("Password: admin123");
}

seed().catch(console.error);