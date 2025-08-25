import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Calendar,
  Loader2,
  AlertCircle,
  Check,
  Shield,
  GraduationCap,
  Sparkles,
} from "lucide-react";

// Configure Axios globally
axios.defaults.headers.post["Content-Type"] = "application/json";

function StudentRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [validationStatus, setValidationStatus] = useState({});
  const navigate = useNavigate();

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English Literature",
    "Psychology",
    "Economics",
    "Political Science",
    "History",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newValidationStatus = { ...validationStatus };
    switch (name) {
      case "name":
        newValidationStatus.name = value.length >= 2;
        break;
      case "email":
        newValidationStatus.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "password":
        newValidationStatus.password = value.length >= 6;
        break;
      case "department":
        newValidationStatus.department = value.length > 0;
        break;
      default:
        break;
    }
    setValidationStatus(newValidationStatus);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(validationStatus).every(Boolean)) {
      setError("Please fill all fields correctly.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://easyfest.onrender.com/auth/students",
        formData
      );

      toast.success("Registration successful! Please log in.");
      navigate("/student/login");
    } catch (err) {
      console.error(err.response || err);
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? "Email already exists."
          : "Registration failed. Please try again.");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/student/login");
  };

  const isFormValid =
    Object.keys(validationStatus).length === 4 &&
    Object.values(validationStatus).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Join EazyFest
            </h1>
            <p className="text-gray-600 font-medium">
              Create your student account
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-all duration-200 ${
                      focusedField === "name"
                        ? "border-blue-500 ring-4 ring-blue-100"
                        : validationStatus.name === false
                        ? "border-red-300"
                        : validationStatus.name === true
                        ? "border-green-300"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {validationStatus.name === true && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    placeholder="your.email@university.edu"
                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-all duration-200 ${
                      focusedField === "email"
                        ? "border-blue-500 ring-4 ring-blue-100"
                        : validationStatus.email === false
                        ? "border-red-300"
                        : validationStatus.email === true
                        ? "border-green-300"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {validationStatus.email === true && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-500" />
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("department")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-all duration-200 appearance-none ${
                    focusedField === "department"
                      ? "border-blue-500 ring-4 ring-blue-100"
                      : validationStatus.department === true
                      ? "border-green-300"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Create a secure password"
                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-all duration-200 ${
                      focusedField === "password"
                        ? "border-blue-500 ring-4 ring-blue-100"
                        : validationStatus.password === false
                        ? "border-red-300"
                        : validationStatus.password === true
                        ? "border-green-300"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  onClick={handleNavigateToLogin}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
            <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">Secure</p>
            <p className="text-xs text-gray-500">Protected data</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
            <GraduationCap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">
              Student Portal
            </p>
            <p className="text-xs text-gray-500">Campus events</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
            <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">Easy Access</p>
            <p className="text-xs text-gray-500">Join events</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRegister;
