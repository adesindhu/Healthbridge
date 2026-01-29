import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-white">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold">
          Admin Control Panel
        </h1>
        <p className="text-gray-300">
          System monitoring & verification
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-yellow-400">
            Doctor Verification
          </h2>
          <p className="text-gray-400 mt-2">
            Approve or reject doctors
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-red-400">
            User Reports
          </h2>
          <p className="text-gray-400 mt-2">
            Manage complaints & issues
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-green-400">
            Platform Stats
          </h2>
          <p className="text-gray-400 mt-2">
            Active users & doctors
          </p>
        </motion.div>

      </div>
    </div>
  );
}
