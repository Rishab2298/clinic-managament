import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import Prescription from "./prescription";
const StartConsultation = () => {
  const params = useParams();
  const [patient, setPatient] = useState(null);
  useEffect(() => {
    const patientId = params.patientId;
    // Fetch patient data when the component mounts
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/doctor/get-patient/${patientId}`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          if (res.data.data.isDoctorConsulted) {
            setPatient(res.data.data.patient);
          } else {
            setPatient(null);
            message.error(
              "You're not allowed to access this Patient's Profile"
            );
            window.close();
          }
        }
      } catch (error) {
        console.log(error);
        // Consider adding error handling and user feedback here
      }
    }

    fetchData();
  }, []);
  return (
    <>
      <Layout patient={patient}>
        <Prescription />
      </Layout>
    </>
  );
};

export default StartConsultation;