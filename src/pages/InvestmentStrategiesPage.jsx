import InvestmentStrategiesContent from '../components/InvestmentStrategies/InvestmentStrategiesContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import './portal-pages.css';

export default function InvestmentStrategiesPage() {
  return (
    <PortalPageLayout>
      <div className="main-wrapper investment-strategies-wrapper">
        <InvestmentStrategiesContent />
      </div>
    </PortalPageLayout>
  );
}
