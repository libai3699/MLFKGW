import { useEffect, useRef } from 'react';
import InvestorSiteHeader from './InvestorSiteHeader';
import InvestorSiteFooter from './InvestorSiteFooter';

export default function InvestorSiteLayout({ site, countryName, pageHeading, pageClassName, children }) {
  const pageRef = useRef(null);

  useEffect(() => {
    const pageEl = pageRef.current;
    if (!pageEl) {
      return undefined;
    }

    const syncHeaderHeight = () => {
      const header = pageEl.querySelector('.investor-site-header');
      if (!header) {
        return;
      }

      pageEl.style.setProperty('--investor-site-header-height', `${header.offsetHeight}px`);
    };

    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);

    const header = pageEl.querySelector('.investor-site-header');
    const observer =
      typeof ResizeObserver !== 'undefined' && header
        ? new ResizeObserver(syncHeaderHeight)
        : null;
    observer?.observe(header);

    return () => {
      window.removeEventListener('resize', syncHeaderHeight);
      observer?.disconnect();
    };
  }, [pageHeading, countryName, site.id]);

  return (
    <div
      ref={pageRef}
      className={`investor-site-page investor-site-page--${site.id}${pageClassName ? ` ${pageClassName}` : ''}`}
    >
      <InvestorSiteHeader site={site} countryName={countryName} pageHeading={pageHeading} />
      {children}
      <InvestorSiteFooter site={site} />
    </div>
  );
}