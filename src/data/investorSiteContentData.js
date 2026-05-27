import individualContentPages from './investorIndividualContentPages.json';
import professionalContentPages from './investorProfessionalContentPages.json';

function normalizeRelativePath(relativePath) {
  return relativePath?.replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '') || '';
}

export function getInvestorContentRelativePath(siteKey, pathname = '') {
  const prefix = `/${siteKey}/`;
  if (!pathname.startsWith(prefix)) {
    return '';
  }

  return normalizeRelativePath(pathname.slice(prefix.length));
}

export function getInvestorContentPage(siteKey, relativePath) {
  const normalized = normalizeRelativePath(relativePath);

  if (siteKey === 'individual-investors') {
    return individualContentPages[normalized] || null;
  }

  if (siteKey === 'investment-professionals') {
    return professionalContentPages[normalized] || null;
  }

  return null;
}

export function getProfessionalContentPage(relativePath) {
  return getInvestorContentPage('investment-professionals', relativePath);
}

export function getIndividualContentPage(relativePath) {
  return getInvestorContentPage('individual-investors', relativePath);
}
