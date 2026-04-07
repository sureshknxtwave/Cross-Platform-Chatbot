import { useEffect, useState } from "react";
import {
  getAppointmentInsights,
  getAppointments,
  getMedicationReminders,
  type AppointmentInsights,
  type AppointmentRecord,
  type MedicationReminderRecord,
} from "../services/chat.service";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [reminders, setReminders] = useState<MedicationReminderRecord[]>([]);
  const [insights, setInsights] = useState<AppointmentInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [rows, summary, reminderRows] = await Promise.all([
          getAppointments(),
          getAppointmentInsights(),
          getMedicationReminders(),
        ]);
        setAppointments(rows);
        setInsights(summary);
        setReminders(reminderRows);
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

      {!loading && !error && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Medication Reminders</h2>
          </div>
          <div className="md:hidden p-3 space-y-3">
            {reminders.length === 0 ? (
              <p className="text-sm text-gray-500">No medication reminders yet.</p>
            ) : (
              reminders.map((item) => (
                <div key={item._id} className="border rounded-lg p-3 bg-white">
                  <p className="font-semibold text-gray-900">{item.patientName}</p>
                  <p className="text-xs text-gray-500">{item.medicineName} • {item.dosage}</p>
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
              </tr>
            </thead>
            <tbody>
              {reminders.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={7}>
                    No medication reminders yet.
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
