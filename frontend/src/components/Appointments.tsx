import { useState } from 'react';
import { Calendar, Clock, Plus, Search, User } from 'lucide-react';

interface AppointmentsProps {
  userRole: 'doctor' | 'nurse' | 'patient';
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    patientName: 'Alemayehu Girma',
    doctorName: 'Dr. Abebe Kebede',
    date: '2024-01-15',
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'Completed',
    notes: 'Diabetes check-up',
  },
  {
    id: 'APT002',
    patientName: 'Sara Mohammed',
    doctorName: 'Dr. Abebe Kebede',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'New Patient',
    status: 'In Progress',
  },
  {
    id: 'APT003',
    patientName: 'Daniel Bekele',
    doctorName: 'Dr. Abebe Kebede',
    date: '2024-01-15',
    time: '11:30 AM',
    type: 'Check-up',
    status: 'Scheduled',
  },
  {
    id: 'APT004',
    patientName: 'Hiwot Tadesse',
    doctorName: 'Dr. Abebe Kebede',
    date: '2024-01-15',
    time: '02:00 PM',
    type: 'Consultation',
    status: 'Scheduled',
  },
  {
    id: 'APT005',
    patientName: 'Mekdes Hailu',
    doctorName: 'Dr. Abebe Kebede',
    date: '2024-01-16',
    time: '09:30 AM',
    type: 'Follow-up',
    status: 'Scheduled',
  },
];

export function Appointments({ userRole }: AppointmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Appointments</h2>
        {(userRole === 'doctor' || userRole === 'nurse') && (
          <button
            onClick={() => setShowNewAppointmentModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Schedule Appointment
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 mb-1">{appointment.patientName}</div>
                    <div className="text-gray-600 text-sm mb-2">{appointment.type}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        Notes: {appointment.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : appointment.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : appointment.status === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {appointment.status}
                  </span>
                  {userRole !== 'patient' && (
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        Reschedule
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewAppointmentModal && (
        <NewAppointmentModal onClose={() => setShowNewAppointmentModal(false)} />
      )}
    </div>
  );
}

function NewAppointmentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between rounded-t-xl">
          <h3 className="text-white">Schedule New Appointment</h3>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Patient Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search patient..."
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Doctor</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Dr. Abebe Kebede</option>
              <option>Dr. Tigist Alemu</option>
              <option>Dr. Solomon Tesfaye</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Time</label>
            <input
              type="time"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Appointment Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Check-up</option>
              <option>Follow-up</option>
              <option>New Patient</option>
              <option>Consultation</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule Appointment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
