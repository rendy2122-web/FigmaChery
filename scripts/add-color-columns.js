const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
let db;

try {
  db = new Database(dbPath);
  
  try {
    db.exec('ALTER TABLE car_images ADD COLUMN color_name TEXT');
    console.log('✓ Added color_name column');
  } catch (e) {
    console.log('  color_name column already exists');
  }
  
  try {
    db.exec('ALTER TABLE car_images ADD COLUMN color_hex TEXT');
    console.log('✓ Added color_hex column');
  } catch (e) {
    console.log('  color_hex column already exists');
  }
  
  console.log('\n✅ Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
} finally {
  if (db) db.close();
}