import mongoose, { Schema } from "mongoose";
const AppointmentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    date: {
        type: String,
        required: [true, "Date is required"],
        trim: true,
    },
    time: {
        type: String,
        required: [true, "Time is required"],
        trim: true,
    },
    symptoms: {
        type: String,
        required: [true, "Symptoms are required"],
        trim: true,
        maxlength: [500, "Symptoms cannot exceed 500 characters"],
    },
    contact: {
        type: String,
        required: [true, "Contact is required"],
        trim: true,
        maxlength: [30, "Contact cannot exceed 30 characters"],
    },
    scenario: {
        type: String,
        enum: ["healthcare"],
        default: "healthcare",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
