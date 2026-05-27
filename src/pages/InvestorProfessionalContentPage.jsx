import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ProfessionalContentBody, getContentPageScrollSpy, ProfessionalFundScrollSpy } from '../components/InvestorSite/InvestorProfessionalContent';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import {
  getInvestorContentPage,
  getInvestorContentRelativePath,
} from '../data/investorSiteContentData';
import { getInvestorSite } from '../data/investorSitesData';
import { getInvestorSiteKeyFromPathname } from '../utils/investorSiteRouting';
import './investor-site.css';
import './portal-pages.css';

export default function InvestorProfessionalContentPage() {
  const location = useLocation();
  const siteKey = getInvestorSiteKeyFromPathname(location.pathname);
  const site = getInvestorSite(siteKey);
  const relativePath = getInvestorContentRelativePath(siteKey, location.pathname);
  const page = getInvestorContentPage(siteKey, relativePath);

  useEffect(() => {
    if (!page) {
      return undefined;
    }

    document.title = page.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [page]);

  if (!site || !['investment-professionals', 'individual-investors'].includes(siteKey)) {
    return <Navigate to="/" replace />;
  }

  if (!page) {
    return <Navigate to={site.homeHref} replace />;
  }

  const scrollSpy = getContentPageScrollSpy(page, relativePath);
  const isResourcesPage = relativePath.startsWith('resources/');

  const pageTitle = (
    <div id="page-title" className="investor-page-title">
      <div className="container investor-container">
        <h1>{page.heading}</h1>
      </div>
    </div>
  );

  return (
    <InvestorSiteLayout site={site} pageHeading={page.heading}>
      <div id="page-wrapper">
        {scrollSpy ? (
          <div className="investor-page-chrome-sticky">
            {pageTitle}
            <ProfessionalFundScrollSpy items={scrollSpy} />
          </div>
        ) : (
          pageTitle
        )}
        {isResourcesPage ? (
          <div className="investor-resources-page-body">
            <ProfessionalContentBody page={page} relativePath={relativePath} />
          </div>
        ) : (
          <div className="section investor-about-section">
            <div className="container investor-container">
              <ProfessionalContentBody page={page} relativePath={relativePath} />
            </div>
          </div>
        )}
      </div>
    </InvestorSiteLayout>
  );
}
