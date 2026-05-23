import { motion } from 'framer-motion';
import { introText } from '../../data/siteData';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="main-wrapper">
        <div className="main">
          <div className="content">
            <div className="container-md">
              <div className="row">
                <div className="col-12 col-xl-6 col-xxl-7">
                  <motion.a
                    className="d-none d-xl-block"
                    href="/"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <img
                      className="img-fluid logo"
                      src="/images/aplp-logo.png"
                      alt="Artisan Partners logo"
                    />
                  </motion.a>
                  <motion.div
                    className="intro-text"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                  >
                    {introText}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
