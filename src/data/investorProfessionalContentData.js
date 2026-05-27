import { getInvestorContentPage, getProfessionalContentPage } from './investorSiteContentData';
import { getInvestorSite } from './investorSitesData';

export { getInvestorContentPage, getProfessionalContentPage };

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
