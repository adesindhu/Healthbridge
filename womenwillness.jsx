import { useState, useEffect } from "react";

const affirmations = [
  "You are worthy of rest and peace.",
  "Your feelings are valid and real.",
  "Healing is not linear — and that's okay.",
  "You are more resilient than you know.",
  "Taking care of yourself is an act of courage.",
  "You deserve gentleness, especially from yourself.",
  "Your journey is uniquely, beautifully yours.",
];

const resources = [
  { title: "Crisis Support", desc: "988 Suicide & Crisis Lifeline", action: "Call or text 988", color: "bg-rose-100 border-rose-300", icon: "🌿" },
  { title: "Therapy Connect", desc: "Find a therapist who gets you", action: "Psychology Today Directory", color: "bg-amber-100 border-amber-300", icon: "💛" },
  { title: "Community", desc: "You're not alone in this", action: "r/mentalhealth community", color: "bg-teal-100 border-teal-300", icon: "🌸" },
  { title: "Self-Compassion", desc: "Free guided meditations", action: "self-compassion.org", color: "bg-violet-100 border-violet-300", icon: "✨" },
];

const moodOptions = [
  { emoji: "🌤️", label: "Okay", val: 3 },
  { emoji: "⛅", label: "Low", val: 2 },
  { emoji: "🌧️", label: "Struggling", val: 1 },
  { emoji: "☀️", label: "Good", val: 4 },
  { emoji: "🌈", label: "Great", val: 5 },
];

const breathSteps = ["Breathe in...", "Hold...", "Breathe out...", "Hold..."];
const breathDurations = [4000, 4000, 6000, 2000];

