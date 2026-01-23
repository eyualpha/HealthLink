import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "../types";
import { DashboardLayout } from "./DashboardLayout";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  X,
  Download,
  Search,
  ShieldCheck,
  Filter,
  Mail,
  Phone,
  FileText,
  Stethoscope,
  Plus,
} from "lucide-react";
import { AdminAuditLogPage } from "./audit";
import type { AuditLogEntry, AuditEventType } from "./audit";
import api from "../lib/api";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  onShowNotifications: () => void;
  accessToken?: string;
}

type AdminView =
  | "analytics"
  | "users"
  | "patients"
  | "system"
  | "reports"
  | "audit";

export function AdminDashboard({ user, onLogout, onShowNotifications }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>("patients");

  // Audit log state (mocked for now)
  const [auditEvents, setAuditEvents] = useState<AuditLogEntry[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFilters, setAuditFilters] = useState<{ search: string; action: AuditEventType | "all" }>(
    { search: "", action: "all" },
  );

  const menuItems = [
    { id: "analytics", label: "Overview", icon: TrendingUp },
    { id: "users", label: "User Management", icon: Users },
    { id: "patients", label: "Patient Records", icon: Stethoscope },
    { id: "audit", label: "Audit Log", icon: ShieldCheck },
    { id: "system", label: "System Health", icon: Activity },
    { id: "reports", label: "Reports", icon: FileText },
  ] satisfies { id: AdminView; label: string; icon: typeof Users }[];

  const fetchAuditLogs = async (_page: number, filters = auditFilters) => {
    setAuditLoading(true);
    try {
      // Mock data until backend wiring is ready
      const sample: AuditLogEntry[] = [
        {
          id: "a-1",
          timestamp: new Date().toISOString(),
          userName: "Admin User",
          userRole: "admin",
          action: "login",
          description: "Logged in to admin dashboard",
        },
        {
          id: "a-2",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          userName: "Admin User",
          userRole: "admin",
          action: "create",
          entityType: "patient",
          entityId: "P-1001",
          description: "Created patient record",
        },
        {
          id: "a-3",
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          userName: "Doctor Tadesse",
          userRole: "doctor",
          action: "update",
          entityType: "prescription",
          entityId: "RX-77",
          description: "Updated prescription dosage",
        },
      ];

      const filtered = sample.filter((e) => {
        const matchesAction = filters.action === "all" || e.action === filters.action;
        const haystack = [
          e.userName,
          e.userRole,
          e.entityType,
          e.entityId,
          e.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesSearch = haystack.includes(filters.search.toLowerCase().trim());
        return matchesAction && matchesSearch;
      });

      setAuditEvents(filtered);
      setAuditTotal(filtered.length);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs(auditPage, auditFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditPage, auditFilters]);

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      onShowNotifications={onShowNotifications}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={(view) => setActiveView(view)}
    >
      {activeView === "analytics" && <AnalyticsDashboard />}
      {activeView === "users" && <UserManagement />}
      {activeView === "patients" && <PatientRecordsAdmin />}
      {activeView === "system" && <SystemHealth />}
      {activeView === "reports" && <Reports />}
      {activeView === "audit" && (
        <AdminAuditLogPage
          events={auditEvents}
          loading={auditLoading}
          totalCount={auditTotal}
          page={auditPage}
          pageSize={20}
          onPageChange={(page) => setAuditPage(page)}
          onRefresh={() => fetchAuditLogs(auditPage, auditFilters)}
          onFilterChange={(f) => {
            setAuditFilters(f);
            setAuditPage(1);
            fetchAuditLogs(1, f);
          }}
          initialSearch={auditFilters.search}
          initialActionFilter={auditFilters.action}
        />
      )}
    </DashboardLayout>
  );
}

// ---------- existing dashboards below (unchanged apart from imports) ----------

function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <div className="text-gray-500 mb-1">Total Patients</div>
          <div className="text-gray-900">2,847</div>
          <div className="text-gray-500 text-sm mt-2">vs. last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </div>
          </div>
          <div className="text-gray-500 mb-1">Appointments This Month</div>
          <div className="text-gray-900">1,234</div>
          <div className="text-gray-500 text-sm mt-2">vs. last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-gray-600 text-sm">Stable</div>
          </div>
          <div className="text-gray-500 mb-1">Active Medical Staff</div>
          <div className="text-gray-900">142</div>
          <div className="text-gray-500 text-sm mt-2">doctors & nurses</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              -15%
            </div>
          </div>
          <div className="text-gray-500 mb-1">Avg. Wait Time</div>
          <div className="text-gray-900">18 mins</div>
          <div className="text-gray-500 text-sm mt-2">improvement</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Daily Appointments</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 62, 58, 71, 68, 85, 92].map((value, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                  style={{ height: `${(value / 100) * 100}%` }}
                ></div>
                <div className="text-gray-500 text-sm">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">System Usage</h3>
          <div className="space-y-4">
            {[
              {
                label: "Patient Records Access",
                value: 87,
                color: "bg-blue-600",
              },
              {
                label: "Appointment Scheduling",
                value: 72,
                color: "bg-green-600",
              },
              {
                label: "Prescription Management",
                value: 64,
                color: "bg-purple-600",
              },
              { label: "Lab Results Entry", value: 58, color: "bg-orange-600" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700">{item.label}</div>
                  <div className="text-gray-900">{item.value}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          {[
            {
              user: "Dr. Abebe Kebede",
              action: "Updated patient record",
              patient: "Alemayehu Girma",
              time: "5 minutes ago",
            },
            {
              user: "Nurse Tigist Alemu",
              action: "Scheduled appointment",
              patient: "Sara Mohammed",
              time: "12 minutes ago",
            },
            {
              user: "Dr. Solomon Tesfaye",
              action: "Created prescription",
              patient: "Daniel Bekele",
              time: "23 minutes ago",
            },
            {
              user: "Admin Team",
              action: "Generated monthly report",
              patient: "System",
              time: "1 hour ago",
            },
          ].map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="text-gray-900">
                  {activity.user} {activity.action.toLowerCase()}
                </div>
                <div className="text-gray-500 text-sm">
                  {activity.patient}
                </div>
              </div>
              <div className="text-gray-500 text-sm">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface UserRecord {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "Active" | "Inactive";
  department: string;
  phone?: string;
  lastActive: string;
  createdAt: string;
}

interface NewUserFormData {
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
}

type RoleFilter =
  | "all"
  | "Administrator"
  | "Doctor"
  | "Nurse"
  | "Reception"
  | "Clinician"
  | "Patient";

type StatusFilter = "all" | "Active" | "Inactive";

function UserManagement() {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState<NewUserFormData>({
    name: "",
    email: "",
    role: "Doctor",
    phone: "",
    department: "General",
  });

  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: "u-1",
      name: "Admin User",
      role: "Administrator",
      email: "admin@localhost",
      status: "Active",
      department: "Operations",
      phone: "+251 911 000 001",
      lastActive: "2026-01-17T08:10:00Z",
      createdAt: "2026-01-05T07:00:00Z",
    },
    {
      id: "u-2",
      name: "Dr. Abebe Kebede",
      role: "Doctor",
      email: "doctor@localhost",
      status: "Active",
      department: "Cardiology",
      phone: "+251 911 000 002",
      lastActive: "2026-01-17T11:00:00Z",
      createdAt: "2026-01-07T08:00:00Z",
    },
    {
      id: "u-3",
      name: "Nurse Tigist Alemu",
      role: "Nurse",
      email: "nurse@localhost",
      status: "Active",
      department: "Outpatient",
      phone: "+251 911 000 003",
      lastActive: "2026-01-16T15:00:00Z",
      createdAt: "2026-01-09T08:00:00Z",
    },
    {
      id: "u-4",
      name: "Reception User",
      role: "Reception",
      email: "reception@localhost",
      status: "Active",
      department: "Front Desk",
      phone: "+251 911 000 004",
      lastActive: "2026-01-15T13:00:00Z",
      createdAt: "2026-01-10T08:00:00Z",
    },
    {
      id: "u-5",
      name: "Clinician User",
      role: "Clinician",
      email: "clinician@localhost",
      status: "Active",
      department: "Diagnostics",
      phone: "+251 911 000 005",
      lastActive: "2026-01-12T12:00:00Z",
      createdAt: "2026-01-12T08:00:00Z",
    },
    {
      id: "u-6",
      name: "Patient Seeded",
      role: "Patient",
      email: "patient@localhost",
      status: "Inactive",
      department: "Patient",
      phone: "+251 911 000 006",
      lastActive: "2026-01-03T09:00:00Z",
      createdAt: "2025-12-12T08:00:00Z",
    },
  ]);

  const [filters, setFilters] = useState<{
    search: string;
    role: RoleFilter;
    status: StatusFilter;
  }>({ search: "", role: "all", status: "all" });

  const reportRef = useRef<HTMLDivElement>(null);

  const roleOptions: RoleFilter[] = [
    "all",
    "Administrator",
    "Doctor",
    "Nurse",
    "Reception",
    "Clinician",
    "Patient",
  ];

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === "Active").length;
    const inactive = users.length - active;
    const now = new Date();
    const createdThisMonth = users.filter((u) => {
      const d = new Date(u.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
    return { total: users.length, active, inactive, createdThisMonth };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return users
      .filter((u) =>
        [u.name, u.email, u.role, u.department]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .filter((u) => (filters.role === "all" ? true : u.role === filters.role))
      .filter((u) => (filters.status === "all" ? true : u.status === filters.status))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, filters]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID ? crypto.randomUUID() : `u-${Date.now()}`;
    const now = new Date().toISOString();
    const record: UserRecord = {
      id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      department: newUser.department || "General",
      phone: newUser.phone,
      lastActive: now,
      createdAt: now,
    };
    setUsers((prev) => [record, ...prev]);
    setNewUser({ name: "", email: "", role: "Doctor", phone: "", department: "General" });
    setShowAddUserForm(false);
    alert("User added successfully!");
  };

  const handleDownloadPdf = () => {
    if (!reportRef.current) return;
    const printable = reportRef.current.innerHTML;
    const popup = window.open("", "_blank", "width=900,height=1100,noopener");
    if (!popup) {
      alert("Please allow pop-ups to download the PDF report.");
      return;
    }
    popup.document.write(`
      <html>
        <head>
          <title>User Management Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin: 0 0 12px 0; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px; }
            .card { border: 1px solid #e5e7eb; padding: 12px; border-radius: 10px; background: #f8fafc; }
            .muted { color: #64748b; font-size: 12px; margin: 0 0 4px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 10px; font-size: 13px; text-align: left; }
            th { background: #f1f5f9; }
            .pill { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 12px; }
            .pill-active { background: #e0f2fe; color: #0369a1; }
            .pill-inactive { background: #fef9c3; color: #854d0e; }
          </style>
        </head>
        <body>
          ${printable}
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  const renderStatusPill = (status: UserRecord["status"]) => (
    <span
      className={`px-3 py-1 rounded-full text-sm ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {status}
    </span>
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm">
            Manage users, roles, and export auditable reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download PDF Report
          </button>
          <button
            onClick={() => setShowAddUserForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            Add New User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Total users</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">Across all roles</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Active</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.active}</div>
          <div className="text-xs text-green-600 mt-1">Eligible to log in</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Inactive</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.inactive}</div>
          <div className="text-xs text-amber-600 mt-1">Require review</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Created this month</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.createdThisMonth}</div>
          <div className="text-xs text-gray-500 mt-1">Newly provisioned</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search by name, email, role, department"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filters.role}
              onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value as RoleFilter }))}
              className="bg-transparent focus:outline-none text-gray-700"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? "All roles" : r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as StatusFilter }))}
              className="bg-transparent focus:outline-none text-gray-700"
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-gray-700">Department</th>
                <th className="text-left py-3 px-4 text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-gray-700">Last active</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userRow) => (
                <tr key={userRow.id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-gray-900 font-medium">{userRow.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {userRow.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{userRow.department}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {userRow.email}
                    </div>
                    {userRow.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Phone className="w-3 h-3" />
                        {userRow.phone}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">{renderStatusPill(userRow.status)}</td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(userRow.lastActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        ref={reportRef}
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        aria-hidden
      >
        <h1>User Management Report</h1>
        <div className="summary">
          <div className="card">
            <p className="muted">Total users</p>
            <strong>{stats.total}</strong>
          </div>
          <div className="card">
            <p className="muted">Active</p>
            <strong>{stats.active}</strong>
          </div>
          <div className="card">
            <p className="muted">Inactive</p>
            <strong>{stats.inactive}</strong>
          </div>
          <div className="card">
            <p className="muted">Created this month</p>
            <strong>{stats.createdThisMonth}</strong>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last active</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.department}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`pill ${u.status === "Active" ? "pill-active" : "pill-inactive"}`}>
                    {u.status}
                  </span>
                </td>
                <td>{formatDate(u.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddUserForm && (
        <div
          onClick={() => setShowAddUserForm(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New User
              </h3>
              <button
                onClick={() => setShowAddUserForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="user@healthlink.et"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Reception">Reception</option>
                    <option value="Clinician">Clinician</option>
                    <option value="Patient">Patient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={newUser.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Cardiology, Ops, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="+251 9XX XXX XXX"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type PatientStatus = "Active" | "Follow-up" | "Discharged";
type PatientRisk = "High" | "Medium" | "Low";

type PatientForm = {
  name: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  allergies: string;
};

interface PatientRow {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  status: PatientStatus;
  risk: PatientRisk;
  lastVisit: string;
  primaryCondition: string;
  allergies?: string;
}

function PatientRecordsAdmin() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PatientStatus>("all");
  const [riskFilter, setRiskFilter] = useState<"all" | PatientRisk>("all");
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<PatientForm>({
    name: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    allergies: "",
  });
  const reportRef = useRef<HTMLDivElement>(null);

  type PatientDoc = Partial<PatientRow> & {
    _id?: string;
    id?: string;
    dob?: string;
    contact?: { phone?: string; email?: string };
    medicalHistory?: string[];
    allergies?: string[];
    updatedAt?: string;
    createdAt?: string;
    bloodType?: string;
    gender?: string;
    name?: string;
  };

  const mapPatient = (doc: PatientDoc): PatientRow => {
    const age = doc.dob
      ? Math.max(0, new Date().getFullYear() - new Date(doc.dob).getFullYear())
      : 0;
    const allergiesStr = Array.isArray(doc.allergies)
      ? doc.allergies.join(", ") || "None"
      : "None";
    const risk: PatientRisk = doc.allergies && doc.allergies.length > 0
      ? "Medium"
      : "Low";
    return {
      id: doc._id || doc.id || "",
      name: doc.name || "Unnamed",
      age,
      gender: doc.gender || "-",
      bloodType: doc.bloodType || "-",
      phone: doc.contact?.phone || "-",
      email: doc.contact?.email || "-",
      address: doc.address || "-",
      status: "Active",
      risk,
      lastVisit: doc.updatedAt || doc.createdAt || "",
      primaryCondition: doc.medicalHistory?.[0] || "N/A",
      allergies: allergiesStr,
    };
  };

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPatients({ q: search, limit: 100 });
      const items = (data as { items?: PatientDoc[] }).items ?? (data as PatientDoc[]);
      setPatients(items.map(mapPatient));
    } catch (err) {
      console.error("Failed to load patients", err);
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const stats = useMemo(() => {
    const total = patients.length;
    const active = patients.filter((p) => p.status === "Active").length;
    const followUp = patients.filter((p) => p.status === "Follow-up").length;
    const highRisk = patients.filter((p) => p.risk === "High").length;
    return { total, active, followUp, highRisk };
  }, [patients]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return patients
      .filter((p) =>
        [p.name, p.email, p.id, p.primaryCondition]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .filter((p) => (statusFilter === "all" ? true : p.status === statusFilter))
      .filter((p) => (riskFilter === "all" ? true : p.risk === riskFilter))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [patients, search, statusFilter, riskFilter]);

  const formatDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  const renderPill = (label: string, tone: "blue" | "amber" | "red" | "green") => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    const map = {
      blue: "bg-blue-100 text-blue-700",
      amber: "bg-amber-100 text-amber-800",
      red: "bg-red-100 text-red-700",
      green: "bg-green-100 text-green-700",
    } as const;
    return <span className={`${base} ${map[tone]}`}>{label}</span>;
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        gender: form.gender || "other",
        contact: { phone: form.phone, email: form.email },
        address: form.address,
        allergies: form.allergies
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };
      const created = await api.createPatient(payload);
      setPatients((prev) => [mapPatient(created as PatientDoc), ...prev]);
      setShowAdd(false);
      setForm({ name: "", gender: "", phone: "", email: "", address: "", allergies: "" });
    } catch (err) {
      alert("Could not create patient. Check permissions and try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this patient record?")) return;
    try {
      await api.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Could not delete patient. Check permissions and try again.");
      console.error(err);
    }
  };

  const handleDownloadPdf = () => {
    if (!reportRef.current) return;
    const printable = reportRef.current.innerHTML;
    const popup = window.open("", "_blank", "width=900,height=1100,noopener");
    if (!popup) {
      alert("Please allow pop-ups to download the PDF report.");
      return;
    }
    popup.document.write(`
      <html>
        <head>
          <title>Patient Records Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin: 0 0 12px 0; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px; }
            .card { border: 1px solid #e5e7eb; padding: 12px; border-radius: 10px; background: #f8fafc; }
            .muted { color: #64748b; font-size: 12px; margin: 0 0 4px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 10px; font-size: 13px; text-align: left; }
            th { background: #f1f5f9; }
            .pill { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 12px; }
            .pill-high { background: #fee2e2; color: #b91c1c; }
            .pill-medium { background: #fef3c7; color: #b45309; }
            .pill-low { background: #e0f2fe; color: #0c4a6e; }
            .pill-status { background: #e2e8f0; color: #0f172a; }
          </style>
        </head>
        <body>
          ${printable}
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-gray-900">Patient Records</h2>
          <p className="text-gray-500 text-sm">
            Track patient profiles, risk, follow-ups, and export an auditable PDF snapshot.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Patient
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download PDF Report
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Total patients</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">Across all statuses</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Active</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.active}</div>
          <div className="text-xs text-green-600 mt-1">Currently under care</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Follow-ups due</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.followUp}</div>
          <div className="text-xs text-blue-600 mt-1">Need scheduling</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">High-risk</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.highRisk}</div>
          <div className="text-xs text-red-600 mt-1">Monitor closely</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email, or condition"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | PatientStatus)}
              className="bg-transparent focus:outline-none text-gray-700"
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as "all" | PatientRisk)}
              className="bg-transparent focus:outline-none text-gray-700"
            >
              <option value="all">All risk levels</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-700">Patient ID</th>
                <th className="text-left py-3 px-4 text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-gray-700">Risk</th>
                <th className="text-left py-3 px-4 text-gray-700">Primary condition</th>
                <th className="text-left py-3 px-4 text-gray-700">Last visit</th>
                <th className="text-left py-3 px-4 text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    Loading patients...
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-gray-900 font-medium">{p.id}</td>
                  <td className="py-3 px-4 text-gray-900">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                      <div>
                        <div>{p.name}</div>
                        <div className="text-xs text-gray-500">
                          {p.gender} • {p.age} yrs • {p.bloodType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {renderPill(p.status, p.status === "Active" ? "green" : p.status === "Follow-up" ? "blue" : "amber")}
                  </td>
                  <td className="py-3 px-4">
                    {renderPill(
                      p.risk,
                      p.risk === "High" ? "red" : p.risk === "Medium" ? "amber" : "blue",
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{p.primaryCondition}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Allergies: {p.allergies || "None"}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{formatDate(p.lastVisit)}</td>
                  <td className="py-3 px-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {p.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Phone className="w-3 h-3" />
                      {p.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No patients match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        ref={reportRef}
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        aria-hidden
      >
        <h1>Patient Records Report</h1>
        <div className="summary">
          <div className="card">
            <p className="muted">Total patients</p>
            <strong>{stats.total}</strong>
          </div>
          <div className="card">
            <p className="muted">Active</p>
            <strong>{stats.active}</strong>
          </div>
          <div className="card">
            <p className="muted">Follow-up</p>
            <strong>{stats.followUp}</strong>
          </div>
          <div className="card">
            <p className="muted">High-risk</p>
            <strong>{stats.highRisk}</strong>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Condition</th>
              <th>Last visit</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.name} ({p.gender}, {p.age} yrs, {p.bloodType})
                </td>
                <td className="pill pill-status">{p.status}</td>
                <td
                  className={`pill ${p.risk === "High" ? "pill-high" : p.risk === "Medium" ? "pill-medium" : "pill-low"}`}
                >
                  {p.risk}
                </td>
                <td>{p.primaryCondition}</td>
                <td>{formatDate(p.lastVisit)}</td>
                <td>
                  {p.email} | {p.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div
          onClick={() => setShowAdd(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Patient
              </h3>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f: PatientForm) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f: PatientForm) => ({ ...f, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f: PatientForm) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="+251 9XX XXX XXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f: PatientForm) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="user@healthlink.et"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm((f: PatientForm) => ({ ...f, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="City, area"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={(e) => setForm((f: PatientForm) => ({ ...f, allergies: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Peanuts, Penicillin, etc."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">System Health</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-700 mb-2">Server Status</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="text-gray-900">Operational</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-700 mb-2">Database Status</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="text-gray-900">Healthy</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-700 mb-2">API Response Time</div>
          <div className="text-gray-900">124ms</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Audit Logs (Summary)</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-700">
                  User access: Dr. Abebe Kebede accessed patient record P00
                  {i + 1}
                </div>
                <div className="text-gray-500">
                  2024-01-15 {10 + i}:{15 + i}:00
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          View the full audit log in the Audit Log tab.
        </p>
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Monthly Patient Report",
            date: "January 2024",
            type: "Patient Analytics",
          },
          {
            title: "Appointment Statistics",
            date: "Q4 2023",
            type: "Operations",
          },
          {
            title: "Prescription Summary",
            date: "December 2023",
            type: "Clinical",
          },
          {
            title: "System Usage Report",
            date: "January 2024",
            type: "Technical",
          },
        ].map((report, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-gray-900 mb-2">{report.title}</h3>
            <div className="text-gray-600 text-sm mb-4">{report.date}</div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {report.type}
              </span>
              <button className="text-blue-600 hover:text-blue-700">
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
