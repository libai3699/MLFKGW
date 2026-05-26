import { useEffect } from 'react';
import ContactUsContent from '../components/Contact/ContactUsContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { contactUsPage } from '../data/contactUsData';
import './portal-pages.css';

export default function ContactUsPage() {
  useEffect(() => {
    document.title = contactUsPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  return (
    <PortalPageLayout>
      <div className="main-wrapper contact-us-page">
        <ContactUsContent page={contactUsPage} />
      </div>
    </PortalPageLayout>
  );
}
