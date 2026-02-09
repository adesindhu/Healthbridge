import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Doctor Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          title="Patient List"
          onClick={() => navigate("/doctor/patients")}
        />
        <Card
          title="Chat with Patients"
          onClick={() => navigate("/doctor/chat")}
        />
      </div>
    </div>
  );
}

function Card({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-purple-900/40 p-6 rounded-xl cursor-pointer"
    >
      {title}
    </div>
  );
}
