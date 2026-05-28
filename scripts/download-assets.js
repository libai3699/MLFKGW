import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const base = 'https://www.artisanpartners.com';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function download(url, dest) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  await mkdir(dirname(dest), { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(dest, buffer);
  console.log(`Downloaded: ${dest.replace(root, '.')}`);
}

const assets = [
  ['/etc/designs/artisanpartners/favicon.ico', 'favicon.ico'],
  ['/content/dam/artisan-portal/static/aplp-logo.png', 'images/aplp-logo.png'],
  ['/content/dam/artisan-portal/static/background.jpg', 'images/background.jpg'],
  ['/content/dam/artisan-portal/static/list.png', 'images/list.png'],
  ['/content/dam/artisan-portal/static/x.png', 'images/x.png'],
  ['/content/dam/artisan-portal/static/bullet.png', 'images/bullet.png'],
  ['/content/dam/artisan-portal/fonts/artisan.woff', 'fonts/artisan.woff'],
  ['/content/dam/artisan-portal/fonts/artisan.ttf', 'fonts/artisan.ttf'],
  [
    '/about-us/investment-culture/_jcr_content/root/responsivegrid/responsivegrid/image.coreimg.jpeg/1758821837824/jason-gottlieb-948x533.jpeg',
    'images/jason-gottlieb-948x533.jpeg',
  ],
  [
    '/about-us/business-model/_jcr_content/root/responsivegrid/responsivegrid/image.coreimg.png/1766521291065/artisan-business-model.png',
    'images/artisan-business-model.png',
  ],
  ['/content/dam/images/static/icon-loading.gif', 'images/icon-loading.gif'],
  ['/content/dam/images/logo/logo-702x86.png', 'images/sustainability/logo-702x86.png'],
  ['/content/dam/images/sustainability-esg/2025/list.png', 'images/sustainability/list.png'],
  ['/content/dam/images/sustainability-esg/2025/bg-nav-section-0.jpg', 'images/sustainability/bg-nav-section-0.jpg'],
  ['/content/dam/images/sustainability-esg/2025/bg-nav-section-1.jpg', 'images/sustainability/bg-nav-section-1.jpg'],
  ['/content/dam/images/sustainability-esg/2025/bg-nav-section-2.jpg', 'images/sustainability/bg-nav-section-2.jpg'],
  ['/content/dam/images/sustainability-esg/2025/bg-nav-section-3.jpg', 'images/sustainability/bg-nav-section-3.jpg'],
  ['/content/dam/images/sustainability-esg/2025/bg-nav-section-4.jpg', 'images/sustainability/bg-nav-section-4.jpg'],
  ['/content/dam/images/sustainability-esg/2025/bg-nav-section-5.jpg', 'images/sustainability/bg-nav-section-5.jpg'],
  ['/content/dam/images/static/watermark.jpg', 'images/sustainability/watermark.jpg'],
  ['/content/dam/artisan-portal/static/bg-careers-small.jpg', 'images/bg-careers-small.jpg'],
  ['/content/dam/images/careers/profile-7.jpg', 'images/careers/profile-7.jpg'],
  ['/content/dam/images/careers/ankur-patel-profile-15.jpg', 'images/careers/ankur-patel-profile-15.jpg'],
  ['/content/dam/images/careers/profile-11.jpg', 'images/careers/profile-11.jpg'],
  ['/content/dam/images/careers/key-business-areas-716x498.jpg', 'images/careers/key-business-areas-716x498.jpg'],
  ['/content/dam/images/careers/career-opportunities-v3-716x498.jpg', 'images/careers/career-opportunities-v3-716x498.jpg'],
  ['/content/dam/images/careers/benefits-and-rewards-at-work-716x498.jpg', 'images/careers/benefits-and-rewards-at-work-716x498.jpg'],
  ['/content/dam/images/careers/financial-wellness-266x317.jpg', 'images/careers/financial-wellness-266x317.jpg'],
  ['/content/dam/images/careers/life-wellness-benefits-266x317.jpg', 'images/careers/life-wellness-benefits-266x317.jpg'],
  ['/content/dam/images/careers/life-at-artisan-partners-347x241_360.jpg', 'images/careers/life-at-artisan-partners-347x241_360.jpg'],
  ['/content/dam/images/careers/bg-downtown-milwaukee-824x174.jpg', 'images/careers/bg-downtown-milwaukee-824x174.jpg'],
  ['/content/dam/images/careers/bg-womens-network-event-824x174.jpg', 'images/careers/bg-womens-network-event-824x174.jpg'],
  ['/content/dam/images/careers/community-connection-and-impact.jpg', 'images/careers/community-connection-and-impact.jpg'],
  [
    '/content/dam/documents/legal/privacy-policy/Privacy-Notice-for-California-Residents.pdf',
    'content/dam/documents/legal/privacy-policy/Privacy-Notice-for-California-Residents.pdf',
  ],
  [
    '/content/dam/documents/legal/APLP-Form-ADV-CRS.pdf',
    'content/dam/documents/legal/APLP-Form-ADV-CRS.pdf',
  ],
  ['/content/dam/images/logo/logo.png', 'images/investor/logo.png'],
  [
    '/content/dam/images/carousel/carousel-home-lipper-award-GBLV-SELEQ-1800x280.jpg',
    'images/investor/carousel-home-lipper-award-GBLV-SELEQ-1800x280.jpg',
  ],
  [
    '/content/dam/images/carousel/carousel-bryan-krug-2025-morningstar-award-1800x280.jpg',
    'images/investor/carousel-bryan-krug-2025-morningstar-award-1800x280.jpg',
  ],
  [
    '/etc/designs/artisanpartners/clientlibs_base/images/footer-bg.png',
    'images/investor/footer-bg.png',
  ],
  [
    '/content/dam/images/investor-updates/artisan-partners-investor-update.jpg',
    'images/investor/artisan-partners-investor-update.jpg',
  ],
  [
    '/content/dam/images/pm-viewpoints/INTV-bloomberg-surveillance-feat-Samra-Aprl-2026.jpg',
    'images/investor/INTV-bloomberg-surveillance-feat-Samra-Aprl-2026.jpg',
  ],
  [
    '/content/dam/images/insights/gss-citywire-pro-buyer-website-thumbnail-764x430.jpg',
    'images/investor/gss-citywire-pro-buyer-website-thumbnail-764x430.jpg',
  ],
  [
    '/content/dam/images/banners/home-side-bar-image-canvas-blog-285x160.png',
    'images/investor/home-side-bar-image-canvas-blog-285x160.png',
  ],
];

const flags = ['us', 'au', 'at', 'be', 'ca', 'dk', 'fi', 'fr', 'de', 'is'];

async function main() {
  for (const [remotePath, localPath] of assets) {
    await download(`${base}${remotePath}`, join(publicDir, localPath));
  }

  for (const code of flags) {
    await download(
      `https://flagcdn.com/${code}.svg`,
      join(publicDir, 'images/flags', `${code}.svg`),
    );
  }

  console.log('All assets downloaded successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
