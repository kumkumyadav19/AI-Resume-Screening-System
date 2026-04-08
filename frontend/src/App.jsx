import { useState } from "react";

const [candidates, setCandidates] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/results")
    .then(r => r.json())
    .then(data => setCandidates(data));
}, []);

const ALL_SKILLS = ["python", "react", "nodejs", "postgresql", "aws"];

const SKILL_COLORS = {
  python: "#f5a623",
  react: "#61dafb",
  nodejs: "#68a063",
  postgresql: "#336791",
  aws: "#ff9900",
};

const STATUS_CONFIG = {
  shortlisted: { label: "Shortlisted", color: "#00e5a0" },
  reviewing: { label: "Reviewing", color: "#f5c518" },
  pending: { label: "Pending", color: "#a0a8b8" },
  rejected: { label: "Rejected", color: "#ff4d6d" },
};

function ScoreBar({ value, color = "#00e5a0", delay = 0 }) {
  return (
    <div style={{ position: "relative", height: "4px", background: "#1e2535", borderRadius: "2px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${value}%`,
          background: color,
          borderRadius: "2px",
          animation: `growBar 0.8s ease ${delay}s both`,
        }}
      />
    </div>
  );
}

function RadialScore({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#00e5a0" : score >= 60 ? "#f5c518" : "#ff4d6d";

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e2535" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
      <text x="36" y="40" textAnchor="middle" fill={color} fontSize="13" fontWeight="700" fontFamily="'DM Mono', monospace">
        {score}
      </text>
    </svg>
  );
}

