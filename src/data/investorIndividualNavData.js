import extracted from './investorExtracted.json';
import { institutionalAboutPages } from './investorNavData';

const INDIVIDUAL_BASE = '/individual-investors';
const INDIVIDUAL_INVESTMENTS_BASE = `${INDIVIDUAL_BASE}/investments`;
const INDIVIDUAL_NEWS_BASE = `${INDIVIDUAL_BASE}/news-insights`;
const INDIVIDUAL_RESOURCES_BASE = `${INDIVIDUAL_BASE}/resources`;

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

const fundOrder = {
  'growth-team': [
    'global-opportunities-fund',
    'global-discovery-fund',
    'mid-cap-fund',
    'small-cap-fund',
  ],
  'global-equity-team': ['global-equity-fund', 'international-fund'],
  'us-value-team': ['value-fund', 'mid-cap-value-fund', 'value-income-fund'],
  'international-value-group': [
    'international-value-fund',
    'international-explorer-fund',
  ],
  'global-value-team': ['global-value-fund', 'select-equity-fund'],
  'sustainable-emerging-markets-team': ['sustainable-emerging-markets-fund'],
  'credit-team': ['high-income-fund', 'floating-rate-fund'],
  'developing-world-team': ['developing-world-fund'],
  'antero-peak-group': ['focus-fund'],
  'international-small-mid-team': ['international-small-mid-fund'],
  'emsights-capital-group': [
    'emerging-markets-debt-opportunities-fund',
    'global-unconstrained-fund',
  ],
};

function stripTicker(label) {
  return String(label || '').replace(/\s*\([^)]+\)\s*$/, '').trim();
}

