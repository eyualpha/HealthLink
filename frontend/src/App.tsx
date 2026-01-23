import { useState, useEffect } from "react";
import type { User } from "./types";
import api from './lib/api';

// Components
import { Login } from "./components/Login";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { NurseDashboard } from "./components/NurseDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import Notifications from "./components/Notifications";
import { ReceptionDashboard } from "./components/ReceptorDashboard";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const session = api.getSession();
    if (session?.user) setCurrentUser(session.user);
  }, []);

  const handleLogin = (user: User) => setCurrentUser(user);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setShowNotifications(false);
  };

  // If not logged in, show login screen
  if (!currentUser) return <Login onLogin={handleLogin} />;

  // If notifications is open, show notifications page
  if (showNotifications) {
    return <Notifications onBack={() => setShowNotifications(false)} />;
  }

  // Render dashboard based on role
  switch (currentUser.role) {
    case "doctor":
    case "clinician":
      return (
        <DoctorDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      );

    case "nurse":
    
      return (
        <NurseDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      );

    case "patient":
      return (
        <PatientDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      );
    case "reception":
      return (
        <ReceptionDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      );
    case "admin":
      return (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onShowNotifications={() => setShowNotifications(true)}
        />
      );

    default:
      return <Login onLogin={handleLogin} />;
  }
}

export default App;
