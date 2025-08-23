import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import StudentRegister from "./components/StudentRegister";
import StudentLogin from "./components/StudentLogin";
import StudentDashboard from "./components/StudentDashboard";
import StudentRegistrations from "./components/StudentRegistrations";
import EventDetails from "./components/EventDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppLayout({ children }) {
  const location = useLocation();
  const hideNavFooter = ["/student/login", "/student/register"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/events/:eventId" element={<EventDetails />} />

          {/* Protected pages */}
          <Route
            path="/student/registrations"
            element={
              <ProtectedRoute>
                <StudentRegistrations />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
