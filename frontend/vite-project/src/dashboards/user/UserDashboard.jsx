import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaUserMd,
  FaFemale,
  FaMale,
  FaChild,
  FaUserAlt,
  FaBrain,
  FaBell,
  FaUserCircle,
  FaFileMedical,
  FaExclamationTriangle // New Icon for Emergency
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { calculateHealthScore } from "../../utils/healthScore";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // ================= Health Form =================
  const [formData, setFormData] = useState({
    bpSystolic: 130,
    bpDiastolic: 85,
    sugar: 140,
    bmi: 25,
    sleep: 7,
    activity: 30,
    stress: 3
  });

  const healthScore = calculateHealthScore(formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  // ================= Appointments =================
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Rahul Sharma", date: "2026-02-20" },
    { id: 2, doctor: "Dr. Anjali Mehta", date: "2026-02-25" }
  ]);

  const totalAppointments = appointments.length;

  const canCancel = (date) => {
    const today = new Date();
    const apptDate = new Date(date);
    const diffDays =
      (apptDate - today) / (1000 * 60 * 60 * 24);
    return diffDays > 1;
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.filter((appt) => appt.id !== id)
    );
  };

  // ================= Health Trend =================
  const healthTrend = [
    { month: "Jan", score: 60 },
    { month: "Feb", score: 65 },
    { month: "Mar", score: 70 },
    { month: "Apr", score: 68 },
    { month: "May", score: 75 },
    { month: "Current", score: healthScore }
  ];

  // ================= Greeting =================
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const getScoreColor = (score) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex text-slate-800">
      
      {/* ================= Sidebar ================= */}
      <Sidebar navigate={navigate} />

      {/* ================= Main ================= */}
      <div className="flex-1 p-4 sm:p-6">

        {/* ===== Navbar ===== */}
        <div className="bg-white shadow-md rounded-2xl p-5 mb-6 flex justify-between items-center relative">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              {greeting}, User
            </h1>
            <p className="text-gray-500 text-sm">
              Welcome to HealthBridge
            </p>
          </div>

          <div className="flex items-center gap-5">
            <FaBell
              className="text-2xl text-blue-600 cursor-pointer"
              onClick={() => navigate("/user/notifications")}
            />

            <div className="relative">
              <FaUserCircle
                className="text-3xl text-blue-700 cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />

              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl p-2 z-50">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => navigate("/user/profile")}
                  >
                    Profile
                  </button>

                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-red-600"
                    onClick={() => navigate("/login")}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Top Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Health Score */}
          <div className={`bg-gradient-to-r ${getScoreColor(healthScore)} text-white p-6 rounded-2xl shadow flex justify-between items-center`}>
            <div>
              <h2 className="text-sm">Health Score</h2>
              <p className="text-4xl font-bold">{healthScore}%</p>
              <p className="text-xs">Live from inputs</p>
            </div>
            <FaHeartbeat className="text-5xl" />
          </div>

          {/* Total Appointments */}
          <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-600">
                Total Appointments
              </h2>
              <p className="text-4xl font-bold text-blue-600">
                {totalAppointments}
              </p>
              <button
                className="text-blue-600 text-sm mt-1"
                onClick={() => navigate("/doctors")}
              >
                Book New
              </button>
            </div>
            <FaUserMd className="text-4xl text-blue-600" />
          </div>

          {/* Upcoming */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-sm text-gray-600 mb-2">
              Upcoming
            </h2>

            {appointments.length === 0 ? (
              <p className="text-sm text-gray-500">
                No upcoming appointments
              </p>
            ) : (
              appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="text-sm">
                    <p className="font-medium">{appt.doctor}</p>
                    <p className="text-gray-500 text-xs">
                      {appt.date}
                    </p>
                  </div>

                  {canCancel(appt.date) ? (
                    <button
                      className="text-red-500 text-xs hover:underline"
                      onClick={() =>
                        cancelAppointment(appt.id)
                      }
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Locked
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ActionCard
            icon={<FaBrain />}
            title="AI Analysis"
            color="from-blue-500 to-blue-600"
            onClick={() => navigate("/user/health")}
          />
          <ActionCard
            icon={<FaUserMd />}
            title="Find Doctors"
            color="from-green-500 to-green-600"
            onClick={() => navigate("/doctors")}
          />
          <ActionCard
            icon={<FaFileMedical />}
            title="Reports"
            color="from-orange-400 to-orange-500"
            onClick={() => navigate("/user/reports")}
          />
          
          {/* UPDATED EMERGENCY CARD */}
          <ActionCard
            icon={<FaExclamationTriangle />}
            title="Emergency"
            color="from-red-500 to-rose-700"
            onClick={() => navigate("/user/emergency")}
          />
        </div>

        {/* ===== Health Form ===== */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Update Health Data
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="BP Sys" name="bpSystolic" value={formData.bpSystolic} onChange={handleChange} />
            <Input label="BP Dia" name="bpDiastolic" value={formData.bpDiastolic} onChange={handleChange} />
            <Input label="Sugar" name="sugar" value={formData.sugar} onChange={handleChange} />
            <Input label="BMI" name="bmi" value={formData.bmi} onChange={handleChange} />
            <Input label="Sleep" name="sleep" value={formData.sleep} onChange={handleChange} />
            <Input label="Activity" name="activity" value={formData.activity} onChange={handleChange} />
            <Input label="Stress" name="stress" value={formData.stress} onChange={handleChange} />
          </div>
        </div>

        {/* ===== Health Trend ===== */}
{/* ===== Health Trend ===== */}
<div className="bg-white p-6 rounded-2xl shadow">
  <h2 className="text-lg font-semibold text-blue-700 mb-4 ">
    Health Trend
  </h2>
        

  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={healthTrend}>
      {/* Adding a gradient definition for the area under the line */}
      <defs>
        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
        </linearGradient>
      </defs>
      
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis 
        dataKey="month" 
        axisLine={false} 
        tickLine={false} 
        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
      />
      <YAxis 
        domain={[50, 100]} 
        axisLine={false} 
        tickLine={false} 
        tick={{fill: '#94a3b8', fontSize: 12}} 
      />
      <Tooltip 
        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      />
      
      {/* Background Area for color */}
      <Line
        type="monotone"
        dataKey="score"
        stroke="#6366f1" // Vibrant Indigo
        strokeWidth={4}
        dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
        activeDot={{ r: 8, strokeWidth: 0 }}
        fill="url(#colorScore)" // Applying the gradient
      />
    </LineChart>
  </ResponsiveContainer>
</div>
      </div>
    </div>
  );
}

/* ================= Sidebar ================= */

function Sidebar({ navigate }) {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-lg p-6 space-y-6 min-h-screen sticky top-0">
      <h2 className="text-lg font-bold text-blue-700 px-2">
        Health Modules
      </h2>

      <div className="space-y-3">
        <SidebarItem 
            icon={<FaFemale />} 
            text="Women" 
            colorClass="text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-100" 
            onClick={() => navigate("/user/women")} 
        />
        <SidebarItem 
            icon={<FaMale />} 
            text="Men" 
            colorClass="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100" 
            onClick={() => navigate("/user/men")} 
        />
        <SidebarItem 
            icon={<FaChild />} 
            text="Children" 
            colorClass="text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-100" 
            onClick={() => navigate("/user/children")} 
        />
        <SidebarItem 
            icon={<FaUserAlt />} 
            text="Elderly" 
            colorClass="text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-100" 
            onClick={() => navigate("/user/elderly")} 
        />
      </div>

      <div className="pt-4 border-t">
        <h2 className="text-lg font-bold text-green-700 mb-2 px-2">
          Favorite Doctors
        </h2>

        <SidebarDoctor name="Dr. Rahul Sharma" />
        <SidebarDoctor name="Dr. Anjali Mehta" />

        <button
          onClick={() => navigate("/doctors")}
          className="text-sm text-green-600 mt-4 px-2 font-semibold hover:underline flex items-center gap-1"
        >
          View all →
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, onClick, colorClass }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm font-bold ${colorClass}`}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-sm tracking-tight">{text}</span>
    </div>
  );
}

function SidebarDoctor({ name }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg cursor-pointer transition-colors group">
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xs font-bold group-hover:bg-green-600 group-hover:text-white transition-all">
        {name.charAt(4)}
      </div>
      <span className="text-sm font-medium text-slate-700">{name}</span>
    </div>
  );
}

/* ================= Reusable ================= */

function ActionCard({ icon, title, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl cursor-pointer hover:-translate-y-1 hover:shadow-xl transition duration-300 shadow-md`}
    >
      <div className="text-4xl mb-2 opacity-90">{icon}</div>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-slate-700 font-medium"
      />
    </div>
  );
}