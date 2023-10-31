import React, { useEffect, useState, useMemo, useRef } from "react";

import axios from "axios";

import Layout from "../../../components/layout";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { showLoading, hideLoading } from "../../../redux/features/alertSlice";
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Skeleton,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { message } from "antd";

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
  {
    id: "action",
    numeric: false,
    label: "Action",
    align: "right",
    isDate: false,
  },
];

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
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dispatch = useDispatch();

  const actionFunctions = {
    "Start Consultation": () => handleAction("in progress"),
    Approve: () => handleAction("confirmed"),
    "Ask to Reschedule": () => handleAction("rescheduled"),
    Cancel: () => handleAction("cancelled by doctor"),
    "No Show": () => handleAction("no Show"),
  };

  const handleAction = async (status) => {
    try {
      dispatch(showLoading());
      const data = {
        appointmentId: row._id,
        status,
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
        message.success(`Consultation ${status} Successfully`);
        if (status === "in progress") {
          const profileUrl = `/doctor/prescription/start-consultation/${row.patientId}`;
          window.open(profileUrl, "_blank");
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    setSelectedIndex(row.status === "scheduled" ? 3 : 0);
  }, [row.status]);

  const handleClick = () => {
    const selectedOption = options[selectedIndex];
    if (actionFunctions[selectedOption]) {
      actionFunctions[selectedOption]();
    }

    console.info(`You clicked ${selectedOption} for row with ID ${row._id}`);
  };

  const handleMenuItemClick = (event, index) => {
    const selectedOption = options[index];
    if (actionFunctions[selectedOption]) {
      actionFunctions[selectedOption]();
    }
    setOpen(false);
    console.info(`You clicked ${options[index]} for row with ID ${row._id}`);
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
        sx={{ zIndex: 1 }}
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

const MyComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("firstName"); // Default orderBy
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loadings, setLoadings] = useState(true);
  const dispatch = useDispatch();

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
          dispatch(hideLoading());
          setLoadings(false);
          setAppointments(res.data.data);
        }
      } catch (error) {
        dispatch(hideLoading());
        setLoadings(false);
        console.log(error);
        // Consider adding error handling and user feedback here
      } finally {
        // Hide loading spinner when the fetching is complete
        dispatch(hideLoading());
        setLoadings(false); // Set loading state to false
      }
    }

    fetchData();
  }, [loadings]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Filter based on both time and status
      return (
        appointment.status === "scheduled" || appointment.status === "confirmed"
      );
    });
  }, [appointments]);
  const visibleData = React.useMemo(
    () =>
      stableSort(filteredAppointments, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredAppointments]
  );

  return (
    <div>
      <Layout>
        {loadings ? (
          <Stack spacing={1}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            {/* For other variants, adjust the size with `width` and `height` */}

            <Skeleton variant="rectangular" width={360} height={60} />
            <Skeleton
              variant="rounded"
              width="95%"
              height={60}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width="95%"
              height={60}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width="95%"
              height={60}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width="95%"
              height={60}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width="95%"
              height={60}
              animation="wave"
            />
          </Stack>
        ) : (
          <div>
            <h1>Upcoming Appointments</h1>
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
                              dayjs(row[column.id]).format(
                                "DD MMMM YYYY hh:mm A"
                              )
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
                count={filteredAppointments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default MyComponent;
