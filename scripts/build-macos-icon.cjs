const { spawnSync } = require('node:child_process');
const { mkdirSync, statSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src-tauri/icons/AppIcon.icon');
const output = path.join(root, 'src-tauri/icons/generated');

const available = spawnSync('xcrun', ['--find', 'actool'], { encoding: 'utf8' });
if (available.status !== 0) {
  console.error('A macOS ikon fordításához Xcode 26 vagy újabb szükséges (a Command Line Tools nem elég). Válaszd ki az Xcode-ot az xcode-select vagy a DEVELOPER_DIR segítségével.');
  process.exit(1);
}

mkdirSync(output, { recursive: true });
const result = spawnSync('xcrun', [
  'actool', source,
  '--compile', output,
  '--app-icon', 'AppIcon',
  '--enable-on-demand-resources', 'NO',
  '--development-region', 'en',
  '--target-device', 'mac',
  '--platform', 'macosx',
  '--include-all-app-icons',
  '--minimum-deployment-target', '11.0',
  '--output-partial-info-plist', path.join(output, 'partial.plist'),
  '--output-format', 'human-readable-text', '--notices', '--warnings', '--errors'
], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
if (result.status !== 0) process.exit(result.status || 1);
if (!statSync(path.join(output, 'Assets.car'), { throwIfNoEntry: false })?.size) {
  console.error('Az actool nem készített Assets.car fájlt. Xcode 26 vagy újabb szükséges.');
  process.exit(1);
}
