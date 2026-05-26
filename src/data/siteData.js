import { footerLinks } from './legalPagesData';

export const navItems = [
  {
    title: 'About Us',
    slug: 'about-us',
    children: [
      { label: 'Overview', href: '/about-us/overview' },
      { label: 'Who We Are', href: '/about-us/who-we-are' },
      { label: 'Investment Culture', href: '/about-us/investment-culture' },
      { label: 'Business Model', href: '/about-us/business-model' },
      { label: 'Investment Strategies', href: '/about-us/investment-strategies' },
      { label: 'Sustainability', href: '/sustainability/home' },
    ],
  },
  { title: 'News', slug: 'news', href: '/news' },
  {
    title: 'Investor Relations',
    slug: 'investor-relations',
    href: 'http://www.apam.com/',
    external: true,
  },
  {
    title: 'Careers',
    slug: 'careers',
    menuAlign: 'right',
    children: [
      { label: 'Our People', href: '/careers/our-people' },
      { label: 'Key Business Areas', href: '/careers/key-business-areas' },
      { label: 'Career Opportunities', href: '/careers/career-opportunities' },
      { label: 'Benefits & Rewards at Work', href: '/careers/benefits-and-rewards-at-work' },
      { label: 'Life at Artisan Partners', href: '/careers/life-at-artisan-partners' },
    ],
  },
  { title: 'Contact Us', slug: 'contact-us', href: '/contact-us' },
];

export const introText =
  'Artisan Partners is a global multi-asset investment platform providing a broad range of high value-added investment strategies in growing asset classes to sophisticated clients around the world.';

export const channels = [
  { id: 'institutional-investors', label: 'Institutional Investors' },
  { id: 'investment-professionals', label: 'Investment Professionals' },
  { id: 'individual-investors', label: 'Individual Investors' },
];

export const promo = {
  title: 'Artisan Canvas',
  description:
    'Timely insights and updates from our investment teams and firm leadership.',
  cta: 'View Our Blog',
  href: 'https://www.artisancanvas.com',
};

export function resolveInvestorHref(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return path.startsWith('/') ? path : `/${path}`;
}

const allCountries = [
  { code: 'us', name: 'United States', href: '/institutional-investors' },
  { code: 'au', name: 'Australia', href: '/global/aus' },
  { code: 'at', name: 'Austria', href: '/global/aut' },
  { code: 'be', name: 'Belgium', href: '/global/bel' },
  { code: 'ca', name: 'Canada', href: '/global/can' },
  { code: 'dk', name: 'Denmark', href: '/global/dnk' },
  { code: 'fi', name: 'Finland', href: '/global/fin' },
  { code: 'fr', name: 'France', href: '/global/fra' },
  { code: 'de', name: 'Germany', href: '/global/deu' },
  { code: 'is', name: 'Iceland', href: '/global/isl' },
  { code: 'ie', name: 'Ireland', href: '/global/irl' },
  { code: 'it', name: 'Italy', href: '/global/ita' },
  { code: 'li', name: 'Liechtenstein', href: '/global/lie' },
  { code: 'lu', name: 'Luxembourg', href: '/global/lux' },
  { code: 'nl', name: 'Netherlands', href: '/global/nld' },
  { code: 'nz', name: 'New Zealand', href: '/global/nzl' },
  { code: 'no', name: 'Norway', href: '/global/nor' },
  { code: 'sg', name: 'Singapore', href: '/global/sgp' },
  { code: 'za', name: 'South Africa', href: '/global/zaf' },
  { code: 'es', name: 'Spain', href: '/global/esp' },
  { code: 'se', name: 'Sweden', href: '/global/swe' },
  { code: 'ch', name: 'Switzerland', href: '/global/che' },
  { code: 'gb', name: 'United Kingdom', href: '/global/gbr' },
  { code: 'other', name: 'Other', href: '/global/oth', noFlag: true },
];

const recentCountries = allCountries.slice(0, 10);

export const investorSections = [
  {
    id: 'institutional-investors',
    title: 'Institutional Investors',
    description:
      'Investment management capabilities for corporate and public retirement plans, foundations, endowments, trusts, other institutional investors and their consultants.',
    countries: recentCountries.map((country, index) =>
      index === 0
        ? { ...country, href: '/institutional-investors' }
        : country,
    ),
  },
  {
    id: 'investment-professionals',
    title: 'Investment Professionals',
    description:
      'Investment information for financial intermediaries including advisors, broker-dealers, centralized research teams, RIAs, and IFAs.',
    countries: recentCountries.map((country, index) =>
      index === 0
        ? { ...country, href: '/investment-professionals' }
        : country,
    ),
  },
  {
    id: 'individual-investors',
    title: 'Individual Investors',
    description:
      'Mutual fund information including performance, commentary, holdings, distributions and prospectuses for individual investors.',
    countries: [
      {
        code: 'us',
        name: 'United States',
        href: '/individual-investors',
      },
    ],
  },
];

export const footerContent = {
  paragraphs: [
    'Artisan Partners is a global multi-asset investment platform providing a broad range of high value-added investment strategies in growing asset classes to sophisticated clients around the world. Artisan Partners Limited Partnership (APLP) and Grandview Property Partners, LLC (GPP) are investment advisers registered with the U.S. Securities and Exchange Commission (SEC). Artisan Partners UK LLP (APUK) is authorized and regulated by the Financial Conduct Authority and is a registered investment adviser with the SEC. APEL Financial Distribution Services Limited (AP Europe) is regulated by the Central Bank of Ireland. APLP, GPP, APUK and AP Europe are collectively, with their parent company and affiliates, referred to as Artisan Partners herein.',
    'This website does not constitute an offer or recommendation by Artisan Partners of securities or services to, or a solicitation by Artisan Partners of an offer to buy securities or services from, any person residing in a jurisdiction in which such an offer or solicitation would be unlawful under the applicable laws and regulations. Materials on this website are informational only and should not be taken as investment recommendation or advice of any kind whatsoever (whether impartial or otherwise).',
    '© 2026 Artisan Partners. All rights reserved.',
  ],
  links: footerLinks,
};
