import { useState, useMemo } from "react";

// ── WHO percentile reference data (simplified) ───────────────────────────────
// height_cm at [P3, P15, P50, P85, P97] for boys ages 0–18
const WHO_HEIGHT_BOYS = {
  0:[46.1,48.0,50.0,52.0,53.8], 1:[51.1,53.1,55.5,57.9,60.0],
  2:[54.4,56.7,59.2,61.7,64.0], 3:[57.3,59.8,62.4,65.0,67.5],
  6:[63.3,65.9,68.9,71.9,74.4], 9:[68.2,70.8,74.0,77.2,79.9],
  12:[71.7,74.6,78.0,81.5,84.3],18:[76.0,79.0,83.0,87.0,90.0],
  24:[80.0,83.5,87.8,92.0,95.8],36:[87.4,91.2,96.1,101.0,105.0],
  48:[94.0,98.5,103.3,108.0,112.5],60:[100.5,105.5,110.0,115.5,120.0],
  72:[106.5,111.5,116.5,122.0,127.0],84:[112.0,117.5,123.0,128.5,134.0],
  96:[117.5,123.5,129.5,135.5,141.0],108:[123.0,129.5,136.0,142.5,148.0],
  120:[128.5,135.0,142.0,149.0,155.0],132:[134.0,141.0,148.5,156.0,162.5],
  144:[139.5,147.0,155.0,163.0,170.0],156:[145.5,153.5,162.0,170.5,178.0],
  168:[152.0,160.5,169.0,177.5,185.0],180:[160.0,167.0,175.0,183.0,190.0],
  216:[164.0,170.0,177.0,184.0,191.0],
};

const getPercentile = (value, ageMonths, isBoy) => {
  const data = WHO_HEIGHT_BOYS;
  const keys = Object.keys(data).map(Number).sort((a,b)=>a-b);
  const nearest = keys.reduce((prev,curr) => Math.abs(curr-ageMonths) < Math.abs(prev-ageMonths) ? curr : prev);
  const refs = data[nearest];
  if (!refs) return 50;
  if (value <= refs[0]) return 3;
  if (value <= refs[1]) return 15;
  if (value <= refs[2]) return 50;
  if (value <= refs[3]) return 85;
  if (value <= refs[4]) return 97;
  return 97;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0,10);
