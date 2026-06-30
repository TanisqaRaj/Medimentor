import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Always-loaded (tiny, needed on every page)
import NavBar from "./Pharmacy/Components/NavBar";
import Footer from "./Pharmacy/Components/Footer";

// Lazy-loaded — each becomes its own chunk, loaded only when navigated to
const Landing        = lazy(() => import("./Landing"));
const Login          = lazy(() => import("./components/Login"));
const Registration   = lazy(() => import("./components/Registration"));
const About          = lazy(() => import("./components/pages/About"));
const Services       = lazy(() => import("./Pharmacy/Components/navbar/Services"));
const Contact        = lazy(() => import("./components/pages/Contact/Contact"));
const NotFound       = lazy(() => import("./Pharmacy/Components/navbar/NotFound"));
const TermsAndCond   = lazy(() => import("./Pharmacy/Components/hero/footer/TermsAndCond"));
const HelpCenter     = lazy(() => import("./Pharmacy/Components/hero/footer/HelpCenter"));
const PrivacyPolicy  = lazy(() => import("./Pharmacy/Components/hero/footer/PrivacyPolicy"));
const ForgotpasswordEmail = lazy(() => import("./components/ForgotpasswordEmail"));
const ThankYou = lazy(() => import("./components/ThankYou"));

// Pharmacy pages
const PharmacyHome        = lazy(() => import("./Pharmacy/pages/PharmacyHome"));
const ProductDetail       = lazy(() => import("./Pharmacy/pages/ProductDetail"));
const CartPage            = lazy(() => import("./Pharmacy/pages/CartPage"));
const CheckoutPage        = lazy(() => import("./Pharmacy/pages/CheckoutPage"));
const OrdersPage          = lazy(() => import("./Pharmacy/pages/OrdersPage"));
const MyPrescriptions     = lazy(() => import("./Pharmacy/pages/MyPrescriptions"));
const PharmacyAdminDash   = lazy(() => import("./Pharmacy/pages/admin/AdminDashboard"));
const PharmacyAdminMeds   = lazy(() => import("./Pharmacy/pages/admin/AdminMedicines"));
const PharmacyAdminOrders = lazy(() => import("./Pharmacy/pages/admin/AdminOrders"));
const PharmacyAdminRx     = lazy(() => import("./Pharmacy/pages/admin/AdminPrescriptions"));
const PharmacyAdminCats   = lazy(() => import("./Pharmacy/pages/admin/AdminCategories"));

// User dashboard
const Sidebar           = lazy(() => import("./components/dashboard/Sidebar"));
const Content           = lazy(() => import("./components/dashboard/Content"));
const AppointmentList   = lazy(() => import("./components/dashboard/sidebar/AppointmentList"));
const Appointment       = lazy(() => import("./components/dashboard/sidebar/Appointment"));
const BookAppointment   = lazy(() => import("./components/dashboard/sidebar/BookAppointment"));
const AppointmentHistory = lazy(() => import("./components/dashboard/sidebar/AppointmentHistory"));
const UserProfile       = lazy(() => import("./components/dashboard/sidebar/Profile/UserProfile"));
const ScheduledMeet     = lazy(() => import("./components/dashboard/sidebar/ScheduledMeet"));
const Map               = lazy(() => import("./components/Map"));

// Doctor dashboard
const DocSidebar      = lazy(() => import("./components/dashboard/docDash/DocSidebar"));
const DocContent      = lazy(() => import("./components/dashboard/docDash/DocContent"));
const IncomingRequest = lazy(() => import("./components/dashboard/docDash/IncomingRequest"));
const DoctorProfile   = lazy(() => import("./components/dashboard/sidebar/Profile/DoctorProfile"));

// Admin dashboard
const AdminSidebar          = lazy(() => import("./components/Admin/AdminSidebar"));
const AdminContent          = lazy(() => import("./components/Admin/AdminContent"));
const TotalDoctorsList      = lazy(() => import("./components/Admin/TotalDoctorsList"));
const TotalUserList         = lazy(() => import("./components/Admin/TotalUserList"));
const TotalAppointmentList  = lazy(() => import("./components/Admin/TotalAppointmentList"));
const AdminMonitor          = lazy(() => import("./components/Admin/AdminMonitor"));

const Loader = () => (
  <div className="w-full min-h-screen flex items-center justify-center">
    <span className="material-symbols-outlined text-4xl text-emerald-600 animate-spin">progress_activity</span>
  </div>
);

const Page = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <Suspense fallback={<Loader />}>{children}</Suspense>
    <Footer />
  </div>
);

const DashLayout = ({ sidebar, content }) => (
  <Page>
    <div className="flex flex-1 min-h-[calc(100vh-64px)]">
      <Suspense fallback={null}>{sidebar}</Suspense>
      <Suspense fallback={<Loader />}>{content}</Suspense>
    </div>
  </Page>
);

