import { motion } from "framer-motion";

export default function PatientList() {
  // Sample patient data
  const patients = [
    { id: 1, name: "Alice Johnson", age: 29, condition: "Flu" },
    { id: 2, name: "Bob Smith", age: 42, condition: "Diabetes" },
    { id: 3, name: "Charlie Brown", age: 35, condition: "Hypertension" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-900/70 to-teal-900/80"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-white">Patient List</h1>
          <p className="text-green-100">View and manage your patients</p>
        </motion.div>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <motion.div
              key={patient.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl"
            >
              <h2 className="text-xl font-semibold text-green-700">
                {patient.name}
              </h2>
              <p className="text-gray-600 mt-2">Age: {patient.age}</p>
              <p className="text-gray-600 mt-1">Condition: {patient.condition}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
