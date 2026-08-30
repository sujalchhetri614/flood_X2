import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white p-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-ink-muted">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Unable to load data.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-risk-critical/30 bg-risk-critical/5 p-12">
      <p className="text-sm font-medium text-risk-critical">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-dark">
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-white p-12">
      <p className="text-sm font-medium text-ink-muted">{message}</p>
    </div>
  );
}
