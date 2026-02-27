import { useState, useEffect } from "react";

// ── Data ─────────────────────────────────────────────────────────────────────
const VITAMINS = [
  { id:"vitC",  name:"Vitamin C",  emoji:"🍊", daily:45,  unit:"mg",  color:"#f97316", desc:"Boosts white blood cells" },
  { id:"vitD",  name:"Vitamin D",  emoji:"☀️", daily:600, unit:"IU",  color:"#eab308", desc:"Strengthens immune defence" },
  { id:"zinc",  name:"Zinc",       emoji:"🌾", daily:5,   unit:"mg",  color:"#84cc16", desc:"Fights off bacteria & viruses" },
  { id:"vitA",  name:"Vitamin A",  emoji:"🥕", daily:400, unit:"mcg", color:"#ef4444", desc:"Keeps skin & tissues healthy" },
  { id:"vitE",  name:"Vitamin E",  emoji:"🥑", daily:6,   unit:"mg",  color:"#10b981", desc:"Powerful antioxidant" },
  { id:"iron",  name:"Iron",       emoji:"🥩", daily:10,  unit:"mg",  color:"#dc2626", desc:"Carries oxygen in blood" },
];

const FOODS = [
  { name:"Oranges",      emoji:"🍊", nutrients:["Vitamin C"],       benefit:"Strong infection fighter",     color:"#fed7aa" },
  { name:"Broccoli",     emoji:"🥦", nutrients:["Vitamin C","Zinc"],benefit:"Super immunity veggie",        color:"#bbf7d0" },
  { name:"Carrots",      emoji:"🥕", nutrients:["Vitamin A"],       benefit:"Eye & immune health",          color:"#fed7aa" },
  { name:"Yogurt",       emoji:"🥛", nutrients:["Probiotics"],      benefit:"Gut = 70% of immune system",   color:"#e0e7ff" },
  { name:"Eggs",         emoji:"🥚", nutrients:["Vitamin D","Zinc"],benefit:"All-round immunity booster",   color:"#fef9c3" },
  { name:"Spinach",      emoji:"🥬", nutrients:["Iron","Vitamin A"],benefit:"Iron & antioxidant powerhouse",color:"#bbf7d0" },
  { name:"Almonds",      emoji:"🥜", nutrients:["Vitamin E"],       benefit:"Antioxidant protection",       color:"#fef3c7" },
  { name:"Strawberries", emoji:"🍓", nutrients:["Vitamin C"],       benefit:"Tasty immunity treat",         color:"#fce7f3" },
  { name:"Sweet Potato", emoji:"🍠", nutrients:["Vitamin A"],       benefit:"Beta-carotene boost",          color:"#fed7aa" },
  { name:"Sunflower Seeds",emoji:"🌻",nutrients:["Vitamin E","Zinc"],benefit:"Seed of immunity",            color:"#fef9c3" },
];

const HABITS = [
  { id:"sleep",    label:"8–10 hours of sleep",       emoji:"😴", points:20 },
  { id:"water",    label:"6–8 glasses of water",      emoji:"💧", points:15 },
  { id:"outdoor",  label:"30 min outdoor play",       emoji:"🌞", points:15 },
  { id:"veggies",  label:"Eat colourful veggies",     emoji:"🥗", points:15 },
  { id:"fruits",   label:"Eat 2 fruits today",        emoji:"🍎", points:15 },
  { id:"exercise", label:"Active play / exercise",    emoji:"🏃", points:10 },
  { id:"handwash", label:"Wash hands 5+ times",       emoji:"🧼", points:10 },
];

const TIPS = [
  "Colourful plates = stronger shields! 🌈",
  "Sunlight gives free Vitamin D! ☀️",
  "Laughter really IS the best medicine! 😂",
  "Sugar weakens immunity — go easy on sweets 🍬",
  "Deep breathing sends more oxygen to cells 🌬️",
  "Probiotics in yogurt train your immune army 🦠",
  "Sleep is when your body repairs itself 🛌",
];

