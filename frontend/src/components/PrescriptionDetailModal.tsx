
import { X } from "lucide-react";

export type Prescription = {
  id: string;
  rxId: string;
  medication: string;
  patientName: string;
  patientId: string;
  dosage: string;
  frequency: string;
  duration: string;
  dateIssued: string;
  status: "Active" | "Inactive";
  instructions?: string;
  notes?: string;
};

type Props = {
  open: boolean;
  prescription: Prescription | null;
  onClose: () => void;
};

export default function PrescriptionDetailModal({ open, prescription, onClose }: Props) {
  if (!open || !prescription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      {/* modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 mx-4">
        <div className="flex items-start justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Prescription Details
            </h2>
            <p className="text-sm text-gray-500">
              {prescription.medication} • {prescription.rxId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="Patient" value={`${prescription.patientName} (${prescription.patientId})`} />
            <Info label="Status" value={prescription.status} />
            <Info label="Dosage" value={prescription.dosage} />
            <Info label="Frequency" value={prescription.frequency} />
            <Info label="Duration" value={prescription.duration} />
            <Info label="Date Issued" value={prescription.dateIssued} />
          </div>

          {prescription.instructions && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-900 mb-1">Instructions</div>
              <div className="text-sm text-gray-700">{prescription.instructions}</div>
            </div>
          )}

          {prescription.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-900 mb-1">Notes / Doctor Comment</div>
              <div className="text-sm text-gray-700">{prescription.notes}</div>
            </div>
          )}
        </div>

        <div className="p-5 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-gray-900 mt-1">{value}</div>
    </div>
  );
}
