import * as fs from 'fs';
import * as path from 'path';

const ONE_HOUR = 60 * 60 * 1000;
const now = Date.now();

function scan(dir: string, depth = 0) {
  if (depth > 6) return;
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (['proc', 'sys', 'dev', 'lib', 'lib64', 'bin', 'sbin', 'etc', 'usr', 'var', 'opt', 'boot', 'srv', 'run', 'mnt', 'node_modules', '.git', '.cache', '.npm'].includes(f)) continue;
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          scan(full, depth + 1);
        } else {
          const age = now - stat.mtimeMs;
          if (age < ONE_HOUR) {
            console.log(`RECENT_FILE: ${full} (${stat.size} bytes, modified ${(age / 1000 / 60).toFixed(1)} mins ago)`);
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

scan('/');
