import { Bell, MapPin, UserRound, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloodXLogo from '@/components/branding/FloodXLogo';
import { useAuth } from '@/hooks/useAuth';

export default function AuthorityHeader() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-navy-dark text-white">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <FloodXLogo size="sm" className="[&_span]:text-white" />
          <div className="hidden border-l border-white/20 pl-3 sm:block">
            <p className="text-xs font-medium text-white/70">Authority Command Center</p>
            <p className="flex items-center gap-1 text-sm font-semibold">
              <MapPin className="h-3.5 w-3.5 text-blue-secondary" aria-hidden="true" />
              Kolkata
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-risk-low/20 px-2.5 py-1 text-xs font-medium text-risk-low sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-risk-low" aria-hidden="true" />
            System Operational
          </span>
          <span className="hidden text-xs text-white/50 sm:inline">Demo Data</span>
          <button
            className="relative rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-critical" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Profile menu"
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
              <ChevronDown className="hidden h-4 w-4 sm:block" aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-white p-2 text-ink shadow-card-hover animate-slide-up">
                <div className="border-b border-border px-3 py-2">
                  <p className="text-sm font-semibold text-navy">{session?.identifier ?? 'Authority User'}</p>
                  <p className="text-xs text-ink-muted">FLOOD-X Authority</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-risk-critical transition-colors hover:bg-risk-critical/10"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
