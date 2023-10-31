import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, message } from "antd";
import Medication from "./medication";
import Diagnosis from "./diagnosis";
import Symptoms from "./symptoms";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../../redux/features/alertSlice";
import { Col, Form, InputNumber, Row } from "antd";
import "./example.css";

const StartConsultation = () => {
  const params = useParams();
  const [patient, setPatient] = useState(null);
  const [medication, setMedication] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [symptoms, setSymptoms] = useState([]);

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
  const handleDiagnosisData = (data) => {
    setDiagnosis(data);
  };
  const handleSymptomsData = (data) => {
    setSymptoms(data);
  };
  let vitals;
  const handleSave = (values) => {
    vitals = values;
    // This may not reflect the updated state immediately
    handleEndConsultation();
  };
  const handleEndConsultation = async (event) => {
    try {
      dispatch(showLoading());

      const data = {
        medication: medication,
        diagnosis: diagnosis,
        vitals: vitals,
        symptoms: symptoms,
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
        <h2
          style={{
            padding: "20px 5px 10px 10px",
            fontWeight: "500",
          }}
        >
          Vitals
        </h2>

        <div className="vitals-div-style">
          <Form
            layout="horizontal"
            className="vitals-form-style"
            onFinish={(values) => handleSave(values)}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 48, lg: 48 }}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item label="Height" name="height">
                  <InputNumber addonAfter="cm" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item label="Weight" name="weight">
                  <InputNumber addonAfter="kg" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item label="Pulse" name="pulseRate">
                  <InputNumber addonAfter="/min" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item label="Temperature" name="temperature">
                  <InputNumber addonAfter="F" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item label="Systolic BP" name="bloodPressureSystolic">
                  <InputNumber addonAfter="mmHg" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item label="Diastolic BP" name="bloodPressureDiastolic">
                  <InputNumber addonAfter="mmHg" />
                </Form.Item>
              </Col>
            </Row>

            <h2
              style={{
                padding: "40px 5px 10px 10px",
                fontWeight: "500",
              }}
            >
              Medication
            </h2>

            <Medication onDataEntered={handleMedicationData} />
            <h2
              style={{
                padding: "40px 5px 10px 10px",
                fontWeight: "500",
              }}
            >
              Diagnosis
            </h2>

            <Diagnosis onDataEntered={handleDiagnosisData} />
            <h2
              style={{
                padding: "40px 5px 10px 10px",
                fontWeight: "500",
              }}
            >
              Symptoms
            </h2>

            <Symptoms onDataEntered={handleSymptomsData} />
            <Button
              style={{ margin: "20px 0", marginLeft: "auto", display: "block" }}
              type="primary"
              htmlType="submit"
            >
              End Consultation
            </Button>
          </Form>
        </div>
      </Layout>
    </>
  );
};

export default StartConsultation;
