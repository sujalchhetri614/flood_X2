import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import OTPInput from '@/components/auth/OTPInput';
import PasswordInput from '@/components/auth/PasswordInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { resetAuthorityPassword, sendAuthorityOtp, verifyOtp } from '@/services/auth';
import { AuthError } from '@/types/auth';

export default function AuthorityResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const identifier = params.get('identifier') ?? '';
  const [step, setStep] = useState<'otp' | 'password' | 'done'>('otp');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(identifier.trim().toLowerCase(), otp);
      setStep('password');
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Verification failed.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetAuthorityPassword(identifier, password);
      setStep('done');
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not update password.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <AuthLayout title="" badge="Authority" backTo="/authority/login" backLabel="Back to login">
        <div className="flex flex-col items-center py-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-risk-low/10 text-risk-low animate-fade-in">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-h3 font-bold text-navy">Password updated successfully</h2>
          <p className="mt-2 text-[15px] text-ink-muted">Your password has been changed.</p>
          <Button onClick={() => navigate('/authority/login')} fullWidth className="mt-6">
            Back to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (step === 'otp') {
    return (
      <AuthLayout
        title="Verify OTP"
        subtitle={`Enter the OTP sent to ${identifier}`}
        badge="Authority"
        backTo="/authority/forgot-password"
        backLabel="Back"
      >
        <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
          {error && <Alert variant="error">{error}</Alert>}
          <OTPInput value={otp} onChange={setOtp} disabled={loading} autoFocus />
          <Button type="submit" loading={loading} fullWidth>
            Verify
          </Button>
          <p className="text-center text-xs text-ink-muted">
            Demo OTP: <span className="font-semibold text-navy">123456</span>
          </p>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a new password for your authority account."
      badge="Authority"
      backTo="/authority/forgot-password"
      backLabel="Back"
    >
      <form onSubmit={handleReset} className="space-y-4" noValidate>
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
