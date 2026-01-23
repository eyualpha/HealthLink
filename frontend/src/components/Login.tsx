import { useState } from 'react';
import { Activity } from 'lucide-react';
import type { User, UserRole } from '../types';
import api from '../lib/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

const mockUsers: Partial<Record<UserRole, User>> = {
  doctor: {
    id: 'doc1',
    name: 'Dr. Abebe Kebede',
    email: 'abebe.kebede@healthlink.et',
    role: 'doctor',
  },
  nurse: {
    id: 'nurse1',
    name: 'Nurse Tigist Alemu',
    email: 'tigist.alemu@healthlink.et',
    role: 'nurse',
  },
  patient: {
    id: 'pat1',
    name: 'Mekdes Hailu',
    email: 'mekdes.hailu@example.com',
    role: 'patient',
  },
  admin: {
    id: 'admin1',
    name: 'Admin Solomon Tesfaye',
    email: 'solomon.tesfaye@healthlink.et',
    role: 'admin',
  },
};

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.login(email, password);
      onLogin(data.user);
    } catch (err) {
      setError('Login failed — please check credentials.');
      // Do not auto-login with a demo user. Keep the form for retry.
    } finally {
      setLoading(false);
    }
  };

  const seededCreds: Array<{ role: UserRole; email: string; password: string }> = [
    { role: 'admin', email: 'admin@localhost', password: 'admin123!' },
    { role: 'doctor', email: 'doctor@localhost', password: 'Doctor123!' },
    { role: 'nurse', email: 'nurse@localhost', password: 'Nurse123!' },
    { role: 'reception', email: 'reception@localhost', password: 'Reception123!' },
    { role: 'patient', email: 'patient@localhost', password: 'Patient123!' },
    { role: 'clinician', email: 'clinician@localhost', password: 'Clinician123!' },
  ];

  const fillCred = (c: { role: UserRole; email: string; password: string }) => {
    setSelectedRole(c.role);
    setEmail(c.email);
    setPassword(c.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-blue-900 text-2xl font-semibold mb-2">HealthLink</h1>
          <p className="text-gray-600">Ethiopia's National EHR System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div>
            <label className="block text-gray-700 mb-2">Select Role (Demo)</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
              <option value="admin">Administrator</option>
            </select>
          </div> */}

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@healthlink.et"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-900 text-sm">
            <strong>Demo Mode:</strong> Select a role and click Sign In to explore the system
          </p>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-700 text-sm mb-2">Seeded demo credentials (click to autofill):</div>
          <div className="grid grid-cols-1 gap-2">
            {seededCreds.map((c) => (
              <button
                key={c.email}
                onClick={() => fillCred(c)}
                className="text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                <div className="font-medium">{c.email}</div>
                <div className="text-xs text-gray-500">{c.password} — {c.role}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
