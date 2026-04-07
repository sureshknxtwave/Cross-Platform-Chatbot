import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMedicationReminders,
  type MedicationReminderRecord,
} from "../services/chat.service";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MedicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reminders, setReminders] = useState<MedicationReminderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dailyMedTrend = useMemo(() => {
    const counts: Record<string, number> = {};
    reminders.forEach((item) => {
      const d = new Date(item.created_at);
      const key = d.toISOString().slice(0, 10);
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, count]) => ({ date, count }));
  }, [reminders]);

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await getMedicationReminders();
        setReminders(rows);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load medications.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (authLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Checking access...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-maroon mb-2">Medications</h1>
      <p className="text-sm text-gray-600 mb-6">
        Medication plans saved after doctor consultation.
      </p>

      {loading && <p className="text-gray-600">Loading medications...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border rounded-xl p-4 mb-6 h-72">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Medications Created per Day
          </h2>
          {dailyMedTrend.length === 0 ? (
            <p className="text-xs text-gray-500">No medication trend data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyMedTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2b6cb0"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="md:hidden p-3 space-y-3">
            {reminders.length === 0 ? (
              <p className="text-sm text-gray-500">No medications saved yet.</p>
            ) : (
              reminders.map((item) => (
                <div key={item._id} className="border rounded-lg p-3 bg-white">
                  <p className="font-semibold text-gray-900">{item.patientName}</p>
                  <p className="text-xs text-gray-500">
                    {item.medicineName} - {item.dosage}
                  </p>
                  <p className="text-sm mt-2">Frequency: {item.frequency}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.startDate} to {item.endDate || "-"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Contact: {item.contact}</p>
                </div>
              ))
            )}
          </div>

          <table className="hidden md:table w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 border-b">Patient</th>
                <th className="px-4 py-3 border-b">Medicine</th>
                <th className="px-4 py-3 border-b">Dosage</th>
                <th className="px-4 py-3 border-b">Frequency</th>
                <th className="px-4 py-3 border-b">Start</th>
                <th className="px-4 py-3 border-b">End</th>
                <th className="px-4 py-3 border-b">Contact</th>
                <th className="px-4 py-3 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {reminders.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={8}>
                    No medications saved yet.
                  </td>
                </tr>
              ) : (
                reminders.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{item.patientName}</td>
                    <td className="px-4 py-3 border-b">{item.medicineName}</td>
                    <td className="px-4 py-3 border-b">{item.dosage}</td>
                    <td className="px-4 py-3 border-b">{item.frequency}</td>
                    <td className="px-4 py-3 border-b">{item.startDate}</td>
                    <td className="px-4 py-3 border-b">{item.endDate || "-"}</td>
                    <td className="px-4 py-3 border-b">{item.contact}</td>
                    <td className="px-4 py-3 border-b">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
