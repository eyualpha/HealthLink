import { Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { User } from '../types';
import SideNav from './SideNav';

interface MenuItem<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps<T extends string> {
  user: User;
  onLogout: () => void;
  menuItems: MenuItem<T>[];
  activeView: T;
  onViewChange: (view: T) => void;
  onEditProfile?: () => void;
  children: React.ReactNode;
}

export function DashboardLayout<T extends string>({
  user,
  onLogout,
  menuItems,
  activeView,
  onViewChange,
  onEditProfile,
  children,
}: DashboardLayoutProps<T>) {
  return (
    <div className="min-h-screen">
      <SideNav
        user={user}
        menuItems={menuItems as any}
        activeView={activeView as string}
        onViewChange={(v) => onViewChange(v as T)}
        onEditProfile={onEditProfile}
        onLogout={onLogout}
      />

      {/* Main (offset on md+ to account for fixed sidebar) */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-xl font-semibold">Welcome, <button onClick={() => onEditProfile?.()} className="text-blue-600 hover:underline">{user.name}</button></h1>
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