export default function WomensWellness() {
  const [affIdx, setAffIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [mood, setMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);
  const [breathActive, setBreathActive] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [checklist, setChecklist] = useState({
    water: false, move: false, sleep: false, connect: false, boundary: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setAffIdx((i) => (i + 1) % affirmations.length);
        setFade(true);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!breathActive) return;
    let step = 0;
    setBreathStep(0);
    const run = () => {
      step = (step + 1) % 4;
      setBreathStep(step);
    };
    const ids = [];
    let cumulative = 0;
    for (let i = 0; i < 12; i++) {
      cumulative += breathDurations[i % 4];
      ids.push(setTimeout(run, cumulative));
    }
    const stop = setTimeout(() => setBreathActive(false), cumulative + 500);
    return () => { ids.forEach(clearTimeout); clearTimeout(stop); };
  }, [breathActive]);

  const saveJournal = () => {
    if (!journalText.trim()) return;
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 3000);
  };

  const toggleCheck = (key) => setChecklist((c) => ({ ...c, [key]: !c[key] }));

  const checkItems = [
    { key: "water", label: "Drank enough water today" },
    { key: "move", label: "Moved my body, even a little" },
    { key: "sleep", label: "Rested or prioritized sleep" },
    { key: "connect", label: "Connected with someone I trust" },
    { key: "boundary", label: "Honored a personal boundary" },
  ];

  const done = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#fdf6f0] font-serif" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-amber-200 rounded-full opacity-25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-teal-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-14">

        {/* Header */}
        <header className="text-center mb-14">
          <p className="text-rose-400 tracking-widest text-xs uppercase mb-3 font-sans">A gentle space for you</p>
          <h1 className="text-5xl text-stone-800 leading-tight mb-4" style={{ fontFamily: "'Georgia', serif" }}>
            Women's <em className="text-rose-500 not-italic">Wellness</em>
          </h1>
          <p className="text-stone-500 text-lg max-w-md mx-auto leading-relaxed">
            A quiet corner to breathe, reflect, and tend to the most important person — you.
          </p>
          <div className="mt-6 w-16 h-px bg-rose-300 mx-auto" />
        </header>

        {/* Affirmation */}
        <section className="mb-10 bg-white rounded-3xl shadow-sm border border-rose-100 p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-rose-300 font-sans mb-4">Today's Affirmation</p>
          <p
            className="text-2xl text-stone-700 leading-relaxed italic transition-opacity duration-500"
            style={{ opacity: fade ? 1 : 0 }}
          >
            "{affirmations[affIdx]}"
          </p>
          <button
            onClick={() => { setFade(false); setTimeout(() => { setAffIdx((i) => (i + 1) % affirmations.length); setFade(true); }, 300); }}
            className="mt-5 text-xs text-rose-400 hover:text-rose-600 font-sans tracking-wider uppercase transition-colors"
          >
            Next affirmation →
          </button>
        </section>

        {/* Mood Check-in */}
        <section className="mb-10 bg-white rounded-3xl shadow-sm border border-amber-100 p-8">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-sans mb-2">Mood Check-in</p>
          <h2 className="text-xl text-stone-700 mb-5">How are you feeling right now?</h2>
          <div className="flex gap-3 flex-wrap">
            {moodOptions.map((m) => (
              <button
                key={m.val}
                onClick={() => setMood(m.val)}
                className={`flex flex-col items-center px-5 py-3 rounded-2xl border-2 transition-all text-sm font-sans ${
                  mood === m.val
                    ? "border-amber-400 bg-amber-50 scale-105 shadow"
                    : "border-stone-200 bg-stone-50 hover:border-amber-300"
                }`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-stone-600">{m.label}</span>
              </button>
            ))}
          </div>
          {mood && (
            <p className="mt-5 text-stone-500 italic text-sm">
              {mood <= 2
                ? "Thank you for being honest. It's okay to not be okay. You're not alone. 🌿"
                : mood === 3
                ? "Okay is enough. You showed up today. That matters. 💛"
                : "That warmth you're feeling? You deserve it every day. 🌸"}
            </p>
          )}
        </section>

        {/* Breathing Exercise */}
        <section className="mb-10 bg-white rounded-3xl shadow-sm border border-teal-100 p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-teal-400 font-sans mb-2">Breathwork</p>
          <h2 className="text-xl text-stone-700 mb-2">Box Breathing</h2>
          <p className="text-stone-400 text-sm font-sans mb-6">4-4-6-2 pattern to calm your nervous system</p>

          {breathActive ? (
            <div className="flex flex-col items-center gap-6">
              <div
                className="w-28 h-28 rounded-full border-4 border-teal-300 flex items-center justify-center text-teal-600 text-lg font-sans transition-all duration-1000"
                style={{
                  transform: breathStep === 0 ? "scale(1.3)" : breathStep === 2 ? "scale(0.85)" : "scale(1.1)",
                  background: breathStep % 2 === 0 ? "#e6fffa" : "#f0fdfa",
                }}
              >
                {breathSteps[breathStep]}
              </div>
              <button onClick={() => setBreathActive(false)} className="text-xs text-stone-400 hover:text-stone-600 font-sans">Stop</button>
            </div>
          ) : (
            <button
              onClick={() => setBreathActive(true)}
              className="bg-teal-400 hover:bg-teal-500 text-white px-8 py-3 rounded-full font-sans text-sm tracking-wide transition-colors shadow-sm"
            >
              Start Breathing Exercise
            </button>
          )}
        </section>

        {/* Self-care Checklist */}
        <section className="mb-10 bg-white rounded-3xl shadow-sm border border-violet-100 p-8">
          <p className="text-xs uppercase tracking-widest text-violet-400 font-sans mb-2">Daily Self-Care</p>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl text-stone-700">Small acts of love</h2>
            <span className="text-xs font-sans bg-violet-100 text-violet-500 px-3 py-1 rounded-full">{done}/5 done</span>
          </div>
          <div className="space-y-3">
            {checkItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleCheck(key)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all font-sans text-sm text-left ${
                  checklist[key]
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:border-violet-200"
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
                  checklist[key] ? "border-violet-400 bg-violet-400 text-white" : "border-stone-300"
                }`}>
                  {checklist[key] && "✓"}
                </span>
                {label}
              </button>
            ))}
          </div>
          {done === 5 && (
            <p className="mt-4 text-center text-violet-500 italic text-sm">You've shown up for yourself today. That's beautiful. ✨</p>
          )}
        </section>

        {/* Journal */}
        <section className="mb-10 bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-sans mb-2">Gentle Journal</p>
          <h2 className="text-xl text-stone-700 mb-1">What's on your heart?</h2>
          <p className="text-stone-400 text-sm font-sans mb-5">No pressure. Just let it out. ✍️</p>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Today I feel... I'm grateful for... I need to let go of..."
            rows={5}
            className="w-full border border-stone-200 rounded-2xl p-4 text-stone-700 text-sm font-sans resize-none focus:outline-none focus:border-rose-300 bg-stone-50 leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-stone-400 font-sans">{journalText.length} characters</span>
            <button
              onClick={saveJournal}
              className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 rounded-full font-sans text-sm transition-colors"
            >
              {journalSaved ? "Saved 🌸" : "Save Entry"}
            </button>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-sans mb-2 text-center">Support</p>
          <h2 className="text-xl text-stone-700 mb-6 text-center">You don't have to do this alone</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((r) => (
              <div key={r.title} className={`rounded-2xl border p-5 ${r.color}`}>
                <div className="text-2xl mb-2">{r.icon}</div>
                <h3 className="font-semibold text-stone-700 font-sans text-sm">{r.title}</h3>
                <p className="text-stone-500 text-sm font-sans mt-1">{r.desc}</p>
                <p className="text-stone-600 text-xs font-sans mt-3 font-medium">{r.action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-stone-400 text-xs font-sans pt-4 border-t border-stone-200">
          <p>You matter. Your wellbeing matters. Take it one breath at a time. 🌿</p>
        </footer>
      </div>
    </div>
  );
}