const router = createBrowserRouter([
  // Public
  { path: "/",              element: <Page><Landing /></Page> },
  { path: "/about",         element: <Page><About /></Page> },
  { path: "/services",      element: <Page><Services /></Page> },
  { path: "/contact",       element: <Page><Contact /></Page> },
  { path: "/pharmacy",                    element: <Page><PharmacyHome /></Page> },
  { path: "/pharmacy/product/:id",        element: <Page><ProductDetail /></Page> },
  { path: "/pharmacy/cart",               element: <Page><CartPage /></Page> },
  { path: "/pharmacy/checkout",           element: <Page><CheckoutPage /></Page> },
  { path: "/pharmacy/orders",             element: <Page><OrdersPage /></Page> },
  { path: "/pharmacy/prescriptions",       element: <Page><MyPrescriptions /></Page> },
  { path: "/pharmacy/admin",              element: <ProtectedRoute allowedRoles={["admin"]} element={<Page><PharmacyAdminDash /></Page>} /> },
  { path: "/pharmacy/admin/medicines",    element: <ProtectedRoute allowedRoles={["admin"]} element={<Page><PharmacyAdminMeds /></Page>} /> },
  { path: "/pharmacy/admin/orders",       element: <ProtectedRoute allowedRoles={["admin"]} element={<Page><PharmacyAdminOrders /></Page>} /> },
  { path: "/pharmacy/admin/prescriptions",element: <ProtectedRoute allowedRoles={["admin"]} element={<Page><PharmacyAdminRx /></Page>} /> },
  { path: "/pharmacy/admin/categories",   element: <ProtectedRoute allowedRoles={["admin"]} element={<Page><PharmacyAdminCats /></Page>} /> },
  { path: "/login",         element: <Page><Login /></Page> },
  { path: "/registration",  element: <Page><Registration /></Page> },
  { path: "/terms",         element: <Page><TermsAndCond /></Page> },
  { path: "/privacypolicy", element: <Page><PrivacyPolicy /></Page> },
  { path: "/helpcenter",    element: <Page><HelpCenter /></Page> },
  { path: "/forgotpasswordemail", element: <Page><ForgotpasswordEmail /></Page> },
  { path: "/thankyou", element: <Page><ThankYou /></Page> },

  // User
  { path: "/dashboard",          element: <ProtectedRoute allowedRoles={["user"]} element={<DashLayout sidebar={<Sidebar />} content={<Content />} />} /> },
  { path: "/appointmentlist",    element: <ProtectedRoute allowedRoles={["user"]} element={<DashLayout sidebar={<Sidebar />} content={<AppointmentList />} />} /> },
  { path: "/bookappointment",    element: <ProtectedRoute allowedRoles={["user"]} element={<DashLayout sidebar={<Sidebar />} content={<BookAppointment />} />} /> },
  { path: "/appointmenthistory", element: <ProtectedRoute allowedRoles={["user"]} element={<DashLayout sidebar={<Sidebar />} content={<AppointmentHistory />} />} /> },
  { path: "/userprofile",        element: <ProtectedRoute allowedRoles={["user"]} element={<DashLayout sidebar={<Sidebar />} content={<UserProfile />} />} /> },
  { path: "/scheduledmeet",      element: <ProtectedRoute allowedRoles={["user"]} element={<DashLayout sidebar={<Sidebar />} content={<ScheduledMeet />} />} /> },
  { path: "/map",                element: <ProtectedRoute allowedRoles={["user"]} element={<DashLayout sidebar={<Sidebar />} content={<Map />} />} /> },
  { path: "/appointment",        element: <ProtectedRoute allowedRoles={["user"]} element={<Page><Appointment /></Page>} /> },

  // Doctor
  { path: "/doctordashboard", element: <ProtectedRoute allowedRoles={["doctor"]} element={<DashLayout sidebar={<DocSidebar />} content={<DocContent />} />} /> },
  { path: "/incomingrequest", element: <ProtectedRoute allowedRoles={["doctor"]} element={<DashLayout sidebar={<DocSidebar />} content={<IncomingRequest />} />} /> },
  { path: "/doctorprofile",   element: <ProtectedRoute allowedRoles={["doctor"]} element={<DashLayout sidebar={<DocSidebar />} content={<DoctorProfile />} />} /> },
  { path: "/docmap",          element: <ProtectedRoute allowedRoles={["doctor"]} element={<DashLayout sidebar={<DocSidebar />} content={<Map />} />} /> },

  // Admin
  { path: "/admindashboard",       element: <ProtectedRoute allowedRoles={["admin"]} element={<DashLayout sidebar={<AdminSidebar />} content={<AdminContent />} />} /> },
  { path: "/doctorlist",           element: <ProtectedRoute allowedRoles={["admin"]} element={<DashLayout sidebar={<AdminSidebar />} content={<TotalDoctorsList />} />} /> },
  { path: "/userlist",             element: <ProtectedRoute allowedRoles={["admin"]} element={<DashLayout sidebar={<AdminSidebar />} content={<TotalUserList />} />} /> },
  { path: "/totalappointmentlist", element: <ProtectedRoute allowedRoles={["admin"]} element={<DashLayout sidebar={<AdminSidebar />} content={<TotalAppointmentList />} />} /> },
  { path: "/monitor",              element: <ProtectedRoute allowedRoles={["admin"]} element={<DashLayout sidebar={<AdminSidebar />} content={<AdminMonitor />} />} /> },

  { path: "/*", element: <NotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
