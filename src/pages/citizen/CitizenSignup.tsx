import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import PhoneInput from '@/components/auth/PhoneInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { sendCitizenOtp } from '@/services/auth';
import { AuthError } from '@/types/auth';

export default function CitizenSignup() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      await sendCitizenOtp(digits);
      navigate(`/citizen/verify-otp?phone=${encodeURIComponent(digits)}`);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to FLOOD-X"
      subtitle="Enter your mobile number to get started."
      badge="Citizen Sign Up"
      backTo="/citizen/login"
      backLabel="Back to login"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
        <Button type="submit" loading={loading} fullWidth>
          Send OTP
        </Button>
        <p className="text-center text-xs text-ink-muted">
          We'll use your phone number to securely verify your account.
        </p>
        <p className="text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/citizen/login" className="font-semibold text-navy hover:text-blue-primary">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
