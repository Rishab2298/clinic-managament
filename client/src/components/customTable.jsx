import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import dayjs from "dayjs";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { visuallyHidden } from "@mui/utils";
import { Button, ButtonGroup } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { message } from "antd";

// sample row data

{
  /*
  row = {_id: '6515d21b956512256e44c024', userId: '65032504a2a02216ae184959', doctorId: '650d450a8cb2ba069fd97c1c', patientId: '6515d21b956512256e44c024', status: 'confirmed', …}
address :  "Plot No. 148, Phase 2, GK Estate, Mundian Kalan"
age :  25
appointments :  (4) ['651da6b3813802080a3b44de', '651e84b4ff3722715077e29d', '651e8539ff3722715077e3e2', '6526920be75a088cae5f0a71']
createdAt :  "2023-09-28T19:20:59.464Z"
dateOfBirth : "1998-06-21T18:30:00.000Z"
doctorId :  "650d450a8cb2ba069fd97c1c"
doctorsConsulted :  ['650d450a8cb2ba069fd97c1c']
email :  "rishab@zionwebservices.com"
firstName : "Rishab"
gender :  "Male"
lastName : "Jain"
patientId : "6515d21b956512256e44c024"
phone : 7463998625
pincode : 141015
status:"confirmed"
timing:"2023-10-14T05:00:00.000Z"
updatedAt : "2023-10-11T12:16:12.764Z"
userId : "65032504a2a02216ae184959"
__v :  20
_id :  "6515d21b956512256e44c024" //This is appointment id
*/
}
const options = [
  "Start Consultation",
  "Cancel",
  "Ask to Reschedule",
  "Approve",
  "No Show",
];
// Define the column headers for the table
function EnhancedTableHead({ columns, order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? "right" : "left"}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
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

const ActionCell = ({ options, row, columnId }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // Initialize with the default index
  const dispatch = useDispatch();

  //function to be run when start consultation is clicked
  async function startConsultation(row) {
    const profileUrl = `/doctor/patient-profile/${row.patientId}`;
    try {
      dispatch(showLoading());
      const data = {
        appointmentId: row._id,
        status: "in progress",
      };

      if (!data.appointmentId || !data.status) {
        message.error("Please fill in required fields.");
        dispatch(hideLoading());
        return;
      }

      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/update-appointment-status",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Consultation Started Successfully");
        window.open(profileUrl, "_blank");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something Went Wrong");
    }
  }

  //function to be run when cancel consultation is clicked
  async function cancelConsultation(row) {
    try {
      dispatch(showLoading());
      const data = {
        appointmentId: row._id,
        status: "cancelled by doctor",
      };

      if (!data.appointmentId || !data.status) {
        message.error("Please fill in required fields.");
        dispatch(hideLoading());
        return;
      }

      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/update-appointment-status",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.error("Consultation Cancelled");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something Went Wrong");
    }
  }

  //function to be run when ask to Reschedule is clicked
  async function askToReschedule(row) {
    try {
      dispatch(showLoading());
      const data = {
        appointmentId: row._id,
        status: "rescheduled",
      };

      if (!data.appointmentId || !data.status) {
        message.error("Please fill in required fields.");
        dispatch(hideLoading());
        return;
      }

      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/update-appointment-status",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Patient has been asked to Reschedule");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something Went Wrong");
    }
  }

  //function to be run when No Show is clicked
  async function noShow(row) {
    try {
      dispatch(showLoading());
      const data = {
        appointmentId: row._id,
        status: "no Show",
      };

      if (!data.appointmentId || !data.status) {
        message.error("Please fill in required fields.");
        dispatch(hideLoading());
        return;
      }

      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/update-appointment-status",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Consultation Has been marked as no show");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something Went Wrong");
    }
  }

  //function to be run when consultation is approved
  async function approveConsultation(row) {
    try {
      dispatch(showLoading());
      const data = {
        appointmentId: row._id,
        status: "confirmed",
      };

      if (!data.appointmentId || !data.status) {
        message.error("Please fill in required fields.");
        dispatch(hideLoading());
        return;
      }

      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/update-appointment-status",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Consultation Approved Successfully");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something Went Wrong");
    }
  }

  useEffect(() => {
    if (row.status === "scheduled") {
      setSelectedIndex(3);
    } else {
      setSelectedIndex(0); // Set to the index corresponding to "Ask to Reschedule"
    }
  }, [row.status]);

  const handleClick = () => {
    const selectedOption = options[selectedIndex];
    switch (selectedOption) {
      case "Start Consultation":
        startConsultation(row);
        break;
      case "Approve":
        approveConsultation(row);
        break;

      default:
        break;
    }

    console.info(`You clicked ${selectedOption} for row with ID ${row._id}`);
  };

  const handleMenuItemClick = (event, index) => {
    const selectedOption = options[index];
    switch (selectedOption) {
      case "Start Consultation":
        startConsultation(row);
        break;
      case "Approve":
        approveConsultation(row);
        break;
      case "Ask to Reschedule":
        askToReschedule(row);
        break;
      case "Cancel":
        cancelConsultation(row);
        break;
      case "No Show":
        noShow(row);
        break;

      default:
        break;
    }
    console.info(`You clicked ${options[index]} for row with ID ${row._id}`);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

// Component for rendering the table headers and handling sorting

EnhancedTableHead.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function CustomTable({ data, columns, defaultOrderBy }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(defaultOrderBy); // Default orderBy
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleData = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer sx={{ minWidth: 750 }} size="medium">
        <Table>
          <EnhancedTableHead
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {visibleData.map((row) => (
              <TableRow key={row._id}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.numeric ? "right" : "left"}
                  >
                    {column.isDate ? (
                      dayjs(row[column.id]).format("DD MMMM YYYY hh:mm A")
                    ) : column.id === "action" ? (
                      <ActionCell
                        options={options}
                        row={row}
                        columnId={column.id}
                      />
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

CustomTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultOrderBy: PropTypes.string.isRequired,
};

export default CustomTable;
