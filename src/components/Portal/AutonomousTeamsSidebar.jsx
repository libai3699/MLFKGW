import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AutonomousTeamsSidebar({ heading, teams }) {
  return (
    <motion.div
      className="aag-container"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <div className="side-content-ataglance">
        <div>
          <div className="items-list">
            <ul className="side-bar-list">
              <li className="heading">{heading}</li>
            </ul>
          </div>
          <div className="items-list">
            <ul className="side-bar-list bullets">
              <li className="heading spacer-heading">&nbsp;</li>
              {teams.map((team) => (
                <li key={team}>
                  <span className="bullets" />
                  <Link to="/about-us/investment-strategies">{team}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
