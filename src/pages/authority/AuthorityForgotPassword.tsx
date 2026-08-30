import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { sendAuthorityOtp } from '@/services/auth';
import { AuthError } from '@/types/auth';

export default function AuthorityForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your Authority ID or official email.');
      return;
    }
    setLoading(true);
    try {
      await sendAuthorityOtp(identifier);
      navigate(`/authority/reset-password?identifier=${encodeURIComponent(identifier)}`);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Authority Password Reset"
      subtitle="Enter your Authority ID or official email."
      badge="Authority"
      backTo="/authority/login"
      backLabel="Back to login"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="Authority ID / Official Email"
          value={identifier}
          onChange={setIdentifier}
          placeholder="e.g. admin@floodx.gov"
          disabled={loading}
          type="email"
          autoComplete="username"
        />
        <Button type="submit" loading={loading} fullWidth>
          Send OTP
        </Button>
        <p className="text-center text-xs text-ink-muted">
          Demo OTP: <span className="font-semibold text-navy">123456</span>
        </p>
      </form>
    </AuthLayout>
  );
}
