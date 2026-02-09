import React, { useState } from "react";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.agree) {
      alert("Please accept terms & privacy policy");
      return;
    }

    console.log("User Registration Data:", formData);
    alert("Registration successful!");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#6b21a8,_#000)] flex items-center justify-center px-4">
      <div className="bg-black/50 backdrop-blur-2xl p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl text-white">

        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <p className="text-center text-gray-400 mt-2 text-sm">
          Join to consult verified doctors
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <Input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />

          <Input
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
          />

          <Select name="gender" onChange={handleChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>

          <Input
            type="password"
            name="password"
            placeholder="Create Password"
            onChange={handleChange}
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          {/* Consent */}
          <div className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              name="agree"
              onChange={handleChange}
              className="mt-1"
            />
            <p>
              I agree to the Terms of Service & Privacy Policy
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:scale-[1.02] transition"
          >
            Create Account
          </button>

          <p className="text-center text-xs text-gray-500">
            Your data is secure and private
          </p>
        </form>
      </div>
    </div>
  );
}

/* ===== Reusable UI ===== */

const Input = ({ ...props }) => (
  <input
    {...props}
    required
    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    required
    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none"
  >
    {children}
  </select>
);
