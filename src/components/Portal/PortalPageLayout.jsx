export default function PortalPageLayout({ children }) {
  return (
    <div className="container-md">
      <div className="root responsivegrid portal-content-root">{children}</div>
    </div>
  );
}
