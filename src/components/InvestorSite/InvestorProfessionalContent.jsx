import { Fragment, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, useLocation } from 'react-router-dom';
import { RichBlocks, InvestorInvestmentSidebar, resolveAsset } from './InvestorInvestmentContent';
import InvestorFundRichHtml from './InvestorFundRichHtml';
import TeamProcessVideo from '../TeamProcess/TeamProcessVideo';
import { teamProcessPages } from '../../data/teamProcessData';
import { fixImagesFromDataAsset, hydrateFundCharts, hydrateFundInteractivity } from '../../utils/investorFundChartHydration';
import { getInvestorSiteKeyFromPathname } from '../../utils/investorSiteRouting';

const TEAM_VIDEO_MOUNT_ID = 'investor-team-video-mount';

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
      .replace(/href="\/individual-investors/g, 'href="/individual-investors')
      .replace(/\.html"/g, '"')
      .replace(/<script[\s\S]*?<\/script>/gi, ''),
  );
}

function prepareProfessionalTeamHtml(html) {
  if (!html) {
    return '';
  }

  return prepareInvestorHtml(html)
    .replace(
      /https:\/\/www\.artisanpartners\.com\/content\/dam\/images\/banners\/growth-team-page-info-graphic\.png/g,
      '/images/investor/growth-team-page-info-graphic.png',
    )
    .replace(
      /\/content\/dam\/images\/banners\/growth-team-page-info-graphic\.png/g,
      '/images/investor/growth-team-page-info-graphic.png',
    )
    .replace(
      /<div id="aplp-video-outer-wrapper"[\s\S]*?<\/div>\s*<div id="video-scroller">[\s\S]*?<div class="loading-complete"[\s\S]*?<\/div>\s*<\/div>\s*(?:<script[\s\S]*?<\/script>\s*)?/gi,
      `<div id="${TEAM_VIDEO_MOUNT_ID}"></div>`,
    );
}

function ProfessionalTeamRichHtml({ html, page, teamSlug, className = '' }) {
  const containerRef = useRef(null);
  const location = useLocation();
  const siteKey = getInvestorSiteKeyFromPathname(location.pathname);
  const isFundSite =
    siteKey === 'investment-professionals' || siteKey === 'individual-investors';
  const processPage = teamSlug ? teamProcessPages[teamSlug] : null;
  const playlistId = page?.playlistId || processPage?.playlistId;
  const preparedHtml = prepareProfessionalTeamHtml(html);
  const showVideo = Boolean(
    page?.hasMainVideo &&
      processPage?.videos?.length &&
      playlistId &&
      preparedHtml.includes(TEAM_VIDEO_MOUNT_ID),
  );

  useEffect(() => {
    const cleanupInteractivity = hydrateFundInteractivity(containerRef.current);
    hydrateFundCharts(containerRef.current, { isProfessional: isFundSite });

    return cleanupInteractivity;
  }, [preparedHtml, isFundSite]);

  useEffect(() => {
    if (!showVideo || !containerRef.current) {
      return undefined;
    }

    const mount = containerRef.current.querySelector(`#${TEAM_VIDEO_MOUNT_ID}`);
    if (!mount) {
      return undefined;
    }

    const root = createRoot(mount);
    root.render(
      <TeamProcessVideo
        teamSlug={teamSlug}
        playlistId={playlistId}
        videos={processPage.videos}
      />,
    );

    return () => root.unmount();
  }, [showVideo, teamSlug, playlistId, processPage, preparedHtml]);

  if (!preparedHtml) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: preparedHtml }}
    />
  );
}

function balanceTrailingDivClosings(html) {
  if (!html) {
    return '';
  }

  let balanced = html.trim();
  let openCount = (balanced.match(/<div/g) || []).length;
  let closeCount = (balanced.match(/<\/div>/g) || []).length;

  while (closeCount > openCount && /<\/div>\s*(<!--[\s\S]*?-->\s*)*$/.test(balanced)) {
    balanced = balanced.replace(/\s*<\/div>(\s*(?:<!--[\s\S]*?-->)?\s*)$/, '$1').trim();
    closeCount--;
  }

  return balanced;
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
    );

  return balanceTrailingDivClosings(cleaned);
}

