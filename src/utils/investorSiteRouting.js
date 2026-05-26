export const INVESTOR_SITE_KEYS = [
  'institutional-investors',
  'investment-professionals',
  'individual-investors',
];

export function getInvestorSiteKeyFromPathname(pathname = '') {
  const match = pathname.match(
    /^\/(institutional-investors|investment-professionals|individual-investors)(?:\/|\.html|$)/,
  );

  return match?.[1] || null;
}

export function getInvestorSiteHomePath(siteKey) {
  return `/${siteKey}`;
}
