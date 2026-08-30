import type { ReactNode } from 'react';
import AuthorityHeader from '@/components/authority/AuthorityHeader';
import AuthoritySidebar from '@/components/authority/AuthoritySidebar';
import AuthorityMobileNav from '@/components/authority/AuthorityMobileNav';

export default function AuthorityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AuthorityHeader />
      <div className="flex flex-1">
        <AuthoritySidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
        </main>
      </div>
      <AuthorityMobileNav />
    </div>
  );
}
