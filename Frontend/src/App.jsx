import "./App.css";
import About from "./components/pages/About";
import Header from "./Pharmacy/Components/Header";
import Footer from "./Pharmacy/Components/Footer";
import Hero from "./Pharmacy/Components/hero/Hero";
import NavBar from "./Pharmacy/Components/NavBar";
import Services from "./Pharmacy/Components/navbar/Services";
import Contact from "./components/pages/Contact/Contact";
import NotFound from "./Pharmacy/Components/navbar/NotFound";
import Carousel from "./Pharmacy/Components/hero/Carousel";
import TermsAndCond from "./Pharmacy/Components/hero/footer/TermsAndCond";
import HelpCenter from "./Pharmacy/Components/hero/footer/HelpCenter";
import Registration from "./components/Registration";
import PrivacyPolicy from "./Pharmacy/Components/hero/footer/PrivacyPolicy";
import Landing from "./Landing";
import Login from "./components/Login";
import Sidebar from "./components/dashboard/Sidebar";
import Content from "./components/dashboard/Content";
import AppointmentList from "./components/dashboard/sidebar/AppointmentList";
import Appointment from "./components/dashboard/sidebar/Appointment";
import BookAppointment from "./components/dashboard/sidebar/BookAppointment";
import DocSidebar from "./components/dashboard/docDash/DocSidebar";
import DocContent from "./components/dashboard/docDash/DocContent";
import IncomingRequest from "./components/dashboard/docDash/IncomingRequest";
import AppointmentHistory from "./components/dashboard/sidebar/AppointmentHistory";
import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminContent from "./components/Admin/AdminContent";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import TotalDoctorsList from "./components/Admin/TotalDoctorsList";
import TotalUserList from "./components/Admin/TotalUserList";
import TotalAppointmentList from "./components/Admin/TotalAppointmentList";
import UserProfile from "./components/dashboard/sidebar/Profile/UserProfile";
import DoctorProfile from "./components/dashboard/sidebar/Profile/DoctorProfile";
import Map from "./components/Map";
import ScheduledMeet from "./components/dashboard/sidebar/ScheduledMeet";
import ForgotpasswordEmail from "./components/ForgotpasswordEmail";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="relative">
          <NavBar />
          <Landing />
          <Footer />
        </div>
      ),
    },
    {
      path: "/about",
      element: (
        <div>
          <NavBar />
          <About />
          <Footer />
        </div>
      ),
    },
    {
      path: "/services",
      element: (
        <div>
          <NavBar />
          <Services />
          <Footer />
        </div>
      ),
    },
    {
      path: "/contact",
      element: (
        <div>
          <NavBar />
          <Contact />
          <Footer />
        </div>
      ),
    },
    {
      path: "/pharmacy",
      element: (
        <div>
          <NavBar />
          <Header />
          <Carousel />
          <Hero />
          <Footer />
        </div>
      ),
    },
    {
      path: "/login",
      element: (
        <div>
          <NavBar />
          <Login />,
          <Footer />
        </div>
      ),
    },
    {
      path: "/registration",
      element: (
        <div>
          <NavBar />
          <Registration />,
          <Footer />
        </div>
      ),
    },
    {
      path: "/terms",
      element: (
        <div>
          <NavBar />
          <TermsAndCond />
          <Footer />
        </div>
      ),
    },
    {
      path: "/privacypolicy",
      element: (
        <div>
          <NavBar />
          <Carousel />
          <PrivacyPolicy />
          <Footer />
        </div>
      ),
    },
    {
      path: "/helpcenter",
      element: (
        <div>
          <NavBar />
          <HelpCenter />
          <Footer />
        </div>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <Content />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/appointmentlist",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <AppointmentList />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/appointment",
      element: (
        <div>
          <NavBar />
          <Appointment />
          <Footer />
        </div>
      ),
    },
    {
      path: "/bookappointment",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <BookAppointment />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/appointmenthistory",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <AppointmentHistory/>
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/doctordashboard",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <DocSidebar/>
            <DocContent />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/incomingrequest",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <DocSidebar />
            <IncomingRequest />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/appointmenthistory",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <DocSidebar />
            <AppointmentHistory />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/admindashboard",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <AdminSidebar />
            <AdminContent />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/doctorlist",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <AdminSidebar />
            <TotalDoctorsList />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/userlist",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <AdminSidebar />
            <TotalUserList />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path:"/totalappointmentlist",
      element: (
        <div>
          <NavBar />
          <div className="w-full flex">
            <AdminSidebar />
            <TotalAppointmentList />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path:"/userprofile",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <UserProfile />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path:"/doctorprofile",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <DocSidebar />
            <DoctorProfile />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path:"/scheduledmeet",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <ScheduledMeet />
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/map",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <Map/>
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/docmap",
      element: (
        <div>
          <NavBar />
          <div className="flex">
            <DocSidebar />
            <Map/>
          </div>
          <Footer />
        </div>
      ),
    },
    {
      path: "/forgotpasswordemail",
      element: (
        <div>
          <NavBar />
          <ForgotpasswordEmail/>
          <Footer />
        </div>
      ),
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
