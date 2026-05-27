export const institutionalAboutPages = [
  {
    slug: 'overview',
    label: 'Overview',
    pageTitle: 'Artisan Partners | Overview',
    heading: 'Overview',
  },
  {
    slug: 'who-we-are',
    label: 'Who We Are',
    pageTitle: 'Artisan Partners | Who We Are',
    heading: 'Who We Are',
  },
  {
    slug: 'investment-culture',
    label: 'Investment Culture',
    pageTitle: 'Artisan Partners | Investment Culture',
    heading: 'Investment Culture',
  },
  {
    slug: 'business-model',
    label: 'Business Model',
    pageTitle: 'Artisan Partners | Business Model',
    heading: 'Business Model',
  },
  {
    slug: 'investment-strategies',
    label: 'Investment Strategies',
    pageTitle: 'Artisan Partners | Investment Strategies',
    heading: 'Investment Strategies',
  },
  {
    slug: 'sustainability',
    label: 'Sustainability',
    href: '/sustainability/home',
    external: true,
  },
];

export function getInstitutionalAboutPage(slug) {
  const normalized = slug?.replace(/\.html$/, '');
  return institutionalAboutPages.find((page) => page.slug === normalized) || null;
}

export function getInstitutionalAboutHref(slug, basePath = '/institutional-investors/about-us') {
  const page = getInstitutionalAboutPage(slug);
  if (!page) {
    return basePath;
  }

  if (page.href && !page.external) {
    return page.href;
  }

  if (page.external) {
    return page.href;
  }

  return `${basePath}/${page.slug}`;
}
