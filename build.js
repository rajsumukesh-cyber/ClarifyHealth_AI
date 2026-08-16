const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ClarifyHealth build process...');

const isInsideFrontend = fs.existsSync(path.join(__dirname, 'src')) && fs.existsSync(path.join(__dirname, 'vite.config.ts'));
const frontendDir = isInsideFrontend ? __dirname : path.join(__dirname, 'frontend');

console.log('📦 Installing frontend dependencies in:', frontendDir);
execSync('npm install --no-package-lock', { cwd: frontendDir, stdio: 'inherit' });

console.log('🔨 Building frontend production bundle...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

const distSource = path.join(frontendDir, 'dist');
const rootDist = isInsideFrontend ? path.join(__dirname, '..', 'dist') : path.join(__dirname, 'dist');
const rootPublic = isInsideFrontend ? path.join(__dirname, '..', 'public') : path.join(__dirname, 'public');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach((element) => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

if (fs.existsSync(distSource)) {
  console.log('📂 Syncing dist artifacts...');
  if (!isInsideFrontend) {
    copyFolderSync(distSource, rootDist);
    copyFolderSync(distSource, rootPublic);
  }
  console.log('✅ Build completed successfully!');
} else {
  console.error('❌ Error: dist was not generated.');
  process.exit(1);
}
