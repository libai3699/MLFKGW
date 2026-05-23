import SustainabilityLayout from '../components/Sustainability/SustainabilityLayout';
import SustainabilityHero from '../components/Sustainability/SustainabilityHero';
import SustainabilityNavCards from '../components/Sustainability/SustainabilityNavCards';
import { sustainabilityReportMeta } from '../data/sustainabilityHomeData';

export default function SustainabilityHomePage() {
  return (
    <SustainabilityLayout pageTitle={sustainabilityReportMeta.title}>
      <SustainabilityHero />
      <SustainabilityNavCards />
    </SustainabilityLayout>
  );
}
