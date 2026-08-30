import { Loader2 } from 'lucide-react';
import type { ButtonProps } from '@/types/ui';

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const base =
    variant === 'primary'
      ? 'fx-btn-primary'
      : variant === 'secondary'
        ? 'fx-btn-secondary'
        : 'fx-btn-ghost';
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={`${base} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
