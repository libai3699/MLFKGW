import extracted from './investorExtracted.json';
import { institutionalAboutPages } from './investorNavData';

const PROFESSIONAL_BASE = '/investment-professionals';
const PROFESSIONAL_INVESTMENTS_BASE = `${PROFESSIONAL_BASE}/investments`;
const PROFESSIONAL_NEWS_BASE = `${PROFESSIONAL_BASE}/news-insights`;
const PROFESSIONAL_RESOURCES_BASE = `${PROFESSIONAL_BASE}/resources`;

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

function buildProfessionalInvestmentTeams() {
  const teamsMap = new Map();

  for (const fund of extracted.professionalFunds) {
    const match = fund.advisor.href.match(/\/investments\/([^/]+)\/([^/?#]+)/);
    if (!match) {
      continue;
    }

    const teamSlug = match[1];
    const fundSlug = match[2].replace(/\.html$/, '');

    if (!teamsMap.has(teamSlug)) {
      teamsMap.set(teamSlug, {
        teamSlug,
        navLabel: teamNavLabels[teamSlug] || fund.fundName,
        teamHref: `${PROFESSIONAL_INVESTMENTS_BASE}/${teamSlug}`,
        items: [],
      });
    }

    teamsMap.get(teamSlug).items.push({
      label: fund.fundName,
      href: `${PROFESSIONAL_INVESTMENTS_BASE}/${teamSlug}/${fundSlug}`,
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

export const professionalInvestmentTeams = buildProfessionalInvestmentTeams();

export const professionalNewsInsightsNav = {
  news: {
    heading: 'News',
    items: [
      {
        slug: 'press-releases',
        label: 'Press Releases',
        href: `${PROFESSIONAL_NEWS_BASE}/news/press-releases`,
      },
    ],
  },
  thoughtLeadership: {
    heading: 'Thought Leadership',
    items: [
      {
        slug: 'commentaries',
        label: 'Commentaries',
        href: `${PROFESSIONAL_NEWS_BASE}/thought-leadership/commentaries`,
      },
      {
        slug: 'insights',
        label: 'Insights',
        href: `${PROFESSIONAL_NEWS_BASE}/thought-leadership/insights`,
      },
      {
        slug: 'artisan-canvas',
        label: 'Artisan Canvas Blog',
        href: `${PROFESSIONAL_NEWS_BASE}/artisan-canvas`,
        external: true,
      },
    ],
  },
  researchData: {
    heading: 'Research & Data',
    items: [
      {
        slug: 'attribution',
        label: 'Attribution',
        href: `${PROFESSIONAL_NEWS_BASE}/research-data/attribution`,
      },
      {
        slug: 'fact-sheets',
        label: 'Fact Sheets',
        href: `${PROFESSIONAL_NEWS_BASE}/research-data/fact-sheets`,
      },
      {
        slug: 'holdings',
        label: 'Holdings',
        href: `${PROFESSIONAL_NEWS_BASE}/research-data/holdings`,
      },
      {
        slug: 'presentation-books',
        label: 'Presentation Books',
        href: `${PROFESSIONAL_NEWS_BASE}/research-data/presentation-books`,
      },
      {
        slug: 'sample-rfp',
        label: 'Sample RFP',
        href: `${PROFESSIONAL_NEWS_BASE}/research-data/sample-rfp`,
      },
    ],
  },
  advancedFiltering: {
    label: 'Advanced Document Filtering',
    href: `${PROFESSIONAL_NEWS_BASE}/advanced-document-filtering`,
  },
  promo: {
    heading: 'Artisan Canvas',
    description: 'Timely insights and updates from our investment teams and firm leadership',
    ctaLabel: 'View Our Blog',
    href: `${PROFESSIONAL_NEWS_BASE}/artisan-canvas`,
    external: true,
  },
};

export const professionalResourcesNav = {
  items: [
    {
      slug: 'prospectus',
      label: 'Prospectus',
      href: `${PROFESSIONAL_RESOURCES_BASE}/prospectus`,
      external: true,
    },
    {
      slug: 'share-class-requirements',
      label: 'Share Class Requirements',
      href: `${PROFESSIONAL_RESOURCES_BASE}/share-class-requirements`,
    },
  ],
  taxCenter: {
    heading: 'Tax Center',
    items: [
      {
        slug: 'distributions',
        label: 'Distributions',
        href: `${PROFESSIONAL_RESOURCES_BASE}/tax-center/distributions`,
      },
      {
        slug: 'mailing-schedule',
        label: 'Mailing Schedule',
        href: `${PROFESSIONAL_RESOURCES_BASE}/tax-center/mailing-schedule`,
      },
      {
        slug: 'faqs',
        label: 'FAQs',
        href: `${PROFESSIONAL_RESOURCES_BASE}/tax-center/faqs`,
      },
    ],
  },
};

export const professionalMainNavItems = [
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
    teams: professionalInvestmentTeams,
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
        href: `${PROFESSIONAL_BASE}/performance/performance`,
      },
      {
        slug: 'ratings-rankings',
        label: 'Ratings & Rankings',
        href: `${PROFESSIONAL_BASE}/performance/ratings-rankings`,
      },
    ],
  },
  {
    id: 'news-insights',
    label: 'News & Insights',
    subnavType: 'news-insights-professional',
  },
  {
    id: 'resources',
    label: 'Resources',
    subnavType: 'resources-professional',
  },
];

export function getProfessionalAboutHref(slug, basePath = `${PROFESSIONAL_BASE}/about-us`) {
  const page = institutionalAboutPages.find((item) => item.slug === slug?.replace(/\.html$/, ''));
  if (!page) {
    return basePath;
  }

  if (page.href) {
    return page.href;
  }

  return `${basePath}/${page.slug}`;
}

export function isProfessionalNavItemActive(item, pathname) {
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
