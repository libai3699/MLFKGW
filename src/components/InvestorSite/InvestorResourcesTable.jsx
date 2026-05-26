import { Fragment } from 'react';
import { Link } from 'react-router-dom';

function DocumentLink({ link }) {
  if (!link) {
    return null;
  }

  if (link.locked) {
    return (
      <span className="investor-resource-locked">
        <span className="icon-locked" aria-hidden="true" />
        {link.label}
      </span>
    );
  }

  if (link.href) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}>
        <span className="icon-document" aria-hidden="true" />
        {link.label}
      </a>
    );
  }

  return null;
}

export function InvestorResourcesTable({ page, rows }) {
  const groups = [];
  let currentGroup = null;

  for (const row of rows) {
    if (row.type === 'strategy') {
      currentGroup = { strategy: row, funds: [] };
      groups.push(currentGroup);
      continue;
    }

    if (currentGroup) {
      currentGroup.funds.push(row);
    }
  }

  return (
    <div className="investor-resources-table-wrap">
      {page.teamLegend?.length > 0 && (
        <table className="investor-table investor-resources-legend">
          <tbody>
            {Array.from({ length: Math.ceil(page.teamLegend.length / 2) }, (_, rowIndex) => (
              <tr key={`legend-${rowIndex}`}>
                {[0, 1].map((colIndex) => {
                  const item = page.teamLegend[rowIndex * 2 + colIndex];
                  if (!item) {
                    return <td key={`empty-${colIndex}`} />;
                  }

                  return (
                    <td key={item.teamSlug}>
                      <span className={`team-id ${item.teamSlug}`} aria-hidden="true" />
                      {item.label}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="investor-table-wrap">
        <table className="investor-table investor-resources-table">
          <tbody>
            {groups.map((group) => (
              <Fragment key={group.strategy?.name || group.funds[0]?.name}>
                <tr className="investor-resources-group-heading">
                  <th>Team</th>
                  <th>Name</th>
                  <th>Commentaries</th>
                  <th>Fact Sheets</th>
                  <th>Attribution</th>
                </tr>
                {group.strategy && (
                  <tr>
                    <td data-text={group.strategy.teamSlug}>
                      <span className={`team-id ${group.strategy.teamSlug}`} aria-hidden="true" />
                    </td>
                    <td className="strategy-name">
                      <strong>
                        {group.strategy.strategyHref ? (
                          <Link to={group.strategy.strategyHref}>{group.strategy.name}</Link>
                        ) : (
                          group.strategy.name
                        )}
                      </strong>
                    </td>
                    <td>
                      <DocumentLink link={group.strategy.commentaries} />
                    </td>
                    <td>
                      <DocumentLink link={group.strategy.factSheets} />
                    </td>
                    <td>
                      <DocumentLink link={group.strategy.attribution} />
                    </td>
                  </tr>
                )}
                {group.funds.map((fund) => (
                  <tr key={fund.name}>
                    <td data-text={fund.teamSlug}>
                      <span className={`team-id ${fund.teamSlug}`} aria-hidden="true" />
                    </td>
                    <td className="fund-name">{fund.name}</td>
                    <td>
                      <DocumentLink link={fund.commentaries} />
                    </td>
                    <td>
                      <DocumentLink link={fund.factSheets} />
                    </td>
                    <td>
                      <DocumentLink link={fund.attribution} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {page.footnote && <p className="investor-resources-footnote">{page.footnote}</p>}
    </div>
  );
}
