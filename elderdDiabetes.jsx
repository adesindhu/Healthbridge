import { useState, useMemo } from "react";

// ─── Blood Sugar Classification ───────────────────────────────────────────────
function classifyBS(value, timing) {
  // Fasting targets
  if (timing === "Fasting") {
    if (value < 70)  return { label: "Too Low",   color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", emoji: "📉", advice: "Your sugar is too low. Eat something sweet right away — a glucose tablet, juice or 2 teaspoons of sugar." };
    if (value <= 99) return { label: "Normal",    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", emoji: "✅", advice: "Excellent! Your fasting sugar is in the healthy range. Keep it up!" };
    if (value <= 125)return { label: "Pre-Diabetic", color: "#ca8a04", bg: "#fefce8", border: "#fef08a", emoji: "⚠️", advice: "Slightly high for fasting. Watch your diet and discuss with your doctor." };
    if (value <= 199)return { label: "High",      color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", emoji: "🔶", advice: "Fasting sugar is high. Avoid sweets today and contact your doctor if this continues." };
    return           { label: "Very High",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca", emoji: "🔴", advice: "Very high! Please contact your doctor today and avoid all sugar and carbs." };
  }
  // Post-meal
  if (value < 70)  return { label: "Too Low",    color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", emoji: "📉", advice: "Sugar dropped too low even after eating. Sit down, eat sugar immediately and call your doctor." };
  if (value <= 139)return { label: "Normal",     color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", emoji: "✅", advice: "Good! Post-meal sugar is in target range. Your meal control is working." };
  if (value <= 199)return { label: "Elevated",   color: "#ca8a04", bg: "#fefce8", border: "#fef08a", emoji: "⚠️", advice: "A bit high after eating. Try smaller portions and fewer carbs next time." };
  if (value <= 299)return { label: "High",       color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", emoji: "🔶", advice: "Post-meal sugar is high. Consider a short walk and reduce carb portions." };
  return           { label: "Very High",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca", emoji: "🔴", advice: "Very high after meal. Please rest, drink water and contact your doctor." };
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_READINGS = [
  { id: 1, value: 108, timing: "Fasting",    date: "2025-02-20", time: "07:30", note: "Before breakfast" },
  { id: 2, value: 162, timing: "After Meal", date: "2025-02-20", time: "09:30", note: "After breakfast" },
  { id: 3, value: 115, timing: "Fasting",    date: "2025-02-21", time: "07:15", note: "" },
  { id: 4, value: 178, timing: "After Meal", date: "2025-02-21", time: "13:30", note: "After lunch (rice)" },
  { id: 5, value: 102, timing: "Fasting",    date: "2025-02-22", time: "07:45", note: "" },
  { id: 6, value: 145, timing: "After Meal", date: "2025-02-22", time: "20:00", note: "After dinner" },
  { id: 7, value: 220, timing: "After Meal", date: "2025-02-23", time: "09:00", note: "Had sweets at function" },
  { id: 8, value: 118, timing: "Fasting",    date: "2025-02-24", time: "07:20", note: "" },
  { id: 9, value: 155, timing: "After Meal", date: "2025-02-25", time: "13:45", note: "" },
  { id: 10,value: 110, timing: "Fasting",    date: "2025-02-26", time: "07:30", note: "Walked 30 min yesterday" },
];

const SAFE_FOODS = [
  { name: "Methi Roti", emoji: "🫓", note: "Low GI · Good for sugar control" },
  { name: "Moong Dal", emoji: "🫘", note: "High protein · Slow digestion" },
  { name: "Bitter Gourd", emoji: "🥒", note: "Natural blood sugar reducer" },
  { name: "Curd (plain)", emoji: "🥛", note: "Probiotic · Low fat" },
  { name: "Oats", emoji: "🥣", note: "High fibre · Low GI" },
  { name: "Drumstick Leaves", emoji: "🌿", note: "Anti-diabetic properties" },
  { name: "Brown Rice", emoji: "🍚", note: "Better than white rice" },
  { name: "Boiled Egg", emoji: "🥚", note: "Protein · No carbs" },
  { name: "Apple (small)", emoji: "🍎", note: "Low GI fruit" },
  { name: "Palak / Spinach", emoji: "🥬", note: "Very low sugar, high nutrition" },
  { name: "Almonds (5–6)", emoji: "🌰", note: "Healthy fats · Controls hunger" },
  { name: "Idli (2 small)", emoji: "🟡", note: "Fermented · Better than bread" },
];

const AVOID_FOODS = [
  { name: "White Rice (large)", emoji: "🍚", note: "High GI · Spikes sugar fast" },
  { name: "Maida / White Bread", emoji: "🍞", note: "Refined carbs · Avoid" },
  { name: "Sweet Tea / Coffee", emoji: "☕", note: "Use no-sugar alternatives" },
  { name: "Fruits: Mango/Banana", emoji: "🥭", note: "High natural sugar" },
  { name: "Fried Snacks", emoji: "🍟", note: "Trans fats · Bad for sugar" },
  { name: "Sweets / Mithai", emoji: "🍬", note: "Direct sugar spike" },
  { name: "Packaged Juices", emoji: "🧃", note: "Hidden sugars — avoid all" },
  { name: "Alcohol", emoji: "🍺", note: "Disrupts blood sugar badly" },
];

const FOOT_CHECKS = [
  { id: "cuts",     label: "Check for cuts or wounds", icon: "🔍" },
  { id: "redness",  label: "Check for redness or swelling", icon: "🔴" },
  { id: "nails",    label: "Trim toenails carefully", icon: "✂️" },
  { id: "wash",     label: "Wash feet with lukewarm water", icon: "🚿" },
  { id: "dry",      label: "Dry thoroughly between toes", icon: "🧻" },
  { id: "moisturize", label: "Moisturize (not between toes)", icon: "🧴" },
  { id: "shoes",    label: "Wear proper diabetic footwear", icon: "👟" },
];

const TIMING_OPTIONS = ["Fasting", "Before Meal", "After Meal", "Bedtime", "Random"];

// ─── Mini SVG Chart ───────────────────────────────────────────────────────────
function BsChart({ readings }) {
  const W = 320, H = 100, PAD = 14;
  const last = readings.slice(-7);
  if (last.length < 2) return (
    <p className="text-center text-slate-400 text-base py-6">Log at least 2 readings to see chart</p>
  );
  const vals = last.map(r => r.value);
  const minV = Math.min(...vals, 70) - 10;
  const maxV = Math.max(...vals, 200) + 10;
  const xPos = i => PAD + (i / (last.length - 1)) * (W - PAD * 2);
  const yPos = v => PAD + ((maxV - v) / (maxV - minV)) * (H - PAD * 2);
  const pts = vals.map((v, i) => `${xPos(i)},${yPos(v)}`).join(" ");
  const getColor = v => v < 70 ? "#3b82f6" : v <= 139 ? "#16a34a" : v <= 199 ? "#ca8a04" : "#ef4444";
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={PAD} y1={yPos(140)} x2={W-PAD} y2={yPos(140)} stroke="#bbf7d0" strokeWidth={1.5} strokeDasharray="4,3" />
        <line x1={PAD} y1={yPos(200)} x2={W-PAD} y2={yPos(200)} stroke="#fecaca" strokeWidth={1.5} strokeDasharray="4,3" />
        <polyline points={pts} fill="none" stroke="#e5e7eb" strokeWidth={2} />
        {last.map((r, i) => (
          <circle key={i} cx={xPos(i)} cy={yPos(r.value)} r={5}
            fill={getColor(r.value)} stroke="white" strokeWidth={2} />
        ))}
      </svg>
      <div className="flex justify-around mt-1">
        {last.map((r, i) => (
          <span key={i} className="text-xs text-slate-400">{r.date.slice(8)}/{r.date.slice(5,7)}</span>
        ))}
      </div>
      <div className="flex gap-4 mt-2 justify-center flex-wrap">
        {[["#16a34a","Normal"],["#ca8a04","Elevated"],["#ef4444","High"],["#3b82f6","Too Low"]].map(([c,l]) => (
          <span key={l} className="flex items-center gap-1 text-xs font-semibold" style={{ color: c }}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: c }} /> {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DiabetesTracker() {
  const [tab, setTab] = useState("dashboard");
  const [readings, setReadings] = useState(SEED_READINGS);
  const [form, setForm] = useState({ value: "", timing: "Fasting", note: "" });
  const [saved, setSaved] = useState(false);
  const [footChecks, setFootChecks] = useState({});
  const [footDate, setFootDate] = useState("");
  const [footSaved, setFootSaved] = useState(false);
  const [mealLog, setMealLog] = useState([]);
  const [mealInput, setMealInput] = useState({ food: "", time: "", note: "" });
  const [filterDays, setFilterDays] = useState(7);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedFood, setExpandedFood] = useState(null);
  const [hba1c, setHba1c] = useState("");
  const [hba1cLog, setHba1cLog] = useState([
    { date: "Dec 2024", value: 7.8 },
    { date: "Jan 2025", value: 7.5 },
    { date: "Feb 2025", value: 7.2 },
  ]);
  const [weight, setWeight] = useState("");
  const [weightLog, setWeightLog] = useState([
    { date: "Feb 20", value: 72.5 },
    { date: "Feb 22", value: 72.2 },
    { date: "Feb 24", value: 71.9 },
    { date: "Feb 26", value: 71.7 },
  ]);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const today = new Date().toISOString().slice(0, 10);
  const timeNow = new Date().toTimeString().slice(0, 5);

  const latest = readings[readings.length - 1];
  const latestClass = latest ? classifyBS(latest.value, latest.timing) : null;

  const filteredReadings = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filterDays);
    return readings.filter(r => new Date(r.date) >= cutoff);
  }, [readings, filterDays]);

  const fastingReadings = filteredReadings.filter(r => r.timing === "Fasting");
  const postMealReadings = filteredReadings.filter(r => r.timing === "After Meal");
  const avgFasting = fastingReadings.length ? Math.round(fastingReadings.reduce((s, r) => s + r.value, 0) / fastingReadings.length) : "--";
  const avgPostMeal = postMealReadings.length ? Math.round(postMealReadings.reduce((s, r) => s + r.value, 0) / postMealReadings.length) : "--";

  const addReading = () => {
    const v = parseInt(form.value);
    if (!v || v < 30 || v > 600) return;
    const entry = { id: Date.now(), value: v, timing: form.timing, date: today, time: timeNow, note: form.note.trim() };
    setReadings(r => [...r, entry]);
    setForm({ value: "", timing: "Fasting", note: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    showToast("✅ Blood sugar reading saved!");
  };

  const saveFootCheck = () => {
    setFootSaved(true);
    setFootDate(today);
    setTimeout(() => setFootSaved(false), 3000);
    showToast("👣 Foot care check saved!");
  };

  const addMeal = () => {
    if (!mealInput.food) return;
    setMealLog(m => [{ ...mealInput, id: Date.now(), time: mealInput.time || timeNow, date: today }, ...m]);
    setMealInput({ food: "", time: "", note: "" });
    showToast("🍽️ Meal logged!");
  };

  const logHba1c = () => {
    if (!hba1c) return;
    const m = new Date().toLocaleString("en-IN", { month: "short", year: "numeric" });
    setHba1cLog(l => [...l, { date: m, value: parseFloat(hba1c) }]);
    setHba1c("");
    showToast("📊 HbA1c logged!");
  };

  const logWeight = () => {
    if (!weight) return;
    const d = new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    setWeightLog(l => [...l, { date: d, value: parseFloat(weight) }]);
    setWeight("");
    showToast("⚖️ Weight logged!");
  };

  const todayReadings = readings.filter(r => r.date === today);
  const todayFootDone = footDate === today && Object.values(footChecks).filter(Boolean).length === FOOT_CHECKS.length;

  return (
    <div className="min-h-screen bg-[#f0f7f4]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "#6ee7b7" }} />
        <div className="absolute bottom-20 -left-20 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "#fbbf24" }} />
        <div className="absolute top-1/2 right-0 w-56 h-56 rounded-full opacity-10 blur-3xl" style={{ background: "#a5f3fc" }} />
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
            <p className="text-emerald-600 text-sm font-bold tracking-wider uppercase mb-1">🩸 Diabetes Care</p>
            <h1 className="text-4xl font-black text-slate-800 leading-tight"
              style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              My Sugar<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg,#059669,#0891b2)" }}>
                Health
              </span>
            </h1>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-emerald-100"
            style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5)" }}>
            🩸
          </div>
        </div>

        {/* Latest reading banner */}
        {latest && latestClass && (
          <div className="rounded-3xl p-5 border-2 shadow-md transition-all"
            style={{ background: latestClass.bg, borderColor: latestClass.border }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Latest Reading · {latest.timing}</p>
              <span className="text-sm font-bold px-3 py-1 rounded-full text-white"
                style={{ background: latestClass.color }}>
                {latestClass.emoji} {latestClass.label}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-6xl font-black"
                style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif", color: latestClass.color }}>
                {latest.value}
              </span>
              <span className="text-2xl text-slate-400 mb-2">mg/dL</span>
            </div>
            <p className="text-base text-slate-600 leading-snug">{latestClass.advice}</p>
            <p className="text-sm text-slate-400 mt-1">{latest.date} at {latest.time}</p>
          </div>
        )}
      </header>

      {/* Nav */}
      <nav className="relative z-10 max-w-xl mx-auto px-5 mb-5">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200 gap-1">
          {[
            { id: "dashboard", label: "Home",    icon: "🏠" },
            { id: "log",       label: "Log",     icon: "📝" },
            { id: "food",      label: "Food",    icon: "🥗" },
            { id: "footcare",  label: "Foot",    icon: "👣" },
            { id: "progress",  label: "Progress",icon: "📈" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t.id ? "text-white shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
              style={tab === t.id ? { background: "linear-gradient(135deg,#059669,#0891b2)" } : {}}>
              <span className="block text-lg mb-0.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative z-10 max-w-xl mx-auto px-5 pb-28 space-y-5">

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <>
            {/* Today summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border-2 border-emerald-100 shadow-sm p-4 text-center">
                <p className="text-3xl font-black text-emerald-600"
                  style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                  {todayReadings.length}
                </p>
                <p className="text-sm text-slate-500 mt-1">Readings Today</p>
              </div>
              <div className={`rounded-2xl border-2 shadow-sm p-4 text-center ${todayFootDone ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                <p className="text-3xl">{todayFootDone ? "✅" : "⚠️"}</p>
                <p className="text-sm text-slate-500 mt-1">{todayFootDone ? "Foot Check Done" : "Foot Check Pending"}</p>
              </div>
            </div>

            {/* Quick averages */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Last 7 Days Averages</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Avg Fasting", val: avgFasting, unit: "mg/dL", icon: "🌅", color: "#059669" },
                  { label: "Avg Post-Meal", val: avgPostMeal, unit: "mg/dL", icon: "🍽️", color: "#0891b2" },
                ].map(s => (
                  <div key={s.label} className="text-center rounded-2xl p-4 border-2 border-slate-100 bg-slate-50">
                    <p className="text-3xl mb-1">{s.icon}</p>
                    <p className="text-3xl font-black" style={{ color: s.color, fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>{s.val}</p>
                    <p className="text-xs text-slate-400">{s.unit}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Target ranges reference */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">🎯 Target Ranges</p>
              <div className="space-y-3">
                {[
                  { label: "Fasting (morning)",    range: "70 – 99 mg/dL",  color: "#059669", bg: "#f0fdf4" },
                  { label: "Before meals",          range: "80 – 130 mg/dL", color: "#0891b2", bg: "#ecfeff" },
                  { label: "2 hrs after meals",     range: "Below 140 mg/dL",color: "#ca8a04", bg: "#fefce8" },
                  { label: "Bedtime",               range: "100 – 140 mg/dL",color: "#8b5cf6", bg: "#f5f3ff" },
                ].map(t => (
                  <div key={t.label} className="flex items-center justify-between rounded-xl px-4 py-3 border"
                    style={{ background: t.bg, borderColor: t.color + "44" }}>
                    <p className="text-sm font-semibold text-slate-700">{t.label}</p>
                    <p className="text-sm font-black" style={{ color: t.color }}>{t.range}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger signs */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
              <p className="text-base font-black text-red-700 mb-3">⚠️ Danger Signs — Act Immediately</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { sign: "Trembling / Shaking", cause: "Low sugar", icon: "😰" },
                  { sign: "Excessive thirst", cause: "High sugar", icon: "🥤" },
                  { sign: "Blurred vision", cause: "Sugar spike", icon: "👁️" },
                  { sign: "Unconsciousness", cause: "Emergency", icon: "🚨" },
                ].map(s => (
                  <div key={s.sign} className="bg-white rounded-xl p-3 border border-red-100 text-center">
                    <p className="text-2xl mb-1">{s.icon}</p>
                    <p className="text-sm font-black text-slate-700">{s.sign}</p>
                    <p className="text-xs text-red-500">{s.cause}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-red-600 font-bold mt-3">📞 Emergency: 108 · Health Helpline: 104</p>
            </div>

            {/* Quick log button */}
            <button onClick={() => setTab("log")}
              className="w-full text-white text-xl font-black py-5 rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg,#059669,#0891b2)", fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              🩸 Log Blood Sugar Now
            </button>
          </>
        )}

        {/* ── LOG TAB ── */}
        {tab === "log" && (
          <>
            {/* Add form */}
            <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-md p-6">
              <h2 className="text-xl font-black text-slate-700 mb-5"
                style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                📝 Record Blood Sugar
              </h2>

              <div>
                <label className="block text-base font-bold text-slate-600 mb-2">🩸 Blood Sugar (mg/dL) *</label>
                <input type="number" value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))}
                  placeholder="e.g. 120"
                  className="w-full text-4xl font-black text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 transition-colors"
                  style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }} />
              </div>

              {/* Preview */}
              {form.value && parseInt(form.value) > 30 && (() => {
                const c = classifyBS(parseInt(form.value), form.timing);
                return (
                  <div className="mt-3 rounded-2xl px-4 py-3 border-2 text-base font-bold"
                    style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                    {c.emoji} This reading is: <strong>{c.label}</strong>
                  </div>
                );
              })()}

              {/* Timing */}
              <div className="mt-4">
                <label className="block text-base font-bold text-slate-600 mb-2">⏰ When was this measured?</label>
                <div className="flex flex-wrap gap-2">
                  {TIMING_OPTIONS.map(t => (
                    <button key={t} onClick={() => setForm(f => ({...f, timing: t}))}
                      className={`px-4 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                        form.timing === t ? "text-white" : "text-slate-500 border-slate-200 bg-white"
                      }`}
                      style={form.timing === t ? { background: "linear-gradient(135deg,#059669,#0891b2)", borderColor: "transparent" } : {}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-base font-bold text-slate-600 mb-2">📝 Note (optional)</label>
                <input value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))}
                  placeholder="e.g. Before breakfast, after walk..."
                  className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-emerald-400 bg-slate-50" />
              </div>

              <button onClick={addReading}
                disabled={!form.value}
                className="mt-5 w-full text-white text-xl font-black py-5 rounded-2xl shadow-lg disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#059669,#0891b2)", fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                💾 Save Reading
              </button>
            </div>

            {/* Tips box */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
              <p className="font-black text-amber-800 text-base mb-2">📌 Best Time to Test</p>
              <ul className="space-y-1.5 text-sm text-amber-700">
                {[
                  "Fasting: First thing in morning before eating",
                  "Before meals: 30 min before eating",
                  "After meals: Exactly 2 hours after first bite",
                  "Bedtime: Just before sleeping",
                ].map(t => <li key={t} className="flex gap-2"><span>•</span>{t}</li>)}
              </ul>
            </div>

            {/* Recent readings */}
            <h3 className="text-lg font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              Recent Readings
            </h3>
            {[...readings].reverse().slice(0, 8).map(r => {
              const c = classifyBS(r.value, r.timing);
              return (
                <div key={r.id} className="rounded-2xl border-2 shadow-sm overflow-hidden"
                  style={{ background: c.bg, borderColor: c.border }}>
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-sm"
                        style={{ background: c.color }}>
                        {c.emoji}
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-800"
                          style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif", color: c.color }}>
                          {r.value} <span className="text-base text-slate-500 font-normal">mg/dL</span>
                        </p>
                        <p className="text-sm text-slate-500">{r.timing} · {r.date} · {r.time}</p>
                        {r.note && <p className="text-sm text-slate-400 italic">"{r.note}"</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{ background: c.color }}>{c.label}</span>
                      <button onClick={() => setDeleteId(r.id === deleteId ? null : r.id)}
                        className="text-slate-300 hover:text-red-400 text-xl transition-colors">×</button>
                    </div>
                  </div>
                  {deleteId === r.id && (
                    <div className="px-5 py-3 bg-red-50 border-t-2 border-red-100 flex items-center justify-between">
                      <p className="text-sm text-red-600 font-bold">Delete this reading?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteId(null)} className="text-sm px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold">Cancel</button>
                        <button onClick={() => { setReadings(rs => rs.filter(x => x.id !== r.id)); setDeleteId(null); }}
                          className="text-sm px-3 py-1.5 rounded-xl bg-red-500 text-white font-bold">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── FOOD TAB ── */}
        {tab === "food" && (
          <>
            <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              🥗 Food for Diabetics
            </h2>

            {/* Meal log */}
            <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-sm p-5">
              <h3 className="text-base font-black text-slate-600 uppercase tracking-wide mb-4">📋 Log Today's Meal</h3>
              <div className="space-y-3">
                <input value={mealInput.food} onChange={e => setMealInput(m => ({...m, food: e.target.value}))}
                  placeholder="What did you eat? e.g. Methi roti, dal"
                  className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-emerald-400 bg-slate-50" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" value={mealInput.time} onChange={e => setMealInput(m => ({...m, time: e.target.value}))}
                    className="border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-emerald-400 bg-slate-50" />
                  <input value={mealInput.note} onChange={e => setMealInput(m => ({...m, note: e.target.value}))}
                    placeholder="Portion / note"
                    className="border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-emerald-400 bg-slate-50" />
                </div>
                <button onClick={addMeal}
                  className="w-full text-white font-black py-4 rounded-2xl text-base shadow-md"
                  style={{ background: "linear-gradient(135deg,#059669,#0891b2)" }}>
                  + Log Meal
                </button>
              </div>
              {mealLog.length > 0 && (
                <div className="mt-4 space-y-2">
                  {mealLog.slice(0, 5).map(m => (
                    <div key={m.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                      <span className="text-xl">🍽️</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">{m.food}</p>
                        <p className="text-xs text-slate-400">{m.time} {m.note && `· ${m.note}`}</p>
                      </div>
                      <button onClick={() => setMealLog(ml => ml.filter(x => x.id !== m.id))}
                        className="text-slate-300 hover:text-red-400 text-xl">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Good foods */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <h3 className="text-lg font-black text-emerald-700"
                  style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>Good Foods to Eat</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SAFE_FOODS.map(f => (
                  <button key={f.name} onClick={() => setExpandedFood(expandedFood === f.name ? null : f.name)}
                    className={`bg-white rounded-2xl border-2 shadow-sm p-4 text-left transition-all ${
                      expandedFood === f.name ? "border-emerald-400" : "border-emerald-100 hover:border-emerald-300"
                    }`}>
                    <span className="text-3xl block mb-2">{f.emoji}</span>
                    <p className="text-sm font-black text-slate-700">{f.name}</p>
                    {expandedFood === f.name && (
                      <p className="text-xs text-emerald-600 mt-1 font-semibold">{f.note}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Avoid foods */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚫</span>
                <h3 className="text-lg font-black text-red-600"
                  style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>Foods to Avoid</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AVOID_FOODS.map(f => (
                  <div key={f.name} className="bg-red-50 rounded-2xl border-2 border-red-100 p-4">
                    <span className="text-3xl block mb-2">{f.emoji}</span>
                    <p className="text-sm font-black text-slate-700">{f.name}</p>
                    <p className="text-xs text-red-500 mt-1 font-semibold">{f.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal tips */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5">
              <p className="text-base font-black text-slate-700 mb-3">🍱 Healthy Eating Rules</p>
              {[
                "Eat small meals every 3–4 hours. Don't skip meals.",
                "Fill half your plate with vegetables.",
                "Choose whole grains over refined grains.",
                "Drink plenty of water — avoid sugary drinks.",
                "Avoid eating late at night.",
                "Check labels on packaged food for hidden sugar.",
              ].map(tip => (
                <div key={tip} className="flex gap-3 mb-2">
                  <span className="text-emerald-500 font-black flex-shrink-0">✓</span>
                  <p className="text-base text-slate-600">{tip}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── FOOT CARE TAB ── */}
        {tab === "footcare" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                👣 Daily Foot Care
              </h2>
              {footSaved && (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">✅ Done today!</span>
              )}
            </div>

            {/* Why foot care matters */}
            <div className="rounded-2xl p-5 text-white"
              style={{ background: "linear-gradient(135deg,#059669,#0891b2)" }}>
              <p className="text-lg font-black mb-2">Why Foot Care is Critical</p>
              <p className="text-sm opacity-90 leading-relaxed">
                Diabetes reduces blood flow and sensation in the feet. Even a small cut or blister can become
                a serious wound if not noticed early. Daily foot checks can prevent dangerous infections and amputation.
              </p>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-sm p-5">
              <h3 className="text-base font-black text-slate-600 uppercase tracking-wide mb-4">
                Today's Foot Check · {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
              </h3>
              <div className="space-y-3">
                {FOOT_CHECKS.map(fc => (
                  <button key={fc.id}
                    onClick={() => setFootChecks(f => ({ ...f, [fc.id]: !f[fc.id] }))}
                    className={`w-full flex items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-all text-left ${
                      footChecks[fc.id]
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-slate-50 border-slate-200 hover:border-emerald-200"
                    }`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-black flex-shrink-0 transition-all ${
                      footChecks[fc.id] ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {footChecks[fc.id] ? "✓" : ""}
                    </div>
                    <span className="text-xl flex-shrink-0">{fc.icon}</span>
                    <p className={`text-base font-semibold ${footChecks[fc.id] ? "text-emerald-700" : "text-slate-700"}`}>
                      {fc.label}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-slate-50 rounded-2xl px-4 py-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Completed</span>
                  <span className="font-bold text-emerald-600">
                    {Object.values(footChecks).filter(Boolean).length}/{FOOT_CHECKS.length}
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(Object.values(footChecks).filter(Boolean).length / FOOT_CHECKS.length) * 100}%`,
                      background: "linear-gradient(90deg,#059669,#0891b2)"
                    }} />
                </div>
              </div>

              <button onClick={saveFootCheck}
                disabled={Object.values(footChecks).filter(Boolean).length < FOOT_CHECKS.length}
                className="mt-4 w-full text-white font-black py-4 rounded-2xl text-base shadow-md disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg,#059669,#0891b2)" }}>
                👣 Save Today's Foot Check
              </button>
            </div>

            {/* Warning signs */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
              <p className="text-base font-black text-red-700 mb-3">🚨 See Doctor Immediately If You Notice:</p>
              {["Any open wound, cut or ulcer on foot", "Blackening or darkening of skin", "Pus, discharge or bad smell", "Severe pain or numbness in feet", "Swelling that doesn't reduce in 2 days"].map(s => (
                <div key={s} className="flex gap-2 mb-2">
                  <span className="text-red-500 flex-shrink-0">•</span>
                  <p className="text-base text-red-600">{s}</p>
                </div>
              ))}
            </div>

            {/* Footwear tips */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5">
              <p className="text-base font-black text-slate-700 mb-3">👟 Footwear Tips</p>
              {["Always wear shoes or slippers — never walk barefoot, even at home.", "Choose well-fitting, soft leather shoes with wide toe box.", "Check inside shoes for sharp objects before wearing.", "Never wear tight socks or elastic-top socks.", "Change socks daily. Use clean cotton socks."].map(tip => (
                <div key={tip} className="flex gap-3 mb-2">
                  <span className="text-emerald-500 font-black flex-shrink-0">✓</span>
                  <p className="text-base text-slate-600">{tip}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                📈 My Progress
              </h2>
              <div className="flex gap-1">
                {[7, 14, 30].map(d => (
                  <button key={d} onClick={() => setFilterDays(d)}
                    className={`text-sm px-3 py-1.5 rounded-xl font-bold transition-all ${
                      filterDays === d ? "text-white" : "text-slate-400 bg-slate-100"
                    }`}
                    style={filterDays === d ? { background: "linear-gradient(135deg,#059669,#0891b2)" } : {}}>
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Averages */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Avg Fasting", val: avgFasting, unit: "mg/dL", color: "#059669", icon: "🌅" },
                { label: "Avg Post-Meal", val: avgPostMeal, unit: "mg/dL", color: "#0891b2", icon: "🍽️" },
                { label: "Readings", val: filteredReadings.length, unit: "total", color: "#8b5cf6", icon: "📊" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-4 text-center">
                  <p className="text-xl mb-1">{s.icon}</p>
                  <p className="text-2xl font-black" style={{ color: s.color, fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>{s.val}</p>
                  <p className="text-xs text-slate-400">{s.unit}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Blood Sugar Trend</h3>
              <BsChart readings={filteredReadings} />
            </div>

            {/* HbA1c tracker */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">🧪 HbA1c Log</h3>
              <p className="text-xs text-slate-400 mb-3">Target: Below 7% · Ask your doctor every 3 months</p>
              <div className="space-y-2 mb-4">
                {hba1cLog.map((e, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <span className="text-sm font-semibold text-slate-600">{e.date}</span>
                    <span className={`text-base font-black ${e.value <= 7 ? "text-emerald-600" : e.value <= 8 ? "text-amber-600" : "text-red-600"}`}>
                      {e.value}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="number" step="0.1" value={hba1c} onChange={e => setHba1c(e.target.value)}
                  placeholder="Enter HbA1c %"
                  className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-emerald-400 bg-slate-50" />
                <button onClick={logHba1c}
                  className="text-white font-black px-5 py-3 rounded-2xl"
                  style={{ background: "linear-gradient(135deg,#059669,#0891b2)" }}>Log</button>
              </div>
            </div>

            {/* Weight tracker */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">⚖️ Weight (kg)</h3>
              <p className="text-xs text-slate-400 mb-4">Maintaining healthy weight helps control blood sugar</p>
              <div className="flex items-end gap-2 h-20 mb-4">
                {weightLog.slice(-6).map((w, i, arr) => {
                  const vals = arr.map(x => x.value);
                  const mn = Math.min(...vals) - 1, mx = Math.max(...vals) + 1;
                  const h = Math.round(((w.value - mn) / (mx - mn)) * 56) + 16;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-500">{w.value}</span>
                      <div className="w-full rounded-t-lg"
                        style={{ height: `${h}px`, background: i === arr.length-1 ? "linear-gradient(180deg,#059669,#0891b2)" : "#e2e8f0" }} />
                      <span className="text-xs text-slate-400">{w.date.split(" ")[1]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder="Today's weight (kg)"
                  className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 outline-none focus:border-emerald-400 bg-slate-50" />
                <button onClick={logWeight}
                  className="text-white font-black px-5 py-3 rounded-2xl"
                  style={{ background: "linear-gradient(135deg,#059669,#0891b2)" }}>Log</button>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Reading Breakdown</h3>
              {["Normal", "Elevated", "High", "Very High", "Too Low"].map(label => {
                const count = filteredReadings.filter(r => classifyBS(r.value, r.timing).label.startsWith(label.split(" ")[0])).length;
                if (!count) return null;
                const pct = Math.round((count / filteredReadings.length) * 100);
                const c = { Normal: "#16a34a", Elevated: "#ca8a04", High: "#ea580c", "Very High": "#dc2626", "Too Low": "#3b82f6" }[label] || "#94a3b8";
                return (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold" style={{ color: c }}>{label}</span>
                      <span className="text-slate-500">{count} readings ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 shadow-2xl z-20">
        <div className="max-w-xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black"
              style={{ background: "linear-gradient(135deg,#059669,#0891b2)" }}>
              {readings.length}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Total Readings</p>
              <p className="text-base font-black text-slate-700">{readings.length} logged</p>
            </div>
          </div>
          {latest && latestClass && (
            <div className="text-right">
              <p className="text-xs text-slate-400">Last Reading</p>
              <p className="text-base font-black" style={{ color: latestClass.color }}>
                {latest.value} mg/dL · {latestClass.label}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
