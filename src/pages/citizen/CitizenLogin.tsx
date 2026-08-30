import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PhoneInput from '@/components/auth/PhoneInput';
import PasswordInput from '@/components/auth/PasswordInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { loginCitizen } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/types/auth';

export default function CitizenLogin() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      const session = await loginCitizen(phone.replace(/\D/g, ''), password);
      setSession(session);
      navigate('/citizen');
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Citizen Access"
      subtitle="Stay informed. Stay safe."
      badge="Citizen"
      backTo="/"
      backLabel="Back to role selection"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <PhoneInput value={phone} onChange={setPhone} disabled={loading} autoComplete="tel-national" />
        <PasswordInput
          value={password}
          onChange={setPassword}
          disabled={loading}
          autoComplete="current-password"
        />
        <Button type="submit" loading={loading} fullWidth>
          <Lock className="h-4 w-4" aria-hidden="true" />
          Sign In
        </Button>
        <div className="flex items-center justify-between text-sm">
          <Link
            to="/citizen/forgot-password"
            className="font-medium text-blue-primary transition-colors hover:text-navy"
          >
            Forgot Password?
          </Link>
          <span className="text-ink-muted">
            New to FLOOD-X?{' '}
            <Link
              to="/citizen/signup"
              className="font-semibold text-navy transition-colors hover:text-blue-primary"
            >
              Create Citizen Account
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}
