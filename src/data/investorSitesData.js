import extracted from './investorExtracted.json';

const professionalHomeCarouselSlide = {
  bgColor: '#205580',
  image: '/images/investor/carousel-home-lipper-award-GBLV-SELEQ-1800x280.jpg',
  subhead: 'Recognized by Lipper',
  title: 'Artisan Partners Global Value Team',
  cta: {
    label: 'Learn More',
    href: '#',
  },
};

export const investorCarouselSlides = [
  professionalHomeCarouselSlide,
  {
    bgColor: '#0C3B53',
    image: '/images/investor/carousel-bryan-krug-2025-morningstar-award-1800x280.jpg',
    title: 'Bryan Krug Awarded by Morningstar',
    subheadLines: [
      { text: 'Outstanding Portfolio Manager', color: '#ffffff' },
      { text: 'Fixed Income Category', color: 'rgb(200,226,240)' },
    ],
    cta: {
      label: 'Learn More',
      href: '#',
    },
  },
];

export const professionalHomeHighlights = [
  {
    title: 'Bloomberg Surveillance—How the Chips Stack Up',
    description: 'Portfolio Manager David Samra',
    cta: 'Watch Now',
    icon: 'video',
    image:
      'https://www.artisanpartners.com/content/dam/images/pm-viewpoints/INTV-Thumb-Bloomberg-Mar-2026.jpg',
    href: '#',
  },
  {
    title: 'US Output—America’s Productive Renaissance',
    description: 'Portfolio Manager Chris Smith',
    cta: 'View Online',
    icon: 'window',
    image:
      'https://www.artisanpartners.com/content/dam/images/insights/Antero-Peak-Insights-White-Paper-764x430.jpg',
    href: 'https://www.artisanpartners.com/content/dam/documents/insights/vr/Peak-Insights-US-Output-Americas-Productive-Renaissance-vR.pdf',
    external: true,
  },
  {
    title: 'Citywire Elite Investor—Top value investors play the AI trade',
    description: 'Portfolio Managers Dan O’Keefe and Mike McKinnon',
    cta: 'View Online',
    icon: 'window',
    image:
      'https://www.artisanpartners.com/content/dam/images/insights/gblv-citywire-elite-investor-reprint-website-thumbnail-764x430.jpg',
    href: 'https://www.artisanpartners.com/content/dam/documents/reprints/mf/Citywire-Two-Value-Investors-Play-The-AI-Trade-vR.pdf',
    external: true,
  },
];

export const professionalHomeQuickLinks = [
  { label: 'Artisan Canvas Blog', href: '#' },
  { label: 'Current & Historical Distributions', href: '#' },
  {
    label: 'FINRA BrokerCheck',
    href: 'http://brokercheck.finra.org',
    external: true,
  },
];

export const investorSites = {
  'institutional-investors': {
    id: 'institutional-investors',
    title: 'Institutional Investors',
    pageTitle: 'Artisan Partners | Institutional Investors',
    homeHref: '/institutional-investors',
    aboutBasePath: '/institutional-investors/about-us',
    portalHref: '/',
    layout: 'institutional',
    carouselSlides: investorCarouselSlides,
    teams: extracted.institutionalTeams,
    thoughtLeadership: extracted.thoughtLeadership,
  },
  'investment-professionals': {
    id: 'investment-professionals',
    title: 'Investment Professionals',
    pageTitle: 'Artisan Partners | Investment Professionals',
    homeHref: '/investment-professionals',
    aboutBasePath: '/investment-professionals/about-us',
    portalHref: '/',
    layout: 'funds-professional',
    carouselSlides: [professionalHomeCarouselSlide],
    funds: extracted.professionalFunds,
    highlights: professionalHomeHighlights,
    quickLinks: professionalHomeQuickLinks,
    sidebarHeadings: {
      highlights: '/images/investor/home-sidebar-heading-highlights-236x76-trans.png',
      quickLinks: '/images/investor/home-side-bar-quick-links.png',
    },
  },
  'individual-investors': {
    id: 'individual-investors',
    title: 'Individual Investors',
    pageTitle: 'Artisan Partners | Individual Investors',
    homeHref: '/individual-investors',
    portalHref: '/',
    layout: 'funds-individual',
    funds: extracted.individualFunds,
  },
};

export const globalCountries = {
  aus: { name: 'Australia', flagCode: 'au' },
  aut: { name: 'Austria', flagCode: 'at' },
  bel: { name: 'Belgium', flagCode: 'be' },
  can: { name: 'Canada', flagCode: 'ca' },
  dnk: { name: 'Denmark', flagCode: 'dk' },
  fin: { name: 'Finland', flagCode: 'fi' },
  fra: { name: 'France', flagCode: 'fr' },
  deu: { name: 'Germany', flagCode: 'de' },
  isl: { name: 'Iceland', flagCode: 'is' },
  irl: { name: 'Ireland', flagCode: 'ie' },
  ita: { name: 'Italy', flagCode: 'it' },
  lie: { name: 'Liechtenstein', flagCode: 'li' },
  lux: { name: 'Luxembourg', flagCode: 'lu' },
  nld: { name: 'Netherlands', flagCode: 'nl' },
  nzl: { name: 'New Zealand', flagCode: 'nz' },
  nor: { name: 'Norway', flagCode: 'no' },
  sgp: { name: 'Singapore', flagCode: 'sg' },
  zaf: { name: 'South Africa', flagCode: 'za' },
  esp: { name: 'Spain', flagCode: 'es' },
  swe: { name: 'Sweden', flagCode: 'se' },
  che: { name: 'Switzerland', flagCode: 'ch' },
  gbr: { name: 'United Kingdom', flagCode: 'gb' },
  oth: { name: 'Other', noFlag: true },
};

export const globalPageContent = {
  pageTitle: 'Artisan Partners | Global Investors',
  introTitle: 'A Global Multi-Asset Investment Platform',
  introParagraphs: [
    'Founded in 1994, our firm has always aimed to produce differentiated investment outcomes for sophisticated clients around the world by attracting highly talented investment professionals and supporting them with the tools, resources and environment they need to thrive.',
    'We provide the resources of a full-scale, global firm paired with the independence of a boutique startup. Each of our fully autonomous investment teams has the freedom to execute its own process based on its original research and creative perspectives. While our teams differ across market capitalizations, geographical regions, investment styles and product offerings, they are all highly incentivized to deliver long-term value for our clients.',
    'We allow our investment professionals to focus on what they do best—active investment management—while our distinct business management team leads a robust operational capability and an experienced distribution and client service effort. This proven business model is thoughtfully designed to eliminate distractions for our investment professionals and deliver high value-added results for our clients.',
  ],
  quickFact: 'Serving investors across 44 countries',
  funds: extracted.globalFunds,
  thoughtLeadership: extracted.thoughtLeadership,
  disclaimer:
    'This material is directed at wholesale clients only and is not intended for, or to be relied upon by, private individuals or retail investors. Investment advisory services are offered through Artisan Partners Limited Partnership and Artisan Partners UK LLP, entities regulated under US and UK laws which differ from local laws.',
};

export function getInvestorSite(siteKey) {
  return investorSites[siteKey] || null;
}

export function getGlobalCountry(slug) {
  return globalCountries[slug] || null;
}
