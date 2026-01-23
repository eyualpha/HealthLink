import { useState } from "react";
import type { User } from "../types";
import { DashboardLayout } from "./DashboardLayout";
import {
  Calendar,
  Users,
  ClipboardList,
  UserPlus,
} from "lucide-react";

type ReceptionView = "overview" | "appointments" | "checkins" | "registration";

interface ReceptionDashboardProps {
  user: User;
  onLogout: () => void;
  onShowNotifications: () => void;
  overviewStats?: {
    appointmentsToday: number;
    checkedInToday: number;
    pendingRegistrations: number;
  };
  todayQueue?: TodayQueueItem[];
  todayAppointments?: ReceptionAppointment[];
  recentCheckins?: RecentCheckin[];
  onRegisterPatient?: (data: PatientRegistrationData) => Promise<void> | void;
}

export interface TodayQueueItem {
  patient: string;
  patientId: string;
  doctor: string;
  time: string;
  status: "Checked-in" | "Waiting" | "Not arrived";
}

export interface ReceptionAppointment {
  time: string;
  patient: string;
  patientId: string;
  doctor: string;
  status: "Checked-in" | "Waiting" | "Not arrived";
}

export interface RecentCheckin {
  patient: string;
  patientId: string;
  time: string;
  doctor: string;
}

export interface PatientRegistrationData {
  firstName: string;
  middleName?: string;
  lastName: string;
  patientId?: string;
  phone: string;
  altPhone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  visitReason?: string;
  visitType?: string;
  preferredDoctor?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  hasInsurance?: string; // "Yes"/"No"
  allergies?: string;
  currentMedications?: string;
}

export function ReceptionDashboard({
  user,
  onLogout,
  onShowNotifications,
  overviewStats,
  todayQueue = [],
  todayAppointments = [],
  recentCheckins = [],
  onRegisterPatient,
}: ReceptionDashboardProps) {
  const [activeView, setActiveView] = useState<ReceptionView>("overview");

  const menuItems = [
    { id: "overview" as ReceptionView, label: "Overview", icon: Calendar },
    { id: "appointments" as ReceptionView, label: "Appointments", icon: ClipboardList },
    { id: "checkins" as ReceptionView, label: "Check-ins", icon: Users },
    { id: "registration" as ReceptionView, label: "Register Patient", icon: UserPlus },
  ];

  const fallbackOverview = {
    appointmentsToday: 24,
    checkedInToday: 16,
    pendingRegistrations: 3,
  };

  const stats = overviewStats ?? fallbackOverview;

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as ReceptionView)}
      onShowNotifications={onShowNotifications}
    >
      {activeView === "overview" && (
        <ReceptionOverview stats={stats} todayQueue={todayQueue} />
      )}
      {activeView === "appointments" && (
        <ReceptionAppointments appointments={todayAppointments} />
      )}
      {activeView === "checkins" && (
        <ReceptionCheckIns checkins={recentCheckins} />
      )}
      {activeView === "registration" && (
        <AdvancedPatientRegistration onRegister={onRegisterPatient} />
      )}
    </DashboardLayout>
  );
}

