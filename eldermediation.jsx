 import { useState, useEffect } from "react";

// ─── Seed Medications ────────────────────────────────────────────────────────
const SEED_MEDS = [
  {
    id: 1, name: "Amlodipine", dose: "5mg", purpose: "Blood Pressure",
    times: ["08:00", "20:00"], color: "#ef4444", emoji: "💊",
    food: "With food", refillDate: "2025-03-10", pillsLeft: 28, totalPills: 30,
    instructions: "Do not crush. Swallow whole with water.",
    taken: { "08:00": false, "20:00": false },
  },
  {
    id: 2, name: "Metformin", dose: "500mg", purpose: "Diabetes",
    times: ["07:30", "13:00", "19:30"], color: "#3b82f6", emoji: "🔵",
    food: "With meals", refillDate: "2025-03-15", pillsLeft: 45, totalPills: 60,
    instructions: "Take with food to reduce stomach upset.",
    taken: { "07:30": false, "13:00": false, "19:30": false },
  },
  {
    id: 3, name: "Atorvastatin", dose: "20mg", purpose: "Cholesterol",
    times: ["21:00"], color: "#8b5cf6", emoji: "🟣",
    food: "Any time", refillDate: "2025-04-01", pillsLeft: 25, totalPills: 30,
    instructions: "Best taken at night. Avoid grapefruit juice.",
    taken: { "21:00": false },
  },
  {
    id: 4, name: "Aspirin", dose: "75mg", purpose: "Heart Protection",
    times: ["09:00"], color: "#f59e0b", emoji: "⭕",
    food: "After breakfast", refillDate: "2025-03-20", pillsLeft: 18, totalPills: 30,
    instructions: "Take after breakfast. Do not take on empty stomach.",
    taken: { "09:00": false },
  },
];

const COLORS = ["#ef4444","#3b82f6","#8b5cf6","#f59e0b","#10b981","#ec4899","#0ea5e9","#f97316"];
const COLOR_NAMES = ["Red","Blue","Purple","Amber","Green","Pink","Sky","Orange"];
const FOOD_OPTIONS = ["With food","With meals","After breakfast","Before meals","Any time","With water only"];
const TIME_SLOTS = ["06:00","07:00","07:30","08:00","09:00","10:00","12:00","13:00","14:00","18:00","19:30","20:00","21:00","22:00"];

function timeToMins(t) { const [h,m] = t.split(":").map(Number); return h*60+m; }

function getNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning 🌅";
  if (h < 17) return "Good Afternoon ☀️";
  return "Good Evening 🌙";
}

