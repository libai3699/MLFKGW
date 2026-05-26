import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import InvestorResourcesContent from '../components/InvestorSite/InvestorResourcesContent';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import resourcesPage from '../data/investorResourcesPages.json';
import { getInvestorSite } from '../data/investorSitesData';
import './investor-site.css';

export default function InvestorResourcesPage() {
  const site = getInvestorSite('institutional-investors');

  useEffect(() => {
    document.title = resourcesPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  if (!site) {
    return <Navigate to="/" replace />;
  }

  return (
    <InvestorSiteLayout site={site} pageHeading={resourcesPage.heading}>
      <div id="page-wrapper">
        <div id="page-title" className="investor-page-title">
          <div className="container investor-container">
            <h1>{resourcesPage.heading}</h1>
          </div>
        </div>
        <div className="section investor-about-section">
          <div className="container investor-container">
            <InvestorResourcesContent page={resourcesPage} />
          </div>
        </div>
      </div>
    </InvestorSiteLayout>
  );
}
