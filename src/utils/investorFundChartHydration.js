const ASSET_BASE = 'https://www.artisanpartners.com';
const PIE_COLORS = ['#005543', '#666666', '#003366', '#909b42'];
const PROFESSIONAL_PIE_COLORS = ['#909b42', '#666666', '#003366', '#005543'];

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#8212;/g, '—')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&');
}

function parseChartData(raw) {
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function renderPieSvg(items, colors) {
  const slices = items.filter((item) => !item.isTotalField);
  const total = slices.reduce((sum, item) => sum + (parseFloat(item.categoryValue) || 0), 0);

  if (!total) {
    return '';
  }

  let startAngle = -90;
  const cx = 80;
  const cy = 80;
  const radius = 70;
  const paths = slices.map((item, index) => {
    const value = parseFloat(item.categoryValue) || 0;
    const angle = (value / total) * 360;
    const endAngle = startAngle + angle;
    const path = describeArc(cx, cy, radius, startAngle, endAngle);
    startAngle = endAngle;
    const color = colors[index % colors.length];

    return `<path d="${path}" fill="${color}" stroke="#fff" stroke-width="1"></path>`;
  });

  return `<svg viewBox="0 0 160 160" class="investor-fund-pie-chart" aria-hidden="true">${paths.join('')}</svg>`;
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function renderLegendTable(table, items, colors) {
  if (!table) {
    return;
  }

  const tbody = table.querySelector('tbody') || table;
  tbody.innerHTML = items
    .filter((item) => !item.isTotalField)
    .map((item, index) => {
      const color = colors[index % colors.length];
      return `<tr><td><span class="investor-chart-swatch" style="background:${color}"></span>${item.categoryName}</td><td>${decodeHtml(item.categoryValue)}</td></tr>`;
    })
    .concat(
      items
        .filter((item) => item.isTotalField)
        .map(
          (item) =>
            `<tr class="total"><td>${item.categoryName}</td><td>${decodeHtml(item.categoryValue)}</td></tr>`,
        ),
    )
    .join('');
}

function renderCyrFallback(container, data, years) {
  const series = data.filter((item) => item.tableCells?.length);
  const colors = ['#909b42', '#666666'];
  const values = series.flatMap((item) =>
    item.tableCells.map((cell) => {
      const value = parseFloat(decodeHtml(cell));
      return Number.isFinite(value) ? value : 0;
    }),
  );
  const maxValue = Math.max(...values, 1);

  const html = `
    <div class="investor-fund-cyr-chart-fallback">
      <div class="investor-fund-cyr-legend">
        ${series
          .map(
            (item, index) =>
              `<span><i style="background:${colors[index % colors.length]}"></i>${item.tableHeader}</span>`,
          )
          .join('')}
      </div>
      <div class="investor-fund-cyr-grouped">
        ${years
          .map((year, yearIndex) => {
            const bars = series
              .map((item, seriesIndex) => {
                const raw = decodeHtml(item.tableCells[yearIndex]);
                const value = parseFloat(raw);
                const height = Number.isFinite(value) ? `${(value / maxValue) * 100}%` : '0';
                return `<div class="investor-fund-cyr-bar" style="height:${height};background:${colors[seriesIndex % colors.length]}"></div>`;
              })
              .join('');
            return `<div class="investor-fund-cyr-year-group"><div class="investor-fund-cyr-bars-group">${bars}</div><span>${year}</span></div>`;
          })
          .join('')}
      </div>
    </div>`;

  container.innerHTML = html;
}

function hydrateCyrChart(container) {
  const data = parseChartData(container.getAttribute('data-chartjs-data'));
  const years = parseChartData(container.getAttribute('data-chartjs-years'));
  const imagePath = data[0]?.imageFieldPath;

  if (imagePath) {
    const img = document.createElement('img');
    img.className = 'investor-fund-cyr-chart img-responsive';
    img.alt = 'Calendar Year Returns';
    img.src = `${ASSET_BASE}${imagePath}.png`;
    img.addEventListener('error', () => renderCyrFallback(container, data, years));
    container.innerHTML = '';
    container.appendChild(img);
    return;
  }

  renderCyrFallback(container, data, years);
}

function hydratePieChart(container, isProfessional) {
  const data = parseChartData(container.getAttribute('data-chartjs-data'));
  const colors = isProfessional ? PROFESSIONAL_PIE_COLORS : PIE_COLORS;
  const canvas = container.querySelector('canvas');

  if (canvas) {
    canvas.outerHTML = renderPieSvg(data, colors);
  } else {
    container.insertAdjacentHTML('afterbegin', renderPieSvg(data, colors));
  }

  renderLegendTable(container.querySelector('table.data-statistics'), data, colors);
}

const SECTOR_BAR_COLORS = [
  '#005543',
  '#666666',
  '#003366',
  '#909b42',
  '#c5a35d',
  '#a65a2a',
  '#4a81a4',
  '#cccccc',
  '#8fa3b0',
  '#b8c9a0',
  '#d8d4c4',
  '#e0e0e0',
];

function hydrateBarChart(container, isProfessional) {
  const data = parseChartData(container.getAttribute('data-chartjs-data'));
  const colors = isProfessional ? SECTOR_BAR_COLORS : PIE_COLORS;
  const items = data.filter((item) => !item.isTotalField);
  const maxValue = Math.max(
    ...items.map((item) => parseFloat(decodeHtml(item.categoryValue)) || 0),
    1,
  );
  const table = container.querySelector('#sectordiversification-data-table');

  if (table) {
    table.classList.add('investor-sector-table');
    const tbody = table.querySelector('tbody') || table;
    tbody.innerHTML = items
      .map((item, index) => {
        const value = decodeHtml(item.categoryValue);
        const numeric = parseFloat(value);
        const width = Number.isFinite(numeric) ? `${(numeric / maxValue) * 100}%` : '0';
        const color = colors[index % colors.length];
        return `<tr><td class="investor-sector-label"><span class="investor-chart-swatch" style="background:${color}"></span>${item.categoryName}</td><td class="investor-sector-value">${value}</td><td class="investor-sector-bar-cell"><div class="investor-sector-bar-track"><div class="investor-sector-bar-fill" style="width:${width};background:${color}"></div></div></td></tr>`;
      })
      .join('');
  }

  const barColumn = container.querySelector('.hidden-xs.col-sm-6');
  if (barColumn) {
    barColumn.style.display = 'none';
  }

  const totalTable = container.querySelector('#sectordiversification-total-table tbody');
  const totalItem = data.find((item) => item.isTotalField);
  if (totalTable && totalItem) {
    totalTable.innerHTML = `<tr class="total"><td>${totalItem.categoryName}</td><td>${decodeHtml(totalItem.categoryValue)}</td></tr>`;
  }
}

export function hydrateFundCharts(root, { isProfessional = false } = {}) {
  if (!root) {
    return;
  }

  root.querySelectorAll('[data-chartjs-type="cyr"]').forEach((container) => {
    hydrateCyrChart(container);
  });

  root.querySelectorAll('[data-chartjs-type="pie"]').forEach((container) => {
    hydratePieChart(container, isProfessional);
  });

  root.querySelectorAll('[data-chartjs-type="bar"]').forEach((container) => {
    hydrateBarChart(container, isProfessional);
  });
}

export function hydrateFundInteractivity(root) {
  if (!root) {
    return () => {};
  }

  const cleanups = [];

  root.querySelectorAll('#important-disclosures .disclosure-toggle a').forEach((link) => {
    const section = link.closest('#important-disclosures');
    const handler = (event) => {
      event.preventDefault();
      section?.classList.toggle('is-open');
      link.setAttribute('aria-expanded', section?.classList.contains('is-open') ? 'true' : 'false');
    };

    link.setAttribute('role', 'button');
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('click', handler);
    cleanups.push(() => link.removeEventListener('click', handler));
  });

  root.querySelectorAll('a.toggle-link').forEach((link) => {
    const paragraph = link.closest('p');
    const toggleContent = paragraph?.nextElementSibling;

    if (!toggleContent?.classList.contains('toggle-content')) {
      return;
    }

    const handler = (event) => {
      event.preventDefault();
      toggleContent.classList.toggle('is-open');
      paragraph.classList.toggle('is-open');
      link.setAttribute('aria-expanded', toggleContent.classList.contains('is-open') ? 'true' : 'false');
    };

    link.setAttribute('role', 'button');
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('click', handler);
    cleanups.push(() => link.removeEventListener('click', handler));
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function fixImagesFromDataAsset(html) {
  if (!html) {
    return '';
  }

  let fixed = html.replace(
    /(<div[^>]*data-asset="(\/content\/dam\/[^"]+)"[^>]*>[\s\S]*?<img[^>]*?)src="[^"]*"([^>]*>)/gi,
    (_, prefix, asset, suffix) => `${prefix}src="${ASSET_BASE}${asset}"${suffix}`,
  );

  fixed = fixed.replace(
    /<img([^>]*?)data-asset="(\/content\/dam\/[^"]+)"([^>]*?)>/gi,
    (match, before, asset, after) => {
      if (/src="https:\/\/www\.artisanpartners\.com/.test(match)) {
        return match;
      }

      if (/src="/.test(match)) {
        return match.replace(/src="[^"]*"/, `src="${ASSET_BASE}${asset}"`);
      }

      return `<img${before}data-asset="${asset}" src="${ASSET_BASE}${asset}"${after}>`;
    },
  );

  return fixed;
}
