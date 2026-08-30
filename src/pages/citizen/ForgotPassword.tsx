import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import PhoneInput from '@/components/auth/PhoneInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { sendForgotOtp } from '@/services/auth';
import { AuthError } from '@/types/auth';

export default function ForgotPassword() {
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
      await sendForgotOtp(digits);
      navigate(`/citizen/reset-otp?phone=${encodeURIComponent(digits)}`);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your registered mobile number."
      badge="Citizen"
      backTo="/citizen/login"
      backLabel="Back to login"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
        <Button type="submit" loading={loading} fullWidth>
          Send OTP
        </Button>
      </form>
    </AuthLayout>
  );
}
