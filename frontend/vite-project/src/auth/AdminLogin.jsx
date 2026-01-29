import React from "react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Access 🔐
        </h2>

        <input
          type="text"
          placeholder="Admin ID"
          className="w-full mb-4 px-4 py-3 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border rounded-xl"
        />

        <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
          Login
        </button>
      </div>
    </div>
  );
}
