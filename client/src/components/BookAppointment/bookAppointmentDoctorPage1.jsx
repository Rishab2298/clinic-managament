import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout";
import PatientsList from "../patientsList";

const BookAppointmentDoctorPage1 = () => {
  const isBookingAppointment = true;

  return (
    <>
      <PatientsList />
    </>
  );
};

export default BookAppointmentDoctorPage1;
