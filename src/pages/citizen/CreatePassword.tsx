import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { createCitizenAccount, loginCitizen } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/types/auth';

export default function CreatePassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const phone = params.get('phone') ?? '';
  const { setSession } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await createCitizenAccount(phone, password);
      const session = await loginCitizen(phone, password);
      setSession(session);
      navigate('/citizen/success');
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your password"
      subtitle="Set a strong password to secure your FLOOD-X account."
      badge="Citizen Sign Up"
      backTo={`/citizen/verify-otp?phone=${encodeURIComponent(phone)}`}
      backLabel="Back"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          disabled={loading}
          autoComplete="new-password"
          showStrength
        />
        <PasswordInput
          label="Confirm Password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter your password"
          disabled={loading}
          autoComplete="new-password"
        />
        <Button type="submit" loading={loading} fullWidth>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
}

export function CitizenSuccess() {
  const navigate = useNavigate();
  return (
    <AuthLayout title="" badge="Citizen">
      <div className="flex flex-col items-center py-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-risk-low/10 text-risk-low animate-fade-in">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-h3 font-bold text-navy">Account successfully created</h2>
        <p className="mt-2 text-[15px] text-ink-muted">
          Your FLOOD-X citizen account is ready.
        </p>
        <Button onClick={() => navigate('/citizen')} fullWidth className="mt-6">
          Continue to Citizen Dashboard
        </Button>
      </div>
    </AuthLayout>
  );
}
