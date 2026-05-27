import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import InvestorCarousel from '../components/InvestorSite/InvestorCarousel';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import InstitutionalHomeContent, {
  IndividualFundsContent,
  ProfessionalFundsContent,
} from '../components/InvestorSite/InvestorHomeContent';
import { getInvestorSite } from '../data/investorSitesData';
import './investor-site.css';

export default function InvestorSiteHomePage({ siteKey }) {
  const site = getInvestorSite(siteKey);

  useEffect(() => {
    if (!site) {
      return undefined;
    }

    document.title = site.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [site]);

  if (!site) {
    return <Navigate to="/" replace />;
  }

  return (
    <InvestorSiteLayout site={site} pageClassName="investor-site-home">
      <div id="page-wrapper">
        {site.carouselSlides?.length > 0 && <InvestorCarousel slides={site.carouselSlides} />}
        {site.layout === 'institutional' && <InstitutionalHomeContent site={site} />}
        {site.layout === 'funds-professional' && <ProfessionalFundsContent site={site} />}
        {site.layout === 'funds-individual' && <IndividualFundsContent site={site} />}
      </div>
    </InvestorSiteLayout>
  );
}
