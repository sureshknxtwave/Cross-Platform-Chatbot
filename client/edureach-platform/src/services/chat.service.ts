import API from "./api";
import axios from "axios";

export interface AppointmentPayload {
  name: string;
  date: string;
  time: string;
  symptoms: string;
  contact: string;
}
export interface AppointmentRecord extends AppointmentPayload {
  _id: string;
  created_at: string;
}
export interface AppointmentInsights {
  totalAppointments: number;
  appointmentsToday: number;
  totalMedicationReminders: number;
  remindersToday: number;
  topSymptoms: Array<{ symptom: string; count: number }>;
  dailyTrend: Array<{ date: string; count: number }>;
}
export interface MedicationReminderPayload {
  patientName: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  contact: string;
  notes?: string;
}
export interface MedicationReminderRecord extends MedicationReminderPayload {
  _id: string;
  created_at: string;
}

// Backend response: { success: true, data: { message: "answer text" } }
// res.data = { success, data: { message } }
// We return res.data.data so ChatDrawer gets { message: "answer text" }
export const sendMessage = async (
  message: string,
) => {
  try {
    const res = await API.post(
      "/chat/message",
      { message },
      { timeout: 25000 },
    );
    return res.data.data; // { message: "answer text" }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Chat request timed out. Please try again.");
      }
      throw new Error(
        error.response?.data?.message || "Unable to reach chatbot service.",
      );
    }
    throw new Error("Unexpected chat error. Please try again.");
  }
};

export const createAppointment = async (payload: AppointmentPayload) => {
  try {
    const res = await API.post(
      "/chat/appointment",
      payload,
      { timeout: 25000 },
    );
    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Unable to submit appointment request.",
      );
    }
    throw new Error("Unexpected appointment error. Please try again.");
  }
};

export const getAppointments = async (): Promise<AppointmentRecord[]> => {
  try {
    const res = await API.get("/chat/appointments", { timeout: 25000 });
    return res.data?.data?.appointments || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Unable to fetch appointments.",
      );
    }
    throw new Error("Unexpected error while loading appointments.");
  }
};

export const getAppointmentInsights = async (): Promise<AppointmentInsights> => {
  try {
    const res = await API.get("/chat/appointments/insights", { timeout: 25000 });
    return res.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Unable to fetch appointment insights.",
      );
    }
    throw new Error("Unexpected error while loading appointment insights.");
  }
};

export const createMedicationReminder = async (
  payload: MedicationReminderPayload,
) => {
  try {
    const res = await API.post("/chat/medication-reminder", payload, {
      timeout: 25000,
    });
    return res.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Unable to save medication reminder.",
      );
    }
    throw new Error("Unexpected medication reminder error.");
  }
};

export const getMedicationReminders = async (): Promise<
  MedicationReminderRecord[]
> => {
  try {
    const res = await API.get("/chat/medication-reminders", { timeout: 25000 });
    return res.data?.data?.reminders || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Unable to fetch medication reminders.",
      );
    }
    throw new Error("Unexpected error while loading medication reminders.");
  }
};