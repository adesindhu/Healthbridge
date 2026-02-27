import { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toTimeString().slice(0, 5);

const bsColor = (v) =>
  v < 70 ? "#3b82f6" : v <= 140 ? "#22c55e" : v <= 180 ? "#f59e0b" : "#ef4444";
const bsTag = (v) =>
  v < 70 ? "Low" : v <= 140 ? "Normal" : v <= 180 ? "High" : "Very High";

export default function DiabetesTracker() {
  const [tab, setTab] = useState("blood");

  // Blood Sugar
  const [bsLogs, setBsLogs] = useState([
    { id: 1, value: 98,  label: "Fasting",     time: "07:15", date: "2024-01-17" },
    { id: 2, value: 142, label: "After Lunch",  time: "13:10", date: "2024-01-17" },
    { id: 3, value: 115, label: "Bedtime",      time: "22:00", date: "2024-01-16" },
  ]);
  const [bsForm, setBsForm] = useState({ value: "", label: "Fasting", time: now(), date: today() });

  // Insulin
  const [insLogs, setInsLogs] = useState([
    { id: 1, dose: 6,  type: "Rapid", time: "07:20", date: "2024-01-17" },
    { id: 2, dose: 20, type: "Basal", time: "22:00", date: "2024-01-16" },
  ]);
  const [insForm, setInsForm] = useState({ dose: "", type: "Rapid", time: now(), date: today() });

  // Meals
  const [mealLogs, setMealLogs] = useState([
    { id: 1, name: "Oatmeal & berries",    carbs: 45, cal: 320, time: "07:30", date: "2024-01-17" },
    { id: 2, name: "Grilled chicken salad",carbs: 22, cal: 410, time: "13:00", date: "2024-01-17" },
  ]);
  const [mealForm, setMealForm] = useState({ name: "", carbs: "", cal: "", time: now(), date: today() });

  const addBS = () => {
    if (!bsForm.value || !bsForm.time) return;
    setBsLogs(p => [{ ...bsForm, id: Date.now(), value: +bsForm.value }, ...p]);
    setBsForm({ value: "", label: "Fasting", time: now(), date: today() });
  };

  const addIns = () => {
    if (!insForm.dose || !insForm.time) return;
    setInsLogs(p => [{ ...insForm, id: Date.now(), dose: +insForm.dose }, ...p]);
    setInsForm({ dose: "", type: "Rapid", time: now(), date: today() });
  };

  const addMeal = () => {
    if (!mealForm.name || !mealForm.carbs) return;
    setMealLogs(p => [{ ...mealForm, id: Date.now(), carbs: +mealForm.carbs, cal: +mealForm.cal || 0 }, ...p]);
    setMealForm({ name: "", carbs: "", cal: "", time: now(), date: today() });
  };

  const tabs = [
    { id: "blood",   label: "Blood Sugar", icon: "🩸" },
    { id: "insulin", label: "Insulin",     icon: "💉" },
    { id: "meals",   label: "Meals",       icon: "🍽️" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #f8fafc; }
        input, select, button { font-family: 'Nunito', sans-serif; }
        input:focus, select:focus { outline: none; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }

        .field input, .field select {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          color: #1e293b;
          transition: border-color 0.2s, background 0.2s;
        }
        .field input:focus, .field select:focus {
          border-color: #6366f1;
          background: #fff;
        }

        .add-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .add-btn:active { transform: translateY(0); }

        .log-row { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
        .log-row:hover { background: #fafbff; }
        .log-row:last-child { border-bottom: none; }

        .tab-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 10px 8px; border: none; background: none; cursor: pointer;
          font-size: 11px; font-weight: 700; color: #94a3b8;
          border-radius: 12px; transition: all 0.2s;
        }
        .tab-btn.active { background: #eff0ff; color: #6366f1; }
        .tab-btn:hover:not(.active) { background: #f8fafc; color: #475569; }

        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .page { animation: slideIn 0.3s ease forwards; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "88px" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8edf2", padding: "20px 20px 16px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.3px" }}>
              🩺 Diabetes Tracker
            </h1>
            <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500, marginTop: "2px" }}>
              Log your readings, insulin & meals
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* ── BLOOD SUGAR ── */}
          {tab === "blood" && (
            <div className="page">
              {/* Form card */}
              <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e8edf2", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", padding: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "14px" }}>
                  New Reading
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>mg/dL</p>
                    <input type="number" placeholder="e.g. 120" value={bsForm.value} onChange={e => setBsForm({ ...bsForm, value: e.target.value })} />
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Label</p>
                    <select value={bsForm.label} onChange={e => setBsForm({ ...bsForm, label: e.target.value })}>
                      {["Fasting","Before Meal","After Meal","After Breakfast","After Lunch","After Dinner","Bedtime","Random"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Time</p>
                    <input type="time" value={bsForm.time} onChange={e => setBsForm({ ...bsForm, time: e.target.value })} />
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Date</p>
                    <input type="date" value={bsForm.date} onChange={e => setBsForm({ ...bsForm, date: e.target.value })} />
                  </div>
                </div>

                <button className="add-btn" onClick={addBS}>+ Add Reading</button>
              </div>

              {/* Log list */}
              <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e8edf2", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", padding: "16px 16px 8px" }}>
                  History · {bsLogs.length} entries
                </p>
                {bsLogs.map(l => (
                  <div key={l.id} className="log-row">
                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: `${bsColor(l.value)}15`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px", flexShrink: 0 }}>
                      <span style={{ fontSize: "20px" }}>🩸</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{l.label}</p>
                      <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{l.date} · {l.time}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "18px", fontWeight: 800, color: bsColor(l.value), lineHeight: 1 }}>{l.value}</p>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: bsColor(l.value), background: `${bsColor(l.value)}15`, padding: "2px 8px", borderRadius: "100px", marginTop: "3px", display: "inline-block" }}>
                        {bsTag(l.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INSULIN ── */}
          {tab === "insulin" && (
            <div className="page">
              <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e8edf2", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", padding: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "14px" }}>
                  New Dose
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Units</p>
                    <input type="number" placeholder="e.g. 8" value={insForm.dose} onChange={e => setInsForm({ ...insForm, dose: e.target.value })} />
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Type</p>
                    <select value={insForm.type} onChange={e => setInsForm({ ...insForm, type: e.target.value })}>
                      {["Rapid","Basal","Mixed","Regular"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Time</p>
                    <input type="time" value={insForm.time} onChange={e => setInsForm({ ...insForm, time: e.target.value })} />
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Date</p>
                    <input type="date" value={insForm.date} onChange={e => setInsForm({ ...insForm, date: e.target.value })} />
                  </div>
                </div>

                <button className="add-btn" onClick={addIns}>+ Add Dose</button>
              </div>

              {/* Quick summary pills */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Rapid Total", val: insLogs.filter(l => l.type === "Rapid").reduce((s, l) => s + l.dose, 0), color: "#6366f1", icon: "⚡" },
                  { label: "Basal Total", val: insLogs.filter(l => l.type === "Basal").reduce((s, l) => s + l.dose, 0),  color: "#8b5cf6", icon: "🌙" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: "14px", border: `1px solid ${s.color}20`, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <span style={{ fontSize: "20px" }}>{s.icon}</span>
                    <p style={{ fontSize: "22px", fontWeight: 800, color: s.color, margin: "6px 0 2px" }}>{s.val} <span style={{ fontSize: "12px", fontWeight: 500 }}>u</span></p>
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e8edf2", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", padding: "16px 16px 8px" }}>
                  History · {insLogs.length} entries
                </p>
                {insLogs.map(l => {
                  const c = l.type === "Rapid" ? "#6366f1" : l.type === "Basal" ? "#8b5cf6" : "#14b8a6";
                  return (
                    <div key={l.id} className="log-row">
                      <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: `${c}15`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px", flexShrink: 0 }}>
                        <span style={{ fontSize: "20px" }}>💉</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{l.type} Insulin</p>
                        <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{l.date} · {l.time}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "18px", fontWeight: 800, color: c, lineHeight: 1 }}>{l.dose}</p>
                        <p style={{ fontSize: "10px", color: c, fontWeight: 700 }}>units</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── MEALS ── */}
          {tab === "meals" && (
            <div className="page">
              <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e8edf2", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", padding: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "14px" }}>
                  New Meal
                </p>

                <div className="field" style={{ marginBottom: "10px" }}>
                  <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Meal Name</p>
                  <input type="text" placeholder="e.g. Oatmeal with berries" value={mealForm.name} onChange={e => setMealForm({ ...mealForm, name: e.target.value })} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Carbs (g)</p>
                    <input type="number" placeholder="e.g. 45" value={mealForm.carbs} onChange={e => setMealForm({ ...mealForm, carbs: e.target.value })} />
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Calories</p>
                    <input type="number" placeholder="e.g. 320" value={mealForm.cal} onChange={e => setMealForm({ ...mealForm, cal: e.target.value })} />
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Time</p>
                    <input type="time" value={mealForm.time} onChange={e => setMealForm({ ...mealForm, time: e.target.value })} />
                  </div>
                  <div className="field">
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "5px" }}>Date</p>
                    <input type="date" value={mealForm.date} onChange={e => setMealForm({ ...mealForm, date: e.target.value })} />
                  </div>
                </div>

                <button className="add-btn" onClick={addMeal}>+ Add Meal</button>
              </div>

              {/* Carbs + Cal totals */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { icon: "🍞", label: "Total Carbs",    val: `${mealLogs.reduce((s,l)=>s+l.carbs,0)}g`, color: "#f59e0b" },
                  { icon: "🔥", label: "Total Calories", val: `${mealLogs.reduce((s,l)=>s+l.cal,0)}`,    color: "#ef4444" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: "14px", border: `1px solid ${s.color}20`, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <span style={{ fontSize: "20px" }}>{s.icon}</span>
                    <p style={{ fontSize: "22px", fontWeight: 800, color: s.color, margin: "6px 0 2px" }}>{s.val}</p>
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e8edf2", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", padding: "16px 16px 8px" }}>
                  History · {mealLogs.length} entries
                </p>
                {mealLogs.map(l => (
                  <div key={l.id} className="log-row">
                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px", flexShrink: 0 }}>
                      <span style={{ fontSize: "20px" }}>🍽️</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.name}</p>
                      <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{l.date} · {l.time}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "10px" }}>
                      <p style={{ fontSize: "15px", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{l.carbs}g</p>
                      <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500, marginTop: "2px" }}>{l.cal} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderTop: "1px solid #e8edf2", padding: "8px 16px 14px", zIndex: 50, boxShadow: "0 -4px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", gap: "8px" }}>
            {tabs.map(t => (
              <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
                <span style={{ fontSize: "22px" }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
