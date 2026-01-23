import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Pill,
  Search,
  X,
} from "lucide-react";
import { getPrescriptions } from "../lib/api";

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: "Active" | "Completed" | "Cancelled";
}

const mockPrescriptions: Prescription[] = [
  {
    id: "RX001",
    patientName: "Alemayehu Girma",
    patientId: "P001",
    medication: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    duration: "90 days",
    date: "2024-01-15",
    status: "Active",
  },
  {
    id: "RX002",
    patientName: "Sara Mohammed",
    patientId: "P002",
    medication: "Albuterol Inhaler",
    dosage: "90mcg",
    frequency: "As needed",
    duration: "30 days",
    date: "2023-11-05",
    status: "Active",
  },
  {
    id: "RX003",
    patientName: "Daniel Bekele",
    patientId: "P003",
    medication: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily (evening)",
    duration: "90 days",
    date: "2023-12-20",
    status: "Active",
  },
];

function statusBadge(status: Prescription["status"]) {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "Completed") return "bg-gray-100 text-gray-700";
  return "bg-red-100 text-red-700";
}

export function Prescriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPrescription, setShowNewPrescription] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(mockPrescriptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredPrescriptions = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return (prescriptions || mockPrescriptions).filter(
      (rx) =>
        rx.patientName.toLowerCase().includes(q) ||
        rx.medication.toLowerCase().includes(q) ||
        rx.id.toLowerCase().includes(q),
    );
  }, [searchTerm, prescriptions]);

  const openDetails = (rx: Prescription) => {
    setSelectedRx(rx);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRx(null);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getPrescriptions()
      .then((res) => {
        if (!mounted) return;
        const items = res.items || res;
        const mapped = (items || []).map(
          (p: any): Prescription => ({
            id: p._id || p.id || "",
            patientName: p.patient?.name || p.patientId || "Patient",
            patientId: p.patientId || (p.patient && p.patient._id) || "",
            medication:
              Array.isArray(p.medications) && p.medications.length
                ? p.medications[0].name
                : "Medication",
            dosage:
              Array.isArray(p.medications) && p.medications.length
                ? p.medications[0].dosage
                : "",
            frequency:
              Array.isArray(p.medications) && p.medications.length
                ? p.medications[0].frequency
                : "",
            duration:
              Array.isArray(p.medications) && p.medications.length
                ? p.medications[0].duration
                : "",
            date: p.issueDate ? p.issueDate.slice(0, 10) : p.date || "",
            status: "Active",
          }),
        );
        // Always set prescriptions from backend response (allow empty array)
        setPrescriptions(mapped);
      })
      .catch((err) => {
        console.error("Failed to load prescriptions", err);
        setError("Failed to load prescriptions.");
        // on error, show no data instead of falling back to mocks
        setPrescriptions([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header: stack on mobile */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-gray-900">Prescriptions</h2>

        <button
          onClick={() => setShowNewPrescription(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Prescription
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient, medication, or prescription ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="text-gray-500 text-sm">
              Loading prescriptions...
            </div>
          )}
          {error && !loading && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              {/* MOBILE FIX: stack left/right */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="bg-purple-100 p-3 rounded-lg shrink-0">
                    <Pill className="w-6 h-6 text-purple-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="text-gray-900 font-medium break-words">
                        {rx.medication}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {rx.id}
                      </span>
                    </div>

                    <div className="text-gray-700 mb-3 break-words">
                      Patient: {rx.patientName} ({rx.patientId})
                    </div>

                    {/* Responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="rounded-lg border border-gray-200 p-3">
                        <div className="text-gray-500">Dosage</div>
                        <div className="text-gray-900">{rx.dosage}</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-3">
                        <div className="text-gray-500">Frequency</div>
                        <div className="text-gray-900">{rx.frequency}</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-3">
                        <div className="text-gray-500">Duration</div>
                        <div className="text-gray-900">{rx.duration}</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-3">
                        <div className="text-gray-500">Date Issued</div>
                        <div className="text-gray-900">{rx.date}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3 sm:gap-2 flex-wrap sm:flex-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusBadge(rx.status)}`}
                  >
                    {rx.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => openDetails(rx)}
                    className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && prescriptions.length === 0 && !error && (
            <div className="text-gray-500 text-sm text-center py-10">
              No prescriptions found.
            </div>
          )}

          {!loading &&
            prescriptions.length > 0 &&
            filteredPrescriptions.length === 0 && (
              <div className="text-gray-500 text-sm text-center py-10">
                No prescriptions match your search.
              </div>
            )}
        </div>
      </div>

      {showNewPrescription && (
        <NewPrescriptionModal onClose={() => setShowNewPrescription(false)} />
      )}

      {showDetails && (
        <PrescriptionDetailsModal rx={selectedRx} onClose={closeDetails} />
      )}
    </div>
  );
}

/* =======================
   Details Modal Component
   ======================= */
function PrescriptionDetailsModal({
  rx,
  onClose,
}: {
  rx: Prescription | null;
  onClose: () => void;
}) {
  if (!rx) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-blue-600 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-white">Prescription Details</h3>
            <div className="text-blue-100 text-sm truncate">
              {rx.medication} • {rx.id}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-gray-900 break-words">
              Patient: <span className="font-medium">{rx.patientName}</span> (
              {rx.patientId})
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm w-fit ${statusBadge(rx.status)}`}
            >
              {rx.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Info label="Medication" value={rx.medication} />
            <Info label="Prescription ID" value={rx.id} />
            <Info label="Dosage" value={rx.dosage} />
            <Info label="Frequency" value={rx.frequency} />
            <Info label="Duration" value={rx.duration} />
            <Info label="Date Issued" value={rx.date} />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-900 text-sm mb-1">Instructions</div>
            <div className="text-gray-600 text-sm">
              No extra instructions provided yet.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-gray-900 break-words">{value}</div>
    </div>
  );
}

/* =======================
   New Prescription Modal
   ======================= */
function NewPrescriptionModal({ onClose }: { onClose: () => void }) {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [medication, setMedication] = useState("");
  const [showAIAlert, setShowAIAlert] = useState(false);

  const handleMedicationChange = (med: string) => {
    setMedication(med);
    if (
      selectedPatient === "P001" &&
      med.toLowerCase().includes("penicillin")
    ) {
      setShowAIAlert(true);
    } else {
      setShowAIAlert(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between sticky top-0">
          <h3 className="text-white">Create New Prescription</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form className="p-6 space-y-6">
          {showAIAlert && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-red-900 mb-1">AI Safety Alert</div>
                  <div className="text-red-700 text-sm">
                    <strong>Allergy Conflict Detected:</strong> Patient has a
                    known allergy to Penicillin. This medication may cause
                    adverse reactions. Please review patient allergies before
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
              <option value="P001">
                Alemayehu Girma (P001) - Allergies: Penicillin, Peanuts
              </option>
              <option value="P002">
                Sara Mohammed (P002) - No known allergies
              </option>
              <option value="P003">
                Daniel Bekele (P003) - Allergies: Sulfa drugs
              </option>
            </select>
          </div>

          {selectedPatient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-blue-900 text-sm mb-1">
                    Current Medications
                  </div>
                  <div className="text-blue-700 text-sm">
                    {selectedPatient === "P001" &&
                      "Metformin 500mg, Lisinopril 10mg"}
                    {selectedPatient === "P002" && "Albuterol Inhaler"}
                    {selectedPatient === "P003" &&
                      "Atorvastatin 20mg, Aspirin 81mg"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={showAIAlert}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                showAIAlert
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {showAIAlert
                ? "Resolve Safety Alert First"
                : "Create Prescription"}
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
