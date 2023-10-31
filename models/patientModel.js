const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    pincode: {
      type: Number,
    },
    address: {
      type: String,
      required: [false, "Address is required"],
    },
    doctorsConsulted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
      },
    ],
    prescriptions: {
      type: Array,
      default: [],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      format: "DD/MM/YYYY",
    },
    appointments: {
      type: Array,
      default: [],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
  },
  { timestamps: true }
);

const patientModel = mongoose.model("patients", patientSchema);
module.exports = patientModel;
