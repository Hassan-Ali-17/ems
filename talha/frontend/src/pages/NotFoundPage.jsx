import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="container py-5 text-center">
      <div className="py-5">
        <h1 className="display-3 fw-black">404</h1>
        <p className="lead text-muted">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-info fw-semibold">Go home</Link>
      </div>
    </section>
  );
}