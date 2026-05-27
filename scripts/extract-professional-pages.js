import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'pages-src', 'professional');
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
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, ' '));
}

function localHref(href, siteBase = '/investment-professionals') {
  if (!href || href.startsWith('http') || href.startsWith('/content/dam/')) {
    return href;
  }

  return href
    .replace(/\.html(?=($|\?|#))/, '')
    .replace(/^\/investment-professionals/, siteBase);
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

function extractDivFromMarker(html, idMarker, endMarker) {
  const markerIndex = html.indexOf(idMarker);
  if (markerIndex === -1) {
    return '';
  }

  const divStart = html.lastIndexOf('<div', markerIndex);
  const sliceStart = divStart === -1 ? markerIndex : divStart;
  const end = html.indexOf(endMarker, markerIndex);

  if (end === -1) {
    return html.slice(sliceStart);
  }

  return html.slice(sliceStart, end);
}

function repairBrokenDivOpen(html) {
  if (!html) {
    return '';
  }

  return html.replace(/^id="([^"]+)"(\s[^>]*)?>/, '<div id="$1"$2>');
}

function extractPageHeading(html) {
  return decodeHtml(html.match(/id="page-title"[\s\S]*?<h1>([\s\S]*?)<\/h1>/)?.[1] || '');
}

function extractPageTitle(html) {
  return decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] || '');
}

function extractSidebar(html) {
  const wrapper = extractBetween(html, 'id="side-bar-wrapper"', 'id="content-with-side-bar"');
  if (!wrapper) {
    return [];
  }

  const panels = [];
  const h4Panels = [...wrapper.matchAll(/<h4>([^<]+)<\/h4>([\s\S]*?)(?=<h4>|$)/g)];

  if (h4Panels.length) {
    for (const match of h4Panels) {
      const lists = parseSidebarLists(match[2]);
      if (lists.length) {
        panels.push({ title: decodeHtml(match[1]), lists });
      }
    }
  } else {
    const title = decodeHtml(wrapper.match(/<h2>([^<]+)<\/h2>/)?.[1] || 'At a Glance');
    const lists = parseSidebarLists(wrapper);
    if (lists.length) {
      panels.push({ title, lists });
    }
  }

  return panels;
}

function parseSidebarLists(body) {
  const lists = [];
  const listBlocks = [...body.matchAll(/<ul class="side-bar-list">([\s\S]*?)<\/ul>/g)];

  for (const listBlock of listBlocks) {
    const listHtml = listBlock[1];
    const heading = decodeHtml(listHtml.match(/<li class="heading">([^<]*)<\/li>/)?.[1] || '') || null;
    const items = [];

    for (const liMatch of listHtml.matchAll(/<li(?!\s+class="heading")[^>]*>([\s\S]*?)<\/li>/g)) {
      const liContent = liMatch[1];
      const linkMatch = liContent.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);

      if (linkMatch) {
        items.push({
          type: 'link',
          label: stripTags(linkMatch[2]),
          href: localHref(linkMatch[1]),
          external:
            linkMatch[1].startsWith('http') ||
            linkMatch[1].startsWith('/content/dam/') ||
            /target="_blank"/.test(liContent),
        });
      } else {
        const text = stripTags(liContent);
        if (text) {
          items.push({ type: 'text', text });
        }
      }
    }

    if (items.length) {
      lists.push({ heading, items });
    }
  }

  const investMatch = body.match(/<a class="btn btn-default" href="([^"]+)"[^>]*>([^<]+)<\/a>/);
  if (investMatch) {
    lists.push({
      heading: null,
      items: [
        {
          type: 'link',
          label: stripTags(investMatch[2]),
          href: localHref(investMatch[1]),
          external: false,
        },
      ],
    });
  }

  return lists;
}

