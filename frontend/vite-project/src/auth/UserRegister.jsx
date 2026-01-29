import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Create Account ✨
        </h2>

        <motion.input whileFocus={{ scale: 1.02 }} placeholder="Full Name"
          className="w-full mb-3 px-4 py-3 border rounded-xl" />

        <motion.input whileFocus={{ scale: 1.02 }} placeholder="Email"
          className="w-full mb-3 px-4 py-3 border rounded-xl" />

        <motion.input whileFocus={{ scale: 1.02 }} type="password" placeholder="Password"
          className="w-full mb-4 px-4 py-3 border rounded-xl" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
        >
          Register
        </motion.button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/user-login" className="text-indigo-600 font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
