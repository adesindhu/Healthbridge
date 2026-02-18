import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserInjured, 
  FaCalendarCheck, 
  FaHourglassHalf, 
  FaStethoscope, 
  FaBell, 
  FaUserCircle 
} from "react-icons/fa";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [showMenu, setShowMenu] = useState(false); // Added for Navbar dropdown
  const [isOnline, setIsOnline] = useState(true);
  const [showEmergency, setShowEmergency] = useState(true);

  // ================= GREETING =================
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const doctorName = "Dr. Anjali";

  // ================= DASHBOARD DATA =================
  const stats = [
    {
      title: "Total Patients",
      value: 128,
      route: "/doctor/patients",
      color: "from-blue-500 to-blue-600",
      icon: <FaUserInjured size={24} />,
    },
    {
      title: "Today Appointments",
      value: 6,
      route: "/doctor/appointments",
      color: "from-green-500 to-green-600",
      icon: <FaCalendarCheck size={24} />,
    },
    {
      title: "Pending Requests",
      value: 2,
      route: "/doctor/appointments?status=pending",
      color: "from-yellow-400 to-yellow-500",
      icon: <FaHourglassHalf size={24} />,
    },
        {
      title: "Patient Reports",
      value: 6,
      route: "/doctor/reports",
      color: "from-orange-500 to-orange-600",
      icon: <FaStethoscope size={24} />,
    },
  ];

  const upcomingAppointments = [
    { id: 1, name: "Rahul Sharma", time: "10:30 AM", type: "Consultation" },
    { id: 2, name: "Priya Verma", time: "12:00 PM", type: "Follow-up" },
  ];

  const nextPatient = {
    Name: "Rahul Sharma",
    Age: 34,
    Gender: "Male",
    "Blood Group": "B+",
    Condition: "Hypertension",
    "Last Visit": "12 Feb 2026",
  };

  const [requests, setRequests] = useState([
    { id: 1, name: "Aman Verma", time: "4:00 PM", status: "Pending" },
    { id: 2, name: "Neha Kapoor", time: "5:30 PM", status: "Pending" },
  ]);

  const handleRequestAction = (id, action) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6">

      {/* ================= UPDATED NAVBAR (Matches UserDashboard) ================= */}
      <div className="bg-white shadow-md rounded-2xl p-5 mb-8 flex justify-between items-center relative">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            {greeting}, {doctorName}
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome to your clinic dashboard
          </p>
        </div>

        <div className="flex items-center gap-5">
         
          <FaBell
            className="text-2xl text-blue-600 cursor-pointer"
            onClick={() => navigate("/doctor/notifications")}
          />

          <div className="relative">
            <FaUserCircle
              className="text-3xl text-blue-700 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl p-2 z-50 border border-gray-100">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                  onClick={() => navigate("/doctor/profile")}
                >
                  Profile
                </button>

                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-red-600 text-sm font-semibold"
                  onClick={() => navigate("/")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= REST OF THE DASHBOARD (UNCHANGED) ================= */}
      <div className="px-2">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.route)}
              className={`bg-gradient-to-r ${item.color} text-white rounded-2xl p-6 shadow-lg cursor-pointer hover:scale-105 transition flex items-center gap-4`}
            >
              <div>{item.icon}</div>
              <div>
                <p className="text-sm opacity-80">{item.title}</p>
                <p className="text-3xl font-bold mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-200 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
              <FaStethoscope /> Upcoming Appointments
            </h2>
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex justify-between items-center bg-blue-50 p-4 rounded-xl mb-4 hover:bg-blue-100 transition"
              >
                <div>
                  <p className="font-semibold">{appt.name}</p>
                  <p className="text-sm text-gray-500">{appt.type}</p>
                </div>
                <span className="text-blue-700 font-semibold">{appt.time}</span>
              </div>
            ))}
            <button
              onClick={() => navigate("/doctor/appointments")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              View All
            </button>
          </div>

          {/* Next Patient */}
          <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">
              Next Patient
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              {Object.entries(nextPatient).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => navigate("/doctor/patients")}
                className="flex-1 bg-indigo-100 text-indigo-700 py-2 rounded-lg hover:bg-indigo-200 transition"
              >
                View Profile
              </button>

            </div>
          </div>
        </div>

        {/* ================= APPOINTMENT REQUESTS ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-purple-700 mb-6">
            Appointment Requests
          </h2>
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <p className="font-medium">{req.name}</p>
                <p className="text-sm text-gray-500">{req.time}</p>
              </div>
              {req.status === "Pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequestAction(req.id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequestAction(req.id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    req.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ================= EMERGENCY ================= */}
        {showEmergency && (
          <div className="bg-red-100 border-l-4 border-red-500 rounded-2xl p-6 shadow-lg flex justify-between items-center animate-pulse">
            <div>
              <h2 className="text-lg font-semibold text-red-600">
                🚑 Emergency Alert
              </h2>
              <p className="text-sm text-gray-700">
                Critical patient requires immediate attention.
              </p>
            </div>
            <button
              onClick={() => setShowEmergency(false)}
              className="text-red-600 font-bold hover:text-red-800 transition"
              title="Dismiss Emergency"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;