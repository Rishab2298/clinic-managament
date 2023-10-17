import React, { useEffect, useState } from "react";

import {
  Chip,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Box,
  Typography,
  Button,
} from "@mui/material";

import axios from "axios";
import dayjs from "dayjs";
import BookAppointmentDoctorPage1 from "./bookAppointmentDoctorPage1";
import { useNavigate } from "react-router-dom";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [value, setValue] = useState(0); // Initialize with a numerical index
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const preComputedAvailability = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/doctor/get-pre-computed-availability",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setData(res.data.data);
        //fetchFinalAvailability(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //const fetchFinalAvailability = async (data) => {
  //  try {
  // } catch (error) {}
  //};
  useEffect(() => {
    async function fetchData() {
      try {
        await preComputedAvailability();
        // After data is fetched, set dataFetched to true
        setDataFetched(true);
      } catch (error) {
        console.error(error);
        // Handle error if the data fetch fails
      }
    }

    fetchData();
    setCurrentDate(dayjs());
  }, []);

  const handleClickTimeSlot = async (timing, dayIndex) => {
    // Check the user's role from local storage
    const userRole = localStorage.getItem("role");

    if (userRole === "doctor") {
      // If the user is a doctor, remove the selected time slot from precomputed availability
      const updatedData = [...data]; // Create a copy of the data
      updatedData[dayIndex].timings = updatedData[dayIndex].timings.filter(
        (t) => t !== timing
      );

      try {
        // Update the precomputed availability
        const res = await axios.post(
          "http://localhost:8080/api/v1/doctor/set-pre-computed-availability",
          {
            next30Days: updatedData,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          // If the update is successful, call the create appointment function

          const selectedDoctor = res.data.data.doctorId;

          // Replace with the actual way to get the doctor's ID
          navigate(`/doctor/book-appointment/${selectedDoctor}/${timing}`);
        } else {
          // Handle the case where the update fails
          console.error("Failed to update precomputed availability.");
        }
      } catch (error) {
        console.error(error);
        // Handle any network or server errors
      }
    } else {
      // Handle the case where the user is not a doctor
      console.log("User is not a doctor, cannot remove time slot.");
    }
  };

  const filteredData = data
    .filter(
      (row) =>
        dayjs(row.date).isSame(currentDate, "day") ||
        dayjs(row.date).isAfter(currentDate, "day")
    )
    .map((row) => ({
      ...row,
      timings: row.timings.filter((timing) =>
        dayjs(timing).isAfter(currentDate)
      ),
    }));
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "grey.100",
          display: "flex",
          height: 400,
          width: 320,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {filteredData.map((row, dayIndex) => (
            <Tab
              key={dayIndex}
              label={dayjs(row.date).format(" ddd, D MMM ")}
              {...a11yProps(dayIndex)}
            />
          ))}
        </Tabs>
        {filteredData.map((row, dayIndex) => (
          <TabPanel
            variant="scrollable"
            key={dayIndex}
            value={value}
            index={dayIndex}
            style={{
              width: 180,
              height: 400,
              overflowY: "auto",
            }}
          >
            {row.timings.map((timing, index) => (
              <Button
                key={index}
                variant="contained"
                color="primary"
                onClick={() => handleClickTimeSlot(timing, dayIndex)}
                style={{ marginBottom: 8, width: 120, height: 40 }}
                {...a11yProps(index)}
              >
                {dayjs(timing).format("hh:mm A")}
              </Button>
            ))}
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default BookAppointment;