function buildIndividualInvestmentTeams() {
  const teamsMap = new Map();

  for (const fund of extracted.individualFunds) {
    const match = fund.href.match(/\/investments\/([^/]+)\/([^/?#]+)/);
    if (!match) {
      continue;
    }

    const teamSlug = match[1];
    const fundSlug = match[2].replace(/\.html$/, '');

    if (!teamsMap.has(teamSlug)) {
      teamsMap.set(teamSlug, {
        teamSlug,
        navLabel: teamNavLabels[teamSlug] || fund.team,
        teamHref: `${INDIVIDUAL_INVESTMENTS_BASE}/${teamSlug}`,
        items: [],
      });
    }

    teamsMap.get(teamSlug).items.push({
      label: stripTicker(fund.label),
      href: `${INDIVIDUAL_INVESTMENTS_BASE}/${teamSlug}/${fundSlug}`,
      fundSlug,
    });
  }

  for (const [teamSlug, order] of Object.entries(fundOrder)) {
    const team = teamsMap.get(teamSlug);
    if (!team) {
      continue;
    }

    team.items.sort((a, b) => {
      const fundSlugA = order.find((prefix) => a.fundSlug.startsWith(prefix));
      const fundSlugB = order.find((prefix) => b.fundSlug.startsWith(prefix));
      const idxA = fundSlugA ? order.indexOf(fundSlugA) : 999;
      const idxB = fundSlugB ? order.indexOf(fundSlugB) : 999;
      return idxA - idxB;
    });

    team.items = team.items.map(({ fundSlug: _, ...rest }) => rest);
  }

  return teamOrder.map((teamSlug) => teamsMap.get(teamSlug)).filter(Boolean);
}

export const individualInvestmentTeams = buildIndividualInvestmentTeams();

export const individualNewsInsightsNav = {
  news: {
    heading: 'News',
    items: [
      {
        slug: 'press-releases',
        label: 'Press Releases',
        href: `${INDIVIDUAL_NEWS_BASE}/news/press-releases`,
      },
    ],
  },
  thoughtLeadership: {
    heading: 'Thought Leadership',
    items: [
      {
        slug: 'commentaries',
        label: 'Commentaries',
        href: `${INDIVIDUAL_NEWS_BASE}/thought-leadership/commentaries`,
      },
      {
        slug: 'insights',
        label: 'Insights',
        href: `${INDIVIDUAL_NEWS_BASE}/thought-leadership/insights`,
      },
      {
        slug: 'artisan-canvas',
        label: 'Artisan Canvas Blog',
        href: `${INDIVIDUAL_NEWS_BASE}/artisan-canvas`,
        external: true,
      },
    ],
  },
  researchData: {
    heading: 'Research & Data',
    items: [
      {
        slug: 'fact-sheets',
        label: 'Fact Sheets',
        href: `${INDIVIDUAL_NEWS_BASE}/research-data/fact-sheets`,
      },
      {
        slug: 'holdings',
        label: 'Holdings',
        href: `${INDIVIDUAL_NEWS_BASE}/research-data/holdings`,
      },
    ],
  },
  advancedFiltering: {
    label: 'Advanced Document Filtering',
    href: `${INDIVIDUAL_NEWS_BASE}/advanced-document-filtering`,
  },
  promo: {
    heading: 'Artisan Canvas',
    description: 'Timely insights and updates from our investment teams and firm leadership',
    ctaLabel: 'View Our Blog',
    href: `${INDIVIDUAL_NEWS_BASE}/artisan-canvas`,
    external: true,
  },
};

export const individualResourcesNav = {
  items: [
    {
      slug: 'applications-forms',
      label: 'Applications & Forms',
      href: `${INDIVIDUAL_RESOURCES_BASE}/applications-forms`,
    },
    {
      slug: 'prospectus',
      label: 'Prospectus',
      href: `${INDIVIDUAL_RESOURCES_BASE}/prospectus`,
      external: true,
    },
    {
      slug: 'investor-faqs',
      label: 'Investor FAQs',
      href: `${INDIVIDUAL_RESOURCES_BASE}/investor-faqs`,
    },
    {
      slug: 'account-access',
      label: 'Account Access',
      href: `${INDIVIDUAL_RESOURCES_BASE}/account-access`,
    },
    {
      slug: 'e-delivery',
      label: 'E-Delivery',
      href: `${INDIVIDUAL_RESOURCES_BASE}/e-delivery`,
    },
  ],
  taxCenter: {
    heading: 'Tax Center',
    items: [
      {
        slug: 'distributions',
        label: 'Distributions',
        href: `${INDIVIDUAL_RESOURCES_BASE}/tax-center/distributions`,
      },
      {
        slug: 'mailing-schedule',
        label: 'Mailing Schedule',
        href: `${INDIVIDUAL_RESOURCES_BASE}/tax-center/mailing-schedule`,
      },
      {
        slug: 'faqs',
        label: 'FAQs',
        href: `${INDIVIDUAL_RESOURCES_BASE}/tax-center/faqs`,
      },
    ],
  },
};

export const individualMainNavItems = [
  {
    id: 'about-us',
    label: 'About Us',
    subnavType: 'list',
    subnavLayout: 'center',
    children: institutionalAboutPages,
  },
  {
    id: 'investments',
    label: 'Investments',
    subnavType: 'mega',
    teams: individualInvestmentTeams,
  },
  {
    id: 'performance',
    label: 'Performance',
    subnavType: 'list',
    subnavLayout: 'center',
    children: [
      {
        slug: 'performance',
        label: 'Performance',
        href: `${INDIVIDUAL_BASE}/performance/performance`,
      },
      {
        slug: 'ratings-rankings',
        label: 'Ratings & Rankings',
        href: `${INDIVIDUAL_BASE}/performance/ratings-rankings`,
      },
    ],
  },
  {
    id: 'news-insights',
    label: 'News & Insights',
    subnavType: 'news-insights-individual',
  },
  {
    id: 'resources',
    label: 'Resources',
    subnavType: 'resources-individual',
  },
];

export function getIndividualAboutHref(slug, basePath = `${INDIVIDUAL_BASE}/about-us`) {
  const page = institutionalAboutPages.find((item) => item.slug === slug?.replace(/\.html$/, ''));
  if (!page) {
    return basePath;
  }

  if (page.href) {
    return page.href;
  }

  return `${basePath}/${page.slug}`;
}

export function isIndividualNavItemActive(item, pathname) {
  if (item.id === 'about-us') {
    return pathname.includes('/about-us/');
  }

  if (item.id === 'investments') {
    return pathname.includes('/investments/');
  }

  if (item.id === 'performance') {
    return pathname.includes('/performance/');
  }

  if (item.id === 'news-insights') {
    return pathname.includes('/news-insights/');
  }

  if (item.id === 'resources') {
    return pathname.includes('/resources/');
  }

  return false;
}
