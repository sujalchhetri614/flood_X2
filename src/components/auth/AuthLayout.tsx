import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloodXLogo from '@/components/branding/FloodXLogo';
import GisBackground from '@/components/layout/GisBackground';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  badge?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  badge,
}: AuthLayoutProps) {
  return (
    <>
      <GisBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:py-12">
          <div className="mb-6 flex flex-col items-center text-center animate-fade-in">
            <Link to="/" aria-label="FLOOD-X home">
              <FloodXLogo size="lg" />
            </Link>
            {badge && (
              <span className="mt-3 inline-flex items-center rounded-full bg-blue-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-primary">
                {badge}
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-white/95 p-6 shadow-card backdrop-blur-sm animate-slide-up sm:p-8">
            <div className="mb-6">
              {backTo && (
                <Link
                  to={backTo}
                  className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-navy"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {backLabel}
                </Link>
              )}
              <h1 className="text-h3 font-bold text-navy">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
