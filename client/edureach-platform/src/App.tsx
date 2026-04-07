import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "./components/Navbar";
import FloatingChatButton from "./components/FloatingChatButton";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import MedicationsPage from "./pages/MedicationsPage";
import InsightsPage from "./pages/InsightsPage";
import type { ReactNode } from "react";
import { useAuth } from "./context/AuthContext";
import { getAppointments, type AppointmentRecord } from "./services/chat.service";

function WithNavbar({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    const parseAppointmentDateTime = (appointment: AppointmentRecord): Date | null => {
      const direct = new Date(`${appointment.date} ${appointment.time}`);
      if (!Number.isNaN(direct.getTime())) return direct;

      const fallback = new Date(appointment.date);
      if (!Number.isNaN(fallback.getTime())) return fallback;

      return null;
    };

    const checkUpcomingAppointments = async () => {
      try {
        const rows = await getAppointments();
        const now = Date.now();
        const next24Hours = now + 24 * 60 * 60 * 1000;

        const upcoming = rows
          .map((item) => {
            const dt = parseAppointmentDateTime(item);
            return { item, dt };
          })
          .filter(
            (x): x is { item: AppointmentRecord; dt: Date } =>
              x.dt !== null && x.dt.getTime() >= now && x.dt.getTime() <= next24Hours,
          )
          .sort((a, b) => a.dt.getTime() - b.dt.getTime())
          .slice(0, 3);

        upcoming.forEach(({ item }) => {
          const alertKey = `appointment-alert:${item._id}`;
          if (sessionStorage.getItem(alertKey)) return;

          toast(
            `Upcoming appointment for ${item.name} on ${item.date} at ${item.time}`,
            {
              icon: "📅",
              duration: 6000,
            },
          );
          sessionStorage.setItem(alertKey, "shown");
        });
      } catch {
        // Silent fail to avoid noisy popups when endpoint is temporarily unavailable.
      }
    };

    checkUpcomingAppointments();
    const timer = window.setInterval(checkUpcomingAppointments, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [user, loading]);

  return (
    <>
      <Routes>
        <Route path="/" element={<WithNavbar><HomePage /></WithNavbar>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/appointments" element={<WithNavbar><AppointmentsPage /></WithNavbar>} />
        <Route path="/medications" element={<WithNavbar><MedicationsPage /></WithNavbar>} />
        <Route path="/insights" element={<WithNavbar><InsightsPage /></WithNavbar>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating chat button — visible on all pages */}
      <FloatingChatButton />
    </>
  );
}