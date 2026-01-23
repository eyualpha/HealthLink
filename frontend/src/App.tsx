import { useState } from "react";
import type { User } from "./types";
import api from "./lib/api";

// Components
import { Login } from "./components/Login";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { NurseDashboard } from "./components/NurseDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import Notifications from "./components/Notifications";
import { ReceptionDashboard } from "./components/ReceptorDashboard";
import type { PatientRegistrationData } from "./components/ReceptorDashboard";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = api.getSession();
    return session?.user ?? null;
  });
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogin = (user: User) => setCurrentUser(user);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setShowNotifications(false);
  };

  const handleRegisterPatient = async (data: PatientRegistrationData) => {
    const name = [data.firstName, data.middleName, data.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    await api.createPatient({
      name,
      dob: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
      gender: data.gender?.toLowerCase?.(),
      contact: {
        phone: data.phone,
        email: data.email,
      },
      address: [data.addressLine1, data.addressLine2, data.city]
        .filter(Boolean)
        .join(", "),
      allergies: data.allergies ? [data.allergies] : [],
      medications: data.currentMedications
        ? [{ name: data.currentMedications }]
        : [],
      medicalHistory: [],
    });
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
          onRegisterPatient={handleRegisterPatient}
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
