import { Link } from 'react-router-dom';
import { getInvestorStrategyHref, getInvestorTeamHref } from '../../data/investorInvestmentsData';

function getTeamItems(team) {
  return team.items || team.strategies || [];
}

function getTeamHref(team, basePath) {
  return team.teamHref || getInvestorTeamHref(team.teamSlug, basePath);
}

function getItemHref(team, item, basePath) {
  if (item.href) {
    return item.href;
  }

  return getInvestorStrategyHref(team.teamSlug, item.slug, basePath);
}

function TeamColumn({ team, basePath, onNavigate }) {
  const items = getTeamItems(team);

  return (
    <div className="investor-subnav-column">
      <ul>
        <li>
          <Link className="heading" to={getTeamHref(team, basePath)} onClick={onNavigate}>
            {team.navLabel}
          </Link>
          <ul>
            {items.map((item) => (
              <li key={item.slug || item.label}>
                <Link to={getItemHref(team, item, basePath)} onClick={onNavigate}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default function InvestorInvestmentsSubnav({
  teams,
  onNavigate,
  basePath = '/institutional-investors/investments',
}) {
  return (
    <div className="investor-subnav-mega">
      <div className="investor-subnav-mega-row">
        {teams.slice(0, 6).map((team) => (
          <TeamColumn key={team.teamSlug} team={team} basePath={basePath} onNavigate={onNavigate} />
        ))}
      </div>
      {teams.length > 6 && (
        <div className="investor-subnav-mega-row investor-subnav-mega-row-secondary">
          {teams.slice(6).map((team) => (
            <TeamColumn key={team.teamSlug} team={team} basePath={basePath} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}