const AGE_GROUPS = ["2–5 years","6–9 years","10–12 years","13–15 years"];

// ── Immunity Score ────────────────────────────────────────────────────────────
const calcScore = (checked, vitamins) => {
  const habitPts = HABITS.filter(h => checked[h.id]).reduce((s,h) => s + h.points, 0);
  const maxHabit = HABITS.reduce((s,h) => s + h.points, 0);
  const vitPts   = Object.values(vitamins).reduce((s,v) => s + Math.min(v/100, 1) * 10, 0);
  const maxVit   = VITAMINS.length * 10;
  return Math.round(((habitPts / maxHabit) * 70) + ((vitPts / maxVit) * 30));
};

const scoreLabel = (s) => {
  if (s >= 80) return { label:"Super Immune! 🦸",    color:"#22c55e", bg:"#f0fdf4", ring:"#22c55e" };
  if (s >= 55) return { label:"Getting Stronger 💪", color:"#f59e0b", bg:"#fffbeb", ring:"#f59e0b" };
  return              { label:"Needs Boost 🌱",       color:"#f87171", bg:"#fef2f2", ring:"#f87171" };
};

// ── Radial progress ───────────────────────────────────────────────────────────
function RadialProgress({ score, color, size = 140 }) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}/>
    </svg>
  );
}

