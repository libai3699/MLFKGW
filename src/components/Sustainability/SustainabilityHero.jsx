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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.2 }}
          >
            {sustainabilityHomeIntro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
