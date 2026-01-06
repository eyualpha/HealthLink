import { Activity, LogOut, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { User } from '../types';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  menuItems: MenuItem[];
  activeView: string;
  onViewChange: (view: any) => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  user,
  onLogout,
  menuItems,
  activeView,
  onViewChange,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
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

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-200 hover:bg-blue-800/50'
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
            <div className="text-white text-sm">{user.name}</div>
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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-xl font-semibold">Welcome, {user.name}</h1>
              <p className="text-gray-500">Manage your healthcare operations efficiently</p>
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
