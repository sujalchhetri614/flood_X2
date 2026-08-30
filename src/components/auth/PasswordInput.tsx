import { useState } from 'react';
import { useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { InputProps } from '@/types/ui';

interface PasswordInputProps extends Omit<InputProps, 'type' | 'trailingAddon'> {
  showStrength?: boolean;
}

export default function PasswordInput({
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  id,
  disabled = false,
  autoComplete = 'current-password',
  showStrength = false,
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${inputId}-error` : undefined;

  const checks = [
    { label: 'At least 8 characters', pass: value.length >= 8 },
    { label: 'One uppercase letter', pass: /[A-Z]/.test(value) },
    { label: 'One number', pass: /\d/.test(value) },
  ];
  const passedCount = checks.filter((c) => c.pass).length;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="fx-input pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-navy"
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error ? (
        <p id={describedBy} role="alert" className="mt-1.5 text-sm text-risk-critical animate-slide-in">
          {error}
        </p>
      ) : showStrength ? (
        <ul className="mt-2 space-y-1">
          {checks.map((c) => (
            <li
              key={c.label}
              className={`flex items-center gap-2 text-xs ${c.pass ? 'text-risk-low' : 'text-ink-muted'}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${c.pass ? 'bg-risk-low' : 'bg-border'}`}
                aria-hidden="true"
              />
              {c.label}
            </li>
          ))}
          {value.length > 0 && (
            <li className="mt-1.5 flex items-center gap-1" aria-hidden="true">
              {checks.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                    i < passedCount ? 'bg-risk-low' : 'bg-border'
                  }`}
                />
              ))}
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
