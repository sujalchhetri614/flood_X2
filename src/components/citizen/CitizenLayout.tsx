import type { ReactNode } from 'react';
import CitizenHeader from '@/components/citizen/CitizenHeader';
import CitizenSidebar from '@/components/citizen/CitizenSidebar';
import CitizenMobileNav from '@/components/citizen/CitizenMobileNav';

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <CitizenHeader />
      <div className="flex flex-1">
        <CitizenSidebar />
        <main className="flex-1 overflow-x-hidden pb-20 lg:pb-0">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
        </main>
      </div>
      <CitizenMobileNav />
    </div>
  );
}
