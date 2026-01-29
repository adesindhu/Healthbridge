import { motion } from "framer-motion";

export default function HealthOverview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-blue-700">Health Overview</h1>
        <p className="text-gray-600">Track your vital stats & wellness</p>
      </motion.div>

      {/* Health Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-purple-600">Heart Rate</h2>
          <p className="text-gray-500 mt-2">72 bpm (resting)</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-blue-600">Steps Today</h2>
          <p className="text-gray-500 mt-2">5,432 steps</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-pink-600">Sleep</h2>
          <p className="text-gray-500 mt-2">7 hrs 45 mins</p>
        </motion.div>

      </div>
    </div>
  );
}
