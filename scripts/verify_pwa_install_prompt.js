const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'deploy', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  ['install guide container', 'id="pwa-install-guide"'],
  ['install button', 'id="pwa-install-button"'],
  ['close button', 'id="pwa-install-close"'],
  ['help text target', 'id="pwa-install-help"'],
  ['beforeinstallprompt listener', "beforeinstallprompt"],
  ['appinstalled listener', "appinstalled"],
  ['native prompt call', ".prompt()"],
  ['standalone mode check', "display-mode: standalone"],
  ['manual Chrome install copy', "Chrome 메뉴"],
  ['session-only dismissal', "sessionStorage"]
];

const missing = checks.filter(([, needle]) => !html.includes(needle));

if (missing.length) {
  console.error('PWA install guide verification failed:');
  for (const [label, needle] of missing) {
    console.error(`- Missing ${label}: ${needle}`);
  }
  process.exit(1);
}

console.log('PWA install guide verification passed.');
