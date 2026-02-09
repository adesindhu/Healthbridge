import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserMd, FaUser } from "react-icons/fa";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Services", path: "/services" },
    { name: "Appointments", path: "/appointments" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
            HB
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700">
              HealthBridge
            </h1>
            <p className="text-xs text-gray-500">
              Healthcare Solutions
            </p>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 bg-white shadow-md rounded-full px-8 py-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  location.pathname === item.path
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/login/doctor")}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-600 text-green-700 hover:bg-green-50 transition"
          >
            <FaUserMd />
            Doctor Admin
          </button>

          <button
            onClick={() => navigate("/login/user")}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
          >
            <FaUser />
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-3 text-gray-700 hover:bg-green-50"
            >
              {item.name}
            </Link>
          ))}

          <button
            onClick={() => {
              navigate("/login/doctor");
              setMobileOpen(false);
            }}
            className="w-full text-left px-6 py-3 text-green-700 hover:bg-green-50"
          >
            Doctor Admin
          </button>

          <button
            onClick={() => {
              navigate("/login/user");
              setMobileOpen(false);
            }}
            className="w-full text-left px-6 py-3 bg-green-600 text-white"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
