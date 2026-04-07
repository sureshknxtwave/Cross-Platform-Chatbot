import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import {
  getAppointmentInsights,
  getAppointments,
  getMedicationReminders,
  type AppointmentInsights,
  type AppointmentRecord,
  type MedicationReminderRecord,
} from "../services/chat.service";

export default function InsightsPage() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [reminders, setReminders] = useState<MedicationReminderRecord[]>([]);
  const [insights, setInsights] = useState<AppointmentInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [apptRows, reminderRows, summary] = await Promise.all([
          getAppointments(),
          getMedicationReminders(),
          getAppointmentInsights(),
        ]);
        setAppointments(apptRows);
        setReminders(reminderRows);
        setInsights(summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load insights.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const medicationSummary = useMemo(() => {
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let active = 0;
    let endingSoon = 0;
    const medicineCounts: Record<string, number> = {};

    reminders.forEach((item) => {
      const medKey = item.medicineName.trim().toLowerCase();
      medicineCounts[medKey] = (medicineCounts[medKey] || 0) + 1;

      const end = item.endDate ? new Date(item.endDate) : null;
      const isActive = !end || end >= todayOnly;
      if (isActive) active += 1;

      if (end) {
        const diffDays = Math.ceil((end.getTime() - todayOnly.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 3) endingSoon += 1;
      }
    });

    const topMedicineEntry = Object.entries(medicineCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      total: reminders.length,
      active,
      endingSoon,
      topMedicine: topMedicineEntry
        ? `${topMedicineEntry[0]} (${topMedicineEntry[1]})`
        : "No data",
    };
  }, [reminders]);

  const operationalInsights = useMemo(() => {
    const items: string[] = [];
    if (!insights) return items;

    if (insights.appointmentsToday >= 10) {
      items.push("High appointment load today. Consider adding extra consultation slots.");
    }
    if (insights.topSymptoms[0]?.symptom) {
      items.push(`Top symptom trend: ${insights.topSymptoms[0].symptom}. Prepare focused care guidance.`);
    }
    if (medicationSummary.endingSoon > 0) {
      items.push(
        `${medicationSummary.endingSoon} medication plan(s) ending within 3 days. Trigger follow-up reminders.`,
      );
    }
    if (items.length === 0) {
      items.push("System is stable. Continue monitoring trends daily.");
    }

    return items;
  }, [insights, medicationSummary.endingSoon]);

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
      <h1 className="text-2xl font-bold text-maroon mb-2">Insights</h1>
      <p className="text-sm text-gray-600 mb-6">
        Live operational insights for appointments, symptoms, and medications.
      </p>

      {loading && <p className="text-gray-600">Loading insights...</p>}
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
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-gray-500">Active Medications</p>
              <p className="text-2xl font-semibold text-maroon">{medicationSummary.active}</p>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-gray-500">Top Medicine</p>
              <p className="text-sm font-semibold text-gray-700 mt-2">{medicationSummary.topMedicine}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border rounded-xl p-4 h-72">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Appointments per Day</h2>
              {insights.dailyTrend.length === 0 ? (
                <p className="text-xs text-gray-500">No trend data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insights.dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#7b1d2e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="bg-white border rounded-xl p-4 h-72">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Top Symptoms</h2>
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

          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Actionable Insights</h2>
            <div className="space-y-2">
              {operationalInsights.map((item, idx) => (
                <p key={`${item}-${idx}`} className="text-sm text-gray-700">
                  - {item}
                </p>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Total medication records: {medicationSummary.total} | Ending soon:{" "}
              {medicationSummary.endingSoon}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Total appointment records loaded: {appointments.length}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
