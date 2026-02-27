import { useState, useEffect } from "react";

// ── What does my BPM mean? ───────────────────────────────────────────────────
const getBPMInfo = (bpm) => {
  if (bpm < 60)  return {
    label: "Too Slow",
    emoji: "🔵",
    color: "#60a5fa",
    bg: "#eff6ff",
    border: "#bfdbfe",
    what: "Your heart is beating slower than normal. This can be normal for athletes, but may need a doctor's check if you feel dizzy.",
    tip: "Stay hydrated, avoid caffeine, and rest.",
  };
  if (bpm <= 100) return {
    label: "Healthy ✓",
    emoji: "💚",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    what: "Your heart is beating at a perfectly healthy rate. Keep up the good work!",
    tip: "Maintain your healthy habits — regular exercise and good sleep.",
  };
  if (bpm <= 120) return {
    label: "A Little High",
    emoji: "🟡",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    what: "Slightly elevated — this is normal after walking, mild stress, or caffeine.",
    tip: "Take deep breaths, sit down, and relax for a few minutes.",
  };
  return {
    label: "Too Fast",
    emoji: "🔴",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    what: "Your heart is beating very fast. This could be from exercise, anxiety, or a medical issue.",
    tip: "Sit down, breathe slowly. If it doesn't improve, contact a doctor.",
  };
};

// ── What does my Blood Pressure mean? ───────────────────────────────────────
const getBPInfo = (sys, dia) => {
  if (sys < 120 && dia < 80)  return { label:"Normal",    emoji:"💚", color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", what:"Great! Your blood pressure is in the healthy range. Your heart isn't working too hard.",       tip:"Keep eating healthy, stay active, and avoid too much salt." };
  if (sys < 130 && dia < 80)  return { label:"Elevated",  emoji:"🟡", color:"#d97706", bg:"#fffbeb", border:"#fde68a", what:"Slightly above normal. Not dangerous yet, but worth watching.",                               tip:"Reduce salt, exercise more, and manage stress." };
  if (sys < 140 || dia < 90)  return { label:"High (Stage 1)",emoji:"🟠",color:"#ea580c",bg:"#fff7ed",border:"#fed7aa",what:"High blood pressure. Over time this can strain your heart and arteries.",                    tip:"See your doctor. Cut salt, alcohol, and stress." };
  return                              { label:"High (Stage 2)",emoji:"🔴",color:"#dc2626",bg:"#fef2f2",border:"#fecaca",what:"Very high blood pressure. This needs medical attention.",                                     tip:"Contact your doctor soon. Don't ignore this." };
};

const today = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);

const SEED_BPM = [
  { id:1, bpm:72,  activity:"Resting",  time:"07:00", date:"2024-01-17" },
  { id:2, bpm:145, activity:"Exercise", time:"09:30", date:"2024-01-17" },
  { id:3, bpm:88,  activity:"Walking",  time:"12:00", date:"2024-01-17" },
  { id:4, bpm:65,  activity:"Resting",  time:"08:00", date:"2024-01-16" },
];
const SEED_BP = [
  { id:1, sys:118, dia:76, time:"07:05", date:"2024-01-17" },
  { id:2, sys:134, dia:86, time:"18:30", date:"2024-01-16" },
  { id:3, sys:116, dia:74, time:"07:00", date:"2024-01-15" },
];

