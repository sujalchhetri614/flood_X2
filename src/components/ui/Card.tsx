import type { CardProps } from '@/types/ui';

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-white shadow-card ${className}`}>
      {children}
    </div>
  );
}
