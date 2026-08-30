import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import FloodXLogo from '@/components/branding/FloodXLogo';
import GisBackground from '@/components/layout/GisBackground';
import { useAuth } from '@/hooks/useAuth';

interface DashboardPlaceholderProps {
  role: 'citizen' | 'authority';
  modules: { label: string; path: string; icon: ReactNode }[];
}

export default function DashboardPlaceholder({ role, modules }: DashboardPlaceholderProps) {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      <GisBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-border bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <FloodXLogo size="md" />
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-ink-muted sm:inline">
                {role === 'citizen' ? 'Citizen' : 'Authority'} · {session?.identifier}
              </span>
              <button onClick={handleSignOut} className="fx-btn-ghost px-3 py-2 text-sm">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-h2 font-bold text-navy-dark">
              {role === 'citizen' ? 'Citizen Dashboard' : 'Authority Dashboard'}
            </h1>
            <p className="mt-1 text-[15px] text-ink-muted">
              {role === 'citizen'
                ? 'Monitor local flood conditions, find safer routes, and report flooding.'
                : 'Monitor city-wide flood conditions and coordinate emergency response.'}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ label, path, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-primary hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-light text-blue-primary transition-colors duration-200 group-hover:bg-blue-primary group-hover:text-white">
                  {icon}
                </span>
                <span className="text-[15px] font-semibold text-navy">{label}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-white/60 p-6 text-center">
            <p className="text-sm text-ink-muted">
              These modules are placeholders for the next development phase. The authentication and
              routing architecture is ready for them to be plugged in.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
