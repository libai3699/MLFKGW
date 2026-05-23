import { motion } from 'framer-motion';
import { promo } from '../../data/siteData';

export default function Promo() {
  return (
    <motion.div
      id="promo-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.55 }}
    >
      <div className="promo-container">
        <ul>
          <li className="header">{promo.title}</li>
          <li>{promo.description}</li>
          <li className="cta">
            <a id="promo-link" href={promo.href} target="_blank" rel="noopener noreferrer">
              {promo.cta}
            </a>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
