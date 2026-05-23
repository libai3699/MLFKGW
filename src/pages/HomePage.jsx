import Hero from '../components/Hero/Hero';
import SidePanel from '../components/SidePanel/SidePanel';

export default function HomePage({ onSelectChannel }) {
  return (
    <>
      <Hero />
      <SidePanel onSelectChannel={onSelectChannel} />
    </>
  );
}
