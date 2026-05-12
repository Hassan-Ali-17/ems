import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(formData);
      toast.success(response.message || 'Login successful.');
      const role = response.user.role;
      navigate(location.state?.from?.pathname || (role === 'admin' ? '/admin' : role === 'organizer' ? '/organizer' : '/profile'), { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <section className="auth-page py-5">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card auth-card border-0 shadow-soft">
              <div className="card-body p-4 p-md-5">
                <div className="section-eyebrow mb-2">Welcome back</div>
                <h1 className="h3 fw-bold mb-4">Login to EMS</h1>
                <form onSubmit={handleSubmit} className="d-grid gap-3">
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required />
                  </div>
                  <button className="btn btn-info btn-lg fw-semibold" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
                </form>
                <p className="text-muted mt-3 mb-0">No account? <Link to="/register">Create one</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}