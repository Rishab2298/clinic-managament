import React from "react";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";

const BookAppointmentDoctorPage2 = () => {
  const params = useParams();
  const selectedDoctor = params.selectedDoctor;
  const timing = dayjs(params.timing).format("YYYY-MM-DD HH:mm:ss");
  const patientId = params.patientId;

  return (
    <>
      <div>Congratulations, your appointment has been booked Successfully</div>
      <div>Doctor = {selectedDoctor}</div>
      <div>Patient = {patientId}</div>
      <div>Timing = {timing}</div>
    </>
  );
};

export default BookAppointmentDoctorPage2;
