import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanFile = (filePath) => {
  const absolutePath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    return;
  }

  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Replace photo-photo- with photo-
  const updatedContent = content.replace(/photo-photo-/g, 'photo-');
  
  fs.writeFileSync(absolutePath, updatedContent, 'utf8');
  console.log(`🧹 Cleaned up duplicate 'photo-photo-' in: ${filePath}`);
};

cleanFile('backend/config/mockDb.js');
cleanFile('backend/seed.js');
