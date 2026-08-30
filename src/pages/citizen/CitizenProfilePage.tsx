import { useNavigate } from 'react-router-dom';
import { Bell, Globe, LogOut, MapPin, Phone, Shield, UserRound } from 'lucide-react';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import { useAuth } from '@/hooks/useAuth';
import { citizenProfile } from '@/data/citizenMockData';

export default function CitizenProfilePage() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">Profile &amp; Settings</h1>
          <p className="mt-1 text-[15px] text-ink-muted">Manage your account and preferences.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="mb-4 text-lg font-bold text-navy">Profile</h2>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-light text-blue-primary">
                <UserRound className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-bold text-navy">{citizenProfile.name}</p>
                <p className="text-sm text-ink-muted">{session?.identifier}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <dt className="text-ink-muted">Phone:</dt>
                <dd className="font-semibold text-ink">{citizenProfile.phone}</dd>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <dt className="text-ink-muted">Location:</dt>
                <dd className="font-semibold text-ink">{citizenProfile.location}, {citizenProfile.zone}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="mb-4 text-lg font-bold text-navy">Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-ink">Notifications</span>
                </div>
                <span className="text-sm text-ink-muted">Enabled</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-ink">Language</span>
                </div>
                <select className="rounded-lg border border-border bg-white px-2 py-1 text-sm text-ink" defaultValue="en">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-ink">Privacy</span>
                </div>
                <span className="text-sm text-ink-muted">Standard</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-xl border border-risk-critical/30 bg-risk-critical/10 px-5 py-3 text-sm font-semibold text-risk-critical transition-colors hover:bg-risk-critical hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </CitizenLayout>
  );
}
