export const INVESTOR_NEWS_INSIGHTS_BASE = '/institutional-investors/news-insights';
export const ARTISAN_CANVAS_HREF = 'https://www.artisancanvas.com';

export const institutionalNewsInsightsNav = {
  news: {
    heading: 'News',
    items: [
      {
        slug: 'press-releases',
        label: 'Press Releases',
        href: `${INVESTOR_NEWS_INSIGHTS_BASE}/news/press-releases`,
      },
    ],
  },
  thoughtLeadership: {
    heading: 'Thought Leadership',
    items: [
      {
        slug: 'insights',
        label: 'Insights',
        href: `${INVESTOR_NEWS_INSIGHTS_BASE}/thought-leadership/insights`,
      },
      {
        slug: 'artisan-canvas',
        label: 'Artisan Canvas Blog',
        href: ARTISAN_CANVAS_HREF,
        external: true,
      },
    ],
  },
  promo: {
    heading: 'Artisan Canvas',
    description: 'Timely insights and updates from our investment teams and firm leadership',
    ctaLabel: 'View Our Blog',
    href: ARTISAN_CANVAS_HREF,
    external: true,
  },
};

export const institutionalNewsInsightsPages = [
  {
    slug: 'press-releases',
    path: 'news/press-releases',
    label: 'Press Releases',
  },
  {
    slug: 'insights',
    path: 'thought-leadership/insights',
    label: 'Insights',
  },
];

export const professionalNewsInsightsPages = [
  {
    slug: 'press-releases',
    path: 'news/press-releases',
    label: 'Press Releases',
    contentPage: true,
  },
  {
    slug: 'commentaries',
    path: 'thought-leadership/commentaries',
    label: 'Commentaries',
    contentPage: true,
  },
  {
    slug: 'insights',
    path: 'thought-leadership/insights',
    label: 'Insights',
    contentPage: true,
  },
  {
    slug: 'attribution',
    path: 'research-data/attribution',
    label: 'Attribution',
    contentPage: true,
  },
  {
    slug: 'fact-sheets',
    path: 'research-data/fact-sheets',
    label: 'Fact Sheets',
    contentPage: true,
  },
  {
    slug: 'holdings',
    path: 'research-data/holdings',
    label: 'Holdings',
    contentPage: true,
  },
  {
    slug: 'presentation-books',
    path: 'research-data/presentation-books',
    label: 'Presentation Books',
    contentPage: true,
  },
  {
    slug: 'sample-rfp',
    path: 'research-data/sample-rfp',
    label: 'Sample RFP',
    contentPage: true,
  },
  {
    slug: 'advanced-document-filtering',
    path: 'advanced-document-filtering',
    label: 'Advanced Document Filtering',
    contentPage: true,
  },
];

export function getInstitutionalNewsInsightsPage(path) {
  const normalized = path?.replace(/\.html$/, '').replace(/^\//, '');
  return (
    institutionalNewsInsightsPages.find((page) => page.path === normalized) ||
    (normalized === 'artisan-canvas' ? { slug: 'artisan-canvas', path: 'artisan-canvas', label: 'Artisan Canvas' } : null)
  );
}

export function getProfessionalNewsInsightsPage(path) {
  const normalized = path?.replace(/\.html$/, '').replace(/^\//, '');
  return (
    professionalNewsInsightsPages.find((page) => page.path === normalized) ||
    (normalized === 'artisan-canvas' || normalized === 'news-insights/artisan-canvas'
      ? { slug: 'artisan-canvas', path: 'artisan-canvas', label: 'Artisan Canvas' }
      : null)
  );
}

export function getNewsInsightsPage(siteKey, path) {
  if (siteKey === 'investment-professionals') {
    return getProfessionalNewsInsightsPage(path);
  }

  return getInstitutionalNewsInsightsPage(path);
}

export function isNewsInsightsActive(pathname) {
  return pathname.includes('/news-insights/');
}
