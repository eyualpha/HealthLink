import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Plus, Search, User, X, FileText } from "lucide-react";
import { getAppointments } from "../lib/api";

interface AppointmentsProps {
  userRole: "doctor" | "nurse" | "patient";
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "In Progress";
  notes?: string;
}

const initialAppointments: Appointment[] = [
  {
    id: "APT001",
    patientName: "Alemayehu Girma",
    doctorName: "Dr. Abebe Kebede",
    date: "2024-01-15",
    time: "09:00",
    type: "Follow-up",
    status: "Completed",
    notes: "Diabetes check-up",
  },
  {
    id: "APT002",
    patientName: "Sara Mohammed",
    doctorName: "Dr. Abebe Kebede",
    date: "2024-01-15",
    time: "10:00",
    type: "New Patient",
    status: "In Progress",
  },
  {
    id: "APT003",
    patientName: "Daniel Bekele",
    doctorName: "Dr. Abebe Kebede",
    date: "2024-01-15",
    time: "11:30",
    type: "Check-up",
    status: "Scheduled",
  },
  {
    id: "APT004",
    patientName: "Hiwot Tadesse",
    doctorName: "Dr. Abebe Kebede",
    date: "2024-01-15",
    time: "14:00",
    type: "Consultation",
    status: "Scheduled",
  },
  {
    id: "APT005",
    patientName: "Mekdes Hailu",
    doctorName: "Dr. Abebe Kebede",
    date: "2024-01-16",
    time: "09:30",
    type: "Follow-up",
    status: "Scheduled",
  },
];

function formatTimeHHmmToAMPM(hhmm: string) {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  const mm = String(m).padStart(2, "0");
  return `${String(hour12).padStart(2, "0")}:${mm} ${suffix}`;
}

function nextId(existing: Appointment[]) {
  const nums = existing
    .map((a) => a.id.replace("APT", ""))
    .map((n) => Number(n))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `APT${String(max + 1).padStart(3, "0")}`;
}

function statusBadge(status: Appointment["status"]) {
  if (status === "Completed") return "bg-green-100 text-green-700";
  if (status === "In Progress") return "bg-blue-100 text-blue-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-gray-200 text-gray-700";
}

