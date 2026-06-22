import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';

try {
  console.log('Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  if (existsSync('dist')) {
    console.log('Dist folder files:', readdirSync('dist'));
    if (existsSync('dist/assets')) {
      console.log('Dist assets files:', readdirSync('dist/assets'));
    }
    if (existsSync('dist/index.html')) {
      const html = readFileSync('dist/index.html', 'utf8');
      console.log('HTML content around favicon:', html.match(/<link[^>]*>/g));
    }
  } else {
    console.log('Dist folder was not found!');
  }
} catch (e: any) {
  console.error('Error during build inspection:', e.message);
}