function splitFundVideoSubsection(html) {
  const videoIndex = html.indexOf('aplp-video-outer-wrapper');
  if (videoIndex < 0) {
    return { before: html, after: '' };
  }

  const start = html.lastIndexOf('<div class="row subsection"', videoIndex);
  const nextSubsection = html.indexOf('<div class="row subsection"', videoIndex);

  if (start < 0 || nextSubsection < 0) {
    return { before: html, after: '' };
  }

  return {
    before: html.slice(0, start),
    after: html.slice(nextSubsection),
  };
}

function getFundTeamSlug(page) {
  const investmentTeamList = page?.sidebar
    ?.flatMap((panel) => panel.lists || [])
    .find((list) => list.heading === 'Investment Team');
  const teamHref = investmentTeamList?.items?.find((item) => item.href)?.href;
  const match = teamHref?.match(/\/investments\/([^/?#]+)/);

  return match?.[1] || null;
}

function FundTeamProcessVideo({ page }) {
  const hasOriginalVideo = page?.content?.introHtml?.includes('aplp-video-outer-wrapper');
  const teamSlug = getFundTeamSlug(page);
  const processPage = teamSlug ? teamProcessPages[teamSlug] : null;

  if (!hasOriginalVideo || !teamSlug || !processPage?.playlistId || !processPage?.videos?.length) {
    return null;
  }

  return (
    <div className="row subsection investor-fund-team-video-row">
      <div className="col-md-9 col-md-offset-3">
        <TeamProcessVideo
          key={`${teamSlug}-fund-video`}
          teamSlug={teamSlug}
          playlistId={processPage.playlistId}
          videos={processPage.videos}
        />
      </div>
    </div>
  );
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

function isInvestNowList(list) {
  return list.items?.some((item) => item.label === 'Invest Now');
}

function chunkFundSidebarLists(lists) {
  const chunks = [];
  let index = 0;

  while (index < lists.length) {
    const current = lists[index];

    if (isInvestNowList(current)) {
      chunks.push({ lists: [current], investNow: true });
      break;
    }

    const next = lists[index + 1];
    if (next && !isInvestNowList(next)) {
      chunks.push({ lists: [current, next] });
      index += 2;
      continue;
    }

    chunks.push({ lists: [current] });
    index += 1;
  }

  return chunks;
}

function renderFundSidebarList(list) {
  if (isInvestNowList(list)) {
    const item = list.items[0];
    return (
      <p key="invest-now">
        <Link className="btn btn-default" to={item.href}>
          {item.label}
        </Link>
      </p>
    );
  }

  return (
    <ul key={list.heading || 'list'} className="side-bar-list">
      {list.heading && <li className="heading">{list.heading}</li>}
      {list.items.map((item, itemIndex) => (
        <FundSidebarItem key={`${list.heading}-${itemIndex}`} item={item} />
      ))}
    </ul>
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
          <div className="row investor-fund-sidebar-body">
            {chunkFundSidebarLists(panel.lists).map((chunk, chunkIndex) => (
              <Fragment key={`${chunk.investNow ? 'invest-now' : chunk.lists[0]?.heading}-${chunkIndex}`}>
                {chunkIndex === 2 && <div className="col-xs-12 visible-xs" aria-hidden="true" />}
                <div className="col-xs-6 col-sm-3 col-md-12">
                  {chunk.investNow
                    ? renderFundSidebarList(chunk.lists[0])
                    : chunk.lists.map((list) => renderFundSidebarList(list))}
                </div>
              </Fragment>
            ))}
            <div className="col-md-12 visible-md visible-lg">
              <div />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function shouldUseRichContentHtml(page, relativePath) {
  if (page?.content?.preferHtml) {
    return true;
  }

  if (relativePath?.startsWith('resources/') && page?.content?.html) {
    return true;
  }

  const html = page?.content?.html || '';

  return (
    html.includes('investment-returns-month-end') ||
    html.includes('performance-share-class-wrapper') ||
    html.includes('id="investment-results"') ||
    html.includes('id="morningstar-ratings"') ||
    html.includes('id="lipper-rankings"') ||
    html.includes('id="holdings"') ||
    html.includes('id="fact-sheet"') ||
    html.includes('id="monthly-commentary"') ||
    html.includes('id="quarterly-commentary"') ||
    html.includes('id="philosophy-and-process"') ||
    html.includes('id="advanced-document-filtering"') ||
    html.includes('class="toggle-link"') ||
    html.includes('id="fund-select"') ||
    html.includes('id="mailing-schedule"') ||
    html.includes('id="historical-distributions"') ||
    (html.includes('accordion-container') && html.includes('id="ss-2"')) ||
    (html.includes('id="team-id-key"') && html.includes('class="table sortable"'))
  );
}

function getRichHtmlClassName(page, relativePath) {
  const html = page?.content?.html || '';

  if (
    relativePath?.startsWith('resources/') ||
    html.includes('id="fund-select"') ||
    html.includes('id="mailing-schedule"') ||
    html.includes('id="historical-distributions"') ||
    (html.includes('accordion-container') && html.includes('id="ss-2"') && html.includes('id="ss-3"'))
  ) {
    return 'investor-rich-html investor-resources-rich-html';
  }

  if (
    html.includes('performance-share-class-wrapper') ||
    html.includes('investment-returns-month-end') ||
    html.includes('id="morningstar-ratings"') ||
    html.includes('id="lipper-rankings"')
  ) {
    return 'investor-rich-html investor-performance-rich-html';
  }

  if (html.includes('id="advanced-document-filtering"')) {
    return 'investor-rich-html investor-advanced-filtering-rich-html';
  }

  if (
    html.includes('id="holdings"') ||
    html.includes('id="fact-sheet"') ||
    html.includes('id="monthly-commentary"') ||
    html.includes('id="quarterly-commentary"') ||
    html.includes('id="philosophy-and-process"') ||
    html.includes('id="team-id-key"')
  ) {
    return 'investor-rich-html investor-research-data-rich-html';
  }

  return 'investor-rich-html';
}

export function getContentPageScrollSpy(page, relativePath) {
  if (page?.scrollSpy?.length) {
    return page.scrollSpy;
  }

  if (relativePath === 'performance/ratings-rankings') {
    return [
      { href: '#ss-1', label: 'Morningstar Ratings' },
      { href: '#ss-2', label: 'Lipper Rankings' },
    ];
  }

  if (relativePath === 'resources/applications-forms') {
    return [
      { href: '#ss-1', label: 'Prospectuses & Reports' },
      { href: '#ss-2', label: 'Applications & Disclosures' },
      { href: '#ss-3', label: 'Forms' },
    ];
  }

  if (relativePath === 'resources/tax-center/distributions') {
    return [
      { href: '#ss-1', label: 'Year-to-Date Distributions' },
      { href: '#ss-2', label: 'Historical' },
    ];
  }

  return null;
}

export function ProfessionalContentBody({ page, relativePath }) {
  if (!page) {
    return null;
  }

  const blocks = page.content?.blocks || [];
  const useRichHtml = shouldUseRichContentHtml(page, relativePath);
  const preparedHtml = page.content?.html ? prepareInvestorHtml(page.content.html) : '';

  return (
    <div
      className={`main-wrapper ${
        page.sidebar?.length > 0
          ? 'right-page-grid investor-about-page-grid investor-professional-content-grid'
          : 'investor-professional-content-full'
      }`}
    >
      <div className="right-page-main-col">
        {useRichHtml && preparedHtml ? (
          <InvestorFundRichHtml
            className={getRichHtmlClassName(page, relativePath)}
            html={preparedHtml}
          />
        ) : blocks.length > 0 ? (
          <RichBlocks blocks={blocks} />
        ) : preparedHtml ? (
          <div
            className="investor-rich-html"
            dangerouslySetInnerHTML={{
              __html: preparedHtml,
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

  return (
    <div id="page-title" className="investor-page-title investor-fund-page-title">
      <div className="container investor-container">
        <div className="row">
          <div className="col-xs-12 investor-fund-page-title-row">
            <div className="investor-fund-page-title-main">
              <h1>{page.heading}</h1>
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
  useEffect(() => {
    if (!items?.length) {
      return undefined;
    }

    const scrollSpy = document.getElementById('scrollspy');
    const scrollSpyWrapper = document.querySelector('.investor-fund-scrollspy-wrapper');
    const stickyChrome = scrollSpyWrapper?.closest('.investor-page-chrome-sticky');
    const pageEl = scrollSpyWrapper?.closest('.investor-site-page');
    const links = items
      .map((item) => ({
        href: item.href,
        link: scrollSpy?.querySelector(`a[href="${item.href}"]`) || null,
        section: document.getElementById(item.href.replace(/^#/, '')),
      }))
      .filter((item) => item.link && item.section);

    if (!scrollSpy || !scrollSpyWrapper || links.length === 0) {
      return undefined;
    }

    const syncStickyChromeHeight = () => {
      if (!stickyChrome || !pageEl) {
        return;
      }

      pageEl.style.setProperty('--investor-page-chrome-height', `${stickyChrome.offsetHeight}px`);
    };

    syncStickyChromeHeight();

    const getScrollOffset = () => scrollSpyWrapper.getBoundingClientRect().bottom + 24;

    const setActiveLink = () => {
      const offset = getScrollOffset();
      let activeItem = links[0];

      for (const item of links) {
        if (item.section.getBoundingClientRect().top <= offset) {
          activeItem = item;
        }
      }

      links.forEach((item) => {
        item.link.parentElement?.classList.toggle('active', item.href === activeItem.href);
      });
    };

    const clickCleanups = links.map((item) => {
      const handler = (event) => {
        event.preventDefault();
        const top =
          item.section.getBoundingClientRect().top + window.scrollY - getScrollOffset();
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      };

      item.link.addEventListener('click', handler);
      return () => item.link.removeEventListener('click', handler);
    });

    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });
    window.addEventListener('resize', setActiveLink);
    window.addEventListener('resize', syncStickyChromeHeight);

    const observer =
      typeof ResizeObserver !== 'undefined' && stickyChrome
        ? new ResizeObserver(syncStickyChromeHeight)
        : null;
    observer?.observe(stickyChrome);

    return () => {
      window.removeEventListener('scroll', setActiveLink);
      window.removeEventListener('resize', setActiveLink);
      window.removeEventListener('resize', syncStickyChromeHeight);
      clickCleanups.forEach((cleanup) => cleanup());
      observer?.disconnect();
    };
  }, [items]);

  if (!items?.length) {
    return null;
  }

  return (
    <div className="investor-fund-scrollspy-wrapper">
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
      <div id="scrollspy-fade-bar" className="investor-fund-scrollspy-fade-bar">
        <div className="container investor-container">
          <div className="row">
            <div className="col-xs-12">
              <img
                src="/images/investor/header-fade-bar.png"
                alt=""
                className="img-responsive investor-fund-scrollspy-fade-image"
              />
            </div>
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
  const preparedIntroHtml = prepareFundIntroHtml(introHtml);
  const introParts = splitFundVideoSubsection(preparedIntroHtml);

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
              <>
                <InvestorFundRichHtml
                  className="investor-rich-html investor-fund-intro"
                  html={introParts.before}
                />
                <FundTeamProcessVideo page={page} />
                <InvestorFundRichHtml
                  className="investor-rich-html investor-fund-intro"
                  html={introParts.after}
                />
              </>
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

export function ProfessionalTeamPageBody({ page, teamSlug }) {
  if (!page) {
    return null;
  }

  if (page.content?.html) {
    return (
      <ProfessionalTeamRichHtml
        className="investor-professional-team-rich-html investor-rich-html"
        html={page.content.html}
        page={page}
        teamSlug={teamSlug}
      />
    );
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
