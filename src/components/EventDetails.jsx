import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  FileText,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { eventId } = useParams();
  const navigate = useNavigate();

  // Format helpers
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fetch event details from API
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || isNaN(eventId)) {
        const msg = "Invalid event ID.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        navigate("/student/dashboard");
        return;
      }

      try {
        const response = await axios.get(
          `https://easyfest.onrender.com/api/events/${eventId}`,
          { headers: { Accept: "application/json" } }
        );
        setEvent(response.data);
        setLoading(false);

        // Optional: check if already registered (if API provides this info)
        if (response.data.registered) setRegistered(true);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        let msg = "Failed to load event details.";
        if (err.response?.status === 404) msg = "Event not found.";
        else if (err.response?.data?.message) msg = err.response.data.message;
        setError(msg);
        toast.error(msg);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("studentId");
    if (!token || !studentId) {
      toast.error("Please log in again");
      navigate("/student/login");
      return;
    }

    setRegistering(true);
    try {
      await axios.post(
        "https://easyfest.onrender.com/api/registrations",
        { studentId, eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      toast.success("Registered successfully!");
      setRegistered(true);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      let msg = "Failed to register for event.";
      if (err.response?.status === 401) {
        msg = "Authentication failed. Please log in again.";
        navigate("/student/login");
      } else if (err.response?.status === 400) {
        msg = err.response.data.message || "Event is at full capacity.";
      } else if (err.response?.status === 404) {
        msg = err.response.data.message || "Event or student not found.";
      } else if (err.response?.status === 409) {
        msg = err.response.data.message || "Already registered for this event.";
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setRegistering(false);
    }
  };

  const handleBack = () => navigate("/student/dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="px-8 py-6 border-b border-slate-200">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-slate-600 hover:text-blue-800 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {event.eventName}
            </h1>
            <div className="flex items-center text-slate-600">
              <Tag className="w-4 h-4 mr-2" />
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Event Details
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">Date</h3>
                      <p className="text-slate-600">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">Time</h3>
                      <p className="text-slate-600">{formatTime(event.time)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">Venue</h3>
                      <p className="text-slate-600">{event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">
                        Capacity
                      </h3>
                      <p className="text-slate-600">
                        {event.capacity} participants
                      </p>
                    </div>
                  </div>

                  {event.description && (
                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-3">
                        Description
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 sticky top-8">
              <div className="px-6 py-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Event Registration
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Secure your spot in this event
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Event Fee:</span>
                    <span className="font-medium text-slate-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Registration Status:</span>
                    <span
                      className={`${
                        registered ? "text-green-600" : ""
                      } font-medium`}
                    >
                      {registered ? "Registered" : "Open"}
                    </span>
                  </div>
                </div>

                {!registered ? (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    {registering ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register Now
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserPlus className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-green-800 font-medium mb-1">
                      Successfully Registered!
                    </p>
                    <p className="text-green-600 text-sm">
                      You will receive a confirmation email shortly.
                    </p>
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-4 text-center">
                  By registering, you agree to attend the event at the scheduled
                  time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
