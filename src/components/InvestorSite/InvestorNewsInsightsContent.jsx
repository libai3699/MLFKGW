import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  articleMatchesFilter,
  filterArticlesByTag,
  getResultSummary,
} from '../../utils/investorNewsInsightsFilter';
import { getInvestorSiteKeyFromPathname } from '../../utils/investorSiteRouting';

const ORIGINAL_SITE = 'https://www.artisanpartners.com';
const PAGE_SIZE = 20;

function resolveArticleHref(href, external, siteKey) {
  if (!href) {
    return href;
  }

  if (external || href.startsWith('http') || href.startsWith('/content/dam/')) {
    return href;
  }

  if (siteKey === 'individual-investors' || siteKey === 'investment-professionals') {
    if (href.startsWith(`/${siteKey}/`)) {
      if (/\/press-releases\/\d{4}\//.test(href)) {
        return `${ORIGINAL_SITE}${href.endsWith('.html') ? href : `${href}.html`}`;
      }

      return href.replace(/\.html(?=($|\?|#))/, '');
    }
  }

  if (href.startsWith('/institutional-investors/')) {
    return `${ORIGINAL_SITE}${href}.html`;
  }

  return href;
}

function ArticleHref({ href, external, className, children, title }) {
  const location = useLocation();
  const siteKey = getInvestorSiteKeyFromPathname(location.pathname);
  const resolvedHref = resolveArticleHref(href, external, siteKey);
  const isExternal =
    external ||
    resolvedHref.startsWith('http') ||
    resolvedHref.startsWith('/content/dam/') ||
    resolvedHref.startsWith(ORIGINAL_SITE);

  if (isExternal) {
    return (
      <a
        className={className}
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} to={resolvedHref} title={title}>
      {children}
    </Link>
  );
}

function TeamFilter({ filterOptions, value, onChange, resultSummary, filterLabel = 'Team/Strategy' }) {
  return (
    <div className="investor-news-filter">
      <label htmlFor="tagselection">{filterLabel}</label>
      <select
        id="tagselection"
        name="tagselection"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {resultSummary && (
        <p className="investor-news-result-summary">
          Showing {resultSummary.from} - {resultSummary.to} of {resultSummary.total} results
        </p>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <ul className="investor-news-pagination">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <li key={page}>
            <button
              type="button"
              className={page === currentPage ? 'active' : ''}
              onClick={() => onChange(page)}
            >
              {page}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function useTeamStrategyFilter(page) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFilter = searchParams.get('tagselection') || 'all';
  const validFilter = page.filterOptions.some((option) => option.value === queryFilter)
    ? queryFilter
    : 'all';
  const [filter, setFilter] = useState(validFilter);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilter(validFilter);
    setCurrentPage(1);
  }, [validFilter]);

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);

    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      nextParams.delete('tagselection');
    } else {
      nextParams.set('tagselection', value);
    }

    setSearchParams(nextParams, { replace: true });
  };

  return {
    filter,
    currentPage,
    setCurrentPage,
    handleFilterChange,
  };
}

export function PressReleasesContent({ page }) {
  const { filter, currentPage, setCurrentPage, handleFilterChange } = useTeamStrategyFilter(page);

  const filteredArticles = useMemo(
    () => filterArticlesByTag(page.articles, filter),
    [page.articles, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const pageArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredArticles.slice(start, start + PAGE_SIZE);
  }, [filteredArticles, currentPage]);

  const resultSummary = getResultSummary(filteredArticles.length, currentPage, PAGE_SIZE);

  return (
    <div className="investor-news-insights-content">
      <TeamFilter
        filterOptions={page.filterOptions}
        value={filter}
        onChange={handleFilterChange}
        resultSummary={resultSummary}
        filterLabel={page.filterLabel || 'Team/Strategy'}
      />

      {pageArticles.length === 0 && (
        <p className="investor-news-empty">No results match the selected team or strategy.</p>
      )}

      {pageArticles.map((article) => (
        <div key={`${article.date}-${article.title}`} className="investor-press-release-row">
          <div className="investor-press-release-date">{article.date}</div>
          <div className="investor-press-release-body">
            <ul className="article">
              <li className="title">{article.title}</li>
              {article.description && <li className="description">{article.description}</li>}
              <li className="cta">
                {article.links.map((link, index) => (
                  <span key={`${link.label}-${index}`}>
                    {index > 0 && <span className="investor-link-sep" />}
                    <ArticleHref href={link.href} external={link.external} title={link.label}>
                      {link.label}
                    </ArticleHref>
                  </span>
                ))}
              </li>
            </ul>
          </div>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />
    </div>
  );
}

function FeaturedArticleCard({ article }) {
  return (
    <div className="investor-featured-article">
      <ul className="featured-article">
        {article.image && (
          <li className="img">
            <img src={article.image} alt="" />
          </li>
        )}
        <li className="title">{article.title}</li>
        {article.description && <li className="description">{article.description}</li>}
        <li className="cta">
          <ArticleHref href={article.href} external={article.external} title={article.title}>
            {article.ctaLabel}
          </ArticleHref>
        </li>
      </ul>
    </div>
  );
}

function ShortArticleRow({ article }) {
  return (
    <div className="investor-insight-row">
      {article.image && (
        <div className="investor-insight-thumb">
          <img src={article.image} alt="" />
        </div>
      )}
      <div className="investor-insight-body">
        <ul className="short-article">
          <li className="title">{article.title}</li>
          {article.description && <li className="description">{article.description}</li>}
          <li className="cta">
            <ArticleHref href={article.href} external={article.external} title={article.title}>
              {article.ctaLabel}
            </ArticleHref>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function InsightsContent({ page }) {
  const { filter, currentPage, setCurrentPage, handleFilterChange } = useTeamStrategyFilter(page);

  const filteredArticles = useMemo(
    () => filterArticlesByTag(page.articles, filter),
    [page.articles, filter],
  );

  const filteredFeatured = useMemo(() => {
    if (filter === 'all') {
      return page.featured || [];
    }

    return (page.featured || []).filter((article) => articleMatchesFilter(article, filter));
  }, [page.featured, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const pageArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredArticles.slice(start, start + PAGE_SIZE);
  }, [filteredArticles, currentPage]);

  const resultSummary = getResultSummary(filteredArticles.length, currentPage, PAGE_SIZE);
  const showFeatured = currentPage === 1 && filteredFeatured.length > 0;

  return (
    <div className="investor-news-insights-content">
      <TeamFilter
        filterOptions={page.filterOptions}
        value={filter}
        onChange={handleFilterChange}
        resultSummary={resultSummary}
        filterLabel={page.filterLabel || 'Team/Strategy'}
      />

      {showFeatured && (
        <div className="investor-featured-highlights">
          <div className="investor-featured-grid">
            {filteredFeatured.map((article) => (
              <FeaturedArticleCard key={article.title} article={article} />
            ))}
          </div>
        </div>
      )}

      {pageArticles.length === 0 && !showFeatured && (
        <p className="investor-news-empty">No results match the selected team or strategy.</p>
      )}

      {pageArticles.map((article) => (
        <ShortArticleRow key={article.title} article={article} />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />
    </div>
  );
}
