import { useId } from 'react';
import type { InputProps } from '@/types/ui';

interface PhoneInputProps
  extends Omit<InputProps, 'type' | 'leadingAddon' | 'inputMode' | 'maxLength'> {
  countryCode?: string;
}

export default function PhoneInput({
  label = 'Mobile Number',
  value,
  onChange,
  placeholder = '00000 00000',
  error,
  id,
  disabled = false,
  countryCode = '+91',
  autoComplete = 'tel-national',
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : undefined;

  const digits = value.replace(/\D/g, '').slice(0, 10);
  const formatted =
    digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-ink">
          {countryCode}
        </span>
        <input
          id={inputId}
          type="tel"
          value={formatted}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode="numeric"
          maxLength={11}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="fx-input pl-14 tracking-wide"
        />
      </div>
      {error && (
        <p id={describedBy} role="alert" className="mt-1.5 text-sm text-risk-critical animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
}
