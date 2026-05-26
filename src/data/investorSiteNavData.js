import { institutionalInvestmentTeams } from './investorInvestmentsData';
import { isNewsInsightsActive } from './investorNewsInsightsData';
import { institutionalAboutPages } from './investorNavData';
import {
  isProfessionalNavItemActive,
  professionalMainNavItems,
} from './investorProfessionalNavData';

export const institutionalMainNavItems = [
  {
    id: 'about-us',
    label: 'About Us',
    subnavType: 'list',
    children: institutionalAboutPages,
  },
  {
    id: 'investments',
    label: 'Investments',
    subnavType: 'mega',
    teams: institutionalInvestmentTeams,
  },
  {
    id: 'news-insights',
    label: 'News & Insights',
    subnavType: 'news-insights',
  },
  {
    id: 'defined-contribution',
    label: 'Defined Contribution',
    href: '/institutional-investors/defined-contribution',
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/institutional-investors/resources',
  },
];

function isInstitutionalNavItemActive(item, pathname) {
  if (item.id === 'about-us') {
    return pathname.includes('/about-us/');
  }

  if (item.id === 'investments') {
    return pathname.includes('/investments/');
  }

  if (item.id === 'news-insights') {
    return isNewsInsightsActive(pathname);
  }

  if (item.id === 'defined-contribution') {
    return pathname.includes('/defined-contribution');
  }

  if (item.id === 'resources') {
    return pathname.includes('/resources');
  }

  return false;
}

export function getInvestorMainNavItems(site) {
  if (site?.id === 'investment-professionals') {
    return professionalMainNavItems;
  }

  return institutionalMainNavItems;
}

export function isInvestorNavItemActive(item, pathname, site) {
  if (site?.id === 'investment-professionals') {
    return isProfessionalNavItemActive(item, pathname);
  }

  return isInstitutionalNavItemActive(item, pathname);
}

export function getInvestorAboutHrefResolver(site) {
  if (site?.id === 'investment-professionals') {
    return (slug, basePath) => {
      const page = institutionalAboutPages.find((entry) => entry.slug === slug?.replace(/\.html$/, ''));
      if (!page) {
        return basePath;
      }

      if (page.href) {
        return page.href;
      }

      return `${basePath}/${page.slug}`;
    };
  }

  return null;
}
