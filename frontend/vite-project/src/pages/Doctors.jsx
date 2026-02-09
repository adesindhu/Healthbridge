import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const doctorsData = [
  {
    name: "Dr. Rahul Sharma",
    speciality: "Cardiologist",
    experience: "10+ Years",
  },
  {
    name: "Dr. Anjali Mehta",
    speciality: "Dermatologist",
    experience: "8+ Years",
  },
  {
    name: "Dr. Amit Verma",
    speciality: "Neurologist",
    experience: "12+ Years",
  },
  {
    name: "Dr. Neha Kapoor",
    speciality: "Pediatrician",
    experience: "6+ Years",
  },
];

export default function Doctors() {
  const [search, setSearch] = useState("");

  const filteredDoctors = doctorsData.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-700 text-center">
          Search your expert doctor
        </h1>
        <p className="text-gray-500 mt-2 text-center">
          Find the right specialist for your healthcare needs
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor name or speciality"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        {/* Doctors Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                  {doc.name.charAt(0)}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  {doc.name}
                </h3>
                <p className="text-green-600">{doc.speciality}</p>
                <p className="text-sm text-gray-500">{doc.experience}</p>

                <button className="mt-4 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">
                  Book Appointment
                </button>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
             No doctors found
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
