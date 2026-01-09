import { useEffect, useState } from 'react';
import type { User } from '../types';

interface EditableProfileModalProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onSave: (u: User) => void;
}

export default function EditableProfileModal({ open, user, onClose, onSave }: EditableProfileModalProps) {
  const [form, setForm] = useState<User>(user);

  useEffect(() => {
    if (!open) return;

    // Only update when different to avoid cascading renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (
      user.id !== form.id ||
      user.name !== form.name ||
      user.email !== form.email ||
      user.address !== form.address ||
      user.phone !== form.phone ||
      user.notes !== form.notes
    ) {
      setForm(user);
    }
    // note: intentionally do not include `form` in deps to avoid effect loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">Edit Profile</h2>
            <p className="text-blue-100 text-sm">Update your personal information</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm mb-1 block">Address</label>
            <input
              value={form.address || ''}
              onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Phone</label>
              <input
                value={form.phone || ''}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Email</label>
              <input
                value={form.email || ''}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm mb-1 block">Additional Notes</label>
            <textarea
              value={form.notes || ''}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={() => onSave(form)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}
