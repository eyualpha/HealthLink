import { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, Pill, Search } from 'lucide-react';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: 'Active' | 'Completed' | 'Cancelled';
}

const mockPrescriptions: Prescription[] = [
  {
    id: 'RX001',
    patientName: 'Alemayehu Girma',
    patientId: 'P001',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '90 days',
    date: '2024-01-15',
    status: 'Active',
  },
  {
    id: 'RX002',
    patientName: 'Sara Mohammed',
    patientId: 'P002',
    medication: 'Albuterol Inhaler',
    dosage: '90mcg',
    frequency: 'As needed',
    duration: '30 days',
    date: '2023-11-05',
    status: 'Active',
  },
  {
    id: 'RX003',
    patientName: 'Daniel Bekele',
    patientId: 'P003',
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily (evening)',
    duration: '90 days',
    date: '2023-12-20',
    status: 'Active',
  },
];

export function Prescriptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPrescription, setShowNewPrescription] = useState(false);

  const filteredPrescriptions = mockPrescriptions.filter((rx) =>
    rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Prescriptions</h2>
        <button
          onClick={() => setShowNewPrescription(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Prescription
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient, medication, or prescription ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Pill className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gray-900">{rx.medication}</div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {rx.id}
                      </span>
                    </div>
                    <div className="text-gray-700 mb-2">
                      Patient: {rx.patientName} ({rx.patientId})
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Dosage</div>
                        <div className="text-gray-700">{rx.dosage}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Frequency</div>
                        <div className="text-gray-700">{rx.frequency}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="text-gray-700">{rx.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Date Issued</div>
                        <div className="text-gray-700">{rx.date}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      rx.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : rx.status === 'Completed'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {rx.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewPrescription && (
        <NewPrescriptionModal onClose={() => setShowNewPrescription(false)} />
      )}
    </div>
  );
}

function NewPrescriptionModal({ onClose }: { onClose: () => void }) {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medication, setMedication] = useState('');
  const [showAIAlert, setShowAIAlert] = useState(false);

  const handleMedicationChange = (med: string) => {
    setMedication(med);
    // Simulate AI Safety Engine check
    if (selectedPatient === 'P001' && med.toLowerCase().includes('penicillin')) {
      setShowAIAlert(true);
    } else {
      setShowAIAlert(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between sticky top-0">
          <h3 className="text-white">Create New Prescription</h3>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form className="p-6 space-y-6">
          {/* AI Safety Alert */}
          {showAIAlert && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-red-900 mb-1">AI Safety Alert</div>
                  <div className="text-red-700 text-sm">
                    <strong>Allergy Conflict Detected:</strong> Patient has a known allergy to Penicillin.
                    This medication may cause adverse reactions. Please review patient allergies before
                    prescribing.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a patient...</option>
              <option value="P001">Alemayehu Girma (P001) - Allergies: Penicillin, Peanuts</option>
              <option value="P002">Sara Mohammed (P002) - No known allergies</option>
              <option value="P003">Daniel Bekele (P003) - Allergies: Sulfa drugs</option>
            </select>
          </div>

          {selectedPatient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-blue-900 text-sm mb-1">Current Medications</div>
                  <div className="text-blue-700 text-sm">
                    {selectedPatient === 'P001' && 'Metformin 500mg, Lisinopril 10mg'}
                    {selectedPatient === 'P002' && 'Albuterol Inhaler'}
                    {selectedPatient === 'P003' && 'Atorvastatin 20mg, Aspirin 81mg'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Medication Name</label>
            <input
              type="text"
              value={medication}
              onChange={(e) => handleMedicationChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Amoxicillin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Dosage</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 500mg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Frequency</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>Four times daily</option>
                <option>As needed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Duration</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>7 days</option>
              <option>14 days</option>
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
              <option>Ongoing</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Instructions</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Special instructions for the patient..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={showAIAlert}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                showAIAlert
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {showAIAlert ? 'Resolve Safety Alert First' : 'Create Prescription'}
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
