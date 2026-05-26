import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { hydrateFundCharts, hydrateFundInteractivity } from '../../utils/investorFundChartHydration';
import { getInvestorSiteKeyFromPathname } from '../../utils/investorSiteRouting';

export default function InvestorFundRichHtml({ html, className = '' }) {
  const containerRef = useRef(null);
  const location = useLocation();
  const isProfessional = getInvestorSiteKeyFromPathname(location.pathname) === 'investment-professionals';

  useEffect(() => {
    const cleanupInteractivity = hydrateFundInteractivity(containerRef.current);
    hydrateFundCharts(containerRef.current, { isProfessional });

    return cleanupInteractivity;
  }, [html, isProfessional]);

  if (!html) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
