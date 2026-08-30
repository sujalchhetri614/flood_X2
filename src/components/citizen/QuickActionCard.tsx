import type { ReactNode } from 'react';

interface QuickActionCardProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export default function QuickActionCard({ icon, label, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-primary hover:shadow-card-hover"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light text-blue-primary transition-colors duration-200 group-hover:bg-navy group-hover:text-white">
        {icon}
      </span>
      <span className="text-sm font-semibold text-navy">{label}</span>
    </button>
  );
}
