import AboutAwareLink from '../InvestorSite/AboutAwareLink';
import { motion } from 'framer-motion';

function RichParagraph({ parts }) {
  return (
    <p>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          return <span key={index}>{part}</span>;
        }

        return (
          <AboutAwareLink key={index} to={part.href}>
            {part.label}
          </AboutAwareLink>
        );
      })}
    </p>
  );
}

export default function ContentSection({ section, index }) {
  return (
    <>
      <motion.div
        className="portal-section-row"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
      >
        <div className="portal-section-left">
          <h2>{section.heading}</h2>
          <ul className="bullets">
            {section.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="portal-section-right">
          {section.paragraphs.map((parts, partIndex) => (
            <RichParagraph key={partIndex} parts={parts} />
          ))}
        </div>
      </motion.div>
      {index < section.total - 1 && (
        <div className="cmp-separator">
          <hr className="cmp-separator__horizontal-rule" />
        </div>
      )}
    </>
  );
}
