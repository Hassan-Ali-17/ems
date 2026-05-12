export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="spinner-border text-info me-3" role="status" aria-hidden="true" />
      <span className="text-muted">{label}</span>
    </div>
  );
}