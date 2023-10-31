const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema({
  key: Number,
  pulseRate: String, // Pulse rate in BPM (Beats Per Minute)
  respiratoryRate: String, // Respiratory rate in BPM (Breaths Per Minute)
  weight: String, // Body weight in kilograms (kg)
  peripheralOxygenSaturation: String, // Peripheral oxygen saturation in percentage (%)
  temperature: String, // Body temperature in degrees Celsius (°C)
  bodyMassIndex: String, // Body Mass Index (BMI)
  bloodPressureSystolic: String, // Systolic blood pressure in mmHg
  bloodPressureDiastolic: String, // Diastolic blood pressure in mmHg
  height: String, // Body height in centimeters (cm)
});

const medicationSchema = new mongoose.Schema({
  key: Number,
  medicine: String, // Name of the medicine
  dosage: String, // Dosage of the medicine
  frequency: String, // Frequency of medication (e.g., "Once a day," "Twice a day")
  timing: String, // Timing of medication (e.g., "Morning," "Evening")
  duration: String, // Duration of the medication (e.g., "1 week," "2 months")
  startFrom: String, // Start date of the medication
  instruction: String, // Additional instructions for taking the medication
});

const diagnosisSchema = new mongoose.Schema({
  key: Number,
  diagnosis: String, // Name of the diagnosis@
  duration: String, // Duration of the diagnosis (e.g., "1 week," "2 months")@
  frequency: String, // Frequency of the diagnosis (e.g., "Once a day," "Twice a day")@
  severity: String, // Severity of the diagnosis@
  detail: String, // Additional details about the diagnosis
});

const symptomsSchema = new mongoose.Schema({
  key: Number,
  symptom: String, // Name of the symptom
  duration: String, // Duration of the diagnosis (e.g., "1 week," "2 months")
  frequency: String, // Frequency of the diagnosis (e.g., "Once a day," "Twice a day")
  severity: String, // Severity of the diagnosis
  detail: String, // Additional details about the diagnosis
});

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  medication: [medicationSchema],
  diagnosis: [diagnosisSchema],
  symptoms: [symptomsSchema],

  vitals: vitalsSchema, // Embed the vitals subdocument
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
