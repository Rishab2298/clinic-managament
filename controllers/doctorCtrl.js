const patientModel = require("../models/patientModel");
const Availability = require("../models/availabilityModel");
const PreComputedAvailability = require("../models/preComputedAvailability");
const moment = require("moment");
const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const dayjs = require("dayjs");

const updateAppointmentStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
      return res
        .status(400)
        .json({ error: "AppointmentId and status are required." });
    }

    const updatedAppointment = await appointmentModel.findById(appointmentId);

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    updatedAppointment.status = status;
    await updatedAppointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while updating the appointment status.",
    });
  }
};

const addNewAppointmentController = async (req, res) => {
  try {
    const { doctorId, patientId, timing, userId } = req.body;
    const status = "confirmed";

    // Find the doctor's precomputed availability
    const doctorAvailability = await PreComputedAvailability.findOne({
      doctorId,
    });

    if (!doctorAvailability) {
      return res
        .status(404)
        .send({ message: "Doctor not found in availability" });
    }

    // Find the day with the matching date in the doctor's availability
    let dayWithMatchingDate = null;
    for (const day of doctorAvailability.days) {
      const availbilityDate = dayjs(day.date).format("YYYY-MM-DD");
      const date = dayjs(timing).format("YYYY-MM-DD");
      if (availbilityDate === date) {
        dayWithMatchingDate = day; // Assign the matching day object
        break;
      }
    }

    if (!dayWithMatchingDate) {
      return res
        .status(400)
        .send({ message: "Selected date is not available" });
    }

    // Create a new appointment
    const newAppointment = new appointmentModel({
      doctorId,
      patientId,
      timing,
      userId,
      status,
    });

    // Add the appointment to the doctor and patient models
    const doctor = await doctorModel.findById(doctorId);
    const patient = await patientModel.findById(patientId);

    doctor.appointments.push(newAppointment._id);
    patient.appointments.push(newAppointment._id);

    // Find the timing in dayWithMatchingDate.timings
    const timingDate = new Date(timing);
    // Remove the timing from dayWithMatchingDate.timings
    dayWithMatchingDate.timings = dayWithMatchingDate.timings.filter(
      (availableTiming) =>
        availableTiming.toISOString() !== timingDate.toISOString()
    );

    // Save the changes to doctor, patient models, and availability
    await doctor.save();
    await patient.save();
    await doctorAvailability.save();

    // Save the new appointment
    await newAppointment.save();

    res.status(201).send({
      message: "Appointment Created Successfully",
      success: true,
      data: newAppointment,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const addNewPatientController = async (req, res) => {
  try {
    const { email, phone, dateOfBirth } = req.body;
    const user = await userModel.findById(req.body.userId);
    const doctorId = user.doctorId;

    // Check if the patient already exists with the current doctor
    const existingPatient = await patientModel.findOne({
      $or: [
        { email, doctorsConsulted: doctorId },
        { phone, doctorsConsulted: doctorId },
      ],
    });

    if (existingPatient) {
      return res.status(200).send({
        message: "This Email or phone number is already registered with you",
        success: false,
      });
    }

    // Check if the patient already exists in the database
    const existingPatientInDB = await patientModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingPatientInDB) {
      // Add the current doctor to the list of doctors consulted
      existingPatientInDB.doctorsConsulted.push(doctorId);
      await existingPatientInDB.save();
      const existingDoctor = await doctorModel.findById({ doctorId });
      existingDoctor.patientsConsulted.push(existingPatientInDB._id);

      return res.status(200).send({
        message: "Patient already exists in the database",
        success: true,
      });
    }

    // Calculate age based on dateOfBirth
    const age = calculateAge(dateOfBirth);

    // Create a new patient with the current doctor's user ID in the doctorsConsulted array
    const newPatientData = {
      ...req.body,
      doctorsConsulted: [doctorId],
      age: age, // Set it as an array with the current doctor's ID
    };

    const newPatient = new patientModel(newPatientData);
    await newPatient.save();
    const existingDoctor = await doctorModel.findById(doctorId);
    existingDoctor.patientsConsulted.push(newPatient._id);
    await existingDoctor.save();
    res.status(201).send({
      message: "Registered Successfully",
      success: true,
      data: newPatient,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const calculateAge = (dateOfBirth) => {
  const today = moment();
  const birthDate = moment(dateOfBirth, "YYYY-MM-DD");

  const age = today.diff(birthDate, "years");

  return age;
};

const getAllPatientsController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    const patients = await patientModel.find({
      doctorsConsulted: user.doctorId,
    });
    res.status(200).send({
      success: true,
      message: "Patients Lists Fetched Successfully",
      data: patients,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Patients",
    });
  }
};

const getPatientController = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const user = await userModel.findById(req.body.userId);
    const doctorId = user.doctorId;

    if (!patientId) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "User not found",
      });
    }

    const patient = await patientModel.findById(patientId);

    if (!patient) {
      return res.status(200).send({
        success: true,
        message: "No Patient Data Found",
        data: [],
      });
    }

    // Check if the doctorId exists in patient.doctorsConsulted
    const doctorConsulted = patient.doctorsConsulted.includes(doctorId);

    res.status(200).send({
      success: true,
      message: "Patient Details Fetched Successfully",
      data: {
        patient,
        isDoctorConsulted: doctorConsulted,
      },
    });
  } catch (error) {
    console.error("Error in getAvailabilityController:", error);
    res.status(500).send({
      success: false,
      data: [],
      message: "Error While Fetching Availability",
    });
  }
};

