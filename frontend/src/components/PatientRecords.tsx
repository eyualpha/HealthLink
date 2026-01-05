import { useState } from 'react';
import { Search, Plus, FileText, AlertCircle } from 'lucide-react';
import { PatientRecordModal } from './PatientRecordModal';

interface PatientRecordsProps {
  userRole: 'doctor' | 'nurse' | 'admin';
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  allergies: string[];
  medicalHistory: string[];
  currentMedications: string[];
  diagnoses: {
    date: string;
    condition: string;
    doctor: string;
  }[];
  treatments: {
    date: string;
    treatment: string;
    notes: string;
  }[];
  immunizations: {
    vaccine: string;
    date: string;
  }[];
  labResults: {
    test: string;
    date: string;
    result: string;
    status: string;
  }[];
  lastVisit: string;
}

const mockPatients: PatientRecord[] = [
  {
    id: 'P001',
    name: 'Alemayehu Girma',
    age: 45,
    gender: 'Male',
    bloodType: 'O+',
    phone: '+251-911-234567',
    email: 'alemayehu.g@example.com',
    address: 'Bole, Addis Ababa',
    emergencyContact: '+251-911-987654',
    allergies: ['Penicillin', 'Peanuts'],
    medicalHistory: ['Hypertension (2019)', 'Type 2 Diabetes (2021)'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    diagnoses: [
      { date: '2024-01-15', condition: 'Type 2 Diabetes', doctor: 'Dr. Abebe Kebede' },
      { date: '2023-06-20', condition: 'Hypertension', doctor: 'Dr. Abebe Kebede' },
    ],
    treatments: [
      { date: '2024-01-15', treatment: 'Medication Adjustment', notes: 'Increased Metformin dosage' },
    ],
    immunizations: [
      { vaccine: 'COVID-19 Booster', date: '2023-09-10' },
      { vaccine: 'Influenza', date: '2023-10-15' },
    ],
    labResults: [
      { test: 'HbA1c', date: '2024-01-10', result: '7.2%', status: 'Elevated' },
      { test: 'Blood Pressure', date: '2024-01-10', result: '130/85 mmHg', status: 'Normal' },
    ],
    lastVisit: '2024-01-15',
  },
  {
    id: 'P002',
    name: 'Sara Mohammed',
    age: 28,
    gender: 'Female',
    bloodType: 'A+',
    phone: '+251-912-345678',
    email: 'sara.m@example.com',
    address: 'Kirkos, Addis Ababa',
    emergencyContact: '+251-912-876543',
    allergies: [],
    medicalHistory: ['Asthma (2015)'],
    currentMedications: ['Albuterol Inhaler'],
    diagnoses: [
      { date: '2023-11-05', condition: 'Asthma', doctor: 'Dr. Abebe Kebede' },
    ],
    treatments: [
      { date: '2023-11-05', treatment: 'Prescribed Inhaler', notes: 'Use as needed' },
    ],
    immunizations: [
      { vaccine: 'COVID-19', date: '2023-05-20' },
      { vaccine: 'Tetanus', date: '2022-08-15' },
    ],
    labResults: [
      { test: 'Pulmonary Function', date: '2023-11-01', result: 'Normal', status: 'Normal' },
    ],
    lastVisit: '2023-11-05',
  },
  {
    id: 'P003',
    name: 'Daniel Bekele',
    age: 62,
    gender: 'Male',
    bloodType: 'B+',
    phone: '+251-913-456789',
    email: 'daniel.b@example.com',
    address: 'Yeka, Addis Ababa',
    emergencyContact: '+251-913-765432',
    allergies: ['Sulfa drugs'],
    medicalHistory: ['Heart Disease (2018)', 'High Cholesterol (2017)'],
    currentMedications: ['Atorvastatin 20mg', 'Aspirin 81mg'],
    diagnoses: [
      { date: '2023-08-12', condition: 'Coronary Artery Disease', doctor: 'Dr. Abebe Kebede' },
    ],
    treatments: [
      { date: '2023-08-12', treatment: 'Cardiac Rehabilitation', notes: 'Ongoing monitoring' },
    ],
    immunizations: [
      { vaccine: 'Pneumococcal', date: '2023-03-10' },
    ],
    labResults: [
      { test: 'Lipid Panel', date: '2023-12-20', result: 'LDL: 95 mg/dL', status: 'Normal' },
      { test: 'ECG', date: '2023-12-20', result: 'Normal sinus rhythm', status: 'Normal' },
    ],
    lastVisit: '2023-12-20',
  },
];

export function PatientRecords({ userRole }: PatientRecordsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredPatients = mockPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRecord = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Patient Records</h2>
        {(userRole === 'doctor' || userRole === 'nurse') && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Add New Patient
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Patient ID</th>
                <th className="text-left py-3 px-4 text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-gray-700">Age</th>
                <th className="text-left py-3 px-4 text-gray-700">Blood Type</th>
                <th className="text-left py-3 px-4 text-gray-700">Last Visit</th>
                <th className="text-left py-3 px-4 text-gray-700">Allergies</th>
                <th className="text-left py-3 px-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{patient.id}</td>
                  <td className="py-4 px-4 text-gray-900">{patient.name}</td>
                  <td className="py-4 px-4 text-gray-600">{patient.age}</td>
                  <td className="py-4 px-4 text-gray-600">{patient.bloodType}</td>
                  <td className="py-4 px-4 text-gray-600">{patient.lastVisit}</td>
                  <td className="py-4 px-4">
                    {patient.allergies.length > 0 ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{patient.allergies.length} allergies</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewRecord(patient)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <FileText className="w-4 h-4" />
                      View Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedPatient && (
        <PatientRecordModal
          patient={selectedPatient}
          onClose={() => setShowModal(false)}
          userRole={userRole}
        />
      )}
    </div>
  );
}
