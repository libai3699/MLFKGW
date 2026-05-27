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

function hydrateMorningstarRatingStars(root) {
  if (!root) {
    return;
  }

  root.querySelectorAll('span.mstar, div.mstar').forEach((element) => {
    if (element.innerHTML.trim()) {
      return;
    }

    const classRating = element.className.match(/mstar-(\d+)/)?.[1];
    const dataRating = element.closest('td')?.getAttribute('data-text');
    const rating = parseInt(classRating || dataRating, 10);

    if (!Number.isFinite(rating) || rating <= 0) {
      return;
    }

    element.innerHTML = Array.from({ length: rating }, () => '<span class="glyphicon glyphicon-star"></span>').join(
      ' ',
    );
  });
}

function hydrateAccordionSections(root) {
  if (!root) {
    return () => {};
  }

  const cleanups = [];

  root.querySelectorAll('.accordion-container .accordion-toggle a').forEach((link) => {
    const container = link.closest('.accordion-container');
    if (!container) {
      return;
    }

    const handler = (event) => {
      if (window.matchMedia('(min-width: 992px)').matches) {
        return;
      }

      event.preventDefault();
      container.classList.toggle('active');
    };

    link.addEventListener('click', handler);
    cleanups.push(() => link.removeEventListener('click', handler));
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

const SHARE_CLASS_LABELS = {
  Investor: 'Investor Class',
  Advisor: 'Advisor Class',
  Institutional: 'Institutional Class',
};

function getDefaultShareClass(wrapper) {
  const disabledLink = wrapper.querySelector('.dropdown-menu li.disabled [data-share-class]');
  if (disabledLink) {
    return disabledLink.getAttribute('data-share-class');
  }

  const buttonText = wrapper.querySelector('.dropdown-toggle')?.textContent || '';
  if (/institutional/i.test(buttonText)) {
    return 'Institutional';
  }
  if (/advisor/i.test(buttonText)) {
    return 'Advisor';
  }

  return 'Investor';
}

function applyPerformanceShareClassFilter(scope, shareClass, showIndices) {
  if (!scope || !shareClass) {
    return;
  }

  scope.querySelectorAll('table[id*="investment-returns"], table[id*="strategy-returns"]').forEach((table) => {
    table.querySelectorAll('tbody tr[data-share-class]').forEach((row) => {
      const rowShareClass = row.getAttribute('data-share-class');
      const isIndex = row.classList.contains('fund-index');
      const matchesShareClass = rowShareClass === shareClass;

      if (!matchesShareClass) {
        row.style.display = 'none';
        return;
      }

      if (isIndex) {
        row.style.display = showIndices ? '' : 'none';
      } else {
        row.style.display = '';
      }
    });
  });

  scope.querySelectorAll('table#morningstar-ratings, table#lipper-rankings').forEach((table) => {
    table.querySelectorAll('tbody tr[data-share-class]').forEach((row) => {
      const rowShareClass = row.getAttribute('data-share-class');
      row.style.display = rowShareClass === shareClass ? '' : 'none';
    });
  });
}

function updateShareClassButtonLabel(button, shareClass) {
  if (!button) {
    return;
  }

  const caret = button.querySelector('.caret');
  button.textContent = `${SHARE_CLASS_LABELS[shareClass] || shareClass} `;
  if (caret) {
    button.appendChild(caret);
  }
}

function hydratePerformancePageInteractivity(root) {
  if (!root?.querySelector('.performance-share-class-wrapper')) {
    return () => {};
  }

  const cleanups = [];
  const tabsSections = root.querySelectorAll('.tabs');

  tabsSections.forEach((tabsSection) => {
    const wrapper = tabsSection.querySelector('.performance-share-class-wrapper');
    if (!wrapper) {
      return;
    }

    const button = wrapper.querySelector('.dropdown-toggle');
    const menu = wrapper.querySelector('.dropdown-menu');
    const checkbox = tabsSection.querySelector('#show-indices');
    const scope = tabsSection.closest('.row.subsection') || tabsSection.parentElement || root;
    let shareClass = getDefaultShareClass(wrapper);
    let showIndices = Boolean(checkbox?.checked);

    const refreshFilter = () => {
      applyPerformanceShareClassFilter(scope, shareClass, showIndices);
    };

    refreshFilter();

    if (button) {
      const toggleHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        wrapper.classList.toggle('open');
        button.setAttribute('aria-expanded', wrapper.classList.contains('open') ? 'true' : 'false');
      };

      button.addEventListener('click', toggleHandler);
      cleanups.push(() => button.removeEventListener('click', toggleHandler));
    }

    if (menu) {
      menu.querySelectorAll('[data-share-class]').forEach((link) => {
        const selectHandler = (event) => {
          event.preventDefault();
          shareClass = link.getAttribute('data-share-class');
          updateShareClassButtonLabel(button, shareClass);

          menu.querySelectorAll('li').forEach((item) => {
            const itemShareClass = item.querySelector('[data-share-class]')?.getAttribute('data-share-class');
            item.classList.toggle('disabled', itemShareClass === shareClass);
          });

          wrapper.classList.remove('open');
          button?.setAttribute('aria-expanded', 'false');
          refreshFilter();
        };

        link.addEventListener('click', selectHandler);
        cleanups.push(() => link.removeEventListener('click', selectHandler));
      });
    }

    if (checkbox) {
      const checkboxHandler = () => {
        showIndices = checkbox.checked;
        refreshFilter();
      };

      checkbox.addEventListener('change', checkboxHandler);
      cleanups.push(() => checkbox.removeEventListener('change', checkboxHandler));
    }
  });

  const outsideClickHandler = (event) => {
    root.querySelectorAll('.performance-share-class-wrapper.open').forEach((wrapper) => {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove('open');
        wrapper.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  document.addEventListener('click', outsideClickHandler);
  cleanups.push(() => document.removeEventListener('click', outsideClickHandler));

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function prepareLoadedHistoricalHtml(html) {
  if (!html) {
    return '';
  }

  return fixImagesFromDataAsset(
    html
      .replace(/src="\/content\/dam\//g, 'src="https://www.artisanpartners.com/content/dam/')
      .replace(/href="\/content\/dam\//g, 'href="https://www.artisanpartners.com/content/dam/')
      .replace(/href="\/individual-investors/g, 'href="/individual-investors')
      .replace(/href="\/investment-professionals/g, 'href="/investment-professionals')
      .replace(/\.html"/g, '"'),
  );
}

function hydrateResourcesPageInteractivity(root) {
  if (!root) {
    return () => {};
  }

  const cleanups = [];
  const fundSelectForm = root.querySelector('#fund-select');

  if (fundSelectForm) {
    const select = fundSelectForm.querySelector('select');
    const containers = root.querySelectorAll('.fund-select-container');

    if (select) {
      const handler = (event) => {
        const selected = event.target.value;

        containers.forEach((container) => {
          if (selected === 'all') {
            container.classList.remove('hidden');
          } else if (container.dataset.fund === selected) {
            container.classList.remove('hidden');
          } else {
            container.classList.add('hidden');
          }
        });
      };

      select.addEventListener('change', handler);
      cleanups.push(() => select.removeEventListener('change', handler));
    }
  }

  const historicalForm = root.querySelector('#historical-distributions');
  const historicalContainer = root.querySelector('#historical-distributions-container');

  if (historicalForm && historicalContainer) {
    const select = historicalForm.querySelector('select');

    if (select) {
      const handler = async (event) => {
        const selected = event.target.value;
        const selectedOption = select.options[select.selectedIndex];

        if (!selected || selectedOption?.disabled) {
          return;
        }

        historicalContainer.innerHTML =
          '<img src="https://www.artisanpartners.com/content/dam/images/static/icon-loading.gif" alt="loading...">';

        const site = window.location.pathname.includes('/individual-investors/')
          ? 'individual-investors'
          : 'investment-professionals';
        const url = `${ASSET_BASE}/content/artisanpartners/en_us/${site}/resources/tax-center/distributions-historical/${selected}.html`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to load historical distributions (${response.status})`);
          }

          const html = await response.text();
          historicalContainer.innerHTML = prepareLoadedHistoricalHtml(html);
        } catch {
          historicalContainer.innerHTML = '<p>Unable to load historical distributions.</p>';
        }
      };

      select.addEventListener('change', handler);
      cleanups.push(() => select.removeEventListener('change', handler));
    }
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function hydrateFundInteractivity(root) {
  if (!root) {
    return () => {};
  }

  const cleanups = [];
  cleanups.push(hydratePerformancePageInteractivity(root));
  cleanups.push(hydrateAccordionSections(root));
  cleanups.push(hydrateResourcesPageInteractivity(root));
  hydrateMorningstarRatingStars(root);

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

  root.querySelectorAll('.nav-tabs a[data-toggle="tab"], .nav-tabs a[role="tab"]').forEach((link) => {
    const handler = (event) => {
      event.preventDefault();

      const targetSelector = link.getAttribute('href');
      if (!targetSelector?.startsWith('#')) {
        return;
      }

      const tabList = link.closest('.nav-tabs');
      const scope = tabList?.parentElement;
      const tabContent = scope?.querySelector('.tab-content') || scope?.nextElementSibling;

      if (!tabList || !tabContent) {
        return;
      }

      tabList.querySelectorAll('li').forEach((item) => item.classList.remove('active'));
      link.closest('li')?.classList.add('active');

      tabContent.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.remove('active'));
      tabContent.querySelector(targetSelector)?.classList.add('active');
    };

    link.addEventListener('click', handler);
    cleanups.push(() => link.removeEventListener('click', handler));
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export { hydratePerformancePageInteractivity, hydrateResourcesPageInteractivity };

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
