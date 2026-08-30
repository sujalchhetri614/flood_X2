import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import FloodXLogo from '@/components/branding/FloodXLogo';
import GisBackground from '@/components/layout/GisBackground';
import { useAuth } from '@/hooks/useAuth';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  role: 'citizen' | 'authority';
  backPath: string;
}

export default function ModulePlaceholder({ title, description, role, backPath }: ModulePlaceholderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <>
      <GisBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-border bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <FloodXLogo size="md" />
            <button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="text-sm font-medium text-ink-muted hover:text-navy"
            >
              Sign Out
            </button>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-light text-blue-primary animate-fade-in">
            <Construction className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-h2 font-bold text-navy-dark">{title}</h1>
          <p className="mt-2 text-[15px] text-ink-muted">{description}</p>
          <p className="mt-4 max-w-md text-sm text-ink-muted">
            This module is part of the next development phase. The routing and authentication
            architecture is already in place for it to be built out.
          </p>
          <button
            onClick={() => navigate(backPath)}
            className="fx-btn-secondary mt-6"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to {role === 'citizen' ? 'Citizen' : 'Authority'} Dashboard
          </button>
        </main>
      </div>
    </>
  );
}
