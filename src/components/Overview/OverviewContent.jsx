import { motion } from 'framer-motion';
import AboutAwareLink from '../InvestorSite/AboutAwareLink';
import { overviewIntro } from '../../data/overviewData';

function renderParagraph(paragraph, index) {
  if (typeof paragraph === 'string') {
    return <p key={index}>{paragraph}</p>;
  }

  const parts = paragraph.text.split(paragraph.link.label);

  return (
    <p key={index}>
      {parts[0]}
      <AboutAwareLink to={paragraph.link.href}>{paragraph.link.label}</AboutAwareLink>
      {parts[1]}
    </p>
  );
}

export default function OverviewContent() {
  return (
    <div className="overview-main-col">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {overviewIntro.title}
      </motion.h1>

      <motion.div
        className="overview-copy"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        {overviewIntro.paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
      </motion.div>
    </div>
  );
}
