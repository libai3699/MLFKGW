import { useState } from 'react';
import { Link } from 'react-router-dom';
import TeamProcessVideo from '../TeamProcess/TeamProcessVideo';
import { teamProcessPages } from '../../data/teamProcessData';

const ASSET_BASE = 'https://www.artisanpartners.com';

export function resolveAsset(src) {
  if (!src) {
    return src;
  }

  if (src.startsWith('http')) {
    return src;
  }

  if (src.startsWith('/content/dam/')) {
    return `${ASSET_BASE}${src}`;
  }

  return src;
}

function SidebarLink({ item }) {
  if (item.type === 'text') {
    return <li>{item.text}</li>;
  }

  if (item.type === 'group') {
    return (
      <li>
        {item.href ? <Link to={item.href}>{item.label}</Link> : item.label}
        {item.children?.length > 0 && (
          <ul>
            {item.children.map((child) => (
              <li key={`${child.href}-${child.label}`}>
                <Link to={child.href}>{child.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
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

  return (
    <li>
      <Link to={item.href}>{item.label}</Link>
    </li>
  );
}

export function InvestorInvestmentSidebar({ panels }) {
  if (!panels?.length) {
    return null;
  }

  return (
    <div className="investor-investment-sidebar-stack">
      {panels.map((panel) => (
        <div key={panel.title} className="aag-container investor-investment-sidebar">
          <div className="side-content-ataglance">
            <h4>{panel.title.toUpperCase()}</h4>
            {panel.lists.map((list) => (
              <ul key={`${panel.title}-${list.heading}`} className="side-bar-list">
                {list.heading && <li className="heading">{list.heading}</li>}
                {list.items.map((item, index) => (
                  <SidebarLink key={`${list.heading}-${index}`} item={item} />
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RichBlocks({ blocks }) {
  if (!blocks?.length) {
    return null;
  }

  return (
    <div className="investor-rich-blocks">
      {blocks.map((block, index) => {
        if (block.type === 'h3' || block.type === 'h4') {
          return <h4 key={index}>{block.text}</h4>;
        }

        if (block.type === 'paragraph') {
          return <p key={index}>{block.text}</p>;
        }

        if (block.type === 'bullets' || block.type === 'list') {
          return (
            <ul key={index} className="bullets">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === 'table') {
          return (
            <div
              key={index}
              className="investor-html-table-wrap"
              dangerouslySetInnerHTML={{
                __html: block.html.replace(
                  /src="\/content\/dam\//g,
                  'src="https://www.artisanpartners.com/content/dam/',
                ),
              }}
            />
          );
        }

        if (block.type === 'button') {
          if (block.external) {
            return (
              <p key={index}>
                <a
                  className="btn btn-default"
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {block.label}
                </a>
              </p>
            );
          }

          return (
            <p key={index}>
              <Link className="btn btn-default" to={block.href}>
                {block.label}
              </Link>
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

export function ManagementCards({ cards }) {
  if (!cards?.length) {
    return null;
  }

  return (
    <div className="investor-management-grid">
      {cards.map((card) => (
        <div key={card.name} className="investor-management-card">
          <ul className="management">
            <li className="name">{card.name}</li>
            <li className="position">{card.position}</li>
            <li className="yie">
              <span className="years">{card.years}</span>
              <span className="yie-label">
                Years Investment
                <br />
                Experience
              </span>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export function TeamMembersSection({ members }) {
  const [activeId, setActiveId] = useState(members[0]?.id);

  if (!members?.length) {
    return null;
  }

  const activeMember = members.find((member) => member.id === activeId) || members[0];

  return (
    <section className="investor-team-members-section">
      <h2 className="investor-section-heading">Meet the Team</h2>
      <ul className="investor-team-member-thumbs">
        {members.map((member) => (
          <li key={member.id}>
            <button
              type="button"
              className={activeId === member.id ? 'active' : ''}
              onClick={() => setActiveId(member.id)}
            >
              <img src={resolveAsset(member.image)} alt={member.name} />
              <span className="tm-name">{member.name}</span>
              <span className="tm-title">{member.title}</span>
            </button>
          </li>
        ))}
      </ul>
      {activeMember && (
        <div className="investor-team-member-detail">
          <h3>{activeMember.name}</h3>
          {activeMember.role && <p className="investor-member-role">{activeMember.role}</p>}
          <p>{activeMember.bio}</p>
        </div>
      )}
    </section>
  );
}

export function InvestmentAccordions({ sections }) {
  if (!sections?.length) {
    return null;
  }

  return (
    <div className="investor-accordions">
      {sections.map((section) => (
        <section key={section.title} className="investor-accordion-section">
          <h2 className="investor-section-heading">{section.title}</h2>
          <RichBlocks blocks={section.blocks} />
          {section.tables?.map((tableHtml, index) => (
            <div
              key={`${section.title}-table-${index}`}
              className="investor-table-wrap investor-html-table"
              dangerouslySetInnerHTML={{ __html: tableHtml }}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

export function TeamPageBody({ page, teamSlug }) {
  const processPage = teamProcessPages[teamSlug];
  const playlistId = page.playlistId || processPage?.playlistId;

  return (
    <div className="main-wrapper right-page-grid investor-about-page-grid investor-investment-page">
      <div className="right-page-main-col">
        {playlistId && processPage && (
          <TeamProcessVideo
            key={teamSlug}
            teamSlug={teamSlug}
            playlistId={playlistId}
            videos={processPage.videos}
          />
        )}
        {page.investmentProcess?.blocks?.length > 0 && (
          <section className="investor-content-section">
            <h2 className="investor-section-heading">Investment Process</h2>
            <RichBlocks blocks={page.investmentProcess.blocks} />
          </section>
        )}
        <TeamMembersSection members={page.teamMembers} />
      </div>
      <div className="right-page-sidebar-col">
        <InvestorInvestmentSidebar panels={page.sidebar} />
      </div>
    </div>
  );
}

export function StrategyPageBody({ page, teamSlug }) {
  const processPage = teamProcessPages[teamSlug];

  return (
    <div className="main-wrapper right-page-grid investor-about-page-grid investor-investment-page">
      <div className="right-page-main-col">
        {page.introHeading && <h2 className="investor-section-heading">{page.introHeading}</h2>}

        {(page.managementIntro || page.managementCards?.length > 0) && (
          <section className="investor-content-section">
            <h3>Management</h3>
            {page.managementIntro && <p>{page.managementIntro}</p>}
            <ManagementCards cards={page.managementCards} />
          </section>
        )}

        {page.investmentProcessBlocks?.length > 0 && (
          <section className="investor-content-section">
            <h3>Investment Process</h3>
            <RichBlocks blocks={page.investmentProcessBlocks} />
          </section>
        )}

        {page.playlistId && processPage && (
          <TeamProcessVideo
            key={`${teamSlug}-strategy`}
            teamSlug={teamSlug}
            playlistId={page.playlistId}
            videos={processPage.videos}
          />
        )}

        {page.otherStrategies?.length > 0 && (
          <section className="investor-content-section">
            <h3>Other Strategies Managed</h3>
            <ul className="investor-strategy-link-list">
              {page.otherStrategies.map((item) => (
                <li key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <InvestmentAccordions sections={page.accordions} />
      </div>
      <div className="right-page-sidebar-col">
        <InvestorInvestmentSidebar panels={page.sidebar} />
      </div>
    </div>
  );
}
