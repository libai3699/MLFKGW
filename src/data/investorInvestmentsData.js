import extracted from './investorExtracted.json';

const INVESTMENTS_BASE = '/institutional-investors/investments';

const teamNavLabels = {
  'growth-team': 'Growth Team',
  'global-equity-team': 'Global Equity Team',
  'us-value-team': 'U.S. Value Team',
  'international-value-group': 'International Value Group',
  'global-value-team': 'Global Value Team',
  'sustainable-emerging-markets-team': 'Sustainable Emerging Markets Team',
  'credit-team': 'Credit Team',
  'developing-world-team': 'Developing World Team',
  'antero-peak-group': 'Antero Peak Group',
  'international-small-mid-team': 'International Small-Mid Team',
  'emsights-capital-group': 'EMsights Capital Group',
};

export function parseInvestmentHref(href) {
  if (!href || href.startsWith('http')) {
    return null;
  }

  const match = href.match(/\/investments\/([^/]+)\/([^/?#]+)/);
  if (!match) {
    return null;
  }

  return {
    teamSlug: match[1],
    strategySlug: match[2].replace(/\.html$/, ''),
  };
}

function buildTeams() {
  const teams = [];

  for (const team of extracted.institutionalTeams) {
    const firstStrategy = team.strategies?.find(
      (strategy) => strategy.href && !strategy.href.startsWith('http'),
    );

    if (!firstStrategy) {
      continue;
    }

    const parsed = parseInvestmentHref(firstStrategy.href);
    if (!parsed) {
      continue;
    }

    const { teamSlug } = parsed;
    const navLabel = teamNavLabels[teamSlug] || team.name;

    teams.push({
      teamSlug,
      navLabel,
      name: team.name,
      management: team.management,
      investmentProcess: team.investmentProcess,
      pageTitle: `Artisan Partners | ${navLabel}`,
      heading: `Artisan Partners ${navLabel}`,
      strategies: team.strategies
        .filter((strategy) => strategy.href && !strategy.href.startsWith('http'))
        .map((strategy) => {
          const strategyParsed = parseInvestmentHref(strategy.href);
          return {
            label: strategy.label,
            slug: strategyParsed?.strategySlug,
            href: getInvestorStrategyHref(strategyParsed?.teamSlug, strategyParsed?.strategySlug),
            pageTitle: `Artisan Partners | ${strategy.label}`,
            heading: `Artisan ${strategy.label} Strategy`,
          };
        })
        .filter((strategy) => strategy.slug),
    });
  }

  return teams;
}

export const institutionalInvestmentTeams = buildTeams();

export const institutionalInvestmentsNavRows = [
  institutionalInvestmentTeams.slice(0, 6),
  institutionalInvestmentTeams.slice(6),
];

export function getInvestorTeamHref(teamSlug, basePath = INVESTMENTS_BASE) {
  return `${basePath}/${teamSlug}`;
}

export function getInvestorStrategyHref(
  teamSlug,
  strategySlug,
  basePath = INVESTMENTS_BASE,
) {
  return `${basePath}/${teamSlug}/${strategySlug}`;
}

export function getInstitutionalInvestmentTeam(teamSlug) {
  const normalized = teamSlug?.replace(/\.html$/, '');
  return institutionalInvestmentTeams.find((team) => team.teamSlug === normalized) || null;
}

export function getInstitutionalInvestmentStrategy(teamSlug, strategySlug) {
  const team = getInstitutionalInvestmentTeam(teamSlug);
  if (!team) {
    return null;
  }

  const normalized = strategySlug?.replace(/\.html$/, '');
  const strategy = team.strategies.find((item) => item.slug === normalized);
  if (!strategy) {
    return null;
  }

  return { team, strategy };
}
