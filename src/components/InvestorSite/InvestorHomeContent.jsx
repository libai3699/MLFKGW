import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getInvestorStrategyHref, parseInvestmentHref } from '../../data/investorInvestmentsData';

function resolveThoughtImage(imagePath) {
  if (!imagePath) {
    return null;
  }

  const mapping = {
    '/content/dam/images/investor-updates/artisan-partners-investor-update.jpg':
      '/images/investor/artisan-partners-investor-update.jpg',
    '/content/dam/images/pm-viewpoints/INTV-bloomberg-surveillance-feat-Samra-Aprl-2026.jpg':
      '/images/investor/INTV-bloomberg-surveillance-feat-Samra-Aprl-2026.jpg',
    '/content/dam/images/insights/gss-citywire-pro-buyer-website-thumbnail-764x430.jpg':
      '/images/investor/gss-citywire-pro-buyer-website-thumbnail-764x430.jpg',
    '/content/dam/images/banners/home-side-bar-image-canvas-blog-285x160.png':
      '/images/investor/home-side-bar-image-canvas-blog-285x160.png',
  };

  return mapping[imagePath] || imagePath;
}

function ProcessLink({ item }) {
  const iconClass = item.type === 'video' ? 'icon-video' : 'icon-document';

  if (item.external) {
    return (
      <>
        <span className={iconClass} aria-hidden="true" />
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          {item.label}
        </a>
      </>
    );
  }

  return (
    <>
      <span className={iconClass} aria-hidden="true" />
      <Link to="#">{item.label}</Link>
    </>
  );
}

function TeamCard({ team }) {
  return (
    <div className="investor-team-card spacing">
      <h3>{team.name}</h3>
      <ul className="team-info">
        {team.management && (
          <>
            <li className="heading">Management</li>
            <li>{team.management}</li>
          </>
        )}
        {team.investmentProcess?.length > 0 && (
          <>
            <li className="heading">Investment Process</li>
            <li>
              {team.investmentProcess.map((item, index) => (
                <span key={`${item.label}-${index}`}>
                  {index > 0 && ' '}
                  <ProcessLink item={item} />
                </span>
              ))}
            </li>
          </>
        )}
        {team.strategies?.length > 0 && (
          <>
            <li className="heading">Strategies</li>
            {team.strategies.map((strategy) => {
              const parsed = parseInvestmentHref(strategy.href);
              const to = parsed
                ? getInvestorStrategyHref(parsed.teamSlug, parsed.strategySlug)
                : strategy.href.startsWith('http')
                  ? strategy.href
                  : '#';

              return (
                <li key={strategy.label}>
                  {strategy.href.startsWith('http') ? (
                    <a href={to} target="_blank" rel="noopener noreferrer">
                      {strategy.label}
                    </a>
                  ) : (
                    <Link to={to}>{strategy.label}</Link>
                  )}
                </li>
              );
            })}
          </>
        )}
      </ul>
    </div>
  );
}

