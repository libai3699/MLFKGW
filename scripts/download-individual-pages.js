import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'pages-src', 'individual');
const base = 'https://www.artisanpartners.com';
const INDIVIDUAL_BASE = '/individual-investors';
const DELAY_MS = 350;

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

const extracted = JSON.parse(
  readFileSync(join(root, 'src/data/investorExtracted.json'), 'utf8'),
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hrefToUrlPath(href) {
  if (!href || href.startsWith('http')) {
    return null;
  }

  let path = href.split('?')[0].split('#')[0];
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  if (!path.startsWith(INDIVIDUAL_BASE)) {
    return null;
  }

  if (!path.endsWith('.html')) {
    path = `${path}.html`;
  }

  return path;
}

function urlPathToDest(urlPath) {
  const relative = urlPath.replace(new RegExp(`^${INDIVIDUAL_BASE}/?`), '');
  return join(outDir, relative);
}

function getPageCount(html) {
  const match = html.match(/Showing 1 - \d+ of (\d+) results/);
  return match ? Math.ceil(Number(match[1]) / 20) : 1;
}

function collectStaticPaths() {
  const paths = new Set();

  const aboutSlugs = [
    'overview',
    'who-we-are',
    'investment-culture',
    'business-model',
    'investment-strategies',
  ];

  for (const slug of aboutSlugs) {
    paths.add(`${INDIVIDUAL_BASE}/about-us/${slug}.html`);
  }

  paths.add(`${INDIVIDUAL_BASE}/performance/performance.html`);
  paths.add(`${INDIVIDUAL_BASE}/performance/ratings-rankings.html`);
  paths.add(`${INDIVIDUAL_BASE}/contact-us.html`);
  paths.add(`${INDIVIDUAL_BASE}/search-results.html`);
  paths.add(`${INDIVIDUAL_BASE}/terms-conditions.html`);
  paths.add(`${INDIVIDUAL_BASE}/privacy-policy.html`);
  paths.add(`${INDIVIDUAL_BASE}/proxy-policies-and-voting-record.html`);

  const newsPaths = [
    `${INDIVIDUAL_BASE}/news-insights/news/press-releases.html`,
    `${INDIVIDUAL_BASE}/news-insights/thought-leadership/commentaries.html`,
    `${INDIVIDUAL_BASE}/news-insights/thought-leadership/insights.html`,
    `${INDIVIDUAL_BASE}/news-insights/artisan-canvas.html`,
    `${INDIVIDUAL_BASE}/news-insights/research-data/fact-sheets.html`,
    `${INDIVIDUAL_BASE}/news-insights/research-data/holdings.html`,
    `${INDIVIDUAL_BASE}/news-insights/advanced-document-filtering.html`,
  ];

  for (const path of newsPaths) {
    paths.add(path);
  }

  const resourcePaths = [
    `${INDIVIDUAL_BASE}/resources/applications-forms.html`,
    `${INDIVIDUAL_BASE}/resources/prospectus.html`,
    `${INDIVIDUAL_BASE}/resources/investor-faqs.html`,
    `${INDIVIDUAL_BASE}/resources/account-access.html`,
    `${INDIVIDUAL_BASE}/resources/e-delivery.html`,
    `${INDIVIDUAL_BASE}/resources/tax-center/distributions.html`,
    `${INDIVIDUAL_BASE}/resources/tax-center/mailing-schedule.html`,
    `${INDIVIDUAL_BASE}/resources/tax-center/faqs.html`,
  ];

  for (const path of resourcePaths) {
    paths.add(path);
  }

  return paths;
}

function collectPathsFromNavDataFile() {
  const paths = new Set();
  const navText = readFileSync(join(root, 'src/data/investorIndividualNavData.js'), 'utf8');
  const hrefRegex = /\/individual-investors[^'"`\s)]+/g;

  for (const match of navText.matchAll(hrefRegex)) {
    const normalized = hrefToUrlPath(match[0]);
    if (normalized) {
      paths.add(normalized);
    }
  }

  return paths;
}

function collectPathsFromIndividualFunds() {
  const paths = new Set();
  const teamSlugs = new Set();

  for (const fund of extracted.individualFunds || []) {
    const sharePath = hrefToUrlPath(fund.href);
    if (sharePath) {
      paths.add(sharePath);
    }

    const match = fund.href?.match(/\/investments\/([^/]+)\//);
    if (match) {
      teamSlugs.add(match[1]);
    }
  }

  for (const teamSlug of teamSlugs) {
    paths.add(`${INDIVIDUAL_BASE}/investments/${teamSlug}.html`);
  }

  return paths;
}

function paginatedDest(baseUrlPath, pageNumber) {
  const relative = baseUrlPath.replace(new RegExp(`^${INDIVIDUAL_BASE}/?`), '');
  const withoutHtml = relative.replace(/\.html$/, '');

  if (pageNumber === 1) {
    return join(outDir, `${withoutHtml}.html`);
  }

  return join(outDir, `${withoutHtml}-page-${pageNumber}.html`);
}

async function download(url, dest, { forcePaginated = false } = {}) {
  if (existsSync(dest) && !forcePaginated) {
    return { status: 'skipped', dest, url };
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const text = await response.text();
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, text);

  return { status: 'downloaded', dest, url, html: text };
}

async function main() {
  const urlPaths = new Set([
    ...collectStaticPaths(),
    ...collectPathsFromNavDataFile(),
    ...collectPathsFromIndividualFunds(),
  ]);

  const paginatedBases = [
    `${INDIVIDUAL_BASE}/news-insights/news/press-releases.html`,
    `${INDIVIDUAL_BASE}/news-insights/thought-leadership/commentaries.html`,
    `${INDIVIDUAL_BASE}/news-insights/thought-leadership/insights.html`,
  ];

  for (const basePath of paginatedBases) {
    urlPaths.delete(basePath);
  }

  const downloaded = [];
  const skipped = [];
  const failed = [];

  for (const urlPath of [...urlPaths].sort()) {
    const url = `${base}${urlPath}`;
    const dest = urlPathToDest(urlPath);

    try {
      const result = await download(url, dest);
      if (result.status === 'skipped') {
        skipped.push(dest.replace(root, '.').replace(/\\/g, '/'));
        console.log('Skipped (exists)', dest.replace(root, '.'));
      } else {
        downloaded.push(dest.replace(root, '.').replace(/\\/g, '/'));
        console.log('Downloaded', dest.replace(root, '.'));
      }
    } catch (error) {
      failed.push({ url, error: error.message });
      console.error('Failed', url, error.message);
    }

    await sleep(DELAY_MS);
  }

  for (const basePath of paginatedBases) {
    const firstUrl = `${base}${basePath}`;
    const firstDest = paginatedDest(basePath, 1);

    try {
      let firstResult;
      if (existsSync(firstDest)) {
        firstResult = {
          status: 'skipped',
          html: readFileSync(firstDest, 'utf8'),
        };
        skipped.push(firstDest.replace(root, '.').replace(/\\/g, '/'));
        console.log('Skipped (exists)', firstDest.replace(root, '.'));
      } else {
        firstResult = await download(firstUrl, firstDest);
        downloaded.push(firstDest.replace(root, '.').replace(/\\/g, '/'));
        console.log('Downloaded', firstDest.replace(root, '.'));
      }

      const pageCount = getPageCount(firstResult.html || '');

      for (let page = 2; page <= pageCount; page += 1) {
        const pageUrl = `${firstUrl}?startpage=${page}`;
        const pageDest = paginatedDest(basePath, page);

        try {
          const pageResult = await download(pageUrl, pageDest);
          if (pageResult.status === 'skipped') {
            skipped.push(pageDest.replace(root, '.').replace(/\\/g, '/'));
            console.log('Skipped (exists)', pageDest.replace(root, '.'));
          } else {
            downloaded.push(pageDest.replace(root, '.').replace(/\\/g, '/'));
            console.log('Downloaded', pageDest.replace(root, '.'));
          }
        } catch (error) {
          failed.push({ url: pageUrl, error: error.message });
          console.error('Failed', pageUrl, error.message);
        }

        await sleep(DELAY_MS);
      }

      console.log(`${basePath}: ${pageCount} page(s)`);
    } catch (error) {
      failed.push({ url: firstUrl, error: error.message });
      console.error('Failed', firstUrl, error.message);
    }

    await sleep(DELAY_MS);
  }

  console.log('\n--- Summary ---');
  console.log(`Downloaded: ${downloaded.length}`);
  console.log(`Skipped (already existed): ${skipped.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length) {
    console.log('\nFailed URLs:');
    for (const item of failed) {
      console.log(`  ${item.url} — ${item.error}`);
    }
  }

  return { downloaded, skipped, failed };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
