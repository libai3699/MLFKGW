import { motion } from 'framer-motion';
import { investmentStrategiesPage } from '../../data/investmentStrategiesData';
import StrategyTeamBlock from './StrategyTeamBlock';

export default function InvestmentStrategiesContent() {
  return (
    <div className="investment-strategies-page">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {investmentStrategiesPage.title}
      </motion.h1>

      <motion.p
        className="investment-strategies-intro"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
      >
        {investmentStrategiesPage.intro}
      </motion.p>

      <motion.div
        id="investment-strategies"
        className="investment-strategies-layout"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div className="investment-strategies-teams bracket">
          {investmentStrategiesPage.teams.map((team) => (
            <StrategyTeamBlock key={team.id} team={team} />
          ))}
        </div>

        <div className="investment-strategies-vehicles">
          <p>{investmentStrategiesPage.vehiclesIntro}</p>
          <ul className="bullets">
            {investmentStrategiesPage.vehicles.map((vehicle) => (
              <li key={vehicle}>{vehicle}</li>
            ))}
          </ul>
          <p className="vehicles-disclaimer">{investmentStrategiesPage.vehiclesDisclaimer}</p>
        </div>
      </motion.div>
    </div>
  );
}
