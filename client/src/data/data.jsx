import DraftsIcon from "@mui/icons-material/Drafts";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import GroupsIcon from "@mui/icons-material/Groups";
import MasksIcon from "@mui/icons-material/Masks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PublicIcon from "@mui/icons-material/Public";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReorderIcon from "@mui/icons-material/Reorder";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import React from "react";

export const userMenu = [
  {
    name: "Home",
    link: "/",
    icon: <DraftsIcon />,
  },
  {
    name: "Appointments",
    link: "/appointments",
    icon: <DraftsIcon />,
  },
  {
    name: "Apply Doctor",
    link: "/apply-doctor",
    icon: <DraftsIcon />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <DraftsIcon />,
  },
];

// admin menu
export const adminMenu = [
  {
    name: "Home",
    link: "/",
    icon: <DraftsIcon />,
  },

  {
    name: "Doctors",
    link: "/admin/doctors",
    icon: <DraftsIcon />,
  },
  {
    name: "Users",
    link: "/admin/users",
    icon: <DraftsIcon />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <DraftsIcon />,
  },
];
export const patientMenu = [
  {
    name: "Home",
    link: "/",
    icon: <DraftsIcon />,
  },

  {
    name: "Doctors",
    link: "/admin/doctors",
    icon: "-doctor",
  },
  {
    name: "Users",
    link: "/admin/users",
    icon: <DraftsIcon />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <DraftsIcon />,
  },
];
export const menu = [
  //baically a logged out menu
  {
    name: "Home",
    link: "/",
    icon: <DraftsIcon />,
  },

  {
    name: "Register",
    link: "/register",
    icon: <DraftsIcon />,
  },
  {
    name: "Login",
    link: "/login",
    icon: <DraftsIcon />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <DraftsIcon />,
  },
];

export const doctorMenu = [
  {
    name: "Overview",
    link: "/doctor/overview",
    icon: <PublicIcon />,
  },
  {
    name: "Appointments",
    link: "",
    icon: <CalendarMonthIcon />,
    nestedItems: [
      {
        name: "Upcoming",
        icon: <DateRangeIcon />,
        link: "/doctor/appointments/upcoming-appointments",
      },
      {
        name: "Schedule",
        icon: <EditCalendarIcon />,
        link: "/doctor/appointments/schedule-new-appointment",
      },
      {
        name: "Past",
        icon: <EventRepeatIcon />,
        link: "/doctor/appointments/past-appointments",
      },
    ],
  },
  {
    name: "Patients",
    link: "",
    icon: <MasksIcon />,
    nestedItems: [
      {
        name: "Add New",
        icon: <PersonAddIcon />,
        link: "/doctor/patients/add-new-patient",
      },
      {
        name: "Patient List",
        icon: <ReorderIcon />,
        link: "/doctor/patients/patient-list",
      },
    ],
  },
  {
    name: "Library",
    link: "/doctor/library/:id", //is there any other way to get the id?
    icon: <CollectionsBookmarkIcon />,
  },
  {
    name: "Rewards",
    link: "/doctor/rewards/:id",
    icon: <EmojiEventsIcon />,
  },
];

export const doctorSecondaryMenu = [
  {
    name: "Profile",
    link: "/doctor/profile",
    icon: <PersonIcon />,
  },
  {
    name: "Settings",
    link: "/doctor/settings",
    icon: <SettingsIcon />,
  },
  {
    name: "Support",
    link: "/doctor/support",
    icon: <SupportAgentIcon />,
  },
  {
    name: "Billing",
    link: "/doctor/billing/:id",
    icon: <ReceiptLongOutlinedIcon />,
  },
];