// ── Vitamin bar ───────────────────────────────────────────────────────────────
function VitaminBar({ vit, value, onChange }) {
  const pct = Math.min((value / vit.daily) * 100, 100);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"20px" }}>{vit.emoji}</span>
          <div>
            <p style={{ fontSize:"13px", fontWeight:700, color:"#1e293b" }}>{vit.name}</p>
            <p style={{ fontSize:"11px", color:"#94a3b8" }}>{vit.desc}</p>
          </div>
        </div>
        <div style={{ textAlign:"right", minWidth:"60px" }}>
          <span style={{ fontSize:"13px", fontWeight:800, color: pct >= 100 ? "#22c55e" : vit.color }}>
            {value}/{vit.daily}
          </span>
          <p style={{ fontSize:"10px", color:"#94a3b8" }}>{vit.unit}</p>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
        <div style={{ flex:1, height:"8px", background:"#f1f5f9", borderRadius:"4px", overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:"4px", background: pct >= 100 ? "#22c55e" : vit.color,
            width:`${pct}%`, transition:"width 0.5s ease" }}/>
        </div>
        <div style={{ display:"flex", gap:"4px" }}>
          <button onClick={() => onChange(Math.max(0, value - Math.ceil(vit.daily * 0.1)))}
            style={{ width:"22px", height:"22px", borderRadius:"6px", border:"1.5px solid #e2e8f0", background:"#f8fafc", fontSize:"14px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b" }}>−</button>
          <button onClick={() => onChange(Math.min(vit.daily * 2, value + Math.ceil(vit.daily * 0.1)))}
            style={{ width:"22px", height:"22px", borderRadius:"6px", border:"none", background:vit.color, fontSize:"14px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>+</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ChildImmunityBooster() {
  const [tab, setTab]       = useState("score");
  const [childName, setChildName] = useState("Alex");
  const [ageGroup, setAgeGroup]   = useState("6–9 years");
  const [checked, setChecked]     = useState({});
  const [vitamins, setVitamins]   = useState(
    Object.fromEntries(VITAMINS.map(v => [v.id, 0]))
  );
  const [tipIdx, setTipIdx] = useState(0);
  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState("Alex");

  const score  = calcScore(checked, vitamins);
  const status = scoreLabel(score);

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i+1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const completedHabits = HABITS.filter(h => checked[h.id]).length;
  const vitsFull = VITAMINS.filter(v => (vitamins[v.id] / v.daily) >= 1).length;

  const tabs = [
    { id:"score",   label:"My Score",  icon:"🛡️" },
    { id:"vitamins",label:"Vitamins",  icon:"💊" },
    { id:"habits",  label:"Habits",    icon:"✅" },
    { id:"foods",   label:"Super Foods",icon:"🥗" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#f0fdf4; font-family:'Nunito',sans-serif; }
        input,select,button { font-family:'Nunito',sans-serif; }
        input:focus,select:focus { outline:none; }

        .ib-root {
          min-height:100vh;
          background: linear-gradient(150deg,#ecfdf5 0%,#fff7ed 50%,#fef9c3 100%);
          padding-bottom:90px;
          position:relative;
          overflow-x:hidden;
        }
        /* Floating blobs */
        .ib-root::before {
          content:''; position:fixed;
          width:400px; height:400px;
          background:radial-gradient(circle,rgba(34,197,94,0.12),transparent 70%);
          top:-80px; left:-80px; pointer-events:none; z-index:0; border-radius:50%;
        }
        .ib-root::after {
          content:''; position:fixed;
          width:350px; height:350px;
          background:radial-gradient(circle,rgba(251,191,36,0.12),transparent 70%);
          bottom:-80px; right:-80px; pointer-events:none; z-index:0; border-radius:50%;
        }

        .ib-inner { position:relative; z-index:1; max-width:500px; margin:0 auto; padding:16px 16px 0; }

        .ib-card {
          background:#fff; border-radius:22px;
          border:1px solid rgba(0,0,0,0.06);
          box-shadow:0 4px 20px rgba(0,0,0,0.06);
          margin-bottom:14px; overflow:hidden;
        }
        .ib-card-p { padding:20px; }

        .ib-tab {
          flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
          padding:9px 6px; border:none; background:none; cursor:pointer;
          font-size:10px; font-weight:800; letter-spacing:0.03em; color:#94a3b8;
          border-radius:14px; transition:all 0.2s; text-transform:uppercase;
        }
        .ib-tab.active { color:#16a34a; background:rgba(22,163,74,0.1); }
        .ib-tab:hover:not(.active) { color:#64748b; background:#f8fafc; }

        .habit-row {
          display:flex; align-items:center; gap:12px;
          padding:12px 20px; border-bottom:1px solid #f0fdf4;
          cursor:pointer; transition:background 0.15s;
        }
        .habit-row:hover { background:#f0fdf4; }
        .habit-row:last-child { border-bottom:none; }

        .check-box {
          width:24px; height:24px; border-radius:8px; border:2px solid;
          display:flex; align-items:center; justify-content:center;
          font-size:13px; transition:all 0.2s; flex-shrink:0;
        }

        .food-chip {
          background:#fff; border-radius:16px; padding:14px;
          border:1.5px solid rgba(0,0,0,0.06);
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
          transition:transform 0.2s, box-shadow 0.2s;
          cursor:default;
        }
        .food-chip:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.1); }

        .tip-box {
          border-radius:16px; padding:14px 16px;
          font-size:13px; font-weight:600; color:#065f46;
          display:flex; align-items:center; gap:10px;
          animation: tipFade 0.5s ease forwards;
        }
        @keyframes tipFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }

        .nutrient-tag {
          font-size:10px; font-weight:700; padding:2px 8px;
          border-radius:100px; display:inline-block; margin:2px 2px 0 0;
        }

        @keyframes bounceIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        .page { animation:bounceIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        .sec-label {
          font-size:11px; font-weight:800; letter-spacing:0.1em;
          text-transform:uppercase; color:#94a3b8; margin-bottom:14px;
        }

        .name-display {
          font-family:'Fredoka One',cursive; cursor:pointer;
          border-bottom:2px dashed rgba(34,197,94,0.4);
          padding-bottom:1px; transition:border-color 0.2s;
        }
        .name-display:hover { border-color:#16a34a; }
      `}</style>

      <div className="ib-root">
        {/* ── Header ── */}
        <div style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(0,0,0,0.06)", padding:"16px 20px 12px", position:"sticky", top:0, zIndex:50, boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ maxWidth:"500px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"22px", color:"#15803d", letterSpacing:"0.02em" }}>
                🛡️ Immunity Booster
              </h1>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"2px" }}>
                <span style={{ fontSize:"12px", color:"#64748b" }}>For </span>
                {editName ? (
                  <input
                    autoFocus
                    style={{ fontSize:"13px", fontWeight:700, color:"#15803d", border:"none", borderBottom:"2px solid #16a34a", background:"transparent", width:"80px", outline:"none" }}
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onBlur={() => { setChildName(tempName || "Alex"); setEditName(false); }}
                    onKeyDown={e => { if(e.key==="Enter"){ setChildName(tempName||"Alex"); setEditName(false); }}}
                  />
                ) : (
                  <span className="name-display" style={{ fontSize:"13px", fontWeight:700, color:"#15803d" }}
                    onClick={() => { setTempName(childName); setEditName(true); }}>
                    {childName} ✏️
                  </span>
                )}
                <select value={ageGroup} onChange={e=>setAgeGroup(e.target.value)}
                  style={{ fontSize:"11px", color:"#64748b", border:"none", background:"transparent", fontFamily:"'Nunito',sans-serif", fontWeight:600, cursor:"pointer" }}>
                  {AGE_GROUPS.map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            {/* Mini score badge */}
            <div style={{ background:status.bg, border:`1.5px solid ${status.ring}30`, borderRadius:"14px", padding:"8px 14px", textAlign:"center" }}>
              <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"22px", color:status.color, lineHeight:1 }}>{score}</p>
              <p style={{ fontSize:"9px", color:status.color, fontWeight:800, opacity:0.7 }}>SCORE</p>
            </div>
          </div>
        </div>

        <div className="ib-inner">

          {/* ── SCORE TAB ── */}
          {tab==="score" && (
            <div className="page">
              {/* Score orb */}
              <div className="ib-card ib-card-p" style={{ background:`linear-gradient(135deg,${status.bg},#fff)`, border:`1.5px solid ${status.ring}25`, textAlign:"center" }}>
                <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:"14px" }}>
                  <RadialProgress score={score} color={status.ring}/>
                  <div style={{ position:"absolute", textAlign:"center" }}>
                    <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"36px", color:status.color, lineHeight:1 }}>{score}</p>
                    <p style={{ fontSize:"10px", color:"#94a3b8", fontWeight:700 }}>/ 100</p>
                  </div>
                </div>
                <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"20px", color:status.color }}>{status.label}</p>
                <p style={{ fontSize:"13px", color:"#64748b", marginTop:"6px" }}>
                  {score>=80 ? `Amazing, ${childName}! Your immune system is fighting fit! 🎉` :
                   score>=55 ? `Good work, ${childName}! Keep adding healthy habits! 💪` :
                   `Let's power up ${childName}'s immunity together! 🚀`}
                </p>
              </div>

              {/* Progress summary */}
              <div className="ib-card ib-card-p">
                <p className="sec-label">Today's Progress</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
                  {[
                    { icon:"✅", label:"Habits Done",   val:`${completedHabits}/${HABITS.length}`, color:"#22c55e", bg:"#f0fdf4" },
                    { icon:"💊", label:"Vitamins Full",  val:`${vitsFull}/${VITAMINS.length}`,       color:"#f59e0b", bg:"#fffbeb" },
                    { icon:"⭐", label:"Points Earned", val:`${HABITS.filter(h=>checked[h.id]).reduce((s,h)=>s+h.points,0)}`,  color:"#a855f7", bg:"#faf5ff" },
                  ].map(s=>(
                    <div key={s.label} style={{ background:s.bg, borderRadius:"14px", padding:"14px 10px", textAlign:"center", border:`1px solid ${s.color}20` }}>
                      <span style={{ fontSize:"22px" }}>{s.icon}</span>
                      <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"20px", color:s.color, lineHeight:1, margin:"5px 0 3px" }}>{s.val}</p>
                      <p style={{ fontSize:"10px", color:"#94a3b8", fontWeight:700 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily tip */}
              <div className="ib-card ib-card-p">
                <p className="sec-label">💡 Today's Tip</p>
                <div className="tip-box" style={{ background:"linear-gradient(135deg,#ecfdf5,#d1fae5)" }} key={tipIdx}>
                  <span style={{ fontSize:"28px", flexShrink:0 }}>🌿</span>
                  <span>{TIPS[tipIdx]}</span>
                </div>
              </div>

              {/* Immunity shield graphic */}
              <div className="ib-card ib-card-p" style={{ background:"linear-gradient(135deg,#fef9c3,#fffbeb)" }}>
                <p className="sec-label">🏆 Immunity Boosters Unlocked</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                  {HABITS.filter(h=>checked[h.id]).map(h=>(
                    <span key={h.id} style={{ fontSize:"12px", fontWeight:700, background:"#fff", borderRadius:"100px", padding:"5px 12px", border:"1.5px solid #fbbf24", color:"#92400e", display:"flex", alignItems:"center", gap:"5px" }}>
                      {h.emoji} {h.label}
                    </span>
                  ))}
                  {HABITS.filter(h=>checked[h.id]).length === 0 && (
                    <p style={{ fontSize:"13px", color:"#94a3b8" }}>Complete habits to unlock badges! 🌟</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── VITAMINS TAB ── */}
          {tab==="vitamins" && (
            <div className="page">
              <div className="ib-card" style={{ padding:"16px 20px 8px" }}>
                <p className="sec-label">Daily Vitamin Goals for {ageGroup}</p>
                {VITAMINS.map(v=>(
                  <VitaminBar key={v.id} vit={v} value={vitamins[v.id]}
                    onChange={val => setVitamins(p=>({...p,[v.id]:val}))}/>
                ))}
              </div>

              <div className="ib-card ib-card-p" style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)" }}>
                <p className="sec-label" style={{ color:"#1d4ed8" }}>💡 Why Vitamins Matter</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {[
                    { text:"Vitamin C is used up quickly — replenish daily with fruits & veggies!", color:"#f97316" },
                    { text:"Just 15 min of sun gives kids their daily Vitamin D for free!", color:"#eab308" },
                    { text:"Zinc from seeds and legumes helps wounds heal faster.", color:"#84cc16" },
                  ].map((t,i)=>(
                    <div key={i} style={{ display:"flex", gap:"10px", fontSize:"13px", color:"#1e293b", fontWeight:500 }}>
                      <span style={{ color:t.color, flexShrink:0 }}>•</span>{t.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── HABITS TAB ── */}
          {tab==="habits" && (
            <div className="page">
              <div className="ib-card ib-card-p" style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", marginBottom:"14px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"24px", color:"#15803d" }}>{completedHabits} / {HABITS.length}</p>
                    <p style={{ fontSize:"12px", color:"#16a34a", fontWeight:600 }}>habits completed today</p>
                  </div>
                  <div style={{ fontSize:"48px" }}>
                    {completedHabits === HABITS.length ? "🏆" : completedHabits >= 5 ? "⭐" : completedHabits >= 3 ? "🌱" : "💤"}
                  </div>
                </div>
                <div style={{ marginTop:"12px", height:"8px", background:"rgba(255,255,255,0.5)", borderRadius:"4px", overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"#16a34a", borderRadius:"4px", width:`${(completedHabits/HABITS.length)*100}%`, transition:"width 0.5s ease" }}/>
                </div>
              </div>

              <div className="ib-card">
                {HABITS.map(h=>(
                  <div key={h.id} className="habit-row" onClick={()=>toggle(h.id)}>
                    <div className="check-box" style={{
                      borderColor: checked[h.id] ? "#22c55e" : "#e2e8f0",
                      background: checked[h.id] ? "#22c55e" : "#fff",
                      color:"#fff",
                    }}>
                      {checked[h.id] && "✓"}
                    </div>
                    <span style={{ fontSize:"22px" }}>{h.emoji}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:"14px", fontWeight:700, color: checked[h.id] ? "#15803d" : "#1e293b", textDecoration: checked[h.id] ? "line-through" : "none", opacity: checked[h.id] ? 0.7 : 1 }}>{h.label}</p>
                    </div>
                    <span style={{ fontSize:"11px", fontWeight:800, color:"#f59e0b", background:"#fef9c3", padding:"3px 8px", borderRadius:"100px" }}>+{h.points}pts</span>
                  </div>
                ))}
              </div>

              {completedHabits === HABITS.length && (
                <div className="ib-card ib-card-p" style={{ background:"linear-gradient(135deg,#fef9c3,#fef3c7)", textAlign:"center" }}>
                  <p style={{ fontSize:"36px", marginBottom:"8px" }}>🎉</p>
                  <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"20px", color:"#92400e" }}>All habits complete!</p>
                  <p style={{ fontSize:"13px", color:"#78350f", marginTop:"4px" }}>{childName} is an immunity superstar today! 🌟</p>
                </div>
              )}
            </div>
          )}

          {/* ── SUPER FOODS TAB ── */}
          {tab==="foods" && (
            <div className="page">
              <div className="ib-card ib-card-p" style={{ background:"linear-gradient(135deg,#ecfdf5,#d1fae5)", marginBottom:"14px" }}>
                <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"18px", color:"#065f46", marginBottom:"6px" }}>
                  🥗 Top Immunity Foods for Kids
                </p>
                <p style={{ fontSize:"13px", color:"#047857", fontWeight:500 }}>
                  Fill {childName}'s plate with these powerhouse foods to keep germs away!
                </p>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {FOODS.map(f=>(
                  <div key={f.name} className="food-chip" style={{ background:f.color+"40", border:`1.5px solid ${f.color}` }}>
                    <div style={{ fontSize:"32px", marginBottom:"6px" }}>{f.emoji}</div>
                    <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:"15px", color:"#1e293b", marginBottom:"3px" }}>{f.name}</p>
                    <p style={{ fontSize:"11px", color:"#475569", fontWeight:500, marginBottom:"6px", lineHeight:1.3 }}>{f.benefit}</p>
                    <div>
                      {f.nutrients.map(n=>(
                        <span key={n} className="nutrient-tag" style={{ background:"rgba(255,255,255,0.7)", color:"#374151", border:"1px solid rgba(0,0,0,0.08)" }}>{n}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="ib-card ib-card-p" style={{ marginTop:"14px", background:"linear-gradient(135deg,#fdf4ff,#fae8ff)" }}>
                <p className="sec-label" style={{ color:"#7e22ce" }}>🌈 The Rainbow Rule</p>
                <p style={{ fontSize:"13px", color:"#4c1d95", fontWeight:500, lineHeight:1.6 }}>
                  Encourage {childName} to eat foods of every colour! Each colour represents different nutrients and antioxidants that protect their body in unique ways.
                </p>
                <div style={{ display:"flex", gap:"6px", marginTop:"12px", justifyContent:"center" }}>
                  {["🔴","🟠","🟡","🟢","🔵","🟣"].map(c=>(
                    <span key={c} style={{ fontSize:"24px" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Nav ── */}
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", borderTop:"1px solid rgba(0,0,0,0.06)", padding:"8px 16px 16px", zIndex:50, boxShadow:"0 -4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ maxWidth:"500px", margin:"0 auto", display:"flex", gap:"6px" }}>
            {tabs.map(t=>(
              <button key={t.id} className={`ib-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                <span style={{ fontSize:"22px" }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
