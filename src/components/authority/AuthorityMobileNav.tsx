import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BellRing,
  Building2,
  ClipboardList,
  CloudRain,
  Construction,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  Route,
  ShieldAlert,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/authority/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/authority/map', label: 'Flood Map', icon: MapIcon },
  { to: '/authority/forecast', label: 'Nowcast', icon: CloudRain },
  { to: '/authority/roads', label: 'Road Risk', icon: Construction },
  { to: '/authority/infrastructure', label: 'Infrastructure', icon: Building2 },
  { to: '/authority/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/authority/response', label: 'Response Priority', icon: ShieldAlert },
  { to: '/authority/routes', label: 'Emergency Routes', icon: Route },
  { to: '/authority/alerts', label: 'Alerts', icon: BellRing },
  { to: '/authority/reports', label: 'Citizen Reports', icon: ClipboardList },
];

export default function AuthorityMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white shadow-card-hover lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-white shadow-card-hover animate-slide-in">
            <div className="flex items-center justify-between border-b border-border p-4">
              <p className="text-sm font-bold text-navy">Command Center</p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-ink-muted hover:bg-blue-light"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="space-y-0.5 p-3" aria-label="Authority mobile navigation">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-navy text-white'
                        : 'text-ink-muted hover:bg-blue-light hover:text-navy'
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
