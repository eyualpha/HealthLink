import { useEffect, useState } from 'react';
import SearchableSelect from './SearchableSelect';

export interface AppointmentForm {
  doctor: string;
  type: string;
  date: string;
  time: string;
  reason?: string;
  location?: string;
}

interface BookAppointmentModalProps {
  open: boolean;
  initial?: Partial<AppointmentForm>;
  doctorOptions?: string[];
  onClose: () => void;
  onSubmit: (data: AppointmentForm) => void;
}

export default function BookAppointmentModal({ open, initial, onClose, onSubmit }: BookAppointmentModalProps) {
  const [form, setForm] = useState<AppointmentForm>({
    doctor: initial?.doctor || '',
    type: initial?.type || '',
    date: initial?.date || '',
    time: initial?.time || '',
    reason: initial?.reason || '',
    location: initial?.location || '',
  });

  useEffect(() => {
    if (open) {
      // reset form when modal opens
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        doctor: initial?.doctor || '',
        type: initial?.type || '',
        date: initial?.date || '',
        time: initial?.time || '',
        reason: initial?.reason || '',
        location: initial?.location || '',
      });
    }
  }, [open, initial]);

  if (!open) return null;

  const canSubmit = form.doctor.trim() !== '' && form.date.trim() !== '' && form.time.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">Book Appointment</h2>
            <p className="text-blue-100 text-sm">Schedule a new appointment with your provider</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Doctor</label>
            <SearchableSelect
              id="doctor-select"
              options={initial && initial.doctor ? [initial.doctor] : [
                'Dr. Abebe Kebede',
                'Dr. Solomon Tesfaye',
                'Dr. Maya Alemu',
                'Dr. John Doe',
              ]}
              value={form.doctor}
              onChange={(val: string) => setForm((s) => ({ ...s, doctor: val }))}
              placeholder="Select doctor or type name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((s) => ({ ...s, time: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm mb-1 block">Type</label>
            <input
              value={form.type}
              onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
              placeholder="e.g., Follow-up, Consultation"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm mb-1 block">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
              placeholder="Room or clinic"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm mb-1 block">Reason / Notes</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={() => canSubmit && onSubmit(form)}
            className={`flex-1 py-3 rounded-lg transition-colors ${canSubmit ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500'}`}>
            Confirm Booking
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