function CandidateRow({ candidate, rank, isSelected, onClick }) {
  const status = STATUS_CONFIG[candidate.status];

  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "40px 72px 1fr auto auto",
        alignItems: "center",
        gap: "16px",
        padding: "14px 20px",
        cursor: "pointer",
        borderBottom: "1px solid #1a2030",
        background: isSelected ? "#131b2e" : "transparent",
        borderLeft: isSelected ? "2px solid #00e5a0" : "2px solid transparent",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#0f1626"; }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ color: "#3a4560", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>
        #{rank}
      </span>
      <RadialScore score={candidate.score} />
      <div>
        <div style={{ color: "#e8eaf2", fontWeight: "600", fontSize: "14px", marginBottom: "6px", letterSpacing: "0.02em" }}>
          {candidate.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {candidate.skills.map(s => (
            <span key={s} style={{
              padding: "2px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              fontFamily: "'DM Mono', monospace",
              background: `${SKILL_COLORS[s]}18`,
              color: SKILL_COLORS[s],
              border: `1px solid ${SKILL_COLORS[s]}44`,
              letterSpacing: "0.05em",
            }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "11px", color: "#3a4560", marginBottom: "4px" }}>
          {candidate.years} yrs exp
        </div>
      </div>
      <div>
        <span style={{
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "10px",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: `${status.color}18`,
          color: status.color,
          border: `1px solid ${status.color}44`,
        }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

function DetailPanel({ candidate, onClose }) {
  if (!candidate) return null;
  const status = STATUS_CONFIG[candidate.status];

  return (
    <div style={{
      width: "340px",
      flexShrink: 0,
      background: "#080e1c",
      borderLeft: "1px solid #1a2030",
      padding: "32px 24px",
      animation: "slideIn 0.25s ease",
      overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ color: "#3a4560", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Candidate</div>
          <div style={{ color: "#e8eaf2", fontSize: "20px", fontWeight: "700" }}>{candidate.name}</div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#3a4560", cursor: "pointer", fontSize: "18px", padding: "4px",
          lineHeight: 1,
        }}>✕</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
        <div style={{ position: "relative", textAlign: "center" }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {[0, 1, 2].map(i => (
              <circle key={i} cx="60" cy="60" r={20 + i * 18} fill="none" stroke="#1a2030" strokeWidth="1" />
            ))}
            <circle cx="60" cy="60" r={46}
              fill="none" stroke="#00e5a0" strokeWidth="6"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - candidate.score / 100)}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ filter: "drop-shadow(0 0 10px #00e5a066)" }}
            />
            <text x="60" y="55" textAnchor="middle" fill="#00e5a0" fontSize="22" fontWeight="700" fontFamily="'DM Mono', monospace">
              {candidate.score}
            </text>
            <text x="60" y="72" textAnchor="middle" fill="#3a4560" fontSize="10" fontFamily="'DM Mono', monospace">
              SCORE
            </text>
          </svg>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "#3a4560", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
          Score Breakdown
        </div>
        {[
          { label: "Semantic Match", value: candidate.similarity, color: "#7b6cf6" },
          { label: "Skill Coverage", value: candidate.skillScore, color: "#f5a623" },
          { label: "Experience", value: candidate.expScore, color: "#00e5a0" },
        ].map((item, i) => (
          <div key={item.label} style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#a0a8b8", fontSize: "12px" }}>{item.label}</span>
              <span style={{ color: item.color, fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>{item.value}%</span>
            </div>
            <ScoreBar value={item.value} color={item.color} delay={i * 0.1} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "#3a4560", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
          Skills Detected
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {ALL_SKILLS.map(s => {
            const has = candidate.skills.includes(s);
            return (
              <span key={s} style={{
                padding: "5px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "'DM Mono', monospace",
                background: has ? `${SKILL_COLORS[s]}18` : "#0f1626",
                color: has ? SKILL_COLORS[s] : "#2a3248",
                border: `1px solid ${has ? SKILL_COLORS[s] + "55" : "#1a2030"}`,
                letterSpacing: "0.05em",
              }}>{s}</span>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "#3a4560", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
          Experience
        </div>
        <div style={{ color: "#e8eaf2", fontSize: "28px", fontWeight: "700", fontFamily: "'DM Mono', monospace" }}>
          {candidate.years} <span style={{ color: "#3a4560", fontSize: "14px", fontWeight: "400" }}>years</span>
        </div>
      </div>

      <div>
        <div style={{ color: "#3a4560", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
          Status
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              style={{
                padding: "5px 14px",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: candidate.status === key ? `${cfg.color}22` : "transparent",
                color: candidate.status === key ? cfg.color : "#3a4560",
                border: `1px solid ${candidate.status === key ? cfg.color + "66" : "#1a2030"}`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(candidates[0]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = candidates.filter(c => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const avg = Math.round(candidates.reduce((a, c) => a + c.score, 0) / candidates.length * 10) / 10;
  const shortlisted = candidates.filter(c => c.status === "shortlisted").length;
  const topCandidate = candidates[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060c18; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080e1c; }
        ::-webkit-scrollbar-thumb { background: #1a2030; border-radius: 2px; }
        @keyframes growBar {
          from { width: 0%; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#060c18",
        fontFamily: "'Syne', sans-serif",
        color: "#e8eaf2",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 32px",
          borderBottom: "1px solid #1a2030",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#060c18",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "32px", height: "32px",
              background: "linear-gradient(135deg, #00e5a0, #00a8ff)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
            }}>⬡</div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: "800", letterSpacing: "0.02em" }}>RecruitAI</div>
              <div style={{ fontSize: "10px", color: "#3a4560", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Resume Screening Pipeline
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#00e5a0",
              boxShadow: "0 0 8px #00e5a0",
              animation: "pulse 2s infinite",
            }} />
            <span style={{ color: "#3a4560", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>
              Pipeline active
            </span>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderBottom: "1px solid #1a2030",
        }}>
          {[
            { label: "Total Applicants", value: MOCK_CANDIDATES.length, mono: true },
            { label: "Shortlisted", value: shortlisted, color: "#00e5a0" },
            { label: "Average Score", value: avg, color: avg >= 70 ? "#00e5a0" : "#f5c518", mono: true },
            { label: "Top Candidate", value: topCandidate.name, small: true },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: "20px 28px",
              borderRight: i < 3 ? "1px solid #1a2030" : "none",
              animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
            }}>
              <div style={{ color: "#3a4560", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: stat.small ? "16px" : "28px",
                fontWeight: "700",
                color: stat.color || "#e8eaf2",
                fontFamily: stat.mono ? "'DM Mono', monospace" : "'Syne', sans-serif",
                letterSpacing: stat.mono ? "-0.02em" : "normal",
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left: candidate list */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Filters */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #1a2030",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search candidates..."
                style={{
                  background: "#0f1626",
                  border: "1px solid #1a2030",
                  borderRadius: "6px",
                  padding: "7px 14px",
                  color: "#e8eaf2",
                  fontSize: "12px",
                  fontFamily: "'DM Mono', monospace",
                  outline: "none",
                  width: "180px",
                  marginRight: "4px",
                }}
              />
              {["all", "shortlisted", "reviewing", "pending", "rejected"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "5px",
                    fontSize: "10px",
                    fontWeight: "600",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    border: "1px solid",
                    transition: "all 0.2s",
                    background: filter === f ? "#00e5a018" : "transparent",
                    color: filter === f ? "#00e5a0" : "#3a4560",
                    borderColor: filter === f ? "#00e5a044" : "#1a2030",
                  }}
                >
                  {f}
                </button>
              ))}
              <span style={{ color: "#3a4560", fontSize: "11px", fontFamily: "'DM Mono', monospace", marginLeft: "auto" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "40px 72px 1fr auto auto",
              gap: "16px",
              padding: "10px 20px",
              borderBottom: "1px solid #1a2030",
            }}>
              {["#", "Score", "Candidate / Skills", "Exp", "Status"].map(h => (
                <div key={h} style={{ color: "#3a4560", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((c, i) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  rank={candidates.indexOf(c) + 1}
                  isSelected={selected?.id === c.id}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                />
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: "48px", textAlign: "center", color: "#3a4560", fontSize: "13px" }}>
                  No candidates match your filter.
                </div>
              )}
            </div>
          </div>

          {/* Right: detail panel */}
          {selected && (
            <DetailPanel candidate={selected} onClose={() => setSelected(null)} />
          )}
        </div>
      </div>
    </>
  );
}