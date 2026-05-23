import BusinessModelContent from '../components/BusinessModel/BusinessModelContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import './portal-pages.css';

export default function BusinessModelPage() {
  return (
    <PortalPageLayout>
      <div className="main-wrapper business-model-wrapper">
        <BusinessModelContent />
      </div>
    </PortalPageLayout>
  );
}
