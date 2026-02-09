import React from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";

export default function Profile() {
  // Temporary static data (later replace with API data)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "User",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="max-w-xl bg-black/60 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-400">{user.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-purple-400" />
            <span>{user.email}</span>
          </div>

          <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-xl font-semibold">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
