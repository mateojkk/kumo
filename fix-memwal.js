import fs from 'fs';
import path from 'path';

const files = [
  'apps/api/src/functions/analyze.ts',
  'apps/api/src/functions/discover.ts',
  'apps/api/src/functions/profile.ts',
  'apps/api/src/functions/recall.ts',
  'apps/api/src/functions/remember.ts',
  'apps/api/src/lib/registry.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace import
  content = content.replace(/import \{ memwal \} from "(\.\.\/lib|\.\/lib|\.\/memwal)\/memwal\.js";/, 'import { getMemwal } from "$1/memwal.js";');
  
  // Add initialization right after the function signature or beginning of async function
  content = content.replace(/(export async function \w+\([^)]*\)\s*\{)/, '$1\n  const memwal = await getMemwal();');
  content = content.replace(/(export default async function handler\([^)]*\)\s*\{)/, '$1\n  const memwal = await getMemwal();');

  fs.writeFileSync(file, content);
}
console.log('Fixed memwal imports');