function PillsBar({ left, total, color }) {
  const pct = Math.round((left / total) * 100);
  const low = pct <= 30;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-500">{left} pills left</span>
        <span className={`font-bold ${low ? "text-red-500" : "text-slate-500"}`}>{pct}%{low ? " ⚠ Low" : ""}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: low ? "#ef4444" : color }} />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MedicationTracker() {
  const [tab, setTab] = useState("today");
  const [meds, setMeds] = useState(SEED_MEDS);
  const [currentTime, setCurrentTime] = useState(getNow());
  const [expandedMed, setExpandedMed] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState([
    { date: "Feb 26", taken: 5, total: 6, missed: ["Amlodipine 20:00"] },
    { date: "Feb 25", taken: 6, total: 6, missed: [] },
    { date: "Feb 24", taken: 4, total: 6, missed: ["Metformin 19:30", "Aspirin 09:00"] },
    { date: "Feb 23", taken: 6, total: 6, missed: [] },
    { date: "Feb 22", taken: 5, total: 6, missed: ["Atorvastatin 21:00"] },
  ]);

  const [newMed, setNewMed] = useState({
    name: "", dose: "", purpose: "", times: [], color: "#ef4444",
    emoji: "💊", food: "With food", refillDate: "", pillsLeft: "", totalPills: "", instructions: "",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getNow()), 60000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // Build today's schedule sorted by time
  const todaySchedule = meds.flatMap(med =>
    med.times.map(time => ({ ...med, schedTime: time }))
  ).sort((a, b) => timeToMins(a.schedTime) - timeToMins(b.schedTime));

  const nowMins = timeToMins(currentTime);
  const totalDoses = todaySchedule.length;
  const takenDoses = todaySchedule.filter(d => d.taken[d.schedTime]).length;
  const progressPct = totalDoses ? Math.round((takenDoses / totalDoses) * 100) : 0;

  const getSlotStatus = (schedTime, taken) => {
    const slotMins = timeToMins(schedTime);
    if (taken) return "done";
    if (slotMins <= nowMins) return "missed";
    if (slotMins - nowMins <= 30) return "soon";
    return "upcoming";
  };

  const markTaken = (medId, time, val) => {
    setMeds(ms => ms.map(m => m.id === medId
      ? { ...m, taken: { ...m.taken, [time]: val }, pillsLeft: val ? Math.max(0, m.pillsLeft - 1) : m.pillsLeft + 1 }
      : m
    ));
    if (val) showToast("✅ Marked as taken! Great job 👍");
  };

  const deleteMed = (id) => {
    setMeds(ms => ms.filter(m => m.id !== id));
    showToast("🗑️ Medication removed.");
  };

  const saveNewMed = () => {
    if (!newMed.name || !newMed.dose || newMed.times.length === 0) return;
    const takenMap = {};
    newMed.times.forEach(t => { takenMap[t] = false; });
    const entry = {
      ...newMed, id: Date.now(),
      pillsLeft: parseInt(newMed.pillsLeft) || 30,
      totalPills: parseInt(newMed.totalPills) || 30,
      taken: takenMap,
    };
    setMeds(ms => [...ms, entry]);
    setNewMed({ name:"",dose:"",purpose:"",times:[],color:"#ef4444",emoji:"💊",food:"With food",refillDate:"",pillsLeft:"",totalPills:"",instructions:"" });
    setShowAddForm(false);
    showToast("💊 Medication added!");
  };

  const toggleTime = (t) => setNewMed(n => ({
    ...n, times: n.times.includes(t) ? n.times.filter(x => x !== t) : [...n.times, t]
  }));

  const slotColors = {
    done:     { bg: "#f0fdf4", border: "#86efac", badge: "#16a34a", label: "Taken ✓" },
    missed:   { bg: "#fef2f2", border: "#fca5a5", badge: "#dc2626", label: "Missed" },
    soon:     { bg: "#fffbeb", border: "#fcd34d", badge: "#d97706", label: "Due Soon" },
    upcoming: { bg: "#f8fafc", border: "#e2e8f0", badge: "#64748b", label: "Upcoming" },
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* Warm ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "#fb923c" }} />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "#a78bfa" }} />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-base px-6 py-3 rounded-2xl shadow-2xl font-bold">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 px-5 pt-10 pb-5 max-w-xl mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-orange-500 text-sm font-bold tracking-wider uppercase mb-1">{getGreeting()}</p>
            <h1 className="text-4xl font-black text-slate-800 leading-tight"
              style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              My<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg,#f97316,#a855f7)" }}>
                Medicines
              </span>
            </h1>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-orange-100"
              style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)" }}>
              💊
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentTime}</p>
          </div>
        </div>

        {/* Daily progress ring */}
        <div className="bg-white rounded-3xl border-2 border-orange-100 shadow-md p-5">
          <div className="flex items-center gap-5">
            {/* Ring */}
            <div className="relative flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#fef3c7" strokeWidth="9" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={progressPct === 100 ? "#16a34a" : "#f97316"}
                  strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={`${(progressPct / 100) * 201} 201`}
                  style={{ transition: "stroke-dasharray 0.8s ease" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-slate-700">{progressPct}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black text-slate-800" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                {takenDoses} of {totalDoses}
              </p>
              <p className="text-base text-slate-500">doses taken today</p>
              {progressPct === 100
                ? <p className="text-base text-green-600 font-bold mt-1">🎉 All done for today!</p>
                : <p className="text-base text-orange-500 font-bold mt-1">{totalDoses - takenDoses} remaining</p>
              }
            </div>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="relative z-10 max-w-xl mx-auto px-5 mb-5">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200 gap-1">
          {[
            { id: "today",    label: "Today",     icon: "📅" },
            { id: "medicines",label: "Medicines",  icon: "💊" },
            { id: "history",  label: "History",   icon: "📋" },
            { id: "tips",     label: "Tips",      icon: "💡" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === t.id ? "text-white shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
              style={tab === t.id ? { background: "linear-gradient(135deg,#f97316,#a855f7)" } : {}}>
              <span className="block text-xl mb-0.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative z-10 max-w-xl mx-auto px-5 pb-28 space-y-4">

        {/* ── TODAY TAB ── */}
        {tab === "today" && (
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                Today's Schedule
              </h2>
              <span className="text-sm text-slate-400">{new Date().toLocaleDateString("en-IN",{weekday:"long",month:"short",day:"numeric"})}</span>
            </div>

            {todaySchedule.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <p className="text-6xl mb-4">📭</p>
                <p className="text-lg">No medicines added yet.</p>
                <button onClick={() => setTab("medicines")} className="mt-3 text-orange-500 font-bold text-base underline">Add your first medicine →</button>
              </div>
            )}

            {todaySchedule.map((dose, idx) => {
              const status = getSlotStatus(dose.schedTime, dose.taken[dose.schedTime]);
              const sc = slotColors[status];
              return (
                <div key={`${dose.id}-${dose.schedTime}-${idx}`}
                  className="rounded-3xl border-2 shadow-sm overflow-hidden transition-all"
                  style={{ background: sc.bg, borderColor: sc.border }}>
                  <div className="px-5 py-4 flex items-center gap-4">
                    {/* Color dot + emoji */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm border-2"
                      style={{ background: dose.color + "18", borderColor: dose.color + "44" }}>
                      {dose.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xl font-black text-slate-800"
                          style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                          {dose.name}
                        </p>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: dose.color }}>{dose.dose}</span>
                      </div>
                      <p className="text-base text-slate-500 mt-0.5">{dose.purpose} · {dose.food}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-base font-bold text-slate-700">⏰ {dose.schedTime}</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: sc.badge }}>{sc.label}</span>
                      </div>
                    </div>

                    {/* Check button */}
                    <button
                      onClick={() => markTaken(dose.id, dose.schedTime, !dose.taken[dose.schedTime])}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-2 transition-all active:scale-95 ${
                        dose.taken[dose.schedTime]
                          ? "text-white border-green-400"
                          : "bg-white border-slate-200 hover:border-orange-400"
                      }`}
                      style={dose.taken[dose.schedTime] ? { background: "#16a34a" } : {}}>
                      {dose.taken[dose.schedTime] ? "✓" : "○"}
                    </button>
                  </div>

                  {/* Instructions strip */}
                  {dose.instructions && (
                    <div className="px-5 py-2 border-t border-slate-100 bg-white/60">
                      <p className="text-sm text-slate-500 italic">📌 {dose.instructions}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── MEDICINES TAB ── */}
        {tab === "medicines" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                My Medicines ({meds.length})
              </h2>
              <button onClick={() => setShowAddForm(f => !f)}
                className="text-white text-sm font-bold px-4 py-2.5 rounded-2xl shadow-md"
                style={{ background: "linear-gradient(135deg,#f97316,#a855f7)" }}>
                {showAddForm ? "✕ Cancel" : "+ Add Medicine"}
              </button>
            </div>

            {/* Add form */}
            {showAddForm && (
              <div className="bg-white rounded-3xl border-2 border-orange-100 shadow-md p-5 space-y-4">
                <h3 className="text-base font-black text-slate-600 uppercase tracking-wide">➕ Add New Medicine</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold text-slate-500 block mb-1">Medicine Name *</label>
                    <input value={newMed.name} onChange={e => setNewMed(n => ({...n, name: e.target.value}))}
                      placeholder="e.g. Amlodipine"
                      className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-orange-400 bg-slate-50" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 block mb-1">Dose *</label>
                    <input value={newMed.dose} onChange={e => setNewMed(n => ({...n, dose: e.target.value}))}
                      placeholder="e.g. 5mg"
                      className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-orange-400 bg-slate-50" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 block mb-1">Purpose (optional)</label>
                  <input value={newMed.purpose} onChange={e => setNewMed(n => ({...n, purpose: e.target.value}))}
                    placeholder="e.g. Blood Pressure, Diabetes..."
                    className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-orange-400 bg-slate-50" />
                </div>

                {/* Color picker */}
                <div>
                  <label className="text-sm font-bold text-slate-500 block mb-2">Pill Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c, i) => (
                      <button key={c} onClick={() => setNewMed(n => ({...n, color: c}))}
                        className={`w-9 h-9 rounded-full border-4 transition-all ${newMed.color === c ? "border-slate-700 scale-110" : "border-transparent"}`}
                        style={{ background: c }} title={COLOR_NAMES[i]} />
                    ))}
                  </div>
                </div>

                {/* Emoji picker */}
                <div>
                  <label className="text-sm font-bold text-slate-500 block mb-2">Pill Emoji</label>
                  <div className="flex gap-2 flex-wrap">
                    {["💊","🔵","🟣","⭕","🟡","🟢","🔴","🟠","⬛","🩺"].map(e => (
                      <button key={e} onClick={() => setNewMed(n => ({...n, emoji: e}))}
                        className={`text-2xl w-10 h-10 rounded-xl border-2 transition-all ${newMed.emoji === e ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-slate-50"}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Times */}
                <div>
                  <label className="text-sm font-bold text-slate-500 block mb-2">⏰ Times * (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map(t => (
                      <button key={t} onClick={() => toggleTime(t)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          newMed.times.includes(t) ? "text-white border-orange-400" : "text-slate-500 border-slate-200 bg-white"
                        }`}
                        style={newMed.times.includes(t) ? { background: "#f97316" } : {}}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food */}
                <div>
                  <label className="text-sm font-bold text-slate-500 block mb-2">🍽️ With Food?</label>
                  <div className="flex flex-wrap gap-2">
                    {FOOD_OPTIONS.map(f => (
                      <button key={f} onClick={() => setNewMed(n => ({...n, food: f}))}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          newMed.food === f ? "text-white" : "text-slate-500 border-slate-200 bg-white"
                        }`}
                        style={newMed.food === f ? { background: "linear-gradient(135deg,#f97316,#a855f7)", borderColor: "transparent" } : {}}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold text-slate-500 block mb-1">Pills Left</label>
                    <input type="number" value={newMed.pillsLeft} onChange={e => setNewMed(n => ({...n, pillsLeft: e.target.value}))}
                      placeholder="e.g. 30"
                      className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-orange-400 bg-slate-50" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 block mb-1">Refill Date</label>
                    <input type="date" value={newMed.refillDate} onChange={e => setNewMed(n => ({...n, refillDate: e.target.value}))}
                      className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-orange-400 bg-slate-50" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 block mb-1">Special Instructions</label>
                  <input value={newMed.instructions} onChange={e => setNewMed(n => ({...n, instructions: e.target.value}))}
                    placeholder="e.g. Swallow whole, avoid grapefruit..."
                    className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-orange-400 bg-slate-50" />
                </div>

                <button onClick={saveNewMed}
                  className="w-full text-white text-xl font-black py-5 rounded-2xl shadow-lg"
                  style={{ background: "linear-gradient(135deg,#f97316,#a855f7)", fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                  💊 Save Medicine
                </button>
              </div>
            )}

            {/* Medicines list */}
            {meds.map(med => {
              const isOpen = expandedMed === med.id;
              const daysToRefill = med.refillDate ? Math.ceil((new Date(med.refillDate) - new Date()) / (1000*60*60*24)) : null;
              return (
                <div key={med.id} className="bg-white rounded-3xl border-2 shadow-sm overflow-hidden"
                  style={{ borderColor: med.color + "44" }}>
                  <button onClick={() => setExpandedMed(isOpen ? null : med.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border-2"
                      style={{ background: med.color + "15", borderColor: med.color + "44" }}>
                      {med.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xl font-black text-slate-800"
                          style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>{med.name}</p>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: med.color }}>{med.dose}</span>
                      </div>
                      <p className="text-base text-slate-500">{med.purpose}</p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {med.times.length} dose{med.times.length > 1 ? "s" : ""}/day · {med.times.join(", ")}
                      </p>
                    </div>
                    <span className="text-slate-400 text-xl">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                      <PillsBar left={med.pillsLeft} total={med.totalPills} color={med.color} />

                      {med.refillDate && (
                        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 ${
                          daysToRefill !== null && daysToRefill <= 7
                            ? "bg-red-50 border-red-200"
                            : "bg-slate-50 border-slate-200"
                        }`}>
                          <span className="text-xl">{daysToRefill !== null && daysToRefill <= 7 ? "⚠️" : "📅"}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-700">Refill Date: {med.refillDate}</p>
                            {daysToRefill !== null && (
                              <p className={`text-sm ${daysToRefill <= 7 ? "text-red-600 font-bold" : "text-slate-500"}`}>
                                {daysToRefill > 0 ? `${daysToRefill} days away` : daysToRefill === 0 ? "Today!" : "Overdue!"}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {med.instructions && (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-3">
                          <p className="text-sm font-bold text-amber-700">📌 Instructions</p>
                          <p className="text-base text-amber-800 mt-0.5">{med.instructions}</p>
                        </div>
                      )}

                      <div className="bg-slate-50 rounded-2xl px-4 py-3">
                        <p className="text-sm font-bold text-slate-600 mb-2">🍽️ Food: <span className="text-slate-800">{med.food}</span></p>
                        <p className="text-sm font-bold text-slate-600">⏰ Schedule: <span className="text-slate-800">{med.times.join(" · ")}</span></p>
                      </div>

                      <button onClick={() => deleteMed(med.id)}
                        className="w-full bg-red-50 border-2 border-red-200 text-red-600 font-bold py-3 rounded-2xl text-base hover:bg-red-100 transition-colors">
                        🗑️ Remove This Medicine
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <>
            <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              📋 Medication History
            </h2>

            {/* Streak */}
            <div className="rounded-3xl p-5 text-white"
              style={{ background: "linear-gradient(135deg,#f97316,#a855f7)" }}>
              <p className="text-base font-bold mb-1 opacity-90">🔥 Current Streak</p>
              <p className="text-5xl font-black" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>3 Days</p>
              <p className="text-base opacity-80 mt-1">Keep it up! Consistency is key 💪</p>
            </div>

            {/* History cards */}
            {history.map((day, i) => {
              const pct = Math.round((day.taken / day.total) * 100);
              const perfect = day.missed.length === 0;
              return (
                <div key={i} className={`bg-white rounded-2xl border-2 shadow-sm p-5 ${perfect ? "border-green-200" : "border-orange-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 ${perfect ? "border-green-300 bg-green-50" : "border-orange-300 bg-orange-50"}`}>
                        {perfect ? "✅" : "⚠️"}
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-800"
                          style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>{day.date}</p>
                        <p className="text-sm text-slate-500">{day.taken}/{day.total} doses taken</p>
                      </div>
                    </div>
                    <span className={`text-sm font-black px-3 py-1.5 rounded-full ${perfect ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: perfect ? "#16a34a" : "#f97316" }} />
                  </div>
                  {day.missed.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-orange-600 font-bold">Missed:</p>
                      {day.missed.map(m => (
                        <p key={m} className="text-sm text-slate-500">• {m}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── TIPS TAB ── */}
        {tab === "tips" && (
          <>
            <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              💡 Medicine Tips
            </h2>

            {[
              { icon: "⏰", title: "Take at the Same Time Daily", desc: "Taking medicine at a fixed time every day helps your body and makes it easier to remember. Try linking it to meals or brushing teeth.", color: "bg-orange-50 border-orange-200" },
              { icon: "💧", title: "Always Take With Water", desc: "Swallow tablets and capsules with a full glass of plain water unless told otherwise. This helps the medicine reach your stomach properly.", color: "bg-sky-50 border-sky-200" },
              { icon: "🚫", title: "Never Skip a Dose", desc: "Skipping doses can make your medicine less effective. If you forget, take it as soon as you remember — unless it's almost time for the next dose.", color: "bg-red-50 border-red-200" },
              { icon: "📦", title: "Store Medicines Properly", desc: "Keep medicines in a cool, dry place away from sunlight. Do not store in the bathroom. Keep them out of reach of children.", color: "bg-purple-50 border-purple-200" },
              { icon: "🍊", title: "Mind Food Interactions", desc: "Some medicines work differently with certain foods. For example, avoid grapefruit with some heart or cholesterol medicines. Ask your doctor.", color: "bg-amber-50 border-amber-200" },
              { icon: "🔄", title: "Refill Before Running Out", desc: "Refill your prescription at least 5–7 days before you run out. Mark the refill date on a calendar so you never miss it.", color: "bg-green-50 border-green-200" },
              { icon: "🩺", title: "Never Stop Without Asking", desc: "Do not stop taking a medicine just because you feel better. Always talk to your doctor before stopping any medicine.", color: "bg-teal-50 border-teal-200" },
              { icon: "📝", title: "Keep a Medicine List", desc: "Always carry a written list of all your medicines, doses, and times to every doctor visit and the hospital.", color: "bg-indigo-50 border-indigo-200" },
            ].map(tip => (
              <div key={tip.title} className={`rounded-3xl border-2 p-5 ${tip.color}`}>
                <div className="flex gap-4 items-start">
                  <span className="text-4xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <p className="text-lg font-black text-slate-800 mb-1"
                      style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>{tip.title}</p>
                    <p className="text-base text-slate-600 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Emergency */}
            <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5">
              <p className="text-lg font-black text-red-700 mb-3">🚨 Call a Doctor If You Experience:</p>
              <ul className="space-y-2 text-base text-red-600">
                {["Severe rash, swelling or itching after taking medicine","Difficulty breathing or chest pain","Sudden dizziness or fainting","Nausea or vomiting that won't stop","Unusual confusion or loss of balance"].map(s => (
                  <li key={s} className="flex gap-2"><span className="flex-shrink-0">•</span>{s}</li>
                ))}
              </ul>
              <div className="mt-4 bg-white rounded-2xl border border-red-200 px-4 py-3 space-y-1">
                <p className="font-black text-red-700">📞 Emergency</p>
                <p className="text-base text-red-600">Emergency Ambulance: <strong>108</strong></p>
                <p className="text-base text-red-600">Health Helpline: <strong>104</strong></p>
                <p className="text-base text-red-600">Poison Control: <strong>1800-116-117</strong></p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 shadow-2xl z-20">
        <div className="max-w-xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black"
              style={{ background: "linear-gradient(135deg,#f97316,#a855f7)" }}>
              {takenDoses}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Today's Progress</p>
              <p className="text-base font-black text-slate-700">{takenDoses}/{totalDoses} taken</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Medicines</p>
            <p className="text-base font-black text-orange-500">{meds.length} active 💊</p>
          </div>
        </div>
      </div>
    </div>
  );
}

