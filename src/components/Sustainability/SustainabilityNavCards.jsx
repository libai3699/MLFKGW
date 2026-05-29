import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sustainabilityNavCards } from '../../data/sustainabilityHomeData';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SustainabilityNavCards() {
  return (
    <section id="homepage-nav">
      <div className="sustainability-container">
        <motion.nav
          className="homepage-nav-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {sustainabilityNavCards.map((card, index) => (
            <motion.div className="homepage-nav-col" key={card.id} variants={cardVariants}>
              <Link to={card.href} className="homepage-nav-link">
                <div
                  className="card h-100"
                  style={
                    card.backgroundImage
                      ? { backgroundImage: `url(${card.backgroundImage})` }
                      : undefined
                  }
                >
                  <div className={`card-body ${card.gradientClass}`}>
                    <span className="homepage-nav-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="homepage-nav-label">
                      {card.label.split('\n').map((line, lineIndex, lines) => (
                        <span key={line}>
                          {line}
                          {lineIndex < lines.length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                    <span className="homepage-nav-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.nav>
      </div>
    </section>
  );
}