const ageStr = (dob) => {
  if (!dob) return "—";
  const d = new Date(dob), now = new Date();
  const months = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
  if (months < 24) return `${months}mo`;
  return `${Math.floor(months/12)}y ${months%12}mo`;
};
const ageMonths = (dob) => {
  if (!dob) return 0;
  const d = new Date(dob), now = new Date();
  return (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
};

// ── Seed children ─────────────────────────────────────────────────────────────
const SEED_CHILDREN = [
  {
    id:1, name:"Emma", dob:"2020-03-15", gender:"girl", emoji:"👧",
    color:"#f472b6", bg:"#fdf2f8",
    records:[
      { id:1, date:"2020-03-15", height:50.0, weight:3.4, note:"Birth" },
      { id:2, date:"2020-09-15", height:66.0, weight:7.8, note:"6 month check" },
      { id:3, date:"2021-03-15", height:75.5, weight:9.9, note:"1 year check" },
      { id:4, date:"2022-03-15", height:87.0, weight:12.5,note:"2 year check" },
      { id:5, date:"2023-03-15", height:96.0, weight:15.1,note:"3 year check" },
      { id:6, date:"2024-03-15", height:103.5,weight:17.2,note:"4 year check" },
    ],
    milestones:[
      { id:1, title:"First smile 😊",  date:"2020-04-20", category:"social" },
      { id:2, title:"First steps 👣",  date:"2021-02-10", category:"motor"  },
      { id:3, title:"First word 🗣️",  date:"2021-01-05", category:"speech" },
      { id:4, title:"Potty trained 🎉",date:"2022-08-15", category:"development" },
      { id:5, title:"Started school 🏫",date:"2023-09-01",category:"education" },
    ]
  },
  {
    id:2, name:"Liam", dob:"2022-07-22", gender:"boy", emoji:"👦",
    color:"#3b82f6", bg:"#eff6ff",
    records:[
      { id:1, date:"2022-07-22", height:49.5, weight:3.2, note:"Birth" },
      { id:2, date:"2023-01-22", height:65.0, weight:7.5, note:"6 month check" },
      { id:3, date:"2023-07-22", height:74.0, weight:9.5, note:"1 year check" },
      { id:4, date:"2024-07-22", height:86.0, weight:12.0,note:"2 year check" },
    ],
    milestones:[
      { id:1, title:"First smile 😊", date:"2022-08-28", category:"social" },
      { id:2, title:"First steps 👣", date:"2023-06-15", category:"motor"  },
      { id:3, title:"First word 🗣️", date:"2023-05-20", category:"speech" },
    ]
  }
];

const CAT_COLORS = { social:"#f472b6", motor:"#34d399", speech:"#fbbf24", development:"#a78bfa", education:"#60a5fa" };

// ── SVG growth chart ──────────────────────────────────────────────────────────
function GrowthChart({ records, color, field, unit }) {
  if (records.length < 2) return (
    <div style={{height:"120px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontSize:"13px",color:"#94a3b8"}}>Add at least 2 records to see the chart</p>
    </div>
  );
  const W=340, H=100, pad=8;
  const vals = records.map(r=>r[field]);
  const dates = records.map(r=>r.date);
  const mn=Math.min(...vals)-2, mx=Math.max(...vals)+2, rng=mx-mn||1;
  const pts = vals.map((v,i)=>[pad+(i/(vals.length-1))*(W-pad*2), H-pad-((v-mn)/rng)*(H-pad*2)]);
  const pathD = pts.map((p,i)=>`${i===0?"M":"L"} ${p[0]} ${p[1]}`).join(" ");
  const fillD = `${pathD} L ${pts[pts.length-1][0]} ${H} L ${pts[0][0]} ${H} Z`;

  return (
    <svg width="100%" height={H+20} viewBox={`0 0 ${W} ${H+20}`} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id={`fill-${field}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0.25,0.5,0.75].map(t=>(
        <line key={t} x1={pad} y1={pad+(1-t)*(H-pad*2)} x2={W-pad} y2={pad+(1-t)*(H-pad*2)} stroke="#f1f5f9" strokeWidth="1"/>
      ))}
      {/* Fill */}
      <path d={fillD} fill={`url(#fill-${field})`}/>
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Dots + labels */}
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={i===pts.length-1?"5":"4"} fill={i===pts.length-1?color:"#fff"} stroke={color} strokeWidth="2"/>
          {i===pts.length-1 && (
            <text x={p[0]} y={p[1]-10} textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{vals[i]}{unit}</text>
          )}
        </g>
      ))}
      {/* X labels */}
      {dates.map((d,i)=>(
        <text key={i} x={pts[i][0]} y={H+16} textAnchor="middle" fontSize="9" fill="#94a3b8">
          {new Date(d).toLocaleDateString("en-US",{month:"short",year:"2-digit"})}
        </text>
      ))}
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChildGrowthTracker() {
  const [children, setChildren] = useState(SEED_CHILDREN);
  const [activeChild, setActiveChild] = useState(1);
  const [tab, setTab] = useState("overview");
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  // forms
  const [childForm, setChildForm]       = useState({ name:"", dob:"", gender:"boy", emoji:"👦" });
  const [recordForm, setRecordForm]     = useState({ date:today(), height:"", weight:"", note:"" });
  const [milestoneForm, setMilestoneForm] = useState({ title:"", date:today(), category:"motor" });

  const child = children.find(c=>c.id===activeChild);
  const latest = child?.records?.slice(-1)[0];
  const prev    = child?.records?.slice(-2)[0];
  const pctile  = latest ? getPercentile(latest.height, ageMonths(child.dob), child.gender==="boy") : 50;

  const addChild = () => {
    if (!childForm.name || !childForm.dob) return;
    const newC = { ...childForm, id:Date.now(), color:childForm.gender==="boy"?"#3b82f6":"#f472b6", bg:childForm.gender==="boy"?"#eff6ff":"#fdf2f8", records:[], milestones:[] };
    setChildren(p=>[...p, newC]);
    setActiveChild(newC.id);
    setChildForm({ name:"", dob:"", gender:"boy", emoji:"👦" });
    setShowAddChild(false);
  };

  const addRecord = () => {
    if (!recordForm.height || !recordForm.weight) return;
    setChildren(p=>p.map(c=>c.id===activeChild ? { ...c, records:[...c.records,{...recordForm,id:Date.now(),height:+recordForm.height,weight:+recordForm.weight}] } : c));
    setRecordForm({ date:today(), height:"", weight:"", note:"" });
    setShowAddRecord(false);
  };

  const addMilestone = () => {
    if (!milestoneForm.title) return;
    setChildren(p=>p.map(c=>c.id===activeChild ? { ...c, milestones:[...c.milestones,{...milestoneForm,id:Date.now()}] } : c));
    setMilestoneForm({ title:"", date:today(), category:"motor" });
    setShowAddMilestone(false);
  };

  if (!child) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#fefce8;font-family:'Nunito',sans-serif;}
        input,select,button,textarea{font-family:'Nunito',sans-serif;}
        input:focus,select:focus,textarea:focus{outline:none;}

        .gt-root{min-height:100vh;background:linear-gradient(160deg,#fff7ed 0%,#fdf2f8 40%,#eff6ff 100%);padding-bottom:90px;}

        .gt-card{background:#fff;border-radius:20px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 2px 16px rgba(0,0,0,0.06);margin-bottom:14px;overflow:hidden;}
        .gt-card-p{padding:20px;}

        .gt-input{width:100%;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;padding:10px 14px;font-size:14px;color:#1e293b;transition:border-color 0.2s,background 0.2s;}
        .gt-input:focus{border-color:#f472b6;background:#fff;}

        .gt-btn{padding:12px 20px;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:transform 0.15s,box-shadow 0.2s;}
        .gt-btn-primary{background:linear-gradient(135deg,#f472b6,#ec4899);color:#fff;box-shadow:0 4px 14px rgba(244,114,182,0.35);}
        .gt-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(244,114,182,0.45);}
        .gt-btn-blue{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff;box-shadow:0 4px 14px rgba(96,165,250,0.35);}
        .gt-btn-blue:hover{transform:translateY(-1px);}
        .gt-btn-ghost{background:#f8fafc;border:1.5px solid #e2e8f0;color:#64748b;}
        .gt-btn-ghost:hover{background:#f1f5f9;}
        .gt-btn:active{transform:translateY(0);}

        .tab-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 6px;border:none;background:none;cursor:pointer;font-size:10px;font-weight:700;letter-spacing:0.03em;color:#94a3b8;border-radius:12px;transition:all 0.2s;text-transform:uppercase;}
        .tab-btn.active{color:#f472b6;background:rgba(244,114,182,0.1);}
        .tab-btn:hover:not(.active){color:#64748b;background:#f8fafc;}

        .child-pill{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:100px;border:2px solid;cursor:pointer;transition:all 0.2s;font-size:13px;font-weight:700;white-space:nowrap;}

        .milestone-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}

        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.3);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal{background:#fff;border-radius:24px;padding:24px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.2);}

        .sec-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:12px;}

        @keyframes bounceIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        .page{animation:bounceIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;}
        .modal{animation:bounceIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards;}

        .stat-card{border-radius:16px;padding:16px;text-align:center;}
        .growth-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;}

        .record-row{display:flex;align-items:center;padding:12px 20px;border-bottom:1px solid #f8fafc;transition:background 0.15s;}
        .record-row:hover{background:#fafafa;}
        .record-row:last-child{border-bottom:none;}
      `}</style>

      <div className="gt-root">
        {/* ── Header ── */}
        <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(0,0,0,0.06)",padding:"16px 20px 12px",position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{maxWidth:"520px",margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
              <h1 style={{fontFamily:"'Baloo 2',cursive",fontSize:"22px",fontWeight:800,color:"#1e293b",letterSpacing:"-0.3px"}}>
                🌱 Growth Tracker
              </h1>
              <button className="gt-btn gt-btn-primary" style={{padding:"7px 14px",fontSize:"12px"}} onClick={()=>setShowAddChild(true)}>
                + Add Child
              </button>
            </div>
            {/* Child selector */}
            <div style={{display:"flex",gap:"8px",overflowX:"auto",paddingBottom:"2px"}}>
              {children.map(c=>(
                <div key={c.id} className="child-pill"
                  style={{borderColor:activeChild===c.id ? c.color : "#e2e8f0", background:activeChild===c.id ? c.bg : "#fff", color:activeChild===c.id ? c.color : "#64748b"}}
                  onClick={()=>{ setActiveChild(c.id); setTab("overview"); }}
                >
                  <span style={{fontSize:"18px"}}>{c.emoji}</span>
                  <span>{c.name}</span>
                  <span style={{fontSize:"11px",opacity:0.7,fontWeight:500}}>{ageStr(c.dob)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:"520px",margin:"0 auto",padding:"18px 16px 0"}}>

          {/* ── OVERVIEW ── */}
          {tab==="overview" && (
            <div className="page">
              {/* Hero card */}
              <div className="gt-card gt-card-p" style={{background:`linear-gradient(135deg, ${child.bg}, #fff)`,border:`1.5px solid ${child.color}22`}}>
                <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"18px"}}>
                  <div style={{width:"64px",height:"64px",borderRadius:"20px",background:`${child.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",border:`2px solid ${child.color}30`,flexShrink:0}}>
                    {child.emoji}
                  </div>
                  <div style={{flex:1}}>
                    <h2 style={{fontFamily:"'Baloo 2',cursive",fontSize:"24px",fontWeight:800,color:"#1e293b",lineHeight:1}}>{child.name}</h2>
                    <p style={{fontSize:"13px",color:"#64748b",marginTop:"3px"}}>Age: <b style={{color:child.color}}>{ageStr(child.dob)}</b> · Born {new Date(child.dob).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
                  </div>
                </div>

                {/* Latest stats */}
                {latest && (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
                    {[
                      { icon:"📏", label:"Height", val:`${latest.height}`, unit:"cm", color:"#3b82f6",
                        delta: prev ? `+${(latest.height-prev.height).toFixed(1)}` : null },
                      { icon:"⚖️", label:"Weight", val:`${latest.weight}`, unit:"kg", color:"#f59e0b",
                        delta: prev ? `+${(latest.weight-prev.weight).toFixed(1)}` : null },
                      { icon:"📊", label:"Percentile", val:`${pctile}th`, unit:"height", color:child.color, delta:null },
                    ].map(s=>(
                      <div key={s.label} className="stat-card" style={{background:"rgba(255,255,255,0.8)",border:`1px solid ${s.color}20`}}>
                        <span style={{fontSize:"20px"}}>{s.icon}</span>
                        <p style={{fontFamily:"'Baloo 2',cursive",fontSize:"20px",fontWeight:800,color:s.color,lineHeight:1,margin:"5px 0 2px"}}>{s.val}</p>
                        <p style={{fontSize:"10px",color:"#94a3b8",fontWeight:600}}>{s.unit}</p>
                        {s.delta && <p style={{fontSize:"10px",color:"#34d399",fontWeight:700,marginTop:"2px"}}>{s.delta}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {!latest && (
                  <div style={{textAlign:"center",padding:"16px 0"}}>
                    <p style={{color:"#94a3b8",fontSize:"14px"}}>No measurements yet</p>
                    <button className="gt-btn gt-btn-primary" style={{marginTop:"10px",padding:"9px 20px"}} onClick={()=>setShowAddRecord(true)}>
                      + Add First Measurement
                    </button>
                  </div>
                )}
              </div>

              {/* Height chart */}
              {child.records.length >= 2 && (
                <div className="gt-card gt-card-p">
                  <p className="sec-label">📏 Height Growth</p>
                  <GrowthChart records={child.records} color="#3b82f6" field="height" unit="cm"/>
                </div>
              )}

              {/* Weight chart */}
              {child.records.length >= 2 && (
                <div className="gt-card gt-card-p">
                  <p className="sec-label">⚖️ Weight Growth</p>
                  <GrowthChart records={child.records} color="#f59e0b" field="weight" unit="kg"/>
                </div>
              )}

              {/* Recent milestones */}
              {child.milestones.length > 0 && (
                <div className="gt-card gt-card-p">
                  <p className="sec-label">🏆 Recent Milestones</p>
                  {child.milestones.slice(-3).reverse().map(m=>(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"8px 0",borderBottom:"1px solid #f8fafc"}}>
                      <div className="milestone-dot" style={{background:CAT_COLORS[m.category]||"#94a3b8"}}/>
                      <div style={{flex:1}}>
                        <p style={{fontSize:"13px",fontWeight:600,color:"#1e293b"}}>{m.title}</p>
                        <p style={{fontSize:"11px",color:"#94a3b8"}}>{new Date(m.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
                      </div>
                      <span style={{fontSize:"10px",fontWeight:700,color:CAT_COLORS[m.category],background:`${CAT_COLORS[m.category]}18`,padding:"2px 8px",borderRadius:"100px"}}>{m.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MEASUREMENTS ── */}
          {tab==="measurements" && (
            <div className="page">
              <button className="gt-btn gt-btn-primary" style={{width:"100%",marginBottom:"14px"}} onClick={()=>setShowAddRecord(true)}>
                + Add New Measurement
              </button>

              <div className="gt-card">
                <div style={{padding:"16px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <p className="sec-label" style={{marginBottom:0}}>All Records · {child.records.length}</p>
                </div>
                {child.records.slice().reverse().map((r,i)=>{
                  const prev2 = child.records.slice().reverse()[i+1];
                  const hDelta = prev2 ? +(r.height-prev2.height).toFixed(1) : null;
                  const wDelta = prev2 ? +(r.weight-prev2.weight).toFixed(1) : null;
                  return (
                    <div key={r.id} className="record-row">
                      <div style={{width:"40px",height:"40px",borderRadius:"12px",background:`${child.color}15`,display:"flex",alignItems:"center",justifyContent:"center",marginRight:"12px",flexShrink:0,fontSize:"18px"}}>
                        📋
                      </div>
                      <div style={{flex:1}}>
                        <p style={{fontSize:"13px",fontWeight:700,color:"#1e293b"}}>{r.note || "Measurement"}</p>
                        <p style={{fontSize:"11px",color:"#94a3b8",marginTop:"1px"}}>{new Date(r.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:"13px",fontWeight:700,color:"#1e293b"}}>{r.height}cm / {r.weight}kg</p>
                        {hDelta !== null && (
                          <p style={{fontSize:"10px",color:"#34d399",fontWeight:700,marginTop:"2px"}}>
                            ↑{hDelta}cm · ↑{wDelta}kg
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {child.records.length === 0 && (
                  <div style={{padding:"32px 20px",textAlign:"center",color:"#94a3b8",fontSize:"14px"}}>No measurements yet</div>
                )}
              </div>
            </div>
          )}

          {/* ── MILESTONES ── */}
          {tab==="milestones" && (
            <div className="page">
              <button className="gt-btn gt-btn-blue" style={{width:"100%",marginBottom:"14px"}} onClick={()=>setShowAddMilestone(true)}>
                + Add Milestone
              </button>

              {/* Category legend */}
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"14px"}}>
                {Object.entries(CAT_COLORS).map(([cat,col])=>(
                  <span key={cat} style={{fontSize:"11px",fontWeight:700,color:col,background:`${col}18`,padding:"3px 10px",borderRadius:"100px",border:`1px solid ${col}30`}}>{cat}</span>
                ))}
              </div>

              <div className="gt-card">
                {child.milestones.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map((m,i,arr)=>(
                  <div key={m.id} style={{display:"flex",gap:"14px",padding:"14px 20px",borderBottom:i<arr.length-1?"1px solid #f8fafc":"none"}}>
                    {/* Timeline dot */}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",flexShrink:0}}>
                      <div style={{width:"14px",height:"14px",borderRadius:"50%",background:CAT_COLORS[m.category]||"#94a3b8",boxShadow:`0 0 8px ${CAT_COLORS[m.category]}55`,marginTop:"2px"}}/>
                      {i < arr.length-1 && <div style={{width:"2px",flex:1,background:"#f1f5f9",minHeight:"20px"}}/>}
                    </div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:"14px",fontWeight:700,color:"#1e293b"}}>{m.title}</p>
                      <p style={{fontSize:"11px",color:"#94a3b8",marginTop:"3px"}}>{new Date(m.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
                      <span style={{fontSize:"10px",fontWeight:700,color:CAT_COLORS[m.category],background:`${CAT_COLORS[m.category]}15`,padding:"2px 8px",borderRadius:"100px",display:"inline-block",marginTop:"5px"}}>{m.category}</span>
                    </div>
                  </div>
                ))}
                {child.milestones.length===0 && (
                  <div style={{padding:"32px 20px",textAlign:"center",color:"#94a3b8",fontSize:"14px"}}>No milestones yet — add your first one! 🌟</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Nav ── */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(0,0,0,0.06)",padding:"8px 16px 16px",zIndex:50,boxShadow:"0 -4px 20px rgba(0,0,0,0.07)"}}>
          <div style={{maxWidth:"520px",margin:"0 auto",display:"flex",gap:"6px"}}>
            {[
              { id:"overview",     label:"Overview",    icon:"🌱" },
              { id:"measurements", label:"Measurements",icon:"📏" },
              { id:"milestones",   label:"Milestones",  icon:"🏆" },
            ].map(t=>(
              <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                <span style={{fontSize:"22px"}}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── MODAL: Add Child ── */}
        {showAddChild && (
          <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAddChild(false)}}>
            <div className="modal">
              <h3 style={{fontFamily:"'Baloo 2',cursive",fontSize:"20px",fontWeight:800,color:"#1e293b",marginBottom:"16px"}}>👶 Add a Child</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"18px"}}>
                <div>
                  <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Name</p>
                  <input className="gt-input" placeholder="e.g. Sophie" value={childForm.name} onChange={e=>setChildForm({...childForm,name:e.target.value})}/>
                </div>
                <div>
                  <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Date of Birth</p>
                  <input type="date" className="gt-input" value={childForm.dob} onChange={e=>setChildForm({...childForm,dob:e.target.value})}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div>
                    <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Gender</p>
                    <select className="gt-input" value={childForm.gender} onChange={e=>setChildForm({...childForm,gender:e.target.value,emoji:e.target.value==="boy"?"👦":"👧"})}>
                      <option value="boy">Boy</option>
                      <option value="girl">Girl</option>
                    </select>
                  </div>
                  <div>
                    <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Emoji</p>
                    <select className="gt-input" value={childForm.emoji} onChange={e=>setChildForm({...childForm,emoji:e.target.value})}>
                      {["👦","👧","🧒","👼","🦸","🧑"].map(e=><option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:"10px"}}>
                <button className="gt-btn gt-btn-ghost" style={{flex:1}} onClick={()=>setShowAddChild(false)}>Cancel</button>
                <button className="gt-btn gt-btn-primary" style={{flex:2}} onClick={addChild}>Add Child 🌱</button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: Add Record ── */}
        {showAddRecord && (
          <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAddRecord(false)}}>
            <div className="modal">
              <h3 style={{fontFamily:"'Baloo 2',cursive",fontSize:"20px",fontWeight:800,color:"#1e293b",marginBottom:"16px"}}>📏 New Measurement</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                <div>
                  <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Height (cm)</p>
                  <input type="number" className="gt-input" placeholder="e.g. 95.5" value={recordForm.height} onChange={e=>setRecordForm({...recordForm,height:e.target.value})}/>
                </div>
                <div>
                  <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Weight (kg)</p>
                  <input type="number" className="gt-input" placeholder="e.g. 14.2" value={recordForm.weight} onChange={e=>setRecordForm({...recordForm,weight:e.target.value})}/>
                </div>
                <div>
                  <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Date</p>
                  <input type="date" className="gt-input" value={recordForm.date} onChange={e=>setRecordForm({...recordForm,date:e.target.value})}/>
                </div>
                <div>
                  <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Note</p>
                  <input className="gt-input" placeholder="e.g. 2 year check" value={recordForm.note} onChange={e=>setRecordForm({...recordForm,note:e.target.value})}/>
                </div>
              </div>
              <div style={{display:"flex",gap:"10px",marginTop:"8px"}}>
                <button className="gt-btn gt-btn-ghost" style={{flex:1}} onClick={()=>setShowAddRecord(false)}>Cancel</button>
                <button className="gt-btn gt-btn-primary" style={{flex:2}} onClick={addRecord}>Save Measurement 📏</button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: Add Milestone ── */}
        {showAddMilestone && (
          <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAddMilestone(false)}}>
            <div className="modal">
              <h3 style={{fontFamily:"'Baloo 2',cursive",fontSize:"20px",fontWeight:800,color:"#1e293b",marginBottom:"16px"}}>🏆 New Milestone</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"18px"}}>
                <div>
                  <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Milestone</p>
                  <input className="gt-input" placeholder="e.g. First steps 👣" value={milestoneForm.title} onChange={e=>setMilestoneForm({...milestoneForm,title:e.target.value})}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div>
                    <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Category</p>
                    <select className="gt-input" value={milestoneForm.category} onChange={e=>setMilestoneForm({...milestoneForm,category:e.target.value})}>
                      {Object.keys(CAT_COLORS).map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <p style={{fontSize:"11px",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"5px"}}>Date</p>
                    <input type="date" className="gt-input" value={milestoneForm.date} onChange={e=>setMilestoneForm({...milestoneForm,date:e.target.value})}/>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:"10px"}}>
                <button className="gt-btn gt-btn-ghost" style={{flex:1}} onClick={()=>setShowAddMilestone(false)}>Cancel</button>
                <button className="gt-btn gt-btn-blue" style={{flex:2}} onClick={addMilestone}>Save Milestone 🌟</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
