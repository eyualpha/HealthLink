import { useState } from 'react';
import { Activity } from 'lucide-react';
import type { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const mockUsers: Record<UserRole, User> = {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(mockUsers[selectedRole]);
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
          <div>
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
          </div>

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
      </div>
    </div>
  );
}
