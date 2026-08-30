import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin } from 'lucide-react';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EvidenceUploader from '@/components/reports/EvidenceUploader';
import { submitReport } from '@/services/citizen';
import type { ReportSeverity, ReportItem } from '@/types/citizen';

const SEVERITIES: { value: ReportSeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState<ReportSeverity | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<ReportItem | null>(null);

  const handlePhoto = (file: File | null) => {
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!severity) {
      setError('Please select a severity level.');
      return;
    }
    setLoading(true);
    try {
      const report = await submitReport({
        severity,
        description,
        location: 'Kolkata, Zone B — Park Street',
        hasPhoto: !!photo,
        photoUrl: photoPreview ?? undefined,
      });
      setSubmitted(report);
    } catch {
      setError('Could not submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <CitizenLayout>
        <div className="mx-auto max-w-md animate-fade-in py-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-risk-low/10 text-risk-low">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-h2 font-bold text-navy-dark">Report Submitted</h1>
          <p className="mt-2 text-[15px] text-ink-muted">Thank you for helping improve flood awareness in your area.</p>
          <div className="mt-5 rounded-2xl border border-border bg-white p-5 text-left shadow-card">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Report ID</dt>
                <dd className="font-bold text-navy">#{submitted.numericId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Status</dt>
                <dd className="font-semibold text-risk-moderate">Under Review</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Severity</dt>
                <dd className="font-semibold text-ink capitalize">{submitted.severity}</dd>
              </div>
            </dl>
          </div>
          <Button onClick={() => navigate('/citizen/reports')} fullWidth className="mt-5">
            View My Reports
          </Button>
        </div>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">Report Flood</h1>
          <p className="mt-1 text-[15px] text-ink-muted">
            Report flooding in your area to help authorities respond faster.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <label className="mb-1.5 block text-sm font-medium text-ink">Location</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink">
              <MapPin className="h-4 w-4 text-blue-primary" aria-hidden="true" />
              Automatically detected — Kolkata, Zone B
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <span className="mb-2 block text-sm font-medium text-ink">Severity</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SEVERITIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSeverity(s.value)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    severity === s.value
                      ? 'border-navy bg-navy text-white'
                      : 'border-border bg-white text-ink hover:border-blue-primary'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <label htmlFor="desc" className="mb-1.5 block text-sm font-medium text-ink">
              Description (optional)
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what you're seeing — water level, affected areas, etc."
              className="fx-input resize-none"
            />
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <EvidenceUploader
              photo={photo}
              video={video}
              photoPreview={photoPreview}
              onPhotoChange={handlePhoto}
              onVideoChange={setVideo}
            />
          </div>

          <Button type="submit" loading={loading} fullWidth>
            {loading ? 'Submitting Report…' : 'Submit Report'}
          </Button>
        </form>
      </div>
    </CitizenLayout>
  );
}
