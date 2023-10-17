const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const daySchema = new Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  date: { type: Date, required: true },
  isActive: { type: Boolean, required: true },
  timings: [{ type: Date, required: false }], // Use Date type directly
});

const preComputedAvailabilitySchema = new Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  days: [daySchema],
});

const PreComputedAvailability = mongoose.model(
  "PreComputedAvailability",
  preComputedAvailabilitySchema
);

module.exports = PreComputedAvailability;
