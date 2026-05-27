import data from '../src/data/investorProfessionalInvestmentPages.json' with { type: 'json' };
import extracted from '../src/data/investorExtracted.json' with { type: 'json' };

function balanceTrailingDivClosings(html) {
  let balanced = html.trim();
  let openCount = (balanced.match(/<div/g) || []).length;
  let closeCount = (balanced.match(/<\/div>/g) || []).length;
  while (closeCount > openCount && /<\/div>\s*(<!--[\s\S]*?-->\s*)*$/.test(balanced)) {
    balanced = balanced.replace(/\s*<\/div>(\s*(?:<!--[\s\S]*?-->)?\s*)$/, '$1').trim();
    closeCount--;
  }
  return balanced;
}

function prepareFundIntro(html) {
  return balanceTrailingDivClosings(
    html
      .replace(/^<div id="content-with-side-bar"[^>]*>/, '')
      .replace(
        /<div class="row">\s*<div class="col-xs-12">\s*<h2>Investment Process<\/h2>\s*<\/div>\s*<\/div>/i,
        '',
      ),
  );
}

const teamOrder = [
  'growth-team',
  'global-equity-team',
  'us-value-team',
  'international-value-group',
  'global-value-team',
  'sustainable-emerging-markets-team',
  'credit-team',
  'developing-world-team',
  'antero-peak-group',
  'international-small-mid-team',
  'emsights-capital-group',
];

const report = [];

for (const teamSlug of teamOrder) {
  const team = data.teams[teamSlug];
  report.push({
    type: 'team',
    href: `/investment-professionals/investments/${teamSlug}`,
    ok: Boolean(team?.content?.html && team?.scrollSpy?.length),
    heading: team?.heading,
  });
}

for (const fund of extracted.professionalFunds) {
  for (const sc of ['advisor', 'investor', 'institutional']) {
    const href = fund[sc]?.href;
    if (!href) continue;
    const m = href.match(/\/investments\/([^/]+)\/([^/?#]+)/);
    if (!m) continue;
    const key = `${m[1]}/${m[2].replace(/\.html$/, '')}`;
    const page = data.funds[key];
    const intro = page?.content?.introHtml || '';
    const prepared = prepareFundIntro(intro);
    const balanced = (prepared.match(/<div/g) || []).length === (prepared.match(/<\/div>/g) || []).length;
    report.push({
      type: 'fund',
      shareClass: sc,
      href: `/investment-professionals/investments/${key}`,
      ok: Boolean(page && balanced && page.content?.sectionsHtml && page.shareClasses?.length),
      heading: page?.heading,
      ticker: fund[sc]?.ticker,
    });
  }
}

const failed = report.filter((r) => !r.ok);
console.log('Total pages:', report.length);
console.log('Passed:', report.filter((r) => r.ok).length);
console.log('Failed:', failed.length);
if (failed.length) failed.forEach((f) => console.log(f));

console.log('\n--- By team (advisor fund links) ---');
for (const teamSlug of teamOrder) {
  const funds = report.filter((r) => r.type === 'fund' && r.shareClass === 'advisor' && r.href.includes(`/${teamSlug}/`));
  console.log(`\n${teamSlug} (${data.teams[teamSlug]?.heading})`);
  console.log(`  Team page: ${report.find((r) => r.type === 'team' && r.href.endsWith(teamSlug))?.ok ? 'OK' : 'FAIL'}`);
  funds.forEach((f) => console.log(`  ${f.ok ? 'OK' : 'FAIL'} ${f.href.replace('/investment-professionals/investments/', '')}`));
}
