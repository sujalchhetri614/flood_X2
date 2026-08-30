import { useEffect, useState } from 'react';
import { BellRing, Plus, X, CheckCircle2 } from 'lucide-react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';
import ConfirmationModal from '@/components/authority/ConfirmationModal';
import { LoadingState, EmptyState } from '@/components/authority/States';
import { authorityAlerts, alertTypeLabels } from '@/data/authorityMockData';
import type { AuthorityAlert, AuthorityAlertStatus, AuthorityAlertType } from '@/types/authority';
import type { RiskLevel } from '@/types/citizen';

type TabKey = 'active' | 'history' | 'expired';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'active', label: 'Active Alerts' },
  { key: 'history', label: 'Alert History' },
  { key: 'expired', label: 'Expired Alerts' },
];

const SEVERITY_OPTIONS: RiskLevel[] = ['moderate', 'high', 'critical'];
const TYPE_OPTIONS: AuthorityAlertType[] = ['flood', 'warning', 'road-closure', 'evacuation', 'emergency'];
const ZONE_OPTIONS = ['Zone A', 'Zone B', 'Zone C', 'Custom'];

export default function AuthorityAlertsPage() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AuthorityAlert[]>(authorityAlerts);
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [showForm, setShowForm] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AuthorityAlert | null>(null);
  const [confirmSend, setConfirmSend] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formArea, setFormArea] = useState(ZONE_OPTIONS[0]);
  const [formType, setFormType] = useState<AuthorityAlertType>('flood');
  const [formSeverity, setFormSeverity] = useState<RiskLevel>('high');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filterByTab = (status: AuthorityAlertStatus): boolean => {
    if (activeTab === 'active') return status === 'active';
    if (activeTab === 'history') return status === 'resolved';
    return status === 'expired';
  };

  const filteredAlerts = alerts.filter((a) => filterByTab(a.status));

  const handleSendAlert = () => {
    const newAlert: AuthorityAlert = {
      id: `aa-${Date.now()}`,
      title: `${alertTypeLabels[formType]} — ${formArea}`,
      area: formArea,
      type: formType,
      severity: formSeverity,
      message: formMessage || `${alertTypeLabels[formType]} issued for ${formArea}.`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'active',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setConfirmSend(false);
    setShowForm(false);
    setFormMessage('');
    setSuccessMsg('Alert created successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Loading alerts..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-h2 font-bold text-navy-dark">Alert Management</h1>
            <p className="mt-1 text-[15px] text-ink-muted">Issue and manage public flood alerts</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Alert
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-sm font-medium text-risk-low animate-slide-in">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedAlert(null); }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-navy text-white shadow-sm'
                  : 'border border-border bg-white text-ink-muted hover:bg-blue-light hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alert List */}
        {filteredAlerts.length === 0 ? (
          <EmptyState message={activeTab === 'active' ? 'No active alerts.' : activeTab === 'history' ? 'No alert history.' : 'No expired alerts.'} />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Area</th>
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="cursor-pointer transition-colors hover:bg-blue-light/50"
                  >
                    <td className="px-4 py-3 font-semibold text-navy">{alert.title}</td>
                    <td className="px-4 py-3 text-ink">{alert.area}</td>
                    <td className="px-4 py-3"><AuthorityRiskBadge level={alert.severity} size="sm" /></td>
                    <td className="px-4 py-3 text-ink-muted">{alert.createdAt}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        alert.status === 'active' ? 'bg-risk-high/10 text-risk-high'
                          : alert.status === 'resolved' ? 'bg-risk-low/10 text-risk-low'
                          : 'bg-ink-muted/10 text-ink-muted'
                      }`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Alert Details Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" onClick={() => setSelectedAlert(null)} />
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-card-hover animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-blue-primary" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-navy-dark">{selectedAlert.title}</h2>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="rounded-lg p-1.5 text-ink-muted hover:bg-blue-light" aria-label="Close">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <dl className="mt-4 space-y-3">
                <div className="flex justify-between"><dt className="text-sm text-ink-muted">Area</dt><dd className="text-sm font-semibold text-ink">{selectedAlert.area}</dd></div>
                <div className="flex justify-between"><dt className="text-sm text-ink-muted">Type</dt><dd className="text-sm font-semibold text-ink">{alertTypeLabels[selectedAlert.type]}</dd></div>
                <div className="flex justify-between"><dt className="text-sm text-ink-muted">Severity</dt><dd><AuthorityRiskBadge level={selectedAlert.severity} size="sm" /></dd></div>
                <div className="flex justify-between"><dt className="text-sm text-ink-muted">Created</dt><dd className="text-sm font-semibold text-ink">{selectedAlert.createdAt}</dd></div>
                <div className="flex justify-between"><dt className="text-sm text-ink-muted">Status</dt><dd className="text-sm font-semibold text-ink">{selectedAlert.status.toUpperCase()}</dd></div>
              </dl>
              <div className="mt-4 rounded-xl bg-surface p-3">
                <p className="text-sm text-ink">{selectedAlert.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Alert Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-card-hover animate-slide-up">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold text-navy-dark">Create Alert</h2>
                <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-ink-muted hover:bg-blue-light" aria-label="Close">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Area / Zone</label>
                  <select value={formArea} onChange={(e) => setFormArea(e.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-blue-primary">
                    {ZONE_OPTIONS.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Alert Type</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value as AuthorityAlertType)} className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-blue-primary">
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{alertTypeLabels[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Severity</label>
                  <div className="flex gap-2">
                    {SEVERITY_OPTIONS.map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setFormSeverity(sev)}
                        className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                          formSeverity === sev
                            ? 'border-blue-primary bg-blue-light text-blue-primary'
                            : 'border-border bg-white text-ink-muted hover:bg-surface'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
                  <textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    rows={3}
                    placeholder="Enter alert message..."
                    className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-blue-primary"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface">Cancel</button>
                <button onClick={() => setConfirmSend(true)} className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark">Send Alert</button>
              </div>
            </div>
          </div>
        )}

        <ConfirmationModal
          open={confirmSend}
          title="Send Alert?"
          message={`This will issue a ${formSeverity.toUpperCase()} alert for ${formArea}. The alert will be visible in Active Alerts.`}
          confirmLabel="Send Alert"
          onConfirm={handleSendAlert}
          onCancel={() => setConfirmSend(false)}
        />
      </div>
    </AuthorityLayout>
  );
}
