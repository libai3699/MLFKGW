import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import InvestorDefinedContributionContent from '../components/InvestorSite/InvestorDefinedContributionContent';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import definedContributionPage from '../data/investorDefinedContributionPages.json';
import { getInvestorSite } from '../data/investorSitesData';
import './investor-site.css';

export default function InvestorDefinedContributionPage() {
  const site = getInvestorSite('institutional-investors');

  useEffect(() => {
    document.title = definedContributionPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  if (!site) {
    return <Navigate to="/" replace />;
  }

  return (
    <InvestorSiteLayout site={site} pageHeading={definedContributionPage.heading}>
      <div id="page-wrapper">
        <InvestorDefinedContributionContent page={definedContributionPage} />
      </div>
    </InvestorSiteLayout>
  );
}
