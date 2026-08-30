import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { loginAuthority } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/types/auth';

export default function AuthorityLogin() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your Authority ID or official email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      const session = await loginAuthority(identifier, password);
      setSession(session);
      navigate('/authority');
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Authority Access"
      subtitle="Monitor. Decide. Respond."
      badge="Authority"
      backTo="/"
      backLabel="Back to role selection"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="Authority ID / Official Email"
          value={identifier}
          onChange={setIdentifier}
          placeholder="e.g. admin@floodx.gov"
          disabled={loading}
          autoComplete="username"
          type="email"
        />
        <Input
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="Enter your password"
          disabled={loading}
          autoComplete="current-password"
        />
        <Button type="submit" loading={loading} fullWidth>
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Secure Sign In
        </Button>
        <div className="flex items-center justify-between text-sm">
          <Link
            to="/authority/forgot-password"
            className="font-medium text-blue-primary transition-colors hover:text-navy"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink-muted">
          <Lock className="h-4 w-4 text-navy" aria-hidden="true" />
          Secure Authority Access — Authorized personnel only
        </div>
        <p className="text-center text-xs text-ink-muted">
          Demo credentials: <span className="font-semibold text-navy">admin@floodx.gov</span> /{' '}
          <span className="font-semibold text-navy">FloodX2026</span>
        </p>
      </form>
    </AuthLayout>
  );
}
