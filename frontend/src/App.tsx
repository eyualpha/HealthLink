import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { DoctorDashboard } from './components/DoctorDashboard';
import { NurseDashboard } from './components/NurseDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import type { User } from './types';
import api from './lib/api';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const s = api.getSession();
    if (s?.user) setCurrentUser(s.user);
  }, []);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {(currentUser.role === 'doctor' || currentUser.role === 'clinician') && (
        <DoctorDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {(currentUser.role === 'nurse' || currentUser.role === 'reception') && (
        <NurseDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'patient' && (
        <PatientDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'admin' && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
