import { useState } from "react";

// ─── Vaccine Schedule Data ────────────────────────────────────────────────────
const SCHEDULE = [
  {
    age: "At Birth",
    ageMonths: 0,
    vaccines: [
      { id: "bcg", name: "BCG", full: "Bacillus Calmette-Guérin", disease: "Tuberculosis", color: "bg-sky-100 text-sky-700 border-sky-200" },
      { id: "hepb1", name: "Hep B (1st)", full: "Hepatitis B – Dose 1", disease: "Hepatitis B", color: "bg-violet-100 text-violet-700 border-violet-200" },
      { id: "opv0", name: "OPV (0)", full: "Oral Polio Vaccine – 0 Dose", disease: "Poliomyelitis", color: "bg-rose-100 text-rose-700 border-rose-200" },
    ],
  },
  {
    age: "6 Weeks",
    ageMonths: 1.5,
    vaccines: [
      { id: "dtap1", name: "DTaP (1st)", full: "Diphtheria, Tetanus, Pertussis – 1", disease: "Diphtheria / Whooping Cough / Tetanus", color: "bg-amber-100 text-amber-700 border-amber-200" },
      { id: "hib1", name: "Hib (1st)", full: "Haemophilus influenzae type b – 1", disease: "Meningitis", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      { id: "opv1", name: "OPV (1st)", full: "Oral Polio – 1st", disease: "Poliomyelitis", color: "bg-rose-100 text-rose-700 border-rose-200" },
      { id: "rota1", name: "Rotavirus (1st)", full: "Rotavirus – 1st Dose", disease: "Rotavirus Diarrhea", color: "bg-pink-100 text-pink-700 border-pink-200" },
    ],
  },
  {
    age: "10 Weeks",
    ageMonths: 2.5,
    vaccines: [
      { id: "dtap2", name: "DTaP (2nd)", full: "Diphtheria, Tetanus, Pertussis – 2", disease: "Diphtheria / Whooping Cough / Tetanus", color: "bg-amber-100 text-amber-700 border-amber-200" },
      { id: "hib2", name: "Hib (2nd)", full: "Haemophilus influenzae type b – 2", disease: "Meningitis", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      { id: "opv2", name: "OPV (2nd)", full: "Oral Polio – 2nd", disease: "Poliomyelitis", color: "bg-rose-100 text-rose-700 border-rose-200" },
      { id: "rota2", name: "Rotavirus (2nd)", full: "Rotavirus – 2nd Dose", disease: "Rotavirus Diarrhea", color: "bg-pink-100 text-pink-700 border-pink-200" },
    ],
  },
  {
    age: "14 Weeks",
    ageMonths: 3.5,
    vaccines: [
      { id: "dtap3", name: "DTaP (3rd)", full: "Diphtheria, Tetanus, Pertussis – 3", disease: "Diphtheria / Whooping Cough / Tetanus", color: "bg-amber-100 text-amber-700 border-amber-200" },
      { id: "hib3", name: "Hib (3rd)", full: "Haemophilus influenzae type b – 3", disease: "Meningitis", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      { id: "opv3", name: "OPV (3rd)", full: "Oral Polio – 3rd", disease: "Poliomyelitis", color: "bg-rose-100 text-rose-700 border-rose-200" },
      { id: "ipv", name: "IPV", full: "Inactivated Polio Vaccine", disease: "Poliomyelitis", color: "bg-orange-100 text-orange-700 border-orange-200" },
    ],
  },
  {
    age: "6 Months",
    ageMonths: 6,
    vaccines: [
      { id: "hepb2", name: "Hep B (2nd)", full: "Hepatitis B – Dose 2", disease: "Hepatitis B", color: "bg-violet-100 text-violet-700 border-violet-200" },
      { id: "flu1", name: "Influenza (1st)", full: "Influenza Vaccine – 1st dose", disease: "Influenza / Flu", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    ],
  },
  {
    age: "9 Months",
    ageMonths: 9,
    vaccines: [
      { id: "mmr1", name: "MMR (1st)", full: "Measles, Mumps, Rubella – 1", disease: "Measles / Mumps / Rubella", color: "bg-lime-100 text-lime-700 border-lime-200" },
      { id: "vitA1", name: "Vit A (1st)", full: "Vitamin A Supplement", disease: "Vitamin A Deficiency", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    ],
  },
  {
    age: "12 Months",
    ageMonths: 12,
    vaccines: [
      { id: "varicella", name: "Varicella", full: "Chickenpox Vaccine", disease: "Chickenpox", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
      { id: "hepA1", name: "Hep A (1st)", full: "Hepatitis A – Dose 1", disease: "Hepatitis A", color: "bg-teal-100 text-teal-700 border-teal-200" },
    ],
  },
  {
    age: "15 Months",
    ageMonths: 15,
    vaccines: [
      { id: "mmr2", name: "MMR (2nd)", full: "Measles, Mumps, Rubella – 2", disease: "Measles / Mumps / Rubella", color: "bg-lime-100 text-lime-700 border-lime-200" },
      { id: "dtap4", name: "DTaP (4th)", full: "Diphtheria, Tetanus, Pertussis – 4", disease: "Diphtheria / Whooping Cough / Tetanus", color: "bg-amber-100 text-amber-700 border-amber-200" },
    ],
  },
  {
    age: "18 Months",
    ageMonths: 18,
    vaccines: [
      { id: "hepA2", name: "Hep A (2nd)", full: "Hepatitis A – Dose 2", disease: "Hepatitis A", color: "bg-teal-100 text-teal-700 border-teal-200" },
      { id: "vitA2", name: "Vit A (2nd)", full: "Vitamin A Supplement", disease: "Vitamin A Deficiency", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    ],
  },
  {
    age: "4–6 Years",
    ageMonths: 54,
    vaccines: [
      { id: "dtap5", name: "DTaP (5th)", full: "Diphtheria, Tetanus, Pertussis – 5", disease: "Diphtheria / Whooping Cough / Tetanus", color: "bg-amber-100 text-amber-700 border-amber-200" },
      { id: "mmr3", name: "MMR Booster", full: "Measles, Mumps, Rubella Booster", disease: "Measles / Mumps / Rubella", color: "bg-lime-100 text-lime-700 border-lime-200" },
      { id: "opv4", name: "OPV Booster", full: "Oral Polio Booster", disease: "Poliomyelitis", color: "bg-rose-100 text-rose-700 border-rose-200" },
    ],
  },
];

const ALL_VACCINES = SCHEDULE.flatMap(s => s.vaccines.map(v => v.id));

// ─── Tip cards ────────────────────────────────────────────────────────────────
const TIPS = [
  { icon: "📋", title: "Keep Records", desc: "Always carry your child's vaccination card to every appointment." },
  { icon: "🌡️", title: "After Vaccine", desc: "Mild fever & soreness are normal. Use a cool cloth and consult your doctor if high fever persists." },
  { icon: "⏰", title: "Don't Skip Doses", desc: "Delayed or missed doses reduce protection. Catch-up vaccinations are available." },
  { icon: "🏥", title: "AEFI Alert", desc: "Report any unusual reaction after vaccination to your nearest health center." },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VaccinationTracker() {
  const [tab, setTab] = useState("schedule");
  const [done, setDone] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [childName, setChildName] = useState("Baby");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("Baby");
  const [childDOB, setChildDOB] = useState("");
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [appointments, setAppointments] = useState([
    { id: 1, date: "2025-03-05", vaccine: "MMR (1st)", note: "Pediatric clinic, Dr. Sharma" },
  ]);
  const [apptForm, setApptForm] = useState({ date: "", vaccine: "", note: "" });

  const totalVaccines = ALL_VACCINES.length;
  const completedCount = Object.values(done).filter(Boolean).length;
  const progress = Math.round((completedCount / totalVaccines) * 100);

  const toggleVaccine = (id) => setDone(prev => ({ ...prev, [id]: !prev[id] }));

  const addAppointment = () => {
    if (!apptForm.date || !apptForm.vaccine) return;
    setAppointments(prev => [...prev, { ...apptForm, id: Date.now() }]);
    setApptForm({ date: "", vaccine: "", note: "" });
  };

  const getAgeStatus = (ageMonths) => {
    if (!childDOB) return "upcoming";
    const today = new Date();
    const dob = new Date(childDOB);
    const childAgeMonths = (today - dob) / (1000 * 60 * 60 * 24 * 30.44);
    if (childAgeMonths >= ageMonths + 2) return "overdue";
    if (childAgeMonths >= ageMonths) return "due";
    return "upcoming";
  };

  const statusColors = {
    overdue: "border-l-4 border-l-red-400 bg-red-50",
    due: "border-l-4 border-l-amber-400 bg-amber-50",
    upcoming: "border-l-4 border-l-sky-200 bg-white",
  };

  const statusBadge = {
    overdue: "bg-red-100 text-red-600",
    due: "bg-amber-100 text-amber-600",
    upcoming: "bg-sky-100 text-sky-600",
  };

  const statusLabel = { overdue: "⚠ Overdue", due: "✓ Due Now", upcoming: "Upcoming" };

  return (
    <div className="min-h-screen bg-[#f5f9ff]" style={{ fontFamily: "Nunito, Georgia, sans-serif" }}>

      {/* Decorative top wave */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl bg-sky-400" />
          <div className="absolute -top-10 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl bg-teal-400" />
        </div>

        {/* Header */}
        <header className="relative z-10 px-5 pt-10 pb-8 max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-1">🏥 Child Health</p>
              <h1 className="text-4xl font-black text-slate-800 leading-tight" style={{ fontFamily: "Fredoka One, Georgia, cursive" }}>
                Vaccination<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg,#0ea5e9,#14b8a6)" }}>Tracker</span>
              </h1>
            </div>
            <div className="text-right">
              {editingName ? (
                <div className="flex flex-col gap-1">
                  <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                    className="text-right text-sm border border-sky-200 rounded-lg px-2 py-1 outline-sky-400 bg-white"
                    placeholder="Child's name" />
                  <button onClick={() => { setChildName(nameInput); setEditingName(false); }}
                    className="text-xs text-white bg-sky-500 rounded-lg px-3 py-1">Save</button>
                </div>
              ) : (
                <button onClick={() => setEditingName(true)} className="text-right">
                  <p className="text-2xl">👶</p>
                  <p className="text-slate-700 font-bold text-sm">{childName}</p>
                  <p className="text-sky-400 text-xs">tap to edit</p>
                </button>
              )}
            </div>
          </div>

          {/* DOB input */}
          <div className="mt-4 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-sky-100">
            <span className="text-lg">🎂</span>
            <div className="flex-1">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Date of Birth</p>
              <input type="date" value={childDOB} onChange={e => setChildDOB(e.target.value)}
                className="text-sm text-slate-700 font-bold outline-none bg-transparent w-full" />
            </div>
            {childDOB && (
              <span className="text-xs bg-sky-100 text-sky-600 px-3 py-1 rounded-full font-semibold">
                {Math.floor((new Date() - new Date(childDOB)) / (1000 * 60 * 60 * 24 * 30.44))} months old
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-white rounded-2xl px-4 py-4 shadow-sm border border-sky-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Overall Progress</p>
              <span className="text-sm font-black text-sky-600">{completedCount} / {totalVaccines} done</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#0ea5e9,#14b8a6)" }} />
            </div>
            <p className="text-right text-xs text-slate-400 mt-1">{progress}% complete</p>
          </div>
        </header>
      </div>

      {/* Nav Tabs */}
      <nav className="max-w-2xl mx-auto px-5 mb-6">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-sky-100 gap-1">
          {[
            { id: "schedule", label: "Schedule", icon: "💉" },
            { id: "appointments", label: "Appointments", icon: "📅" },
            { id: "tips", label: "Tips & Info", icon: "💡" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t.id ? "text-white shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
              style={tab === t.id ? { background: "linear-gradient(135deg,#0ea5e9,#14b8a6)" } : {}}>
              <span className="block text-lg mb-0.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 pb-24">

        {/* ── SCHEDULE TAB ── */}
        {tab === "schedule" && (
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex gap-3 flex-wrap text-xs">
              {[["bg-sky-100 text-sky-600", "Upcoming"], ["bg-amber-100 text-amber-600", "Due Now"], ["bg-red-100 text-red-600", "Overdue"], ["bg-emerald-100 text-emerald-600", "✓ Completed"]].map(([cls, label]) => (
                <span key={label} className={`px-3 py-1 rounded-full font-semibold ${cls}`}>{label}</span>
              ))}
            </div>

            {SCHEDULE.map(stage => {
              const status = getAgeStatus(stage.ageMonths);
              const stageCompleted = stage.vaccines.every(v => done[v.id]);
              const isOpen = expanded === stage.age;

              return (
                <div key={stage.age} className={`rounded-2xl overflow-hidden shadow-sm border transition-all ${statusColors[status]}`}>
                  {/* Stage header */}
                  <button onClick={() => setExpanded(isOpen ? null : stage.age)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white shadow-sm`}
                        style={{ background: stageCompleted ? "linear-gradient(135deg,#34d399,#059669)" : "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
                        {stageCompleted ? "✓" : stage.vaccines.length}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base">{stage.age}</p>
                        <p className="text-xs text-slate-400">{stage.vaccines.length} vaccine{stage.vaccines.length > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusBadge[status]}`}>
                        {statusLabel[status]}
                      </span>
                      <span className="text-slate-400 text-lg">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {/* Vaccines list */}
                  {isOpen && (
                    <div className="px-5 pb-4 space-y-2 border-t border-slate-100">
                      {stage.vaccines.map(v => (
                        <div key={v.id}>
                          <button
                            onClick={() => setSelectedVaccine(selectedVaccine?.id === v.id ? null : v)}
                            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 border transition-all ${
                              done[v.id]
                                ? "bg-emerald-50 border-emerald-200"
                                : `border ${v.color}`
                            }`}>
                            <div className="flex items-center gap-3 text-left">
                              <div onClick={e => { e.stopPropagation(); toggleVaccine(v.id); }}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                  done[v.id] ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                                }`}>
                                {done[v.id] && "✓"}
                              </div>
                              <div>
                                <p className={`font-bold text-sm ${done[v.id] ? "text-emerald-700 line-through" : "text-slate-700"}`}>{v.name}</p>
                                <p className="text-xs text-slate-400">{v.disease}</p>
                              </div>
                            </div>
                            <span className="text-slate-400 text-sm">{selectedVaccine?.id === v.id ? "▲" : "ℹ"}</span>
                          </button>

                          {/* Expanded vaccine info */}
                          {selectedVaccine?.id === v.id && (
                            <div className="mt-1 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-600">
                              <p className="font-bold text-slate-700 mb-1">{v.full}</p>
                              <p><span className="font-semibold text-slate-500">Protects against:</span> {v.disease}</p>
                              <p className="mt-2 text-xs text-slate-400 italic">Tap the circle to mark as given. Always verify with your pediatrician.</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── APPOINTMENTS TAB ── */}
        {tab === "appointments" && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-slate-800" style={{ fontFamily: "Fredoka One, Georgia, cursive" }}>
              📅 Upcoming Appointments
            </h2>

            {/* Add form */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4">+ Schedule New</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Date</label>
                  <input type="date" value={apptForm.date} onChange={e => setApptForm(a => ({ ...a, date: e.target.value }))}
                    className="w-full border border-sky-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-sky-400 bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Vaccine / Visit</label>
                  <input value={apptForm.vaccine} onChange={e => setApptForm(a => ({ ...a, vaccine: e.target.value }))}
                    placeholder="e.g. MMR 1st Dose"
                    className="w-full border border-sky-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-sky-400 bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Note (optional)</label>
                  <input value={apptForm.note} onChange={e => setApptForm(a => ({ ...a, note: e.target.value }))}
                    placeholder="Doctor, clinic, etc."
                    className="w-full border border-sky-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-sky-400 bg-slate-50" />
                </div>
                <button onClick={addAppointment}
                  className="w-full text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all"
                  style={{ background: "linear-gradient(135deg,#0ea5e9,#14b8a6)" }}>
                  Save Appointment
                </button>
              </div>
            </div>

            {/* Appointments list */}
            <div className="space-y-3">
              {appointments.sort((a, b) => new Date(a.date) - new Date(b.date)).map(appt => {
                const isPast = new Date(appt.date) < new Date();
                return (
                  <div key={appt.id} className={`flex gap-4 bg-white rounded-2xl border shadow-sm px-5 py-4 ${isPast ? "border-slate-200 opacity-70" : "border-sky-100"}`}>
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-black flex-shrink-0 ${isPast ? "bg-slate-100 text-slate-400" : "text-white"}`}
                      style={!isPast ? { background: "linear-gradient(135deg,#0ea5e9,#14b8a6)" } : {}}>
                      <span className="text-base leading-none">{new Date(appt.date + "T00:00:00").getDate()}</span>
                      <span className="uppercase text-xs">{new Date(appt.date + "T00:00:00").toLocaleString("default", { month: "short" })}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-sm">💉 {appt.vaccine}</p>
                      {appt.note && <p className="text-xs text-slate-400 mt-0.5">{appt.note}</p>}
                      {isPast && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mt-1 inline-block">Past</span>}
                    </div>
                    <button onClick={() => setAppointments(a => a.filter(x => x.id !== appt.id))}
                      className="text-slate-300 hover:text-red-400 text-xl transition-colors self-start">×</button>
                  </div>
                );
              })}
              {appointments.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-5xl mb-3">📭</p>
                  <p className="text-sm">No appointments scheduled</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TIPS TAB ── */}
        {tab === "tips" && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-slate-800" style={{ fontFamily: "Fredoka One, Georgia, cursive" }}>
              💡 Parent's Guide
            </h2>

            {/* Tips cards */}
            <div className="grid grid-cols-1 gap-4">
              {TIPS.map(tip => (
                <div key={tip.title} className="bg-white rounded-2xl border border-sky-100 shadow-sm px-5 py-5 flex gap-4">
                  <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                  <div>
                    <p className="font-black text-slate-800 text-sm mb-1">{tip.title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Disease protection guide */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
              <h3 className="font-black text-slate-800 mb-4 text-sm uppercase tracking-wide">🛡️ Diseases We Prevent</h3>
              <div className="flex flex-wrap gap-2">
                {["Tuberculosis","Hepatitis B","Polio","Diphtheria","Tetanus","Whooping Cough","Meningitis","Rotavirus Diarrhea","Influenza","Measles","Mumps","Rubella","Chickenpox","Hepatitis A"].map(d => (
                  <span key={d} className="text-xs bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1 rounded-full font-semibold">{d}</span>
                ))}
              </div>
            </div>

            {/* WHO note */}
            <div className="rounded-2xl p-5 text-white text-sm"
              style={{ background: "linear-gradient(135deg,#0ea5e9,#14b8a6)" }}>
              <p className="font-black text-base mb-2">🌍 Why Vaccinate?</p>
              <p className="text-sky-50 leading-relaxed text-sm">
                Vaccines are one of the most effective ways to protect your child from serious, 
                life-threatening diseases. They work by training the immune system to fight specific 
                infections before your child ever encounters them.
              </p>
              <p className="mt-3 text-sky-100 text-xs">
                Always consult your pediatrician or nearest health center for guidance specific to your region and child's health.
              </p>
            </div>

            {/* Emergency contacts */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <p className="font-black text-red-700 mb-3 text-sm">🚨 Emergency Contacts</p>
              <div className="space-y-2 text-sm text-red-600">
                <p>📞 Immunization Helpline: <strong>1800-11-1565</strong> (India, toll-free)</p>
                <p>📞 Child Health Line: <strong>104</strong></p>
                <p>📞 Emergency: <strong>108</strong></p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom summary bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sky-100 shadow-lg z-20">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg,#0ea5e9,#14b8a6)" }}>
              {completedCount}
            </div>
            <div>
              <p className="text-xs text-slate-400">Vaccines Given</p>
              <p className="text-sm font-black text-slate-700">{completedCount} of {totalVaccines}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Remaining</p>
            <p className="text-sm font-black text-sky-600">{totalVaccines - completedCount} to go 💪</p>
          </div>
        </div>
      </div>
    </div>
  );
}
