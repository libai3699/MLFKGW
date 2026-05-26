import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function extractTeams(html) {
  const teams = [];
  const sectionMatch = html.match(
    /Investment Teams[^<]*<\/h2>([\s\S]*?)(?:<div id="hp-highlights"|Thought Leadership)/,
  );
  if (!sectionMatch) {
    return teams;
  }

  const blocks = sectionMatch[1].split(/<h3>/).slice(1);
  for (const block of blocks) {
    const name = block.match(/^([^<]+)/)?.[1]?.trim();
    if (!name) {
      continue;
    }

    const mgmt = block.match(/Management<\/li>\s*<li>([^<]+)/)?.[1]?.trim();
    const processBlock = block.match(/Investment Process<\/li>\s*<li>([\s\S]*?)<\/li>/)?.[1];
    const investmentProcess = [];

    if (processBlock) {
      const videoMatch = processBlock.match(
        /icon-video[^>]*><\/span><a href="([^"]+)"[^>]*>([^<]+)/,
      );
      if (videoMatch) {
        investmentProcess.push({
          type: 'video',
          href: videoMatch[1],
          label: videoMatch[2].trim(),
        });
      }

      const pdfMatch = processBlock.match(
        /icon-document[^>]*><\/span><a href="([^"]+)"[^>]*>([^<]+)/,
      );
      if (pdfMatch) {
        investmentProcess.push({
          type: 'pdf',
          href: pdfMatch[1],
          label: pdfMatch[2].trim(),
          external: pdfMatch[1].includes('/content/dam/'),
        });
      }
    }

    const strategies = [...block.matchAll(/<li><a href="([^"]+)">([^<]+)<\/a><\/li>/g)]
      .filter((match) => match[1].includes('/investments/') || match[1].includes('grandview'))
      .map((match) => ({ href: match[1], label: match[2] }));

    teams.push({
      name,
      management: mgmt || '',
      investmentProcess,
      strategies,
    });
  }

  return teams;
}

function extractCarousel(html) {
  const items = [];
  const parts = html.split('class="item');
  for (const part of parts.slice(1, 3)) {
    const bgColor = part.match(/background-color:\s*([^;]+)/)?.[1]?.trim();
    const image = part.match(/carousel\/([^"\\)]+)/)?.[1]?.replace(/\\2f/g, '/');
    if (bgColor && image) {
      items.push({ bgColor, image: `carousel/${image}` });
    }
  }
  return items;
}

function extractThoughtLeadership(html) {
  const articles = [];
  const highlightsMatch = html.match(/id="hp-highlights"[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/);
  const section = highlightsMatch ? highlightsMatch[0] : html;
  const imagePaths = [...section.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  const articleRegex =
    /<ul class="short-article">[\s\S]*?<li class="title">\s*([\s\S]*?)\s*<\/li>[\s\S]*?<li class="cta">[\s\S]*?(?:<span class="icon-([^"]+)"><\/span>\s*)?<a href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/g;
  let match = articleRegex.exec(section);
  let index = 0;

  while (match) {
    articles.push({
      title: match[1].replace(/\s+/g, ' ').trim(),
      href: match[3],
      cta: match[4].replace(/\s+/g, ' ').trim(),
      icon: match[2] || null,
      image: imagePaths[index] || null,
    });
    index += 1;
    match = articleRegex.exec(section);
  }

  return articles.slice(0, 4);
}

function extractProfessionalFunds(html) {
  const rows = [];
  const rowRegex = /<tr data-category="([^"]+)">\s*([\s\S]*?)<\/tr>/g;

  for (const rowMatch of html.matchAll(rowRegex)) {
    const rowHtml = rowMatch[2];
    const fundName = rowHtml.match(/^\s*<td>([^<]+)<\/td>/)?.[1]?.trim();
    if (!fundName) {
      continue;
    }

    const linkMatches = [...rowHtml.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)];

    if (linkMatches.length === 3) {
      rows.push({
        categories: rowMatch[1],
        fundName,
        investor: { href: linkMatches[0][1], ticker: linkMatches[0][2].trim() },
        advisor: { href: linkMatches[1][1], ticker: linkMatches[1][2].trim() },
        institutional: { href: linkMatches[2][1], ticker: linkMatches[2][2].trim() },
      });
      continue;
    }

    if (linkMatches.length === 2) {
      rows.push({
        categories: rowMatch[1],
        fundName,
        investor: { href: null, ticker: null },
        advisor: { href: linkMatches[0][1], ticker: linkMatches[0][2].trim() },
        institutional: { href: linkMatches[1][1], ticker: linkMatches[1][2].trim() },
      });
    }
  }

  return rows;
}

function extractIndividualFunds(html) {
  const rows = [];
  const rowRegex =
    /<tr data-category="([^"]+)">\s*<td><a href="([^"]+)"[^>]*>([^<]+)<\/a><\/td>\s*<td>([^<]+)<\/td>/g;
  let match = rowRegex.exec(html);

  while (match) {
    rows.push({
      categories: match[1],
      href: match[2],
      label: match[3].trim(),
      team: match[4].trim(),
    });
    match = rowRegex.exec(html);
  }

  return rows;
}

function extractGlobalFunds(html) {
  const rows = [];
  const rowRegex =
    /<tr data-category="([^"]+)">\s*<td><a href="([^"]+)">([^<]+)<\/a><\/td>\s*<td><a href="([^"]+)">([^<]+)<\/a><\/td>/g;
  let match = rowRegex.exec(html);

  while (match) {
    rows.push({
      categories: match[1],
      strategyHref: match[2],
      strategyName: match[3],
      teamHref: match[4],
      teamName: match[5],
    });
    match = rowRegex.exec(html);
  }

  return rows;
}

const inst = readFileSync(join(root, 'pages-src/institutional-investors.html'), 'utf8');
const prof = readFileSync(join(root, 'pages-src/investment-professionals.html'), 'utf8');
const ind = readFileSync(join(root, 'pages-src/individual-investors.html'), 'utf8');
const aus = readFileSync(join(root, 'pages-src/global-aus.html'), 'utf8');

const data = {
  carousel: extractCarousel(inst),
  institutionalTeams: extractTeams(inst),
  professionalFunds: extractProfessionalFunds(prof),
  individualFunds: extractIndividualFunds(ind),
  thoughtLeadership: extractThoughtLeadership(inst),
  globalFunds: extractGlobalFunds(aus),
};

writeFileSync(join(root, 'src/data/investorExtracted.json'), JSON.stringify(data, null, 2));
console.log(JSON.stringify({
  institutionalTeams: data.institutionalTeams.length,
  professionalFunds: data.professionalFunds.length,
  individualFunds: data.individualFunds.length,
  carousel: data.carousel.length,
  thoughtLeadership: data.thoughtLeadership.length,
  globalFunds: data.globalFunds.length,
}, null, 2));
