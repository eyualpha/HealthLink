import { useState } from 'react';
import type { User } from '../types';
import { DashboardLayout } from './DashboardLayout';
import { PatientRecords } from './PatientRecords';
import { Appointments } from './Appointments';
import { Users, Calendar, Activity, Clipboard } from 'lucide-react';

interface NurseDashboardProps {
  user: User;
  onLogout: () => void;
}

type NurseView = 'overview' | 'patients' | 'appointments' | 'vitals';

export function NurseDashboard({ user, onLogout }: NurseDashboardProps) {
  const [activeView, setActiveView] = useState<NurseView>('overview');

  const menuItems = [
    { id: 'overview' as NurseView, label: 'Overview', icon: Activity },
    { id: 'patients' as NurseView, label: 'Patient Records', icon: Users },
    { id: 'appointments' as NurseView, label: 'Appointments', icon: Calendar },
    { id: 'vitals' as NurseView, label: 'Vital Signs', icon: Clipboard },
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as NurseView)}
    >
      {activeView === 'overview' && <NurseOverview />}
      {activeView === 'patients' && <PatientRecords userRole="nurse" />}
      {activeView === 'appointments' && <Appointments userRole="nurse" />}
      {activeView === 'vitals' && <VitalSigns />}
    </DashboardLayout>
  );
}

function NurseOverview() {
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
          <div className="text-gray-500 mb-1">Patients Today</div>
          <div className="text-gray-900">12 Scheduled</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Vitals Recorded</div>
          <div className="text-gray-900">8 Today</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clipboard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Pending Tasks</div>
          <div className="text-gray-900">4 Remaining</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Today's Tasks</h3>
        <div className="space-y-3">
          {[
            { task: 'Record vitals for Alemayehu Girma', time: '09:00 AM', status: 'Completed' },
            { task: 'Prepare treatment room for Sara Mohammed', time: '10:00 AM', status: 'In Progress' },
            { task: 'Administer medication to Daniel Bekele', time: '11:30 AM', status: 'Pending' },
            { task: 'Update patient charts', time: '02:00 PM', status: 'Pending' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-gray-900">{item.task}</div>
                <div className="text-gray-500 text-sm">{item.time}</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  item.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VitalSigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Vital Signs Recording</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Clipboard className="w-5 h-5" />
          Record New Vitals
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Recent Vital Signs</h3>
        <div className="space-y-4">
          {[
            {
              patient: 'Alemayehu Girma',
              patientId: 'P001',
              bp: '130/85',
              hr: '72',
              temp: '36.8°C',
              spo2: '98%',
              time: '09:15 AM',
            },
            {
              patient: 'Sara Mohammed',
              patientId: 'P002',
              bp: '120/80',
              hr: '68',
              temp: '37.0°C',
              spo2: '99%',
              time: '10:30 AM',
            },
            {
              patient: 'Daniel Bekele',
              patientId: 'P003',
              bp: '135/88',
              hr: '75',
              temp: '36.5°C',
              spo2: '97%',
              time: '11:45 AM',
            },
          ].map((vital, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-gray-900 mb-1">
                    {vital.patient} ({vital.patientId})
                  </div>
                  <div className="text-gray-500 text-sm">Recorded at {vital.time}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Blood Pressure</div>
                  <div className="text-gray-900">{vital.bp} mmHg</div>
                </div>
                <div>
                  <div className="text-gray-500">Heart Rate</div>
                  <div className="text-gray-900">{vital.hr} bpm</div>
                </div>
                <div>
                  <div className="text-gray-500">Temperature</div>
                  <div className="text-gray-900">{vital.temp}</div>
                </div>
                <div>
                  <div className="text-gray-500">SpO2</div>
                  <div className="text-gray-900">{vital.spo2}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}