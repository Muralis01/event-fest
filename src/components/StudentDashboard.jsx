import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Eye,
  Search,
  Grid,
  List,
  Loader2,
  AlertCircle,
  Trophy,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

// Configure Axios globally
axios.defaults.headers.post["Content-Type"] = "application/json";

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("upcoming");
  const [viewMode, setViewMode] = useState("grid");
  const [registering, setRegistering] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based for consistency with provided UI

  const navigate = useNavigate();

  const eventsPerPage = viewMode === "grid" ? 9 : 10;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const timeFilters = [
    { value: "all", label: "All Events", icon: Calendar },
    { value: "upcoming", label: "Upcoming", icon: TrendingUp },
    { value: "past", label: "Past", icon: BookOpen },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/events", {
          headers: { Accept: "application/json" },
        });

        const fetchedEvents = response.data.content || response.data;
        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        const errorMsg =
          err.response?.data?.message || "Failed to load events.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return selectedFilter === "upcoming"
          ? eventDate >= today
          : eventDate < today;
      });
    }

    setFilteredEvents(filtered);
    setCurrentPage(0); // Reset to first page on filter change
  }, [events, searchQuery, selectedFilter]);

  useEffect(() => {
    setCurrentPage(0); // Reset to first page on view mode change
  }, [viewMode]);

  const handleRegister = async (eventId) => {
    const event = events.find((e) => e.eventId === eventId);
    if (!event) return;

    if (event.currentCapacity >= event.capacity) {
      toast.error("Event is full. Cannot register.");
      return;
    }

    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("studentId");

    if (!token || !studentId) {
      toast.error("Please log in again.");
      navigate("/student/login");
      return;
    }

    setRegistering((prev) => ({ ...prev, [eventId]: true }));

    try {
      await axios.post(
        "http://localhost:8080/api/registrations",
        { studentId, eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast.success(`Successfully registered for ${event.eventName}!`);

      // Update currentCapacity locally
      setEvents((prev) =>
        prev.map((e) =>
          e.eventId === eventId ? { ...e, currentCapacity: e.currentCapacity + 1 } : e
        )
      );
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      let errorMsg = "Failed to register for event.";
      if (err.response?.status === 401) {
        errorMsg = "Authentication failed. Please log in again.";
        navigate("/student/login");
      } else if (err.response?.status === 400) {
        errorMsg = err.response.data.message || "Event is at full capacity.";
      } else if (err.response?.status === 404) {
        errorMsg = err.response.data.message || "Event or student not found.";
      } else if (err.response?.status === 409) {
        errorMsg =
          err.response.data.message ||
          "You are already registered for this event.";
      }
      toast.error(errorMsg);
    } finally {
      setRegistering((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/student/events/${eventId}`);
  };

  const getAvailabilityText = (currentCapacity, capacity) => {
    const available = capacity - currentCapacity;
    if (available <= 0) return "Full";
    if (available <= 5) return `${available} spots left`;
    return `${available} spots available`;
  };

  const getAvailabilityStatus = (currentCapacity, capacity) => {
    const available = capacity - currentCapacity;
    if (available <= 0) return "full";
    if (available <= 5) return "limited";
    return "available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.currentCapacity, 0);
  const uniqueCategories = new Set(events.map((e) => e.category)).size;

  // Calculate current events for pagination
  const indexOfLastEvent = (currentPage + 1) * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Discover Amazing Events
            </h1>
            <p className="text-lg text-gray-600">
              Join exciting events and expand your horizons
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
                  <p className="text-3xl font-bold">{totalEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Upcoming Events
                  </p>
                  <p className="text-3xl font-bold">{upcomingEvents}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Registrations
                  </p>
                  <p className="text-3xl font-bold">{totalRegistrations}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Categories
                  </p>
                  <p className="text-3xl font-bold">{uniqueCategories}</p>
                </div>
                <Tag className="w-8 h-8 text-orange-200" />
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
                placeholder="Search events, tags, or keywords..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {timeFilters.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedFilter(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedFilter === value
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
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

        {/* Events */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find events that match
                your interests
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
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
            {currentEvents.map((event) => {
              const availabilityStatus = getAvailabilityStatus(
                event.currentCapacity,
                event.capacity
              );

              return (
                <div
                  key={event.eventId}
                  className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
                    viewMode === "list" ? "flex items-center p-6" : ""
                  }`}
                >
                  {/* Event Info */}
                  <div className={viewMode === "list" ? "flex-1" : "p-6 pb-4"}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                            <Tag className="w-3 h-3" />
                            {event.category}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                              availabilityStatus === "full"
                                ? "bg-red-50 text-red-700"
                                : availabilityStatus === "limited"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            <Users className="w-3 h-3" />
                            {getAvailabilityText(event.currentCapacity, event.capacity)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {event.eventName}
                        </h3>
                      </div>
                    </div>

                    {viewMode === "grid" && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-3 text-gray-600 text-sm">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>
                          {event.currentCapacity}/{event.capacity} registered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className={`${
                      viewMode === "list"
                        ? "flex items-center gap-3 ml-6"
                        : "px-6 pb-6 pt-2"
                    }`}
                  >
                    <button
                      onClick={() => handleRegister(event.eventId)}
                      disabled={
                        registering[event.eventId] ||
                        event.currentCapacity >= event.capacity
                      }
                      className={`${
                        viewMode === "list" ? "px-6 py-3" : "w-full py-3 mb-3"
                      } ${
                        event.currentCapacity >= event.capacity
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                      } rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      {registering[event.eventId] ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Registering...
                        </>
                      ) : event.currentCapacity >= event.capacity ? (
                        "Event Full"
                      ) : (
                        "Register Now"
                      )}
                    </button>

                    <button
                      onClick={() => handleViewDetails(event.eventId)}
                      className={`${
                        viewMode === "list" ? "px-6 py-3" : "w-full py-3"
                      } bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing page {currentPage + 1} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      currentPage === i
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;