import { useState } from 'react';
import { User } from '../App';
import { DashboardLayout } from './DashboardLayout';
import { PatientRecords } from './PatientRecords';
import { Appointments } from './Appointments';
import { Prescriptions } from './Prescriptions';
import { Users, Calendar, Pill, LayoutDashboard } from 'lucide-react';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

type DoctorView = 'overview' | 'patients' | 'appointments' | 'prescriptions';

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [activeView, setActiveView] = useState<DoctorView>('overview');

  const menuItems = [
    { id: 'overview' as DoctorView, label: 'Overview', icon: LayoutDashboard },
    { id: 'patients' as DoctorView, label: 'Patient Records', icon: Users },
    { id: 'appointments' as DoctorView, label: 'Appointments', icon: Calendar },
    { id: 'prescriptions' as DoctorView, label: 'Prescriptions', icon: Pill },
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {activeView === 'overview' && <DoctorOverview />}
      {activeView === 'patients' && <PatientRecords userRole="doctor" />}
      {activeView === 'appointments' && <Appointments userRole="doctor" />}
      {activeView === 'prescriptions' && <Prescriptions />}
    </DashboardLayout>
  );
}

function DoctorOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Today's Appointments</div>
          <div className="text-gray-900">8 Scheduled</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Active Patients</div>
          <div className="text-gray-900">124 Total</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Prescriptions This Week</div>
          <div className="text-gray-900">42 Written</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {[
            { time: '09:00 AM', patient: 'Alemayehu Girma', type: 'Follow-up', status: 'Completed' },
            { time: '10:00 AM', patient: 'Sara Mohammed', type: 'New Patient', status: 'In Progress' },
            { time: '11:30 AM', patient: 'Daniel Bekele', type: 'Check-up', status: 'Upcoming' },
            { time: '02:00 PM', patient: 'Hiwot Tadesse', type: 'Consultation', status: 'Upcoming' },
          ].map((appt, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-gray-700">{appt.time}</div>
                <div>
                  <div className="text-gray-900">{appt.patient}</div>
                  <div className="text-gray-500 text-sm">{appt.type}</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                appt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                appt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-200 text-gray-700'
              }`}>
                {appt.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
