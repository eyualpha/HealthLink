// src/components/PatientRecordModal.tsx
import { useMemo, useState } from 'react';
import { X, AlertCircle, Pill, Activity, Syringe, TestTube, Plus, Trash2 } from 'lucide-react';
import type { PatientRecord } from './PatientRecords';

interface PatientRecordModalProps {
  patient: PatientRecord;
  onClose: () => void;
  userRole: 'doctor' | 'nurse' | 'admin';
  isCreateMode?: boolean;
}

type ListKey = 'allergies' | 'medicalHistory' | 'currentMedications';

export function PatientRecordModal({ patient, onClose, userRole, isCreateMode }: PatientRecordModalProps) {
  const canEdit = userRole === 'doctor' || userRole === 'nurse';

  const [form, setForm] = useState<PatientRecord>(patient);
  const [isEditing, setIsEditing] = useState<boolean>(!!isCreateMode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // simple inputs for adding items
  const [newAllergy, setNewAllergy] = useState('');
  const [newHistory, setNewHistory] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const title = useMemo(() => {
    if (isCreateMode) return 'Create Patient Record';
    return `Patient Record - ${patient.id}`;
  }, [isCreateMode, patient.id]);

  const updateField = (key: keyof PatientRecord, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.id.trim()) e.id = 'Patient ID is required';
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.gender.trim()) e.gender = 'Gender is required';
    if (!form.bloodType.trim()) e.bloodType = 'Blood type is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (Number.isNaN(form.age) || form.age <= 0) e.age = 'Age must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Later: call your backend (POST/PUT)
    console.log('Saved patient:', form);

    setIsEditing(false);
    onClose();
  };

  const addListItem = (key: ListKey, value: string) => {
    const v = value.trim();
    if (!v) return;
    setForm((prev) => ({ ...prev, [key]: [...prev[key], v] }));
  };

  const removeListItem = (key: ListKey, idx: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  };

  const SectionHeader = ({ label, right }: { label: string; right?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-900">{label}</h3>
      {right}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">{title}</h2>
            {!isCreateMode && <p className="text-blue-100">{patient.name}</p>}
          </div>

          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Demographics */}
          <section className="mb-6">
            <SectionHeader
              label="Demographics"
              right={
                canEdit ? (
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setForm(patient);
                            setErrors({});
                            setIsEditing(false);
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                ) : null
              }
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Patient ID */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Patient ID</div>
                {isEditing ? (
                  <>
                    <input
                      value={form.id}
                      onChange={(e) => updateField('id', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {errors.id && <p className="text-red-600 text-sm mt-1">{errors.id}</p>}
                  </>
                ) : (
                  <div className="text-gray-900">{form.id}</div>
                )}
              </div>

              {/* Name */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Name</div>
                {isEditing ? (
                  <>
                    <input
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </>
                ) : (
                  <div className="text-gray-900">{form.name}</div>
                )}
              </div>

              {/* Age */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Age</div>
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => updateField('age', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
                  </>
                ) : (
                  <div className="text-gray-900">{form.age} years</div>
                )}
              </div>

              {/* Gender */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Gender</div>
                {isEditing ? (
                  <>
                    <input
                      value={form.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
                  </>
                ) : (
                  <div className="text-gray-900">{form.gender}</div>
                )}
              </div>

              {/* Blood Type */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Blood Type</div>
                {isEditing ? (
                  <>
                    <input
                      value={form.bloodType}
                      onChange={(e) => updateField('bloodType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {errors.bloodType && <p className="text-red-600 text-sm mt-1">{errors.bloodType}</p>}
                  </>
                ) : (
                  <div className="text-gray-900">{form.bloodType}</div>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Phone</div>
                {isEditing ? (
                  <>
                    <input
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </>
                ) : (
                  <div className="text-gray-900">{form.phone}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Email</div>
                {isEditing ? (
                  <input
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                ) : (
                  <div className="text-gray-900">{form.email || '-'}</div>
                )}
              </div>

              {/* Address */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Address</div>
                {isEditing ? (
                  <input
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                ) : (
                  <div className="text-gray-900">{form.address || '-'}</div>
                )}
              </div>

              {/* Emergency */}
              <div>
                <div className="text-gray-500 text-sm mb-1">Emergency Contact</div>
                {isEditing ? (
                  <input
                    value={form.emergencyContact}
                    onChange={(e) => updateField('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                ) : (
                  <div className="text-gray-900">{form.emergencyContact || '-'}</div>
                )}
              </div>
            </div>
          </section>

          {/* Allergies */}
          <section className="mb-6">
            <SectionHeader label="Allergies" />

            {form.allergies.length > 0 && !isEditing && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-red-900">This patient has allergies — check before prescribing.</div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              {form.allergies.length > 0 ? (
                <ul className="space-y-2">
                  {form.allergies.map((a, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2">
                      <span className="text-gray-800">{a}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeListItem('allergies', idx)}
                          className="text-red-600 hover:text-red-700"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No allergies recorded</p>
              )}

              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add allergy (e.g., Penicillin)"
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addListItem('allergies', newAllergy);
                      setNewAllergy('');
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Current Medications */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">Current Medications</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              {form.currentMedications.length > 0 ? (
                <ul className="space-y-2">
                  {form.currentMedications.map((med, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2">
                      <span className="text-gray-800">{med}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeListItem('currentMedications', idx)}
                          className="text-red-600 hover:text-red-700"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No current medications</p>
              )}

              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Add medication (e.g., Metformin 500mg)"
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addListItem('currentMedications', newMedication);
                      setNewMedication('');
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
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
              {form.medicalHistory.length > 0 ? (
                <ul className="space-y-2">
                  {form.medicalHistory.map((h, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2">
                      <span className="text-gray-800">{h}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeListItem('medicalHistory', idx)}
                          className="text-red-600 hover:text-red-700"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No medical history recorded</p>
              )}

              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={newHistory}
                    onChange={(e) => setNewHistory(e.target.value)}
                    placeholder="Add history (e.g., Hypertension 2019)"
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addListItem('medicalHistory', newHistory);
                      setNewHistory('');
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Diagnoses */}
          {!isCreateMode && (
            <section className="mb-6">
              <h3 className="text-gray-900 mb-4">Diagnoses</h3>
              <div className="space-y-3">
                {form.diagnoses.length > 0 ? (
                  form.diagnoses.map((diagnosis, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-gray-900">{diagnosis.condition}</div>
                        <div className="text-gray-500 text-sm">{diagnosis.date}</div>
                      </div>
                      <div className="text-gray-600 text-sm">By: {diagnosis.doctor}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No diagnoses recorded</p>
                )}
              </div>
            </section>
          )}

          {/* Immunizations */}
          {!isCreateMode && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Syringe className="w-5 h-5 text-purple-600" />
                <h3 className="text-gray-900">Immunizations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.immunizations.length > 0 ? (
                  form.immunizations.map((immunization, idx) => (
                    <div key={idx} className="bg-purple-50 rounded-lg p-3">
                      <div className="text-gray-900">{immunization.vaccine}</div>
                      <div className="text-gray-600 text-sm">{immunization.date}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No immunizations recorded</p>
                )}
              </div>
            </section>
          )}

          {/* Lab Results */}
          {!isCreateMode && (
            <section className="mb-2">
              <div className="flex items-center gap-2 mb-4">
                <TestTube className="w-5 h-5 text-orange-600" />
                <h3 className="text-gray-900">Recent Lab Results</h3>
              </div>

              <div className="space-y-3">
                {form.labResults.length > 0 ? (
                  form.labResults.map((lab, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-gray-900">{lab.test}</div>
                          <div className="text-gray-700 mt-1">{lab.result}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500 text-sm mb-1">{lab.date}</div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              lab.status === 'Normal'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {lab.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No lab results recorded</p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        {canEdit && isEditing && (
          <div className="border-t border-gray-200 p-6 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Record
            </button>
            <button
              onClick={() => {
                setForm(patient);
                setErrors({});
                setIsEditing(false);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {!isEditing && (
          <div className="border-t border-gray-200 p-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
