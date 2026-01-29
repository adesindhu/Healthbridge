import { motion } from "framer-motion";
import { useState } from "react";

export default function VerifyDoctors() {
  // Sample data: doctors pending verification
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Alice Johnson", specialty: "Cardiology", verified: false },
    { id: 2, name: "Dr. Bob Smith", specialty: "Dermatology", verified: false },
    { id: 3, name: "Dr. Charlie Brown", specialty: "Neurology", verified: false },
  ]);

  // Approve or reject function
  const handleVerification = (id, approve) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, verified: approve ? true : false } : doc
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-white">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold">Doctor Verification</h1>
        <p className="text-gray-300">Approve or reject pending doctors</p>
      </motion.div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-yellow-400">
                {doctor.name}
              </h2>
              <p className="text-gray-400 mt-1">Specialty: {doctor.specialty}</p>
              <p className={`mt-2 font-medium ${doctor.verified ? "text-green-400" : "text-red-400"}`}>
                Status: {doctor.verified ? "Approved" : "Pending"}
              </p>
            </div>

            {/* Approve / Reject buttons */}
            {!doctor.verified && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleVerification(doctor.id, true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleVerification(doctor.id, false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
