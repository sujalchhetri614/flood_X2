import { CheckCircle2, Info, OctagonAlert, TriangleAlert } from 'lucide-react';
import type { AlertProps, AlertVariant } from '@/types/ui';

const VARIANTS: Record<
  AlertVariant,
  { container: string; icon: string; title: string; Icon: typeof Info }
> = {
  success: {
    container: 'bg-risk-low/10 border-risk-low/30 text-risk-low',
    icon: 'text-risk-low',
    title: 'text-risk-low',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-risk-critical/10 border-risk-critical/30 text-risk-critical',
    icon: 'text-risk-critical',
    title: 'text-risk-critical',
    Icon: OctagonAlert,
  },
  warning: {
    container: 'bg-risk-moderate/10 border-risk-moderate/30 text-risk-moderate',
    icon: 'text-risk-moderate',
    title: 'text-risk-moderate',
    Icon: TriangleAlert,
  },
  info: {
    container: 'bg-blue-light border-blue-secondary/30 text-blue-primary',
    icon: 'text-blue-primary',
    title: 'text-blue-primary',
    Icon: Info,
  },
};

export default function Alert({ variant, title, children, className = '' }: AlertProps) {
  const v = VARIANTS[variant];
  const Icon = v.Icon;
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 animate-slide-in ${v.container} ${className}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${v.icon}`} aria-hidden="true" />
      <div className="text-sm">
        {title && <p className={`font-semibold ${v.title}`}>{title}</p>}
        <div className={title ? 'text-ink' : ''}>{children}</div>
      </div>
    </div>
  );
}
