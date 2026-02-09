import { useNavigate } from "react-router-dom";
import { FaBrain, FaUserMd, FaUser } from "react-icons/fa";

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-10 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">
        User Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <DashboardCard
          icon={<FaBrain size={32} />}
          title="AI Health Overview"
          onClick={() => navigate("/user/health")}
        />

        <DashboardCard
          icon={<FaUserMd size={32} />}
          title="Find Doctors"
          onClick={() => navigate("/user/health")}
        />

        <DashboardCard
          icon={<FaUser size={32} />}
          title="Profile"
          onClick={() => navigate("/user/profile")}
        />

      </div>
    </div>
  );
}

function DashboardCard({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-black/60 p-6 rounded-2xl cursor-pointer hover:scale-105 transition border border-white/10"
    >
      <div className="text-purple-400 mb-3">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}
