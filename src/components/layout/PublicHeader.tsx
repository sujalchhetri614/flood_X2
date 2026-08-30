import { Accessibility, Globe, LifeBuoy } from 'lucide-react';
import FloodXLogo from '@/components/branding/FloodXLogo';

interface PublicHeaderProps {
  tagline?: string;
}

export default function PublicHeader({ tagline }: PublicHeaderProps) {
  return (
    <header className="relative z-10 border-b border-border/70 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <FloodXLogo size="md" />
          {tagline && (
            <span className="hidden text-sm text-ink-muted sm:inline-block">{tagline}</span>
          )}
        </div>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Support">
          <button className="fx-btn-ghost px-2.5 py-2 text-sm">
            <LifeBuoy className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Help</span>
          </button>
          <button className="fx-btn-ghost px-2.5 py-2 text-sm">
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">EN</span>
          </button>
          <button className="fx-btn-ghost px-2.5 py-2 text-sm" aria-label="Accessibility">
            <Accessibility className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  );
}
