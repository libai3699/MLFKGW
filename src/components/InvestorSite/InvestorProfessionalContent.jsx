import { Link } from 'react-router-dom';
import { RichBlocks, InvestorInvestmentSidebar, resolveAsset } from './InvestorInvestmentContent';
import InvestorFundRichHtml from './InvestorFundRichHtml';
import { fixImagesFromDataAsset } from '../../utils/investorFundChartHydration';

function prepareInvestorHtml(html) {
  if (!html) {
    return '';
  }

  return fixImagesFromDataAsset(
    html
      .replace(/src="\/content\/dam\//g, 'src="https://www.artisanpartners.com/content/dam/')
      .replace(/src="\/bios\//g, 'src="https://www.artisanpartners.com/bios/')
      .replace(/href="\/content\/dam\//g, 'href="https://www.artisanpartners.com/content/dam/')
      .replace(/href="\/investment-professionals/g, 'href="/investment-professionals')
      .replace(/\.html"/g, '"')
      .replace(/<script[\s\S]*?<\/script>/gi, ''),
  );
}

function prepareFundIntroHtml(html) {
  if (!html) {
    return '';
  }

  let cleaned = repairBrokenDivOpen(prepareInvestorHtml(html))
    .replace(/^<div id="content-with-side-bar"[^>]*>/, '')
    .replace(/^id="content-with-side-bar"[^>]*>/, '')
    .replace(
      /<div class="row">\s*<div class="col-xs-12">\s*<h2>Investment Process<\/h2>\s*<\/div>\s*<\/div>/i,
      '',
    )
    .replace(/\s*col-md-9 col-md-offset-3/g, '')
    .replace(/\s*col-md-9 col-md-pull-3/g, '')
    .replace(/\s*col-md-offset-3/g, '');

  return cleaned;
}

function repairBrokenDivOpen(html) {
  if (!html) {
    return '';
  }

  return html.replace(/^id="([^"]+)"(\s[^>]*)?>/, '<div id="$1"$2>');
}

function prepareFundSectionsHtml(html) {
  if (!html) {
    return '';
  }

  return repairBrokenDivOpen(prepareInvestorHtml(html)).replace(
    /<\/div>\s*<!-- end: #page-wrapper -->[\s\S]*$/i,
    '',
  );
}

function FundSidebarItem({ item }) {
  if (item.type === 'text') {
    return <li>{item.text}</li>;
  }

  if (item.external) {
    return (
      <li>
        <span className="icon-document" aria-hidden="true" />
        <a href={resolveAsset(item.href)} target="_blank" rel="noopener noreferrer">
          {item.label}
        </a>
      </li>
    );
  }

  if (item.label === 'Invest Now') {
    return (
      <li className="investor-fund-invest-now">
        <Link className="btn btn-default" to={item.href}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link to={item.href}>{item.label}</Link>
    </li>
  );
}

export function FundPageAtAGlanceSidebar({ panels }) {
  if (!panels?.length) {
    return null;
  }

  return (
    <>
      {panels.map((panel) => (
        <div key={panel.title} className="side-bar">
          <div className="row">
            <div className="col-xs-12">
              <h2>{panel.title}</h2>
            </div>
          </div>
          <div className="row investor-fund-sidebar-lists">
            {panel.lists.map((list, index) => (
              <div key={`${list.heading || 'list'}-${index}`} className="investor-fund-sidebar-list-col">
                <ul className="side-bar-list">
                  {list.heading && <li className="heading">{list.heading}</li>}
                  {list.items.map((item, itemIndex) => (
                    <FundSidebarItem key={`${list.heading}-${itemIndex}`} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export function ProfessionalContentBody({ page }) {
  if (!page) {
    return null;
  }

  const blocks = page.content?.blocks || [];

  return (
    <div
      className={`main-wrapper ${
        page.sidebar?.length > 0
          ? 'right-page-grid investor-about-page-grid investor-professional-content-grid'
          : 'investor-professional-content-full'
      }`}
    >
      <div className="right-page-main-col">
        {blocks.length > 0 ? (
          <RichBlocks blocks={blocks} />
        ) : page.content?.html ? (
          <div
            className="investor-rich-html"
            dangerouslySetInnerHTML={{
              __html: prepareInvestorHtml(page.content.html),
            }}
          />
        ) : null}
      </div>
      {page.sidebar?.length > 0 && (
        <div className="right-page-sidebar-col">
          <InvestorInvestmentSidebar panels={page.sidebar} />
        </div>
      )}
    </div>
  );
}

export function ProfessionalFundPageHeader({ page }) {
  if (!page) {
    return null;
  }

  const activeShareClass = page.shareClasses?.find((item) => item.active);
  const activeTicker = activeShareClass?.label?.match(/:\s*(\S+)\s*$/)?.[1];

  return (
    <div id="page-title" className="investor-page-title investor-fund-page-title">
      <div className="container investor-container">
        <div className="row">
          <div className="col-xs-12 investor-fund-page-title-row">
            <div className="investor-fund-page-title-main">
              <h1>
                {page.heading}
                {activeTicker ? <span className="investor-fund-ticker"> ({activeTicker})</span> : null}
              </h1>
            </div>
            {page.shareClasses?.length > 0 && (
              <div className="investor-share-class-wrapper dropdown share-class-wrapper">
                <span className="investor-share-class-current">
                  {activeShareClass?.label || 'Share Class'}
                </span>
                <ul className="investor-share-class-menu dropdown-menu">
                  {page.shareClasses.map((item) => (
                    <li key={item.label} className={item.active ? 'disabled active' : ''}>
                      {item.href && !item.active ? (
                        <Link to={item.href}>{item.label}</Link>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfessionalFundScrollSpy({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div id="scrollspy" className="investor-fund-scrollspy">
      <div className="container investor-container">
        <div className="row">
          <div className="col-xs-12">
            <ul className="nav">
              {items.map((item, index) => (
                <li key={item.href} className={index === 0 ? 'active' : ''}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfessionalFundIntroSection({ page }) {
  if (!page) {
    return null;
  }

  const introHtml = page.content?.introHtml || page.content?.html;

  return (
    <div id="ss-1" className="section investor-fund-ss1">
      <div className="container investor-container">
        <div className="row investor-fund-ss1-row">
          <aside id="side-bar-wrapper" className="col-md-3 col-md-push-9 investor-fund-sidebar-col">
            <FundPageAtAGlanceSidebar panels={page.sidebar} />
          </aside>
          <div id="content-with-side-bar" className="col-md-9 col-md-pull-3 investor-fund-main-col">
            <div className="row">
              <div className="col-xs-12">
                <h2 className="investor-fund-section-heading">Investment Process</h2>
              </div>
            </div>
            {page.content?.blocks?.length > 0 && !page.content?.introHtml ? (
              <RichBlocks blocks={page.content.blocks} />
            ) : (
              <InvestorFundRichHtml
                className="investor-rich-html investor-fund-intro"
                html={prepareFundIntroHtml(introHtml)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfessionalFundAccordionSections({ page }) {
  if (!page?.content?.sectionsHtml) {
    return null;
  }

  return (
    <InvestorFundRichHtml
      className="investor-fund-accordion-sections investor-rich-html"
      html={prepareFundSectionsHtml(page.content.sectionsHtml)}
    />
  );
}

export function ProfessionalFundPageBody({ page }) {
  if (!page) {
    return null;
  }

  return (
    <>
      <ProfessionalFundIntroSection page={page} />
      <ProfessionalFundAccordionSections page={page} />
    </>
  );
}

export function ProfessionalTeamPageBody({ page }) {
  if (!page) {
    return null;
  }

  return (
    <div className="main-wrapper right-page-grid investor-about-page-grid">
      <div className="right-page-main-col">
        {page.investmentProcess?.blocks?.length > 0 && (
          <section className="investor-team-process-section">
            <h2>Investment Process</h2>
            <RichBlocks blocks={page.investmentProcess.blocks} />
          </section>
        )}
      </div>
      {page.sidebar?.length > 0 && (
        <div className="right-page-sidebar-col">
          <InvestorInvestmentSidebar panels={page.sidebar} />
        </div>
      )}
    </div>
  );
}
