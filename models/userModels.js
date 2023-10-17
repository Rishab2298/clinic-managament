const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is require"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is require"],
  },
  email: {
    type: String,
    required: [true, "email is require"],
  },
  password: {
    type: String,
    required: [true, "password is require"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  isPatient: {
    type: Boolean,
    default: false,
  },
  isUser: {
    type: Boolean,
    default: true,
  },
  notifications: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
  },
  doctorId: {
    type: String,
    default: "",
  },
  patientId: {
    type: String,
    default: "",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
