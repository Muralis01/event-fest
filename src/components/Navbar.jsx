import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CollegeEventIcon from '../assets/college-event-icon.svg'; // Adjust the path as necessary

import { toast } from "react-toastify";
import {
  User,
  LogOut,
  Settings,
  Calendar,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  // Update login state and user info from localStorage
  useEffect(() => {
    const updateUserState = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name") || "User";
      const email = localStorage.getItem("email") || "user@example.com";
      const role = localStorage.getItem("role") || "Student";

      setIsLoggedIn(!!token);
      if (token) {
        setUser({ name, email, role });
      } else {
        setUser({ name: "", email: "", role: "" });
        setUserDropdown(false);
      }
    };

    updateUserState();

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener("storage", updateUserState);

    // Re-check on location change to handle login redirects
    return () => window.removeEventListener("storage", updateUserState);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    setIsLoggedIn(false);
    setUserDropdown(false);
    setUser({ name: "", email: "", role: "" });
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div >
              <img
                src={CollegeEventIcon}
                alt="EazyFest Logo"
                className="w-13 h-13 rounded-full"
              />
            </div>
          
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EazyFest
            </h1>
            <p className="text-xs text-gray-500 font-medium">College Events</p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Dropdown */}
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-3 p-2 rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-white"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-24">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        {/* <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p> */}
                        <p className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/student/registrations");
                        setUserDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                    >
                      <Calendar className="w-4 h-4 text-blue-500" />
                      My Registrations
                    </button>
                    <button
                      onClick={() => {
                        navigate("/student/profile");
                        setUserDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Profile Settings
                    </button>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/student/login")}
                className="text-gray-600 hover:text-blue-600 font-medium px-2 py-1"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/student/register")}
                className="text-white px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-md"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;