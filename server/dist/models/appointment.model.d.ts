import mongoose from "mongoose";
import type { Document } from "mongoose";
export interface IAppointment extends Document {
    name: string;
    date: string;
    time: string;
    symptoms: string;
    contact: string;
    scenario: "healthcare";
    created_at: Date;
}
declare const Appointment: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment, {}, mongoose.DefaultSchemaOptions> & IAppointment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAppointment>;
export default Appointment;
//# sourceMappingURL=appointment.model.d.ts.map