import { useState } from "react";

type NotificationsProps = {
  onBack: () => void;
};

export default function Notifications({ onBack }: NotificationsProps) {
  const buildNotifications = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    const formatDate = (d: Date) =>
      d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    return [
      {
        id: "notif-today",
        title: "Lab results ready",
        body: "CBC for patient P-1024 is available for review.",
        date: formatDate(today),
      },
      {
        id: "notif-yesterday",
        title: "New appointment scheduled",
        body: "A follow-up with Dr. Tesfaye was booked for Jan 28, 2026.",
        date: formatDate(yesterday),
      },
      {
        id: "notif-two-days",
        title: "Prescription renewed",
        body: "Metformin refill approved for patient P-0987.",
        date: formatDate(twoDaysAgo),
      },
    ];
  };

  const [notifications, setNotifications] = useState(buildNotifications);

  const markRead = (id: string) => {
    setNotifications((list) => list.filter((n) => n.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="rounded-lg border p-4 text-gray-600 bg-white">All caught up.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markRead(n.id)}
              className="w-full text-left rounded-lg border p-4 bg-white shadow-sm hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-gray-900 font-medium">{n.title}</div>
                  <div className="text-gray-700 text-sm mt-1">{n.body}</div>
                </div>
                <span className="text-gray-500 text-sm">{n.date}</span>
              </div>
              <div className="text-blue-600 text-sm mt-2">Tap to mark as read</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
