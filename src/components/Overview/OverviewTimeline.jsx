import { motion } from 'framer-motion';
import { timeline } from '../../data/overviewData';

export default function OverviewTimeline() {
  return (
    <motion.div
      className="overview-timeline-wrap"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16 }}
    >
      <table id="overview" className="table">
        <tbody>
          {timeline.map((item) => (
            <tr key={item.year}>
              <td className="year">{item.year}</td>
              <td className="description">
                {item.description.split('\n').map((line, index, lines) => (
                  <span key={`${item.year}-${index}`}>
                    {line}
                    {index < lines.length - 1 && <br />}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className="disclosure">
        Assets under management include assets for which Artisan Partners provides investment models to
        managed account sponsors.
      </span>
    </motion.div>
  );
}