function ReceptionOverview({
  stats,
  todayQueue,
}: {
  stats: { appointmentsToday: number; checkedInToday: number; pendingRegistrations: number };
  todayQueue: TodayQueueItem[];
}) {
  const queue =
    todayQueue.length > 0
      ? todayQueue
      : [
          {
            patient: "Alemayehu Girma",
            patientId: "P001",
            doctor: "Dr. Abebe Kebede",
            time: "09:30 AM",
            status: "Checked-in",
          },
          {
            patient: "Sara Mohammed",
            patientId: "P002",
            doctor: "Dr. Solomon Tesfaye",
            time: "10:00 AM",
            status: "Waiting",
          },
        ];

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Reception Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-500 mb-1">Appointments Today</div>
          <div className="text-gray-900 text-2xl font-semibold">
            {stats.appointmentsToday}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-500 mb-1">Patients Checked-in</div>
          <div className="text-gray-900 text-2xl font-semibold">
            {stats.checkedInToday}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-500 mb-1">Pending Registrations</div>
          <div className="text-gray-900 text-2xl font-semibold">
            {stats.pendingRegistrations}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Today&apos;s Appointment Queue</h3>
        <div className="space-y-3">
          {queue.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="text-gray-900">
                  {item.patient} ({item.patientId})
                </div>
                <div className="text-gray-500 text-sm">
                  {item.time} • {item.doctor}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  item.status === "Checked-in"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Waiting"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReceptionAppointments({ appointments }: { appointments: ReceptionAppointment[] }) {
  const data =
    appointments.length > 0
      ? appointments
      : [
          {
            time: "09:30 AM",
            patient: "Alemayehu Girma",
            patientId: "P001",
            doctor: "Dr. Abebe Kebede",
            status: "Checked-in" as const,
          },
          {
            time: "10:00 AM",
            patient: "Sara Mohammed",
            patientId: "P002",
            doctor: "Dr. Solomon Tesfaye",
            status: "Waiting" as const,
          },
        ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Manage Appointments</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Calendar className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Today&apos;s Appointments</h3>
        <div className="space-y-3">
          {data.map((apt, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between border border-gray-200 rounded-lg p-4"
            >
              <div>
                <div className="text-gray-900 mb-1">
                  {apt.time} • {apt.patient} ({apt.patientId})
                </div>
                <div className="text-gray-500 text-sm">{apt.doctor}</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    apt.status === "Checked-in"
                      ? "bg-green-100 text-green-700"
                      : apt.status === "Waiting"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {apt.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Check-in
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReceptionCheckIns({ checkins }: { checkins: RecentCheckin[] }) {
  const data =
    checkins.length > 0
      ? checkins
      : [
          {
            patient: "Alemayehu Girma",
            patientId: "P001",
            time: "09:15 AM",
            doctor: "Dr. Abebe Kebede",
          },
        ];

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Patient Check-ins</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Recent Check-ins</h3>
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="text-gray-900">
                  {item.patient} ({item.patientId})
                </div>
                <div className="text-gray-500 text-sm">
                  Checked-in at {item.time} • {item.doctor}
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// advanced registration UI with grouped sections
function AdvancedPatientRegistration({
  onRegister,
}: {
  onRegister?: (data: PatientRegistrationData) => Promise<void> | void;
}) {
  const [form, setForm] = useState<PatientRegistrationData>({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    altPhone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    visitReason: "",
    visitType: "",
    preferredDoctor: "",
    insuranceProvider: "",
    insuranceNumber: "",
    hasInsurance: "",
    allergies: "",
    currentMedications: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRegister) return;
    try {
      setSubmitting(true);
      await onRegister(form);
      // optional reset
      setSubmitting(false);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Register New Patient</h2>
    
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient details */}
          <section>
            <h3 className="text-gray-900 mb-3 text-sm font-semibold uppercase tracking-wide">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Middle name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </section>

          {/* Contact & address */}
          <section>
            <h3 className="text-gray-900 mb-3 text-sm font-semibold uppercase tracking-wide">
              Contact & Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="+251 9XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt. Phone
                </label>
                <input
                  name="altPhone"
                  value={form.altPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="+251 9XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="patient@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Street / kebele / house number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="City"
                />
              </div>
            </div>
          </section>

          {/* Emergency & visit info */}
          <section>
            <h3 className="text-gray-900 mb-3 text-sm font-semibold uppercase tracking-wide">
              Emergency & Visit Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Relative / friend"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="+251 9XX XXX XXX"
                />
              </div>
        
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Doctor
                </label>
                <input
                  name="preferredDoctor"
                  value={form.preferredDoctor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Doctor name (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <input
                  name="visitReason"
                  value={form.visitReason}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Brief reason (e.g. headache, follow-up)"
                />
              </div>
            </div>
          </section>

    

          {/* Medical basics */}
          <section>
            <h3 className="text-gray-900 mb-3 text-sm font-semibold uppercase tracking-wide">
              Medical Summary (Quick)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="e.g. Penicillin, nuts, contrast agents"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                <textarea
                  name="currentMedications"
                  value={form.currentMedications}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Name, dose, frequency"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
            <button
              type="submit"
              disabled={submitting || !onRegister}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Registering..." : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
