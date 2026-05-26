import { useParams } from 'react-router-dom';
import { getInvestorSite } from '../data/investorSitesData';
import { getInvestorSiteKeyFromPathname, getInvestorSiteHomePath } from '../utils/investorSiteRouting';

export function useInvestorSiteFromRoute() {
  const { siteKey: paramSiteKey } = useParams();
  const siteKey = paramSiteKey || 'institutional-investors';
  const site = getInvestorSite(siteKey);

  return {
    site,
    siteKey,
    homePath: getInvestorSiteHomePath(siteKey),
  };
}

export function useInvestorSiteFromPathname(pathname) {
  const siteKey = getInvestorSiteKeyFromPathname(pathname) || 'institutional-investors';
  const site = getInvestorSite(siteKey);

  return {
    site,
    siteKey,
    homePath: getInvestorSiteHomePath(siteKey),
  };
}
