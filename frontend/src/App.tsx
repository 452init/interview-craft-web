import { useState, useEffect } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Question {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
}

export default function App() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Mid-Level");
  const [category, setCategory] = useState("Technical");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = FONT_URL;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const levels = ["Junior", "Mid-Level", "Senior", "Executive"];
  const categories = ["Technical", "Behavioral", "Leadership", "Problem Solving", "Cultural Fit"];

  const generate = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setError("");
    setQuestions([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: role,
          seniority: level,
          focus_area: category
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }
      setQuestions(data.questions);
    } catch {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (d: string) => ({
    Easy: "#a3c98a", Medium: "#d4a843", Hard: "#c87461"
  }[d] || "#d4a843");

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #0d1f3c 100%)",
      fontFamily: "'Crimson Pro', Georgia, serif", color: "#e8e0d0", padding: "0"
    }}>
      <style>{`
        .gold-input { background: rgba(212,168,67,0.06); border: 1px solid rgba(212,168,67,0.25); border-radius: 4px;
          color: #e8e0d0; padding: 12px 16px; font-family: 'Crimson Pro', serif; font-size: 18px; width: 100%;
          box-sizing: border-box; outline: none; transition: border-color 0.3s; }
        .gold-input:focus { border-color: rgba(212,168,67,0.7); }
        .gold-input::placeholder { color: rgba(232,224,208,0.35); }
        .pill { padding: 8px 20px; border-radius: 2px; cursor: pointer; font-size: 14px; letter-spacing: 1.5px;
          text-transform: uppercase; font-family: 'Crimson Pro', serif; transition: all 0.25s; border: 1px solid transparent; }
        .pill-active { background: #d4a843; color: #050d1a; border-color: #d4a843; }
        .pill-inactive { background: transparent; color: rgba(212,168,67,0.6); border-color: rgba(212,168,67,0.2); }
        .pill-inactive:hover { border-color: rgba(212,168,67,0.5); color: rgba(212,168,67,0.9); }
        .gen-btn { background: #d4a843; color: #050d1a; border: none; padding: 15px 48px; font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; }
        .gen-btn:hover { background: #e0b84a; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(212,168,67,0.3); }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .q-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,168,67,0.12);
          border-left: 3px solid #d4a843; padding: 22px 26px; margin-bottom: 16px;
          animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(212,168,67,0.3), transparent); margin: 40px 0; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(212,168,67,0.15)", padding: "32px 60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#d4a843", textTransform: "uppercase", marginBottom: 6 }}>Interview Intelligence</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, letterSpacing: 0.5 }}>The Boardroom</div>
        </div>
        <div style={{ width: 36, height: 36, border: "1px solid rgba(212,168,67,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 12, height: 12, background: "#d4a843", borderRadius: "50%" }} />
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "60px 40px" }}>
        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 600, lineHeight: 1.3, marginBottom: 14 }}>
            Craft the Perfect <em style={{ color: "#d4a843" }}>Interview</em>
          </div>
          <div style={{ fontSize: 18, color: "rgba(232,224,208,0.55)", fontWeight: 300, letterSpacing: 0.3 }}>
            Precision-engineered questions for discerning professionals
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,168,67,0.1)", padding: "48px 48px 40px" }}>
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#d4a843", marginBottom: 12 }}>Position</label>
            <input className="gold-input" placeholder="e.g. Customer Success Manager" value={role} onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()} />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#d4a843", marginBottom: 14 }}>Seniority Level</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {levels.map(l => (
                <button key={l} className={`pill ${level === l ? "pill-active" : "pill-inactive"}`} onClick={() => setLevel(l)}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#d4a843", marginBottom: 14 }}>Focus Area</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c} className={`pill ${category === c ? "pill-active" : "pill-inactive"}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="gen-btn" onClick={generate} disabled={loading || !role.trim()}>
              {loading ? "Generating..." : "Generate Questions"}
            </button>
          </div>
        </div>

        {/* Results */}
        {error && <div style={{ marginTop: 24, color: "#c87461", textAlign: "center", fontSize: 16 }}>{error}</div>}

        {loading && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ width: 40, height: 40, border: "2px solid rgba(212,168,67,0.15)", borderTopColor: "#d4a843", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
            <div style={{ fontSize: 15, letterSpacing: 2, color: "rgba(232,224,208,0.4)", textTransform: "uppercase" }}>Composing your questions...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {questions.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>Interview Questions</div>
              <div style={{ fontSize: 13, color: "rgba(232,224,208,0.4)", letterSpacing: 1 }}>{questions.length} PREPARED</div>
            </div>
            {questions.map((q, i) => (
              <div key={i} className="q-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, letterSpacing: 2, color: "rgba(212,168,67,0.5)", textTransform: "uppercase", marginBottom: 10 }}>Question {String(i + 1).padStart(2, "0")}</div>
                    <div style={{ fontSize: 18, lineHeight: 1.65, fontWeight: 400 }}>{q.question}</div>
                  </div>
                  <div style={{
                    fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: difficultyColor(q.difficulty),
                    border: `1px solid ${difficultyColor(q.difficulty)}40`, padding: "4px 10px", whiteSpace: "nowrap", flexShrink: 0
                  }}>
                    {q.difficulty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
