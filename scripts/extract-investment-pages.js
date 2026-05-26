import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'pages-src', 'investments');
const extracted = JSON.parse(readFileSync(join(root, 'src/data/investorExtracted.json'), 'utf8'));

function decodeHtml(text) {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8482;/g, '™')
    .replace(/&#174;/g, '®')
    .replace(/<sup>SM<\/sup>/g, 'SM')
    .replace(/<br\s*\/?>/gi, ' ')
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, ' '));
}

function localHref(href) {
  if (!href || href.startsWith('http')) {
    return href;
  }

  return href.replace(/\.html(?=($|\?|#))/, '');
}

function assetHref(href) {
  if (!href) {
    return href;
  }

  if (href.startsWith('http')) {
    return href;
  }

  if (href.startsWith('/content/dam/')) {
    return href;
  }

  return localHref(href);
}

function extractBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) {
    return '';
  }

  const end = html.indexOf(endMarker, start + startMarker.length);
  if (end === -1) {
    return html.slice(start);
  }

  return html.slice(start, end);
}

function extractPageHeading(html) {
  return decodeHtml(html.match(/id="page-title"[\s\S]*?<h1>([\s\S]*?)<\/h1>/)?.[1] || '');
}

function extractPageTitle(html) {
  return decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] || '');
}

function extractPlaylistId(html) {
  return html.match(/data-media-id="(\d+)"/)?.[1] || null;
}

function extractSidebar(html) {
  const wrapper = extractBetween(html, 'id="side-bar-wrapper"', 'id="content-with-side-bar"');
  if (!wrapper) {
    return [];
  }

  const panels = [];
  for (const block of wrapper.split('<div class="side-bar">').slice(1)) {
    const title = decodeHtml(block.match(/<h2>([^<]+)/)?.[1] || 'At a Glance');
    const lists = [];

    for (const listMatch of block.matchAll(/<ul class="side-bar-list">([\s\S]*?)<\/ul>/g)) {
      const listHtml = listMatch[1];
      const heading = decodeHtml(listMatch[1].match(/<li class="heading">([^<]+)/)?.[1] || '');
      const items = [];

      for (const liMatch of listHtml.matchAll(/<li([^>]*)>([\s\S]*?)<\/li>/g)) {
        if (/class="heading"/.test(liMatch[1])) {
          continue;
        }

        const liHtml = liMatch[2];
        const nestedList = liHtml.match(/<ul>([\s\S]*?)<\/ul>/);
        const linkMatch = liHtml.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);

        if (nestedList) {
          const parentLink = linkMatch
            ? { label: stripTags(linkMatch[2]), href: localHref(linkMatch[1]) }
            : { label: stripTags(liHtml.split('<ul>')[0]), href: null };
          const children = [];

          for (const child of nestedList[1].matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
            children.push({
              label: stripTags(child[2]),
              href: localHref(child[1]),
            });
          }

          items.push({ type: 'group', ...parentLink, children });
          continue;
        }

        if (linkMatch) {
          items.push({
            type: 'link',
            label: stripTags(linkMatch[2]),
            href: localHref(linkMatch[1]),
            external: linkMatch[1].startsWith('/content/dam/'),
          });
          continue;
        }

        const text = stripTags(liHtml);
        if (text) {
          items.push({ type: 'text', text });
        }
      }

      if (heading || items.length) {
        lists.push({ heading, items });
      }
    }

    panels.push({ title, lists });
  }

  return panels;
}

