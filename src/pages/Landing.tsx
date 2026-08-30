import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CloudRain,
  Map,
  MapPin,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  Waves,
} from 'lucide-react';
import FloodXLogo from '@/components/branding/FloodXLogo';
import GisBackground from '@/components/layout/GisBackground';
import PublicHeader from '@/components/layout/PublicHeader';
import RoleCard from '@/components/auth/RoleCard';

const CAPABILITIES = [
  { icon: CloudRain, label: 'Monitor rainfall' },
  { icon: Waves, label: 'Assess flood risk' },
  { icon: Map, label: 'Visualize affected areas' },
  { icon: TriangleAlert, label: 'Identify risky roads' },
  { icon: MapPin, label: 'Find safer routes' },
  { icon: ShieldCheck, label: 'Coordinate response' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <GisBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <PublicHeader tagline="Urban Flood Intelligence & Decision Support" />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:py-16">
          <div className="text-center animate-fade-in">
            <span className="inline-flex items-center rounded-full border border-border bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Public Safety Platform · Real-Time Flood Intelligence
            </span>
            <h1 className="mt-5 text-h1 font-bold tracking-tight text-navy-dark sm:text-[3.25rem]">
              FLOOD<span className="text-blue-primary">-X</span>
            </h1>
            <p className="mt-3 text-lg font-medium text-navy sm:text-xl">
              Urban Flood Intelligence &amp; Decision Support
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-blue-primary">
              Predict. Prepare. Respond.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">
              Real-time flood risk, short-term nowcasting, safer routes and coordinated response —
              for citizens and authorities.
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-3xl">
            <p className="mb-5 text-center text-sm font-semibold uppercase tracking-wider text-ink-muted">
              Who are you?
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <RoleCard
                accent="citizen"
                icon={<UserRound className="h-7 w-7" strokeWidth={2} />}
                title="Citizen"
                description="Monitor local flood risk, find safer routes, report flooding and receive important safety alerts."
                features={['Local Flood Risk', 'Safe Routes', 'Flood Reporting', 'Safety Alerts']}
                cta="Continue as Citizen"
                onClick={() => navigate('/citizen/login')}
              />
              <RoleCard
                accent="authority"
                icon={<Building2 className="h-7 w-7" strokeWidth={2} />}
                title="Authority"
                description="Monitor city-wide flood conditions, identify critical zones, review citizen reports and coordinate emergency response."
                features={['City Risk Map', 'Critical Zones', 'Incident Monitoring', 'Response Management']}
                cta="Continue as Authority"
                onClick={() => navigate('/authority/login')}
              />
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-3xl">
            <div className="rounded-2xl border border-border bg-white/70 px-5 py-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-ink-muted">
                FLOOD-X helps communities and authorities
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
                {CAPABILITIES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm text-ink">
                    <Icon className="h-4 w-4 shrink-0 text-blue-primary" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <footer className="relative z-10 border-t border-border/70 bg-white/60 py-4 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-ink-muted sm:px-6">
            Real-Time Flood Risk · 0–3 Hour Nowcasting · Decision Support
          </div>
        </footer>
      </div>
    </>
  );
}
