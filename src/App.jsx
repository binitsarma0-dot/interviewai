import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0A0A0F",
  surface: "#12121A",
  card: "#1A1A26",
  border: "#2A2A3E",
  accent: "#6C63FF",
  accentLight: "#8B85FF",
  gold: "#F5A623",
  success: "#00D4A1",
  danger: "#FF4D6D",
  text: "#F0EFF8",
  muted: "#8A899E",
};

const INDUSTRIES = ["Software Engineering", "Product Management", "Marketing", "Finance", "Design", "Sales", "Data Science"];

const QUESTIONS_DB = {
  "Software Engineering": [
    "Explain the difference between REST and GraphQL APIs.",
    "How would you design a URL shortener system?",
    "What is the difference between process and thread?",
    "Explain Big O notation with an example.",
    "How do you handle race conditions in concurrent programming?",
  ],
  "Product Management": [
    "How would you prioritize features for a new product?",
    "Tell me about a time you handled a difficult stakeholder.",
    "How do you measure the success of a product launch?",
    "Describe your process for writing a PRD.",
    "How would you improve our onboarding flow?",
  ],
  "Marketing": [
    "How would you launch a product with zero budget?",
    "Explain your process for building a content strategy.",
    "How do you measure ROI on a marketing campaign?",
    "Tell me about a successful campaign you led.",
    "How do you approach SEO for a new website?",
  ],
  "Finance": [
    "Walk me through a DCF model.",
    "What is EBITDA and why is it important?",
    "How would you value a startup with no revenue?",
    "Explain the difference between NPV and IRR.",
    "How do you assess credit risk?",
  ],
  "Design": [
    "Walk me through your design process.",
    "How do you handle conflicting feedback from stakeholders?",
    "What's the difference between UX and UI?",
    "How do you conduct user research?",
    "Tell me about a design decision you had to defend.",
  ],
};

const MOCK_HISTORY = [
  {
    id: 1, date: "Mar 5, 2026", role: "Software Engineer", score: 82, questions: 3,
    detail: [
      {
        q: "Explain the difference between REST and GraphQL APIs.",
        ans: "REST uses fixed endpoints for each resource, while GraphQL uses a single endpoint and lets clients request exactly the data they need. REST can lead to over-fetching or under-fetching, whereas GraphQL solves that by allowing flexible queries.",
        score: 88,
        feedback: "Good comparison! Add real-world use cases next time."
      },
      {
        q: "How would you design a URL shortener system?",
        ans: "I would use a hash function to generate a short key, store the mapping in a database like Redis for fast lookups, and handle redirects via HTTP 301. For scale, I'd add a load balancer and cache layer.",
        score: 80,
        feedback: "Solid answer. Mention collision handling and analytics tracking."
      },
      {
        q: "What is the difference between process and thread?",
        ans: "A process is an independent program in execution with its own memory space. A thread is a smaller unit within a process that shares memory. Threads are lighter and faster to create but need synchronization.",
        score: 78,
        feedback: "Clear explanation. Add examples like multi-tab browser vs web workers."
      },
    ]
  },
  {
    id: 2, date: "Mar 3, 2026", role: "Product Manager", score: 74, questions: 3,
    detail: [
      {
        q: "How would you prioritize features for a new product?",
        ans: "I use frameworks like RICE or MoSCoW to prioritize. I look at impact, reach, confidence, and effort. I also align features with business goals and user pain points from research.",
        score: 76,
        feedback: "Good framework knowledge. Give a concrete example with actual numbers."
      },
      {
        q: "Tell me about a time you handled a difficult stakeholder.",
        ans: "Once a stakeholder kept changing requirements. I scheduled a dedicated alignment meeting, documented all decisions, and set a change-freeze deadline. That helped us ship on time.",
        score: 74,
        feedback: "Nice use of STAR method. Quantify the outcome — e.g., shipped 2 weeks early."
      },
      {
        q: "How do you measure the success of a product launch?",
        ans: "I track KPIs like DAU, retention rate, NPS, and revenue impact. I also look at qualitative feedback from users in the first 2 weeks post-launch.",
        score: 72,
        feedback: "Solid metrics listed. Tie each metric to a specific launch goal."
      },
    ]
  },
  {
    id: 3, date: "Feb 28, 2026", role: "Data Science", score: 91, questions: 3,
    detail: [
      {
        q: "What is overfitting and how do you prevent it?",
        ans: "Overfitting is when a model learns noise in training data and performs poorly on new data. I prevent it using regularization (L1/L2), dropout, cross-validation, and early stopping.",
        score: 94,
        feedback: "Excellent! You covered all major techniques with clarity."
      },
      {
        q: "Explain the bias-variance tradeoff.",
        ans: "Bias is error from wrong assumptions; variance is error from sensitivity to training data. High bias = underfitting, high variance = overfitting. We tune model complexity to balance both.",
        score: 91,
        feedback: "Perfect explanation. Adding a visual analogy would make it memorable."
      },
      {
        q: "How would you handle missing data in a dataset?",
        ans: "Depending on the pattern — MCAR, MAR, or MNAR — I'd use mean/median imputation, KNN imputation, or model-based methods. I also check if missingness itself is informative.",
        score: 88,
        feedback: "Very thorough. Mentioning domain context would strengthen the answer."
      },
    ]
  },
];

// ─── Icons ───────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    mic: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5"/><polyline points="3 3 3 11 11 11"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeoff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 011.44-4.66z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-1.44-4.66z"/></svg>,
  };
  return icons[name] || null;
};

// ─── AI Feedback Generator ────────────────────────────────────
async function getAIFeedback(question, answer) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are an expert interview coach. The candidate was asked:
"${question}"

Their answer was:
"${answer}"

Give feedback in this exact JSON format (no markdown, no backticks):
{
  "score": <number 1-100>,
  "strengths": ["<point1>", "<point2>"],
  "improvements": ["<point1>", "<point2>"],
  "betterAnswer": "<a concise improved version in 2-3 sentences>",
  "tip": "<one quick actionable tip>"
}`
        }]
      })
    });
    const data = await res.json();
    const text = data.content[0].text;
    return JSON.parse(text);
  } catch {
    return {
      score: 72,
      strengths: ["Good structure in your answer", "Showed relevant experience"],
      improvements: ["Add more specific metrics/numbers", "Use the STAR method more clearly"],
      betterAnswer: "I would structure the answer using the STAR method, clearly stating the Situation, Task, Action, and measurable Result to make the response more compelling.",
      tip: "Always quantify your achievements with numbers — it makes your answer 3x more memorable."
    };
  }
}

// ─── Auth Screen ──────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("signin");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const name = form.name.trim();

    // Validation
    if (!email || !password) { setError("Please fill in all fields!"); return; }
    if (!email.includes("@") || !email.includes(".")) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (mode === "signup" && !name) { setError("Please enter your full name!"); return; }

    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Save account to storage so they can sign in later
        const accountKey = `account:${email}`;
        let existing = null;
        try { const r = await window.storage.get(accountKey); existing = r; } catch {}
        if (existing) { setError("An account with this email already exists. Please sign in."); setLoading(false); return; }
        try { await window.storage.set(accountKey, JSON.stringify({ name, password })); } catch {}
        await onLogin({ name, email });
      } else {
        // Sign in — verify credentials
        let accountData = null;
        try {
          const r = await window.storage.get(`account:${email}`);
          if (r) accountData = JSON.parse(r.value);
        } catch {}

        if (!accountData) {
          // No account found — auto-create (graceful for demo)
          try { await window.storage.set(`account:${email}`, JSON.stringify({ name: email.split("@")[0], password })); } catch {}
          await onLogin({ name: email.split("@")[0], email });
        } else if (accountData.password !== password) {
          setError("Incorrect password. Please try again.");
          setLoading(false);
          return;
        } else {
          await onLogin({ name: accountData.name, email });
        }
      }
    } catch (e) {
      // Even if storage fails completely, log user in
      await onLogin({ name: name || email.split("@")[0], email });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      input::placeholder { color: ${COLORS.muted}; }
      input:focus { outline: none; border-color: ${COLORS.accent} !important; }
      .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      .btn-primary:active { transform: translateY(0); }
      `}</style>

      {/* Logo */}
      <div style={{ marginBottom: "36px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Icon name="brain" size={28} color="#fff" />
        </div>
        <h1 style={{ color: COLORS.text, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>InterviewAI</h1>
        <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Land your dream job — practice makes perfect</p>
      </div>

      {/* Card */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 400 }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: COLORS.surface, borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["signin", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                background: mode === m ? COLORS.accent : "transparent",
                color: mode === m ? "#fff" : COLORS.muted }}>
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: "0.5px" }}>FULL NAME</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                style={{ width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", color: COLORS.text, fontSize: 14, fontFamily: "'Sora', sans-serif", transition: "border-color 0.2s" }} />
            </div>
          )}
          <div>
            <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: "0.5px" }}>EMAIL</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="john@email.com"
              style={{ width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", color: COLORS.text, fontSize: 14, fontFamily: "'Sora', sans-serif", transition: "border-color 0.2s" }} />
          </div>
          <div>
            <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: "0.5px" }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" type={showPass ? "text" : "password"}
                style={{ width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 40px 12px 14px", color: COLORS.text, fontSize: 14, fontFamily: "'Sora', sans-serif", transition: "border-color 0.2s" }} />
              <button onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: COLORS.muted }}>
                <Icon name={showPass ? "eyeoff" : "eye"} size={16} />
              </button>
            </div>
          </div>

          {error && <p style={{ color: COLORS.danger, fontSize: 12, textAlign: "center" }}>{error}</p>}

          <button className="btn-primary" onClick={handleSubmit}
            style={{ background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", marginTop: 6, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : null}
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>

      <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 20, textAlign: "center" }}>
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
        <span onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={{ color: COLORS.accentLight, cursor: "pointer", fontWeight: 600 }}>
          {mode === "signin" ? "Sign Up" : "Sign In"}
        </span>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Interview Detail Modal ───────────────────────────────────
function InterviewDetailModal({ interview, onClose }) {
  if (!interview) return null;
  const avg = interview.score;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />

      {/* Sheet */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COLORS.surface, borderRadius: "24px 24px 0 0", border: `1px solid ${COLORS.border}`, maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "slideUp 0.3s ease" }}>

        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border }} />
        </div>

        {/* Header */}
        <div style={{ padding: "12px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <h3 style={{ color: COLORS.text, fontSize: 18, fontWeight: 800, marginBottom: 3 }}>{interview.role}</h3>
            <p style={{ color: COLORS.muted, fontSize: 12 }}>{interview.date} · {interview.detail.length} questions</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: avg >= 80 ? COLORS.success : avg >= 60 ? COLORS.gold : COLORS.danger }}>{avg}%</span>
            </div>
            <button onClick={onClose} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="close" size={16} color={COLORS.muted} />
            </button>
          </div>
        </div>

        {/* Q&A List */}
        <div style={{ overflowY: "auto", padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
          {interview.detail.map((item, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: "hidden" }}>

              {/* Question header */}
              <div style={{ padding: "12px 14px 10px", background: `${COLORS.accent}10`, borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>Q{i + 1}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: item.score >= 80 ? COLORS.success : item.score >= 60 ? COLORS.gold : COLORS.danger }}>{item.score}/100</span>
                </div>
                <p style={{ color: COLORS.text, fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{item.q}</p>
              </div>

              {/* Answer */}
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
                <p style={{ color: COLORS.muted, fontSize: 10, fontWeight: 700, marginBottom: 6, letterSpacing: "0.5px" }}>YOUR ANSWER</p>
                <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{item.ans}</p>
              </div>

              {/* Feedback */}
              <div style={{ padding: "10px 14px", background: `${COLORS.gold}08` }}>
                <p style={{ color: COLORS.gold, fontSize: 10, fontWeight: 700, marginBottom: 5, letterSpacing: "0.5px" }}>💡 FEEDBACK</p>
                <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.5 }}>{item.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────
function Dashboard({ user, interviewHistory, onStartInterview }) {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const isNew = interviewHistory.length === 0;
  const totalQ = interviewHistory.reduce((s, h) => s + h.detail.length, 0);
  const avgScore = isNew ? 0 : Math.round(interviewHistory.reduce((s, h) => s + h.score, 0) / interviewHistory.length);
  const stats = [
    { label: "Interviews", value: isNew ? "0" : interviewHistory.length, color: COLORS.accent },
    { label: "Avg Score", value: isNew ? "—" : avgScore + "%", color: COLORS.success },
    { label: "Questions", value: isNew ? "0" : totalQ, color: COLORS.gold },
    { label: "Streak", value: isNew ? "—" : "1🔥", color: COLORS.danger },
  ];

  return (
    <div style={{ padding: "0 0 16px" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.card})`, borderRadius: 18, padding: "20px", marginBottom: 20, border: `1px solid ${COLORS.accent}33` }}>
        <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 4 }}>Welcome back 👋</p>
        <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{user.name}</h2>
        <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5 }}>Today's goal: <span style={{ color: COLORS.accentLight, fontWeight: 600 }}>Complete 1 mock interview</span></p>
        <div style={{ marginTop: 14, background: COLORS.surface, borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: COLORS.muted, fontSize: 12 }}>Weekly Progress</span>
            <span style={{ color: COLORS.success, fontSize: 12, fontWeight: 600 }}>{Math.min(interviewHistory.length, 5)}/5 completed</span>
          </div>
          <div style={{ background: COLORS.border, borderRadius: 4, height: 6 }}>
            <div style={{ width: `${Math.min(interviewHistory.length / 5, 1) * 100}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${COLORS.success}, ${COLORS.accent})`, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Recent Interviews</h3>

      {isNew ? (
        <div style={{ background: COLORS.card, border: `1px dashed ${COLORS.border}`, borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎤</div>
          <p style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>No interviews yet</p>
          <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>Complete your first mock interview and track your history right here!</p>
          <button onClick={onStartInterview}
            style={{ background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, border: "none", borderRadius: 12, padding: "12px 24px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
            Start Your First Interview →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {interviewHistory.map((h, idx) => (
            <div key={idx} onClick={() => setSelectedInterview(h)} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.background = `${COLORS.accent}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.card; }}>
              <div>
                <p style={{ color: COLORS.text, fontSize: 14, fontWeight: 600 }}>{h.role}</p>
                <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{h.date} · {h.detail.length} questions</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: h.score >= 80 ? COLORS.success : h.score >= 60 ? COLORS.gold : COLORS.danger }}>{h.score}%</div>
                <Icon name="arrow" size={14} color={COLORS.muted} />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInterview && (
        <InterviewDetailModal interview={selectedInterview} onClose={() => setSelectedInterview(null)} />
      )}
    </div>
  );
}

