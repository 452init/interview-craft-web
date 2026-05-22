import { useState, useEffect, useMemo } from "react";
import "./App.css";
import { API_BASE_URL } from "./api";
import { getProfessionProfile } from "./professionOptions";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap";

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

  const professionProfile = useMemo(() => getProfessionProfile(role), [role]);
  const levels = professionProfile.seniorityLevels;
  const categories = professionProfile.areas;

  useEffect(() => {
    if (!levels.includes(level)) {
      setLevel(levels[0]);
    }

    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories, category, level, levels]);

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

  const difficultyClass = (difficulty: string) =>
    `difficulty-badge difficulty-${difficulty.toLowerCase()}`;

  return (
    <div className="app-shell">
      <div className="app-header">
        <div>
          <div className="eyebrow">Interview Intelligence</div>
          <div className="brand">The Boardroom</div>
        </div>
        <div className="brand-mark">
          <div className="brand-mark-dot" />
        </div>
      </div>

      <div className="content">
        <div className="tagline">
          <div className="headline">
            Craft the Perfect <em>Interview</em>
          </div>
          <div className="subhead">
            Precision-engineered questions for discerning professionals
          </div>
        </div>

        <div className="form-panel">
          <div className="field-group">
            <label>Position</label>
            <input className="gold-input" placeholder="e.g. Customer Success Manager" value={role} onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()} />
          </div>

          <div className="field-group">
            <label>Seniority Level</label>
            <div className="pill-group">
              {levels.map(l => (
                <button key={l} className={`pill ${level === l ? "pill-active" : "pill-inactive"}`} onClick={() => setLevel(l)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="field-group field-group-large">
            <label>Focus Area</label>
            <div className="pill-group">
              {categories.map(c => (
                <button key={c} className={`pill ${category === c ? "pill-active" : "pill-inactive"}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="actions">
            <button className="gen-btn" onClick={generate} disabled={loading || !role.trim()}>
              {loading ? "Generating..." : "Generate Questions"}
            </button>
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <div className="loading-copy">Composing your questions...</div>
          </div>
        )}

        {questions.length > 0 && (
          <div className="results">
            <div className="divider" />
            <div className="results-header">
              <div className="results-title">Interview Questions</div>
              <div className="results-count">{questions.length} PREPARED</div>
            </div>
            {questions.map((q, i) => (
              <div key={i} className={`q-card delay-${i}`}>
                <div className="q-card-content">
                  <div className="q-body">
                    <div className="q-label">Question {String(i + 1).padStart(2, "0")}</div>
                    <div className="q-text">{q.question}</div>
                  </div>
                  <div className={difficultyClass(q.difficulty)}>
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
