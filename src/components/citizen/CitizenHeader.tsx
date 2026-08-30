import { Bell, MapPin, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloodXLogo from '@/components/branding/FloodXLogo';

export default function CitizenHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        <FloodXLogo size="sm" />
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg bg-blue-light px-3 py-1.5 text-sm font-medium text-navy sm:inline-flex">
            <MapPin className="h-4 w-4 text-blue-primary" aria-hidden="true" />
            Kolkata
          </span>
          <button
            className="relative rounded-lg p-2 text-ink-muted transition-colors hover:bg-blue-light hover:text-navy"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-high" />
          </button>
          <Link
            to="/citizen/profile"
            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-blue-light hover:text-navy"
            aria-label="Profile"
          >
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