// ─── Extended Question Pool ───────────────────────────────────
const EXTENDED_QUESTIONS = {
  "Software Engineering": [
    "Explain the difference between REST and GraphQL APIs.",
    "How would you design a URL shortener system?",
    "What is the difference between process and thread?",
    "Explain Big O notation with an example.",
    "How do you handle race conditions in concurrent programming?",
    "What is the CAP theorem?",
    "Explain the concept of database indexing.",
    "What is a deadlock and how do you prevent it?",
    "Describe the SOLID principles.",
    "What is the difference between SQL and NoSQL databases?",
    "How does garbage collection work in modern languages?",
    "Explain microservices vs monolithic architecture.",
    "What is Docker and why is it useful?",
    "How does HTTPS work under the hood?",
    "What is the difference between authentication and authorization?",
  ],
  "Product Management": [
    "How would you prioritize features for a new product?",
    "Tell me about a time you handled a difficult stakeholder.",
    "How do you measure the success of a product launch?",
    "Describe your process for writing a PRD.",
    "How would you improve our onboarding flow?",
    "What metrics would you track for a SaaS product?",
    "How do you decide when to kill a feature?",
    "Walk me through a product you admire and why.",
    "How do you handle conflicting feedback from users and stakeholders?",
    "What is your approach to A/B testing?",
    "How would you increase user retention by 20%?",
    "Describe your ideal product development process.",
  ],
  "Marketing": [
    "How would you launch a product with zero budget?",
    "Explain your process for building a content strategy.",
    "How do you measure ROI on a marketing campaign?",
    "Tell me about a successful campaign you led.",
    "How do you approach SEO for a new website?",
    "What is growth hacking and give an example?",
    "How do you build a brand from scratch?",
    "Explain customer segmentation and why it matters.",
    "How do you approach influencer marketing?",
    "What KPIs do you track for email marketing?",
  ],
  "Finance": [
    "Walk me through a DCF model.",
    "What is EBITDA and why is it important?",
    "How would you value a startup with no revenue?",
    "Explain the difference between NPV and IRR.",
    "How do you assess credit risk?",
    "What is working capital and why does it matter?",
    "Explain the concept of leverage in finance.",
    "What is the difference between equity and debt financing?",
    "How do you interpret a cash flow statement?",
    "What is a leveraged buyout?",
  ],
  "Design": [
    "Walk me through your design process.",
    "How do you handle conflicting feedback from stakeholders?",
    "What is the difference between UX and UI?",
    "How do you conduct user research?",
    "Tell me about a design decision you had to defend.",
    "How do you design for accessibility?",
    "What is a design system and why is it important?",
    "How do you measure the success of a design?",
    "Describe your approach to information architecture.",
    "How do you prioritize usability vs aesthetics?",
  ],
  "Data Science": [
    "What is overfitting and how do you prevent it?",
    "Explain the bias-variance tradeoff.",
    "How would you handle missing data in a dataset?",
    "What is the difference between supervised and unsupervised learning?",
    "Explain gradient descent in simple terms.",
    "What is cross-validation and why do you use it?",
    "How do you evaluate a classification model?",
    "What is feature engineering?",
    "Explain the difference between precision and recall.",
    "How would you detect and handle outliers?",
  ],
  "Sales": [
    "How do you handle objections from a potential client?",
    "Walk me through your sales process.",
    "How do you qualify a lead?",
    "Tell me about your biggest sales win.",
    "How do you manage your pipeline?",
    "What is your approach to cold outreach?",
    "How do you build rapport with prospects?",
    "How do you handle rejection in sales?",
  ],
};


// ═══════════════════════════════════════════════════════════════
//  QUESTION BANK  (~100 open-ended + 15-20 MCQ per topic)
//  Mastery in module-level variable (persists whole browser session)
//  AI generates more questions live
// ═══════════════════════════════════════════════════════════════

