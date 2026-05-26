import { useEffect } from 'react';
import SustainabilityHeader from './SustainabilityHeader';
import SustainabilityFooter from './SustainabilityFooter';
import '../../pages/sustainability.css';

export default function SustainabilityLayout({ children, pageTitle, activeNavId = 0 }) {
  useEffect(() => {
    document.body.classList.add('sustainability-site');
    document.body.dataset.navId = String(activeNavId);

    if (pageTitle) {
      document.title = pageTitle;
    }

    return () => {
      document.body.classList.remove('sustainability-site');
      delete document.body.dataset.navId;
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [pageTitle, activeNavId]);

  return (
    <div className="sustainability-page">
      <SustainabilityHeader activeNavId={activeNavId} />
      <main>{children}</main>
      <SustainabilityFooter />
    </div>
  );
}
