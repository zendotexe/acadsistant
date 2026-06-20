import * as fs from 'fs';
import * as path from 'path';

function search() {
  console.log('Searching for possible backups...');
  const locations = ['/', '/app', '/home', '/tmp'];
  for (const loc of locations) {
    try {
      if (!fs.existsSync(loc)) continue;
      const files = fs.readdirSync(loc);
      for (const f of files) {
        if (['node_modules', 'dist', 'src', 'proc', 'sys', 'dev', 'lib', 'lib64', 'bin', 'sbin', 'etc', 'usr', 'var', 'opt', 'boot', 'srv', 'run', 'mnt'].includes(f)) continue;
        console.log(`Found in ${loc}: ${f}`);
        const full = path.join(loc, f);
        try {
          const stat = fs.statSync(full);
          if (stat.isDirectory()) {
            console.log(`  (dir) ${fs.readdirSync(full).join(', ')}`);
          }
        } catch(e) {}
      }
    } catch (e: any) {
      console.log(`Error reading ${loc}: ${e.message}`);
    }
  }
}

search();