function extractShareClasses(html) {
  const pageTitle =
    extractBetween(html, 'id="page-title"', 'id="scrollspy"') ||
    extractBetween(html, 'id="page-title"', 'id="page-title-mobile"');

  if (!pageTitle) {
    return [];
  }

  const menu = pageTitle.match(/<ul class="dropdown-menu"[^>]*>([\s\S]*?)<\/ul>/)?.[1] || '';
  const items = [];

  for (const match of menu.matchAll(/<li(?:\s+class="([^"]*)")?[^>]*>([\s\S]*?)<\/li>/g)) {
    const disabled = match[1]?.includes('disabled');
    const liHtml = match[2];
    const linkMatch = liHtml.match(/<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
    const label = stripTags(linkMatch?.[2] || liHtml);

    if (!label) {
      continue;
    }

    items.push({
      label,
      href:
        linkMatch && !linkMatch[1].startsWith('javascript') ? localHref(linkMatch[1]) : null,
      active: disabled,
    });
  }

  return items;
}

function extractScrollSpy(html) {
  const scrollSpyBlock = extractBetween(html, 'id="scrollspy"', 'id="ss-1"');
  const navHtml =
    scrollSpyBlock?.match(/<ul class="nav">([\s\S]*?)<\/ul>/)?.[1] ||
    html.match(/id="scrollspy"[\s\S]*?<ul class="nav">([\s\S]*?)<\/ul>/)?.[1] ||
    '';

  return [...navHtml.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => ({
    href: match[1],
    label: stripTags(match[2]),
  }));
}

function extractRichContent(html) {
  const blocks = [];
  const parts = html.split(/(?=<h[34]>|<p>|<ul>|<table)/g).filter(Boolean);

  for (const part of parts) {
    if (/^<h3>/.test(part)) {
      blocks.push({ type: 'h3', text: stripTags(part.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] || '') });
    } else if (/^<h4>/.test(part)) {
      blocks.push({ type: 'h4', text: stripTags(part.match(/<h4>([\s\S]*?)<\/h4>/)?.[1] || '') });
    } else if (/^<p>/.test(part)) {
      blocks.push({
        type: 'paragraph',
        html: part.match(/<p>([\s\S]*?)<\/p>/)?.[1] || '',
        text: stripTags(part),
      });
    } else if (/^<ul>/.test(part)) {
      blocks.push({
        type: 'list',
        items: [...part.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((item) => stripTags(item[1])),
      });
    } else if (/^<table/.test(part)) {
      blocks.push({ type: 'table', html: part.match(/<table[\s\S]*?<\/table>/)?.[0] || part });
    }
  }

  return blocks.filter((block) => {
    if (block.type === 'paragraph' || block.type === 'h3' || block.type === 'h4') {
      return block.text;
    }

    if (block.type === 'list') {
      return block.items.length > 0;
    }

    return true;
  });
}

function extractMainContent(html) {
  if (!html) {
    return { blocks: [], html: '' };
  }

  let main = extractDivFromMarker(html, 'id="content-with-side-bar"', 'id="footer-wrapper"');
  if (!main) {
    main = extractBetween(html, 'id="content-with-side-bar"', 'id="footer-wrapper"');
  }
  if (!main) {
    main = html;
  }

  main = repairBrokenDivOpen(main);

  return {
    blocks: extractRichContent(main),
    html: main,
  };
}

function stripPageTitleFromMain(main) {
  if (!main) {
    return main;
  }

  return main
    .replace(
      /[\s\S]*?<!-- ######### START PAGE TITLE MOBILE ######### -->[\s\S]*?<!-- end: #page-title-mobile -->/i,
      '',
    )
    .replace(/<div id="page-title"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, '');
}

function extractFundPage(html) {
  const fullMain =
    extractDivFromMarker(html, 'id="content-with-side-bar"', 'id="footer-wrapper"') || '';
  const splitMatch = fullMain.match(/<div id="ss-2"/);
  const splitIndex = splitMatch ? splitMatch.index : -1;
  const introHtml = repairBrokenDivOpen(
    splitIndex > -1 ? fullMain.slice(0, splitIndex) : fullMain,
  );
  const sectionsHtml = splitIndex > -1 ? fullMain.slice(splitIndex) : '';

  return {
    pageTitle: extractPageTitle(html),
    heading: extractPageHeading(html),
    shareClasses: extractShareClasses(html),
    scrollSpy: extractScrollSpy(html),
    sidebar: extractSidebar(html),
    content: {
      blocks: extractRichContent(introHtml),
      html: fullMain,
      introHtml,
      sectionsHtml,
    },
  };
}

function extractTeamPage(html) {
  const processSection = extractBetween(html, 'title="Investment Process"', 'title="Meet the Team"');
  const contentHtml = (
    extractDivFromMarker(html, 'id="ss-1"', '<!-- end: #page-wrapper -->') || ''
  ).replace(/<\/div>\s*$/i, '');

  return {
    pageTitle: extractPageTitle(html),
    heading: extractPageHeading(html),
    playlistId: html.match(/data-media-id="(\d+)"/)?.[1] || null,
    scrollSpy: extractScrollSpy(html),
    sidebar: extractSidebar(html),
    investmentProcess: {
      blocks: extractRichContent(processSection),
    },
    content: {
      html: contentHtml,
    },
    hasMainVideo: Boolean(html.match(/data-media-id="(\d+)"/)),
  };
}

function extractStaticPage(html) {
  const main = extractBetween(html, 'id="page-wrapper"', 'id="footer-wrapper"');
  const contentWithSidebar =
    extractBetween(main, 'id="content-with-side-bar"', 'id="important-disclosures"') ||
    extractBetween(main, 'id="content-with-side-bar"', 'id="footer-wrapper"');
  const contentArea = contentWithSidebar || stripPageTitleFromMain(main) || main;

  return {
    pageTitle: extractPageTitle(html),
    heading: extractPageHeading(html) || extractPageTitle(html).replace('Artisan Partners | ', ''),
    sidebar: extractSidebar(html),
    content: extractMainContent(contentArea || html),
  };
}

function readPage(relativePath) {
  const candidates = [
    join(pagesDir, 'investment-professionals', `${relativePath}.html`),
    join(pagesDir, `${relativePath}.html`),
  ];

  for (const filePath of candidates) {
    if (existsSync(filePath)) {
      return readFileSync(filePath, 'utf8');
    }
  }

  return null;
}

const teams = {};
const funds = {};
const contentPages = {};

for (const fund of extracted.professionalFunds) {
  const teamSlugFromAdvisor = fund.advisor?.href?.match(/\/investments\/([^/]+)\//)?.[1];

  if (teamSlugFromAdvisor && !teams[teamSlugFromAdvisor]) {
    const teamHtml = readPage(`investments/${teamSlugFromAdvisor}`);
    if (teamHtml) {
      teams[teamSlugFromAdvisor] = extractTeamPage(teamHtml);
    }
  }

  for (const shareClass of ['investor', 'advisor', 'institutional']) {
    const href = fund[shareClass]?.href;
    const match = href?.match(/\/investments\/([^/]+)\/([^/?#]+)/);
    if (!match) {
      continue;
    }

    const teamSlug = match[1];
    const fundSlug = match[2].replace(/\.html$/, '');
    const fundHtml = readPage(`investments/${teamSlug}/${fundSlug}`);
    if (fundHtml) {
      funds[`${teamSlug}/${fundSlug}`] = extractFundPage(fundHtml);
    }
  }
}

const staticPaths = [
  'about-us/overview',
  'about-us/who-we-are',
  'about-us/investment-culture',
  'about-us/business-model',
  'about-us/investment-strategies',
  'performance/performance',
  'performance/ratings-rankings',
  'news-insights/news/press-releases',
  'news-insights/thought-leadership/commentaries',
  'news-insights/thought-leadership/insights',
  'news-insights/research-data/attribution',
  'news-insights/research-data/fact-sheets',
  'news-insights/research-data/holdings',
  'news-insights/research-data/presentation-books',
  'news-insights/research-data/sample-rfp',
  'news-insights/advanced-document-filtering',
  'resources/prospectus',
  'resources/share-class-requirements',
  'resources/tax-center/distributions',
  'resources/tax-center/mailing-schedule',
  'resources/tax-center/faqs',
];

for (const relativePath of staticPaths) {
  const html = readPage(relativePath);
  if (html) {
    contentPages[relativePath] = extractStaticPage(html);
  }
}

writeFileSync(
  join(root, 'src/data/investorProfessionalInvestmentPages.json'),
  JSON.stringify({ teams, funds }, null, 2),
);
writeFileSync(
  join(root, 'src/data/investorProfessionalContentPages.json'),
  JSON.stringify(contentPages, null, 2),
);

console.log(
  JSON.stringify({
    teams: Object.keys(teams).length,
    funds: Object.keys(funds).length,
    contentPages: Object.keys(contentPages).length,
  }),
);
