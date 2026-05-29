import Channels from '../Channels/Channels';
import Promo from '../Promo/Promo';
import HomeFeaturePanel from '../Hero/HomeFeaturePanel';

export default function SidePanel({ onSelectChannel }) {
  return (
    <div className="side-content">
      <aside className="aside">
        <div className="container-md">
          <div className="row">
            <div className="col-12 col-xl-6 col-xxl-7 home-feature-col">
              <HomeFeaturePanel />
            </div>
            <div className="col-12 col-xl-6 col-xxl-5">
              <Channels onSelectChannel={onSelectChannel} />
              <Promo />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
