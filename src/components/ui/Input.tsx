import { useId } from 'react';
import type { InputProps } from '@/types/ui';

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  id,
  disabled = false,
  autoComplete,
  inputMode,
  maxLength,
  leadingAddon,
  trailingAddon,
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {leadingAddon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
            {leadingAddon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`fx-input ${leadingAddon ? 'pl-12' : ''} ${trailingAddon ? 'pr-11' : ''}`}
        />
        {trailingAddon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
            {trailingAddon}
          </span>
        )}
      </div>
      {error && (
        <p id={describedBy} role="alert" className="mt-1.5 text-sm text-risk-critical animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
}
