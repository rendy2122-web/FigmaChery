const betterSqlite3 = require('better-sqlite3');
const db = new betterSqlite3('prisma/dev.db');

// Color variant definitions per car (mapped from public/figma/ files)
const colorVariants = {
  "car-1": { // CHERY Q BEV
    slug: "chery-q",
    colors: [
      { name: "Safari Oat", hex: "#e5d3b3", url: "/figma/cheryq-oat.png" },
      { name: "Cyber Purple", hex: "#5c3d70", url: "/figma/cheryq-purple.png" },
      { name: "Pearl White", hex: "#f5f5f5", url: "/figma/cheryq-white.png" },
    ]
  },
  "car-2": { // CHERY E5
    slug: "chery-e5",
    colors: [
      { name: "Phantom Black", hex: "#111111", url: "/figma/e5-black.png" },
      { name: "Space Green", hex: "#2e4a3f", url: "/figma/e5-green.png" },
      { name: "Stellar Grey", hex: "#6b7280", url: "/figma/e5-grey.png" },
      { name: "White Two-Tone", hex: "#e5e7eb", url: "/figma/e5-white-twotone.png" },
      { name: "Pearl White", hex: "#f5f5f5", url: "/figma/e5-white.png" },
    ]
  },
  "car-3": { // CHERY J6
    slug: "chery-j6",
    colors: [
      { name: "Phantom Black", hex: "#111111", url: "/figma/j6-black.webp" },
      { name: "Space Green", hex: "#2e4a3f", url: "/figma/j6-green.webp" },
      { name: "Stellar Grey", hex: "#6b7280", url: "/figma/j6-grey.webp" },
      { name: "Pearl White", hex: "#f5f5f5", url: "/figma/j6-white.webp" },
    ]
  },
  "car-4": { // CHERY C5 CSH
    slug: "chery-c5-csh",
    colors: [
      { name: "Black Diamond", hex: "#1a1a1a", url: "/figma/c5csh-black.webp" },
      { name: "Passion Red", hex: "#DA291C", url: "/figma/c5csh-red.webp" },
      { name: "White Two-Tone", hex: "#e5e7eb", url: "/figma/c5csh-white-twotone.webp" },
      { name: "Pearl White", hex: "#f5f5f5", url: "/figma/c5csh-white.webp" },
    ]
  },
  "car-5": { // TIGGO 9 CSH
    slug: "tiggo-9-csh",
    colors: [
      { name: "Black Diamond", hex: "#1a1a1a", url: "/figma/t9csh-black.png" },
      { name: "Forest Green", hex: "#2e4a3f", url: "/figma/t9csh-green.png" },
      { name: "Graphite Grey", hex: "#6b7280", url: "/figma/t9csh-grey.png" },
      { name: "Pearl White", hex: "#f5f5f5", url: "/figma/t9csh-white.png" },
    ]
  },
  "car-7": { // TIGGO 8 CSH
    slug: "tiggo-8-csh",
    colors: [
      { name: "Black Diamond", hex: "#1a1a1a", url: "/figma/t8csh-black.png" },
      { name: "Forest Green", hex: "#2e4a3f", url: "/figma/t8csh-green.png" },
      { name: "Graphite Grey", hex: "#6b7280", url: "/figma/t8csh-grey.png" },
      { name: "Pearl White", hex: "#f5f5f5", url: "/figma/t8csh-white.png" },
    ]
  }
};

// Delete existing color images first, then insert new ones
const deleteStmt = db.prepare("DELETE FROM car_images WHERE color_name IS NOT NULL");
deleteStmt.run();

const insertStmt = db.prepare(`
  INSERT INTO car_images (id, car_id, url, alt, color_name, color_hex, sort_order, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let count = 0;
const now = new Date().toISOString();
let idCounter = 100; // start IDs after existing images

for (const [carId, config] of Object.entries(colorVariants)) {
  config.colors.forEach((color, idx) => {
    insertStmt.run(
      `car-color-img-${carId}-${idx + 1}`,
      carId,
      color.url,
      `${config.slug} — ${color.name}`,
      color.name,
      color.hex,
      idx + 1,
      now
    );
    count++;
  });
}

console.log(`✅ Seeded ${count} color variant images across ${Object.keys(colorVariants).length} cars.`);