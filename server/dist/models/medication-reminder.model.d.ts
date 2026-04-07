import mongoose from "mongoose";
import type { Document } from "mongoose";
export interface IMedicationReminder extends Document {
    patientName: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    contact: string;
    notes?: string;
    created_at: Date;
}
declare const MedicationReminder: mongoose.Model<IMedicationReminder, {}, {}, {}, mongoose.Document<unknown, {}, IMedicationReminder, {}, mongoose.DefaultSchemaOptions> & IMedicationReminder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMedicationReminder>;
export default MedicationReminder;
//# sourceMappingURL=medication-reminder.model.d.ts.map