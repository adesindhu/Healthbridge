import { useState, useEffect, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Poppins:wght@400;600;700&display=swap";
document.head.appendChild(fontLink);

const SESSIONS = [
  {
    id: 1, name: "Morning Calm", duration: 600, type: "Breathing",
    description: "Start your day with gentle breathwork to lower BP and calm anxiety",
    icon: "🌅", color: "#f59e0b", bg: "#fffbeb",
    steps: ["Breathe in slowly for 4 counts", "Hold gently for 4 counts", "Breathe out fully for 6 counts", "Pause for 2 counts", "Repeat..."],
  },
  {
    id: 2, name: "Pain Relief", duration: 900, type: "Body Scan",
    description: "Gently scan your body to reduce chronic pain and tension",
    icon: "💆", color: "#8b5cf6", bg: "#f5f3ff",
    steps: ["Close your eyes and take 3 deep breaths", "Focus on your feet — release any tension", "Move to your legs... knees... hips", "Scan your lower back — breathe into any pain", "Move to shoulders, neck, and face"],
  },
  {
    id: 3, name: "Sleep Ease", duration: 1200, type: "Guided Relaxation",
    description: "Progressive relaxation to help you fall asleep peacefully",
    icon: "🌙", color: "#3b82f6", bg: "#eff6ff",
    steps: ["Lie down comfortably", "Tense your feet for 5 seconds, then release", "Tense your calves, then release", "Continue up your body slowly", "Let your mind go quiet..."],
  },
  {
    id: 4, name: "Heart Health", duration: 720, type: "Loving Kindness",
    description: "Compassion meditation scientifically linked to lower heart rate",
    icon: "❤️", color: "#ef4444", bg: "#fff1f2",
    steps: ["Place hand on your heart", "Breathe naturally and feel warmth", "Think: 'May I be well and at peace'", "Extend love to your family", "Extend love to everyone around you"],
  },
];

const MOODS = [
  { label: "Anxious", emoji: "😰", color: "#ef4444" },
  { label: "Tired", emoji: "😴", color: "#6b7280" },
  { label: "Calm", emoji: "😌", color: "#3b82f6" },
  { label: "Happy", emoji: "😊", color: "#f59e0b" },
  { label: "Peaceful", emoji: "🕊️", color: "#16a34a" },
];

const pastSessions = [
  { date: "Feb 26", name: "Morning Calm", mins: 10, mood: "😌" },
  { date: "Feb 25", name: "Sleep Ease", mins: 20, mood: "🕊️" },
  { date: "Feb 25", name: "Heart Health", mins: 12, mood: "😊" },
  { date: "Feb 24", name: "Pain Relief", mins: 15, mood: "😌" },
  { date: "Feb 23", name: "Morning Calm", mins: 10, mood: "😴" },
];

function BreathingCircle({ active, phase }) {
  const scale = phase === "inhale" ? 1.35 : phase === "hold" ? 1.35 : 1;
  return (
    <div style={{
      width: 130, height: 130,
      borderRadius: "50%",
      background: active
        ? "radial-gradient(circle, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%)"
        : "radial-gradient(circle, #f3f4f6 0%, #e5e7eb 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      transform: `scale(${scale})`,
      transition: phase === "inhale"
        ? "transform 4s ease-in-out"
        : phase === "exhale"
          ? "transform 6s ease-in-out"
          : "transform 0.1s",
      boxShadow: active ? "0 0 0 20px rgba(147,197,253,0.2), 0 0 0 40px rgba(147,197,253,0.1)" : "none",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28 }}>🧘</div>
        <div style={{ fontSize: 11, color: active ? "#1d4ed8" : "#9ca3af", fontWeight: 600, marginTop: 4 }}>
          {active ? (phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : phase === "exhale" ? "Breathe Out" : "Pause") : "Ready"}
        </div>
      </div>
    </div>
  );
}

export default function MeditationTracker() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [preMood, setPreMood] = useState(null);
  const [postMood, setPostMood] = useState(null);
  const [showComplete, setShowComplete] = useState(false);
  const [history, setHistory] = useState(pastSessions);
  const [activeTab, setActiveTab] = useState("sessions");
  const [totalMins, setTotalMins] = useState(67);
  const [streak, setStreak] = useState(5);

  const timerRef = useRef(null);
  const breathRef = useRef(null);
  const breathCycle = [
    { phase: "inhale", duration: 4000 },
    { phase: "hold", duration: 4000 },
    { phase: "exhale", duration: 6000 },
    { phase: "pause", duration: 2000 },
  ];
  const breathIdx = useRef(0);

  const startBreathCycle = () => {
    const step = () => {
      const current = breathCycle[breathIdx.current % breathCycle.length];
      setBreathPhase(current.phase);
      if (current.phase === "inhale") setBreathCount(c => c + 1);
      breathRef.current = setTimeout(() => {
        breathIdx.current += 1;
        step();
      }, current.duration);
    };
    step();
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (selectedSession && e >= selectedSession.duration) {
            clearInterval(timerRef.current);
            clearTimeout(breathRef.current);
            setIsRunning(false);
            setShowComplete(true);
            return e;
          }
          return e + 1;
        });
      }, 1000);
      startBreathCycle();
    } else {
      clearInterval(timerRef.current);
      clearTimeout(breathRef.current);
    }
    return () => { clearInterval(timerRef.current); clearTimeout(breathRef.current); };
  }, [isRunning]);

  const handleStart = () => {
    if (!selectedSession) return;
    setElapsed(0);
    breathIdx.current = 0;
    setBreathCount(0);
    setShowComplete(false);
    setPostMood(null);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (elapsed > 30) setShowComplete(true);
  };

  const handleSaveSession = () => {
    const mins = Math.max(1, Math.round(elapsed / 60));
    const today = "Feb 27";
    setHistory(prev => [{ date: today, name: selectedSession.name, mins, mood: postMood?.emoji || "😌" }, ...prev]);
    setTotalMins(t => t + mins);
    if (history[0]?.date === today || history[0]?.date === "Feb 26") setStreak(s => s + 1);
    setShowComplete(false);
    setSelectedSession(null);
    setElapsed(0);
    setPreMood(null);
    setPostMood(null);
    setActiveTab("history");
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const progress = selectedSession ? Math.min(elapsed / selectedSession.duration, 1) : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fefce8 0%, #f0f9ff 50%, #fdf4ff 100%)",
      fontFamily: "'Nunito', 'Poppins', sans-serif",
      paddingBottom: 40,
    }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#9ca3af", textTransform: "uppercase" }}>HealthBridge · Elder Care</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "6px 0 2px", letterSpacing: -0.5, fontFamily: "'Poppins', sans-serif" }}>
          Meditation & Mindfulness
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Daily calm for your body and mind</p>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "center" }}>
          {[
            { icon: "🔥", label: "Day Streak", value: streak },
            { icon: "⏱", label: "Total Mins", value: totalMins },
            { icon: "🧠", label: "Sessions", value: history.length },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, maxWidth: 100,
              background: "#fff", borderRadius: 16, padding: "12px 8px", textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
            }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginTop: 2 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#fff", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", margin: "18px 0 0", padding: "0 20px" }}>
        {["sessions", "breathing", "history"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "11px 4px", border: "none", cursor: "pointer", fontSize: 11,
            fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", background: "transparent",
            color: activeTab === tab ? "#7c3aed" : "#9ca3af",
            borderBottom: activeTab === tab ? "2px solid #7c3aed" : "2px solid transparent",
          }}>
            {tab === "sessions" ? "🧘 Sessions" : tab === "breathing" ? "💨 Breathing" : "📅 History"}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {/* SESSIONS TAB */}
        {activeTab === "sessions" && (
          <>
            {/* Active Session */}
            {selectedSession && !showComplete && (
              <div style={{
                background: "#fff", borderRadius: 24,
                boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
                padding: 20, marginBottom: 16, textAlign: "center",
                border: `2px solid ${selectedSession.color}30`,
              }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>
                  {isRunning ? "NOW MEDITATING" : "READY TO BEGIN"}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
                  {selectedSession.icon} {selectedSession.name}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{selectedSession.type}</div>

                {/* Progress Ring */}
                <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
                  <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={60} cy={60} r={52} fill="none" stroke="#f3f4f6" strokeWidth={8} />
                    <circle cx={60} cy={60} r={52} fill="none" stroke={selectedSession.color} strokeWidth={8}
                      strokeDasharray={`${progress * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                      strokeLinecap="round" style={{ transition: "stroke-dasharray 1s linear" }} />
                  </svg>
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%) rotate(90deg)", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{fmtTime(elapsed)}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af" }}>of {fmtTime(selectedSession.duration)}</div>
                  </div>
                </div>

                {/* Current Step */}
                {isRunning && (
                  <div style={{
                    background: selectedSession.bg, border: `1px solid ${selectedSession.color}30`,
                    borderRadius: 12, padding: "8px 14px", marginBottom: 12, fontSize: 12, color: "#374151",
                    fontStyle: "italic",
                  }}>
                    💭 {selectedSession.steps[Math.floor((elapsed / selectedSession.duration) * selectedSession.steps.length) % selectedSession.steps.length]}
                  </div>
                )}

                {!isRunning && !preMood && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>How are you feeling right now?</div>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      {MOODS.map((m, i) => (
                        <button key={i} onClick={() => setPreMood(m)} style={{
                          padding: "6px 10px", borderRadius: 12, border: `1.5px solid ${preMood?.label === m.label ? m.color : "#e5e7eb"}`,
                          background: preMood?.label === m.label ? m.color + "20" : "#f9fafb",
                          cursor: "pointer", fontSize: 12,
                        }}>{m.emoji}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  {!isRunning ? (
                    <button onClick={handleStart} style={{
                      flex: 1, padding: "12px", background: selectedSession.color, color: "#fff",
                      border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer",
                      boxShadow: `0 4px 16px ${selectedSession.color}50`,
                    }}>▶ Begin Session</button>
                  ) : (
                    <button onClick={handleStop} style={{
                      flex: 1, padding: "12px", background: "#f3f4f6", color: "#374151",
                      border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>⏸ End Early</button>
                  )}
                  <button onClick={() => { setSelectedSession(null); setIsRunning(false); setElapsed(0); }} style={{
                    padding: "12px 16px", background: "#f3f4f6", color: "#6b7280",
                    border: "none", borderRadius: 14, fontSize: 13, cursor: "pointer",
                  }}>✕</button>
                </div>
              </div>
            )}

            {/* Session Complete */}
            {showComplete && (
              <div style={{
                background: "#fff", borderRadius: 24, padding: 20, marginBottom: 16,
                boxShadow: "0 8px 40px rgba(0,0,0,0.1)", textAlign: "center",
                border: "2px solid #d1fae5",
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Session Complete!</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                  You meditated for {fmtTime(elapsed)}. Well done!
                </div>
                <div style={{ marginTop: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>How do you feel now?</div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {MOODS.map((m, i) => (
                      <button key={i} onClick={() => setPostMood(m)} style={{
                        padding: "8px 12px", borderRadius: 12, border: `1.5px solid ${postMood?.label === m.label ? m.color : "#e5e7eb"}`,
                        background: postMood?.label === m.label ? m.color + "20" : "#f9fafb",
                        cursor: "pointer", fontSize: 16,
                      }}>{m.emoji}</button>
                    ))}
                  </div>
                </div>
                {preMood && postMood && (
                  <div style={{
                    background: "#f0fdf4", border: "1px solid #d1fae5", borderRadius: 12, padding: "8px 14px",
                    fontSize: 12, color: "#166534", marginBottom: 12,
                  }}>
                    Mood: {preMood.emoji} {preMood.label} → {postMood.emoji} {postMood.label} ✨
                  </div>
                )}
                <button onClick={handleSaveSession} style={{
                  width: "100%", padding: "12px", background: "#16a34a", color: "#fff",
                  border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>Save & Continue</button>
              </div>
            )}

            {/* Session Cards */}
            {!selectedSession && !showComplete && SESSIONS.map(s => (
              <div key={s.id} onClick={() => setSelectedSession(s)} style={{
                background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 10,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: `1.5px solid ${s.color}30`,
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, flexShrink: 0, border: `1.5px solid ${s.color}30`,
                }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{s.type} · {Math.round(s.duration / 60)} min</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, lineHeight: 1.4 }}>{s.description}</div>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: s.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 14, flexShrink: 0,
                }}>▶</div>
              </div>
            ))}
          </>
        )}

        {/* BREATHING TAB */}
        {activeTab === "breathing" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>4-4-6-2 Breathing Exercise</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 24 }}>
              Clinically proven to reduce blood pressure and anxiety in seniors
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <BreathingCircle active={isRunning} phase={breathPhase} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20, textAlign: "left" }}>
              {[
                { label: "Inhale", duration: "4 sec", color: "#3b82f6", icon: "↑" },
                { label: "Hold", duration: "4 sec", color: "#8b5cf6", icon: "⏸" },
                { label: "Exhale", duration: "6 sec", color: "#10b981", icon: "↓" },
                { label: "Pause", duration: "2 sec", color: "#f59e0b", icon: "○" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: breathPhase === s.label.toLowerCase() && isRunning ? s.color + "20" : "#fff",
                  border: `1.5px solid ${breathPhase === s.label.toLowerCase() && isRunning ? s.color : "#f3f4f6"}`,
                  borderRadius: 12, padding: "10px 12px",
                  transition: "all 0.3s",
                }}>
                  <div style={{ fontSize: 16, color: s.color }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.duration}</div>
                </div>
              ))}
            </div>

            {isRunning && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                  {breathPhase.charAt(0).toUpperCase() + breathPhase.slice(1)}...
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Breath cycle #{breathCount}</div>
              </div>
            )}

            <button onClick={() => { setIsRunning(r => !r); if (!isRunning) { breathIdx.current = 0; setBreathCount(0); } }} style={{
              width: "100%", maxWidth: 280, padding: "14px", fontSize: 15, fontWeight: 700,
              background: isRunning ? "#f3f4f6" : "linear-gradient(135deg, #60a5fa, #3b82f6)",
              color: isRunning ? "#374151" : "#fff", border: "none", borderRadius: 16,
              cursor: "pointer", boxShadow: isRunning ? "none" : "0 4px 20px rgba(59,130,246,0.4)",
            }}>
              {isRunning ? "⏸ Pause Exercise" : "▶ Start Breathing"}
            </button>

            <div style={{ background: "#fff", borderRadius: 16, padding: 14, marginTop: 20, border: "1px solid #e5e7eb", textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>🫁 Benefits for Seniors</div>
              {[
                "Reduces systolic BP by 3–5 mmHg when practiced daily",
                "Activates the parasympathetic (rest & digest) nervous system",
                "Safe for people with heart conditions — no strain involved",
                "Helps with anxiety, insomnia, and post-meal glucose spikes",
              ].map((t, i) => (
                <div key={i} style={{ fontSize: 11, color: "#6b7280", marginBottom: 5, paddingLeft: 10, borderLeft: "2px solid #3b82f6" }}>{t}</div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Past Sessions</div>
            {history.map((s, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 8,
                boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ fontSize: 24 }}>{s.mood}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.date} · {s.mins} minutes</div>
                </div>
                <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ Done</div>
              </div>
            ))}
            <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: 14, marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>🎯 Weekly Goal</div>
              <div style={{ background: "#f3f4f6", borderRadius: 8, height: 10, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${Math.min((totalMins / 150) * 100, 100)}%`,
                  background: "linear-gradient(90deg, #f59e0b, #d97706)", borderRadius: 8,
                  transition: "width 1s ease",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#92400e", marginTop: 6 }}>
                {totalMins}/150 minutes this week {totalMins >= 150 ? "🎉 Goal reached!" : `— ${150 - totalMins} mins to go!`}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