function extractRichContent(html) {
  const blocks = [];
  const regex = /<(p|h4|h3|ul class="bullets")[^>]*>([\s\S]*?)<\/\1>/g;
  let match = regex.exec(html);

  while (match) {
    const tag = match[1];
    const inner = match[2].trim();
    if (!inner) {
      match = regex.exec(html);
      continue;
    }

    if (tag.startsWith('ul')) {
      const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((item) =>
        stripTags(item[1]),
      );
      blocks.push({ type: 'bullets', items });
    } else if (tag === 'h3' || tag === 'h4') {
      blocks.push({ type: tag, text: stripTags(inner) });
    } else if (/<a class="btn btn-default"/.test(inner)) {
      const btn = inner.match(/<a class="btn btn-default"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      if (btn) {
        blocks.push({
          type: 'button',
          label: stripTags(btn[2]),
          href: btn[1],
          external: btn[1].startsWith('/content/dam/'),
        });
      }
    } else {
      blocks.push({ type: 'paragraph', html: inner, text: stripTags(inner) });
    }

    match = regex.exec(html);
  }

  return blocks;
}

function extractManagementCards(html) {
  const cards = [];
  const regex =
    /<ul class="management"><li class="name">([^<]+)<\/li><li class="position">([^<]+)<\/li><li class="yie"><span class="years">([^<]+)<\/span>/g;
  let match = regex.exec(html);

  while (match) {
    cards.push({
      name: decodeHtml(match[1]),
      position: decodeHtml(match[2]),
      years: decodeHtml(match[3]),
    });
    match = regex.exec(html);
  }

  return cards;
}

function extractTeamMembers(html) {
  const members = [];
  const thumbRegex =
    /<li data-team-member="([^"]+)">[\s\S]*?src="([^"]+)"[\s\S]*?tm-name">([^<]+)<\/span>[\s\S]*?tm-title">([^<]+)<\/span>/g;
  let thumb = thumbRegex.exec(html);

  while (thumb) {
    members.push({
      id: thumb[1],
      image: thumb[2],
      name: decodeHtml(thumb[3]),
      title: decodeHtml(thumb[4]),
      bio: '',
      role: '',
    });
    thumb = thumbRegex.exec(html);
  }

  const scriptBlock = html.match(/ARTISAN\.team_members\s*=\s*\{([\s\S]*?)\};/)?.[1];
  if (scriptBlock) {
    for (const member of members) {
      const section = scriptBlock.match(
        new RegExp(`${member.id}:\\s*\\{[\\s\\S]*?name:\\s*"([^"]+)"[\\s\\S]*?heading:\\s*"([^"]*)"[\\s\\S]*?copy:\\s*\\["([\\s\\S]*?)"\\]`,),
      );
      if (section) {
        member.name = decodeHtml(section[1]);
        member.role = decodeHtml(section[2]);
        member.bio = decodeHtml(section[3]);
      }
    }
  }

  return members;
}

function extractAccordions(html) {
  const sections = [];
  const regex =
    /accordion-toggle[\s\S]*?<span class="h2">([^<]+)<\/span>[\s\S]*?accordion-content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
  let match = regex.exec(html);

  while (match) {
    sections.push({
      title: decodeHtml(match[1]),
      blocks: extractRichContent(match[2]),
      tables: [...match[2].matchAll(/<table[\s\S]*?<\/table>/g)].map((table) => table[0]),
    });
    match = regex.exec(html);
  }

  return sections;
}

function extractTeamPage(html) {
  const main = extractBetween(html, 'id="content-with-side-bar"', 'id="footer-wrapper"');
  const processSection = extractBetween(html, 'title="Investment Process"', 'title="Meet the Team"');

  return {
    pageTitle: extractPageTitle(html),
    heading: extractPageHeading(html),
    playlistId: extractPlaylistId(html),
    sidebar: extractSidebar(html),
    investmentProcess: {
      blocks: extractRichContent(processSection),
    },
    teamMembers: extractTeamMembers(html),
    hasMainVideo: Boolean(extractPlaylistId(main)),
  };
}

function extractStrategyPage(html) {
  const main = extractBetween(html, 'id="content-with-side-bar"', 'id="footer-wrapper"');

  return {
    pageTitle: extractPageTitle(html),
    heading: extractPageHeading(html),
    sidebar: extractSidebar(html),
    introHeading: decodeHtml(main.match(/<h2>([^<]+)<\/h2>/)?.[1] || ''),
    managementIntro: stripTags(
      main.match(/<h3>Management<\/h3>[\s\S]*?<div class="col-md-9">[\s\S]*?<\/div>\s*<\/div>/)?.[0] ||
        '',
    ).replace(/^Management\s*/, ''),
    managementCards: extractManagementCards(main),
    investmentProcessBlocks: extractRichContent(
      extractBetween(main, '<h3>Investment Process</h3>', '<h3>Other Strategies Managed</h3>') || main,
    ),
    otherStrategies: [...main.matchAll(/<h3>Other Strategies Managed<\/h3>[\s\S]*?<a href="([^"]+)">([^<]+)<\/a>/g)].map(
      (match) => ({
        href: localHref(match[1]),
        label: decodeHtml(match[2]),
      }),
    ),
    playlistId: extractPlaylistId(main),
    accordions: extractAccordions(main),
  };
}

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

const teams = {};
const strategies = {};
const teamSlugs = new Set();

for (const team of extracted.institutionalTeams) {
  for (const strategy of team.strategies || []) {
    if (!strategy.href || strategy.href.startsWith('http')) {
      continue;
    }

    const parsed = parseHref(strategy.href);
    if (parsed) {
      teamSlugs.add(parsed.teamSlug);
    }
  }
}

for (const teamSlug of teamSlugs) {
  const filePath = join(pagesDir, `${teamSlug}.html`);
  if (!existsSync(filePath)) {
    console.warn('Missing team page', teamSlug);
    continue;
  }

  teams[teamSlug] = extractTeamPage(readFileSync(filePath, 'utf8'));
}

for (const team of extracted.institutionalTeams) {
  for (const strategy of team.strategies || []) {
    if (!strategy.href || strategy.href.startsWith('http')) {
      continue;
    }

    const parsed = parseHref(strategy.href);
    if (!parsed) {
      continue;
    }

    const filePath = join(pagesDir, parsed.teamSlug, `${parsed.strategySlug}.html`);
    if (!existsSync(filePath)) {
      console.warn('Missing strategy page', filePath);
      continue;
    }

    strategies[`${parsed.teamSlug}/${parsed.strategySlug}`] = extractStrategyPage(
      readFileSync(filePath, 'utf8'),
    );
  }
}

const output = { teams, strategies };
writeFileSync(join(root, 'src/data/investorInvestmentPages.json'), JSON.stringify(output, null, 2));
console.log(
  JSON.stringify(
    {
      teams: Object.keys(teams).length,
      strategies: Object.keys(strategies).length,
    },
    null,
    2,
  ),
);
