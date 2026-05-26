export function resolveInvestorAboutHref(href, basePath = '/institutional-investors/about-us') {
  if (!href) {
    return href;
  }

  if (href.startsWith('/about-us/')) {
    return href.replace('/about-us', basePath);
  }

  return href;
}
