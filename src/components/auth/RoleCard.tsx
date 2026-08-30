import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  cta: string;
  onClick: () => void;
  accent?: 'citizen' | 'authority';
}

export default function RoleCard({
  icon,
  title,
  description,
  features,
  cta,
  onClick,
  accent = 'citizen',
}: RoleCardProps) {
  const iconBg =
    accent === 'citizen'
      ? 'bg-blue-light text-blue-primary group-hover:bg-blue-primary group-hover:text-white'
      : 'bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col rounded-2xl border border-border bg-white p-6 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-primary hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-blue-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:p-7"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200 ${iconBg}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="mt-5 text-h3 font-bold text-navy">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{description}</p>
      <ul className="mt-5 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-risk-low/10 text-risk-low">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-navy transition-colors group-hover:text-blue-primary">
        {cta}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
