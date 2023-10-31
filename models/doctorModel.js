const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [false, "First name is required"],
    },
    lastName: {
      type: String,
      required: [false, "Last name is required"],
    },
    phone: {
      type: String,
      required: [false, "Phone number is required"],
    },
    email: {
      type: String,
      required: [false, "Email is required"],
    },
    website: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    address: {
      type: String,
      required: [false, "Address is required"],
    },
    specializations: {
      type: String,
      required: [false, "Specialization is required"],
    },
    experience: {
      type: String,
      required: [false, "Experience is required"],
    },
    feesPerConsultation: {
      type: Number,
      required: [false, "Fees per consultation is required"],
    },
    timings: {
      type: Object,
      required: [false, "Timings is required"],
    },
    patientsConsulted: {
      type: Array,
      default: [],
    },
    prescriptions: {
      type: Array,
      default: [],
    },
    appointments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
