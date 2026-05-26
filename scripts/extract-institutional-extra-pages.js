import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSET_BASE = 'https://www.artisanpartners.com';

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

function extractLinkCell(html) {
  const linkMatch = html.match(/<a[^>]+href="([^"]+)"(?:[^>]*title="([^"]*)")?[^>]*>([\s\S]*?)<\/a>/);
  if (!linkMatch) {
    return null;
  }

  const href = linkMatch[1];
  return {
    label: stripTags(linkMatch[3]) || 'Resources',
    href: resolveHref(href.split('?')[0]) + (href.includes('?') ? `?${href.split('?')[1]}` : ''),
    query: href.includes('?') ? href.split('?')[1] : null,
  };
}

function extractDocumentLink(html) {
  const linkMatch = html.match(
    /<a[^>]+(?:target="_blank"[^>]*)?href="([^"]+)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/a>/,
  );

  if (!linkMatch) {
    const lockedMatch = html.match(/<a href="#"[^>]*>([\s\S]*?)<\/a>/);
    if (lockedMatch) {
      return {
        label: stripTags(lockedMatch[1]),
        locked: true,
      };
    }

    return null;
  }

  if (linkMatch[1] === '#') {
    return {
      label: stripTags(linkMatch[3]),
      locked: html.includes('icon-locked'),
    };
  }

  return {
    label: stripTags(linkMatch[3]) || linkMatch[2],
    href: resolveHref(linkMatch[1]),
    external: true,
  };
}

function extractDefinedContribution() {
  const html = readFileSync(join(root, 'pages-src/defined-contribution.html'), 'utf8');
  const heroMatch = html.match(/id="cqc-carousel-defined-contribution"[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>[\s\S]*?<span class="carousel-subhead"[^>]*>([\s\S]*?)<\/span>/);
  const bannerPath = '/content/dam/images/carousel/dc-home-page-banner-mar-2017-1170x253.jpg';

  const teams = [];
  const tableMatch = html.match(/<table id="hp-fund-listing"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/);
  const tbody = tableMatch?.[1] || '';
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  let rowMatch;
  let currentTeam = null;

  while ((rowMatch = rowRegex.exec(tbody)) !== null) {
    const row = rowMatch[1];

    if (row.includes('class="h3 team"')) {
      currentTeam = stripTags(row);
      teams.push({ type: 'team', name: currentTeam });
      continue;
    }

    const strategyLink = row.match(/<td><a href="([^"]+)">([\s\S]*?)<\/a><\/td>/);
    if (!strategyLink) {
      continue;
    }

    const resourcesCell = row.match(/<td class="resources-col">([\s\S]*?)<\/td>/);
    const resourcesLink = resourcesCell ? extractLinkCell(resourcesCell[1]) : null;

    teams.push({
      type: 'strategy',
      team: currentTeam,
      label: stripTags(strategyLink[2]),
      href: resolveHref(strategyLink[1]),
      resources: resourcesLink,
    });
  }

  const insights = [];
  const insightRegex = /<ul class="short-article">([\s\S]*?)<\/ul>/g;
  let insightMatch;

  while ((insightMatch = insightRegex.exec(html)) !== null) {
    const block = insightMatch[1];
    const image = html.slice(Math.max(0, insightMatch.index - 400), insightMatch.index).match(
      /<img[^>]+src="([^"]+)"/,
    )?.[1];
    const title = stripTags(block.match(/<li class="title">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '');
    const description = stripTags(
      block.match(/<li class="description">\s*([\s\S]*?)\s*<\/li>/)?.[1] || '',
    );
    const ctaMatch = block.match(/<li class="cta">[\s\S]*?<a href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/);

    if (title && ctaMatch) {
      insights.push({
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

  return {
    pageTitle: decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] || ''),
    heading: stripTags(heroMatch?.[1] || 'Partnering for Innovative Retirement Solutions'),
    intro: stripTags(heroMatch?.[2] || ''),
    bannerImage: resolveImage(bannerPath),
    teams,
    loginPanel: {
      heading: 'Log In  |  Register for Exclusive Access',
      bullets: ['Vehicle Summary', 'Attribution', 'CIT'],
      ctaLabel: 'Log In  |  Register',
      href: '/institutional-investors/user-login-registration',
    },
    insights,
  };
}

function extractFilterOptions(html) {
  const selectMatch = html.match(/<select name="resources-select"[\s\S]*?<\/select>/);
  if (!selectMatch) {
    return [];
  }

  const options = [];
  const optionRegex = /<option value="([^"]*)"([^>]*)>([\s\S]*?)<\/option>/g;
  let match;

  while ((match = optionRegex.exec(selectMatch[0])) !== null) {
    if (match[2].includes('disabled')) {
      continue;
    }

    options.push({
      value: match[1],
      label: decodeHtml(match[3]),
    });
  }

  return options;
}

