import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import InvestorCarousel from '../components/InvestorSite/InvestorCarousel';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import { GlobalHomeContent } from '../components/InvestorSite/InvestorHomeContent';
import { getGlobalCountry, globalPageContent } from '../data/investorSitesData';
import './investor-site.css';

export default function GlobalInvestorPage() {
  const { countrySlug } = useParams();
  const country = getGlobalCountry(countrySlug);

  useEffect(() => {
    if (!country) {
      return undefined;
    }

    document.title = `Artisan Partners | ${country.name}`;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [country]);

  if (!country) {
    return <Navigate to="/" replace />;
  }

  const site = {
    title: country.name,
    countrySlug,
    portalHref: '/',
    homeHref: `/global/${countrySlug}`,
  };

  return (
    <InvestorSiteLayout site={site} countryName={country.name}>
      <div id="page-wrapper">
        <InvestorCarousel />
        <GlobalHomeContent country={country} content={globalPageContent} />
      </div>
    </InvestorSiteLayout>
  );
}
