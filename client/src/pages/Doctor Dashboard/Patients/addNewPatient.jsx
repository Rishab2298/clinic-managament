import React, { useRef } from "react";
import Layout from "../../../components/layout";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";
import { message } from "antd";
import Button from "@mui/material/Button";

const AddNewPatient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    pincode: "",
    address: "",
    dateOfBirth: null,
    gender: "",
  });
  //const currentDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(null);
  //const saveButtonRef = useRef(null);
  //const saveAndStartConsultationButtonRef = useRef(null);

  const handleSubmit = async (event, buttonType) => {
    try {
      dispatch(showLoading());
      event.preventDefault();
      const formData = {
        email: document.getElementById("email").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phone: document.getElementById("phone").value,
        pincode: document.getElementById("pincode").value,
        address: document.getElementById("address").value,
        dateOfBirth: selectedDate,
        gender: document.getElementById("gender").value,
      };

      try {
        dispatch(showLoading());

        // Input validation
        if (
          !formData.email ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.phone ||
          !formData.gender ||
          !formData.dateOfBirth ||
          !formData.lastName
        ) {
          message.error("Please fill in required fields.");
          dispatch(hideLoading());
          return;
        }

        const res = await axios.post(
          "http://localhost:8080/api/v1/doctor/add-new-patient",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        dispatch(hideLoading());

        if (res.data.success) {
          message.success("Patient Added Successfully!");
          if (buttonType === "save") {
            navigate("/doctor/patients/patient-list");
          } else if (buttonType === "saveAndStartConsultation") {
            console.log(res.data.data);
            navigate(
              `/doctor/prescription/start-consultation/${res.data.data._id}`
            );
          }
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error(error);
        message.error("Something Went Wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Layout>
        <Typography variant="h6" gutterBottom>
          Create New Patient
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id="firstName"
                name="firstName"
                label="First name"
                fullWidth
                autoComplete="given-name"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id="lastName"
                name="lastName"
                label="Last name"
                fullWidth
                autoComplete="family-name"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ margin: "0", padding: "0" }}
                >
                  <DatePicker
                    required
                    label="Date of Birth"
                    sx={{
                      width: "100%",
                    }}
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    item
                    fullWidth
                    format="DD/MM/YYYY"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="phone"
                name="phone"
                label="phone"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="address"
                name="address"
                label="Address"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id="gender"
                name="gender"
                label="Gender"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id="email"
                name="email"
                label="email"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="pincode"
                name="pincode"
                label="Pincode"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(event) => handleSubmit(event, "save")}
                //ref={saveButtonRef} // Add a name to the button
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(event) =>
                  handleSubmit(event, "saveAndStartConsultation")
                }
                //ref={saveAndStartConsultationButtonRef} // Add a name to the button
              >
                Save & Start Consultation
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export default AddNewPatient;
