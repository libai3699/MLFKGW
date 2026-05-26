import contentPages from '../data/investorProfessionalContentPages.json';
import { getInvestorSite } from '../data/investorSitesData';

export function getProfessionalContentPage(relativePath) {
  const normalized = relativePath?.replace(/^\//, '').replace(/\.html$/, '');
  return contentPages[normalized] || null;
}

export function getProfessionalContentPageBySitePath(sitePath) {
  if (!sitePath) {
    return null;
  }

  const prefix = 'investment-professionals/';
  const relative = sitePath.startsWith(prefix) ? sitePath.slice(prefix.length) : sitePath;
  return getProfessionalContentPage(relative);
}

export function getInvestorSiteFromParams(siteKey) {
  return getInvestorSite(siteKey);
}
