import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Eye,
  Trash2,
  Search,
  Grid,
  List,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarCheck,
  TrendingUp,
  Award,
  BookmarkCheck,
} from "lucide-react";

function StudentRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [cancellingIds, setCancellingIds] = useState(new Set());

  const navigate = useNavigate();

  const filterOptions = [
    { value: "all", label: "All Events", icon: Calendar },
    { value: "upcoming", label: "Upcoming", icon: TrendingUp },
    { value: "attended", label: "Attended", icon: Award },
    { value: "missed", label: "Missed", icon: XCircle },
  ];

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("studentId");

    if (!token || !studentId) {
      toast.error("Please log in again");
      navigate("/student/login");
      return;
    }

    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/registrations/students/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setRegistrations(response.data || []);
        setFilteredRegistrations(response.data || []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("API Error:", err.response?.data || err.message);

        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/student/login");
        } else {
          toast.error(
            err.response?.data?.message || "Failed to load registrations."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
    return () => controller.abort();
  }, [navigate]);

  useEffect(() => {
    let filtered = registrations;

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.event?.eventName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          r.event?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.event?.venue?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

   if (selectedFilter !== "all") {
  filtered = filtered.filter((r) => {
    const today = new Date();
    const eventDate = r.event?.date ? new Date(r.event.date) : null;
    const isUpcoming = eventDate && eventDate >= today;
    const isPast = eventDate && eventDate < today;

    switch (selectedFilter) {
      case "upcoming":
        return isUpcoming;
      case "attended":
        return isPast && r.attended === true; // ✅ only past events that were attended
      case "missed":
        return isPast && r.attended === false; // ✅ only past events that were missed
      default:
        return true;
    }
  });
}

    setFilteredRegistrations(filtered);
  }, [registrations, searchQuery, selectedFilter]);

  const handleViewDetails = (eventId) => {
    if (!eventId || isNaN(Number(eventId))) {
      toast.error("Invalid event ID.");
      return;
    }
    navigate(`/student/events/${eventId}`);
  };

  const handleCancelRegistration = async (registrationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again");
      navigate("/student/login");
      return;
    }

    setCancellingIds((prev) => new Set(prev).add(registrationId));

    try {
      await axios.delete(
        `http://localhost:8080/api/registrations/${registrationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRegistrations((prev) =>
        prev.filter((r) => r.registrationId !== registrationId)
      );

      toast.success("Registration cancelled successfully!");
    } catch (err) {
      console.error("Cancel Error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        navigate("/student/login");
      } else if (err.response?.status === 403) {
        toast.error("You can only cancel your own registrations.");
      } else if (err.response?.status === 404) {
        toast.error("Registration not found.");
      } else {
        toast.error(
          err.response?.data?.message || "Failed to cancel registration."
        );
      }
    } finally {
      setCancellingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getStatusBadge = (event, attended) => {
    const today = new Date(); // Use current date and time
    const eventDate = event?.date ? new Date(event.date) : null;
    const isUpcoming = eventDate && eventDate >= today;

    if (isUpcoming) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
          <Calendar className="w-3 h-3" />
          Upcoming
        </span>
      );
    } else if (!isUpcoming && attended) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
          <CheckCircle className="w-3 h-3" />
          Attended
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
          <XCircle className="w-3 h-3" />
          Missed
        </span>
      );
    }
  };

  const getRegistrationStats = () => {
    const today = new Date(); // Use current date and time
    const total = registrations.length;
    const upcoming = registrations.filter((r) => {
      const eventDate = r.event?.date ? new Date(r.event.date) : null;
      return eventDate && eventDate >= today;
    }).length;
    const attended = registrations.filter((r) => r.attended).length;
    const completed = registrations.filter((r) => {
      const eventDate = r.event?.date ? new Date(r.event.date) : null;
      return eventDate && eventDate < today;
    }).length;
    const completionRate = completed > 0 ? Math.round((attended / total) * 100) : 0;

    return { total, upcoming, attended, completed, completionRate };
  };

  const stats = getRegistrationStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            Loading your registrations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Registered Events
            </h1>
            <p className="text-lg text-gray-600">
              Track your event participation and manage registrations
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Events
                  </p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <CalendarCheck className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Attended</p>
                  <p className="text-3xl font-bold">{stats.attended}</p>
                </div>
                <Award className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Upcoming
                  </p>
                  <p className="text-3xl font-bold">{stats.upcoming}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Completion Rate
                  </p>
                  <p className="text-3xl font-bold">{stats.completionRate}%</p>
                </div>
                <Award className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, categories, venues..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {filterOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedFilter(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedFilter === value
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-blueTwig -e600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations List/Grid */}
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
              <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {registrations.length === 0
                  ? "No registered events"
                  : "No events match your search"}
              </h3>
              <p className="text-gray-600 mb-6">
                {registrations.length === 0
                  ? "You haven't registered for any events yet. Explore our events and join the ones you're interested in!"
                  : "Try adjusting your search or filters to find your registered events."}
              </p>
              {registrations.length === 0 && (
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explore Events
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
            }
          >
            {filteredRegistrations.map((registration) => {
              const { event } = registration;
              const isCancelling = cancellingIds.has(
                registration.registrationId
              );

              if (!event) {
                return (
                  <div
                    key={registration.registrationId}
                    className="bg-white rounded-2xl shadow-sm border border-red-200 p-6"
                  >
                    <div className="text-center">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-600 mb-2">
                        Invalid Event
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        This registration references a missing or deleted event.
                      </p>
                      <button
                        onClick={() =>
                          handleCancelRegistration(registration.registrationId)
                        }
                        disabled={isCancelling}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium"
                      >
                        {isCancelling ? "Removing..." : "Remove Registration"}
                      </button>
                    </div>
                  </div>
                );
              }

              const today = new Date(); // Use current date and time
              const eventDate = event?.date ? new Date(event.date) : null;
              const isExpired = eventDate && eventDate < today;

              return (
                <div
                  key={registration.registrationId}
                  className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
                    viewMode === "list"
                      ? "flex items-center p-6"
                      : "flex flex-col"
                  }`}
                >
                  <div className={viewMode === "list" ? "flex-1" : "p-6 pb-4"}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusBadge(event, registration.attended)}
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                            <Tag className="w-3 h-3" />
                            {event.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {event.eventName}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    {viewMode === "grid" && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {event.description || "No description available."}
                      </p>
                    )}

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Registered on
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {formatDateTime(registration.registrationDate)}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`${
                      viewMode === "list"
                        ? "flex items-center gap-3 ml-6"
                        : "px-6 pb-6 pt-2"
                    }`}
                  >
                    <button
                      onClick={() => handleViewDetails(event.eventId)}
                      className={`${
                        viewMode === "list" ? "px-4 py-2" : "w-full py-3 mb-3"
                      } bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    <button
                      onClick={() =>
                        handleCancelRegistration(registration.registrationId)
                      }
                      disabled={isCancelling || isExpired}
                      className={`${
                        viewMode === "list" ? "px-4 py-2" : "w-full py-3"
                      } ${
                        isCancelling || isExpired
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      } rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Cancel Registration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentRegistrations;