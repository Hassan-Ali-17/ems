import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'attendee', organization: '', phone: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await register(formData);
      toast.success(response.message || 'Account created.');
      navigate(response.user.role === 'organizer' ? '/organizer' : '/profile', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <section className="auth-page py-5">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-9">
            <div className="card auth-card border-0 shadow-soft">
              <div className="card-body p-4 p-md-5">
                <div className="section-eyebrow mb-2">Join EMS</div>
                <h1 className="h3 fw-bold mb-4">Create your account</h1>
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })}>
                      <option value="attendee">Attendee</option>
                      <option value="organizer">Organizer</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Organization</label>
                    <input className="form-control" value={formData.organization} onChange={(event) => setFormData({ ...formData, organization: event.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} />
                  </div>
                  <div className="col-12 d-grid">
                    <button className="btn btn-info btn-lg fw-semibold" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
                  </div>
                </form>
                <p className="text-muted mt-3 mb-0">Already registered? <Link to="/login">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}