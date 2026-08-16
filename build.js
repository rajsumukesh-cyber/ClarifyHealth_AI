const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ClarifyHealth build process...');

// 1. Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

// 2. Build frontend
console.log('🔨 Building frontend production bundle...');
execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

// 3. Copy frontend/dist to ./dist and ./public for universal hosting support
const srcDist = path.join(__dirname, 'frontend', 'dist');
const rootDist = path.join(__dirname, 'dist');
const rootPublic = path.join(__dirname, 'public');

function copyFolderSync(from, to) {
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

if (fs.existsSync(srcDist)) {
  console.log('📂 Copying frontend/dist to root /dist and /public...');
  copyFolderSync(srcDist, rootDist);
  copyFolderSync(srcDist, rootPublic);
  console.log('✅ Build completed successfully and artifacts placed in dist/ and public/!');
} else {
  console.error('❌ Error: frontend/dist was not created.');
  process.exit(1);
}
