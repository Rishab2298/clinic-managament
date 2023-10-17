import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { showLoading, hideLoading } from "../../../redux/features/alertSlice";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Switch,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { set } from "mongoose";

const initialData = [
  {
    day: "Monday",
    isActive: false,
    session1StartTime: "",
    session1EndTime: "",
    session2StartTime: "",
    session2EndTime: "",
  },
  {
    day: "Tuesday",
    isActive: false,
    session1StartTime: "",
    session1EndTime: "",
    session2StartTime: "",
    session2EndTime: "",
  },
  {
    day: "Wednesday",
    isActive: false,
    session1StartTime: "",
    session1EndTime: "",
    session2StartTime: "",
    session2EndTime: "",
  },
  {
    day: "Thursday",
    isActive: false,
    session1StartTime: "",
    session1EndTime: "",
    session2StartTime: "",
    session2EndTime: "",
  },
  {
    day: "Friday",
    isActive: false,
    session1StartTime: "",
    session1EndTime: "",
    session2StartTime: "",
    session2EndTime: "",
  },
  {
    day: "Saturday",
    isActive: false,
    session1StartTime: "",
    session1EndTime: "",
    session2StartTime: "",
    session2EndTime: "",
  },
  {
    day: "Sunday",
    isActive: false,
    session1StartTime: "",
    session1EndTime: "",
    session2StartTime: "",
    session2EndTime: "",
  },
];

const DoctorSetTimings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataFetched, setDataFetched] = useState(false);
  const [data, setData] = useState([]);

  const [initialDataDb, setInitialDataDb] = useState(null);

  const getAvailability = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/doctor/get-availability",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setInitialDataDb(res.data.data);

        const newData = [...initialData];
        if (res.data.data.length > 0) {
          setData(res.data.data);
        } else {
          setData(newData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        await getAvailability();
        // After data is fetched, set dataFetched to true
        setDataFetched(true);
      } catch (error) {
        console.error(error);
        // Handle error if the data fetch fails
      }
    }

    fetchData();
  }, []);

  const handleSwitchChange = (dayIndex) => {
    const newData = [...data];
    newData[dayIndex].isActive = !newData[dayIndex].isActive;

    // Nullify session times if isActive is false
    if (!newData[dayIndex].isActive) {
      newData[dayIndex].session1StartTime = "";
      newData[dayIndex].session1EndTime = "";
      newData[dayIndex].session2StartTime = "";
      newData[dayIndex].session2EndTime = "";
    }

    setData(newData);
  };

  const handleTimeChange = (dayIndex, session, field, value) => {
    const newData = [...data];

    newData[dayIndex][session + field] = value.toISOString(); // Convert to ISO format
    setData(newData);
  };

  const handleSave = async (event) => {
    try {
      dispatch(showLoading());
      event.preventDefault();

      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/set-availability",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Consultation Time Set Successfully!");
        await preComputeAvailability(data);
        navigate("/doctor/overview");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }

    // You can proceed to save it to your database or perform any other operations

    message.success("Settings saved successfully");
  };
  const preComputeAvailability = async (data) => {
    try {
      const today = dayjs();
      const next30Days = [];

      for (let i = 0; i < 30; i++) {
        const date = today.add(i, "day"); // Use date instead of day
        const dayOfWeek = date.format("dddd");

        // Find the corresponding data for the current day
        const currentDayData = data.find((item) => item.day === dayOfWeek);

        if (currentDayData) {
          const {
            session1StartTime,
            session1EndTime,
            session2StartTime,
            session2EndTime,
          } = currentDayData;

          const slots = [];

          // Generate 15-minute slots between session1 start and end times
          let currentTime = dayjs(session1StartTime);
          while (currentTime.isBefore(session1EndTime)) {
            slots.push(currentTime.toISOString());
            currentTime = currentTime.add(15, "minutes");
          }

          // Generate 15-minute slots between session2 start and end times
          currentTime = dayjs(session2StartTime);
          while (currentTime.isBefore(session2EndTime)) {
            slots.push(currentTime.toISOString());
            currentTime = currentTime.add(15, "minutes");
          }

          // Adjust the date for each slot based on the current day
          const adjustedSlots = slots.map((slot) => {
            return (
              date
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                .format("YYYY-MM-DD") + slot.substring(10)
            );
          });

          next30Days.push({
            day: dayOfWeek,
            isActive: true, // Set to true or false as needed
            timings: adjustedSlots,
            date: date.toISOString(),
          });
        }
      }

      // Call the API to save the next 30 days data
      await axios.post(
        "http://localhost:8080/api/v1/doctor/set-pre-computed-availability",
        {
          next30Days,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success("Pre-computed Availability Set Successfully!");
    } catch (error) {
      console.log(error);
      message.error("Error Pre-computing Availability");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Day</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Session 1 Start</TableCell>
            <TableCell>Session 1 End</TableCell>
            <TableCell>Session 2 Start</TableCell>
            <TableCell>Session 2 End</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, dayIndex) => (
            <TableRow key={row.day}>
              <TableCell>{row.day}</TableCell>
              <TableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => handleSwitchChange(dayIndex)}
                />
              </TableCell>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(row.session1StartTime) || ""}
                    disabled={!row.isActive}
                    label="Session 1 Start"
                    onChange={(value) =>
                      handleTimeChange(dayIndex, "session1", "StartTime", value)
                    }
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(row.session1EndTime) || ""}
                    disabled={!row.isActive}
                    label="Session 1 End"
                    onChange={(value) =>
                      handleTimeChange(dayIndex, "session1", "EndTime", value)
                    }
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(row.session2StartTime) || ""}
                    disabled={!row.isActive}
                    label="Session 2 Start"
                    onChange={(value) =>
                      handleTimeChange(dayIndex, "session2", "StartTime", value)
                    }
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(row.session2EndTime) || ""}
                    disabled={!row.isActive}
                    required={row.isActive}
                    label="Session 2 End"
                    onChange={(value) =>
                      handleTimeChange(dayIndex, "session2", "EndTime", value)
                    }
                  />
                </LocalizationProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </TableContainer>
  );
};

export default DoctorSetTimings;
