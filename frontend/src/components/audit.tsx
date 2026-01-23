import { useMemo, useState } from "react";
import { Search, Filter, RefreshCcw, Clock, User, Activity } from "lucide-react";

export type AuditEventType =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "permission"
  | "other";

export interface AuditLogEntry {
  id: string;
  timestamp: string; // backend sends ISO or date; you can keep as string
  userName: string;
  userRole?: string;
  action: AuditEventType;
  entityType?: string;
  entityId?: string;
  description?: string;
  ipAddress?: string;
}

interface AdminAuditLogPageProps {
  events: AuditLogEntry[];
  loading?: boolean;
  totalCount?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
  onFilterChange?: (filters: {
    search: string;
    action: AuditEventType | "all";
  }) => void;
  initialSearch?: string;
  initialActionFilter?: AuditEventType | "all";
}

export function AdminAuditLogPage({
  events,
  loading = false,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onRefresh,
  onFilterChange,
  initialSearch = "",
  initialActionFilter = "all",
}: AdminAuditLogPageProps) {
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [actionFilter, setActionFilter] =
    useState<AuditEventType | "all">(initialActionFilter);

  const totalPages =
    totalCount && pageSize ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;

  const filteredEvents = useMemo(() => {
    const search = localSearch.trim().toLowerCase();
    return events.filter((e) => {
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (!search) return true;
      const haystack = [
        e.userName,
        e.userRole,
        e.entityType,
        e.entityId,
        e.description,
        e.ipAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }, [events, localSearch, actionFilter]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFilterChange?.({ search: value, action: actionFilter });
  };

  const handleActionFilterChange = (value: AuditEventType | "all") => {
    setActionFilter(value);
    onFilterChange?.({ search: localSearch, action: value });
  };

  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const effectiveTotal = totalCount ?? filteredEvents.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-gray-900 text-lg sm:text-xl">Audit Log</h2>
          <p className="text-sm text-gray-500">
            Track all important actions performed inside the system.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs uppercase text-gray-500 tracking-wide">
              Total Events
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {effectiveTotal}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-xs uppercase text-gray-500 tracking-wide">
              Users Involved
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {new Set(filteredEvents.map((e) => e.userName)).size}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-xs uppercase text-gray-500 tracking-wide">
              Page
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {page} / {totalPages}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by user, entity, IP, description..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={actionFilter}
              onChange={(e) =>
                handleActionFilterChange(
                  e.target.value as AuditEventType | "all",
                )
              }
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All actions</option>
              <option value="login">Logins</option>
              <option value="logout">Logouts</option>
              <option value="create">Creates</option>
              <option value="update">Updates</option>
              <option value="delete">Deletes</option>
              <option value="permission">Permission changes</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center text-gray-500">
            Loading audit events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center text-gray-500">
            No audit events to display.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {formatAuditTime(event.timestamp)}
                </div>
                <ActionBadge action={event.action} />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {event.userName}
                </div>
                {event.userRole && (
                  <div className="text-xs text-gray-500">{event.userRole}</div>
                )}
              </div>
              <div className="text-sm text-gray-700">
                {event.entityType ? (
                  <>
                    {event.entityType}
                    {event.entityId && (
                      <span className="text-gray-400">
                        {" "}
                        • {event.entityId}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">No target</span>
                )}
              </div>
              {event.description && (
                <div className="text-sm text-gray-600">{event.description}</div>
              )}
              <div className="text-xs text-gray-400">
                IP: {event.ipAddress ?? "Unknown"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="text-left py-3 px-4">Time</th>
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Action</th>
              <th className="text-left py-3 px-4">Target</th>
              <th className="text-left py-3 px-4">IP Address</th>
              <th className="text-left py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  className="py-6 px-4 text-center text-gray-500"
                  colSpan={6}
                >
                  Loading audit events...
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td
                  className="py-6 px-4 text-center text-gray-500"
                  colSpan={6}
                >
                  No audit events to display.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                    {formatAuditTime(event.timestamp)}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    <div className="flex flex-col">
                      <span>{event.userName}</span>
                      {event.userRole && (
                        <span className="text-xs text-gray-400">
                          {event.userRole}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <ActionBadge action={event.action} />
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {event.entityType ? (
                      <span>
                        {event.entityType}
                        {event.entityId && (
                          <span className="text-gray-400">
                            {" "}
                            • {event.entityId}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">–</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {event.ipAddress ?? (
                      <span className="text-gray-400">–</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700 max-w-xs">
                    <span className="line-clamp-2">
                      {event.description ?? (
                        <span className="text-gray-400">–</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
        <div className="text-center sm:text-left">
          <span>
            Showing{" "}
            <span className="font-medium">
              {events.length === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {(page - 1) * pageSize + events.length}
            </span>{" "}
            of <span className="font-medium">{effectiveTotal}</span> events
          </span>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={handlePrevious}
            className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span>
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={handleNext}
            className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: AuditEventType }) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  switch (action) {
    case "login":
      return (
        <span className={`${base} bg-green-100 text-green-700`}>Login</span>
      );
    case "logout":
      return (
        <span className={`${base} bg-gray-100 text-gray-700`}>Logout</span>
      );
    case "create":
      return (
        <span className={`${base} bg-blue-100 text-blue-700`}>Create</span>
      );
    case "update":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800`}>Update</span>
      );
    case "delete":
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Delete</span>
      );
    case "permission":
      return (
        <span className={`${base} bg-purple-100 text-purple-700`}>
          Permission
        </span>
      );
    default:
      return (
        <span className={`${base} bg-gray-100 text-gray-700`}>Other</span>
      );
  }
}

function formatAuditTime(timestamp: string) {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return timestamp;
  return d.toLocaleString();
}
