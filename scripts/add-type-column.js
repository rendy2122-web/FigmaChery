const Database = require('better-sqlite3');
const db = new Database('prisma/dev.db');

try {
  db.pragma('journal_mode = WAL');
  db.exec("ALTER TABLE cars ADD COLUMN type TEXT DEFAULT 'ICE'");
  console.log('✓ Successfully added type column to cars table');
} catch (error) {
  console.error('Error adding column:', error.message);
} finally {
  db.close();
}