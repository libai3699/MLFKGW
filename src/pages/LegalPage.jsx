import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LegalContent from '../components/Legal/LegalContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { legalPages } from '../data/legalPagesData';
import './portal-pages.css';

export default function LegalPage({ pageKey }) {
  const page = legalPages[pageKey];

  useEffect(() => {
    if (!page) {
      return undefined;
    }

    document.title = page.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [page]);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <PortalPageLayout>
      <div className="main-wrapper legal-page">
        <LegalContent page={page} />
      </div>
    </PortalPageLayout>
  );
}
