import { X, AlertCircle, Pill, Activity, Syringe, TestTube } from 'lucide-react';
import type { PatientRecord } from './PatientRecords';


interface PatientRecordModalProps {
  patient: PatientRecord;
  onClose: () => void;
  userRole: 'doctor' | 'nurse' | 'admin';
}

export function PatientRecordModal({ patient, onClose, userRole }: PatientRecordModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">Patient Record - {patient.id}</h2>
            <p className="text-blue-100">{patient.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Demographics */}
          <section className="mb-6">
            <h3 className="text-gray-900 mb-4">Demographics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-gray-500 text-sm mb-1">Age</div>
                <div className="text-gray-900">{patient.age} years</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Gender</div>
                <div className="text-gray-900">{patient.gender}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Blood Type</div>
                <div className="text-gray-900">{patient.bloodType}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Phone</div>
                <div className="text-gray-900">{patient.phone}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Email</div>
                <div className="text-gray-900">{patient.email}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Address</div>
                <div className="text-gray-900">{patient.address}</div>
              </div>
            </div>
          </section>

          {/* Allergies Alert */}
          {patient.allergies.length > 0 && (
            <section className="mb-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-red-900 mb-2">Allergies</div>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Current Medications */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">Current Medications</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              {patient.currentMedications.length > 0 ? (
                <ul className="space-y-2">
                  {patient.currentMedications.map((med, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {med}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No current medications</p>
              )}
            </div>
          </section>

          {/* Medical History */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">Medical History</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              {patient.medicalHistory.length > 0 ? (
                <ul className="space-y-2">
                  {patient.medicalHistory.map((history, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      {history}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No medical history recorded</p>
              )}
            </div>
          </section>

          {/* Diagnoses */}
          <section className="mb-6">
            <h3 className="text-gray-900 mb-4">Diagnoses</h3>
            <div className="space-y-3">
              {patient.diagnoses.map((diagnosis, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-gray-900">{diagnosis.condition}</div>
                    <div className="text-gray-500 text-sm">{diagnosis.date}</div>
                  </div>
                  <div className="text-gray-600 text-sm">By: {diagnosis.doctor}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Immunizations */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Syringe className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">Immunizations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patient.immunizations.map((immunization, idx) => (
                <div key={idx} className="bg-purple-50 rounded-lg p-3">
                  <div className="text-gray-900">{immunization.vaccine}</div>
                  <div className="text-gray-600 text-sm">{immunization.date}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Lab Results */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TestTube className="w-5 h-5 text-orange-600" />
              <h3 className="text-gray-900">Recent Lab Results</h3>
            </div>
            <div className="space-y-3">
              {patient.labResults.map((lab, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-gray-900">{lab.test}</div>
                      <div className="text-gray-700 mt-1">{lab.result}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-sm mb-1">{lab.date}</div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        lab.status === 'Normal'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        {(userRole === 'doctor' || userRole === 'nurse') && (
          <div className="border-t border-gray-200 p-6 flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Update Record
            </button>
            <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              Print Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}