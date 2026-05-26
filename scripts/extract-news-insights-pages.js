import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inferArticleTags } from '../src/utils/investorNewsInsightsFilter.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'pages-src', 'news-insights');
const ASSET_BASE = 'https://www.artisanpartners.com';
const INVESTOR_BASE = '/institutional-investors';

function decodeHtml(text) {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, ' '));
}

function resolveHref(href) {
  if (!href || href.startsWith('http')) {
    return href;
  }

  if (href.startsWith('/content/dam/')) {
    return `${ASSET_BASE}${href}`;
  }

  return href.replace(/\.html(?=($|\?|#))/, '');
}

function resolveImage(src) {
  if (!src) {
    return src;
  }

  if (src.startsWith('http')) {
    return src;
  }

  return `${ASSET_BASE}${src}`;
}

function extractPageMeta(html) {
  return {
    pageTitle: decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] || ''),
    heading: decodeHtml(html.match(/id="page-title"[\s\S]*?<h1>([\s\S]*?)<\/h1>/)?.[1] || ''),
  };
}

function extractResultSummary(html) {
  const match = html.match(/Showing (\d+) - (\d+) of (\d+) results/);
  if (!match) {
    return null;
  }

  return {
    from: Number(match[1]),
    to: Number(match[2]),
    total: Number(match[3]),
  };
}

function extractFilterOptions(html) {
  const selectMatch = html.match(/<select name="tagselection"[\s\S]*?<\/select>/);
  if (!selectMatch) {
    return [];
  }

  const options = [];
  const optionRegex = /<option value="([^"]*)"([^>]*)>([\s\S]*?)<\/option>/g;
  let match;

  while ((match = optionRegex.exec(selectMatch[0])) !== null) {
    options.push({
      value: match[1],
      label: decodeHtml(match[3]),
      selected: match[2].includes('selected'),
    });
  }

  return options;
}

function extractPressReleaseArticles(html) {
  const articles = [];
  const rowRegex =
    /<div class="row subsection">[\s\S]*?<span class="article-date">\s*([\s\S]*?)<\/span>[\s\S]*?<ul class="article">([\s\S]*?)<\/ul>[\s\S]*?<\/div>\s*<\/div>/g;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const block = match[2];
    const title = stripTags(block.match(/<li class="title">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '');
    const description = stripTags(
      block.match(/<li class="description">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '',
    );

    const links = [];
    const linkRegex =
      /<a href="([^"]+)"[^>]*title="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/a>/g;
    let linkMatch;

    while ((linkMatch = linkRegex.exec(block)) !== null) {
      const label = stripTags(linkMatch[3]);
      links.push({
        label,
        href: resolveHref(linkMatch[1]),
        external: linkMatch[1].startsWith('/content/dam/') || linkMatch[1].startsWith('http'),
      });
    }

    if (title) {
      articles.push({
        date: decodeHtml(match[1]),
        title,
        description,
        links,
      });
    }
  }

  return articles;
}

function assignTags(articles, filterOptions) {
  return articles.map((article) => ({
    ...article,
    tags: inferArticleTags(article, filterOptions),
  }));
}

function extractFeaturedArticles(html) {
  const articles = [];
  const blockRegex = /<ul class="featured-article">([\s\S]*?)<\/ul>/g;
  let match;

  while ((match = blockRegex.exec(html)) !== null) {
    const block = match[1];
    const image = block.match(/<img[^>]+src="([^"]+)"/)?.[1];
    const title = stripTags(block.match(/<li class="title">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '');
    const description = stripTags(
      block.match(/<li class="description">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '',
    );
    const ctaMatch = block.match(
      /<li class="cta">[\s\S]*?<a href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/,
    );

    if (title && ctaMatch) {
      articles.push({
        image: resolveImage(image),
        title,
        description,
        ctaLabel: stripTags(ctaMatch[2]),
        href: resolveHref(ctaMatch[1]),
        external:
          ctaMatch[1].startsWith('/content/dam/') || ctaMatch[1].startsWith('http'),
      });
    }
  }

  return articles;
}

function extractShortArticles(html) {
  const articles = [];
  const rowRegex =
    /<div class="row subsection">[\s\S]*?(?:<div class="hidden-xs col-sm-2">[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?)<div class="col-sm-10">[\s\S]*?<ul class="short-article">([\s\S]*?)<\/ul>[\s\S]*?<\/div>\s*<\/div>/g;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const block = match[2];
    const image = match[1];
    const title = stripTags(block.match(/<li class="title">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '');
    const description = stripTags(
      block.match(/<li class="description">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '',
    );
    const ctaMatch = block.match(
      /<li class="cta">[\s\S]*?<a href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/,
    );

    if (title && ctaMatch) {
      articles.push({
        image: resolveImage(image),
        title,
        description,
        ctaLabel: stripTags(ctaMatch[2]),
        href: resolveHref(ctaMatch[1]),
        external:
          ctaMatch[1].startsWith('/content/dam/') || ctaMatch[1].startsWith('http'),
      });
    }
  }

  return articles;
}

function readAllPages(baseName) {
  const files = [`${baseName}.html`];
  let page = 2;

  while (existsSync(join(pagesDir, `${baseName}-page-${page}.html`))) {
    files.push(`${baseName}-page-${page}.html`);
    page += 1;
  }

  return files.map((file) => readFileSync(join(pagesDir, file), 'utf8'));
}

function dedupeArticles(articles) {
  const seen = new Set();

  return articles.filter((article) => {
    const key = `${article.title}|${article.href || article.links?.[0]?.href || ''}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function extractPressReleasesPage() {
  const htmlPages = readAllPages('news/press-releases');
  const firstHtml = htmlPages[0];
  const meta = extractPageMeta(firstHtml);
  const filterOptions = extractFilterOptions(firstHtml);
  const articles = assignTags(
    dedupeArticles(htmlPages.flatMap(extractPressReleaseArticles)),
    filterOptions,
  );

  return {
    ...meta,
    resultSummary: {
      from: 1,
      to: Math.min(20, articles.length),
      total: extractResultSummary(firstHtml)?.total || articles.length,
    },
    filterOptions,
    articles,
  };
}

function extractInsightsPage() {
  const htmlPages = readAllPages('thought-leadership/insights');
  const firstHtml = htmlPages[0];
  const meta = extractPageMeta(firstHtml);
  const filterOptions = extractFilterOptions(firstHtml);
  const featured = assignTags(extractFeaturedArticles(firstHtml), filterOptions);
  const articles = assignTags(
    dedupeArticles(htmlPages.flatMap(extractShortArticles)),
    filterOptions,
  );

  return {
    ...meta,
    resultSummary: {
      from: 1,
      to: Math.min(20, articles.length),
      total: extractResultSummary(firstHtml)?.total || articles.length,
    },
    filterOptions,
    featured,
    articles,
  };
}

const output = {
  pressReleases: extractPressReleasesPage(),
  insights: extractInsightsPage(),
  artisanCanvas: {
    pageTitle: 'Artisan Canvas',
    heading: 'Artisan Canvas',
    description: 'Timely insights and updates from our investment teams and firm leadership',
    ctaLabel: 'View Our Blog',
    href: 'https://www.artisancanvas.com',
  },
};

const outputPath = join(root, 'src/data/investorNewsInsightsPages.json');
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `Wrote ${outputPath} (press releases: ${output.pressReleases.articles.length}, insights: ${output.insights.articles.length}, featured: ${output.insights.featured.length})`,
);
