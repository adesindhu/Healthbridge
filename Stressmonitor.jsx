import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  { id: 1, text: "How overwhelmed do you feel right now?", icon: "🌊" },
  { id: 2, text: "How well did you sleep last night?",     icon: "🌙", invert: true },
  { id: 3, text: "How tense are your muscles?",           icon: "💪" },
  { id: 4, text: "How focused can you be today?",         icon: "🎯", invert: true },
  { id: 5, text: "How anxious are you feeling?",          icon: "⚡" },
];

const TIPS = {
  low:    ["Take a mindful walk outside 🌿","Enjoy a calming herbal tea 🍵","Practice gratitude journaling ✍️","Listen to your favorite playlist 🎵"],
  medium: ["Try 4-7-8 breathing technique 🌬️","Take a 10-min break from screens 📵","Do light stretching exercises 🧘","Drink a glass of cold water 💧"],
  high:   ["Box breathing: 4s in, hold 4s, out 4s 📦","Step outside for fresh air 🌳","Call a friend or loved one 📞","Progressive muscle relaxation 💆"],
};

const getLevel = (score) => {
  if (score <= 33) return { label:"Calm",     color:"#34d399", glow:"rgba(52,211,153,0.45)",  bg:"rgba(52,211,153,0.07)",  tips:TIPS.low    };
  if (score <= 66) return { label:"Moderate", color:"#fbbf24", glow:"rgba(251,191,36,0.45)",  bg:"rgba(251,191,36,0.07)",  tips:TIPS.medium };
  return                   { label:"High",    color:"#f87171", glow:"rgba(248,113,113,0.45)", bg:"rgba(248,113,113,0.07)", tips:TIPS.high   };
};

const toSparkPath = (data, w, h) => {
  if (data.length < 2) return "";
  const xStep = w / (data.length - 1);
  return data.map((v, i) => `${i===0?"M":"L"} ${i*xStep} ${h-(v/100)*h}`).join(" ");
};

