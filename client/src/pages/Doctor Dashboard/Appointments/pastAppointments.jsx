import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import CustomTable from "../../../components/CustomTable";
import Layout from "../../../components/layout";
import dayjs from "dayjs";

import { useDispatch } from "react-redux";

const columns = [
  {
    id: "firstName",
    numeric: false,
    label: "First Name",
    isDate: false,
  },
  {
    id: "age",
    numeric: true,
    label: "Age",
    isDate: false,
  },
  {
    id: "phone",
    numeric: true,
    label: "phone",
    isDate: false,
  },
  {
    id: "gender",
    numeric: false,
    label: "Gender",
    align: "right",
    isDate: false,
  },
  {
    id: "timing",
    numeric: false,
    label: "Timing",
    isDate: true,
  },
  {
    id: "status",
    numeric: false,
    label: "Status",
    align: "right",
    isDate: false,
  },
];

const MyComponent = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch patient data when the component mounts
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/doctor/get-all-appointments",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setAppointments(res.data.data);
        }
      } catch (error) {
        console.log(error);
        // Consider adding error handling and user feedback here
      }
    }

    fetchData();
  }, []);

  const filteredAppointments = useMemo(() => {
    const currentTime = dayjs();
    const oneHourBeforeCurrentTime = currentTime.subtract(1, "hour");

    return appointments.filter((appointment) => {
      const appointmentTime = dayjs(appointment.timing);

      // Filter based on both time and status
      return (
        appointment.status !== "scheduled" && appointment.status !== "confirmed"
      );
    });
  }, [appointments]);

  return (
    <div>
      <Layout>
        <h1>Past Appointments</h1>
        <CustomTable
          data={filteredAppointments}
          columns={columns}
          defaultOrderBy="firstName"
        />
      </Layout>
    </div>
  );
};

export default MyComponent;
