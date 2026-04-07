import { getRAGResponse } from "../services/rag.service.js";
import Appointment from "../models/appointment.model.js";
import MedicationReminder from "../models/medication-reminder.model.js";
const isValidContact = (contact) => /^[0-9+\-\s()]{8,20}$/.test(contact);
// POST /api/chat/message
export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== "string" || !message.trim()) {
            res.status(400).json({ success: false, message: "Message is required." });
            return;
        }
        const answer = await getRAGResponse(message.trim());
        res.json({ success: true, data: { message: answer } });
    }
    catch (error) {
        next(error);
    }
};
// POST /api/chat/appointment
export const createAppointment = async (req, res, next) => {
    try {
        const { name, date, time, symptoms, contact, scenario } = req.body;
        if (!name || !date || !time || !symptoms || !contact) {
            res.status(400).json({
                success: false,
                message: "name, date, time, symptoms and contact are required.",
            });
            return;
        }
        const cleanName = String(name).trim();
        const cleanDate = String(date).trim();
        const cleanTime = String(time).trim();
        const cleanSymptoms = String(symptoms).trim();
        const cleanContact = String(contact).trim();
        if (cleanName.length < 2) {
            res.status(400).json({ success: false, message: "Please enter a valid name." });
            return;
        }
        if (cleanDate.length < 3) {
            res.status(400).json({ success: false, message: "Please enter a valid preferred date." });
            return;
        }
        if (cleanTime.length < 2) {
            res.status(400).json({ success: false, message: "Please enter a valid preferred time." });
            return;
        }
        if (cleanSymptoms.length < 5) {
            res.status(400).json({ success: false, message: "Please provide symptom details." });
            return;
        }
        if (!isValidContact(cleanContact)) {
            res.status(400).json({ success: false, message: "Please enter a valid contact number." });
            return;
        }
        const appointment = await Appointment.create({
            name: cleanName,
            date: cleanDate,
            time: cleanTime,
            symptoms: cleanSymptoms,
            contact: cleanContact,
            scenario: scenario === "healthcare" ? "healthcare" : "healthcare",
        });
        res.status(201).json({
            success: true,
            message: "Appointment request submitted.",
            data: {
                id: appointment._id,
                name: appointment.name,
                date: appointment.date,
                time: appointment.time,
                symptoms: appointment.symptoms,
                contact: appointment.contact,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// GET /api/chat/appointments/insights
export const getAppointmentInsights = async (_req, res, next) => {
    try {
        const [appointments, reminders] = await Promise.all([
            Appointment.find({}).sort({ created_at: -1 }).lean(),
            MedicationReminder.find({}).sort({ created_at: -1 }).lean(),
        ]);
        const totalAppointments = appointments.length;
        const todayKey = new Date().toISOString().slice(0, 10);
        const appointmentsToday = appointments.filter((appt) => new Date(appt.created_at).toISOString().slice(0, 10) === todayKey).length;
        const remindersToday = reminders.filter((item) => new Date(item.created_at).toISOString().slice(0, 10) === todayKey).length;
        const dailyMap = new Map();
        for (const appt of appointments) {
            const key = new Date(appt.created_at).toISOString().slice(0, 10);
            dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
        }
        const dailyTrend = Array.from(dailyMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-7)
            .map(([date, count]) => ({ date, count }));
        const symptomMap = new Map();
        for (const appt of appointments) {
            const category = appt.symptoms.split(/[,\s]+/)[0]?.toLowerCase() || "other";
            symptomMap.set(category, (symptomMap.get(category) || 0) + 1);
        }
        const topSymptoms = Array.from(symptomMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([symptom, count]) => ({ symptom, count }));
        res.json({
            success: true,
            data: {
                totalAppointments,
                appointmentsToday,
                totalMedicationReminders: reminders.length,
                remindersToday,
                topSymptoms,
                dailyTrend,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// GET /api/chat/appointments
export const listAppointments = async (_req, res, next) => {
    try {
        const appointments = await Appointment.find({})
            .sort({ created_at: -1 })
            .lean();
        res.json({
            success: true,
            data: {
                appointments,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// POST /api/chat/medication-reminder
export const createMedicationReminder = async (req, res, next) => {
    try {
        const { patientName, medicineName, dosage, frequency, startDate, endDate, contact, notes, } = req.body;
        if (!patientName || !medicineName || !dosage || !frequency || !startDate || !contact) {
            res.status(400).json({
                success: false,
                message: "patientName, medicineName, dosage, frequency, startDate and contact are required.",
            });
            return;
        }
        const cleanContact = String(contact).trim();
        if (!isValidContact(cleanContact)) {
            res.status(400).json({ success: false, message: "Please enter a valid contact number." });
            return;
        }
        const reminder = await MedicationReminder.create({
            patientName: String(patientName).trim(),
            medicineName: String(medicineName).trim(),
            dosage: String(dosage).trim(),
            frequency: String(frequency).trim(),
            startDate: String(startDate).trim(),
            endDate: String(endDate || "").trim(),
            contact: cleanContact,
            notes: String(notes || "").trim(),
        });
        res.status(201).json({
            success: true,
            message: "Medication reminder saved.",
            data: {
                id: reminder._id,
                patientName: reminder.patientName,
                medicineName: reminder.medicineName,
                dosage: reminder.dosage,
                frequency: reminder.frequency,
                startDate: reminder.startDate,
                endDate: reminder.endDate,
                contact: reminder.contact,
                notes: reminder.notes,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// GET /api/chat/medication-reminders
export const listMedicationReminders = async (_req, res, next) => {
    try {
        const reminders = await MedicationReminder.find({})
            .sort({ created_at: -1 })
            .lean();
        res.json({ success: true, data: { reminders } });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=chat.controller.js.map