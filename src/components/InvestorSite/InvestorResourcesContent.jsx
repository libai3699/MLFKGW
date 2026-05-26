import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { filterResourceRows } from '../../utils/investorResourcesFilter';
import { InvestorResourcesTable } from './InvestorResourcesTable';

export default function InvestorResourcesContent({ page }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFilter = searchParams.get('resources-select') || 'all';
  const validFilter = page.filterOptions.some((option) => option.value === queryFilter)
    ? queryFilter
    : 'all';
  const [filter, setFilter] = useState(validFilter);

  useEffect(() => {
    setFilter(validFilter);
  }, [validFilter]);

  const filteredRows = useMemo(
    () => filterResourceRows(page.rows, filter),
    [page.rows, filter],
  );

  const handleFilterChange = (value) => {
    setFilter(value);
    const nextParams = new URLSearchParams(searchParams);

    if (value === 'all') {
      nextParams.delete('resources-select');
    } else {
      nextParams.set('resources-select', value);
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="investor-resources-content">
      <div className="investor-news-filter">
        <label htmlFor="resources-select">Vehicle/Strategy</label>
        <select
          id="resources-select"
          name="resources-select"
          value={filter}
          onChange={(event) => handleFilterChange(event.target.value)}
        >
          {page.filterOptions.map((option) => (
            <option key={`${option.value}-${option.label}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredRows.length === 0 ? (
        <p className="investor-news-empty">No resources match the selected filter.</p>
      ) : (
        <InvestorResourcesTable page={page} rows={filteredRows} />
      )}
    </div>
  );
}
