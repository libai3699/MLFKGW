const TAG_PREFIX = 'artisanpartners:team-name/';

export function resourceRowMatchesFilter(row, filterValue) {
  if (!filterValue || filterValue === 'all') {
    return true;
  }

  if (filterValue === 'fund') {
    return row.type === 'fund';
  }

  if (filterValue === 'strategy') {
    return row.type === 'strategy';
  }

  if (filterValue === 'cit') {
    return row.vehicles?.includes('cit');
  }

  if (filterValue.startsWith(TAG_PREFIX)) {
    const path = filterValue.replace(TAG_PREFIX, '');
    const isStrategyFilter = path.includes('/');

    if (isStrategyFilter) {
      return row.strategyTag === filterValue;
    }

    return row.teamSlug === path || row.strategyTag?.startsWith(`${filterValue}/`);
  }

  return true;
}

export function filterResourceRows(rows, filterValue) {
  return rows.filter((row) => resourceRowMatchesFilter(row, filterValue));
}

export function groupResourceRows(rows) {
  const groups = [];
  let currentGroup = null;

  for (const row of rows) {
    if (row.type === 'strategy') {
      currentGroup = {
        strategy: row,
        funds: [],
      };
      groups.push(currentGroup);
      continue;
    }

    if (currentGroup) {
      currentGroup.funds.push(row);
    } else {
      groups.push({ strategy: null, funds: [row] });
    }
  }

  return groups;
}
