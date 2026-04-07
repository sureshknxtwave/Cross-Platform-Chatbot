import { Router } from "express";
import { createAppointment, createMedicationReminder, getAppointmentInsights, listAppointments, listMedicationReminders, sendMessage, } from "../controllers/chat.controller.js";
const router = Router();
router.post("/message", sendMessage);
router.post("/appointment", createAppointment);
router.post("/medication-reminder", createMedicationReminder);
router.get("/appointments", listAppointments);
router.get("/appointments/insights", getAppointmentInsights);
router.get("/medication-reminders", listMedicationReminders);
export default router;
//# sourceMappingURL=chat.routes.js.map