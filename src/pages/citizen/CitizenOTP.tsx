import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import OTPInput from '@/components/auth/OTPInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { sendCitizenOtp, verifyOtp } from '@/services/auth';
import { AuthError } from '@/types/auth';

export default function CitizenOTP() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const phone = params.get('phone') ?? '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!phone) {
      navigate('/citizen/signup');
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const masked = phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : '';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      navigate(`/citizen/create-password?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Verification failed.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      await sendCitizenOtp(phone);
      setResendIn(30);
      setOtp('');
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your mobile number"
      subtitle={`Enter the 6-digit OTP sent to ${masked}`}
      badge="Citizen Sign Up"
      backTo="/citizen/signup"
      backLabel="Change number"
    >
      <form onSubmit={handleVerify} className="space-y-5" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <OTPInput value={otp} onChange={setOtp} disabled={loading} autoFocus error={error ?? undefined} />
        <Button type="submit" loading={loading} fullWidth>
          Verify OTP
        </Button>
        <div className="flex items-center justify-between text-sm">
          {resendIn > 0 ? (
            <span className="text-ink-muted">Resend OTP in {resendIn}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-medium text-blue-primary transition-colors hover:text-navy disabled:opacity-60"
            >
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          )}
          <Link to="/citizen/signup" className="font-medium text-ink-muted hover:text-navy">
            Change Number
          </Link>
        </div>
        <p className="text-center text-xs text-ink-muted">
          Demo OTP: <span className="font-semibold text-navy">123456</span>
        </p>
      </form>
    </AuthLayout>
  );
}
