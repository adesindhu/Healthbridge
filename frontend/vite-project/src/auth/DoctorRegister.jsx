import React, { useState } from "react";

export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    degree: "",
    specialization: "",
    experience: "",
    hospital: "",
    regNumber: "",
    regState: "",
    degreeCertificate: null,
    licenseProof: null,
    password: "",
    confirmPassword: "",
    declaration: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.declaration) {
      alert("Please confirm declaration");
      return;
    }

    console.log("Doctor Registration Data:", formData);
    alert("Registration submitted. Admin verification pending.");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#6b21a8,_#000)] flex items-center justify-center px-4">
      <div className="bg-black/50 backdrop-blur-2xl p-8 rounded-3xl w-full max-w-3xl border border-white/10 shadow-2xl text-white">

        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Doctor Registration
        </h2>
        <p className="text-center text-gray-400 mt-2">
          Verified medical professionals only
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">

          {/* 🔹 BASIC INFO */}
          <Section title="Basic Information">
            <Input name="fullName" placeholder="Full Name" onChange={handleChange} />
            <Input name="email" type="email" placeholder="Email ID" onChange={handleChange} />
            <Input name="mobile" placeholder="Mobile Number" onChange={handleChange} />
            <Select name="gender" onChange={handleChange}>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </Section>

          {/* 🔹 PROFESSIONAL DETAILS */}
          <Section title="Professional Details">
            <Input name="degree" placeholder="Medical Degree (MBBS / MD etc.)" onChange={handleChange} />
            <Input name="specialization" placeholder="Specialization" onChange={handleChange} />
            <Input name="experience" placeholder="Years of Experience" onChange={handleChange} />
            <Input name="hospital" placeholder="Hospital / Clinic Name" onChange={handleChange} />
          </Section>

          {/* 🔹 LEGAL VERIFICATION */}
          <Section title="Legal Verification">
            <Input name="regNumber" placeholder="Medical Registration Number" onChange={handleChange} />
            <Input name="regState" placeholder="State / Country of Registration" onChange={handleChange} />

            <FileInput
              label="Upload Degree Certificate"
              name="degreeCertificate"
              onChange={handleChange}
            />

            <FileInput
              label="Upload Medical License / Registration Proof"
              name="licenseProof"
              onChange={handleChange}
            />
          </Section>

          {/* 🔹 ACCOUNT */}
          <Section title="Account Credentials">
            <Input type="password" name="password" placeholder="Create Password" onChange={handleChange} />
            <Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
          </Section>

          {/* 🔹 DECLARATION */}
          <div className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              name="declaration"
              onChange={handleChange}
              className="mt-1"
            />
            <p>
              I confirm that all information provided is true and valid.
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:scale-[1.02] transition"
          >
            Submit for Verification
          </button>

          <p className="text-center text-xs text-gray-500">
            Account will be activated after admin verification
          </p>
        </form>
      </div>
    </div>
  );
}

/* ===== Reusable Components ===== */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-purple-300">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none"
  >
    {children}
  </select>
);

const FileInput = ({ label, ...props }) => (
  <div className="md:col-span-2">
    <label className="block text-sm mb-1 text-gray-400">{label}</label>
    <input
      type="file"
      accept=".pdf,.jpg,.png"
      {...props}
      className="w-full text-sm"
    />
  </div>
);
