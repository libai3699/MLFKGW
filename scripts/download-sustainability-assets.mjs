import fs from 'fs';
import path from 'path';

const root = path.resolve('d:/ML/gw');
const publicDir = path.join(root, 'public');
const base = 'https://www.artisanpartners.com';
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

const htmlFiles = fs
  .readdirSync(path.join(root, 'pages-src'))
  .filter((name) => name.endsWith('.html'));

const assetPattern =
  /\/content\/dam\/images\/(?:sustainability-esg\/2025|logo)\/[^"' )]+/g;

const assets = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, 'pages-src', file), 'utf8');
  for (const match of html.matchAll(assetPattern)) {
    assets.add(match[0]);
  }
}

assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-wrapper-section-1.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-section-1.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-wrapper-section-2.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-section-2.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-wrapper-section-3.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-section-3.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-wrapper-section-4.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-section-4.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-wrapper-section-5.jpg');
assets.add('/content/dam/images/sustainability-esg/2025/bg-hero-section-5.jpg');

async function download(remotePath, dest) {
  const response = await fetch(`${base}${remotePath}`, { headers });
  if (!response.ok) {
    throw new Error(`Failed ${remotePath}: ${response.status}`);
  }
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(dest, buffer);
  console.log(`Downloaded: ${path.relative(root, dest)}`);
}

for (const remotePath of assets) {
  const localPath = remotePath
    .replace('/content/dam/images/sustainability-esg/2025/', 'images/sustainability/')
    .replace('/content/dam/images/logo/', 'images/sustainability/');
  const dest = path.join(publicDir, localPath);
  try {
    await download(remotePath, dest);
  } catch (error) {
    console.error(error.message);
  }
}

console.log('Sustainability assets download complete.');
