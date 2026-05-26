import InvestorSiteHeader from './InvestorSiteHeader';
import InvestorSiteFooter from './InvestorSiteFooter';

export default function InvestorSiteLayout({ site, countryName, pageHeading, children }) {
  return (
    <div className={`investor-site-page home investor-site-page--${site.id}`}>
      <InvestorSiteHeader site={site} countryName={countryName} pageHeading={pageHeading} />
      {children}
      <InvestorSiteFooter />
    </div>
  );
}