const OPEN_QUESTIONS = {
"Software Engineering": [
"Explain the difference between REST and GraphQL APIs.",
"How would you design a URL shortener system?",
"What is the difference between process and thread?",
"Explain Big O notation with an example.",
"How do you handle race conditions in concurrent programming?",
"What is the CAP theorem?",
"Explain the concept of database indexing.",
"What is a deadlock and how do you prevent it?",
"Describe the SOLID principles.",
"What is the difference between SQL and NoSQL databases?",
"How does garbage collection work in modern languages?",
"Explain microservices vs monolithic architecture.",
"What is Docker and why is it useful?",
"How does HTTPS work under the hood?",
"What is the difference between authentication and authorization?",
"Explain the concept of eventual consistency.",
"What is a load balancer and when would you use one?",
"Describe the Observer design pattern with an example.",
"What is memoization and when should you use it?",
"Explain the difference between TCP and UDP.",
"What is a hash table and how does it handle collisions?",
"Describe how a browser renders a web page.",
"What is the difference between stack and heap memory?",
"Explain what CORS is and how to handle it.",
"What is a CDN and why is it used?",
"Describe the MVC architecture pattern.",
"What is idempotency in APIs?",
"How does a relational database handle transactions using ACID?",
"What is the difference between horizontal and vertical scaling?",
"Explain pub/sub messaging pattern.",
"What is dependency injection?",
"How would you handle versioning in a REST API?",
"What is the difference between eager and lazy loading?",
"Explain the concept of connection pooling.",
"What is a cache eviction policy?",
"Describe the singleton design pattern and its drawbacks.",
"What is a webhook vs polling?",
"Explain optimistic vs pessimistic locking.",
"What is a binary search tree?",
"Describe Dijkstra's algorithm.",
"What is a distributed system and its challenges?",
"How does OAuth 2.0 work?",
"What is a reverse proxy?",
"What is an event loop in Node.js?",
"Describe differences between cookies, localStorage, and sessionStorage.",
"What is a service mesh?",
"How does React's virtual DOM work?",
"What is tail recursion optimization?",
"Explain the circuit breaker pattern.",
"What is the difference between a mutex and a semaphore?",
"Explain sharding in databases.",
"What is a message queue and when would you use it?",
"What is a bloom filter?",
"Explain the two-phase commit protocol.",
"What is a B-tree index?",
"Explain the difference between synchronous and asynchronous programming.",
"How do you design a rate limiter?",
"What is the difference between a library and a framework?",
"Describe the proxy design pattern.",
"Explain the concept of a memory leak.",
"What is the difference between unit, integration, and end-to-end tests?",
"How would you design a notification system?",
"What is a saga pattern in microservices?",
"How do you implement pagination in a REST API?",
"Explain data denormalization.",
"What is an inverted index?",
"How does a distributed cache work?",
"What is feature flagging?",
"How would you design a real-time chat system?",
"What is the difference between row-level and table-level locking?",
"What is CQRS and when would you use it?",
"Explain backpressure in streaming systems.",
"How do you approach database migration in live production?",
"Explain write-ahead logging (WAL).",
"What is blue-green deployment?",
"What is the strangler fig pattern?",
"How would you design a leaderboard system?",
"What is the difference between a virtual machine and a container?",
"How do you approach API security?",
"Explain event sourcing.",
"How do you approach zero-downtime deployment?",
"What is the difference between stateful and stateless services?",
"What is chaos engineering?",
"Explain the concept of a sidecar pattern.",
"What is immutable infrastructure?",
"How would you implement a distributed lock?",
"What is the difference between a data lake and a data warehouse?",
"Explain the concept of an API gateway.",
"What is the CAP theorem and how does it affect database design?",
"How would you design a global content delivery system?",
"Explain the fan-out pattern in distributed systems.",
"What is the difference between strong and eventual consistency?",
"How do you approach observability in microservices?",
"What is a dead letter queue?",
"Explain the concept of idempotency keys.",
"How would you design a search autocomplete system?",
"What is the difference between push and pull-based architectures?",
"How do you handle partial failures in distributed transactions?",
"What is the role of consensus algorithms like Raft in distributed systems?",
],
"Product Management": [
"How would you prioritize features for a new product?",
"Tell me about a time you handled a difficult stakeholder.",
"How do you measure the success of a product launch?",
"Describe your process for writing a PRD.",
"How would you improve our onboarding flow?",
"What metrics would you track for a SaaS product?",
"How do you decide when to kill a feature?",
"Walk me through a product you admire and why.",
"How do you handle conflicting feedback from users and stakeholders?",
"What is your approach to A/B testing?",
"How would you increase user retention by 20%?",
"Describe your ideal product development process.",
"How do you define and validate product-market fit?",
"What is your approach to roadmap planning?",
"How do you work with engineering teams to estimate timelines?",
"Describe a time you had to say no to a feature request.",
"How do you gather and synthesize user research?",
"What is your approach to competitive analysis?",
"How do you handle a product that is failing in the market?",
"Describe your experience with OKRs.",
"How would you launch a product in a new market?",
"What is your process for writing user stories?",
"How do you balance short-term wins with long-term strategy?",
"Describe how you would set pricing for a new product.",
"How do you manage technical debt as a PM?",
"What is the difference between KPIs and OKRs?",
"How do you create alignment across cross-functional teams?",
"Describe a product failure and what you learned from it.",
"How would you improve Instagram's discovery feature?",
"What frameworks do you use for competitive positioning?",
"How do you evaluate build vs buy decisions?",
"How do you identify your riskiest product assumption?",
"What does a good product spec include?",
"How do you create a go-to-market strategy?",
"How would you design a product for senior citizens?",
"What is the lean startup methodology?",
"Describe how you would reduce churn for a subscription product.",
"How do you use data analytics in product decisions?",
"What is jobs-to-be-done theory?",
"How do you handle scope creep during development?",
"Describe how you prioritize bugs vs features.",
"How would you design an API product?",
"Describe your process for product discovery.",
"How do you measure NPS and act on it?",
"What is a product hypothesis and how do you test it?",
"Describe the concept of a product moat.",
"How do you handle a situation where data and intuition conflict?",
"What is the role of a PM in agile sprints?",
"How would you approach building a marketplace product?",
"What is the difference between B2B and B2C product strategy?",
"How do you approach internationalization of a product?",
"Describe your approach to feature deprecation.",
"What is a product vision and how do you articulate it?",
"What is the difference between customer success and customer support?",
"How do you build a business case for a new product investment?",
"What is the role of design thinking in product management?",
"Describe how you would handle a major bug post-launch.",
"What is dual-track agile?",
"How do you approach pricing experimentation?",
"How do you handle a highly vocal minority of users?",
"What is the role of empathy in product management?",
"How do you approach building trust with engineering teams?",
"What is a product scorecard?",
"Describe how you would validate a new product idea in 2 weeks.",
"What is the flywheel concept in product strategy?",
"How do you approach building a freemium model?",
"Describe how you would improve Spotify's recommendation feature.",
"What is a customer journey map?",
"How do you approach building for network effects?",
"Describe your process for quarterly planning.",
"What is the difference between a product manager and a product owner?",
"What is the Kano model and how do you use it?",
"How do you define your ideal customer profile?",
"Describe how you would improve Google Maps.",
"How do you run an effective product review meeting?",
"What is continuous discovery?",
"How do you approach building a product community?",
"What is Opportunity Solution Tree?",
"What is the difference between output and outcome metrics?",
"How do you approach building a product for enterprise clients?",
"How do you handle product decisions under uncertainty?",
"Describe how you would redesign the Uber driver experience.",
"What is the role of a PM in fundraising conversations?",
"How do you approach product strategy for a platform vs application?",
"How do you approach defining success metrics for a new feature?",
"What is the role of rapid prototyping in product development?",
"How do you approach competitive intelligence?",
"What is a jobs-to-be-done interview?",
"Describe your approach to building a product analytics infrastructure.",
"How do you approach user segmentation for personalization?",
"What is the role of behavioral economics in product design?",
"How do you approach building a viral loop in a product?",
"What is the concept of a minimal loveable product?",
"How do you approach designing for habit formation?",
"What is the North Star framework and how do you use it?",
"How do you approach cross-team prioritization at scale?",
"Describe how you would build a product for an emerging market.",
"What is the role of customer advisory boards in product development?",
"How do you approach building a developer platform?",
],
"Marketing": [
"How would you launch a product with zero budget?",
"Explain your process for building a content strategy.",
"How do you measure ROI on a marketing campaign?",
"Tell me about a successful campaign you led.",
"How do you approach SEO for a new website?",
"What is growth hacking and give an example?",
"How do you build a brand from scratch?",
"Explain customer segmentation and why it matters.",
"How do you approach influencer marketing?",
"What KPIs do you track for email marketing?",
"How do you create a go-to-market strategy?",
"Describe your approach to paid vs organic growth.",
"How would you market a product to Gen Z?",
"What is conversion rate optimization?",
"How do you build and manage a marketing funnel?",
"Describe your experience with marketing automation.",
"What is a buyer persona and how do you create one?",
"How do you approach multi-channel marketing?",
"What is your process for writing compelling copy?",
"How would you grow a B2B SaaS from 0 to 1000 customers?",
"What is account-based marketing?",
"Describe the AIDA model.",
"How do you measure brand awareness?",
"What is your approach to social media strategy?",
"How do you approach affiliate marketing?",
"What is customer lifetime value?",
"Describe a viral marketing campaign and why it worked.",
"How do you approach product positioning?",
"What is demand generation vs lead generation?",
"How do you use data analytics in marketing decisions?",
"What is a marketing qualified lead?",
"How do you build a newsletter audience from scratch?",
"What is programmatic advertising?",
"How do you approach retargeting campaigns?",
"What is the difference between push and pull marketing?",
"How do you create a successful referral program?",
"What is community-led growth?",
"How do you measure the success of a PR campaign?",
"What is co-marketing?",
"How do you approach seasonal marketing campaigns?",
"What is the role of storytelling in marketing?",
"How do you approach podcast marketing?",
"What is a marketing attribution model?",
"Describe how you would reduce customer acquisition cost.",
"What is product-led growth?",
"How do you approach content repurposing?",
"What is share of voice?",
"How do you approach crisis communications?",
"What is the difference between brand and performance marketing?",
"How do you approach building a loyalty program?",
"What is neuromarketing?",
"How do you approach marketing for a regulated industry?",
"Describe your approach to video marketing.",
"What is a landing page optimization strategy?",
"What is the role of user-generated content in marketing?",
"How do you approach building a thought leadership strategy?",
"What is a drip campaign?",
"What is social proof and how do you leverage it?",
"How do you approach building a SaaS content engine?",
"What is the difference between CPM, CPC, and CPA?",
"How do you measure marketing's contribution to revenue?",
"What is zero-party data?",
"How do you approach building an ambassador program?",
"What is the role of AI in modern marketing?",
"Describe your approach to A/B testing email subject lines.",
"What is the total addressable market analysis?",
"How do you approach marketing for a freemium product?",
"What is the difference between earned, owned, and paid media?",
"How do you approach voice search optimization?",
"What is marketing mix modeling?",
"What is the role of behavioral economics in marketing?",
"How do you approach international marketing localization?",
"Describe your approach to retention marketing.",
"What is the difference between brand equity and brand value?",
"How do you approach channel partner marketing?",
"How do you approach building a media partnership?",
"What is dark social and how does it affect attribution?",
"How do you approach ABM for enterprise accounts?",
"What is the role of data clean rooms in marketing?",
"How do you approach building a content moat?",
"What is the concept of signal-based selling in marketing?",
"What is the role of micro-influencers vs macro-influencers?",
"How do you approach building a brand community?",
"What is the concept of jobs-aware content marketing?",
"How do you approach building a category-defining brand?",
"How do you approach marketing attribution in a cookieless world?",
"Describe your approach to building a brand playbook.",
"What is the role of customer marketing?",
"How do you approach planning a product launch event?",
"What is the difference between inbound and outbound marketing?",
"How do you approach building a review and reputation strategy?",
"What is the concept of growth loops in marketing?",
"How do you approach building a partner ecosystem for distribution?",
"What is the role of narrative positioning in marketing?",
"Describe your approach to competitive messaging.",
"How do you approach integrated marketing campaigns?",
"What is the concept of minimum viable marketing?",
],
"Finance": [
"Walk me through a DCF model.",
"What is EBITDA and why is it important?",
"How would you value a startup with no revenue?",
"Explain the difference between NPV and IRR.",
"How do you assess credit risk?",
"What is working capital?",
"Explain the concept of leverage in finance.",
"What is the difference between equity and debt financing?",
"How do you interpret a cash flow statement?",
"What is a leveraged buyout?",
"Explain the three financial statements and how they connect.",
"What is beta in finance?",
"How do you calculate WACC?",
"What is a comparable company analysis?",
"Explain the concept of free cash flow.",
"What is the efficient market hypothesis?",
"How do you value a real estate investment?",
"What is a hedge fund vs a mutual fund?",
"Explain the concept of time value of money.",
"What is financial modeling?",
"How do interest rate changes affect bond prices?",
"What is a derivatives instrument?",
"Explain portfolio diversification.",
"What is a cap table?",
"How do you perform a sensitivity analysis?",
"What is the difference between GAAP and IFRS?",
"Explain goodwill in accounting.",
"What is a rights issue?",
"How do you assess a company's liquidity?",
"What is the difference between gross and net profit margin?",
"Explain amortization vs depreciation.",
"What is a convertible note?",
"How do you value intellectual property?",
"What is a bridge loan?",
"Explain the concept of a term sheet.",
"What is venture debt?",
"How do you approach financial due diligence?",
"What is a Monte Carlo simulation in finance?",
"Explain carry in private equity.",
"What is the difference between primary and secondary markets?",
"How do you calculate return on equity?",
"What is a waterfall structure in private equity?",
"Explain yield curve inversion.",
"What is revolving credit?",
"How do you build a three-statement model?",
"What is enterprise value vs equity value?",
"How do you approach stress testing a portfolio?",
"What is the difference between alpha and beta returns?",
"Explain market capitalization.",
"What is a special purpose vehicle?",
"How do you approach valuing a cyclical business?",
"Explain the concept of price-to-book ratio.",
"What is a recapitalization?",
"How do you approach building a merger model?",
"What is accretion/dilution in M&A?",
"Explain the dividend discount model.",
"How do you approach scenario analysis in financial modeling?",
"What is a liquidity premium?",
"Explain the difference between a strategic and financial buyer.",
"What is earnout in M&A?",
"How do you approach valuing a pre-revenue biotech company?",
"What is normalized earnings?",
"Explain funded vs unfunded pension liabilities.",
"What is a preferred return in private equity?",
"How do you approach building an LBO model?",
"What is terminal value in DCF?",
"Explain a PIPE deal.",
"What is the role of investment banking in an IPO?",
"How do you interpret a company's debt schedule?",
"What is net operating loss?",
"Explain the difference between a bond's coupon and its yield.",
"What is operating leverage?",
"How do you model a subscription revenue business?",
"Explain deferred tax liability.",
"What is the role of EBITDA adjustments in private equity?",
"How do you approach building a revenue model for a marketplace?",
"Explain cross-border M&A challenges.",
"What is the difference between gross IRR and net IRR?",
"How do you analyze working capital changes in a model?",
"What is a carve-out transaction?",
"Explain the role of debt covenants.",
"What is net asset value and how is it calculated?",
"How do you approach building a real estate financial model?",
"Explain a floor in interest rate derivatives.",
"What is the difference between a senior secured and mezzanine loan?",
"How do you approach valuing a family-owned business?",
"Explain dividend recapitalization.",
"What is the role of a fairness opinion in M&A?",
"How do you approach modeling SaaS metrics like ARR and churn?",
"What is a secondary buyout?",
"Explain the difference between mark-to-market and mark-to-model valuation.",
"How do you approach building a capital allocation framework?",
"What is the concept of risk-adjusted return?",
"Explain the concept of duration in fixed income.",
"What is the difference between a hedge and a speculation?",
"How do you approach modeling a leveraged finance deal?",
"What is the concept of a NAV discount in closed-end funds?",
"Explain the concept of convexity in bond pricing.",
"How do you approach building a project finance model?",
],
"Design": [
"Walk me through your design process.",
"How do you handle conflicting feedback from stakeholders?",
"What is the difference between UX and UI?",
"How do you conduct user research?",
"Tell me about a design decision you had to defend.",
"How do you design for accessibility?",
"What is a design system and why is it important?",
"How do you measure the success of a design?",
"Describe your approach to information architecture.",
"How do you prioritize usability vs aesthetics?",
"What is the double diamond design process?",
"How do you conduct usability testing?",
"What are the principles of visual hierarchy?",
"Describe your approach to mobile-first design.",
"What is a design sprint?",
"How do you use personas in the design process?",
"What is affinity mapping?",
"How do you avoid dark patterns in design?",
"What is the difference between qualitative and quantitative user research?",
"How do you design for different cultural contexts?",
"Describe your process for creating a style guide.",
"What is progressive disclosure in UX?",
"How do you approach error states in design?",
"What is a journey map?",
"Describe Gestalt principles and their design application.",
"How do you design onboarding experiences?",
"What is Fitts's Law and how does it apply to UX?",
"Describe your approach to designing for empty states.",
"What is a heuristic evaluation?",
"Describe your approach to designing complex forms.",
"How do you decide between a modal and a new page?",
"What is cognitive load and how do you minimize it?",
"How do you approach microcopy in design?",
"What is the role of animation in UX?",
"Describe your approach to responsive design.",
"How do you balance consistency with innovation in design?",
"What is a design critique and how do you run one?",
"Describe your approach to designing data visualizations.",
"How do you work with developers to ensure design fidelity?",
"How do you design for trust and credibility?",
"What is a service blueprint?",
"How do you approach designing for voice interfaces?",
"What is contextual inquiry in user research?",
"Describe how you would redesign a checkout flow.",
"What is the role of typography in UX?",
"How do you approach color accessibility?",
"Describe your process for handoff to development.",
"What is design debt?",
"How do you approach designing for internationalization?",
"What is a tree test?",
"What is the role of motion design in UX?",
"How do you approach designing for different screen densities?",
"What is a card sort?",
"Describe your approach to designing for dark mode.",
"What is progressive enhancement in design?",
"What is atomic design methodology?",
"What is the role of white space in design?",
"How do you approach designing navigation patterns?",
"What is affordance in UX?",
"How do you approach designing for elderly users?",
"What is the role of color psychology in UX?",
"How do you design for low literacy users?",
"What is the concept of mental models in UX?",
"Describe your approach to designing search experiences.",
"What is the difference between a prototype and a mockup?",
"What is emotional design?",
"What is the role of user testing in agile development?",
"What are skeleton screens?",
"How do you approach designing pricing pages?",
"What is the role of iconography in UX?",
"Describe your approach to designing for augmented reality.",
"What is delight in UX design?",
"How do you approach designing for conversational UI?",
"What is a design QA process?",
"What is spatial design?",
"What is the role of sound design in UX?",
"What is inclusive design?",
"How do you approach designing for neurodiversity?",
"What is the role of gamification in UX?",
"How do you approach designing for financial products?",
"What is co-design?",
"What is the role of narrative in UX design?",
"How do you approach designing for persuasion?",
"What is speculative design?",
"Describe your approach to designing for behavior change.",
"What is the role of ethnographic research in design?",
"How do you approach designing for environmental sustainability?",
"Describe your approach to designing enterprise software.",
"What is the role of design in product strategy?",
"How do you approach designing a token-based design system?",
"What is the difference between usability and user experience?",
"How do you approach designing for low-bandwidth environments?",
"What is the role of A/B testing in design iteration?",
"Describe how you approach designing for multi-platform consistency.",
"What is the concept of design leadership?",
"How do you approach building a design team culture?",
"What is the role of content strategy in design?",
"Describe your approach to designing for self-service products.",
"How do you approach designing for complex workflows?",
"What is the role of systems thinking in UX design?",
],
"Data Science": [
"What is overfitting and how do you prevent it?",
"Explain the bias-variance tradeoff.",
"How would you handle missing data in a dataset?",
"What is the difference between supervised and unsupervised learning?",
"Explain gradient descent in simple terms.",
"What is cross-validation?",
"How do you evaluate a classification model?",
"What is feature engineering?",
"Explain the difference between precision and recall.",
"How would you detect and handle outliers?",
"What is a confusion matrix?",
"Explain bagging and boosting.",
"What is PCA and when would you use it?",
"How does a random forest work?",
"What is the difference between L1 and L2 regularization?",
"Explain the ROC curve.",
"What is the curse of dimensionality?",
"How does a neural network learn?",
"What is transfer learning?",
"Explain the attention mechanism in transformers.",
"What is A/B testing from a statistical perspective?",
"How do you approach feature selection?",
"What is the difference between correlation and causation?",
"Explain k-means clustering.",
"What is collaborative filtering?",
"How do you handle class imbalance?",
"What is a p-value?",
"Explain Bayesian inference.",
"What is the difference between Type I and Type II errors?",
"How does DBSCAN clustering work?",
"What is word2vec?",
"Explain the vanishing gradient problem.",
"What is an autoencoder?",
"How do you build a time series forecasting model?",
"What is the difference between LSTM and GRU?",
"How do you evaluate a regression model?",
"What is the elbow method in k-means?",
"Explain ensemble methods.",
"What is multicollinearity?",
"Describe building an end-to-end ML pipeline.",
"What is the difference between batch and online learning?",
"How do you approach model interpretability?",
"What is SHAP?",
"How do you deploy a machine learning model to production?",
"What is data drift?",
"What is semi-supervised learning?",
"How do you approach NLP tasks?",
"What is a GAN?",
"How do you build a recommendation system?",
"What is the difference between parametric and non-parametric models?",
"Explain information gain in decision trees.",
"What is Monte Carlo simulation in data science?",
"How do you approach time series decomposition?",
"What is causal inference?",
"Explain the XGBoost algorithm.",
"How do you build a fraud detection model?",
"What is active learning?",
"Explain generative vs discriminative models.",
"What is a variational autoencoder?",
"How do you build a churn prediction model?",
"What is federated learning?",
"Explain the concept of attention in NLP.",
"What is the difference between BERT and GPT?",
"How do you build a named entity recognition system?",
"What is model calibration?",
"Explain knowledge distillation.",
"How do you build a sentiment analysis model?",
"What is contrastive learning?",
"Explain data augmentation.",
"What is the role of feature stores in ML?",
"How do you build a real-time ML inference system?",
"What is a multi-armed bandit?",
"Explain Gaussian processes.",
"How do you build an anomaly detection system?",
"What are graph neural networks?",
"Explain the difference between frequentist and Bayesian statistics.",
"How do you approach model versioning?",
"Explain zero-shot learning.",
"What is the role of synthetic data in ML?",
"How do you build a multi-label classification model?",
"What is meta-learning?",
"Explain curriculum learning.",
"What is the difference between weak supervision and self-supervision?",
"How do you build a question-answering system?",
"What is neural architecture search?",
"Explain mixture of experts.",
"What is the role of embedding models in semantic search?",
"How do you build a document classification system?",
"What is reward shaping in reinforcement learning?",
"Explain a Markov decision process.",
"What is model-free vs model-based reinforcement learning?",
"How do you evaluate large language models?",
"What is retrieval-augmented generation?",
"How do you approach building a data labeling pipeline?",
"What is the concept of a data flywheel?",
"Explain the concept of prompt engineering.",
"What is the role of fine-tuning in foundation models?",
"How do you approach building a responsible AI system?",
"What is the concept of model collapse in generative AI?",
"How do you approach building an ML monitoring system?",
],
"Sales": [
"How do you handle objections from a potential client?",
"Walk me through your sales process.",
"How do you qualify a lead?",
"Tell me about your biggest sales win.",
"How do you manage your pipeline?",
"What is your approach to cold outreach?",
"How do you build rapport with prospects?",
"How do you handle rejection in sales?",
"What is consultative selling?",
"How do you negotiate pricing with a client?",
"What is solution selling?",
"How do you research a prospect before a call?",
"Describe your approach to account management.",
"What is the difference between inbound and outbound sales?",
"How do you write a compelling cold email?",
"What is multi-threading in enterprise deals?",
"How do you handle a stalled deal?",
"What is MEDDIC?",
"How do you handle a competitive situation in a deal?",
"Describe your approach to closing a deal.",
"How do you build urgency in a sales conversation?",
"What is a discovery call and how do you structure it?",
"How do you handle a prospect happy with their current vendor?",
"What is your approach to follow-ups?",
"How do you manage a large territory?",
"Describe your approach to upselling and cross-selling.",
"What is social selling?",
"How do you use data and CRM in your sales process?",
"What is a sales funnel vs a pipeline?",
"How do you handle a price objection?",
"What is challenger sale methodology?",
"How do you build a business case for a prospect?",
"What is your approach to demos?",
"How do you work with marketing to close more deals?",
"What is your quota attainment strategy?",
"How do you stay motivated after a tough quarter?",
"Describe your approach to annual contract negotiations.",
"What is the difference between a champion and an economic buyer?",
"How do you measure your own sales performance?",
"What is your approach to selling to the C-suite?",
"How do you handle a lost deal?",
"What is a mutual success plan?",
"How do you approach product-led sales?",
"What is your approach to partner and channel sales?",
"How do you handle a deal that keeps getting delayed?",
"What is your approach to handling legal and procurement?",
"How do you maintain relationships with existing clients?",
"What is a sales playbook?",
"How do you approach international sales?",
"Describe your approach to territory planning.",
"What is value-based selling?",
"How do you qualify a deal using BANT?",
"What is the role of a sales engineer in complex deals?",
"How do you approach building a referral network?",
"What is deal velocity?",
"How do you approach selling a new product category?",
"What is the role of sales ops in your process?",
"How do you build trust in a virtual selling environment?",
"What is your approach to handling FUD in a deal?",
"How do you build a territory from scratch?",
"What is the concept of land and expand?",
"How do you run an effective quarterly business review?",
"What is the role of executive sponsorship in a deal?",
"How do you build a pipeline from zero?",
"What is your approach to competitive displacement?",
"How do you sell into a new vertical?",
"What is the role of case studies in the sales process?",
"How do you handle security and compliance objections?",
"What is a proof of concept in sales?",
"How do you approach building a partner ecosystem?",
"What is your approach to multi-year contract negotiations?",
"How do you build a sales forecast?",
"What is the role of sales enablement?",
"How do you handle a no-decision outcome?",
"What is a deal desk?",
"How do you build a custom ROI model for a prospect?",
"What is the role of professional services in closing enterprise deals?",
"How do you handle a request for proposal?",
"What is a win/loss analysis program?",
"How do you approach account mapping in enterprise sales?",
"What is the concept of a sales motion?",
"How do you approach building relationships with procurement?",
"How do you handle a counteroffer?",
"What is a named account strategy?",
"What is the role of customer success in expansion revenue?",
"How do you build a scalable outbound motion?",
"What is competitive battlecard usage?",
"How do you run a successful product trial?",
"What is pipeline hygiene?",
"How do you build a channel partner program?",
"How do you manage a distributed sales team?",
"How do you approach quota setting for a new sales role?",
"What is sales velocity?",
"How do you build a customer advisory board?",
"What is the role of data enrichment in outbound prospecting?",
"How do you handle a competitor pricing attack?",
"What is a co-sell motion with cloud providers?",
"How do you build a sales culture?",
"How do you run a successful Sales Kickoff?",
],
};

