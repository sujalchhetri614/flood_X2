import { Check, Layers } from 'lucide-react';
import type { MapLayer } from '@/types/authority';

interface LayerControlProps {
  layers: MapLayer[];
  onToggle: (id: string) => void;
  className?: string;
}

export default function LayerControl({ layers, onToggle, className = '' }: LayerControlProps) {
  return (
    <div className={`rounded-xl border border-border bg-white/95 p-3 shadow-card ${className}`}>
      <div className="mb-2 flex items-center gap-1.5">
        <Layers className="h-4 w-4 text-blue-primary" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Map Layers</p>
      </div>
      <ul className="max-h-64 space-y-1 overflow-y-auto">
        {layers.map((layer) => (
          <li key={layer.id}>
            <button
              onClick={() => onToggle(layer.id)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm text-ink transition-colors hover:bg-blue-light"
            >
              <span>{layer.label}</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                  layer.enabled
                    ? 'border-blue-primary bg-blue-primary text-white'
                    : 'border-border bg-white'
                }`}
                aria-hidden="true"
              >
                {layer.enabled && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
