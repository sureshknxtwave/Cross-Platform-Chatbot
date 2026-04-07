import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  getAppointmentInsights,
  getAppointments,
  type AppointmentInsights,
  type AppointmentRecord,
} from "../services/chat.service";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [insights, setInsights] = useState<AppointmentInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [rows, summary] = await Promise.all([
          getAppointments(),
          getAppointmentInsights(),
        ]);
        setAppointments(rows);
        setInsights(summary);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load appointments.",
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
      <h1 className="text-2xl font-bold text-maroon mb-2">Appointment Requests</h1>
      <p className="text-sm text-gray-600 mb-6">
        Healthcare chatbot bookings submitted by users.
      </p>

      {loading && <p className="text-gray-600">Loading appointments...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && insights && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">Total Appointments</p>
            <p className="text-2xl font-semibold text-maroon">{insights.totalAppointments}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">Appointments Today</p>
            <p className="text-2xl font-semibold text-maroon">{insights.appointmentsToday}</p>
          </div>
          <div className="bg-white border rounded-xl p-4 md:col-span-2">
            <p className="text-xs text-gray-500 mb-1">Top Symptoms</p>
            <p className="text-sm text-gray-700">
              {insights.topSymptoms.length === 0
                ? "No symptom trends yet."
                : insights.topSymptoms
                    .map((item) => `${item.symptom} (${item.count})`)
                    .join(", ")}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">Medication Reminders</p>
            <p className="text-2xl font-semibold text-maroon">
              {insights.totalMedicationReminders}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">Reminders Today</p>
            <p className="text-2xl font-semibold text-maroon">
              {insights.remindersToday}
            </p>
          </div>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border rounded-xl p-4 h-72">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Appointments per Day
            </h2>
            {insights.dailyTrend.length === 0 ? (
              <p className="text-xs text-gray-500">No trend data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#7b1d2e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-white border rounded-xl p-4 h-72">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Top Symptoms
            </h2>
            {insights.topSymptoms.length === 0 ? (
              <p className="text-xs text-gray-500">No symptom trends yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.topSymptoms}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="symptom" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#c53030" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        </>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="md:hidden p-3 space-y-3">
            {appointments.length === 0 ? (
              <p className="text-sm text-gray-500">No appointment requests yet.</p>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id} className="border rounded-lg p-3 bg-white">
                  <p className="font-semibold text-gray-900">{appt.name}</p>
                  <p className="text-xs text-gray-500">{appt.date} • {appt.time}</p>
                  <p className="text-sm mt-2">{appt.symptoms}</p>
                  <p className="text-xs text-gray-500 mt-2">Contact: {appt.contact}</p>
                </div>
              ))
            )}
          </div>
          <table className="hidden md:table w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Date</th>
                <th className="px-4 py-3 border-b">Time</th>
                <th className="px-4 py-3 border-b">Symptoms</th>
                <th className="px-4 py-3 border-b">Contact</th>
                <th className="px-4 py-3 border-b">Created At</th>
                <th className="px-4 py-3 border-b">Reference ID</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={7}>
                    No appointment requests yet.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{appt.name}</td>
                    <td className="px-4 py-3 border-b">{appt.date}</td>
                    <td className="px-4 py-3 border-b">{appt.time}</td>
                    <td className="px-4 py-3 border-b">{appt.symptoms}</td>
                    <td className="px-4 py-3 border-b">{appt.contact}</td>
                    <td className="px-4 py-3 border-b">
                      {new Date(appt.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border-b font-mono text-xs">{appt._id}</td>
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
