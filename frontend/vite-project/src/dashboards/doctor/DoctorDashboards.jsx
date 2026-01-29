import { motion } from "framer-motion";

export default function DoctorDashboard() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-900/70 to-teal-900/80"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-white">
            Doctor Panel 🩺
          </h1>
          <p className="text-green-100">
            Manage patients and consultations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-semibold text-green-700">
              Patient Requests
            </h2>
            <p className="text-gray-600 mt-2">
              New consultation requests
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-semibold text-emerald-700">
              Live Chat
            </h2>
            <p className="text-gray-600 mt-2">
              Chat with patients
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-semibold text-teal-700">
              Earnings 💰
            </h2>
            <p className="text-gray-600 mt-2">
              Paid consultations summary
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
