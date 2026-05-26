import AboutAwareLink from '../InvestorSite/AboutAwareLink';
import { motion } from 'framer-motion';
import { atAGlance } from '../../data/overviewData';

function StatList({ heading, value }) {
  return (
    <div className="items-list">
      <ul className="side-bar-list">
        <li className="heading">{heading}</li>
        <li>{value}</li>
      </ul>
    </div>
  );
}

function BulletList({ heading, items, getHref }) {
  return (
    <div className="items-list">
      <ul className="side-bar-list bullets">
        <li className="heading">{heading}</li>
        {items.map((item) => {
          const label = typeof item === 'string' ? item : item.label;
          const href = getHref(item);

          return (
            <li key={label}>
              <span className="bullets" />
              <AboutAwareLink to={href}>{label}</AboutAwareLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AtAGlance() {
  return (
    <motion.div
      className="aag-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="side-content-ataglance">
        <h4>AT A GLANCE</h4>
        <div>
          {atAGlance.stats.map((stat) => (
            <StatList key={stat.heading} heading={stat.heading} value={stat.value} />
          ))}

          <BulletList
            heading="Investment Teams"
            items={atAGlance.investmentTeams}
            getHref={() => '/about-us/investment-strategies'}
          />

          <BulletList
            heading="Investment Strategies"
            items={atAGlance.investmentStrategies}
            getHref={(item) => item.href}
          />

          <div className="items-list">
            <ul className="side-bar-list">
              <li className="heading">Global Offices</li>
            </ul>
          </div>

          {Object.entries(atAGlance.offices).map(([region, cities]) => (
            <div className="items-list" key={region}>
              <ul className="side-bar-list">
                <li className="heading">{region}</li>
                {cities.map((city) => (
                  <li key={city}>{city}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
