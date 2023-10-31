import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

// Define the column headers for the table
const headCells = [
  {
    id: "firstName",
    numeric: false,
    label: "First Name",
  },
  {
    id: "lastName",
    numeric: false,
    label: "Last Name",
  },
  {
    id: "gender",
    numeric: false,
    label: "Gender",
    align: "right",
  },
  {
    id: "phone",
    numeric: true,
    label: "Phone Number",
  },
  {
    id: "age",
    numeric: true,
    label: "Age",
  },
  {
    id: "pincode",
    numeric: true,
    label: "Pincodes",
  },
];

// Helper function to compare two values for sorting
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// Get the appropriate comparator function based on sort order
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Stable sort function for sorting data
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Component for rendering the table headers and handling sorting
function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } = props;

  // Function to handle sorting when a header is clicked
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Prop types for the EnhancedTableHead component
EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// Main PatientsList component
const PatientsList = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("firstName"); // Default orderBy
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [patients, setPatients] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctorId = params.selectedDoctor;
  const timing = params.timing;
  const isBooking = !!(doctorId && timing);

  // Function to fetch patient data from the API
  const getPatients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/doctor/get-all-patients",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setPatients(res.data.data);
      }
    } catch (error) {
      console.log(error);
      // Consider adding error handling and user feedback here
    }
  };

  // Fetch patient data when the component mounts
  useEffect(() => {
    getPatients();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Function to handle clicking on a patient's row

  const handleClick = async (id) => {
    if (isBooking) {
      dispatch(showLoading());

      try {
        const patientId = id;

        // Create an object with the data you want to send
        const requestData = {
          patientId: patientId,
          doctorId: doctorId,
          timing: timing,
        };

        const res = await axios.post(
          "http://localhost:8080/api/v1/doctor/add-new-appointment",
          requestData, // Pass the data as an object
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        dispatch(hideLoading());

        if (res.data.success) {
          message.success("New Appointment Created Successfully!");
          navigate(
            `/doctor/appointment-booked/${doctorId}/${timing}/${patientId}`
          );
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error(error);
        message.error("Something Went Wrong");
      }
    } else {
      // Construct the URL for the patient's profile page
      const profileUrl = `/doctor/prescription/start-consultation/${id}`;

      // Open the URL in a new tab
      window.open(profileUrl, "_blank");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the number of empty rows to display for pagination
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patients.length) : 0;

  // Use useMemo to sort and paginate the patient data
  const visiblePatients = React.useMemo(
    () =>
      stableSort(patients, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, patients]
  );
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={patients.length}
              />
              <TableBody>
                {visiblePatients.map((patient) => {
                  const labelId = `enhanced-table-checkbox-${patient._id}`;

                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick(patient._id)}
                      tabIndex={-1}
                      key={patient._id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        style={{ paddingLeft: "15px" }}
                        align="left"
                      >
                        {patient.firstName}
                      </TableCell>
                      <TableCell align="left">{patient.lastName}</TableCell>
                      <TableCell align="left">{patient.gender}</TableCell>
                      <TableCell align="right">{patient.phone}</TableCell>
                      <TableCell align="right">{patient.age}</TableCell>
                      <TableCell align="right">{patient.pincode}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={patients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
};

export default PatientsList;
