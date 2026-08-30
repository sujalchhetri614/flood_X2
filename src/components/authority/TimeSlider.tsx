import { Clock } from 'lucide-react';

interface TimeSliderProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function TimeSlider({ options, value, onChange, className = '' }: TimeSliderProps) {
  return (
    <div className={`rounded-xl border border-border bg-white/95 p-3 shadow-card ${className}`}>
      <div className="mb-2 flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-blue-primary" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Flood Forecast Time</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              value === opt.value
                ? 'bg-navy text-white shadow-sm'
                : 'bg-surface text-ink-muted hover:bg-blue-light hover:text-navy'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