export function Appointments({ userRole }: AppointmentsProps) {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showNewModal, setShowNewModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || apt.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, filterStatus]);

  const openDetails = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowDetailsModal(true);
  };

  const openReschedule = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowRescheduleModal(true);
  };

  const cancelAppointment = (apt: Appointment) => {
    setAppointments((prev) =>
      prev.map((x) => (x.id === apt.id ? { ...x, status: "Cancelled" } : x)),
    );
  };

  const addAppointment = (data: Omit<Appointment, "id" | "status">) => {
    setAppointments((prev) => [
      {
        id: nextId(prev),
        status: "Scheduled",
        ...data,
      },
      ...prev,
    ]);
  };

  const rescheduleAppointment = (id: string, date: string, time: string) => {
    setAppointments((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              date,
              time,
              status: x.status === "Cancelled" ? "Scheduled" : x.status,
            }
          : x,
      ),
    );
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAppointments({});
        const items = res.items || res;
        const mapped: Appointment[] = (items || []).map(
          (a: any): Appointment => {
            const statusRaw = (a.status || "Scheduled").toString();
            const statusCap =
              statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
            return {
              id: a._id || a.id || "APT",
              patientName:
                a.patientName || a.patient?.name || a.patientId || "Patient",
              doctorName: a.doctorName || a.doctorId || "Doctor",
              date: a.appointementDate?.slice(0, 10) || a.date || "",
              time: a.appointementTime || a.time || "09:00",
              type: a.appointementType || a.type || "Appointment",
              status: ([
                "Scheduled",
                "Completed",
                "Cancelled",
                "In Progress",
              ].includes(statusCap)
                ? statusCap
                : "Scheduled") as Appointment["status"],
              notes: a.notes,
            };
          },
        );
        if (mapped.length) {
          setAppointments(mapped);
        }
      } catch (err) {
        console.error("Failed to load appointments", err);
        setError("Failed to load appointments. Showing sample data.");
        setAppointments(initialAppointments);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header: stack on mobile */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-gray-900">Appointments</h2>

        {(userRole === "doctor" || userRole === "nurse") && (
          <button
            onClick={() => setShowNewModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Schedule Appointment
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Filters: already good, just keep padding responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
          {loading && (
            <div className="text-gray-500 text-sm">Loading appointments...</div>
          )}
          {error && !loading && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              {/* ✅ MOBILE FIX: stack left/right on small screens */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left section */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-gray-900 mb-1 font-medium break-words">
                      {appointment.patientName}
                    </div>
                    <div className="text-gray-600 text-sm mb-2">
                      {appointment.type}
                    </div>

                    {/* ✅ better wrap on mobile */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeHHmmToAMPM(appointment.time)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        • {appointment.doctorName}
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-600 break-words">
                        Notes: {appointment.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right section */}
                <div className="flex flex-col gap-3 sm:items-end">
                  {/* status */}
                  <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${statusBadge(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      #{appointment.id}
                    </span>
                  </div>

                  {/* ✅ actions wrap instead of overflowing */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
                    <button
                      onClick={() => openDetails(appointment)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      View Details
                    </button>

                    {userRole !== "patient" && (
                      <>
                        <button
                          onClick={() => openReschedule(appointment)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => cancelAppointment(appointment)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-10">
              No appointments found.
            </div>
          )}
        </div>
      </div>

      {showNewModal && (
        <NewAppointmentModal
          onClose={() => setShowNewModal(false)}
          onCreate={(data) => {
            addAppointment(data);
            setShowNewModal(false);
          }}
        />
      )}

      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={() => setShowRescheduleModal(false)}
          onSave={(date, time) => {
            rescheduleAppointment(selectedAppointment.id, date, time);
            setShowRescheduleModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}

/* =========================
   Modals
   ========================= */

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h3 className="text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function NewAppointmentModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: Omit<Appointment, "id" | "status">) => void;
}) {
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Abebe Kebede");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Check-up");
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !date || !time) return;

    onCreate({
      patientName: patientName.trim(),
      doctorName,
      date,
      time,
      type,
      notes: notes.trim() ? notes.trim() : undefined,
    });
  };

  return (
    <ModalShell title="Schedule New Appointment" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Patient Name</label>
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Mekdes Hailu"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Doctor</label>
          <select
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Dr. Abebe Kebede</option>
            <option>Dr. Tigist Alemu</option>
            <option>Dr. Solomon Tesfaye</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Time</label>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Appointment Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Check-up</option>
            <option>Follow-up</option>
            <option>New Patient</option>
            <option>Consultation</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any notes..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Schedule
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Demo mode: this saves to local state only (no backend yet).
        </p>
      </form>
    </ModalShell>
  );
}

function RescheduleModal({
  appointment,
  onClose,
  onSave,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSave: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    onSave(date, time);
  };

  return (
    <ModalShell title="Reschedule Appointment" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
          <div className="text-gray-900">{appointment.patientName}</div>
          <div className="text-gray-600">
            Current: {appointment.date} •{" "}
            {formatTimeHHmmToAMPM(appointment.time)}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">New Date</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">New Time</label>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
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
    </ModalShell>
  );
}

function AppointmentDetailsModal({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  return (
    <ModalShell title="Appointment Details" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-gray-500">Appointment ID</div>
            <div className="text-gray-900">{appointment.id}</div>
          </div>
          <div>
            <div className="text-gray-500">Status</div>
            <div className="text-gray-900">{appointment.status}</div>
          </div>
          <div>
            <div className="text-gray-500">Patient</div>
            <div className="text-gray-900">{appointment.patientName}</div>
          </div>
          <div>
            <div className="text-gray-500">Doctor</div>
            <div className="text-gray-900">{appointment.doctorName}</div>
          </div>
          <div>
            <div className="text-gray-500">Date</div>
            <div className="text-gray-900">{appointment.date}</div>
          </div>
          <div>
            <div className="text-gray-500">Time</div>
            <div className="text-gray-900">
              {formatTimeHHmmToAMPM(appointment.time)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-gray-500">Type</div>
          <div className="text-gray-900">{appointment.type}</div>
        </div>

        <div>
          <div className="text-gray-500">Notes</div>
          <div className="text-gray-900">
            {appointment.notes ? appointment.notes : "—"}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </ModalShell>
  );
}
