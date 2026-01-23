import { Activity, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { User } from '../types';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SideNavProps {
  user: User;
  menuItems: NavItem[];
  activeView: string;
  onViewChange: (view: string) => void;
  onEditProfile?: () => void;
  onLogout: () => void;
}

export function SideNav({ user, menuItems, activeView, onViewChange, onEditProfile, onLogout }: SideNavProps) {
  return (
    <div className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-blue-900 text-white flex flex-col z-20">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <Activity className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <div className="text-white font-semibold">HealthLink</div>
            <div className="text-blue-300 text-sm">EHR System</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-hidden">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.id ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="mb-4 p-3 bg-blue-800 rounded-lg">
          <button onClick={() => onEditProfile?.()} className="text-white text-sm text-left w-full">
            {user.name}
          </button>
          <div className="text-blue-300 text-sm capitalize">{user.role}</div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 hover:bg-blue-800/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default SideNav;
