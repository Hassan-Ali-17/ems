import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import Loading from '../components/common/Loading';
import useAuth from '../hooks/useAuth';
import { cancelRegistration, downloadTicket, getMyRegistrations } from '../services/eventService';
import { formatDateTime } from '../utils/format';

export default function ProfilePage() {
  const { user, updateProfile, changePassword, refreshUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', bio: '', organization: '', avatar: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    setProfileForm({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '', organization: user?.organization || '', avatar: user?.avatar || '' });
  }, [user]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await getMyRegistrations();
        setRegistrations(response.data.registrations);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      await refreshUser();
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordSaving(true);
    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDownloadTicket = async (registration) => {
    const response = await downloadTicket(registration._id);
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${registration.ticketId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleCancel = async (registrationId) => {
    try {
      await cancelRegistration(registrationId);
      setRegistrations((current) => current.filter((registration) => registration._id !== registrationId));
      toast.success('Registration cancelled.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to cancel registration.');
    }
  };

  return (
    <section className="container py-5">
      <PageHeader eyebrow="Account" title="Your profile" description="Update your details, change your password, and manage event registrations." />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-soft mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Profile details</h4>
              <form className="d-grid gap-3" onSubmit={handleProfileSubmit}>
                <input className="form-control" value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} placeholder="Name" />
                <input className="form-control" value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} placeholder="Phone" />
                <input className="form-control" value={profileForm.organization} onChange={(event) => setProfileForm({ ...profileForm, organization: event.target.value })} placeholder="Organization" />
                <input className="form-control" value={profileForm.avatar} onChange={(event) => setProfileForm({ ...profileForm, avatar: event.target.value })} placeholder="Avatar URL" />
                <textarea className="form-control" rows="4" value={profileForm.bio} onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })} placeholder="Bio" />
                <button className="btn btn-info fw-semibold" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-soft">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Change password</h4>
              <form className="d-grid gap-3" onSubmit={handlePasswordSubmit}>
                <input type="password" className="form-control" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} placeholder="Current password" />
                <input type="password" className="form-control" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} placeholder="New password" />
                <button className="btn btn-outline-info fw-semibold" disabled={passwordSaving}>{passwordSaving ? 'Updating...' : 'Change password'}</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-soft">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">My registrations</h4>
                <span className="badge text-bg-info">{registrations.length}</span>
              </div>
              {loading ? (
                <Loading />
              ) : registrations.length ? (
                <div className="d-grid gap-3">
                  {registrations.map((registration) => (
                    <div className="registration-row" key={registration._id}>
                      <div>
                        <div className="fw-semibold">{registration.event?.title}</div>
                        <div className="small text-muted">{formatDateTime(registration.event?.date)}</div>
                        <div className="small text-muted">Ticket: {registration.ticketId}</div>
                      </div>
                      <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                        <button className="btn btn-outline-info btn-sm" onClick={() => handleDownloadTicket(registration)}>Ticket</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(registration._id)}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted">You have not registered for any event yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}