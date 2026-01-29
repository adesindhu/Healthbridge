import React from "react";
import bgImage from "../assets/doctor-bg.png"; // adjust the path

export default function DoctorLogin() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Login Card */}
      <div className="relative z-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
          Doctor Portal 🩺
        </h2>

        <p className="text-center text-gray-700 mb-6">
          Verified doctors only
        </p>

        <input
          type="email"
          placeholder="Doctor Email"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition">
          Login
        </button>
      </div>
    </div>
  );
}
