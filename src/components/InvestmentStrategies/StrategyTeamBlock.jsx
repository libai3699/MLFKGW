import { Link } from 'react-router-dom';

export default function StrategyTeamBlock({ team }) {
  const [firstStrategy, ...restStrategies] = team.strategies;

  return (
    <div className="team">
      <div className="team-row">
        <div className="team-cell team-cell-header">
          <span className="h2">{team.name}</span>
        </div>
        <div className="team-cell">{firstStrategy}</div>
      </div>

      {restStrategies.map((strategy) => (
        <div className="team-row" key={strategy}>
          <div className="team-cell team-cell-spacer d-none d-md-block" aria-hidden="true" />
          <div className="team-cell">{strategy}</div>
        </div>
      ))}

      {team.processHref && (
        <div className="team-row">
          <div className="team-cell team-cell-spacer d-none d-md-block" aria-hidden="true" />
          <div className="team-cell">
            <span className="icon-video" aria-hidden="true" />
            <Link to={team.processHref}>Investment Process</Link>
          </div>
        </div>
      )}
    </div>
  );
}