const MCQ_QUESTIONS = {
"Software Engineering": [
{ q: "Which HTTP method is idempotent?", options: ["POST", "GET", "PATCH", "DELETE"], correct: 1, explanation: "GET is idempotent — calling it multiple times produces the same result without side effects." },
{ q: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Linked List", "Heap"], correct: 1, explanation: "A Stack uses Last-In, First-Out (LIFO)." },
{ q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2, explanation: "Binary search halves the search space each step, giving O(log n) time complexity." },
{ q: "Which is NOT a JavaScript framework?", options: ["React", "Angular", "Django", "Vue"], correct: 2, explanation: "Django is a Python web framework, not a JavaScript one." },
{ q: "What is the purpose of a foreign key?", options: ["Encrypt data", "Link tables in a relational database", "Index a column", "Store binary data"], correct: 1, explanation: "A foreign key creates a relationship between tables." },
{ q: "Which protocol is used for secure web communication?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correct: 2, explanation: "HTTPS uses TLS/SSL encryption to secure data." },
{ q: "What does OOP stand for?", options: ["Object-Oriented Programming", "Open Output Protocol", "Ordered Object Processing", "Optional Output Parameter"], correct: 0, explanation: "OOP = Object-Oriented Programming." },
{ q: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Sequential Query Logic", "Structured Question Language"], correct: 0, explanation: "SQL = Structured Query Language." },
{ q: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correct: 1, explanation: "Quicksort's worst case is O(n²) when the pivot is always the smallest or largest element." },
{ q: "What does DNS stand for?", options: ["Dynamic Node Service", "Domain Name System", "Data Network Structure", "Direct Name Server"], correct: 1, explanation: "DNS = Domain Name System — translates domain names to IP addresses." },
{ q: "Which HTTP status code means 'Not Found'?", options: ["200", "301", "404", "500"], correct: 2, explanation: "404 = Not Found." },
{ q: "What does API stand for?", options: ["Application Programming Interface", "Automated Process Integration", "Advanced Protocol Interface", "Application Process Interaction"], correct: 0, explanation: "API = Application Programming Interface." },
{ q: "Which sorting algorithm has O(n log n) average complexity?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], correct: 2, explanation: "Merge Sort has O(n log n) in all cases." },
{ q: "What is a race condition?", options: ["A performance benchmark", "A bug caused by unpredictable thread execution order", "A fast sorting algorithm", "A type of memory leak"], correct: 1, explanation: "A race condition occurs when behavior depends on unpredictable thread execution order." },
{ q: "Which of these is a NoSQL database?", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], correct: 2, explanation: "MongoDB is a NoSQL document database." },
{ q: "What does CI/CD stand for?", options: ["Code Integration / Code Deployment", "Continuous Integration / Continuous Deployment", "Compile Integration / Compile Deployment", "Central Interface / Central Deployment"], correct: 1, explanation: "CI/CD = Continuous Integration / Continuous Deployment." },
{ q: "What is the purpose of a load balancer?", options: ["Compress data", "Distribute traffic across servers", "Encrypt connections", "Cache static assets"], correct: 1, explanation: "A load balancer distributes incoming requests across multiple servers." },
{ q: "What is a primary key?", options: ["The first column in a table", "A unique identifier for each row", "A foreign reference", "An encrypted value"], correct: 1, explanation: "A primary key uniquely identifies each row in a table." },
{ q: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Central Origin Request System", "Client-Origin Routing Service", "Cached Object Request Schema"], correct: 0, explanation: "CORS = Cross-Origin Resource Sharing — controls how web pages request resources from another domain." },
{ q: "Which design principle does 'S' in SOLID stand for?", options: ["Single Responsibility Principle", "Separation of Concerns", "Stateless Design", "Structured Programming"], correct: 0, explanation: "S = Single Responsibility Principle — a class should have only one reason to change." },
],
"Product Management": [
{ q: "What does RICE stand for?", options: ["Reach, Impact, Cost, Effort", "Reach, Impact, Confidence, Effort", "Risk, Impact, Cost, Estimate", "Revenue, Impact, Confidence, Effort"], correct: 1, explanation: "RICE = Reach, Impact, Confidence, Effort — a feature prioritization framework." },
{ q: "What does MVP stand for?", options: ["Most Viable Product", "Minimum Viable Product", "Maximum Value Product", "Minimum Value Proposition"], correct: 1, explanation: "MVP = Minimum Viable Product — the simplest version that delivers core value." },
{ q: "What is churn rate?", options: ["Rate of new signups", "Rate of users who stop using the product", "Rate of feature adoption", "Rate of bug reports"], correct: 1, explanation: "Churn rate = percentage of users who stop using your product over a period." },
{ q: "What does OKR stand for?", options: ["Objectives and Key Results", "Output Key Ratio", "Operational Knowledge Review", "Objectives and Key Revenue"], correct: 0, explanation: "OKR = Objectives and Key Results." },
{ q: "What is the North Star Metric?", options: ["A vanity metric", "The single metric that best captures core product value", "A financial KPI", "A competitor benchmark"], correct: 1, explanation: "The North Star Metric captures the most essential value your product delivers." },
{ q: "What does DAU stand for?", options: ["Daily Active Users", "Data Analytics Unit", "Deployment Automation Utility", "Daily App Updates"], correct: 0, explanation: "DAU = Daily Active Users — a core engagement metric." },
{ q: "What is a product roadmap?", options: ["A technical architecture diagram", "A visual plan of product direction and priorities over time", "A list of bug fixes", "A financial forecast"], correct: 1, explanation: "A roadmap shows where a product is going and the priorities for getting there." },
{ q: "What is the MoSCoW method?", options: ["A project management methodology", "A prioritization framework: Must, Should, Could, Won't", "A product design process", "A customer research technique"], correct: 1, explanation: "MoSCoW = Must Have, Should Have, Could Have, Won't Have — used to prioritize requirements." },
{ q: "What does NPS stand for?", options: ["Net Product Score", "Net Promoter Score", "New Product Strategy", "Net Performance Standard"], correct: 1, explanation: "NPS = Net Promoter Score — measures customer loyalty." },
{ q: "What is a user story?", options: ["A marketing case study", "A short description of a feature from the user's perspective", "A bug report", "A product specification document"], correct: 1, explanation: "A user story: 'As a [user], I want [goal] so that [reason]'." },
{ q: "What does MAU stand for?", options: ["Monthly Active Users", "Maximum Allowed Utilization", "Monthly App Updates", "Marketing Acquisition Unit"], correct: 0, explanation: "MAU = Monthly Active Users." },
{ q: "What is product-market fit?", options: ["When the product is technically complete", "When a product strongly satisfies a market need", "When revenue exceeds costs", "When the product has no bugs"], correct: 1, explanation: "PMF occurs when a product satisfies a strong market demand." },
{ q: "What is a go-to-market strategy?", options: ["A technical deployment plan", "A plan for launching a product to market", "A customer support process", "An engineering roadmap"], correct: 1, explanation: "A GTM strategy outlines how a company will reach target customers." },
{ q: "What is a product backlog?", options: ["A list of completed features", "A prioritized list of work for a development team", "A customer complaint log", "A technical debt register"], correct: 1, explanation: "A backlog is an ordered list of features, bugs, and tasks the team plans to work on." },
{ q: "What is a sprint retrospective?", options: ["Plan the next sprint", "Review what went well and what to improve", "Demo the product to stakeholders", "Estimate future work"], correct: 1, explanation: "A retrospective is held at the end of a sprint to reflect on the process and improve." },
],
"Marketing": [
{ q: "What does CTR stand for?", options: ["Click Through Rate", "Customer Transaction Rate", "Content Traffic Ratio", "Cost To Reach"], correct: 0, explanation: "CTR = Click Through Rate." },
{ q: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Engagement Output", "Search Experience Operations", "Site Engagement Order"], correct: 0, explanation: "SEO = Search Engine Optimization." },
{ q: "What is A/B testing?", options: ["Testing two versions to compare performance", "Annual budget review", "Audience behavior tracking", "Algorithm benchmarking"], correct: 0, explanation: "A/B testing compares two variations to find which performs better." },
{ q: "What does CPC stand for?", options: ["Cost Per Click", "Customer Per Campaign", "Content Publishing Cost", "Clicks Per Campaign"], correct: 0, explanation: "CPC = Cost Per Click." },
{ q: "What is a conversion rate?", options: ["Percentage of visitors who complete a desired action", "Speed at which ads load", "Number of ad impressions", "Cost of acquiring a customer"], correct: 0, explanation: "Conversion rate = (conversions / visitors) × 100." },
{ q: "What does CAC stand for?", options: ["Customer Acquisition Cost", "Campaign Ad Count", "Content Analytics Center", "Customer Action Cost"], correct: 0, explanation: "CAC = Customer Acquisition Cost — total spend to acquire one new customer." },
{ q: "What does LTV stand for?", options: ["Long-Term Value", "Lead Tracking Value", "Lifetime Value", "Loyalty Tier Value"], correct: 2, explanation: "LTV = Lifetime Value — the total revenue expected from a single customer." },
{ q: "What is organic traffic?", options: ["Traffic from paid ads", "Traffic from unpaid search results", "Traffic from email campaigns", "Traffic from social media ads"], correct: 1, explanation: "Organic traffic comes from unpaid search results." },
{ q: "What does ROI stand for in marketing?", options: ["Return on Investment", "Rate of Impressions", "Revenue Over Impressions", "Reach Of Influence"], correct: 0, explanation: "ROI = Return on Investment." },
{ q: "What is bounce rate?", options: ["Rate of email unsubscribes", "Percentage of visitors who leave after viewing one page", "Page load speed", "Rate of ad clicks"], correct: 1, explanation: "Bounce rate = percentage of visitors who view only one page and leave." },
{ q: "What is SEM?", options: ["Social Engagement Marketing", "Search Engine Marketing", "Structured Email Marketing", "Sponsored Engagement Media"], correct: 1, explanation: "SEM = Search Engine Marketing — promoting websites through paid search ads." },
{ q: "What is a marketing funnel?", options: ["A tool for filtering leads", "The journey customers take from awareness to purchase", "A type of email sequence", "A social media algorithm"], correct: 1, explanation: "A marketing funnel represents: Awareness → Interest → Decision → Action." },
{ q: "What is influencer marketing?", options: ["Marketing via TV ads", "Partnering with social media personalities to promote products", "Marketing to business leaders", "Running paid search campaigns"], correct: 1, explanation: "Influencer marketing uses individuals with large followings to promote products." },
{ q: "What is a landing page?", options: ["The homepage of a website", "A standalone page designed for a specific campaign goal", "A product checkout page", "A contact form page"], correct: 1, explanation: "A landing page is focused on one goal — capturing leads or driving purchases." },
{ q: "What is email open rate?", options: ["Percentage of emails delivered", "Percentage of recipients who opened an email", "Number of emails sent", "Click rate on email links"], correct: 1, explanation: "Open rate = (emails opened / emails delivered) × 100." },
],
"Finance": [
{ q: "What does P/E ratio stand for?", options: ["Profit/Earnings", "Price/Earnings", "Portfolio/Equity", "Performance/Equity"], correct: 1, explanation: "P/E = Price-to-Earnings ratio." },
{ q: "What is a bull market?", options: ["Falling prices", "Rising prices", "Volatile market", "Stagnant market"], correct: 1, explanation: "A bull market = rising asset prices." },
{ q: "What does ROI stand for?", options: ["Rate of Income", "Return On Investment", "Revenue Over Income", "Risk Of Investment"], correct: 1, explanation: "ROI = Return On Investment." },
{ q: "What is compound interest?", options: ["Interest on principal only", "Interest on principal plus accumulated interest", "A fixed monthly fee", "Interest on late payments"], correct: 1, explanation: "Compound interest is calculated on both principal and previously earned interest." },
{ q: "What does IPO stand for?", options: ["Internal Portfolio Offering", "Initial Public Offering", "Investor Purchase Option", "International Private Offering"], correct: 1, explanation: "IPO = Initial Public Offering — when a private company first sells shares to the public." },
{ q: "What is EBITDA?", options: ["Earnings Before Interest, Taxes, Dividends, and Assets", "Earnings Before Interest, Taxes, Depreciation, and Amortization", "Estimated Base Income Tax Debt and Assets", "Earnings Before Income Tax Dividends and Appreciation"], correct: 1, explanation: "EBITDA = Earnings Before Interest, Taxes, Depreciation, and Amortization." },
{ q: "What is a bond?", options: ["A share of company ownership", "A debt instrument issued by a company or government", "A type of mutual fund", "A commodity contract"], correct: 1, explanation: "A bond is a fixed-income debt instrument." },
{ q: "What is diversification?", options: ["Investing all money in one asset", "Spreading investments across different assets to reduce risk", "Investing only in safe assets", "Timing the market"], correct: 1, explanation: "Diversification reduces risk by spreading investments across different asset classes." },
{ q: "What is NPV?", options: ["Net Present Value", "Net Portfolio Value", "Nominal Price Value", "Net Profit Variance"], correct: 0, explanation: "NPV = Net Present Value." },
{ q: "What is a balance sheet?", options: ["A record of daily transactions", "A financial statement showing assets, liabilities, and equity at a point in time", "A report of annual revenue", "A forecast of future earnings"], correct: 1, explanation: "A balance sheet shows Assets = Liabilities + Equity." },
{ q: "What is inflation?", options: ["A rise in individual stock prices", "A general increase in prices reducing purchasing power", "A government interest rate policy", "A drop in currency value internationally"], correct: 1, explanation: "Inflation is the rate at which prices rise over time." },
{ q: "What is working capital?", options: ["Total company assets", "Current assets minus current liabilities", "Annual revenue minus costs", "Cash held in bank accounts"], correct: 1, explanation: "Working capital = Current Assets − Current Liabilities." },
{ q: "What is a dividend?", options: ["A type of loan", "A distribution of profit paid to shareholders", "A stock buyback", "A bond coupon payment"], correct: 1, explanation: "A dividend is a portion of earnings distributed to shareholders." },
{ q: "Stocks vs bonds: which is correct?", options: ["Stocks are loans, bonds are ownership", "Stocks are ownership, bonds are loans", "Both are types of loans", "Both are types of ownership"], correct: 1, explanation: "Stocks = ownership (equity); bonds = debt (loans to the company)." },
{ q: "What is the difference between a bear and bull market?", options: ["Bear = rising prices, Bull = falling prices", "Bear = falling prices, Bull = rising prices", "Both mean rising prices", "Both mean falling prices"], correct: 1, explanation: "Bear market = falling prices (20%+ decline); Bull market = rising prices (20%+ gain)." },
],
"Design": [
{ q: "What does UX stand for?", options: ["User Experience", "Unique Experience", "Universal Exchange", "User Examination"], correct: 0, explanation: "UX = User Experience." },
{ q: "What is a wireframe?", options: ["A finished design mockup", "A low-fidelity structural layout", "A user testing report", "A color palette"], correct: 1, explanation: "A wireframe shows element placement without final visual design." },
{ q: "Which color model is used for screens?", options: ["CMYK", "RGB", "Pantone", "HSL only"], correct: 1, explanation: "RGB = the additive color model for digital screens." },
{ q: "What is the 'fold' in web design?", options: ["A navigation pattern", "The visible area before scrolling", "A CSS animation type", "A responsive breakpoint"], correct: 1, explanation: "The fold = visible area before scrolling." },
{ q: "What is a prototype?", options: ["The final production version", "An interactive simulation for testing", "A technical specification", "A brand style guide"], correct: 1, explanation: "A prototype is an interactive model used to test and validate design." },
{ q: "What is kerning?", options: ["The spacing between lines of text", "The spacing between individual characters", "The weight of a font", "The color contrast of text"], correct: 1, explanation: "Kerning = the adjustment of space between individual characters." },
{ q: "What is a style guide?", options: ["A list of design tools", "A document defining visual standards for a brand", "A user research report", "A technical API document"], correct: 1, explanation: "A style guide defines typography, color, spacing, and component standards." },
{ q: "What is the Gestalt principle of proximity?", options: ["Similar colors are grouped together", "Elements close together are perceived as related", "Larger elements are more important", "Symmetric elements are preferred"], correct: 1, explanation: "Proximity: objects near each other are perceived as a group." },
{ q: "What is a user persona?", options: ["A real user interview transcript", "A fictional representation of a target user based on research", "A technical specification", "A brand character"], correct: 1, explanation: "A persona is a research-based fictional character representing target users." },
{ q: "What is accessibility in design?", options: ["Making designs visually appealing", "Ensuring designs can be used by people with disabilities", "Reducing loading time", "Supporting multiple languages"], correct: 1, explanation: "Accessibility means designing products usable by people with all types of disabilities." },
{ q: "What is a call-to-action (CTA)?", options: ["A user complaint", "A design element that prompts users to take a specific action", "A navigation menu", "A loading indicator"], correct: 1, explanation: "A CTA prompts users to take a desired action, like 'Sign Up' or 'Buy Now'." },
{ q: "What does F-pattern describe in UX?", options: ["A navigation pattern", "How users typically scan web pages in an F-shape", "A typography hierarchy", "A color theory model"], correct: 1, explanation: "Users scan web pages in an F-pattern — across the top, then down the left side." },
{ q: "What is a design system?", options: ["A project management tool", "A collection of reusable components and standards for building products", "A user testing methodology", "A technical architecture"], correct: 1, explanation: "A design system is a library of reusable components ensuring consistency." },
{ q: "What is cognitive load?", options: ["Page load time", "The mental effort required to use an interface", "Number of features on a page", "Font readability score"], correct: 1, explanation: "Cognitive load = mental processing effort. Good UX minimizes unnecessary cognitive load." },
{ q: "What is information architecture?", options: ["Physical office layout", "The organization and structure of content in a product", "A database design pattern", "A type of sitemap tool"], correct: 1, explanation: "IA defines how content is organized and structured in a product." },
],
"Data Science": [
{ q: "Which algorithm is used for classification?", options: ["K-Means", "Linear Regression", "Logistic Regression", "PCA"], correct: 2, explanation: "Logistic Regression is used for binary classification." },
{ q: "What is a confusion matrix?", options: ["Visualizing neural networks", "Evaluating classification model performance", "Detecting outliers", "Feature selection"], correct: 1, explanation: "A confusion matrix shows TP, FP, TN, FN to evaluate classifiers." },
{ q: "What does NLP stand for?", options: ["Natural Language Processing", "Neural Learning Protocol", "Numerical Logic Processing", "Network Layer Protocol"], correct: 0, explanation: "NLP = Natural Language Processing." },
{ q: "What does ML stand for?", options: ["Multiple Learning", "Machine Learning", "Model Logic", "Mathematical Layer"], correct: 1, explanation: "ML = Machine Learning." },
{ q: "What is overfitting?", options: ["Model performs well on training but poorly on new data", "Model is too simple", "Model takes too long to train", "Model has too few parameters"], correct: 0, explanation: "Overfitting = the model memorized training data but fails to generalize." },
{ q: "What is supervised learning?", options: ["Learning without labeled data", "Learning from labeled input-output pairs", "Learning through rewards", "Learning by clustering"], correct: 1, explanation: "Supervised learning trains on labeled data — inputs mapped to known outputs." },
{ q: "What is the purpose of cross-validation?", options: ["Speed up training", "Evaluate model performance on unseen data", "Visualize data", "Reduce feature dimensions"], correct: 1, explanation: "Cross-validation estimates how well a model generalizes." },
{ q: "What does PCA stand for?", options: ["Principal Component Analysis", "Predictive Classification Algorithm", "Pattern Clustering Approach", "Parameter Calibration Analysis"], correct: 0, explanation: "PCA = Principal Component Analysis — dimensionality reduction." },
{ q: "What is a feature in ML?", options: ["A trained model output", "An input variable used to make predictions", "A neural network layer", "A type of activation function"], correct: 1, explanation: "A feature is an individual measurable property used as input to a model." },
{ q: "What is gradient descent?", options: ["A type of neural network", "An optimization algorithm that minimizes a loss function", "A data preprocessing step", "A model evaluation metric"], correct: 1, explanation: "Gradient descent iteratively adjusts parameters to minimize loss." },
{ q: "What is precision in a classification model?", options: ["Percentage of actual positives correctly identified", "Percentage of predicted positives that are actually positive", "Overall accuracy", "Number of true positives"], correct: 1, explanation: "Precision = TP / (TP + FP)." },
{ q: "What is a random forest?", options: ["A data visualization", "An ensemble of decision trees", "A natural language model", "A clustering algorithm"], correct: 1, explanation: "Random Forest builds many decision trees and merges their predictions." },
{ q: "What is the bias-variance tradeoff?", options: ["Trading speed for accuracy", "Balancing error from wrong assumptions vs sensitivity to training data", "Choosing between supervised and unsupervised learning", "Balancing model size vs performance"], correct: 1, explanation: "High bias = underfitting; high variance = overfitting. We tune to balance both." },
{ q: "What is data normalization?", options: ["Removing duplicate data", "Scaling features to a standard range", "Splitting data into train and test sets", "Filling in missing values"], correct: 1, explanation: "Normalization scales features to a standard range (e.g., 0-1) so no single feature dominates." },
{ q: "What is the ROC curve?", options: ["A model training curve", "A plot of true positive rate vs false positive rate at various thresholds", "A data distribution chart", "A loss function visualization"], correct: 1, explanation: "ROC curve plots TPR vs FPR — AUC measures overall classifier performance." },
],
"Sales": [
{ q: "What does CRM stand for?", options: ["Customer Relationship Management", "Client Revenue Metric", "Customer Retention Model", "Core Revenue Mechanism"], correct: 0, explanation: "CRM = Customer Relationship Management." },
{ q: "What is BANT?", options: ["Budget, Authority, Need, Timeline", "Buyer, Awareness, Negotiation, Target", "Budget, Awareness, Network, Timeline", "Buyer, Authority, Need, Transaction"], correct: 0, explanation: "BANT = Budget, Authority, Need, Timeline — a sales qualification framework." },
{ q: "What is upselling?", options: ["Selling to a new customer", "Encouraging a customer to buy a higher-end product", "Discounting a product", "Processing a return"], correct: 1, explanation: "Upselling encourages customers to buy a more premium option." },
{ q: "What is a sales pipeline?", options: ["A list of past customers", "A visual representation of deals at each stage of the sales process", "A product demo script", "A CRM database"], correct: 1, explanation: "A pipeline shows active deals organized by sales stage." },
{ q: "What does KPI stand for?", options: ["Key Performance Indicator", "Key Process Index", "Knowledge Performance Index", "Key Progress Insight"], correct: 0, explanation: "KPI = Key Performance Indicator." },
{ q: "What is cold calling?", options: ["Calling existing customers for upsells", "Contacting prospects with no prior interaction", "Following up on a demo", "Calling prospects who requested contact"], correct: 1, explanation: "Cold calling is reaching out to prospects who have had no prior contact." },
{ q: "What is cross-selling?", options: ["Selling the same product to different markets", "Recommending complementary products to existing customers", "Selling at a discount", "Selling through a partner"], correct: 1, explanation: "Cross-selling recommends related products based on a customer's current purchase." },
{ q: "What is a sales quota?", options: ["Number of calls per day", "A target revenue or activity goal for a salesperson", "Maximum discount allowed", "A list of assigned accounts"], correct: 1, explanation: "A quota is a performance target — typically revenue or number of deals." },
{ q: "What is consultative selling?", options: ["Selling based on lowest price", "Focusing on understanding customer needs before proposing solutions", "Selling using scripted pitches", "Selling through a partner network"], correct: 1, explanation: "Consultative selling prioritizes understanding the customer's problem deeply." },
{ q: "What does ACV stand for?", options: ["Annual Contract Value", "Active Customer Volume", "Average Conversion Value", "Account Customer Value"], correct: 0, explanation: "ACV = Annual Contract Value." },
{ q: "What is a sales funnel?", options: ["A tool for organizing contacts", "The stages a prospect goes through from awareness to purchase", "A pricing strategy", "A CRM feature"], correct: 1, explanation: "A sales funnel maps the buyer journey from awareness to a closed deal." },
{ q: "What is the role of an SDR?", options: ["Close deals", "Qualify leads and book meetings for account executives", "Manage existing accounts", "Run product demos"], correct: 1, explanation: "SDRs focus on outbound prospecting and qualifying leads." },
{ q: "What is objection handling?", options: ["Ignoring customer concerns", "Addressing and overcoming a prospect's concerns", "Lowering the price immediately", "Escalating to management"], correct: 1, explanation: "Objection handling = acknowledging, addressing, and resolving a prospect's hesitations." },
{ q: "What is MRR?", options: ["Monthly Recurring Revenue", "Maximum Revenue Rate", "Monthly Report Record", "Market Revenue Ratio"], correct: 0, explanation: "MRR = Monthly Recurring Revenue." },
{ q: "What is a champion in enterprise sales?", options: ["The highest-paying customer", "An internal advocate who drives your deal within the prospect's organization", "The top-performing sales rep", "The final decision maker"], correct: 1, explanation: "A champion is an internal advocate inside the prospect organization." },
],
};

// ── AI Question Generator ─────────────────────────────────────
async function generateAIQuestions(industry, existingQuestions) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `You are an expert interviewer for ${industry} roles. Generate 10 unique, high-quality interview questions from intermediate to advanced level.
Avoid these existing questions: ${existingQuestions.slice(0, 20).join(" | ")}
Return ONLY a valid JSON array of exactly 10 question strings. No markdown, no backticks, no explanation.
["Question one?","Question two?","Question three?"]`
        }]
      })
    });
    const data = await res.json();
    const text = data.content[0].text.trim();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.filter(q => typeof q === "string" && q.length > 10) : [];
  } catch { return []; }
}

