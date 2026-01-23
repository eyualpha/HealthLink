Dtabase_Config_Structure
import { useState } from "react";
import { Activity, LogOut, Bell, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { User } from "../types";
import { Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { User } from '../types';
import SideNav from './SideNav';
main

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

  // ✅ notifications
  onShowNotifications?: () => void;

  children: React.ReactNode;
}

export function DashboardLayout<T extends string>({
  user,
  onLogout,
  menuItems,
  activeView,
  onViewChange,
  onEditProfile,
  onShowNotifications,
  children,
}: DashboardLayoutProps<T>) {
Dtabase_Config_Structure
  const [mobileOpen, setMobileOpen] = useState(false);

  const Sidebar = (
    <div className="h-full w-64 bg-blue-900 text-white flex flex-col">
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
                onClick={() => {
                  onViewChange(item.id);
                  setMobileOpen(false); // ✅ close drawer after selecting
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.id
                    ? "bg-blue-800 text-white"
                    : "text-blue-200 hover:bg-blue-800/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-left">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="mb-4 p-3 bg-blue-800 rounded-lg">
          <button
            onClick={() => onEditProfile?.()}
            className="text-white text-sm text-left w-full"
          >
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0">{Sidebar}</div>
        </div>
      )}

      <div className="min-h-screen flex">
        {/* ✅ Desktop sidebar only */}
        <div className="hidden lg:block">{Sidebar}</div>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* ✅ Mobile menu button */}
                <button
                  type="button"
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>

                <div className="min-w-0">
                  <h1 className="text-gray-900 text-base sm:text-xl font-semibold truncate">
                    Welcome,{" "}
                    <button
                      onClick={() => onEditProfile?.()}
                      className="text-blue-600 hover:underline"
                    >
                      {user.name}
                    </button>
                  </h1>
                  <p className="text-gray-500 text-sm hidden sm:block">
                    Manage your healthcare operations efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* ✅ Close icon if you want it beside bell (optional) */}
                {mobileOpen && (
                  <button
                    type="button"
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                )}

                {/* ✅ Notifications button kept exactly */}
                <button
                  type="button"
                  onClick={() => onShowNotifications?.()}
                  disabled={!onShowNotifications}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Notifications"
                  title={
                    onShowNotifications
                      ? "Notifications"
                      : "Notifications not available"
                  }
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div>
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
main
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