export default function HeartMonitor() {
  const [tab, setTab]           = useState("learn");
  const [liveBPM, setLiveBPM]   = useState(72);
  const [bpmLogs, setBpmLogs]   = useState(SEED_BPM);
  const [bpLogs,  setBpLogs]    = useState(SEED_BP);
  const [bpmForm, setBpmForm]   = useState({ bpm:"", activity:"Resting", time:nowTime(), date:today() });
  const [bpForm,  setBpForm]    = useState({ sys:"", dia:"", time:nowTime(), date:today() });
  const [expandedBPM, setExpandedBPM] = useState(null);
  const [expandedBP,  setExpandedBP]  = useState(null);

  // Simulate live BPM
  useEffect(() => {
    const id = setInterval(() => {
      setLiveBPM(v => Math.round(Math.min(Math.max(v + (Math.random()-0.5)*5, 58), 105)));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const addBPM = () => {
    if (!bpmForm.bpm) return;
    setBpmLogs(p => [{ ...bpmForm, id:Date.now(), bpm:+bpmForm.bpm }, ...p]);
    setBpmForm({ bpm:"", activity:"Resting", time:nowTime(), date:today() });
  };
  const addBP = () => {
    if (!bpForm.sys || !bpForm.dia) return;
    setBpLogs(p => [{ ...bpForm, id:Date.now(), sys:+bpForm.sys, dia:+bpForm.dia }, ...p]);
    setBpForm({ sys:"", dia:"", time:nowTime(), date:today() });
  };

  const liveInfo = getBPMInfo(liveBPM);
  const tabs = [
    { id:"learn",    label:"Learn",        icon:"📖" },
    { id:"heartrate",label:"Heart Rate",   icon:"💓" },
    { id:"bp",       label:"Blood Pressure",icon:"🫀" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#f1f5f9;font-family:'Nunito',sans-serif;}
        input,select,button{font-family:'Nunito',sans-serif;}
        input:focus,select:focus{outline:none;}
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}

        .root{min-height:100vh;background:#f1f5f9;padding:0 0 90px;}

        .card{background:#fff;border-radius:20px;border:1px solid #e2e8f0;box-shadow:0 2px 10px rgba(0,0,0,0.06);margin-bottom:14px;overflow:hidden;}
        .card-p{padding:20px;}

        .field label{font-size:12px;font-weight:700;color:#64748b;display:block;margin-bottom:5px;}
        .field input,.field select{width:100%;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:14px;color:#1e293b;transition:border-color 0.2s;}
        .field input:focus,.field select:focus{border-color:#f43f5e;background:#fff;}
        .field select option{background:#fff;}

        .add-btn{width:100%;padding:13px;background:linear-gradient(135deg,#f43f5e,#e11d48);border:none;border-radius:12px;font-size:15px;font-weight:800;color:#fff;cursor:pointer;box-shadow:0 4px 16px rgba(244,63,94,0.35);transition:transform 0.15s,box-shadow 0.2s;}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(244,63,94,0.4);}
        .add-btn:active{transform:translateY(0);}

        .tab-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 6px;border:none;background:none;cursor:pointer;font-size:10px;font-weight:800;color:#94a3b8;border-radius:12px;transition:all 0.2s;text-transform:uppercase;letter-spacing:0.04em;}
        .tab-btn.active{color:#f43f5e;background:#fff5f7;}
        .tab-btn:hover:not(.active){background:#f8fafc;color:#475569;}

        .log-row{display:flex;align-items:center;padding:13px 18px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background 0.15s;}
        .log-row:hover{background:#fafbff;}
        .log-row:last-child{border-bottom:none;}

        .explain-box{background:#f8fafc;border-radius:12px;padding:14px;margin:0 18px 14px;border-left:3px solid;}
        .explain-box p{font-size:13px;color:#475569;line-height:1.6;}

        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        .heart-pulse{display:inline-block;animation:pulse 1s ease-in-out infinite;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .page{animation:fadeUp 0.3s ease forwards;}

        /* BPM Dial */
        .dial-wrap{position:relative;width:160px;height:160px;margin:0 auto;}
        .dial-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}

        /* Heartbeat bar animation */
        @keyframes barPulse{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
        .bar{width:5px;border-radius:3px;animation:barPulse 1s ease-in-out infinite;}
        .bar:nth-child(1){animation-delay:0s}
        .bar:nth-child(2){animation-delay:0.15s}
        .bar:nth-child(3){animation-delay:0.3s}
        .bar:nth-child(4){animation-delay:0.15s}
        .bar:nth-child(5){animation-delay:0s}
      `}</style>

      <div className="root">

        {/* Header */}
        <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"18px 20px 14px",position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
          <div style={{maxWidth:"480px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <h1 style={{fontSize:"21px",fontWeight:900,color:"#0f172a"}}>
                <span className="heart-pulse">❤️</span> Heart Monitor
              </h1>
              <p style={{fontSize:"12px",color:"#94a3b8",marginTop:"1px"}}>Easy heart health tracker</p>
            </div>
            {/* Live BPM pill */}
            <div style={{background:liveInfo.bg,border:`1.5px solid ${liveInfo.border}`,borderRadius:"14px",padding:"8px 14px",display:"flex",alignItems:"center",gap:"8px"}}>
              <span style={{fontSize:"18px"}}>{liveInfo.emoji}</span>
              <div>
                <p style={{fontSize:"20px",fontWeight:900,color:liveInfo.color,lineHeight:1}}>{liveBPM}</p>
                <p style={{fontSize:"9px",fontWeight:700,color:liveInfo.color,opacity:0.7}}>BPM LIVE</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{maxWidth:"480px",margin:"0 auto",padding:"18px 16px 0"}}>

          {/* ── LEARN TAB ── */}
          {tab === "learn" && (
            <div className="page" style={{display:"flex",flexDirection:"column",gap:"14px"}}>

              {/* Live status card */}
              <div className="card" style={{background:liveInfo.bg,border:`1.5px solid ${liveInfo.border}`}}>
                <div style={{padding:"22px 20px"}}>
                  <p style={{fontSize:"12px",fontWeight:700,color:liveInfo.color,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"8px"}}>Your Heart Right Now</p>
                  <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"14px"}}>
                    {/* Animated bars */}
                    <div style={{display:"flex",alignItems:"center",gap:"4px",height:"40px"}}>
                      {[30,50,40,50,30].map((h,i)=>(
                        <div key={i} className="bar" style={{height:`${h}px`,background:liveInfo.color,transformOrigin:"bottom"}}/>
                      ))}
                    </div>
                    <div>
                      <p style={{fontSize:"48px",fontWeight:900,color:liveInfo.color,lineHeight:1}}>{liveBPM}</p>
                      <p style={{fontSize:"13px",color:liveInfo.color,fontWeight:600,opacity:0.7}}>beats per minute</p>
                    </div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.7)",borderRadius:"12px",padding:"12px 14px"}}>
                    <p style={{fontSize:"13px",fontWeight:800,color:liveInfo.color,marginBottom:"4px"}}>{liveInfo.emoji} {liveInfo.label}</p>
                    <p style={{fontSize:"13px",color:"#475569",lineHeight:1.6}}>{liveInfo.what}</p>
                    <p style={{fontSize:"12px",color:"#64748b",marginTop:"8px",fontWeight:600}}>💡 {liveInfo.tip}</p>
                  </div>
                </div>
              </div>

              {/* What is BPM? */}
              <div className="card card-p">
                <p style={{fontSize:"16px",fontWeight:900,color:"#0f172a",marginBottom:"12px"}}>❓ What is BPM?</p>
                <p style={{fontSize:"14px",color:"#475569",lineHeight:1.7,marginBottom:"12px"}}>
                  <strong>BPM</strong> stands for <strong>Beats Per Minute</strong>. It simply tells you <strong>how many times your heart beats in one minute</strong>.
                </p>
                <p style={{fontSize:"14px",color:"#475569",lineHeight:1.7}}>
                  Think of it like a drum — a healthy heart beats in a steady rhythm, not too fast, not too slow.
                </p>
              </div>

              {/* BPM zones explained with emoji scale */}
              <div className="card card-p">
                <p style={{fontSize:"16px",fontWeight:900,color:"#0f172a",marginBottom:"14px"}}>📊 BPM Ranges Explained</p>
                {[
                  { emoji:"🔵", range:"Below 60",  label:"Too Slow",       color:"#60a5fa", bg:"#eff6ff", desc:"Normal for fit athletes. Otherwise may cause dizziness." },
                  { emoji:"💚", range:"60 – 100",  label:"Healthy ✓",      color:"#16a34a", bg:"#f0fdf4", desc:"This is the ideal range for a resting adult. You're good!" },
                  { emoji:"🟡", range:"101 – 120", label:"A Little High",  color:"#d97706", bg:"#fffbeb", desc:"Normal after walking, stress, or caffeine. Should settle down." },
                  { emoji:"🔴", range:"Above 120", label:"Too Fast",        color:"#dc2626", bg:"#fef2f2", desc:"Could signal exercise, fever, anxiety or a heart issue. See a doctor if it persists." },
                ].map(z => (
                  <div key={z.label} style={{background:z.bg,border:`1px solid`,borderColor:`${z.color}30`,borderRadius:"12px",padding:"12px 14px",marginBottom:"10px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
                    <span style={{fontSize:"24px",flexShrink:0}}>{z.emoji}</span>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px"}}>
                        <span style={{fontSize:"13px",fontWeight:800,color:z.color}}>{z.label}</span>
                        <span style={{fontSize:"12px",color:"#94a3b8",fontWeight:600}}>{z.range} BPM</span>
                      </div>
                      <p style={{fontSize:"13px",color:"#475569",lineHeight:1.5}}>{z.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What is Blood Pressure? */}
              <div className="card card-p">
                <p style={{fontSize:"16px",fontWeight:900,color:"#0f172a",marginBottom:"12px"}}>🫀 What is Blood Pressure?</p>
                <p style={{fontSize:"14px",color:"#475569",lineHeight:1.7,marginBottom:"12px"}}>
                  Blood pressure is shown as <strong>two numbers</strong>, like <strong>120/80</strong>.
                </p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
                  <div style={{background:"#fef2f2",borderRadius:"12px",padding:"14px",border:"1px solid #fecaca"}}>
                    <p style={{fontSize:"22px",fontWeight:900,color:"#dc2626"}}>120</p>
                    <p style={{fontSize:"13px",fontWeight:700,color:"#dc2626",marginBottom:"4px"}}>Systolic (Top)</p>
                    <p style={{fontSize:"12px",color:"#475569",lineHeight:1.5}}>Pressure when your heart <strong>squeezes</strong> and pumps blood out.</p>
                  </div>
                  <div style={{background:"#eff6ff",borderRadius:"12px",padding:"14px",border:"1px solid #bfdbfe"}}>
                    <p style={{fontSize:"22px",fontWeight:900,color:"#2563eb"}}>80</p>
                    <p style={{fontSize:"13px",fontWeight:700,color:"#2563eb",marginBottom:"4px"}}>Diastolic (Bottom)</p>
                    <p style={{fontSize:"12px",color:"#475569",lineHeight:1.5}}>Pressure when your heart <strong>relaxes</strong> between beats.</p>
                  </div>
                </div>
                <p style={{fontSize:"13px",color:"#64748b",lineHeight:1.6}}>
                  💡 <strong>Tip:</strong> The lower your BP (within healthy range), the less strain on your heart and blood vessels.
                </p>
              </div>

              {/* BP zones */}
              <div className="card card-p">
                <p style={{fontSize:"16px",fontWeight:900,color:"#0f172a",marginBottom:"14px"}}>📊 Blood Pressure Ranges</p>
                {[
                  { emoji:"💚", label:"Normal",        range:"Less than 120/80",   color:"#16a34a", bg:"#f0fdf4", desc:"Perfect. Your heart and arteries are happy!" },
                  { emoji:"🟡", label:"Elevated",       range:"120–129 / under 80", color:"#d97706", bg:"#fffbeb", desc:"Slightly high. Lifestyle changes can bring it back." },
                  { emoji:"🟠", label:"High (Stage 1)", range:"130–139 / 80–89",    color:"#ea580c", bg:"#fff7ed", desc:"Getting dangerous. Talk to your doctor." },
                  { emoji:"🔴", label:"High (Stage 2)", range:"140+ / 90+",          color:"#dc2626", bg:"#fef2f2", desc:"Very high. Medical attention needed." },
                ].map(z => (
                  <div key={z.label} style={{background:z.bg,border:`1px solid ${z.color}25`,borderRadius:"12px",padding:"12px 14px",marginBottom:"10px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
                    <span style={{fontSize:"24px",flexShrink:0}}>{z.emoji}</span>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px"}}>
                        <span style={{fontSize:"13px",fontWeight:800,color:z.color}}>{z.label}</span>
                        <span style={{fontSize:"12px",color:"#94a3b8",fontWeight:600}}>{z.range}</span>
                      </div>
                      <p style={{fontSize:"13px",color:"#475569",lineHeight:1.5}}>{z.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick tips */}
              <div className="card card-p" style={{background:"linear-gradient(135deg,#fff5f7,#fff)",border:"1.5px solid #fecdd3"}}>
                <p style={{fontSize:"16px",fontWeight:900,color:"#0f172a",marginBottom:"12px"}}>💡 Simple Heart Health Tips</p>
                {[
                  ["🚶","Walk 30 minutes daily — it's the best free medicine."],
                  ["💧","Drink enough water — dehydration raises your heart rate."],
                  ["😴","Sleep 7–8 hours — your heart recovers while you sleep."],
                  ["🧂","Reduce salt — too much raises blood pressure."],
                  ["🧘","Manage stress — anxiety directly affects your heart rate."],
                  ["🚭","Avoid smoking — it damages heart and blood vessels."],
                ].map(([icon,tip]) => (
                  <div key={tip} style={{display:"flex",gap:"12px",alignItems:"flex-start",marginBottom:"10px"}}>
                    <span style={{fontSize:"20px",flexShrink:0}}>{icon}</span>
                    <p style={{fontSize:"13px",color:"#475569",lineHeight:1.6,paddingTop:"1px"}}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HEART RATE LOG TAB ── */}
          {tab === "heartrate" && (
            <div className="page" style={{display:"flex",flexDirection:"column",gap:"14px"}}>
              <div className="card card-p">
                <p style={{fontSize:"15px",fontWeight:900,color:"#0f172a",marginBottom:"14px"}}>💓 Log Your Heart Rate</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
                  <div className="field">
                    <label>Your BPM reading</label>
                    <input type="number" placeholder="e.g. 75" value={bpmForm.bpm} onChange={e=>setBpmForm({...bpmForm,bpm:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>What were you doing?</label>
                    <select value={bpmForm.activity} onChange={e=>setBpmForm({...bpmForm,activity:e.target.value})}>
                      {["Resting","Walking","Exercise","Sleeping","Stressed","After Meal","Waking Up"].map(a=><option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Time</label>
                    <input type="time" value={bpmForm.time} onChange={e=>setBpmForm({...bpmForm,time:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>Date</label>
                    <input type="date" value={bpmForm.date} onChange={e=>setBpmForm({...bpmForm,date:e.target.value})}/>
                  </div>
                </div>
                <button className="add-btn" onClick={addBPM}>+ Save Reading</button>
              </div>

              {/* Explanation reminder */}
              <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"14px",padding:"14px 16px",display:"flex",gap:"10px"}}>
                <span style={{fontSize:"20px"}}>💡</span>
                <p style={{fontSize:"13px",color:"#166534",lineHeight:1.6}}>
                  <strong>Normal resting heart rate</strong> for adults is <strong>60–100 BPM</strong>. Measure it in the morning before getting up for the most accurate reading.
                </p>
              </div>

              <div className="card">
                <div style={{padding:"14px 18px 8px",fontSize:"13px",fontWeight:800,color:"#64748b",borderBottom:"1px solid #f1f5f9"}}>
                  📋 Your Readings ({bpmLogs.length} saved)
                </div>
                {bpmLogs.map(l => {
                  const info = getBPMInfo(l.bpm);
                  const isOpen = expandedBPM === l.id;
                  return (
                    <div key={l.id}>
                      <div className="log-row" onClick={()=>setExpandedBPM(isOpen ? null : l.id)}>
                        <div style={{width:"44px",height:"44px",borderRadius:"12px",background:info.bg,border:`1px solid ${info.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginRight:"12px",flexShrink:0,fontSize:"22px"}}>
                          {info.emoji}
                        </div>
                        <div style={{flex:1}}>
                          <p style={{fontSize:"14px",fontWeight:700,color:"#1e293b"}}>{l.activity}</p>
                          <p style={{fontSize:"11px",color:"#94a3b8",marginTop:"2px"}}>{l.date} · {l.time}</p>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <p style={{fontSize:"22px",fontWeight:900,color:info.color,lineHeight:1}}>{l.bpm}</p>
                          <span style={{fontSize:"10px",fontWeight:700,color:info.color,background:info.bg,padding:"2px 8px",borderRadius:"100px",border:`1px solid ${info.border}`,display:"inline-block",marginTop:"2px"}}>{info.label}</span>
                        </div>
                      </div>
                      {isOpen && (
                        <div style={{background:info.bg,borderLeft:`4px solid ${info.color}`,margin:"0 16px 12px",borderRadius:"10px",padding:"12px 14px"}}>
                          <p style={{fontSize:"13px",color:"#475569",lineHeight:1.6,marginBottom:"6px"}}>{info.what}</p>
                          <p style={{fontSize:"12px",fontWeight:700,color:info.color}}>💡 {info.tip}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── BLOOD PRESSURE TAB ── */}
          {tab === "bp" && (
            <div className="page" style={{display:"flex",flexDirection:"column",gap:"14px"}}>
              <div className="card card-p">
                <p style={{fontSize:"15px",fontWeight:900,color:"#0f172a",marginBottom:"14px"}}>🫀 Log Blood Pressure</p>

                {/* Simple explainer in form */}
                <div style={{background:"#f8fafc",borderRadius:"12px",padding:"12px 14px",marginBottom:"14px",border:"1px solid #e2e8f0"}}>
                  <p style={{fontSize:"12px",color:"#64748b",lineHeight:1.6}}>
                    Enter two numbers from your blood pressure monitor.<br/>
                    <strong style={{color:"#dc2626"}}>Top number (Systolic)</strong> — when heart squeezes &nbsp;·&nbsp;
                    <strong style={{color:"#2563eb"}}>Bottom number (Diastolic)</strong> — when heart relaxes
                  </p>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
                  <div className="field">
                    <label>🔴 Top Number (Systolic)</label>
                    <input type="number" placeholder="e.g. 120" value={bpForm.sys} onChange={e=>setBpForm({...bpForm,sys:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>🔵 Bottom Number (Diastolic)</label>
                    <input type="number" placeholder="e.g. 80" value={bpForm.dia} onChange={e=>setBpForm({...bpForm,dia:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>Time</label>
                    <input type="time" value={bpForm.time} onChange={e=>setBpForm({...bpForm,time:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>Date</label>
                    <input type="date" value={bpForm.date} onChange={e=>setBpForm({...bpForm,date:e.target.value})}/>
                  </div>
                </div>
                <button className="add-btn" onClick={addBP}>+ Save Reading</button>
              </div>

              <div className="card">
                <div style={{padding:"14px 18px 8px",fontSize:"13px",fontWeight:800,color:"#64748b",borderBottom:"1px solid #f1f5f9"}}>
                  📋 Your Readings ({bpLogs.length} saved)
                </div>
                {bpLogs.map(l => {
                  const info = getBPInfo(l.sys, l.dia);
                  const isOpen = expandedBP === l.id;
                  return (
                    <div key={l.id}>
                      <div className="log-row" onClick={()=>setExpandedBP(isOpen ? null : l.id)}>
                        <div style={{width:"44px",height:"44px",borderRadius:"12px",background:info.bg,border:`1px solid ${info.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginRight:"12px",flexShrink:0,fontSize:"22px"}}>
                          {info.emoji}
                        </div>
                        <div style={{flex:1}}>
                          <p style={{fontSize:"17px",fontWeight:900,color:"#1e293b"}}>{l.sys}<span style={{color:"#94a3b8",fontWeight:400}}>/</span>{l.dia}</p>
                          <p style={{fontSize:"11px",color:"#94a3b8",marginTop:"2px"}}>{l.date} · {l.time} &nbsp;·&nbsp; mmHg</p>
                        </div>
                        <span style={{fontSize:"11px",fontWeight:700,color:info.color,background:info.bg,padding:"5px 10px",borderRadius:"100px",border:`1px solid ${info.border}`}}>{info.label}</span>
                      </div>
                      {isOpen && (
                        <div style={{background:info.bg,borderLeft:`4px solid ${info.color}`,margin:"0 16px 12px",borderRadius:"10px",padding:"12px 14px"}}>
                          <p style={{fontSize:"13px",color:"#475569",lineHeight:1.6,marginBottom:"6px"}}>{info.what}</p>
                          <p style={{fontSize:"12px",fontWeight:700,color:info.color}}>💡 {info.tip}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(12px)",borderTop:"1px solid #e2e8f0",padding:"8px 16px 16px",zIndex:50,boxShadow:"0 -4px 16px rgba(0,0,0,0.07)"}}>
          <div style={{maxWidth:"480px",margin:"0 auto",display:"flex",gap:"6px"}}>
            {tabs.map(t=>(
              <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                <span style={{fontSize:"22px"}}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
