import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserLogin() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1580281658629-76d5d0c0b1b1')",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/70 to-teal-700/80"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to your health dashboard
        </p>

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          placeholder="Email address"
          className="w-full mb-4 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Login
        </motion.button>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forget-password" className="text-indigo-600 hover:underline">
            Forgot password?
          </Link>
          <Link to="/user-register" className="text-indigo-600 hover:underline">
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
