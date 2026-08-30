import { NavLink } from 'react-router-dom';
import {
  Bell,
  ClipboardList,
  CloudRain,
  LayoutDashboard,
  Map as MapIcon,
  Route,
  TriangleAlert,
  UserRound,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/citizen/map', label: 'Risk Map', icon: MapIcon },
  { to: '/citizen/forecast', label: 'Forecast', icon: CloudRain },
  { to: '/citizen/safe-route', label: 'Safe Route', icon: Route },
  { to: '/citizen/report', label: 'Report Flood', icon: TriangleAlert },
  { to: '/citizen/alerts', label: 'Alerts', icon: Bell },
  { to: '/citizen/reports', label: 'My Reports', icon: ClipboardList },
  { to: '/citizen/profile', label: 'Profile', icon: UserRound },
];

export default function CitizenSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-white lg:flex lg:flex-col">
      <nav className="flex-1 space-y-1 p-3" aria-label="Citizen navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-muted hover:bg-blue-light hover:text-navy'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-ink-muted">FLOOD-X Citizen Portal</p>
        <p className="mt-0.5 text-xs text-ink-muted/70">Urban Flood Intelligence</p>
      </div>
    </aside>
  );
}
