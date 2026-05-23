import { motion } from 'framer-motion';
import { investmentCulturePage } from '../../data/investmentCultureData';

export default function InvestmentCultureContent() {
  return (
    <div className="culture-main-col">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {investmentCulturePage.title}
      </motion.h1>

      <motion.blockquote
        className="culture-quote p-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
      >
        {investmentCulturePage.quote.text}
        <cite>{investmentCulturePage.quote.cite}</cite>
      </motion.blockquote>

      <motion.div
        className="culture-image-wrap"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <img
          className="culture-image img-fluid"
          src={investmentCulturePage.image.src}
          alt={investmentCulturePage.image.alt}
        />
      </motion.div>

      <motion.div
        className="culture-body"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
      >
        <p>{investmentCulturePage.intro}</p>
        {investmentCulturePage.sections.map((section) => (
          <div className="culture-section" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
