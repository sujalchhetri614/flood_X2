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
  { to: '/citizen/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/citizen/map', label: 'Map', icon: MapIcon },
  { to: '/citizen/forecast', label: 'Forecast', icon: CloudRain },
  { to: '/citizen/safe-route', label: 'Route', icon: Route },
  { to: '/citizen/report', label: 'Report', icon: TriangleAlert },
  { to: '/citizen/alerts', label: 'Alerts', icon: Bell },
  { to: '/citizen/reports', label: 'Reports', icon: ClipboardList },
  { to: '/citizen/profile', label: 'Profile', icon: UserRound },
];

export default function CitizenMobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white/95 backdrop-blur-md lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-1 py-1 overflow-x-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-[3.25rem] flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-navy' : 'text-ink-muted'
              }`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
