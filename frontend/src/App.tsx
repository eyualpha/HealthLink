import { useState } from "react";
import { Login } from "./components/Login";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { NurseDashboard } from "./components/NurseDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import Notifications from "./components/Notifications";

import type { User } from "./types";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    setCurrentUser(null);
    setShowNotifications(false);
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
