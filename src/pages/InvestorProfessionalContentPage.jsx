import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ProfessionalContentBody } from '../components/InvestorSite/InvestorProfessionalContent';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import { getProfessionalContentPage } from '../data/investorProfessionalContentData';
import { getInvestorSite } from '../data/investorSitesData';
import { getInvestorSiteKeyFromPathname } from '../utils/investorSiteRouting';
import './investor-site.css';
import './portal-pages.css';

export default function InvestorProfessionalContentPage() {
  const location = useLocation();
  const siteKey = getInvestorSiteKeyFromPathname(location.pathname);
  const site = getInvestorSite(siteKey);
  const relativePath = location.pathname
    .replace(/^\/investment-professionals\//, '')
    .replace(/\.html$/, '');
  const page = getProfessionalContentPage(relativePath);

  useEffect(() => {
    if (!page) {
      return undefined;
    }

    document.title = page.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [page]);

  if (!site || siteKey !== 'investment-professionals') {
    return <Navigate to="/" replace />;
  }

  if (!page) {
    return <Navigate to={site.homeHref} replace />;
  }

  return (
    <InvestorSiteLayout site={site} pageHeading={page.heading}>
      <div id="page-wrapper">
        <div id="page-title" className="investor-page-title">
          <div className="container investor-container">
            <h1>{page.heading}</h1>
          </div>
        </div>
        <div className="section investor-about-section">
          <div className="container investor-container">
            <ProfessionalContentBody page={page} />
          </div>
        </div>
      </div>
    </InvestorSiteLayout>
  );
}
