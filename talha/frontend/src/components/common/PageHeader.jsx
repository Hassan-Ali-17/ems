export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header mb-4">
      <div className="row align-items-end g-3">
        <div className="col-lg-8">
          {eyebrow ? <div className="section-eyebrow text-uppercase">{eyebrow}</div> : null}
          <h1 className="display-6 fw-bold mb-2">{title}</h1>
          {description ? <p className="text-muted mb-0">{description}</p> : null}
        </div>
        {action ? <div className="col-lg-4 text-lg-end">{action}</div> : null}
      </div>
    </div>
  );
}