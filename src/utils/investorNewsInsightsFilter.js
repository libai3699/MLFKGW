const TAG_PREFIX = 'artisanpartners:team-name/';

export function buildFilterIndex(filterOptions) {
  const index = {};

  for (const option of filterOptions) {
    if (option.value === 'all') {
      continue;
    }

    const path = option.value.replace(TAG_PREFIX, '');
    const [teamSlug, strategySlug] = path.split('/');

    index[option.value] = {
      teamSlug,
      strategySlug: strategySlug || null,
      label: option.label.trim(),
    };
  }

  return index;
}

function getArticleSearchText(article) {
  return [
    article.title,
    article.description,
    article.href,
    ...(article.links?.map((link) => `${link.href} ${link.label}`) || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function textMatchesSlug(text, slug) {
  if (!slug) {
    return false;
  }

  const slugText = slugify(text);
  const compactSlug = slug.replace(/-/g, '');

  return (
    slugText.includes(slug) ||
    text.includes(slug.replace(/-/g, ' ')) ||
    text.replace(/[^a-z0-9]+/g, '').includes(compactSlug)
  );
}

function textMatchesLabel(text, label) {
  if (!label || label.length < 4) {
    return false;
  }

  return text.includes(label.toLowerCase());
}

export function inferArticleTags(article, filterOptions) {
  const text = getArticleSearchText(article);
  const tags = [];

  for (const option of filterOptions) {
    if (option.value === 'all') {
      continue;
    }

    const path = option.value.replace(TAG_PREFIX, '');
    const [teamSlug, strategySlug] = path.split('/');

    if (strategySlug) {
      if (
        textMatchesSlug(text, strategySlug) ||
        textMatchesLabel(text, option.label)
      ) {
        tags.push(option.value);
      }

      continue;
    }

    if (
      textMatchesSlug(text, teamSlug) ||
      textMatchesLabel(text, option.label)
    ) {
      tags.push(option.value);
      continue;
    }

    const childMatches = filterOptions.some((child) => {
      if (!child.value.startsWith(`${option.value}/`)) {
        return false;
      }

      const childSlug = child.value.replace(TAG_PREFIX, '').split('/')[1];
      return childSlug && textMatchesSlug(text, childSlug);
    });

    if (childMatches) {
      tags.push(option.value);
    }
  }

  return tags;
}

export function articleMatchesFilter(article, filterValue) {
  if (!filterValue || filterValue === 'all') {
    return true;
  }

  const tags = article.tags || [];

  if (tags.length === 0) {
    return false;
  }

  const path = filterValue.replace(TAG_PREFIX, '');
  const isStrategyFilter = path.includes('/');

  if (isStrategyFilter) {
    return tags.includes(filterValue);
  }

  return (
    tags.includes(filterValue) ||
    tags.some((tag) => tag.startsWith(`${filterValue}/`))
  );
}

export function filterArticlesByTag(articles, filterValue) {
  return articles.filter((article) => articleMatchesFilter(article, filterValue));
}

export function getResultSummary(filteredCount, currentPage, pageSize = 20) {
  if (filteredCount === 0) {
    return { from: 0, to: 0, total: 0 };
  }

  return {
    from: (currentPage - 1) * pageSize + 1,
    to: Math.min(currentPage * pageSize, filteredCount),
    total: filteredCount,
  };
}
