import mongoose, { Schema } from "mongoose";
const MedicationReminderSchema = new Schema({
    patientName: { type: String, required: true, trim: true },
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, trim: true, default: "" },
    contact: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: "" },
    created_at: { type: Date, default: Date.now },
});
const MedicationReminder = mongoose.model("MedicationReminder", MedicationReminderSchema);
export default MedicationReminder;
