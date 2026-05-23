import TopBar from './TopBar';
import Navigation from './Navigation';

export default function Header({ onOpenModal, isHome = false }) {
  return (
    <header>
      <TopBar onOpenModal={onOpenModal} />
      <div className="bottom-wrapper">
        <div className="container-md">
          <Navigation isHome={isHome} />
        </div>
      </div>
    </header>
  );
}
