import { motion } from "framer-motion";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome 👋
        </h1>
        <p className="text-gray-600">
          Your personalized health dashboard
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-purple-600">
            AI Health Analysis
          </h2>
          <p className="text-gray-500 mt-2">
            Get insights based on your health data
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-blue-600">
            Mental Health
          </h2>
          <p className="text-gray-500 mt-2">
            Mood & stress level tracking
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-pink-600">
            Emergency Help 🚑
          </h2>
          <p className="text-gray-500 mt-2">
            Find nearby doctors instantly
          </p>
        </motion.div>

      </div>
    </div>
  );
}
