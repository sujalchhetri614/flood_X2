import { Waves } from 'lucide-react';

interface FloodXLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

const SIZES = {
  sm: { box: 'h-8 w-8', icon: 18, text: 'text-lg' },
  md: { box: 'h-10 w-10', icon: 22, text: 'text-xl' },
  lg: { box: 'h-14 w-14', icon: 30, text: 'text-2xl' },
};

export default function FloodXLogo({
  size = 'md',
  showWordmark = true,
  className = '',
}: FloodXLogoProps) {
  const s = SIZES[size];
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={`relative flex ${s.box} items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-dark text-white shadow-sm`}
        aria-hidden="true"
      >
        <Waves size={s.icon} strokeWidth={2.5} />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-secondary" />
      </span>
      {showWordmark && (
        <span className={`font-bold tracking-tight text-navy ${s.text}`}>
          FLOOD<span className="text-blue-primary">-X</span>
        </span>
      )}
    </div>
  );
}
