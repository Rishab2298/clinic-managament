const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    doctorId: {
      type: String,
      required: [true, "doctorId is required"],
    },
    patientId: {
      type: String,
      required: [true, "patientID name is required"],
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "completed",
        "cancelled by doctor",
        "cancelled by patient",
        "no Show",
        "in progress",
        "rescheduled", //it happens when the doctor has asked to reshedule the appointment or book a new appointment
      ],
      default: "scheduled",
    },
    timing: {
      type: Date,
      required: [true, "timing is required"],
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = appointmentModel;