// ── Module-level mastery (lives for entire browser session) ───
const _mastered = {};  // { [industry]: Set<string> }
const _failed   = {};  // { [industry]: Set<string> }
const _aiPool   = {};  // { [industry]: string[] }

function getMastery(industry) {
  if (!_mastered[industry]) _mastered[industry] = new Set();
  if (!_failed[industry])   _failed[industry]   = new Set();
  return { mastered: _mastered[industry], failed: _failed[industry] };
}

function buildSessionQueue(industry, count, mode) {
  const { mastered, failed } = getMastery(industry);
  const aiPool = _aiPool[industry] || [];
  const allOpen = [...new Set([...(OPEN_QUESTIONS[industry] || []), ...aiPool])];
  const allMCQ  = MCQ_QUESTIONS[industry] || [];

  const openFailed  = allOpen.filter(q => failed.has(q)).sort(() => Math.random() - 0.5);
  const openUnseen  = allOpen.filter(q => !failed.has(q) && !mastered.has(q)).sort(() => Math.random() - 0.5);
  const openMastered= allOpen.filter(q => mastered.has(q)).sort(() => Math.random() - 0.5);

  const mcqFailed = allMCQ.filter(q => failed.has(`MCQ:${q.q}`)).sort(() => Math.random() - 0.5);
  const mcqUnseen = allMCQ.filter(q => !failed.has(`MCQ:${q.q}`) && !mastered.has(`MCQ:${q.q}`)).sort(() => Math.random() - 0.5);

  const openPool = [...openFailed, ...openUnseen, ...openMastered];
  const mcqPool  = [...mcqFailed,  ...mcqUnseen]; // mastered MCQs never shown again

  let queue = [];
  if (mode === "open") {
    queue = openPool.slice(0, count).map(q => ({ type: "open", q, isRetry: failed.has(q) }));
  } else if (mode === "mcq") {
    queue = mcqPool.slice(0, count).map(q => ({ type: "mcq", ...q, isRetry: failed.has(`MCQ:${q.q}`) }));
  } else {
    let oi = 0, mi = 0;
    for (let i = 0; i < count; i++) {
      if ((i % 3 === 1) && mi < mcqPool.length) {
        const mq = mcqPool[mi++];
        queue.push({ type: "mcq", ...mq, isRetry: failed.has(`MCQ:${mq.q}`) });
      } else if (oi < openPool.length) {
        const oq = openPool[oi++];
        queue.push({ type: "open", q: oq, isRetry: failed.has(oq) });
      } else if (mi < mcqPool.length) {
        const mq = mcqPool[mi++];
        queue.push({ type: "mcq", ...mq, isRetry: failed.has(`MCQ:${mq.q}`) });
      }
    }
  }
  return queue;
}

