const express = require("express");
const {
  addNewPatientController,
  getAllPatientsController,
  setAvailabilityController,
  getAvailabilityController,
  setPreComputedAvailabilityController,
  getPreComputedAvailabilityController,
  addNewAppointmentController,
  getAllAppointmentsController,
  updateAppointmentStatusController,
  getPatientController,
  addPrescriptionController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//POST Add new patient
router.post("/add-new-patient", authMiddleware, addNewPatientController);

//POST Add prescription
router.post("/add-prescription", authMiddleware, addPrescriptionController);

//Get all patients
router.get("/get-all-patients", authMiddleware, getAllPatientsController);

//Get a patient
router.get("/get-patient/:patientId", authMiddleware, getPatientController);

//Get all appointments
router.get(
  "/get-all-appointments",
  authMiddleware,
  getAllAppointmentsController
);

//Update Appointment Status
router.post(
  "/update-appointment-status",
  authMiddleware,
  updateAppointmentStatusController
);

//Set Availability
router.post("/set-availability", authMiddleware, setAvailabilityController);

//Get Availability
router.get("/get-availability", authMiddleware, getAvailabilityController);

//Post PreComputedAvailability
router.post(
  "/set-pre-computed-availability",
  authMiddleware,
  setPreComputedAvailabilityController
);
//Post add new appointment
router.post(
  "/add-new-appointment",
  authMiddleware,
  addNewAppointmentController
);

//Get PreComputedAvailability
router.get(
  "/get-pre-computed-availability",
  authMiddleware,
  getPreComputedAvailabilityController
);

module.exports = router;