function ThoughtLeadership({ articles }) {
  if (!articles?.length) {
    return null;
  }

  const rows = [];
  for (let index = 0; index < articles.length; index += 2) {
    rows.push(articles.slice(index, index + 2));
  }

  return (
    <div id="hp-highlights" className="section investor-thought-leadership">
      <div className="spacing">
        <h2>Thought Leadership</h2>
      </div>
      {rows.map((pair) => (
        <div key={pair.map((item) => item.title).join('-')} className="investor-thought-row">
          {pair.map((article) => {
            const imageSrc = resolveThoughtImage(article.image);
            const iconClass = article.icon ? `icon-${article.icon}` : null;
            const isExternal =
              article.href.startsWith('/content/dam/') || article.cta === 'View Our Blog';

            return (
              <div key={article.title} className="investor-thought-pair">
                {imageSrc && (
                  <div className="investor-thought-image spacing">
                    <img className="img-responsive" src={imageSrc} alt="" />
                  </div>
                )}
                <div className="investor-thought-copy spacing">
                  <ul className="short-article">
                    <li className="title">{article.title}</li>
                    <li className="cta">
                      {iconClass && <span className={iconClass} aria-hidden="true" />}
                      {isExternal ? (
                        <a href={article.href} target="_blank" rel="noopener noreferrer" title={article.title}>
                          {article.cta}
                        </a>
                      ) : (
                        <Link to="#" title={article.title}>
                          {article.cta}
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function InstitutionalHomeContent({ site }) {
  const teamRows = [];
  for (let index = 0; index < site.teams.length; index += 3) {
    teamRows.push(site.teams.slice(index, index + 3));
  }

  return (
    <div id="main" className="investor-main">
      <div className="container investor-container">
        <div className="section investor-teams-section">
          <div className="spacing">
            <h2>Investment Teams &amp; Strategies</h2>
          </div>
          {teamRows.map((row) => (
            <div key={row.map((team) => team.name).join('-')} className="investor-team-grid">
              {row.map((team) => (
                <TeamCard key={team.name} team={team} />
              ))}
            </div>
          ))}
        </div>
        <ThoughtLeadership articles={site.thoughtLeadership} />
      </div>
    </div>
  );
}

function HighlightLink({ item }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" title={item.title}>
        {item.cta}
      </a>
    );
  }

  return (
    <Link to={item.href} title={item.title}>
      {item.cta}
    </Link>
  );
}

function ProfessionalHighlights({ highlights, headingImage }) {
  if (!highlights?.length) {
    return null;
  }

  return (
    <div className="investor-professional-subsection">
      <h2 className="investor-professional-sidebar-mobile-heading">Highlights</h2>
      <div className="side-bar-heading-1-wrapper spacing">
        <div className="side-bar-heading-1-row">
          <div className="side-bar-heading-1">
            <img className="img-responsive" src={headingImage} alt="Highlights" />
          </div>
        </div>
      </div>
      <div className="side-bar-content">
        {highlights.map((item, index) => (
          <div
            key={item.title}
            className={`side-bar-highlight-item${index < highlights.length - 1 ? ' spacing' : ''}`}
          >
            <div className="side-bar-highlight-row">
              <div className="side-bar-highlight-image">
                <img className="img-responsive" src={item.image} alt="" />
              </div>
              <div className="side-bar-highlight-copy">
                <ul className="short-article">
                  <li className="title">{item.title}</li>
                  {item.description && <li className="description">{item.description}</li>}
                  <li className="cta">
                    {item.icon && <span className={`icon-${item.icon}`} aria-hidden="true" />}
                    <HighlightLink item={item} />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfessionalQuickLinks({ links, headingImage }) {
  if (!links?.length) {
    return null;
  }

  return (
    <div className="investor-professional-subsection">
      <h2 className="investor-professional-sidebar-mobile-heading">Quick Links</h2>
      <div className="side-bar-heading-3-wrapper spacing">
        <div className="side-bar-heading-3-row">
          <div className="side-bar-heading-3">
            <img className="img-responsive" src={headingImage} alt="" />
          </div>
        </div>
      </div>
      <div className="side-bar-content">
        <ul className="quick-links">
          {links.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}>
                  {link.label}
                </a>
              ) : (
                <Link to={link.href} title={link.label}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function toFundPath(href) {
  if (!href || href.startsWith('http') || href.startsWith('/content/dam')) {
    return null;
  }

  return href.replace(/\.html(?=($|\?|#))/, '');
}

function FundLink({ href, children }) {
  const path = toFundPath(href);

  if (!path) {
    return children;
  }

  return <Link to={path}>{children}</Link>;
}

function toProfessionalFundPath(href) {
  return toFundPath(href);
}

function ProfessionalFundLink({ href, children }) {
  return <FundLink href={href}>{children}</FundLink>;
}

function FundsHomeSidebar({ site }) {
  return (
    <aside className="side-bar-wrapper investor-funds-home-sidebar">
      <ProfessionalHighlights
        highlights={site.highlights}
        headingImage={site.sidebarHeadings?.highlights}
      />
      <ProfessionalQuickLinks links={site.quickLinks} headingImage={site.sidebarHeadings?.quickLinks} />
    </aside>
  );
}

function ProfessionalSidebar({ site }) {
  return <FundsHomeSidebar site={site} />;
}

export function ProfessionalFundsContent({ site }) {
  const categories = ['All', 'Equity', 'Credit', 'Alternatives'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFunds = site.funds.filter((fund) => {
    if (activeCategory === 'All') {
      return true;
    }

    return fund.categories.split(',').map((item) => item.trim()).includes(activeCategory);
  });

  return (
    <div id="main" className="investor-main">
      <div className="container investor-container">
        <div className="investor-professional-row">
          <div className="investor-professional-main">
            <section className="section investor-funds-section">
              <h2>Explore Our Funds</h2>
              <div className="investor-funds-layout">
                <div className="investor-fund-categories" aria-label="Fund categories">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={activeCategory === category ? 'selected' : ''}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="investor-table-wrap">
                  <table className="investor-table investor-funds-table">
                    <thead>
                      <tr>
                        <th>Fund Name</th>
                        <th>Investor</th>
                        <th>Advisor</th>
                        <th>Institutional</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFunds.map((fund) => (
                        <tr key={fund.fundName}>
                          <td className="fund-name-cell">
                            <ProfessionalFundLink href={fund.advisor?.href}>
                              {fund.fundName}
                            </ProfessionalFundLink>
                          </td>
                          <td>
                            <ProfessionalFundLink href={fund.investor?.href}>
                              {fund.investor.ticker}
                            </ProfessionalFundLink>
                          </td>
                          <td>
                            <ProfessionalFundLink href={fund.advisor?.href}>
                              {fund.advisor.ticker}
                            </ProfessionalFundLink>
                          </td>
                          <td>
                            <ProfessionalFundLink href={fund.institutional?.href}>
                              {fund.institutional.ticker}
                            </ProfessionalFundLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          <ProfessionalSidebar site={site} />
        </div>
      </div>
    </div>
  );
}

export function IndividualFundsContent({ site }) {
  const categories = ['All', 'Equity', 'Credit', 'Alternatives'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFunds = site.funds.filter((fund) => {
    if (activeCategory === 'All') {
      return true;
    }

    return fund.categories.split(',').map((item) => item.trim()).includes(activeCategory);
  });

  return (
    <div id="main" className="investor-main">
      <div className="container investor-container">
        <div className="investor-professional-row">
          <div className="investor-professional-main">
            <section className="section investor-funds-section">
              <h2>Explore Our Funds</h2>
              <div className="investor-funds-layout investor-individual-funds-layout">
                <div className="investor-individual-fund-categories hidden-xs" aria-label="Fund categories">
                  <table className="investor-table investor-individual-category-table">
                    <tbody>
                      {categories.map((category) => {
                        const dataCategory = category === 'All' ? 'all' : category;
                        const isSelected =
                          activeCategory === category ||
                          (category === 'All' && activeCategory === 'All');

                        return (
                          <tr key={category}>
                            <td
                              className={isSelected ? 'selected' : ''}
                              data-category={dataCategory}
                              role="button"
                              tabIndex={0}
                              onClick={() => setActiveCategory(category)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  setActiveCategory(category);
                                }
                              }}
                            >
                              {category}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="investor-individual-funds-table-wrap hp-vertical-line">
                  <div className="investor-individual-fund-categories visible-xs" aria-label="Fund categories">
                    <div className="investor-fund-categories">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          className={activeCategory === category ? 'selected' : ''}
                          onClick={() => setActiveCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="investor-table-wrap">
                    <table className="investor-table investor-funds-table investor-individual-funds-table">
                      <thead>
                        <tr>
                          <th>Fund Name</th>
                          <th>Investment Team</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFunds.map((fund) => (
                          <tr key={fund.label} data-category={fund.categories}>
                            <td className="fund-name-cell">
                              <FundLink href={fund.href}>{fund.label}</FundLink>
                            </td>
                            <td>{fund.team}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <FundsHomeSidebar site={site} />
        </div>
      </div>
    </div>
  );
}

export function GlobalHomeContent({ country, content }) {
  return (
    <div id="main" className="investor-main">
      <div className="container investor-container">
        <section className="section">
          <h2>{content.introTitle}</h2>
          <div className="investor-intro-grid">
            <div>
              <p>{content.introParagraphs[0]}</p>
              <p>{content.introParagraphs[1]}</p>
            </div>
            <div>
              <p>{content.introParagraphs[2]}</p>
              <blockquote>
                <cite>Quick Fact: </cite>
                {content.quickFact}
              </blockquote>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Investments by Category</h2>
          <div className="investor-table-wrap">
            <table className="investor-table">
              <thead>
                <tr>
                  <th>Strategy Name</th>
                  <th>Investment Team</th>
                </tr>
              </thead>
              <tbody>
                {content.funds.map((fund) => (
                  <tr key={`${fund.strategyName}-${fund.teamName}`}>
                    <td>
                      <Link to="#">{fund.strategyName}</Link>
                    </td>
                    <td>
                      <Link to="#">{fund.teamName}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ThoughtLeadership articles={content.thoughtLeadership} />

        <section className="section investor-disclaimer">
          <p>{content.disclaimer.replace('wholesale clients', `${country.name} wholesale clients`)}</p>
        </section>
      </div>
    </div>
  );
}
