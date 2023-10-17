// routeConfig.js
import HomePage from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import DoctorOverview from "./pages/Doctor Dashboard/doctorOverview";
import DoctorLibrary from "./pages/Doctor Dashboard/doctorLibrary";
import DoctorRewards from "./pages/Doctor Dashboard/doctorRewards";
import ScheduleNewAppointments from "./pages/Doctor Dashboard/Appointments/scheduleNewAppointments";
import PastAppointments from "./pages/Doctor Dashboard/Appointments/pastAppointments";
import UpcomingAppointments from "./pages/Doctor Dashboard/Appointments/upcomingAppointments";
import AddNewPatient from "./pages/Doctor Dashboard/Patients/addNewPatient";
import PatientList from "./pages/Doctor Dashboard/Patients/patientList";
import DoctorSettings from "./pages/Doctor Dashboard/Settings/doctorSettings";
import BookAppointmentDoctorPage1 from "./components/BookAppointment/bookAppointmentDoctorPage1";
import BookAppointmentDoctorPage2 from "./components/BookAppointment/bookAppointmentDoctorPage2";
import StartConsultation from "./pages/Doctor Dashboard/Patient Profile/startConsultation";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
    public: true,
  },
  {
    path: "/register",
    element: <Register />,
    public: true,
  }, //=========== Doctor's Dashboard Starts ===================
  {
    path: "/doctor/overview",
    element: <DoctorOverview />,
    protected: true,
  },
  {
    path: "/doctor/library/:id",
    element: <DoctorLibrary />,
    protected: true,
  },
  {
    path: "/doctor/rewards/:id",
    element: <DoctorRewards />,
    protected: true,
  },
  {
    path: "/doctor/appointments/schedule-new-appointment",
    element: <ScheduleNewAppointments />,
    protected: true,
  },
  {
    path: "/doctor/appointments/past-appointments",
    element: <PastAppointments />,
    protected: true,
  },
  {
    path: "/doctor/appointments/upcoming-appointments",
    element: <UpcomingAppointments />,
    protected: true,
  },
  {
    path: "/doctor/patients/add-new-patient",
    element: <AddNewPatient />,
    protected: true,
  },
  {
    path: "/doctor/patients/patient-list/",
    element: <PatientList />,
    protected: true,
  },
  {
    path: "/doctor/settings",
    element: <DoctorSettings />,
    protected: true,
  },
  {
    path: "/doctor/book-appointment/:selectedDoctor/:timing",
    element: <BookAppointmentDoctorPage1 />,
    protected: true,
  },
  {
    path: "/doctor/appointment-booked/:selectedDoctor/:timing/:patientId",
    element: <BookAppointmentDoctorPage2 />,
    protected: true,
  },
  {
    path: "/doctor/patient-profile/start-consultation/:patientId",
    element: <StartConsultation />,
    protected: true,
  },
  //=========== Doctor's Dashboard Ends ===================
];