function extractTeamLegend(html) {
  const legend = [];
  const tableMatch = html.match(/<table id="team-id-key">([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    return legend;
  }

  const cellRegex = /<span class="team-id ([^"]+)"><\/span>\s*([^<]+)/g;
  let match;

  while ((match = cellRegex.exec(tableMatch[1])) !== null) {
    legend.push({
      teamSlug: match[1],
      label: decodeHtml(match[2]),
    });
  }

  return legend;
}

function extractResourceRows(html) {
  const rows = [];
  const tableMatch = html.match(/<table id="resources" class="table">([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    return rows;
  }

  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null) {
    const row = rowMatch[1];

    if (row.includes('class="heading"')) {
      continue;
    }

    const teamSlug = row.match(/data-text="([^"]+)"/)?.[1] || null;
    const cells = [...row.matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/g)].map((cell) => cell[2]);

    if (cells.length < 5) {
      continue;
    }

    const nameCell = cells[1];
    const strategyMatch = nameCell.match(
      /<a href="([^"]+)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/a>/,
    );
    const isFund = nameCell.includes('class="fund-name"');
    const strategyHref = strategyMatch ? resolveHref(strategyMatch[1]) : null;
    const investmentPath = strategyHref?.match(/\/investments\/([^/?#]+)/)?.[1];
    const strategyTag = investmentPath ? `artisanpartners:team-name/${investmentPath}` : null;

    let currentStrategyTag = strategyTag;
    if (!currentStrategyTag && isFund && rows.length > 0) {
      const lastStrategy = [...rows].reverse().find((item) => item.type === 'strategy');
      currentStrategyTag = lastStrategy?.strategyTag || null;
    }

    rows.push({
      type: isFund ? 'fund' : 'strategy',
      teamSlug,
      strategyTag: currentStrategyTag,
      name: strategyMatch ? stripTags(strategyMatch[3]) : stripTags(nameCell),
      strategyHref,
      commentaries: extractDocumentLink(cells[2]),
      factSheets: extractDocumentLink(cells[3]),
      attribution: extractDocumentLink(cells[4]),
      vehicles: isFund ? ['fund'] : ['strategy'],
    });
  }

  return rows;
}

function extractResources() {
  const html = readFileSync(join(root, 'pages-src/resources.html'), 'utf8');

  return {
    pageTitle: decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] || ''),
    heading: decodeHtml(html.match(/id="page-title"[\s\S]*?<h1>([\s\S]*?)<\/h1>/)?.[1] || 'Resources'),
    filterOptions: extractFilterOptions(html),
    teamLegend: extractTeamLegend(html),
    rows: extractResourceRows(html),
    footnote: stripTags(
      html.match(/Artisan Partners sub-advises collective investment trusts[\s\S]*?<\/p>/)?.[0] || '',
    ),
  };
}

const definedContribution = extractDefinedContribution();
const resources = extractResources();

writeFileSync(
  join(root, 'src/data/investorDefinedContributionPages.json'),
  `${JSON.stringify(definedContribution, null, 2)}\n`,
);
writeFileSync(
  join(root, 'src/data/investorResourcesPages.json'),
  `${JSON.stringify(resources, null, 2)}\n`,
);

console.log(
  `Defined Contribution: ${definedContribution.teams.length} rows, ${definedContribution.insights.length} insights`,
);
console.log(`Resources: ${resources.rows.length} rows, ${resources.filterOptions.length} filter options`);
