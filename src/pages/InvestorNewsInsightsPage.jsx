import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import {
  InsightsContent,
  PressReleasesContent,
} from '../components/InvestorSite/InvestorNewsInsightsContent';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import { getNewsInsightsContentKey, getNewsInsightsPage } from '../data/investorNewsInsightsData';
import newsInsightsPages from '../data/investorNewsInsightsPages.json';
import { getInvestorSite } from '../data/investorSitesData';
import { getInvestorSiteKeyFromPathname } from '../utils/investorSiteRouting';
import InvestorProfessionalContentPage from './InvestorProfessionalContentPage';
import './investor-site.css';

function ArtisanCanvasRedirect() {
  useEffect(() => {
    window.location.replace(newsInsightsPages.artisanCanvas.href);
  }, []);

  return (
    <div className="investor-artisan-canvas-redirect">
      <p>
        Redirecting to{' '}
        <a href={newsInsightsPages.artisanCanvas.href} target="_blank" rel="noopener noreferrer">
          Artisan Canvas
        </a>
        ...
      </p>
    </div>
  );
}

function getNewsInsightsRelativePath(pathname, siteKey) {
  const prefix = `/${siteKey}/news-insights/`;
  if (!pathname.startsWith(prefix)) {
    return null;
  }

  return pathname.slice(prefix.length).replace(/\.html$/, '').replace(/\/$/, '');
}

export default function InvestorNewsInsightsPage() {
  const { section, pageSlug } = useParams();
  const location = useLocation();
  const siteKey = getInvestorSiteKeyFromPathname(location.pathname) || 'institutional-investors';
  const site = getInvestorSite(siteKey);
  const pathFromLocation = getNewsInsightsRelativePath(location.pathname, siteKey);
  const path = pathFromLocation || (pageSlug ? `${section}/${pageSlug}` : section);
  const pageMeta = getNewsInsightsPage(siteKey, path);
  const isContentPage =
    pageMeta?.contentPage &&
    (siteKey === 'investment-professionals' || siteKey === 'individual-investors');

  const contentKey = pageMeta ? getNewsInsightsContentKey(siteKey, path) : null;
  const listContentPage = contentKey ? newsInsightsPages[contentKey] : null;

  useEffect(() => {
    if (isContentPage || !pageMeta || pageMeta.slug === 'artisan-canvas' || !listContentPage) {
      return undefined;
    }

    document.title = listContentPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [isContentPage, listContentPage, pageMeta]);

  if (isContentPage) {
    return <InvestorProfessionalContentPage />;
  }

  if (!site) {
    return <Navigate to="/" replace />;
  }

  if (!pageMeta) {
    return <Navigate to={site.homeHref} replace />;
  }

  if (pageMeta.slug === 'artisan-canvas') {
    return (
      <InvestorSiteLayout site={site} pageHeading={newsInsightsPages.artisanCanvas.heading}>
        <div id="page-wrapper">
          <div id="page-title" className="investor-page-title">
            <div className="container investor-container">
              <h1>{newsInsightsPages.artisanCanvas.heading}</h1>
            </div>
          </div>
          <div className="section investor-about-section">
            <div className="container investor-container">
              <ArtisanCanvasRedirect />
            </div>
          </div>
        </div>
      </InvestorSiteLayout>
    );
  }

  if (!listContentPage) {
    return <Navigate to={site.homeHref} replace />;
  }

  const PageContent =
    pageMeta.slug === 'press-releases' ? PressReleasesContent : InsightsContent;

  const heading = listContentPage.heading;

  return (
    <InvestorSiteLayout site={site} pageHeading={heading}>
      <div id="page-wrapper">
        <div id="page-title" className="investor-page-title">
          <div className="container investor-container">
            <h1>{heading}</h1>
          </div>
        </div>
        <div className="section investor-about-section">
          <div className="container investor-container">
            <PageContent page={listContentPage} />
          </div>
        </div>
      </div>
    </InvestorSiteLayout>
  );
}
