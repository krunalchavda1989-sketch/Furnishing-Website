import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'public', '.htaccess');
const dest = path.join(process.cwd(), 'dist', '.htaccess');

try {
  if (fs.existsSync(src)) {
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log('✅ Successfully copied public/.htaccess -> dist/.htaccess');
  }
} catch (err) {
  console.warn('Warning copying .htaccess:', err.message);
}
