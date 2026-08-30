import { useEffect, useState } from 'react';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import AlertCard from '@/components/citizen/AlertCard';
import { fetchAlerts } from '@/services/citizen';
import type { AlertItem } from '@/types/citizen';

export default function CitizenAlertsPage() {
  const [items, setItems] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts().then((a) => {
      setItems(a);
      setLoading(false);
    });
  }, []);

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">Alerts &amp; Notifications</h1>
          <p className="mt-1 text-[15px] text-ink-muted">
            Active flood alerts and safety notifications for your area.
          </p>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-ink-muted">Loading alerts…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}
