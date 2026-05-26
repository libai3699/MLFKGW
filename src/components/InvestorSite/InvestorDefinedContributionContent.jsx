import { Link } from 'react-router-dom';

const ORIGINAL_SITE = 'https://www.artisanpartners.com';

function resolveResourcesHref(href, query) {
  if (!href) {
    return href;
  }

  if (href.startsWith('http') || href.startsWith('/content/dam/')) {
    return href;
  }

  if (href.startsWith('/institutional-investors/resources')) {
    if (href.includes('?')) {
      return href;
    }

    return query ? `/institutional-investors/resources?${query}` : '/institutional-investors/resources';
  }

  if (href.startsWith('/institutional-investors/')) {
    return href;
  }

  return href;
}

function resolveInsightHref(href, external) {
  if (external || href.startsWith('http') || href.startsWith('/content/dam/')) {
    return href;
  }

  if (href.startsWith('/institutional-investors/')) {
    return `${ORIGINAL_SITE}${href}.html`;
  }

  return href;
}

export default function InvestorDefinedContributionContent({ page }) {
  return (
    <div className="investor-dc-page">
      <div
        className="investor-dc-hero"
        style={{ backgroundImage: `url(${page.bannerImage})` }}
      >
        <div className="investor-dc-hero-copy">
          <h1>{page.heading}</h1>
          {page.intro && <p>{page.intro}</p>}
        </div>
      </div>

      <div className="investor-dc-main">
        <div className="investor-dc-grid">
          <div className="investor-dc-primary">
            <section className="investor-dc-section">
              <h2>Investment Teams &amp; Strategies</h2>
              <div className="investor-table-wrap">
                <table className="investor-table investor-dc-table">
                  <thead>
                    <tr>
                      <th>Team/Strategy</th>
                      <th className="investor-dc-resources-col">Vehicles Offered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.teams.map((row, index) =>
                      row.type === 'team' ? (
                        <tr key={`team-${row.name}`} className="investor-dc-team-row">
                          <td colSpan={2}>{row.name}</td>
                        </tr>
                      ) : (
                        <tr key={`${row.team}-${row.label}-${index}`}>
                          <td>
                            <Link to={row.href}>{row.label}</Link>
                          </td>
                          <td className="investor-dc-resources-col">
                            {row.resources ? (
                              <>
                                <span className="icon-window" aria-hidden="true" />
                                <Link to={resolveResourcesHref(row.resources.href, row.resources.query)}>
                                  {row.resources.label}
                                </Link>
                              </>
                            ) : null}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="investor-dc-sidebar">
            <section className="investor-dc-section investor-dc-login-panel">
              <h2>{page.loginPanel.heading}</h2>
              <ul className="bullets">
                {page.loginPanel.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="btn btn-default" href={page.loginPanel.href}>
                {page.loginPanel.ctaLabel}
              </a>
            </section>

            <section className="investor-dc-section">
              <h2>Insights</h2>
              <div className="investor-dc-insights">
                {page.insights.map((article) => {
                  const href = resolveInsightHref(article.href, article.external);
                  const isExternal =
                    article.external || href.startsWith('http') || href.startsWith('/content/dam/');

                  return (
                    <article key={article.title} className="investor-dc-insight-item">
                      {article.image && (
                        <img className="investor-dc-insight-image" src={article.image} alt="" />
                      )}
                      <ul className="short-article">
                        <li className="title">{article.title}</li>
                        {article.description && <li className="description">{article.description}</li>}
                        <li className="cta">
                          {isExternal ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" title={article.title}>
                              {article.ctaLabel}
                            </a>
                          ) : (
                            <a href={href} title={article.title}>
                              {article.ctaLabel}
                            </a>
                          )}
                        </li>
                      </ul>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
