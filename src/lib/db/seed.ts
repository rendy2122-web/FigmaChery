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
  db.prepare("DELETE FROM car_images").run();
  db.prepare("DELETE FROM car_specs").run();
  db.prepare("DELETE FROM product_sections").run();
  db.prepare("DELETE FROM promotions").run();
  db.prepare("DELETE FROM cars").run();

  // Seed cars - separated by type (BEV, CSH, ICE)
  const carStmt = db.prepare(`
    INSERT INTO cars (id, name, slug, subtitle, description, price_from, type, status, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // CHERY Q - ICE
  carStmt.run("car-1", "CHERY Q", "chery-q", "COMPACT SUV", "Temukan standar baru berkendara dengan kombinasi desain futuristik, performa tangguh, dan integrasi teknologi cerdas.", "329.800.000", "ICE", "published", 1, 1);

  // CHERY J6 - separated by type
  carStmt.run("car-2", "CHERY J6 BEV", "chery-j6-bev", "ELECTRIC", "Nikmati pengalaman berkendara 100% listrik dengan teknologi terkini dan nol emisi.", "739.900.000", "BEV", "published", 1, 2);
  carStmt.run("car-3", "CHERY J6 CSH", "chery-j6-csh", "CHARGED SUSTAINABLE HYBRID", "Teknologi hybrid cerdas yang menggabungkan efisiensi dan performa optimal.", "689.900.000", "CSH", "published", 1, 3);
  carStmt.run("car-4", "CHERY J6 ICE", "chery-j6-ice", "INTERNAL COMBUSTION ENGINE", "Performa tangguh dengan mesin bensin yang efisien dan responsif.", "599.900.000", "ICE", "published", 1, 4);

  // CHERY E5 - separated by type
  carStmt.run("car-5", "CHERY E5 BEV", "chery-e5-bev", "ELECTRIC", "Sedan elektrik premium dengan jangkauan jauh dan kenyamanan luar biasa.", "799.900.000", "BEV", "published", 1, 5);
  carStmt.run("car-6", "CHERY E5 CSH", "chery-e5-csh", "CHARGED SUSTAINABLE HYBRID", "Sedan hybrid dengan efisiensi bahan bakar maksimal dan emisi rendah.", "749.900.000", "CSH", "published", 1, 6);
  carStmt.run("car-7", "CHERY E5 ICE", "chery-e5-ice", "INTERNAL COMBUSTION ENGINE", "Sedan bensin yang nyaman dan ekonomis untuk keluarga.", "659.900.000", "ICE", "published", 1, 7);

  // CHERY C5 CSH
  carStmt.run("car-8", "CHERY C5 CSH", "chery-c5-csh", "CHARGED SUSTAINABLE HYBRID", "Kombinasi sempurna antara desain elegan dan teknologi hybrid ramah lingkungan.", "739.900.000", "CSH", "published", 1, 8);

  console.log("✓ Created 8 cars (CHERY Q, J6 BEV/CSH/ICE, E5 BEV/CSH/ICE, C5 CSH)");

  // Seed car images
  const carImageStmt = db.prepare(`
    INSERT OR IGNORE INTO car_images (id, car_id, url, alt, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  carImageStmt.run("car-img-1", "car-1", "/figma/car-q.png", "CHERY Q ICE", 1);
  carImageStmt.run("car-img-2", "car-2", "/figma/car-j6.png", "CHERY J6 BEV", 1);
  carImageStmt.run("car-img-3", "car-3", "/figma/car-j6.png", "CHERY J6 CSH", 1);
  carImageStmt.run("car-img-4", "car-4", "/figma/car-j6.png", "CHERY J6 ICE", 1);
  carImageStmt.run("car-img-5", "car-5", "/figma/car-e5.png", "CHERY E5 BEV", 1);
  carImageStmt.run("car-img-6", "car-6", "/figma/car-e5.png", "CHERY E5 CSH", 1);
  carImageStmt.run("car-img-7", "car-7", "/figma/car-e5.png", "CHERY E5 ICE", 1);
  carImageStmt.run("car-img-8", "car-8", "/figma/car-c5.png", "CHERY C5 CSH", 1);
  console.log("✓ Created car images");

  // Seed car specs - unique for each model
  const carSpecStmt = db.prepare(`
    INSERT OR IGNORE INTO car_specs (id, car_id, label, value, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  // CHERY Q specs
  const qSpecs = [
    { label: "Maximum power (kW/PS)", value: "90/122" },
    { label: "Maximum torque (NM)", value: "115" },
    { label: "Dimensions (L x W x H) (mm.)", value: "4195 x 1811 x 1568" },
  ];

  // CHERY J6 specs
  const j6BevSpecs = [
    { label: "Maximum power (kW/PS)", value: "150/204" },
    { label: "Maximum torque (NM)", value: "310" },
    { label: "Battery capacity (kWh)", value: "60.5" },
    { label: "Range (km)", value: "460" },
  ];
  const j6CshSpecs = [
    { label: "Maximum power (kW/PS)", value: "125/170" },
    { label: "Maximum torque (NM)", value: "280" },
    { label: "Battery capacity (kWh)", value: "19.3" },
    { label: "Dimensions (L x W x H) (mm.)", value: "4750 x 1865 x 1710" },
  ];
  const j6IceSpecs = [
    { label: "Maximum power (kW/PS)", value: "115/156" },
    { label: "Maximum torque (NM)", value: "230" },
    { label: "Dimensions (L x W x H) (mm.)", value: "4750 x 1865 x 1710" },
  ];

  // CHERY E5 specs
  const e5BevSpecs = [
    { label: "Maximum power (kW/PS)", value: "150/204" },
    { label: "Maximum torque (NM)", value: "310" },
    { label: "Battery capacity (kWh)", value: "60.5" },
    { label: "Range (km)", value: "520" },
  ];
  const e5CshSpecs = [
    { label: "Maximum power (kW/PS)", value: "145/197" },
    { label: "Maximum torque (NM)", value: "300" },
    { label: "Battery capacity (kWh)", value: "19.3" },
    { label: "Dimensions (L x W x H) (mm.)", value: "4780 x 1893 x 1515" },
  ];
  const e5IceSpecs = [
    { label: "Maximum power (kW/PS)", value: "115/156" },
    { label: "Maximum torque (NM)", value: "230" },
    { label: "Dimensions (L x W x H) (mm.)", value: "4780 x 1893 x 1515" },
  ];

  // CHERY C5 CSH specs
  const c5CshSpecs = [
    { label: "Maximum power (kW/PS)", value: "145/197" },
    { label: "Maximum torque (NM)", value: "300" },
    { label: "Battery capacity (kWh)", value: "19.3" },
    { label: "Dimensions (L x W x H) (mm.)", value: "4780 x 1893 x 1515" },
  ];

  // Insert specs for each car
  const insertSpecs = (carId: string, specs: any[]) => {
    specs.forEach((spec, idx) => {
      carSpecStmt.run(`spec-${carId}-${idx}`, carId, spec.label, spec.value, idx);
    });
  };

  insertSpecs("car-1", qSpecs);
  insertSpecs("car-2", j6BevSpecs);
  insertSpecs("car-3", j6CshSpecs);
  insertSpecs("car-4", j6IceSpecs);
  insertSpecs("car-5", e5BevSpecs);
  insertSpecs("car-6", e5CshSpecs);
  insertSpecs("car-7", e5IceSpecs);
  insertSpecs("car-8", c5CshSpecs);

  console.log("✓ Created car specs with accurate specifications");

  // Seed product sections for car-1 (Tiggo Cross CSH)
  const sectionStmt = db.prepare(`
    INSERT OR IGNORE INTO product_sections (id, car_id, section_type, title, subtitle, content, image, icon, features, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  // Hero Banner
  sectionStmt.run("ps-1", "car-1", "hero_banner", "Tiggo Cross CSH", "COMPACT SUV", "Desain futuristik yang menggabungkan elegan dan kekuatan", "/figma/hero-banner.png", null, null, 0, 1);
  
  // Efficiency
  sectionStmt.run("ps-2", "car-1", "efficiency", "More Efficient", "Hibrida cerdas, hemat bensin", "Teknologi hybrid yang memberikan efisiensi bahan bakar maksimal", null, null, JSON.stringify(["Fuel Efficient", "Low Emission", "Smart Hybrid System"]), 1, 1);
  
  // Performance
  sectionStmt.run("ps-3", "car-1", "performance", "Faster & Powerful", "Performa tangguh di setiap kondisi", "Mesin bertenaga dengan akselerasi responsif", null, null, JSON.stringify(["Turbo Engine", "Smooth Acceleration", "All-Wheel Drive"]), 2, 1);
  
  // Comfort
  sectionStmt.run("ps-4", "car-1", "comfort", "Smarter & Comfortable", "Kenyamanan premium", "Interior spacious dengan teknologi cerdas", null, null, JSON.stringify(["Premium Interior", "Smart Infotainment", "Climate Control"]), 3, 1);
  
  // Colors
  sectionStmt.run("ps-5", "car-1", "colors", "Color Options", "Pilihan warna eksklusif", "Tersedia dalam berbagai pilihan warna", null, null, JSON.stringify(["Silver", "White", "Black", "Red"]), 4, 1);
  
  // Safety
  sectionStmt.run("ps-6", "car-1", "safety", "Dynamics & Safety", "Safety terdepan", "Dilengkapi dengan fitur safety lengkap", null, null, JSON.stringify(["ABS", "EBD", "ESC", "Airbags", "Parking Sensor"]), 5, 1);
  
  // Pricing
  sectionStmt.run("ps-7", "car-1", "pricing", "Variant & Pricing", "Pilihan varian sesuai kebutuhan", "Berbagai varian dengan harga kompetitif", null, null, JSON.stringify(["Standard - Rp 329.800.000", "Premium - Rp 359.800.000", "Ultimate - Rp 389.800.000"]), 6, 1);

  console.log("✓ Created product sections for CHERY Q");

  // Seed homepage hero slides as JSON metadata
  const heroSlides = JSON.stringify([
    {
      id: "cross-csh",
      model: "Tiggo Cross CSH",
      modelLogo: "/figma/model-logo.png",
      banner: "/figma/hero-banner.png",
      priceFrom: "329.800.000",
      caption: "Mulai Dari",
      ctaText: "Jadwalkan Test Drive",
      ctaLink: "/booking"
    },
    {
      id: "tiggo9-csh",
      model: "Tiggo 9 CSH",
      modelLogo: "/figma/model-logo-tiggo9.png",
      banner: "/figma/hero-banner-tiggo9.png",
      priceFrom: "739.900.000",
      caption: "Mulai Dari",
      ctaText: "Jadwalkan Test Drive",
      ctaLink: "/booking"
    },
    {
      id: "j6",
      model: "J6",
      modelLogo: "/figma/model-logo-j6.png",
      banner: "/figma/hero-banner-j6.png",
      priceFrom: "739.900.000",
      caption: "Mulai Dari",
      ctaText: "Jadwalkan Test Drive",
      ctaLink: "/booking"
    }
  ]);

  // Delete existing hero section and re-insert with metadata
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