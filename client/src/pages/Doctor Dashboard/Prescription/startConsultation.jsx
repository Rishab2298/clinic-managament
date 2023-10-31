import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, message } from "antd";
import Medication from "./medication";
import Vitals from "./vitals";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../../redux/features/alertSlice";

const StartConsultation = () => {
  const params = useParams();
  const [patient, setPatient] = useState(null);
  const [medication, setMedication] = useState([]);
  const [vitals, setVitals] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const doctorId = user && user.doctorId;
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
  const handleMedicationData = (data) => {
    setMedication(data);
  };
  const handleVitalsData = (data) => {
    setVitals(data);
  };
  const handleEndConsultation = async (event) => {
    try {
      dispatch(showLoading());

      const data = {
        medication: medication,
        vitalsSce: vitals,
        patient: patient._id,
        doctor: doctorId,
      };

      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/add-prescription",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Prescription succesfully created");
      } else {
        message.error("There is an error in saving your prescription");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };

  return (
    <>
      <Layout patient={patient}>
        <h3>Vitals</h3>
        <Vitals onDataEntered={handleVitalsData} />

        <h3>Medication</h3>
        <Medication onDataEntered={handleMedicationData} />
        <Button onClick={handleEndConsultation}>End Consultation</Button>
      </Layout>
    </>
  );
};

export default StartConsultation;
