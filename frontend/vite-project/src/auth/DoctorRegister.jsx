import React from "react";

function DoctorRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Doctor Registration
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          placeholder="Specialization"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          placeholder="Medical Registration Number"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          Register
        </button>
      </div>
    </div>
  );
}

export default DoctorRegister;
