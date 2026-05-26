import { useEffect } from 'react';
import { motion } from 'framer-motion';
import OurPeopleContent from '../components/Careers/OurPeopleContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { ourPeoplePage } from '../data/ourPeopleData';
import './portal-pages.css';

export default function OurPeoplePage() {
  useEffect(() => {
    document.title = ourPeoplePage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  return (
    <PortalPageLayout>
      <div className="main-wrapper our-people-page bg-careers-small">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {ourPeoplePage.title}
        </motion.h1>
        <OurPeopleContent page={ourPeoplePage} />
      </div>
    </PortalPageLayout>
  );
}
