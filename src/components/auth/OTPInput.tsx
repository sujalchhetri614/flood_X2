import { useEffect, useRef, useState } from 'react';
import { useId } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  length = 6,
  error,
  disabled = false,
  autoFocus = false,
}: OTPInputProps) {
  const generatedId = useId();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [local, setLocal] = useState<string[]>(() =>
    Array.from({ length }, (_, i) => value[i] ?? ''),
  );

  useEffect(() => {
    setLocal(Array.from({ length }, (_, i) => value[i] ?? ''));
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const emit = (next: string[]) => {
    const joined = next.join('');
    onChange(joined);
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1);
    const next = [...local];
    next[index] = char;
    setLocal(next);
    emit(next);
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !local[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
    setLocal(next);
    emit(next);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const describedBy = error ? `${generatedId}-error` : undefined;

  return (
    <div>
      <div className="flex justify-between gap-2 sm:gap-3" role="group" aria-label="One-time password">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            id={`${generatedId}-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={local[i] ?? ''}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            aria-label={`OTP digit ${i + 1}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="h-12 w-10 rounded-xl border border-border bg-white text-center text-lg font-semibold text-ink transition-all duration-200 focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/25 sm:h-14 sm:w-12 sm:text-xl aria-[invalid=true]:border-risk-critical"
          />
        ))}
      </div>
      {error && (
        <p id={describedBy} role="alert" className="mt-2 text-sm text-risk-critical animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
}
