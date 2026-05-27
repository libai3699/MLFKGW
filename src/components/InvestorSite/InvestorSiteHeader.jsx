import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import InvestorInvestmentsSubnav from './InvestorInvestmentsSubnav';
import InvestorNewsInsightsSubnav from './InvestorNewsInsightsSubnav';
import InvestorProfessionalNewsInsightsSubnav from './InvestorProfessionalNewsInsightsSubnav';
import InvestorProfessionalResourcesSubnav from './InvestorProfessionalResourcesSubnav';
import { individualNewsInsightsNav, individualResourcesNav } from '../../data/investorIndividualNavData';
import { getInstitutionalAboutHref } from '../../data/investorNavData';
import {
  getInvestorAboutHrefResolver,
  getInvestorMainNavItems,
  isInvestorNavItemActive,
} from '../../data/investorSiteNavData';

function hasSubnav(item) {
  return (
    item.subnavType === 'list' ||
    item.subnavType === 'mega' ||
    item.subnavType === 'news-insights' ||
    item.subnavType === 'news-insights-professional' ||
    item.subnavType === 'news-insights-individual' ||
    item.subnavType === 'resources-professional' ||
    item.subnavType === 'resources-individual'
  );
}

function getAboutHref(child, aboutBasePath, resolveAboutHref) {
  if (child.href) {
    return child.href;
  }

  if (resolveAboutHref) {
    return resolveAboutHref(child.slug, aboutBasePath);
  }

  return getInstitutionalAboutHref(child.slug, aboutBasePath);
}

export default function InvestorSiteHeader({ site, countryName, pageHeading }) {
  const location = useLocation();
  const homeHref = site.homeHref || (site.countrySlug ? `/global/${site.countrySlug}` : '/');
  const currentLabel = countryName || site.title;
  const isProfessionalFundPage = /^\/investment-professionals\/investments\/[^/]+\/[^/]+/.test(
    location.pathname,
  );
  const breadcrumbHeading = isProfessionalFundPage ? null : pageHeading;
  const [openSubnav, setOpenSubnav] = useState(null);
  const aboutBasePath = site.aboutBasePath || `${homeHref.replace(/\.html$/, '')}/about-us`;
  const closeSubnav = () => setOpenSubnav(null);
  const mainNavItems = getInvestorMainNavItems(site);
  const resolveAboutHref = getInvestorAboutHrefResolver(site);
  const investmentsBasePath =
    site.id === 'investment-professionals'
      ? '/investment-professionals/investments'
      : site.id === 'individual-investors'
        ? '/individual-investors/investments'
        : '/institutional-investors/investments';

  return (
    <header id="header" className="investor-site-header">
      <div id="color-bar">
        <div className="container investor-container">
          <div className="investor-color-bar-row">
            <div className="breadcrumbs investor-breadcrumbs">
              <Link to={site.portalHref || '/'}>Artisan Partners</Link>
              <span className="investor-breadcrumb-sep">&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
              <Link to={homeHref}>{currentLabel}</Link>
              {breadcrumbHeading && (
                <>
                  <span className="investor-breadcrumb-sep">&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
                  <span>{breadcrumbHeading}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="branding">
        <div className="container investor-container">
          <div className="investor-branding-row">
            <div id="logo" className="investor-logo-wrap">
              <Link to={homeHref}>
                <img
                  className="investor-logo img-responsive"
                  src="/images/investor/logo.png"
                  alt="Artisan Partners Logo"
                />
              </Link>
            </div>
            <nav aria-label="Main">
              <ul id="main-nav" className="nav">
                {mainNavItems.map((item) => {
                  const active = isInvestorNavItemActive(item, location.pathname, site);
                  const itemHasSubnav = hasSubnav(item);
                  const subnavOpen = openSubnav === item.id;

                  return (
                    <li
                      key={item.id}
                      className={`${active ? 'active' : ''} ${itemHasSubnav ? 'has-subnav' : ''} ${subnavOpen ? 'hover' : ''}`}
                      onMouseEnter={() => itemHasSubnav && setOpenSubnav(item.id)}
                      onMouseLeave={() => itemHasSubnav && setOpenSubnav(null)}
                    >
                      {itemHasSubnav ? (
                        <button
                          type="button"
                          className="investor-nav-toggle"
                          aria-expanded={subnavOpen}
                          onClick={() => setOpenSubnav(subnavOpen ? null : item.id)}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link to={item.href}>{item.label}</Link>
                      )}

                      {itemHasSubnav && (
                        <div
                          className={`subnav ${subnavOpen ? 'active' : ''} ${item.subnavType === 'mega' ? 'subnav-mega' : ''}`}
                        >
                          <div className="container investor-container">
                            {item.subnavType === 'list' && (
                              <div
                                className={`investor-subnav-row${item.subnavLayout === 'center' ? ' investor-subnav-row-center' : ''}`}
                              >
                                <ul>
                                  {item.children.map((child) => {
                                    const childHref = getAboutHref(child, aboutBasePath, resolveAboutHref);

                                    return (
                                      <li key={child.slug || child.label}>
                                        {child.external ? (
                                          <a
                                            href={childHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {child.label}
                                            <span className="investor-external-icon" aria-hidden="true">
                                              ↗
                                            </span>
                                          </a>
                                        ) : (
                                          <Link to={childHref} onClick={closeSubnav}>
                                            {child.label}
                                          </Link>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                            {item.subnavType === 'mega' && (
                              <InvestorInvestmentsSubnav
                                teams={item.teams}
                                basePath={investmentsBasePath}
                                onNavigate={closeSubnav}
                              />
                            )}
                            {item.subnavType === 'news-insights' && (
                              <InvestorNewsInsightsSubnav onNavigate={closeSubnav} />
                            )}
                            {item.subnavType === 'news-insights-professional' && (
                              <InvestorProfessionalNewsInsightsSubnav onNavigate={closeSubnav} />
                            )}
                            {item.subnavType === 'news-insights-individual' && (
                              <InvestorProfessionalNewsInsightsSubnav
                                nav={individualNewsInsightsNav}
                                onNavigate={closeSubnav}
                              />
                            )}
                            {item.subnavType === 'resources-professional' && (
                              <InvestorProfessionalResourcesSubnav onNavigate={closeSubnav} />
                            )}
                            {item.subnavType === 'resources-individual' && (
                              <InvestorProfessionalResourcesSubnav
                                nav={individualResourcesNav}
                                onNavigate={closeSubnav}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