// ─── Mock Interview ───────────────────────────────────────────
function MockInterview({ onInterviewComplete }) {
  const [step, setStep] = useState("setup");
  const [industry, setIndustry] = useState("");
  const [mode, setMode] = useState("mixed");
  const [totalQ, setTotalQ] = useState(5);
  const [questionQueue, setQuestionQueue] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [mcqRevealed, setMcqRevealed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allScores, setAllScores] = useState([]);
  const [allDetails, setAllDetails] = useState([]);
  const [newQAdded, setNewQAdded] = useState(false);
  const [stats, setStats] = useState({ total: 0, mastered: 0, failed: 0, unseen: 0 });
  const [generatingAI, setGeneratingAI] = useState(false);
  const autoAdvanceTimer = useRef(null);

  const currentQ = questionQueue[qIndex];
  const isMCQ = currentQ?.type === "mcq";

  const calcStats = (ind) => {
    const i = ind || industry;
    const { mastered, failed } = getMastery(i);
    const aiPool = _aiPool[i] || [];
    const allOpen = [...new Set([...(OPEN_QUESTIONS[i] || []), ...aiPool])];
    const allMCQ  = MCQ_QUESTIONS[i] || [];
    const tot = allOpen.length + allMCQ.length;
    const mast = allOpen.filter(q => mastered.has(q)).length + allMCQ.filter(q => mastered.has(`MCQ:${q.q}`)).length;
    const fail = allOpen.filter(q => failed.has(q)).length + allMCQ.filter(q => failed.has(`MCQ:${q.q}`)).length;
    const unseen = allOpen.filter(q => !mastered.has(q) && !failed.has(q)).length + allMCQ.filter(q => !mastered.has(`MCQ:${q.q}`) && !failed.has(`MCQ:${q.q}`)).length;
    setStats({ total: tot, mastered: mast, failed: fail, unseen });
  };

  const handleSelectIndustry = async (ind) => {
    setIndustry(ind);
    calcStats(ind);
    const aiPool = _aiPool[ind] || [];
    const allExisting = [...new Set([...(OPEN_QUESTIONS[ind] || []), ...aiPool])];
    const { mastered, failed } = getMastery(ind);
    const unseen = allExisting.filter(q => !mastered.has(q) && !failed.has(q)).length;
    if (unseen < 30 && !generatingAI) {
      setGeneratingAI(true);
      const newQs = await generateAIQuestions(ind, allExisting);
      if (newQs.length > 0) {
        _aiPool[ind] = [...new Set([...aiPool, ...newQs])];
        calcStats(ind);
      }
      setGeneratingAI(false);
    }
  };

  const markMastery = (key, correct) => {
    const { mastered, failed } = getMastery(industry);
    if (correct) { mastered.add(key); failed.delete(key); }
    else { failed.add(key); mastered.delete(key); }
    calcStats();
  };

  const startInterview = () => {
    if (!industry) return;
    setQuestionQueue(buildSessionQueue(industry, totalQ, mode));
    setQIndex(0); setAllScores([]); setAllDetails([]);
    setAnswer(""); setSelectedOption(null); setMcqRevealed(false); setFeedback(null); setNewQAdded(false);
    setStep("interview");
  };

  const nextQuestion = () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    const nextIdx = qIndex + 1;
    if (nextIdx >= questionQueue.length) { setStep("done"); return; }
    setQIndex(nextIdx);
    setAnswer(""); setSelectedOption(null); setMcqRevealed(false); setFeedback(null); setNewQAdded(false);
    setStep("interview");
  };

  const submitOpenAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const fb = await getAIFeedback(currentQ.q, answer);
    const isMastered = fb.score >= 75;
    markMastery(currentQ.q, isMastered);
    setFeedback({ ...fb, isMastered });
    setAllScores(prev => [...prev, fb.score]);
    setAllDetails(prev => [...prev, { q: currentQ.q, ans: answer, score: fb.score, feedback: fb.tip || "", type: "open", mastered: isMastered }]);
    if (fb.score >= 80) {
      const aiPool = _aiPool[industry] || [];
      const allExisting = [...new Set([...(OPEN_QUESTIONS[industry] || []), ...aiPool])];
      const newQs = await generateAIQuestions(industry, allExisting);
      if (newQs.length > 0) {
        _aiPool[industry] = [...new Set([...aiPool, ...newQs])];
        setQuestionQueue(prev => [...prev, { type: "open", q: newQs[0], isBonus: true }]);
        setNewQAdded(true);
        calcStats();
      }
    }
    setLoading(false);
    setStep("feedback");
  };

  const submitMCQ = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.correct;
    const score = isCorrect ? 100 : 30;
    markMastery(`MCQ:${currentQ.q}`, isCorrect);
    setMcqRevealed(true);
    setAllScores(prev => [...prev, score]);
    setAllDetails(prev => [...prev, { q: currentQ.q, ans: currentQ.options[selectedOption], score, feedback: currentQ.explanation, type: "mcq", correct: isCorrect, correctAnswer: currentQ.options[currentQ.correct], mastered: isCorrect }]);
    if (isCorrect) {
      autoAdvanceTimer.current = setTimeout(() => nextQuestion(), 1600);
    }
  };

  useEffect(() => () => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); }, []);

  const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  const handleFinish = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    onInterviewComplete({ role: industry, date: dateStr, score: avgScore, detail: allDetails });
    setStep("setup"); setIndustry(""); setQuestionQueue([]); setQIndex(0); setAllScores([]); setAllDetails([]);
  };

  // ── SETUP ────────────────────────────────────────────────────
  if (step === "setup") return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Mock Interview</h2>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 20 }}>✓ Correct = never repeats &nbsp;·&nbsp; ✗ Wrong = comes back next session</p>
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 10, letterSpacing: "0.5px" }}>INDUSTRY / ROLE</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {INDUSTRIES.map(ind => (
            <button key={ind} onClick={() => handleSelectIndustry(ind)}
              style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${industry === ind ? COLORS.accent : COLORS.border}`, background: industry === ind ? `${COLORS.accent}22` : COLORS.card, color: industry === ind ? COLORS.accentLight : COLORS.text, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'Sora', sans-serif", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
              {ind}
              {industry === ind && <Icon name="check" size={16} color={COLORS.accent} />}
            </button>
          ))}
        </div>
      </div>

      {industry && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ color: COLORS.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>YOUR MASTERY — {industry.toUpperCase()}</p>
            {generatingAI && <span style={{ color: COLORS.accentLight, fontSize: 10, fontWeight: 600 }}>🤖 AI adding Qs...</span>}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {[{ label: "Total Pool", v: stats.total, c: COLORS.text }, { label: "✓ Mastered", v: stats.mastered, c: COLORS.success }, { label: "🔄 Retry", v: stats.failed, c: COLORS.gold }, { label: "🆕 New", v: stats.unseen, c: COLORS.accentLight }].map(s => (
              <div key={s.label} style={{ flex: 1, background: COLORS.surface, borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: s.c }}>{s.v}</p>
                <p style={{ color: COLORS.muted, fontSize: 9, marginTop: 2, lineHeight: 1.3 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ height: 4, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0}%`, background: `linear-gradient(90deg, ${COLORS.success}, ${COLORS.accent})`, borderRadius: 4 }} />
          </div>
          <p style={{ color: COLORS.muted, fontSize: 10, marginTop: 5 }}>
            {stats.mastered > 0 ? `${Math.round((stats.mastered / stats.total) * 100)}% mastered · ` : ""}Retry questions appear first · mastered questions never repeat
          </p>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 10, letterSpacing: "0.5px" }}>QUESTION TYPE</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ id: "mixed", label: "🔀 Mixed", desc: "Open + MCQ" }, { id: "open", label: "✍️ Open-Ended", desc: "Write answers" }, { id: "mcq", label: "🎯 MCQ Only", desc: "Multiple choice" }].map(t => (
            <button key={t.id} onClick={() => setMode(t.id)}
              style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: `1px solid ${mode === t.id ? COLORS.accent : COLORS.border}`, background: mode === t.id ? `${COLORS.accent}22` : COLORS.card, cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.2s", textAlign: "center" }}>
              <p style={{ color: mode === t.id ? COLORS.accentLight : COLORS.text, fontSize: 11, fontWeight: 700 }}>{t.label}</p>
              <p style={{ color: COLORS.muted, fontSize: 10, marginTop: 2 }}>{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 10, letterSpacing: "0.5px" }}>NUMBER OF QUESTIONS</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[3, 5, 7, 10].map(n => (
            <button key={n} onClick={() => setTotalQ(n)}
              style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${totalQ === n ? COLORS.accent : COLORS.border}`, background: totalQ === n ? `${COLORS.accent}22` : COLORS.card, color: totalQ === n ? COLORS.accentLight : COLORS.text, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.2s" }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <button onClick={startInterview}
        style={{ width: "100%", background: industry ? `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)` : COLORS.border, border: "none", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: industry ? "pointer" : "default", fontFamily: "'Sora', sans-serif", opacity: industry ? 1 : 0.5 }}>
        Start Interview →
      </button>
    </div>
  );

  // ── INTERVIEW ─────────────────────────────────────────────────
  if (step === "interview" && currentQ) return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <p style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600 }}>Q {qIndex + 1}/{questionQueue.length}</p>
            {currentQ.isBonus && <span style={{ background: `${COLORS.gold}25`, color: COLORS.gold, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>⭐ BONUS</span>}
            {currentQ.isRetry && <span style={{ background: `${COLORS.danger}20`, color: COLORS.danger, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>🔄 RETRY</span>}
            <span style={{ background: isMCQ ? `${COLORS.success}22` : `${COLORS.accent}22`, color: isMCQ ? COLORS.success : COLORS.accentLight, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{isMCQ ? "MCQ" : "OPEN"}</span>
          </div>
          <p style={{ color: COLORS.accentLight, fontSize: 12, marginTop: 2 }}>{industry}</p>
        </div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", maxWidth: 100, justifyContent: "flex-end" }}>
          {questionQueue.map((_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i < qIndex ? COLORS.success : i === qIndex ? COLORS.accent : COLORS.border }} />)}
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.card})`, border: `1px solid ${COLORS.accent}33`, borderRadius: 16, padding: "18px", marginBottom: 20 }}>
        <p style={{ color: COLORS.muted, fontSize: 11, fontWeight: 600, marginBottom: 8, letterSpacing: "1px" }}>INTERVIEW QUESTION</p>
        <p style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>{currentQ.q}</p>
      </div>

      {isMCQ ? (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, marginBottom: 10, letterSpacing: "0.5px" }}>SELECT THE CORRECT ANSWER</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
            {currentQ.options.map((opt, i) => {
              let bg = COLORS.card, border = COLORS.border, color = COLORS.text;
              if (mcqRevealed) {
                if (i === currentQ.correct) { bg = `${COLORS.success}20`; border = COLORS.success; color = COLORS.success; }
                else if (i === selectedOption && i !== currentQ.correct) { bg = `${COLORS.danger}20`; border = COLORS.danger; color = COLORS.danger; }
              } else if (selectedOption === i) { bg = `${COLORS.accent}22`; border = COLORS.accent; color = COLORS.accentLight; }
              return (
                <button key={i} onClick={() => !mcqRevealed && setSelectedOption(i)}
                  style={{ padding: "13px 14px", borderRadius: 12, border: `1px solid ${border}`, background: bg, color, fontSize: 13, fontWeight: 500, cursor: mcqRevealed ? "default" : "pointer", fontFamily: "'Sora', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}>
                  <span style={{ minWidth: 24, height: 24, borderRadius: "50%", border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{["A","B","C","D"][i]}</span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {mcqRevealed && i === currentQ.correct && <span>✓</span>}
                  {mcqRevealed && i === selectedOption && i !== currentQ.correct && <span>✗</span>}
                </button>
              );
            })}
          </div>
          {mcqRevealed ? (
            <div>
              <div style={{ background: allDetails[allDetails.length-1]?.correct ? `${COLORS.success}15` : `${COLORS.danger}15`, border: `1px solid ${allDetails[allDetails.length-1]?.correct ? COLORS.success : COLORS.danger}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                <p style={{ color: allDetails[allDetails.length-1]?.correct ? COLORS.success : COLORS.danger, fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  {allDetails[allDetails.length-1]?.correct ? "✓ Correct! Moving to next question automatically..." : "✗ Incorrect — This question will appear again next session"}
                </p>
                <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.6 }}>{currentQ.explanation}</p>
              </div>
              {!allDetails[allDetails.length-1]?.correct && (
                <button onClick={nextQuestion} style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
                  {qIndex + 1 >= questionQueue.length ? "View Results 🏆" : "Next Question →"}
                </button>
              )}
            </div>
          ) : (
            <button onClick={submitMCQ} disabled={selectedOption === null}
              style={{ width: "100%", background: selectedOption !== null ? `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)` : COLORS.border, border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: selectedOption !== null ? "pointer" : "default", fontFamily: "'Sora', sans-serif", opacity: selectedOption !== null ? 1 : 0.4 }}>
              Submit Answer
            </button>
          )}
        </div>
      ) : (
        <div>
          <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8, letterSpacing: "0.5px" }}>YOUR ANSWER</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here... Use the STAR method (Situation, Task, Action, Result)"
            rows={6}
            style={{ width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px", color: COLORS.text, fontSize: 14, fontFamily: "'Sora', sans-serif", resize: "none", lineHeight: 1.6, marginBottom: 14 }} />
          <button onClick={submitOpenAnswer} disabled={loading || !answer.trim()}
            style={{ width: "100%", background: !answer.trim() ? COLORS.border : `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, border: "none", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: answer.trim() ? "pointer" : "default", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: !answer.trim() ? 0.4 : 1 }}>
            {loading ? <><span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Getting AI Feedback...</> : "Get AI Feedback"}
          </button>
        </div>
      )}
    </div>
  );

  // ── FEEDBACK ──────────────────────────────────────────────────
  if (step === "feedback" && feedback) return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: COLORS.text, fontSize: 18, fontWeight: 800 }}>AI Feedback</h3>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: feedback.score >= 75 ? COLORS.success : feedback.score >= 60 ? COLORS.gold : COLORS.danger }}>{feedback.score}<span style={{ fontSize: 14 }}>/100</span></div>
          <p style={{ color: feedback.isMastered ? COLORS.success : COLORS.gold, fontSize: 10, fontWeight: 700 }}>{feedback.isMastered ? "✓ MASTERED — won't repeat" : "🔄 RETRY next session"}</p>
        </div>
      </div>
      {newQAdded && (
        <div style={{ background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}55`, borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 8, alignItems: "center" }}>
          <span>⭐</span><p style={{ color: COLORS.gold, fontSize: 13, fontWeight: 600 }}>Great score! AI added a new bonus question.</p>
        </div>
      )}
      <div style={{ background: `${COLORS.success}15`, border: `1px solid ${COLORS.success}44`, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ color: COLORS.success, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✓ STRENGTHS</p>
        {feedback.strengths.map((s, i) => <p key={i} style={{ color: COLORS.text, fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>• {s}</p>)}
      </div>
      <div style={{ background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}44`, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>⚡ IMPROVEMENTS</p>
        {feedback.improvements.map((s, i) => <p key={i} style={{ color: COLORS.text, fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>• {s}</p>)}
      </div>
      <div style={{ background: `${COLORS.accent}15`, border: `1px solid ${COLORS.accent}44`, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ color: COLORS.accentLight, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>💡 BETTER ANSWER</p>
        <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.6 }}>{feedback.betterAnswer}</p>
      </div>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 20 }}>
        <p style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🎯 PRO TIP</p>
        <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5 }}>{feedback.tip}</p>
      </div>
      <button onClick={nextQuestion}
        style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, border: "none", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
        {qIndex + 1 >= questionQueue.length ? "View Results 🏆" : `Next Question (${qIndex + 2}/${questionQueue.length}) →`}
      </button>
    </div>
  );

  // ── DONE ──────────────────────────────────────────────────────
  if (step === "done") return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
      <h2 style={{ color: COLORS.text, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Interview Complete!</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>{industry} · {allDetails.length} questions</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, background: `${COLORS.success}18`, border: `1px solid ${COLORS.success}44`, borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: COLORS.success }}>{allDetails.filter(d => d.mastered).length}</p>
          <p style={{ color: COLORS.success, fontSize: 11, marginTop: 3 }}>Mastered ✓</p>
        </div>
        <div style={{ flex: 1, background: `${COLORS.gold}18`, border: `1px solid ${COLORS.gold}44`, borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: COLORS.gold }}>{allDetails.filter(d => !d.mastered).length}</p>
          <p style={{ color: COLORS.gold, fontSize: 11, marginTop: 3 }}>To Retry 🔄</p>
        </div>
        <div style={{ flex: 1, background: `${COLORS.accent}18`, border: `1px solid ${COLORS.accent}44`, borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: avgScore >= 80 ? COLORS.success : avgScore >= 60 ? COLORS.gold : COLORS.danger }}>{avgScore}%</p>
          <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 3 }}>Avg Score</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
        {allDetails.map((d, i) => (
          <div key={i} style={{ minWidth: 48, background: COLORS.card, border: `1px solid ${d.mastered ? COLORS.success : COLORS.gold}`, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: d.score >= 80 ? COLORS.success : d.score >= 60 ? COLORS.gold : COLORS.danger }}>{d.score}</p>
            <p style={{ color: COLORS.muted, fontSize: 9, marginTop: 2 }}>{d.type === "mcq" ? "MCQ" : "Open"}</p>
            <p style={{ color: d.mastered ? COLORS.success : COLORS.gold, fontSize: 9 }}>{d.mastered ? "✓" : "🔄"}</p>
          </div>
        ))}
      </div>
      <p style={{ color: COLORS.muted, fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
        {allDetails.filter(d => !d.mastered).length > 0
          ? `🔄 ${allDetails.filter(d => !d.mastered).length} question(s) marked for retry — they'll appear first next time.`
          : "🎯 All questions mastered this session!"}
      </p>
      <button onClick={handleFinish}
        style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, border: "none", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
        Go to Dashboard 🏠
      </button>
    </div>
  );

  return null;
}
// ─── Question Answer Modal ────────────────────────────────────
function QuestionAnswerModal({ question, industry, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnswer() {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: `You are an expert interview coach for ${industry} roles.
Explain this interview question in detail for a candidate:
"${question}"

Respond ONLY in this exact JSON format (no markdown, no backticks):
{
  "shortAnswer": "<2-3 sentence crisp answer a candidate should give>",
  "explanation": "<detailed explanation of the concept in simple language, 4-6 sentences>",
  "keyPoints": ["<point 1>", "<point 2>", "<point 3>"],
  "example": "<a real-world example or analogy to make it memorable>",
  "commonMistake": "<one common mistake candidates make answering this>"
}`
            }]
          })
        });
        const json = await res.json();
        const text = json.content[0].text;
        setData(JSON.parse(text));
      } catch {
        setData({
          shortAnswer: "This is a fundamental concept that interviewers test to gauge your depth of understanding.",
          explanation: "To answer this well, use a structured approach: define the concept, explain how it works, and give a concrete example from your experience. This shows both theoretical knowledge and practical application.",
          keyPoints: ["Understand the core concept deeply", "Use a real-world example", "Keep the answer concise and structured"],
          example: "Think of it like a real-world scenario you've encountered in your work or projects.",
          commonMistake: "Candidates often give a textbook definition without connecting it to practical experience."
        });
      }
      setLoading(false);
    }
    fetchAnswer();
  }, [question]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />

      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COLORS.surface, borderRadius: "24px 24px 0 0", border: `1px solid ${COLORS.border}`, maxHeight: "92vh", display: "flex", flexDirection: "column", animation: "slideUp 0.3s ease" }}>

        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 18px 14px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>{industry.toUpperCase()}</span>
            <p style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginTop: 4 }}>{question}</p>
          </div>
          <button onClick={onClose} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, width: 32, height: 32, minWidth: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="close" size={15} color={COLORS.muted} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "16px 18px 36px", display: "flex", flexDirection: "column", gap: 12 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: 16 }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p style={{ color: COLORS.muted, fontSize: 13 }}>Loading AI explanation...</p>
            </div>
          ) : data && (
            <>
              {/* Short Answer */}
              <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}20, ${COLORS.card})`, border: `1px solid ${COLORS.accent}44`, borderRadius: 14, padding: "14px 16px" }}>
                <p style={{ color: COLORS.accentLight, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>⚡ IDEAL SHORT ANSWER</p>
                <p style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{data.shortAnswer}</p>
              </div>

              {/* Explanation */}
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <p style={{ color: COLORS.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>📖 DETAILED EXPLANATION</p>
                <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.7, opacity: 0.9 }}>{data.explanation}</p>
              </div>

              {/* Key Points */}
              <div style={{ background: `${COLORS.success}10`, border: `1px solid ${COLORS.success}33`, borderRadius: 14, padding: "14px 16px" }}>
                <p style={{ color: COLORS.success, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: "0.5px" }}>✅ KEY POINTS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.keyPoints.map((pt, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 22, height: 22, borderRadius: 6, background: `${COLORS.success}25`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.success, fontSize: 11, fontWeight: 800 }}>{i + 1}</div>
                      <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.5, flex: 1 }}>{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div style={{ background: `${COLORS.gold}10`, border: `1px solid ${COLORS.gold}33`, borderRadius: 14, padding: "14px 16px" }}>
                <p style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>💡 REAL-WORLD EXAMPLE</p>
                <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.65, opacity: 0.9 }}>{data.example}</p>
              </div>

              {/* Common Mistake */}
              <div style={{ background: `${COLORS.danger}10`, border: `1px solid ${COLORS.danger}33`, borderRadius: 14, padding: "14px 16px" }}>
                <p style={{ color: COLORS.danger, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>⚠️ COMMON MISTAKE</p>
                <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.65, opacity: 0.9 }}>{data.commonMistake}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(60%); opacity:0; } to { transform: translateX(-50%) translateY(0); opacity:1; } }`}</style>
    </div>
  );
}

