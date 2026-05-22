import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'backend', 'data', 'db.json');

if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log(`Loaded ${db.products.length} products from db.json`);
  
  db.products.forEach(p => {
    console.log(`[${p._id}] Name: ${p.name} | Category: ${p.category} | Image: ${p.image}`);
  });
} else {
  console.log('db.json does not exist!');
}
