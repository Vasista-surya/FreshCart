import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDbPath = path.resolve(__dirname, '..', 'backend', 'config', 'mockDb.js');

// We will read mockDb.js and parse the rawProductsData array
const content = fs.readFileSync(mockDbPath, 'utf8');

// Use regex to find all product objects
const matches = content.matchAll(/\{\s*name:\s*['"]([^'"]+)['"],[\s\S]*?image:\s*['"]([^'"]+)['"]/g);

let count = 0;
for (const match of matches) {
  count++;
  console.log(`[#${count}] Name: ${match[1]} | Image: ${match[2]}`);
}