export default function StressMonitor() {
  const [answers, setAnswers]       = useState(Array(QUESTIONS.length).fill(50));
  const [submitted, setSubmitted]   = useState(false);
  const [score, setScore]           = useState(0);
  const [animScore, setAnimScore]   = useState(0);
  const [history, setHistory]       = useState([42,67,55,78,60,45,71]);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [breathActive, setBreathActive] = useState(false);
  const [breathCount, setBreathCount]   = useState(0);
  const breathRef = useRef(null);

  const computeScore = (ans) => {
    const raw = ans.reduce((sum, v, i) => sum + (QUESTIONS[i].invert ? 100 - v : v), 0);
    return Math.round(raw / QUESTIONS.length);
  };

  const handleSubmit = () => {
    const s = computeScore(answers);
    setScore(s);
    setSubmitted(true);
    setHistory(prev => [...prev.slice(-8), s]);
    let start = null;
    const anim = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      const ease = 1 - Math.pow(1-p, 3);
      setAnimScore(Math.round(s * ease));
      if (p < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  };

  const handleReset = () => {
    setSubmitted(false);
    setAnswers(Array(QUESTIONS.length).fill(50));
    setAnimScore(0);
    setBreathActive(false);
    setBreathCount(0);
    clearTimeout(breathRef.current);
  };

  useEffect(() => {
    if (!breathActive) return;
    const cycle = [{ phase:"inhale",dur:4000 },{ phase:"hold",dur:4000 },{ phase:"exhale",dur:4000 }];
    let idx = 0;
    const step = () => {
      setBreathPhase(cycle[idx].phase);
      breathRef.current = setTimeout(() => {
        idx = (idx+1) % cycle.length;
        if (idx===0) setBreathCount(c=>c+1);
        step();
      }, cycle[idx].dur);
    };
    step();
    return () => clearTimeout(breathRef.current);
  }, [breathActive]);

  const level = submitted ? getLevel(score) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#080b14;}

        .root{min-height:100vh;background:#080b14;font-family:'Plus Jakarta Sans',sans-serif;display:flex;align-items:flex-start;justify-content:center;padding:32px 16px 72px;position:relative;overflow-x:hidden;}
        .blob{position:fixed;border-radius:50%;pointer-events:none;filter:blur(90px);z-index:0;}
        .b1{width:550px;height:550px;background:radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%);top:-160px;left:-160px;}
        .b2{width:450px;height:450px;background:radial-gradient(circle,rgba(20,184,166,0.12),transparent 70%);bottom:-120px;right:-120px;}
        .b3{width:300px;height:300px;background:radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%);top:45%;left:60%;}
        .grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);background-size:44px 44px;pointer-events:none;z-index:0;}

        .inner{position:relative;z-index:1;width:100%;max-width:500px;display:flex;flex-direction:column;gap:14px;}

        /* Header */
        .header{text-align:center;padding:8px 0 4px;}
        .eyebrow{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);padding:5px 14px;border-radius:100px;display:inline-flex;align-items:center;gap:7px;margin-bottom:14px;}
        .eyebrow::before{content:'';width:6px;height:6px;border-radius:50%;background:#a78bfa;box-shadow:0 0 8px #a78bfa;animation:pdot 2s infinite;}
        @keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
        h1.title{font-family:'Playfair Display',serif;font-size:clamp(30px,5vw,42px);font-weight:900;background:linear-gradient(135deg,#fff 35%,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.1;margin-bottom:8px;}
        .sub{font-size:13px;color:rgba(255,255,255,.28);font-weight:300;}

        /* Card */
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:22px;backdrop-filter:blur(16px);animation:cardIn .5s cubic-bezier(.16,1,.3,1) both;}
        .card:nth-child(2){animation-delay:.05s}.card:nth-child(3){animation-delay:.1s}.card:nth-child(4){animation-delay:.15s}.card:nth-child(5){animation-delay:.2s}
        @keyframes cardIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

        /* Section label */
        .sec-label{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);padding:16px 22px 10px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;align-items:center;gap:8px;}

        /* Question item */
        .q-item{padding:16px 22px;border-bottom:1px solid rgba(255,255,255,.04);}
        .q-item:last-child{border-bottom:none;}
        .q-top{display:flex;align-items:center;gap:10px;margin-bottom:11px;}
        .q-icon{font-size:17px;}
        .q-text{font-size:13.5px;font-weight:500;color:rgba(255,255,255,.8);flex:1;}
        .q-val{font-size:13px;font-weight:700;color:#a78bfa;min-width:28px;text-align:right;}

        /* Slider */
        .slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:4px;outline:none;cursor:pointer;-moz-appearance:textfield;}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:2px solid #fff;cursor:pointer;box-shadow:0 0 10px rgba(139,92,246,.55);transition:transform .15s;}
        .slider::-webkit-slider-thumb:hover{transform:scale(1.2);}
        .slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:2px solid #fff;}

        /* Buttons */
        .btn{width:100%;padding:15px;background:linear-gradient(135deg,#7c3aed,#6366f1);border:none;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;letter-spacing:.04em;color:#fff;cursor:pointer;box-shadow:0 8px 30px rgba(124,58,237,.4);transition:transform .15s,box-shadow .2s;position:relative;overflow:hidden;}
        .btn::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.1),transparent);}
        .btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(124,58,237,.55);}
        .btn:active{transform:translateY(0);}
        .btn-ghost{width:100%;padding:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,.45);cursor:pointer;transition:all .2s;}
        .btn-ghost:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.75);}

        /* Score orb */
        .orb-wrap{display:flex;flex-direction:column;align-items:center;padding:30px 22px 22px;}
        .orb-outer{width:150px;height:150px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:18px;animation:breathe 4s ease-in-out infinite;}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .orb-ring{position:absolute;inset:-7px;border-radius:50%;border:1.5px solid;opacity:.3;animation:rspin 9s linear infinite;}
        .orb-ring2{position:absolute;inset:-16px;border-radius:50%;border:1px solid;opacity:.12;animation:rspin 16s linear infinite reverse;}
        @keyframes rspin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        .orb-inner{width:100%;height:100%;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;}
        .orb-num{font-family:'Playfair Display',serif;font-size:46px;font-weight:900;line-height:1;color:#fff;}
        .orb-sub{font-size:11px;color:rgba(255,255,255,.35);font-weight:400;}
        .orb-lbl{font-size:19px;font-weight:800;}
        .orb-desc{font-size:12.5px;color:rgba(255,255,255,.32);margin-top:6px;text-align:center;max-width:260px;line-height:1.5;}

        /* Insight row */
        .insight-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;padding:0 22px 22px;}
        .ic{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:13px 10px;text-align:center;}
        .ic-icon{font-size:19px;margin-bottom:5px;}
        .ic-val{font-size:15px;font-weight:700;color:#fff;margin-bottom:2px;}
        .ic-key{font-size:10px;color:rgba(255,255,255,.28);letter-spacing:.08em;text-transform:uppercase;}

        /* Tips */
        .tips-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px 22px 22px;}
        .tip{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:13px 12px;font-size:13px;color:rgba(255,255,255,.65);line-height:1.45;animation:fi .4s ease forwards;opacity:0;}
        .tip:nth-child(1){animation-delay:.08s}.tip:nth-child(2){animation-delay:.16s}.tip:nth-child(3){animation-delay:.24s}.tip:nth-child(4){animation-delay:.32s}
        @keyframes fi{to{opacity:1}}

        /* Spark */
        .spark-wrap{padding:18px 22px;}
        .spark-label{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:12px;}

        /* Breath */
        .breath-wrap{padding:18px 22px;display:flex;flex-direction:column;align-items:center;gap:12px;}
        .borb{width:88px;height:88px;border-radius:50%;background:radial-gradient(circle at 38% 35%,rgba(139,92,246,.55),rgba(99,102,241,.18));border:1.5px solid rgba(139,92,246,.35);display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:600;color:rgba(255,255,255,.75);letter-spacing:.07em;text-transform:uppercase;box-shadow:0 0 28px rgba(139,92,246,.2);transition:transform 4s ease-in-out,box-shadow 4s ease-in-out;}
        .borb.inhale{transform:scale(1.24);box-shadow:0 0 55px rgba(139,92,246,.5);}
        .borb.hold{transform:scale(1.24);box-shadow:0 0 55px rgba(99,102,241,.5);}
        .borb.exhale{transform:scale(.88);box-shadow:0 0 12px rgba(139,92,246,.12);}
        .bcnt{font-size:11.5px;color:rgba(255,255,255,.28);}
      `}</style>

      <div className="root">
        <div className="blob b1"/><div className="blob b2"/><div className="blob b3"/>
        <div className="grid-bg"/>

        <div className="inner">
          {/* Header */}
          <div className="header">
            <div className="eyebrow">Wellness Check-in</div>
            <h1 className="title">Stress Monitor</h1>
            <p className="sub">Assess your stress level in under 60 seconds</p>
          </div>

          {!submitted ? (
            <>
              <div className="card">
                <div className="sec-label"><span>📊</span> Rate each factor — 0 (none) to 100 (extreme)</div>
                {QUESTIONS.map((q,i) => (
                  <div className="q-item" key={q.id}>
                    <div className="q-top">
                      <span className="q-icon">{q.icon}</span>
                      <span className="q-text">{q.text}</span>
                      <span className="q-val">{answers[i]}</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={answers[i]}
                      className="slider"
                      style={{background:`linear-gradient(to right,#8b5cf6 ${answers[i]}%,rgba(255,255,255,.1) ${answers[i]}%)`}}
                      onChange={e=>{ const n=[...answers];n[i]=+e.target.value;setAnswers(n); }}
                    />
                  </div>
                ))}
              </div>
              <button className="btn" onClick={handleSubmit}>Analyse My Stress Level →</button>
            </>
          ) : (
            <>
              {/* Score card */}
              <div className="card" style={{background:level.bg,borderColor:`${level.color}22`}}>
                <div className="orb-wrap">
                  <div className="orb-outer" style={{background:`radial-gradient(circle at 38% 35%,${level.glow},${level.bg})`,boxShadow:`0 0 55px ${level.glow}`}}>
                    <div className="orb-ring"  style={{borderColor:level.color}}/>
                    <div className="orb-ring2" style={{borderColor:level.color}}/>
                    <div className="orb-inner" style={{border:`1.5px solid ${level.color}33`,background:`radial-gradient(circle at 40% 35%,rgba(255,255,255,.05),transparent)`}}>
                      <span className="orb-num">{animScore}</span>
                      <span className="orb-sub">/ 100</span>
                    </div>
                  </div>
                  <span className="orb-lbl" style={{color:level.color}}>{level.label} Stress</span>
                  <p className="orb-desc">
                    {score<=33?"You're doing great. Keep up your healthy habits!":
                     score<=66?"Moderate stress detected. Time for a mindful break.":
                     "High stress detected. Please take care of yourself today."}
                  </p>
                </div>
                <div className="insight-row">
                  {[["😤",score<=33?"Low":score<=66?"Med":"High","Tension"],
                    ["🧠",score<=33?"Sharp":score<=66?"Fair":"Foggy","Focus"],
                    ["❤️",score<=33?"Steady":score<=66?"Mild":"Raised","Wellbeing"]
                  ].map(([icon,val,key])=>(
                    <div className="ic" key={key}>
                      <div className="ic-icon">{icon}</div>
                      <div className="ic-val" style={{color:level.color}}>{val}</div>
                      <div className="ic-key">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="card">
                <div className="sec-label"><span>💡</span> Recommended Actions</div>
                <div className="tips-grid">
                  {level.tips.map((t,i)=><div key={i} className="tip">{t}</div>)}
                </div>
              </div>

              {/* Sparkline history */}
              <div className="card">
                <div className="spark-wrap">
                  <div className="spark-label">📈 Stress History (last {history.length} checks)</div>
                  <svg width="100%" height="65" viewBox={`0 0 ${(history.length-1)*56} 65`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={level.color} stopOpacity=".28"/>
                        <stop offset="100%" stopColor={level.color} stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d={`${toSparkPath(history,(history.length-1)*56,58)} L ${(history.length-1)*56} 65 L 0 65 Z`} fill="url(#sg2)"/>
                    <path d={toSparkPath(history,(history.length-1)*56,58)} fill="none" stroke={level.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    {history.map((v,i)=>(
                      <circle key={i} cx={i*56} cy={58-(v/100)*58}
                        r={i===history.length-1?"5":"3"}
                        fill={i===history.length-1?level.color:"rgba(255,255,255,.13)"}
                        stroke={i===history.length-1?"#fff":"none"} strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>
                    {history.map((v,i)=>(
                      <span key={i} style={{fontSize:"10px",color:i===history.length-1?level.color:"rgba(255,255,255,.2)",fontWeight:i===history.length-1?700:400}}>{v}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Breathing exercise */}
              <div className="card">
                <div className="sec-label"><span>🫁</span> Guided Breathing Exercise</div>
                <div className="breath-wrap">
                  <div className={`borb${breathActive?" "+breathPhase:""}`}>
                    {breathActive ? breathPhase : "Ready"}
                  </div>
                  {breathActive && <p className="bcnt">Cycles: {breathCount}</p>}
                  <button
                    className={breathActive?"btn-ghost":"btn"}
                    style={breathActive?{}:{maxWidth:"200px"}}
                    onClick={()=>{ setBreathActive(a=>!a); if(breathActive){setBreathCount(0);} }}
                  >
                    {breathActive ? "Stop Exercise" : "Start Breathing"}
                  </button>
                </div>
              </div>

              <button className="btn-ghost" onClick={handleReset}>↺ Retake Assessment</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
