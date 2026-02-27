import { useState, useEffect, useRef } from "react";

const categories = [
  { label: "Underweight", range: "< 18.5",  color: "#38bdf8", glow: "rgba(56,189,248,0.4)"  },
  { label: "Normal",      range: "18.5–24.9",color: "#4ade80", glow: "rgba(74,222,128,0.4)"  },
  { label: "Overweight",  range: "25–29.9",  color: "#fb923c", glow: "rgba(251,146,60,0.4)"  },
  { label: "Obese",       range: "≥ 30",     color: "#f87171", glow: "rgba(248,113,113,0.4)" },
];

const getCategory = (val) => {
  if (val < 18.5) return categories[0];
  if (val < 25)   return categories[1];
  if (val < 30)   return categories[2];
  return categories[3];
};

// Arc gauge helpers
const polarToCartesian = (cx, cy, r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const arcPath = (cx, cy, r, startDeg, endDeg) => {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

// Map BMI 10–40 → -135 to +135 degrees
const bmiToDeg = (bmi) => {
  const clamped = Math.min(Math.max(bmi, 10), 40);
  return -135 + ((clamped - 10) / 30) * 270;
};

export default function BMICalculator() {
  const [weight, setWeight]   = useState("");
  const [height, setHeight]   = useState("");
  const [bmi, setBmi]         = useState(null);
  const [displayed, setDisplayed] = useState(0);
  const [needleDeg, setNeedleDeg] = useState(-135);
  const [revealed, setRevealed]   = useState(false);
  const animRef = useRef(null);

  const calculate = () => {
    if (!weight || !height || height <= 0) return;
    const val = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
    setBmi(val);
    setRevealed(true);
    // animate number
    let start = null;
    const duration = 900;
    const startVal = displayed;
    const animateNum = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(parseFloat((startVal + (val - startVal) * ease).toFixed(1)));
      setNeedleDeg(-135 + (bmiToDeg(val) + 135) * ease);
      if (p < 1) animRef.current = requestAnimationFrame(animateNum);
    };
    cancelAnimationFrame(animRef.current);
    requestAnimationFrame(animateNum);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const cat     = bmi ? getCategory(bmi) : null;
  const CX = 100, CY = 100, R = 72;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Outfit', sans-serif; }

        .root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          background: #05060f;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        /* Mesh gradient blobs */
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none; opacity: 0.55;
        }
        .blob1 { width:500px;height:500px; background:radial-gradient(circle,#6366f1,transparent 70%); top:-120px;left:-120px; }
        .blob2 { width:400px;height:400px; background:radial-gradient(circle,#0ea5e9,transparent 70%); bottom:-100px;right:-80px; }
        .blob3 { width:300px;height:300px; background:radial-gradient(circle,#8b5cf6,transparent 70%); top:40%;left:55%; }

        /* Grid texture */
        .root::before {
          content:'';
          position:absolute; inset:0;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size: 40px 40px;
          pointer-events:none;
        }

        .card {
          position: relative; z-index: 2;
          width: 100%; max-width: 440px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 28px;
          padding: 36px 32px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset,
                      0 40px 80px rgba(0,0,0,0.6);
        }

        .chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #a5b4fc;
          background: rgba(165,180,252,0.08);
          border: 1px solid rgba(165,180,252,0.18);
          padding: 5px 14px; border-radius: 100px;
          margin-bottom: 20px;
        }
        .chip::before { content:''; width:6px;height:6px;border-radius:50%;background:#a5b4fc;box-shadow:0 0 6px #a5b4fc; }

        h1 {
          font-size: 36px; font-weight: 900;
          background: linear-gradient(135deg, #fff 30%, #a5b4fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1; margin-bottom: 6px;
        }
        .sub { font-size: 13px; color: rgba(255,255,255,0.3); margin-bottom: 32px; font-weight: 300; }

        /* Floating label inputs */
        .field { position: relative; margin-bottom: 18px; }
        .field input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 20px 52px 8px 16px;
          font-size: 18px; font-weight: 600;
          color: #fff; outline: none;
          font-family: 'Outfit', sans-serif;
          transition: border-color 0.25s, background 0.25s;
          -moz-appearance: textfield;
        }
        .field input::-webkit-inner-spin-button,
        .field input::-webkit-outer-spin-button { -webkit-appearance: none; }
        .field input:focus {
          border-color: rgba(165,180,252,0.5);
          background: rgba(165,180,252,0.06);
        }
        .field label {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 15px; color: rgba(255,255,255,0.3);
          pointer-events: none; font-weight: 400;
          transition: all 0.2s;
        }
        .field input:focus ~ label,
        .field input:not(:placeholder-shown) ~ label {
          top: 10px; transform: none;
          font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase; color: #a5b4fc;
          font-weight: 600;
        }
        .unit {
          position: absolute; right: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 13px; color: rgba(255,255,255,0.2);
          font-weight: 500; pointer-events: none;
        }

        /* Segmented row */
        .seg-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 24px;
        }

        /* Calc button */
        .btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none; border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.04em; color: #fff;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(99,102,241,0.35);
        }
        .btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.5); }
        .btn:active { transform: translateY(0); }

        /* Result panel */
        .result {
          margin-top: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 24px;
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .gauge-wrap { display:flex; justify-content:center; margin-bottom:16px; }

        .bmi-num {
          font-size: 52px; font-weight: 900; color: #fff;
          line-height: 1; letter-spacing: -2px;
        }
        .bmi-unit { font-size: 13px; color: rgba(255,255,255,0.3); font-weight:300; margin-left:6px; }
        .cat-label { font-size: 14px; font-weight: 600; margin-top:6px; margin-bottom:20px; }

        /* Category pills */
        .cats { display:flex; gap:8px; flex-wrap:wrap; }
        .cat-pill {
          font-size:11px; font-weight:600;
          padding:4px 10px; border-radius:100px;
          border:1px solid; opacity:0.35;
          transition: opacity 0.3s;
          letter-spacing:0.04em;
        }
        .cat-pill.active { opacity:1; }

        /* Needle line */
        .needle { transform-origin: 100px 100px; transition: transform 0.9s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>

      <div className="root">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />

        <div className="card">
          <div className="chip">Health Metric</div>
          <h1>Body Mass<br/>Index</h1>
          <p className="sub">Enter your stats to calculate your BMI score</p>

          <div className="seg-row">
            <div className="field">
              <input type="number" placeholder=" " value={weight} onChange={e => setWeight(e.target.value)} />
              <label>Weight</label>
              <span className="unit">kg</span>
            </div>
            <div className="field">
              <input type="number" placeholder=" " value={height} onChange={e => setHeight(e.target.value)} />
              <label>Height</label>
              <span className="unit">cm</span>
            </div>
          </div>

          <button className="btn" onClick={calculate}>Calculate BMI →</button>

          {revealed && cat && (
            <div className="result" key={bmi}>
              {/* SVG Gauge */}
              <div className="gauge-wrap">
                <svg width="200" height="120" viewBox="0 0 200 120">
                  {/* Track arcs colored */}
                  <path d={arcPath(CX,CY,R,-135,-45)} fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" opacity="0.25"/>
                  <path d={arcPath(CX,CY,R,-45,45)}  fill="none" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.25"/>
                  <path d={arcPath(CX,CY,R,45,90)}   fill="none" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" opacity="0.25"/>
                  <path d={arcPath(CX,CY,R,90,135)}  fill="none" stroke="#f87171" strokeWidth="8" strokeLinecap="round" opacity="0.25"/>
                  {/* Active arc (just glow the active segment brighter) */}
                  {bmi < 18.5 && <path d={arcPath(CX,CY,R,-135,-45)} fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round"/>}
                  {bmi >= 18.5 && bmi < 25 && <path d={arcPath(CX,CY,R,-45,45)} fill="none" stroke="#4ade80" strokeWidth="8" strokeLinecap="round"/>}
                  {bmi >= 25 && bmi < 30 && <path d={arcPath(CX,CY,R,45,90)} fill="none" stroke="#fb923c" strokeWidth="8" strokeLinecap="round"/>}
                  {bmi >= 30 && <path d={arcPath(CX,CY,R,90,135)} fill="none" stroke="#f87171" strokeWidth="8" strokeLinecap="round"/>}
                  {/* Needle */}
                  <g className="needle" style={{ transform: `rotate(${needleDeg}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
                    <line x1={CX} y1={CY} x2={CX} y2={CY - R + 10} stroke={cat.color} strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx={CX} cy={CY} r="5" fill={cat.color} />
                  </g>
                  {/* Glow center */}
                  <circle cx={CX} cy={CY} r="5" fill={cat.color} style={{ filter:`drop-shadow(0 0 8px ${cat.glow})` }}/>
                </svg>
              </div>

              <div style={{ display:"flex", alignItems:"baseline", marginBottom:"4px" }}>
                <span className="bmi-num">{displayed.toFixed(1)}</span>
                <span className="bmi-unit">kg/m²</span>
              </div>
              <div className="cat-label" style={{ color: cat.color }}>{cat.label}</div>

              <div className="cats">
                {categories.map(c => (
                  <span
                    key={c.label}
                    className={`cat-pill${c.label === cat.label ? " active" : ""}`}
                    style={{ color: c.color, borderColor: c.color, background: c.label === cat.label ? `${c.glow}` : "transparent" }}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