const getAllAppointmentsController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    const appointments = await appointmentModel.find({
      doctorId: user.doctorId,
    });
    // Create an array to store merged appointment and patient data
    const mergedData = [];

    // Iterate through the appointments and fetch patient data for each one
    for (const appointment of appointments) {
      const patient = await patientModel.findById(appointment.patientId);

      // Merge appointment and patient data into a single object
      const mergedAppointmentData = {
        ...patient._doc, // Merge patient data
        ...appointment._doc, // Merge appointment data
      };
      mergedData.push(mergedAppointmentData);
    }

    res.status(200).send({
      success: true,
      message: "Patients Lists Fetched Successfully",
      data: mergedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Patients",
    });
  }
};

const setAvailabilityController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const doctorId = user.doctorId;

    const existingAvailability = await Availability.findOne({ doctorId });

    if (existingAvailability) {
      // Update the existing availability data
      existingAvailability.days = req.body;
      await existingAvailability.save();

      return res.status(200).json({
        success: true,
        message: "Availability Updated Successfully",
        data: existingAvailability,
      });
    } else {
      // Create a new availability document
      const newAvailability = new Availability({
        doctorId,
        days: req.body,
      });

      const savedAvailability = await newAvailability.save();

      return res.status(201).json({
        success: true,
        message: "Availability Created Successfully",
        data: savedAvailability,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: `Error in setAvailabilityController: ${error.message}`,
    });
  }
};

const getAvailabilityController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);

    if (!user) {
      // Handle the case where the user is not found.
      return res.status(404).send({
        success: false,
        data: [],
        message: "User not found",
      });
    }

    const availability = await Availability.findOne({
      doctorId: user.doctorId,
    });

    if (!availability) {
      // Handle the case where availability data is not found.
      return res.status(200).send({
        success: true,
        message: "No Availability Data Found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor Availability Fetched Successfully",
      data: availability.days,
    });
  } catch (error) {
    console.error("Error in getAvailabilityController:", error);
    res.status(500).send({
      success: false,
      data: [],
      message: "Error While Fetching Availability",
    });
  }
};

const setPreComputedAvailabilityController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const doctorId = user.doctorId;

    const existingAvailability = await PreComputedAvailability.findOne({
      doctorId,
    });

    if (existingAvailability) {
      // Update the existing availability data
      existingAvailability.days = [];
      existingAvailability.days = req.body.next30Days;
      await existingAvailability.save();

      return res.status(200).json({
        success: true,
        message: "Availability Updated Successfully",
        data: existingAvailability,
      });
    } else {
      // Create a new availability document
      const newPreComputedAvailability = new PreComputedAvailability({
        doctorId,
        days: req.body.next30Days,
      });

      const savedAvailability = await newPreComputedAvailability.save();

      return res.status(201).json({
        success: true,
        message: "Availability Created Successfully",
        data: savedAvailability,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: `Error in setAvailabilityController: ${error.message}`,
    });
  }
};

const getPreComputedAvailabilityController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);

    if (!user) {
      // Handle the case where the user is not found.
      return res.status(404).send({
        success: false,
        data: [],
        message: "User not found",
      });
    }

    const preComputedAvailability = await PreComputedAvailability.findOne({
      doctorId: user.doctorId,
    });

    if (!preComputedAvailability) {
      // Handle the case where availability data is not found.
      return res.status(200).send({
        success: true,
        message: "No Availability Data Found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor Availability Fetched Successfully",
      data: preComputedAvailability.days,
    });
  } catch (error) {
    console.error("Error in getAvailabilityController:", error);
    res.status(500).send({
      success: false,
      data: [],
      message: "Error While Fetching Availability",
    });
  }
};
module.exports = {
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
};
