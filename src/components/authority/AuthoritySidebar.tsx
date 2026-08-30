import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BellRing,
  Building2,
  ClipboardList,
  CloudRain,
  Construction,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Route,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { to: '/authority/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/authority/map', label: 'Flood Map', icon: MapIcon },
  { to: '/authority/forecast', label: 'Nowcast', icon: CloudRain },
  { to: '/authority/roads', label: 'Road Risk', icon: Construction },
  { to: '/authority/infrastructure', label: 'Infrastructure', icon: Building2 },
  { to: '/authority/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/authority/response', label: 'Response Priority', icon: ShieldAlert },
  { to: '/authority/routes', label: 'Emergency Routes', icon: Route },
  { to: '/authority/alerts', label: 'Alert Management', icon: BellRing },
  { to: '/authority/reports', label: 'Citizen Reports', icon: ClipboardList },
];

export default function AuthoritySidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white lg:flex">
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Authority navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-muted hover:bg-blue-light hover:text-navy'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-blue-light hover:text-navy">
          <Settings className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          Settings
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-risk-critical transition-colors hover:bg-risk-critical/10"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}
