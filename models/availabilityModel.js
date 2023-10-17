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
  isActive: Boolean,
  session1StartTime: { type: Date, required: false },
  session1EndTime: { type: Date, required: false },
  session2StartTime: { type: Date, required: false },
  session2EndTime: { type: Date, required: false },
});
const availabilitySchema = new Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  days: [daySchema],
});
const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
