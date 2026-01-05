import { useState } from 'react';
import { Login } from './components/Login';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { NurseDashboard } from './components/NurseDashboard';

export type UserRole = 'doctor' | 'nurse' | 'patient' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === 'doctor' && (
        <DoctorDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'nurse' && (
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