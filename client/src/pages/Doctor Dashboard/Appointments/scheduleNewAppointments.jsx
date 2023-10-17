import React from "react";
import Layout from "../../../components/layout";
import BookAppointment from "../../../components/BookAppointment/bookAppointment";
const ScheduleNewAppointments = () => {
  return (
    <>
      <Layout>
        <h2>Schedule New Appointments</h2>
        <BookAppointment />
      </Layout>
    </>
  );
};

export default ScheduleNewAppointments;
