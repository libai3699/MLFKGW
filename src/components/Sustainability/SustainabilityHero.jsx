import { motion } from 'framer-motion';
import {
  sustainabilityHomeIntro,
  sustainabilityReportMeta,
} from '../../data/sustainabilityHomeData';

export default function SustainabilityHero() {
  const reportLines = sustainabilityReportMeta.reportHeading.split('\n');

  return (
    <section className="hero home">
      <div className="sustainability-container">
        <div className="hero-grid">
          <div className="hero-title-col">
            <div className="wrapper">
              <motion.div
                className="year fade-in first"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.75 }}
              >
                {sustainabilityReportMeta.year}
              </motion.div>
              <motion.div
                className="hero-report-title fade-in second"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.1 }}
              >
                {reportLines.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < reportLines.length - 1 && <br />}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
          <motion.div
            className="hero-copy-col fade-in third"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {sustainabilityHomeIntro.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 32)}
                className={index === 0 ? 'hero-lead' : undefined}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
