import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'pages-src', 'investments');
const base = 'https://www.artisanpartners.com';
const extracted = JSON.parse(readFileSync(join(root, 'src/data/investorExtracted.json'), 'utf8'));

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

function parseHref(href) {
  const match = href?.match(/\/investments\/([^/]+)\/([^/?#]+)/);
  if (!match) {
    return null;
  }

  return {
    teamSlug: match[1],
    strategySlug: match[2].replace(/\.html$/, ''),
  };
}

async function download(url, dest) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }

  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await response.arrayBuffer()));
  console.log('Downloaded', dest.replace(root, '.'));
}

const teamSlugs = new Set();
const strategyPaths = [];

for (const team of extracted.institutionalTeams) {
  for (const strategy of team.strategies || []) {
    if (!strategy.href || strategy.href.startsWith('http')) {
      continue;
    }

    const parsed = parseHref(strategy.href);
    if (!parsed) {
      continue;
    }

    teamSlugs.add(parsed.teamSlug);
    strategyPaths.push(parsed);
  }
}

async function main() {
  for (const teamSlug of teamSlugs) {
    await download(
      `${base}/institutional-investors/investments/${teamSlug}.html`,
      join(outDir, `${teamSlug}.html`),
    );
  }

  for (const { teamSlug, strategySlug } of strategyPaths) {
    await download(
      `${base}/institutional-investors/investments/${teamSlug}/${strategySlug}.html`,
      join(outDir, teamSlug, `${strategySlug}.html`),
    );
  }

  console.log(`Done: ${teamSlugs.size} teams, ${strategyPaths.length} strategies`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
