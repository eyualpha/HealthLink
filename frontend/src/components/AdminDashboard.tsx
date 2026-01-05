import { useState } from 'react';
import { User } from '../App';
import { DashboardLayout } from './DashboardLayout';
import { BarChart3, Users, Calendar, Activity, TrendingUp, Clock } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type AdminView = 'analytics' | 'users' | 'system' | 'reports';

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>('analytics');

  const menuItems = [
    { id: 'analytics' as AdminView, label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'users' as AdminView, label: 'User Management', icon: Users },
    { id: 'system' as AdminView, label: 'System Health', icon: Activity },
    { id: 'reports' as AdminView, label: 'Reports', icon: TrendingUp },
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {activeView === 'analytics' && <AnalyticsDashboard />}
      {activeView === 'users' && <UserManagement />}
      {activeView === 'system' && <SystemHealth />}
      {activeView === 'reports' && <Reports />}
    </DashboardLayout>
  );
}

function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <div className="text-gray-500 mb-1">Total Patients</div>
          <div className="text-gray-900">2,847</div>
          <div className="text-gray-500 text-sm mt-2">vs. last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </div>
          </div>
          <div className="text-gray-500 mb-1">Appointments This Month</div>
          <div className="text-gray-900">1,234</div>
          <div className="text-gray-500 text-sm mt-2">vs. last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-gray-600 text-sm">Stable</div>
          </div>
          <div className="text-gray-500 mb-1">Active Medical Staff</div>
          <div className="text-gray-900">142</div>
          <div className="text-gray-500 text-sm mt-2">doctors & nurses</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              -15%
            </div>
          </div>
          <div className="text-gray-500 mb-1">Avg. Wait Time</div>
          <div className="text-gray-900">18 mins</div>
          <div className="text-gray-500 text-sm mt-2">improvement</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Daily Appointments</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 62, 58, 71, 68, 85, 92].map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                  style={{ height: `${(value / 100) * 100}%` }}
                ></div>
                <div className="text-gray-500 text-sm">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">System Usage</h3>
          <div className="space-y-4">
            {[
              { label: 'Patient Records Access', value: 87, color: 'bg-blue-600' },
              { label: 'Appointment Scheduling', value: 72, color: 'bg-green-600' },
              { label: 'Prescription Management', value: 64, color: 'bg-purple-600' },
              { label: 'Lab Results Entry', value: 58, color: 'bg-orange-600' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700">{item.label}</div>
                  <div className="text-gray-900">{item.value}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          {[
            {
              user: 'Dr. Abebe Kebede',
              action: 'Updated patient record',
              patient: 'Alemayehu Girma',
              time: '5 minutes ago',
            },
            {
              user: 'Nurse Tigist Alemu',
              action: 'Scheduled appointment',
              patient: 'Sara Mohammed',
              time: '12 minutes ago',
            },
            {
              user: 'Dr. Solomon Tesfaye',
              action: 'Created prescription',
              patient: 'Daniel Bekele',
              time: '23 minutes ago',
            },
            {
              user: 'Admin Team',
              action: 'Generated monthly report',
              patient: 'System',
              time: '1 hour ago',
            },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-gray-900">
                  {activity.user} {activity.action.toLowerCase()}
                </div>
                <div className="text-gray-500 text-sm">{activity.patient}</div>
              </div>
              <div className="text-gray-500 text-sm">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  const users = [
    { id: 1, name: 'Dr. Abebe Kebede', role: 'Doctor', email: 'abebe.k@healthlink.et', status: 'Active' },
    { id: 2, name: 'Nurse Tigist Alemu', role: 'Nurse', email: 'tigist.a@healthlink.et', status: 'Active' },
    { id: 3, name: 'Dr. Solomon Tesfaye', role: 'Doctor', email: 'solomon.t@healthlink.et', status: 'Active' },
    { id: 4, name: 'Admin User', role: 'Administrator', email: 'admin@healthlink.et', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">User Management</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Users className="w-5 h-5" />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-gray-700">Name</th>
              <th className="text-left py-4 px-6 text-gray-700">Role</th>
              <th className="text-left py-4 px-6 text-gray-700">Email</th>
              <th className="text-left py-4 px-6 text-gray-700">Status</th>
              <th className="text-left py-4 px-6 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200">
                <td className="py-4 px-6 text-gray-900">{user.name}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">{user.email}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-700 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-700">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">System Health</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-700 mb-2">Server Status</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="text-gray-900">Operational</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-700 mb-2">Database Status</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="text-gray-900">Healthy</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-700 mb-2">API Response Time</div>
          <div className="text-gray-900">124ms</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Audit Logs</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-700">
                  User access: Dr. Abebe Kebede accessed patient record P00{i + 1}
                </div>
                <div className="text-gray-500">2024-01-15 {10 + i}:{15 + i}:00</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Monthly Patient Report', date: 'January 2024', type: 'Patient Analytics' },
          { title: 'Appointment Statistics', date: 'Q4 2023', type: 'Operations' },
          { title: 'Prescription Summary', date: 'December 2023', type: 'Clinical' },
          { title: 'System Usage Report', date: 'January 2024', type: 'Technical' },
        ].map((report, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-900 mb-2">{report.title}</h3>
            <div className="text-gray-600 text-sm mb-4">{report.date}</div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {report.type}
              </span>
              <button className="text-blue-600 hover:text-blue-700">Download PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}