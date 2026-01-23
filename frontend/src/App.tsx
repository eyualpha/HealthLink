Dtabase_Config_Structure
import { useState } from "react";
import { Login } from "./components/Login";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { NurseDashboard } from "./components/NurseDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import Notifications from "./components/Notifications";

import type { User } from "./types";

import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { DoctorDashboard } from './components/DoctorDashboard';
import { NurseDashboard } from './components/NurseDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import type { User } from './types';
import api from './lib/api';
main

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const s = api.getSession();
    if (s?.user) setCurrentUser(s.user);
  }, []);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
Dtabase_Config_Structure
    setCurrentUser(null);
    setShowNotifications(false);

    api.logout();
    setCurrentUser(null);
   main
  };

  // If not logged in, show login screen
  if (!currentUser) return <Login onLogin={handleLogin} />;

  // If notifications is open, show notifications page
  if (showNotifications) {
    return (
      <Notifications
        onBack={() => setShowNotifications(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
Dtabase_Config_Structure
      {currentUser.role === "doctor" && (
        <DoctorDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      )}

      {currentUser.role === "nurse" && (
        <NurseDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />

      {(currentUser.role === 'doctor' || currentUser.role === 'clinician') && (
        <DoctorDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {(currentUser.role === 'nurse' || currentUser.role === 'reception') && (
        <NurseDashboard user={currentUser} onLogout={handleLogout} />
 main
      )}

      {currentUser.role === "patient" && (
        <PatientDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      )}

      {currentUser.role === "admin" && (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      )}
    </div>
  );
}

export default App;
