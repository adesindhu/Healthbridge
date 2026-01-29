import { motion } from "framer-motion";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-blue-700">Your Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </motion.div>

      {/* Profile Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto"
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-purple-600">Name</h2>
          <p className="text-gray-500">John Doe</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-purple-600">Email</h2>
          <p className="text-gray-500">johndoe@example.com</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-purple-600">Phone</h2>
          <p className="text-gray-500">+91 9876543210</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-purple-600">Address</h2>
          <p className="text-gray-500">123, Health Street, Bangalore, India</p>
        </div>
      </motion.div>
    </div>
  );
}
