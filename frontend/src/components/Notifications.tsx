type NotificationsProps = {
  onBack: () => void;
};

export default function Notifications({ onBack }: NotificationsProps) {
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

      <div className="rounded-lg border p-4 text-gray-600 bg-white">
        No notifications yet.
      </div>
    </div>
  );
}
