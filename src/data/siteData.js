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
  { title: 'News', slug: 'news', href: '/news.html' },
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
      { label: 'Our People', href: '/careers/our-people.html' },
      { label: 'Key Business Areas', href: '/careers/key-business-areas.html' },
      { label: 'Career Opportunities', href: '/careers/career-opportunities.html' },
      { label: 'Benefits & Rewards at Work', href: '/careers/benefits-and-rewards-at-work.html' },
      { label: 'Life at Artisan Partners', href: '/careers/life-at-artisan-partners.html' },
    ],
  },
  { title: 'Contact Us', slug: 'contact-us', href: '/contact-us.html' },
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

const allCountries = [
  { code: 'us', name: 'United States', href: '/institutional-investors.html' },
  { code: 'au', name: 'Australia', href: '/global/aus.html' },
  { code: 'at', name: 'Austria', href: '/global/aut.html' },
  { code: 'be', name: 'Belgium', href: '/global/bel.html' },
  { code: 'ca', name: 'Canada', href: '/global/can.html' },
  { code: 'dk', name: 'Denmark', href: '/global/dnk.html' },
  { code: 'fi', name: 'Finland', href: '/global/fin.html' },
  { code: 'fr', name: 'France', href: '/global/fra.html' },
  { code: 'de', name: 'Germany', href: '/global/deu.html' },
  { code: 'is', name: 'Iceland', href: '/global/isl.html' },
  { code: 'ie', name: 'Ireland', href: '/global/irl.html' },
  { code: 'it', name: 'Italy', href: '/global/ita.html' },
  { code: 'li', name: 'Liechtenstein', href: '/global/lie.html' },
  { code: 'lu', name: 'Luxembourg', href: '/global/lux.html' },
  { code: 'nl', name: 'Netherlands', href: '/global/nld.html' },
  { code: 'nz', name: 'New Zealand', href: '/global/nzl.html' },
  { code: 'no', name: 'Norway', href: '/global/nor.html' },
  { code: 'sg', name: 'Singapore', href: '/global/sgp.html' },
  { code: 'za', name: 'South Africa', href: '/global/zaf.html' },
  { code: 'es', name: 'Spain', href: '/global/esp.html' },
  { code: 'se', name: 'Sweden', href: '/global/swe.html' },
  { code: 'ch', name: 'Switzerland', href: '/global/che.html' },
  { code: 'gb', name: 'United Kingdom', href: '/global/gbr.html' },
  { code: 'other', name: 'Other', href: '/global/oth.html', noFlag: true },
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
        ? { ...country, href: '/institutional-investors.html' }
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
        ? { ...country, href: '/investment-professionals.html' }
        : country,
    ),
  },
  {
    id: 'individual-investors',
    title: 'Individual Investors',
    description:
      'Mutual fund information including performance, commentary, holdings, distributions and prospectuses for individual investors.',
    countries: [{ code: 'us', name: 'United States', href: '/individual-investors.html' }],
  },
];

export const footerContent = {
  paragraphs: [
    'Artisan Partners is a global multi-asset investment platform providing a broad range of high value-added investment strategies in growing asset classes to sophisticated clients around the world. Artisan Partners Limited Partnership (APLP) and Grandview Property Partners, LLC (GPP) are investment advisers registered with the U.S. Securities and Exchange Commission (SEC). Artisan Partners UK LLP (APUK) is authorized and regulated by the Financial Conduct Authority and is a registered investment adviser with the SEC. APEL Financial Distribution Services Limited (AP Europe) is regulated by the Central Bank of Ireland. APLP, GPP, APUK and AP Europe are collectively, with their parent company and affiliates, referred to as Artisan Partners herein.',
    'This website does not constitute an offer or recommendation by Artisan Partners of securities or services to, or a solicitation by Artisan Partners of an offer to buy securities or services from, any person residing in a jurisdiction in which such an offer or solicitation would be unlawful under the applicable laws and regulations. Materials on this website are informational only and should not be taken as investment recommendation or advice of any kind whatsoever (whether impartial or otherwise).',
    '© 2026 Artisan Partners. All rights reserved.',
  ],
  links: [
    { label: 'Legal Information', href: '/legal-information.html' },
    { label: 'Privacy Policy', href: '/privacy-policy.html' },
    { label: 'Cookies Policy', href: '/cookies-policy.html' },
    {
      label: 'California Privacy Policy',
      href: '/content/dam/documents/legal/privacy-policy/Privacy-Notice-for-California-Residents.pdf',
      external: true,
    },
    {
      label: 'Form CRS',
      href: '/content/dam/documents/legal/APLP-Form-ADV-CRS.pdf',
      external: true,
    },
  ],
};
