import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { resetCitizenPassword } from '@/services/auth';
import { AuthError } from '@/types/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const phone = params.get('phone') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetCitizenPassword(phone, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not update password.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout title="" badge="Citizen" backTo="/citizen/login" backLabel="Back to login">
        <div className="flex flex-col items-center py-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-risk-low/10 text-risk-low animate-fade-in">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-h3 font-bold text-navy">Password updated successfully</h2>
          <p className="mt-2 text-[15px] text-ink-muted">Your password has been changed.</p>
          <Button onClick={() => navigate('/citizen/login')} fullWidth className="mt-6">
            Back to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a new password for your account."
      badge="Citizen"
      backTo={`/citizen/reset-otp?phone=${encodeURIComponent(phone)}`}
      backLabel="Back"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <PasswordInput
          label="New Password"
          value={password}
          onChange={setPassword}
          disabled={loading}
          autoComplete="new-password"
          showStrength
        />
        <PasswordInput
          label="Confirm New Password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter new password"
          disabled={loading}
          autoComplete="new-password"
        />
        <Button type="submit" loading={loading} fullWidth>
          Update Password
        </Button>
      </form>
    </AuthLayout>
  );
}
