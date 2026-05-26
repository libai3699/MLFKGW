import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import {
  StrategyPageBody,
  TeamPageBody,
} from '../components/InvestorSite/InvestorInvestmentContent';
import {
  ProfessionalFundPageBody,
  ProfessionalFundPageHeader,
  ProfessionalFundScrollSpy,
  ProfessionalTeamPageBody,
} from '../components/InvestorSite/InvestorProfessionalContent';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import {
  getInstitutionalInvestmentStrategy,
  getInstitutionalInvestmentTeam,
} from '../data/investorInvestmentsData';
import investmentPages from '../data/investorInvestmentPages.json';
import professionalInvestmentPages from '../data/investorProfessionalInvestmentPages.json';
import { getInvestorSite } from '../data/investorSitesData';
import { getInvestorSiteKeyFromPathname } from '../utils/investorSiteRouting';
import './investor-site.css';
import './portal-pages.css';

function isFundSlug(slug) {
  return slug?.includes('-fund-');
}

export default function InvestorInvestmentPage() {
  const { teamSlug, strategySlug, fundSlug } = useParams();
  const location = useLocation();
  const siteKey = getInvestorSiteKeyFromPathname(location.pathname) || 'institutional-investors';
  const site = getInvestorSite(siteKey);
  const normalizedTeamSlug = teamSlug?.replace(/\.html$/, '');
  const detailSlug = (fundSlug || strategySlug)?.replace(/\.html$/, '');
  const isProfessional = siteKey === 'investment-professionals';
  const isFundPage = isProfessional && detailSlug && isFundSlug(detailSlug);
  const isStrategyPage = !isProfessional && Boolean(detailSlug);

  const team = getInstitutionalInvestmentTeam(normalizedTeamSlug);
  const strategyMatch =
    !isProfessional && detailSlug
      ? getInstitutionalInvestmentStrategy(normalizedTeamSlug, detailSlug)
      : null;

  const teamPage = isProfessional
    ? professionalInvestmentPages.teams[normalizedTeamSlug]
    : investmentPages.teams[normalizedTeamSlug];
  const fundPage =
    isFundPage ? professionalInvestmentPages.funds[`${normalizedTeamSlug}/${detailSlug}`] : null;
  const strategyPage =
    isStrategyPage ? investmentPages.strategies[`${normalizedTeamSlug}/${detailSlug}`] : null;

  const pageMeta = isFundPage
    ? fundPage
    : isStrategyPage
      ? strategyPage || strategyMatch?.strategy
      : teamPage || team;
  const pageHeading = pageMeta?.heading;

  useEffect(() => {
    if (!pageMeta) {
      return undefined;
    }

    document.title = pageMeta.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [pageMeta]);

  if (!site) {
    return <Navigate to="/" replace />;
  }

  if (isFundPage) {
    if (!fundPage) {
      return <Navigate to={site.homeHref} replace />;
    }

    return (
      <InvestorSiteLayout site={site} pageHeading={fundPage.heading}>
        <div id="page-wrapper" className="investor-fund-page-wrapper">
          <ProfessionalFundPageHeader page={fundPage} />
          <ProfessionalFundScrollSpy items={fundPage.scrollSpy} />
          <ProfessionalFundPageBody page={fundPage} />
        </div>
      </InvestorSiteLayout>
    );
  }

  if (isStrategyPage) {
    if (!strategyMatch || !strategyPage) {
      return <Navigate to={site.homeHref} replace />;
    }

    return (
      <InvestorSiteLayout site={site} pageHeading={strategyPage.heading}>
        <div id="page-wrapper">
          <div id="page-title" className="investor-page-title">
            <div className="container investor-container">
              <h1>{strategyPage.heading}</h1>
            </div>
          </div>
          <div className="section investor-about-section">
            <div className="container investor-container">
              <StrategyPageBody page={strategyPage} teamSlug={normalizedTeamSlug} />
            </div>
          </div>
        </div>
      </InvestorSiteLayout>
    );
  }

  if (!teamPage && !team) {
    return <Navigate to={site.homeHref} replace />;
  }

  const heading = teamPage?.heading || team?.heading;

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
            {isProfessional ? (
              <ProfessionalTeamPageBody page={teamPage} />
            ) : (
              <TeamPageBody page={teamPage} teamSlug={normalizedTeamSlug} />
            )}
          </div>
        </div>
      </div>
    </InvestorSiteLayout>
  );
}
