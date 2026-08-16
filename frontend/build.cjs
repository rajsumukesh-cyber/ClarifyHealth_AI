const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ClarifyHealth build process inside frontend...');

console.log('📦 Installing frontend dependencies...');
execSync('npm install --no-package-lock', { cwd: __dirname, stdio: 'inherit' });

console.log('🔨 Building frontend production bundle...');
execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });

console.log('✅ Build completed successfully!');
