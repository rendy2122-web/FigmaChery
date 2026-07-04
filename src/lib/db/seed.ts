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

  // Seed cars
  const carStmt = db.prepare(`
    INSERT OR IGNORE INTO cars (id, name, slug, subtitle, description, price_from, status, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  carStmt.run("car-1", "CHERY Q", "chery-q", "COMPACT SUV", "Temukan standar baru berkendara dengan kombinasi desain futuristik, performa tangguh, dan integrasi teknologi cerdas.", "329.800.000", "published", 1, 1);
  carStmt.run("car-2", "CHERY J6", "chery-j6", "BEV · CSH · ICE", "Temukan standar baru berkendara dengan kombinasi desain futuristik, performa tangguh, dan integrasi teknologi cerdas.", "739.900.000", "published", 1, 2);
  carStmt.run("car-3", "CHERY E5", "chery-e5", "BEV · CSH · ICE", "Temukan standar baru berkendara dengan kombinasi desain futuristik, performa tangguh, dan integrasi teknologi cerdas.", "739.900.000", "published", 1, 3);
  carStmt.run("car-4", "CHERY C5 CSH", "chery-c5-csh", "BEV · CSH · ICE", "Temukan standar baru berkendara dengan kombinasi desain futuristik, performa tangguh, dan integrasi teknologi cerdas.", "739.900.000", "published", 1, 4);
  console.log("✓ Created 4 cars (CHERY Q, J6, E5, C5 CSH)");

  // Seed car images
  const carImageStmt = db.prepare(`
    INSERT OR IGNORE INTO car_images (id, car_id, url, alt, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  carImageStmt.run("car-img-1", "car-1", "/figma/car-q.png", "CHERY Q", 1);
  carImageStmt.run("car-img-2", "car-2", "/figma/car-j6.png", "CHERY J6", 1);
  carImageStmt.run("car-img-3", "car-3", "/figma/car-e5.png", "CHERY E5", 1);
  carImageStmt.run("car-img-4", "car-4", "/figma/car-c5.png", "CHERY C5 CSH", 1);
  console.log("✓ Created car images");

  // Seed car specs
  const carSpecStmt = db.prepare(`
    INSERT OR IGNORE INTO car_specs (id, car_id, label, value, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const specs = [
    { label: "Maximum power (kW/PS)", value: "90/122" },
    { label: "Maximum torque (NM)", value: "115" },
    { label: "Dimensions (L x W x H) (mm.)", value: "4195 x 1811 x 1568" },
  ];

  specs.forEach((spec, idx) => {
    carSpecStmt.run(`spec-1-${idx}`, "car-1", spec.label, spec.value, idx);
    carSpecStmt.run(`spec-2-${idx}`, "car-2", spec.label, spec.value, idx);
    carSpecStmt.run(`spec-3-${idx}`, "car-3", spec.label, spec.value, idx);
    carSpecStmt.run(`spec-4-${idx}`, "car-4", spec.label, spec.value, idx);
  });
  console.log("✓ Created car specs");

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