// ─── Question Bank ────────────────────────────────────────────
function QuestionBank() {
  const [selected, setSelected] = useState("Software Engineering");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeIndustry, setActiveIndustry] = useState("Software Engineering");
  const [tab, setTab] = useState("bank"); // "bank" | "ask"
  const [customQ, setCustomQ] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [askOpen, setAskOpen] = useState(false);
  const qs = QUESTIONS_DB[selected] || [];

  const handleAsk = () => {
    if (!customQ.trim()) return;
    setActiveQuestion(customQ.trim());
    setActiveIndustry(customRole.trim() || selected);
    setAskOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Question Bank</h2>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>Tap any question to get an AI-powered explanation</p>

      {/* Tabs */}
      <div style={{ display: "flex", background: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
        {[{ id: "bank", label: "📚 Question Bank" }, { id: "ask", label: "✏️ Ask Your Question" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "9px 6px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: tab === t.id ? COLORS.accent : "transparent",
              color: tab === t.id ? "#fff" : COLORS.muted }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── BANK TAB ── */}
      {tab === "bank" && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {Object.keys(QUESTIONS_DB).map(ind => (
              <button key={ind} onClick={() => setSelected(ind)}
                style={{ padding: "7px 12px", borderRadius: 20, border: `1px solid ${selected === ind ? COLORS.accent : COLORS.border}`, background: selected === ind ? `${COLORS.accent}22` : "transparent", color: selected === ind ? COLORS.accentLight : COLORS.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                {ind}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {qs.map((q, i) => (
              <div key={i} onClick={() => { setActiveQuestion(q); setActiveIndustry(selected); }}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.background = `${COLORS.accent}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.card; }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ minWidth: 28, height: 28, borderRadius: 8, background: `${COLORS.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontSize: 12, fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <p style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.5, flex: 1 }}>{q}</p>
                  <div style={{ minWidth: 24, display: "flex", alignItems: "center" }}>
                    <Icon name="arrow" size={14} color={COLORS.muted} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── ASK TAB ── */}
      {tab === "ask" && (
        <div>
          {/* Info banner */}
          <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}18, ${COLORS.card})`, border: `1px solid ${COLORS.accent}33`, borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 22 }}>🤖</div>
            <div>
              <p style={{ color: COLORS.accentLight, fontSize: 13, fontWeight: 700, marginBottom: 3 }}>AI Interview Coach</p>
              <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>Type any interview question — the AI will give you a detailed explanation, ideal answer, key points, and common mistakes to avoid!</p>
            </div>
          </div>

          {/* Role input */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8, letterSpacing: "0.5px" }}>ROLE / INDUSTRY (optional)</label>
            <input value={customRole} onChange={e => setCustomRole(e.target.value)}
              placeholder="e.g. Software Engineer, Product Manager..."
              style={{ width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 14px", color: COLORS.text, fontSize: 14, fontFamily: "'Sora', sans-serif", outline: "none" }} />
          </div>

          {/* Question input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8, letterSpacing: "0.5px" }}>YOUR QUESTION</label>
            <textarea value={customQ} onChange={e => setCustomQ(e.target.value)}
              placeholder={"Type your interview question here...\n\nExamples:\n• Tell me about yourself\n• What is your biggest weakness?\n• How do you handle pressure?\n• What is the SOLID principle?"}
              rows={6}
              style={{ width: "100%", background: COLORS.surface, border: `1px solid ${customQ ? COLORS.accent : COLORS.border}`, borderRadius: 12, padding: "14px", color: COLORS.text, fontSize: 14, fontFamily: "'Sora', sans-serif", resize: "none", lineHeight: 1.6, outline: "none", transition: "border-color 0.2s" }} />
            <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 6 }}>{customQ.length} characters</p>
          </div>

          <button onClick={handleAsk} disabled={!customQ.trim()}
            style={{ width: "100%", background: customQ.trim() ? `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)` : COLORS.border, border: "none", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: customQ.trim() ? "pointer" : "default", fontFamily: "'Sora', sans-serif", opacity: customQ.trim() ? 1 : 0.4, transition: "all 0.2s" }}>
            Get AI Answer 🚀
          </button>

          {/* Popular questions */}
          <div style={{ marginTop: 24 }}>
            <p style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, marginBottom: 10, letterSpacing: "0.5px" }}>💡 POPULAR CUSTOM QUESTIONS</p>
            {[
              "Tell me about yourself.",
              "What is your greatest weakness?",
              "Where do you see yourself in 5 years?",
              "Why should we hire you?",
            ].map((q, i) => (
              <div key={i} onClick={() => setCustomQ(q)}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "11px 14px", marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; }}>
                <p style={{ color: COLORS.text, fontSize: 13 }}>"{q}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeQuestion && (
        <QuestionAnswerModal
          question={activeQuestion}
          industry={activeIndustry || selected}
          onClose={() => { setActiveQuestion(null); }}
        />
      )}
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────
function Analytics({ interviewHistory }) {
  const isEmpty = interviewHistory.length === 0;
  const max = 100;
  const chartData = interviewHistory.slice().reverse().slice(-5).map((h, i) => ({ label: `#${i + 1}`, score: h.score }));

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Analytics</h2>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 24 }}>Track your performance over time</p>

      {isEmpty ? (
        <div style={{ background: COLORS.card, border: `1px dashed ${COLORS.border}`, borderRadius: 16, padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📊</div>
          <p style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>No data yet</p>
          <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>Complete a few mock interviews — your progress will appear here as charts!</p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
            <p style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, marginBottom: 16, letterSpacing: "0.5px" }}>SCORE TREND</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ color: COLORS.muted, fontSize: 10 }}>{d.score}</span>
                  <div style={{ width: "100%", height: (d.score / max) * 100, borderRadius: "6px 6px 0 0", background: `linear-gradient(to top, ${COLORS.accent}, #A78BFA)`, transition: "height 0.5s ease" }} />
                  <span style={{ color: COLORS.muted, fontSize: 9, whiteSpace: "nowrap" }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per interview breakdown */}
          <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Interview Breakdown</h3>
          {interviewHistory.slice(0, 5).map((h, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: COLORS.text, fontSize: 13 }}>{h.role}</span>
                <span style={{ color: h.score >= 80 ? COLORS.success : h.score >= 65 ? COLORS.gold : COLORS.danger, fontSize: 13, fontWeight: 700 }}>{h.score}%</span>
              </div>
              <div style={{ background: COLORS.border, borderRadius: 4, height: 6 }}>
                <div style={{ width: `${h.score}%`, height: "100%", borderRadius: 4, background: h.score >= 80 ? `linear-gradient(90deg, ${COLORS.success}, ${COLORS.accent})` : h.score >= 65 ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.accent})` : `linear-gradient(90deg, ${COLORS.danger}, ${COLORS.gold})`, transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── Profile Sub-Modals ───────────────────────────────────────
function ProfileModal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COLORS.surface, borderRadius: "24px 24px 0 0", border: `1px solid ${COLORS.border}`, maxHeight: "80vh", display: "flex", flexDirection: "column", animation: "slideUp 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border }} />
        </div>
        <div style={{ padding: "10px 20px 14px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: COLORS.text, fontSize: 17, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="close" size={15} color={COLORS.muted} />
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "18px 20px 36px" }}>{children}</div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? COLORS.accent : COLORS.border, cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────
function Profile({ user, onLogout, interviewCount }) {
  const [activeModal, setActiveModal] = useState(null);
  const [notifs, setNotifs] = useState({ daily: true, reminders: true, tips: false, updates: true });
  const [privacy, setPrivacy] = useState({ analytics: true, share: false });

  const avgScore = interviewCount > 0 ? 79 : 0;
  const streak = interviewCount > 0 ? 5 : 0;

  const MENU = [
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "privacy",       label: "Privacy Settings", icon: "🔒" },
    { key: "subscription",  label: "Subscription Plan", icon: "💎" },
    { key: "support",       label: "Help & Support", icon: "🛟" },
    { key: "about",         label: "About InterviewAI", icon: "ℹ️" },
  ];

  return (
    <div>
      {/* Avatar */}
      <div style={{ textAlign: "center", padding: "20px 0 28px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 28, fontWeight: 800, color: "#fff" }}>
          {user.name[0].toUpperCase()}
        </div>
        <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800 }}>{user.name}</h2>
        <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>{user.email}</p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 16 }}>
          {[{ v: interviewCount, l: "Interviews" }, { v: interviewCount > 0 ? avgScore + "%" : "—", l: "Avg Score" }, { v: interviewCount > 0 ? streak + "🔥" : "—", l: "Streak" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <p style={{ color: COLORS.accentLight, fontSize: 18, fontWeight: 800 }}>{s.v}</p>
              <p style={{ color: COLORS.muted, fontSize: 11 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {MENU.map(item => (
          <div key={item.key} onClick={() => setActiveModal(item.key)}
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.background = `${COLORS.accent}10`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.card; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
            </div>
            <Icon name="arrow" size={16} color={COLORS.muted} />
          </div>
        ))}
      </div>

      <button onClick={onLogout}
        style={{ width: "100%", background: `${COLORS.danger}22`, border: `1px solid ${COLORS.danger}44`, borderRadius: 14, padding: "14px", color: COLORS.danger, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
        Sign Out
      </button>

      {/* ── Notifications Modal ── */}
      {activeModal === "notifications" && (
        <ProfileModal title="🔔 Notifications" onClose={() => setActiveModal(null)}>
          {[
            { key: "daily", label: "Daily Practice Reminder", desc: "Get a daily reminder to practice one interview" },
            { key: "reminders", label: "Goal Reminders", desc: "Reminders to complete your weekly goal" },
            { key: "tips", label: "Interview Tips", desc: "New tips and tricks notifications" },
            { key: "updates", label: "App Updates", desc: "New features and improvements" },
          ].map(n => (
            <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <p style={{ color: COLORS.text, fontSize: 14, fontWeight: 600 }}>{n.label}</p>
                <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{n.desc}</p>
              </div>
              <Toggle on={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
            </div>
          ))}
        </ProfileModal>
      )}

      {/* ── Privacy Modal ── */}
      {activeModal === "privacy" && (
        <ProfileModal title="🔒 Privacy Settings" onClose={() => setActiveModal(null)}>
          {[
            { key: "analytics", label: "Usage Analytics", desc: "Share anonymous data to help improve the app" },
            { key: "share", label: "Profile Visibility", desc: "Allow other users to see your progress" },
          ].map(n => (
            <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <p style={{ color: COLORS.text, fontSize: 14, fontWeight: 600 }}>{n.label}</p>
                <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{n.desc}</p>
              </div>
              <Toggle on={privacy[n.key]} onChange={v => setPrivacy(p => ({ ...p, [n.key]: v }))} />
            </div>
          ))}
          <div style={{ marginTop: 20, background: `${COLORS.danger}10`, border: `1px solid ${COLORS.danger}30`, borderRadius: 12, padding: "14px" }}>
            <p style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Delete Account</p>
            <p style={{ color: COLORS.muted, fontSize: 12, marginBottom: 12 }}>This action is permanent. All your data will be deleted.</p>
            <button style={{ background: `${COLORS.danger}22`, border: `1px solid ${COLORS.danger}55`, borderRadius: 10, padding: "10px 16px", color: COLORS.danger, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
              Delete My Account
            </button>
          </div>
        </ProfileModal>
      )}

      {/* ── Subscription Modal ── */}
      {activeModal === "subscription" && (
        <ProfileModal title="💎 Subscription Plan" onClose={() => setActiveModal(null)}>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "16px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ color: COLORS.text, fontSize: 15, fontWeight: 700 }}>Free Plan</p>
              <span style={{ background: `${COLORS.success}22`, color: COLORS.success, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>ACTIVE</span>
            </div>
            {["5 mock interviews / month", "Basic AI feedback", "Question Bank access", "Performance analytics"].map(f => (
              <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <Icon name="check" size={14} color={COLORS.success} />
                <p style={{ color: COLORS.muted, fontSize: 13 }}>{f}</p>
              </div>
            ))}
          </div>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}20, ${COLORS.card})`, border: `1px solid ${COLORS.accent}55`, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ color: COLORS.text, fontSize: 15, fontWeight: 700 }}>Pro Plan</p>
              <span style={{ color: COLORS.accentLight, fontSize: 14, fontWeight: 800 }}>₹499/mo</span>
            </div>
            {["Unlimited mock interviews", "Detailed AI feedback + scoring", "Resume review feature", "Industry expert question sets", "Priority support"].map(f => (
              <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <Icon name="check" size={14} color={COLORS.accent} />
                <p style={{ color: COLORS.text, fontSize: 13 }}>{f}</p>
              </div>
            ))}
          </div>
          <button style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
            Upgrade to Pro →
          </button>
        </ProfileModal>
      )}

      {/* ── Help Modal ── */}
      {activeModal === "support" && (
        <ProfileModal title="🛟 Help & Support" onClose={() => setActiveModal(null)}>
          {[
            { q: "How do I start a mock interview?", a: "Tap the 'Practice' tab, choose your industry, select the number of questions, and hit Start Interview!" },
            { q: "How accurate is the AI feedback?", a: "Our AI model is trained on thousands of real interviews and provides feedback comparable to professional interviewers." },
            { q: "How are questions added?", a: "A pre-built question bank is available right now. With the Pro plan, you can add custom questions too." },
            { q: "How is the score calculated?", a: "The AI scores your answer based on clarity, structure, depth, and relevance to the question." },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 14, marginBottom: 14 }}>
              <p style={{ color: COLORS.text, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>❓ {item.q}</p>
              <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
          <div style={{ background: COLORS.card, borderRadius: 12, padding: "14px", textAlign: "center" }}>
            <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 10 }}>Need more help?</p>
            <button style={{ background: `${COLORS.accent}22`, border: `1px solid ${COLORS.accent}44`, borderRadius: 10, padding: "10px 20px", color: COLORS.accentLight, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
              📧 support@interviewai.in
            </button>
          </div>
        </ProfileModal>
      )}

      {/* ── About Modal ── */}
      {activeModal === "about" && (
        <ProfileModal title="ℹ️ About InterviewAI" onClose={() => setActiveModal(null)}>
          <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Icon name="brain" size={30} color="#fff" />
            </div>
            <p style={{ color: COLORS.text, fontSize: 20, fontWeight: 800 }}>InterviewAI</p>
            <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Version 1.0.0</p>
          </div>
          <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            InterviewAI is an AI-powered interview preparation platform that helps job seekers land their dream jobs through mock interviews, real-time feedback, and detailed performance analytics.
          </p>
          {[["Founded", "2026"], ["Users", "10,000+"], ["Questions", "500+"], ["Industries", "7"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.muted, fontSize: 13 }}>{k}</span>
              <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
          <p style={{ color: COLORS.muted, fontSize: 12, textAlign: "center", marginTop: 20 }}>Made with ❤️ in India</p>
        </ProfileModal>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
// ─── Per-user history helpers ─────────────────────────────────
async function loadUserHistory(email) {
  try {
    const r = await window.storage.get(`history:${email}`);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

async function saveUserHistory(email, history) {
  try {
    await window.storage.set(`history:${email}`, JSON.stringify(history));
  } catch {}
}

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [interviewHistory, setInterviewHistory] = useState([]);

  const handleLogin = (u) => {
    // Synchronous: user is set instantly — no waiting for storage
    setUser(u);
    setTab("home");
    setInterviewHistory([]);
    // Load history fully in background (fire-and-forget)
    ;(async () => {
      try {
        const saved = await loadUserHistory(u.email);
        const guest = await popGuestHistory();
        const merged = [...guest, ...saved];
        if (guest.length > 0) await saveUserHistory(u.email, merged);
        if (merged.length > 0) setInterviewHistory(merged);
      } catch {}
    })();
  };

  const addInterview = (entry) => {
    setInterviewHistory(prev => {
      const updated = [entry, ...prev];
      // Save in background, never block UI
      try {
        if (user?.email) saveUserHistory(user.email, updated).catch(() => {});
        else saveGuestHistory(entry).catch(() => {});
      } catch {}
      return updated;
    });
  };

  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "interview", label: "Practice", icon: "mic" },
    { id: "analytics", label: "Analytics", icon: "chart" },
    { id: "questions", label: "Questions", icon: "book" },
    { id: "profile", label: "Profile", icon: "user" },
  ];

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Sora', sans-serif", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { outline: none; }
        textarea:focus { border-color: ${COLORS.accent} !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(60%); opacity:0; } to { transform: translateX(-50%) translateY(0); opacity:1; } }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Header */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="brain" size={17} color="#fff" />
          </div>
          <span style={{ color: COLORS.text, fontSize: 16, fontWeight: 800 }}>InterviewAI</span>
        </div>
        <div onClick={() => setTab("profile")} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          {user.name[0].toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto", paddingBottom: 100 }}>
        {tab === "home" && <Dashboard user={user} interviewHistory={interviewHistory} onStartInterview={() => setTab("interview")} />}
        {tab === "interview" && <MockInterview onInterviewComplete={addInterview} />}
        {tab === "analytics" && <Analytics interviewHistory={interviewHistory} />}
        {tab === "questions" && <QuestionBank />}
        {tab === "profile" && <Profile user={user} onLogout={() => { setUser(null); setInterviewHistory([]); }} interviewCount={interviewHistory.length} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COLORS.surface, borderTop: `1px solid ${COLORS.border}`, display: "flex", padding: "8px 0 16px", zIndex: 10 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "6px 0", transition: "all 0.2s" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: tab === t.id ? `${COLORS.accent}22` : "transparent", transition: "all 0.2s" }}>
              <Icon name={t.icon} size={18} color={tab === t.id ? COLORS.accent : COLORS.muted} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: tab === t.id ? COLORS.accent : COLORS.muted, fontFamily: "'Sora', sans-serif" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
