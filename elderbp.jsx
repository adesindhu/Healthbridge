import { useState, useMemo } from "react";

// ─── BP Classification ────────────────────────────────────────────────────────
function classifyBP(sys, dia) {
  if (sys < 90 || dia < 60)   return { label: "Low",        color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", emoji: "📉", advice: "BP is low. Rest, drink water, and contact your doctor if dizzy." };
  if (sys < 120 && dia < 80)  return { label: "Normal",     color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", emoji: "✅", advice: "Your blood pressure is healthy. Keep up your good habits!" };
  if (sys < 130 && dia < 80)  return { label: "Elevated",   color: "#ca8a04", bg: "#fefce8", border: "#fef08a", emoji: "⚠️", advice: "Slightly elevated. Reduce salt intake and take light walks daily." };
  if (sys < 140 || dia < 90)  return { label: "High Stage 1", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", emoji: "🔶", advice: "Stage 1 High BP. Please consult your doctor soon." };
  if (sys < 180 || dia < 120) return { label: "High Stage 2", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", emoji: "🔴", advice: "Stage 2 High BP. Please see your doctor as soon as possible." };
  return { label: "Crisis",   color: "#7c3aed", bg: "#fdf4ff", border: "#e9d5ff", emoji: "🚨", advice: "HYPERTENSIVE CRISIS — Seek emergency medical care immediately!" };
}

// ─── Sample seed data ──────────────────────────────────────────────────────────
const SEED = [
  { id: 1, sys: 122, dia: 78, pulse: 72, date: "2025-02-20", time: "08:00", arm: "Left",  note: "After breakfast" },
  { id: 2, sys: 135, dia: 85, pulse: 76, date: "2025-02-21", time: "07:45", arm: "Right", note: "Before medication" },
  { id: 3, sys: 118, dia: 74, pulse: 68, date: "2025-02-22", time: "08:10", arm: "Left",  note: "Rested well" },
  { id: 4, sys: 142, dia: 92, pulse: 80, date: "2025-02-23", time: "09:00", arm: "Right", note: "Stressful morning" },
  { id: 5, sys: 128, dia: 82, pulse: 74, date: "2025-02-24", time: "07:55", arm: "Left",  note: "" },
  { id: 6, sys: 119, dia: 76, pulse: 70, date: "2025-02-25", time: "08:20", arm: "Left",  note: "After walk" },
  { id: 7, sys: 130, dia: 84, pulse: 75, date: "2025-02-26", time: "08:05", arm: "Right", note: "" },
];

// ─── Mini SVG line chart ───────────────────────────────────────────────────────
function LineChart({ readings }) {
  const W = 340, H = 110, PAD = 16;
  if (readings.length < 2) return <p className="text-center text-slate-400 text-base py-6">Log at least 2 readings to see chart</p>;

  const last7 = readings.slice(-7);
  const sysVals = last7.map(r => r.sys);
  const diaVals = last7.map(r => r.dia);
  const allVals = [...sysVals, ...diaVals];
  const minV = Math.min(...allVals) - 10;
  const maxV = Math.max(...allVals) + 10;

  const xPos = (i) => PAD + (i / (last7.length - 1)) * (W - PAD * 2);
  const yPos = (v) => PAD + ((maxV - v) / (maxV - minV)) * (H - PAD * 2);

  const polyline = (vals, color, stroke = 2.5) => {
    const pts = vals.map((v, i) => `${xPos(i)},${yPos(v)}`).join(" ");
    return (
      <>
        <polyline points={pts} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" />
        {vals.map((v, i) => (
          <circle key={i} cx={xPos(i)} cy={yPos(v)} r={4} fill={color} stroke="white" strokeWidth={1.5} />
        ))}
      </>
    );
  };

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid lines */}
        {[120, 140].map(v => (
          <line key={v} x1={PAD} y1={yPos(v)} x2={W - PAD} y2={yPos(v)}
            stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4,3" />
        ))}
        {polyline(sysVals, "#ef4444")}
        {polyline(diaVals, "#3b82f6")}
      </svg>
      <div className="flex justify-around mt-1">
        {last7.map((r, i) => (
          <span key={i} className="text-xs text-slate-400" style={{ fontFamily: "Georgia, serif" }}>
            {r.date.slice(5).replace("-", "/")}
          </span>
        ))}
      </div>
      <div className="flex gap-5 mt-2 justify-center">
        <span className="flex items-center gap-1 text-sm text-red-500 font-semibold">
          <span className="w-4 h-0.5 bg-red-500 inline-block rounded-full" /> Systolic
        </span>
        <span className="flex items-center gap-1 text-sm text-blue-500 font-semibold">
          <span className="w-4 h-0.5 bg-blue-500 inline-block rounded-full" /> Diastolic
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BPTracker() {
  const [tab, setTab] = useState("log");
  const [readings, setReadings] = useState(SEED);
  const [form, setForm] = useState({ sys: "", dia: "", pulse: "", arm: "Left", note: "" });
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterDays, setFilterDays] = useState(7);

  const today = new Date().toISOString().slice(0, 10);
  const now   = new Date().toTimeString().slice(0, 5);

  const handleAdd = () => {
    const s = parseInt(form.sys), d = parseInt(form.dia), p = parseInt(form.pulse);
    if (!s || !d || s < 60 || s > 250 || d < 40 || d > 150) return;
    const entry = { id: Date.now(), sys: s, dia: d, pulse: p || 0, date: today, time: now, arm: form.arm, note: form.note.trim() };
    setReadings(r => [entry, ...r]);
    setForm({ sys: "", dia: "", pulse: "", arm: "Left", note: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const latest = readings[0];
  const latestClass = latest ? classifyBP(latest.sys, latest.dia) : null;

  const filteredReadings = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filterDays);
    return readings.filter(r => new Date(r.date) >= cutoff);
  }, [readings, filterDays]);

  const avgSys  = filteredReadings.length ? Math.round(filteredReadings.reduce((s, r) => s + r.sys, 0)  / filteredReadings.length) : "--";
  const avgDia  = filteredReadings.length ? Math.round(filteredReadings.reduce((s, r) => s + r.dia, 0)  / filteredReadings.length) : "--";
  const avgPulse= filteredReadings.length ? Math.round(filteredReadings.reduce((s, r) => s + (r.pulse || 0), 0) / filteredReadings.length) : "--";

  const field = (key, label, placeholder, max) => (
    <div>
      <label className="block text-base font-bold text-slate-600 mb-2" style={{ fontFamily: "Georgia, serif" }}>{label}</label>
      <input
        type="number" value={form[key]} max={max}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full text-2xl font-bold text-slate-800 bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-red-400 transition-colors"
        style={{ fontFamily: "Georgia, serif" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf8f4]" style={{ fontFamily: "Georgia, serif" }}>

      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl bg-red-300" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl bg-blue-300" />
      </div>

      {/* Toast */}
      {saved && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-lg px-6 py-3 rounded-2xl shadow-xl font-bold">
          ✅ Reading saved!
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 px-5 pt-10 pb-6 max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-red-400 text-sm font-bold tracking-widest uppercase mb-1">❤️ Heart Health</p>
            <h1 className="text-4xl font-black text-slate-800 leading-tight" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              Blood Pressure<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg,#ef4444,#dc2626)" }}>Tracker</span>
            </h1>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-red-100"
            style={{ background: "linear-gradient(135deg,#fff1f1,#ffe4e4)" }}>
            🩺
          </div>
        </div>

        {/* Latest reading banner */}
        {latest && latestClass && (
          <div className="rounded-3xl p-5 border-2 shadow-md"
            style={{ background: latestClass.bg, borderColor: latestClass.border }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold text-slate-500 uppercase tracking-wide">Latest Reading</p>
              <span className="text-sm font-bold px-3 py-1 rounded-full text-white"
                style={{ background: latestClass.color }}>
                {latestClass.emoji} {latestClass.label}
              </span>
            </div>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-6xl font-black text-slate-800" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif", color: latestClass.color }}>
                {latest.sys}
              </span>
              <span className="text-4xl font-black text-slate-500 mb-1">/</span>
              <span className="text-4xl font-black text-slate-700 mb-1">{latest.dia}</span>
              <span className="text-2xl text-slate-500 mb-1 ml-1">mmHg</span>
              {latest.pulse > 0 && (
                <span className="text-xl text-slate-400 mb-1 ml-2">💓 {latest.pulse} bpm</span>
              )}
            </div>
            <p className="text-base text-slate-600 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
              {latestClass.advice}
            </p>
            <p className="text-sm text-slate-400 mt-2">{latest.date} at {latest.time} — {latest.arm} arm</p>
          </div>
        )}
      </header>

      {/* Nav */}
      <nav className="relative z-10 max-w-xl mx-auto px-5 mb-6">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200 gap-1">
          {[
            { id: "log",     label: "Log BP",   icon: "➕" },
            { id: "history", label: "History",  icon: "📋" },
            { id: "trends",  label: "Trends",   icon: "📈" },
            { id: "guide",   label: "Guide",    icon: "📖" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === t.id ? "text-white shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
              style={tab === t.id ? { background: "linear-gradient(135deg,#ef4444,#b91c1c)" } : {}}>
              <span className="block text-xl mb-0.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative z-10 max-w-xl mx-auto px-5 pb-24 space-y-5">

        {/* ── LOG TAB ── */}
        {tab === "log" && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-6">
              <h2 className="text-xl font-black text-slate-700 mb-5" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                📝 Record New Reading
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {field("sys", "🔴 Systolic (top)", "e.g. 120", 250)}
                {field("dia", "🔵 Diastolic (bottom)", "e.g. 80", 150)}
              </div>
              {field("pulse", "💓 Pulse (optional)", "e.g. 72", 200)}

              {/* Arm selector */}
              <div className="mt-4">
                <label className="block text-base font-bold text-slate-600 mb-2">💪 Arm Used</label>
                <div className="flex gap-3">
                  {["Left", "Right"].map(a => (
                    <button key={a} onClick={() => setForm(f => ({ ...f, arm: a }))}
                      className={`flex-1 py-3 rounded-2xl text-base font-bold border-2 transition-all ${
                        form.arm === a ? "text-white border-red-400" : "text-slate-500 border-slate-200 bg-white hover:border-slate-300"
                      }`}
                      style={form.arm === a ? { background: "linear-gradient(135deg,#ef4444,#b91c1c)" } : {}}>
                      {a === "Left" ? "👈 Left" : "👉 Right"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mt-4">
                <label className="block text-base font-bold text-slate-600 mb-2">📝 Note (optional)</label>
                <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="e.g. After medication, before breakfast..."
                  className="w-full text-base text-slate-700 bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-red-400 transition-colors"
                  style={{ fontFamily: "Georgia, serif" }} />
              </div>

              {/* Preview classification */}
              {form.sys && form.dia && parseInt(form.sys) > 60 && parseInt(form.dia) > 40 && (() => {
                const c = classifyBP(parseInt(form.sys), parseInt(form.dia));
                return (
                  <div className="mt-4 rounded-2xl px-4 py-3 border-2 text-base font-bold"
                    style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                    {c.emoji} This reading is: <strong>{c.label}</strong>
                  </div>
                );
              })()}

              <button onClick={handleAdd}
                disabled={!form.sys || !form.dia}
                className="mt-5 w-full text-white text-xl font-black py-5 rounded-2xl shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)", fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                💾 Save Reading
              </button>
            </div>

            {/* Tips box */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5">
              <p className="font-black text-amber-800 text-base mb-2">📌 For Best Results</p>
              <ul className="space-y-1.5 text-sm text-amber-700 list-none">
                {["Sit quietly for 5 minutes before measuring.", "Keep your arm at heart level.", "Measure at the same time each day.", "Avoid caffeine or exercise 30 min before."].map(t => (
                  <li key={t} className="flex gap-2"><span>•</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                📋 Reading History
              </h2>
              <span className="text-sm text-slate-400">{readings.length} total</span>
            </div>

            {readings.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-lg">
                <p className="text-5xl mb-4">📭</p>
                No readings yet. Go log your first one!
              </div>
            ) : readings.map(r => {
              const c = classifyBP(r.sys, r.dia);
              return (
                <div key={r.id} className="bg-white rounded-2xl border-2 shadow-sm overflow-hidden"
                  style={{ borderColor: c.border }}>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm"
                        style={{ background: c.color }}>
                        {c.emoji}
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-800" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                          <span style={{ color: "#ef4444" }}>{r.sys}</span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span style={{ color: "#3b82f6" }}>{r.dia}</span>
                          <span className="text-base text-slate-400 ml-1">mmHg</span>
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {r.date} · {r.time} · {r.arm} arm
                          {r.pulse > 0 && <span className="ml-2">💓{r.pulse}</span>}
                        </p>
                        {r.note && <p className="text-sm text-slate-500 italic mt-0.5">"{r.note}"</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: c.color }}>{c.label}</span>
                      <button onClick={() => setDeleteId(r.id === deleteId ? null : r.id)}
                        className="text-slate-300 hover:text-red-400 text-2xl transition-colors leading-none">×</button>
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
          </div>
        )}

        {/* ── TRENDS TAB ── */}
        {tab === "trends" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
                📈 Trends
              </h2>
              <div className="flex gap-1">
                {[7, 14, 30].map(d => (
                  <button key={d} onClick={() => setFilterDays(d)}
                    className={`text-sm px-3 py-1.5 rounded-xl font-bold transition-all ${
                      filterDays === d ? "text-white" : "text-slate-400 bg-slate-100"
                    }`}
                    style={filterDays === d ? { background: "linear-gradient(135deg,#ef4444,#b91c1c)" } : {}}>
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Averages */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Avg Systolic",  val: avgSys,   unit: "mmHg", color: "#ef4444", icon: "🔴" },
                { label: "Avg Diastolic", val: avgDia,   unit: "mmHg", color: "#3b82f6", icon: "🔵" },
                { label: "Avg Pulse",     val: avgPulse, unit: "bpm",  color: "#f59e0b", icon: "💓" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-4 text-center">
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className="text-3xl font-black" style={{ color: s.color, fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>{s.val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.unit}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Average classification */}
            {avgSys !== "--" && avgDia !== "--" && (() => {
              const c = classifyBP(avgSys, avgDia);
              return (
                <div className="rounded-2xl p-4 border-2 text-base font-bold"
                  style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                  {c.emoji} Average BP is: <strong>{c.label}</strong>
                  <p className="font-normal text-slate-600 text-sm mt-1">{c.advice}</p>
                </div>
              );
            })()}

            {/* Chart */}
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-base font-black text-slate-600 mb-4 uppercase tracking-wide">Last {Math.min(filteredReadings.length, 7)} Readings</h3>
              <LineChart readings={[...filteredReadings].reverse()} />
            </div>

            {/* Category breakdown */}
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-base font-black text-slate-600 mb-4 uppercase tracking-wide">Reading Categories</h3>
              {["Normal", "Elevated", "High Stage 1", "High Stage 2", "Crisis", "Low"].map(label => {
                const count = filteredReadings.filter(r => classifyBP(r.sys, r.dia).label === label).length;
                const pct = filteredReadings.length ? Math.round((count / filteredReadings.length) * 100) : 0;
                const c = { Normal: "#16a34a", Elevated: "#ca8a04", "High Stage 1": "#ea580c", "High Stage 2": "#dc2626", Crisis: "#7c3aed", Low: "#3b82f6" }[label];
                if (count === 0) return null;
                return (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold" style={{ color: c }}>{label}</span>
                      <span className="text-slate-500">{count} reading{count > 1 ? "s" : ""} ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
              {filteredReadings.length === 0 && <p className="text-slate-400 text-center py-4">No readings in this period</p>}
            </div>
          </div>
        )}

        {/* ── GUIDE TAB ── */}
        {tab === "guide" && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-slate-700" style={{ fontFamily: "Palatino Linotype, Palatino, Georgia, serif" }}>
              📖 Understanding Blood Pressure
            </h2>

            {/* BP Categories */}
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-base font-black text-slate-600 mb-4 uppercase tracking-wide">BP Categories</h3>
              <div className="space-y-3">
                {[
                  { range: "Below 90/60", label: "Low (Hypotension)", color: "#3b82f6", bg: "#eff6ff" },
                  { range: "Below 120/80", label: "Normal", color: "#16a34a", bg: "#f0fdf4" },
                  { range: "120–129 / below 80", label: "Elevated", color: "#ca8a04", bg: "#fefce8" },
                  { range: "130–139 / 80–89", label: "High – Stage 1", color: "#ea580c", bg: "#fff7ed" },
                  { range: "140+ / 90+", label: "High – Stage 2", color: "#dc2626", bg: "#fef2f2" },
                  { range: "180+ / 120+", label: "Hypertensive Crisis 🚨", color: "#7c3aed", bg: "#fdf4ff" },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-4 rounded-2xl px-4 py-3 border-2"
                    style={{ background: c.bg, borderColor: c.color + "44" }}>
                    <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <div>
                      <p className="font-black text-slate-800 text-sm">{c.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.range} mmHg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifestyle tips */}
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-5">
              <h3 className="text-base font-black text-slate-600 mb-4 uppercase tracking-wide">💚 Lifestyle Tips</h3>
              <div className="space-y-4">
                {[
                  { icon: "🥗", title: "Eat Heart-Healthy", desc: "Reduce salt, eat more fruits, vegetables, and whole grains. The DASH diet is excellent for BP control." },
                  { icon: "🚶", title: "Stay Active", desc: "30 minutes of moderate activity like walking 5 days a week can lower systolic BP by 5–8 mmHg." },
                  { icon: "🚭", title: "Avoid Smoking", desc: "Each cigarette temporarily raises BP. Quitting leads to a major long-term improvement." },
                  { icon: "🍷", title: "Limit Alcohol", desc: "Limit to 1 drink/day for women, 2 for men. Excess alcohol raises BP significantly." },
                  { icon: "😴", title: "Sleep Well", desc: "Poor sleep is linked to higher BP. Aim for 7–8 hours of quality rest each night." },
                  { icon: "🧘", title: "Manage Stress", desc: "Deep breathing, prayer, or light meditation can lower both stress and blood pressure." },
                ].map(tip => (
                  <div key={tip.title} className="flex gap-4">
                    <span className="text-3xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <p className="font-black text-slate-800 text-base">{tip.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5">
              <p className="font-black text-red-700 text-lg mb-3">🚨 Seek Immediate Help If:</p>
              <ul className="space-y-2 text-base text-red-600">
                {[
                  "BP reads 180/120 or higher",
                  "Severe headache or chest pain",
                  "Sudden blurred vision",
                  "Difficulty speaking or breathing",
                  "Numbness in face, arm, or leg",
                ].map(s => <li key={s} className="flex gap-2"><span>•</span>{s}</li>)}
              </ul>
              <div className="mt-4 bg-white rounded-2xl px-5 py-4 border border-red-200 space-y-1">
                <p className="font-black text-red-700">📞 Emergency Numbers</p>
                <p className="text-base text-red-600">Emergency: <strong>112</strong></p>
                <p className="text-base text-red-600">Ambulance: <strong>108</strong></p>
                <p className="text-base text-red-600">Health Helpline: <strong>104</strong></p>
              </div>
            </div>

            {/* Doctor reminder */}
            <div className="rounded-3xl p-5 text-white"
              style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}>
              <p className="text-lg font-black mb-2">🩺 See Your Doctor Regularly</p>
              <p className="text-red-100 leading-relaxed text-base">
                Even if your BP feels normal, schedule check-ups every 6 months. Always share your tracking log with your physician at every visit.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 shadow-2xl z-20">
        <div className="max-w-xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}>
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
                {latest.sys}/{latest.dia} — {latestClass.label}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
