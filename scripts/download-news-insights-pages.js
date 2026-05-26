import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'pages-src', 'news-insights');
const base = 'https://www.artisanpartners.com';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

const pages = [
  {
    slug: 'news/press-releases',
    urlPath: '/institutional-investors/news-insights/news/press-releases.html',
  },
  {
    slug: 'thought-leadership/insights',
    urlPath: '/institutional-investors/news-insights/thought-leadership/insights.html',
  },
];

function getPageCount(html) {
  const match = html.match(/Showing 1 - \d+ of (\d+) results/);
  return match ? Math.ceil(Number(match[1]) / 20) : 1;
}

async function download(url, dest) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }

  const text = await response.text();
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, text);
  console.log('Downloaded', dest.replace(root, '.'));
  return text;
}

async function main() {
  for (const page of pages) {
    const firstUrl = `${base}${page.urlPath}`;
    const firstDest = join(outDir, `${page.slug}.html`);
    const firstHtml = await download(firstUrl, firstDest);
    const pageCount = getPageCount(firstHtml);

    for (let startPage = 2; startPage <= pageCount; startPage += 1) {
      const url = `${firstUrl}?startpage=${startPage}`;
      const dest = join(outDir, `${page.slug}-page-${startPage}.html`);
      await download(url, dest);
    }

    console.log(`${page.slug}: ${pageCount} pages`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
