import { motion } from 'framer-motion';
import ContentSection from '../components/Portal/ContentSection';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { whoWeArePage } from '../data/whoWeAreData';
import './portal-pages.css';

export default function WhoWeArePage() {
  const total = whoWeArePage.sections.length;

  return (
    <PortalPageLayout>
      <div className="main-wrapper who-we-are-page">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {whoWeArePage.title}
        </motion.h1>

        {whoWeArePage.sections.map((section, index) => (
          <ContentSection
            key={section.id}
            section={{ ...section, total }}
            index={index}
          />
        ))}
      </div>
    </PortalPageLayout>
  );
}
