const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('Connected to database at:', dbPath);

const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_cars_slug ON cars(slug)',
  'CREATE INDEX IF NOT EXISTS idx_cars_status_featured ON cars(status, featured)',
  'CREATE INDEX IF NOT EXISTS idx_cars_sort_order ON cars(sort_order)',
  'CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)',
  'CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at)',
  'CREATE INDEX IF NOT EXISTS idx_dealers_status_sort ON dealers(status, sort_order)',
];

for (const sql of indexes) {
  try {
    db.exec(sql);
    console.log('✓ Created:', sql.split(' ON ')[1]);
  } catch (err) {
    console.error('✗ Failed:', err.message);
  }
}

db.close();
console.log('\nAll indexes created successfully!');