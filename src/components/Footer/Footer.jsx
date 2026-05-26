import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { footerContent } from '../../data/siteData';

export default function Footer({ onOpenModal }) {
  return (
    <footer className="footer-section">
      <div id="footer" className="container-md">
        <div className="row">
          <div className="col-xs-12">
            <motion.div
              className="content"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              {footerContent.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              <p>
                {footerContent.links.map((link, index) => (
                  <span key={link.label}>
                    {index > 0 && <span> | </span>}
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href}>{link.label}</Link>
                    )}
                  </span>
                ))}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <button type="button" className="sr-only-trigger" onClick={onOpenModal}>
        Open investor modal
      </button>
    </footer>
  );
}
