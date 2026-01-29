import React from "react";

function ForgetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgetPassword;
