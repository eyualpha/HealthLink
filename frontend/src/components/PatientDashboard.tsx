import { useState } from 'react';
import type { User } from '../types';
import { DashboardLayout } from './DashboardLayout';
import { FileText, Calendar, Pill, User as UserIcon, Activity, Syringe } from 'lucide-react';
import BookAppointmentModal from './BookAppointmentModal';
import EditableProfileModal from './EditableProfileModal';
import type { AppointmentForm } from './BookAppointmentModal';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

type PatientView = 'overview' | 'records' | 'appointments' | 'prescriptions';

export function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const [activeView, setActiveView] = useState<PatientView>('overview');
  const [localUser, setLocalUser] = useState<User>(user);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const menuItems = [
    { id: 'overview' as PatientView, label: 'Overview', icon: Activity },
    { id: 'records' as PatientView, label: 'My Health Records', icon: FileText },
    { id: 'appointments' as PatientView, label: 'My Appointments', icon: Calendar },
    { id: 'prescriptions' as PatientView, label: 'My Prescriptions', icon: Pill },
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as PatientView)}
      onEditProfile={() => setShowProfileModal(true)}
    >
      {activeView === 'overview' && <PatientOverview user={localUser} onEditProfile={() => setShowProfileModal(true)} />}
      {activeView === 'records' && <MyHealthRecords />}
      {activeView === 'appointments' && <MyAppointments />}
      {activeView === 'prescriptions' && <MyPrescriptions />}

      {showProfileModal && (
        <EditableProfileModal
          open={showProfileModal}
          user={localUser}
          onClose={() => setShowProfileModal(false)}
          onSave={(u) => {
            setLocalUser(u);
            setShowProfileModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function PatientOverview({ user, onEditProfile }: { user: User; onEditProfile: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">My Health Dashboard</h2>
          <div className="text-sm text-gray-600">Welcome, <button onClick={onEditProfile} className="font-medium text-blue-600 hover:underline">{user.name}</button></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Upcoming Appointments</div>
          <div className="text-gray-900">2 Scheduled</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Active Prescriptions</div>
          <div className="text-gray-900">3 Medications</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Last Visit</div>
          <div className="text-gray-900">Dec 15, 2023</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Upcoming Appointments</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-gray-900">Dr. Abebe Kebede</div>
                <div className="text-gray-500 text-sm">Follow-up Consultation</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-900">Jan 16, 2024</div>
              <div className="text-gray-500 text-sm">09:30 AM</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-gray-900">Dr. Solomon Tesfaye</div>
                <div className="text-gray-500 text-sm">Annual Check-up</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-900">Jan 22, 2024</div>
              <div className="text-gray-500 text-sm">02:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">Current Medications</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-gray-900 mb-1">Metformin 500mg</div>
              <div className="text-gray-600 text-sm">Twice daily with meals</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-gray-900 mb-1">Lisinopril 10mg</div>
              <div className="text-gray-600 text-sm">Once daily in the morning</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Syringe className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900">Recent Immunizations</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="text-gray-900">COVID-19 Booster</div>
              <div className="text-gray-600 text-sm">Sep 10, 2023</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="text-gray-900">Influenza</div>
              <div className="text-gray-600 text-sm">Oct 15, 2023</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyHealthRecords() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">My Health Records</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-gray-500 text-sm mb-1">Patient ID</div>
            <div className="text-gray-900">P001</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Age</div>
            <div className="text-gray-900">28 years</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Blood Type</div>
            <div className="text-gray-900">A+</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Height</div>
            <div className="text-gray-900">165 cm</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Weight</div>
            <div className="text-gray-900">58 kg</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">BMI</div>
            <div className="text-gray-900">21.3</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Medical History</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="text-gray-900">Type 2 Diabetes</div>
              <div className="text-gray-500 text-sm">Diagnosed: Jan 2021</div>
            </div>
            <div className="text-gray-600 text-sm">Managing with medication and lifestyle changes</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="text-gray-900">Hypertension</div>
              <div className="text-gray-500 text-sm">Diagnosed: Jun 2019</div>
            </div>
            <div className="text-gray-600 text-sm">Controlled with medication</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Recent Lab Results</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-gray-900">HbA1c Test</div>
                <div className="text-gray-700 mt-1">Result: 7.2%</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-sm mb-1">Jan 10, 2024</div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  Elevated
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-gray-900">Blood Pressure</div>
                <div className="text-gray-700 mt-1">Result: 130/85 mmHg</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-sm mb-1">Jan 10, 2024</div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Normal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyAppointments() {
  const [showBookModal, setShowBookModal] = useState(false);

  const handleBookingSubmit = (data: AppointmentForm) => {
    // TODO: send booking to backend
    console.log('Booked appointment:', data);
    setShowBookModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">My Appointments</h2>
        <button onClick={() => setShowBookModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Calendar className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Upcoming</h3>
        <div className="space-y-3">
          {[
            {
              doctor: 'Dr. Abebe Kebede',
              type: 'Follow-up Consultation',
              date: 'Jan 16, 2024',
              time: '09:30 AM',
              location: 'Room 201',
            },
            {
              doctor: 'Dr. Solomon Tesfaye',
              type: 'Annual Check-up',
              date: 'Jan 22, 2024',
              time: '02:00 PM',
              location: 'Room 105',
            },
          ].map((apt, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-gray-900 mb-1">{apt.doctor}</div>
                  <div className="text-gray-600 text-sm mb-2">{apt.type}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div>{apt.date}</div>
                    <div>{apt.time}</div>
                    <div>{apt.location}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Reschedule</button>
                  <button className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Past Appointments</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-gray-900">Dr. Abebe Kebede</div>
                <div className="text-gray-600 text-sm">Diabetes Check-up</div>
              </div>
              <div className="text-gray-500 text-sm">Dec 15, 2023</div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">View Summary</button>
          </div>
        </div>
      </div>
      {showBookModal && (
        <BookAppointmentModal open={showBookModal} onClose={() => setShowBookModal(false)} onSubmit={handleBookingSubmit} />
      )}
    </div>
  );
}

function MyPrescriptions() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">My Prescriptions</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Active Prescriptions</h3>
        <div className="space-y-4">
          {[
            {
              medication: 'Metformin',
              dosage: '500mg',
              frequency: 'Twice daily',
              instructions: 'Take with meals',
              prescribed: 'Jan 15, 2024',
              refills: '2 remaining',
            },
            {
              medication: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              instructions: 'Take in the morning',
              prescribed: 'Jun 20, 2023',
              refills: '1 remaining',
            },
          ].map((rx, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Pill className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{rx.medication}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      <div>
                        <div className="text-gray-500">Dosage</div>
                        <div className="text-gray-700">{rx.dosage}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Frequency</div>
                        <div className="text-gray-700">{rx.frequency}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Instructions</div>
                        <div className="text-gray-700">{rx.instructions}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Refills</div>
                        <div className="text-gray-700">{rx.refills}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mb-2 inline-block">
                    Active
                  </span>
                  <div className="text-gray-500 text-sm">Prescribed: {rx.prescribed}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-700 text-sm">Request Refill</button>
                <button className="text-gray-600 hover:text-gray-700 text-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}