import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from "recharts";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1,  section: "Lead Instructor Briefing",            short: "Lead Instr. Clear",           text: "Was the guidance from the course lead instructor clear?" },
  { id: 2,  section: "COMSEC Fundamentals & COR Briefings", short: "COR Instr. Clear",            text: "Was the information provided by the COR instructor clear?" },
  { id: 3,  section: "COMSEC Fundamentals & COR Briefings", short: "COMSEC Policy Understanding", text: "Did training provide better understanding of COMSEC policies, COR overview, and account best practices?" },
  { id: 4,  section: "Vault (KMI) Briefing",                short: "KMI Instr. Clear",            text: "Was the information provided by the KMI instructor clear?" },
  { id: 5,  section: "Vault (KMI) Briefing",                short: "KMI Understanding",           text: "Did training provide better understanding of KMI and what it means for your COMSEC account?" },
  { id: 6,  section: "iApp Training",                       short: "iApp Instr. Clear",           text: "Was the instruction provided by the iApp trainers clear?" },
  { id: 7,  section: "iApp Training",                       short: "iApp/iVault Understanding",   text: "Did training provide better understanding of iApp and iVault?" },
  { id: 8,  section: "RASKL (Tier 3 Device) Training",      short: "RASKL Instr. Clear",          text: "Was the instruction provided by the RASKL trainers clear?" },
  { id: 9,  section: "RASKL (Tier 3 Device) Training",      short: "RASKL Hands-On",              text: "Did training provide better understanding of hands-on use of the RASKL (Tier 3 Device)?" },
  { id: 10, section: "INE Training",                        short: "INE Instr. Clear",            text: "Was the instruction provided by the INE trainers clear?" },
  { id: 11, section: "INE Training",                        short: "KG (INE) Hands-On",           text: "Did training provide better understanding of hands-on use of KG (INE) Devices?" },
  { id: 12, section: "Audit Briefing",                      short: "Audit Instr. Clear",          text: "Was the information provided by the Audit instructor clear?" },
  { id: 13, section: "Audit Briefing",                      short: "Audit Process Understanding", text: "Did briefing provide better understanding of the COMSEC audit process?" },
  { id: 14, section: "vIPer Briefing",                      short: "vIPer Instr. Clear",          text: "Was the information provided by the vIPer instructor clear?" },
  { id: 15, section: "vIPer Briefing",                      short: "vIPer Hands-On",              text: "Did briefing provide better understanding of the hands-on use of the vIPer?" },
  { id: 16, section: "Overall Review",                      short: "Course Pace",                 text: "Was the pace of the course effective for transitioning from one training (class) to another?" },
  { id: 17, section: "Overall Review",                      short: "Mix of Activities",           text: "Was the mix of presentations and activities suitable?" },
  { id: 18, section: "Overall Review",                      short: "COMSEC Comfort Increased",    text: "Has your overall comfort level with COMSEC increased?" },
];

const RAW_SURVEYS = [
  // ── 2026-0001 (Dec 4 2025) ──────────────────────────────────────
  { course:"2026-0001", date:"2025-12-04", ccnStart:2,  ccnEnd:6,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","S"], comment:"" },
  { course:"2026-0001", date:"2025-12-04", ccnStart:1,  ccnEnd:5,   responses:["C","S","C","S","C","S","C","S","C","S","C","C","C","C","C","C","C","S"], comment:"Thank You! This training was a real BEAR! You are very patient.\nFrom my perspective, it would be very helpful to have physical visuals." },
  { course:"2026-0001", date:"2025-12-04", ccnStart:6,  ccnEnd:8,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"2026-0001", date:"2025-12-04", ccnStart:4,  ccnEnd:10,  responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Format + delivery was excellent! HVAC in classroom can be tweaked to keep it cool." },
  { course:"2026-0001", date:"2025-12-04", ccnStart:5,  ccnEnd:7,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"2026-0001", date:"2025-12-04", ccnStart:4,  ccnEnd:7,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"2026-0001", date:"2025-12-04", ccnStart:6,  ccnEnd:8,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"More upfront explanations of network & KG function for non-DT students." },
  { course:"2026-0001", date:"2025-12-04", ccnStart:8,  ccnEnd:10,  responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"The class was excellent." },
  // ── 2026-0002 (Dec 11 2025) ─────────────────────────────────────
  { course:"2026-0002", date:"2025-12-11", ccnStart:5,  ccnEnd:9,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Great Course. Feels like it is compact. May be another day or two will help. Thank you all instructors J. Piper/Chip Gran." },
  { course:"2026-0002", date:"2025-12-11", ccnStart:7,  ccnEnd:9,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"2026-0002", date:"2025-12-11", ccnStart:5,  ccnEnd:8,   responses:["C","C","C","C","S","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"2026-0002", date:"2025-12-11", ccnStart:8,  ccnEnd:8.4, responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","N","N","C","C"], comment:"" },
  // ── 2026-0003 (Feb 26 2026) ─────────────────────────────────────
  { course:"2026-0003", date:"2026-02-26", ccnStart:2,  ccnEnd:7,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"One of the best training classes taken in my career. Very professional, down to earth and best hands-on. Nothing to improve." },
  { course:"2026-0003", date:"2026-02-26", ccnStart:3,  ccnEnd:7,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"2026-0003", date:"2026-02-26", ccnStart:2,  ccnEnd:0,   responses:["C","C","S","C","C","C","C","C","C","C","C","S","C","C","C","S","C","C"], comment:"Recommend additional time on policy and audit questionnaire. Maybe consider adding an additional day to the course." },
  { course:"2026-0003", date:"2026-02-26", ccnStart:1,  ccnEnd:10,  responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"The hands on training for all devices and applications." },
  { course:"2026-0003", date:"2026-02-26", ccnStart:6,  ccnEnd:3,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Very well put together and thorough." },
  { course:"2026-0003", date:"2026-02-26", ccnStart:3,  ccnEnd:7,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Great class!" },
  { course:"2026-0003", date:"2026-02-26", ccnStart:5,  ccnEnd:8,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"All instructors were extremely knowledgeable and professional and conveyed COMSEC info clearly. I am walking away feeling confident to execute any of the instructions w/ little to no support. Additionally all instructors emphasized they're here to support us – very comforting. Thank you!" },
  { course:"2026-0003", date:"2026-02-26", ccnStart:2,  ccnEnd:8,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Awesome Instructors! Thank you all. Great learning experience." },
  { course:"2026-0003", date:"2026-02-26", ccnStart:4,  ccnEnd:8,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Very good instruction." },
  // ── IN HOUSE (May 28 2026) ──────────────────────────────────────
  { course:"IN HOUSE",  date:"2026-05-28", ccnStart:3,  ccnEnd:6,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Excellent course. J. Piper did a great job conveying the material and patiently walking students through the process." },
  { course:"IN HOUSE",  date:"2026-05-28", ccnStart:3,  ccnEnd:6,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Previously took course through FSI. Learned way more this time. I appreciate the time dedicated to put a course like this together. I would love to take again." },
  { course:"IN HOUSE",  date:"2026-05-28", ccnStart:3,  ccnEnd:5,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","S"], comment:"If possible I would have liked to spend more time in the iApp, just for more understanding on where to go / how to do certain functions and to develop comfortability navigating the system." },
  { course:"IN HOUSE",  date:"2026-05-28", ccnStart:3,  ccnEnd:5,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Good course. One confusing part in the slide was the Signing Authority took a while until I understood it was a non-App user." },
  // ── NFATC 2026-0006 (Jun 4 2026) ───────────────────────────────
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:1,  ccnEnd:7,    responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:2,  ccnEnd:4,    responses:["C","S","C","S","C","S","C","S","C","S","C","S","C","S","C","C","C","S"], comment:"Excellent job teaching complex material to people who have little to no familiarity with the content. My somewhat scores above are a reflection of me more than the instructors who did a fine + admirable job teaching. The walk-around was a nice touch. Glad that was included." },
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:3,  ccnEnd:8,    responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:7,  ccnEnd:10,   responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Much better experience than the onboarding COMSEC courses. Please keep up the great work." },
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:1,  ccnEnd:5,    responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"I would have liked more handouts, detailing the forms + processes. Being a visual learner it would have been most useful to get a conceptual picture. 3 days means you have to hit the ground running and a picture would best prepare a learner as you delve deeply and quickly into such sophisticated information." },
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:4,  ccnEnd:6,    responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Thanks to J. for his animation + professionalism." },
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:5,  ccnEnd:null, responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"Thanks for the great training!" },
  { course:"NFATC 2026-0006", date:"2026-06-04", ccnStart:4,  ccnEnd:8,    responses:["C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C","C"], comment:"" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const COLORS = { C: "#2563eb", S: "#f59e0b", N: "#ef4444" };
const LABEL  = { C: "Completely", S: "Somewhat", N: "Needs Improvement" };
const unique = arr => [...new Set(arr)];
const pct = (n, d) => d === 0 ? 0 : Math.round((n / d) * 100);

function gainOf(s) {
  return (s.ccnStart != null && s.ccnEnd != null && s.ccnEnd > 0)
    ? s.ccnEnd - s.ccnStart : null;
}

function sortRows(rows, { col, dir }) {
  const m = dir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    let va, vb;
    if (col === "date")     { va = a.date;     vb = b.date; }
    else if (col === "course")   { va = a.course;   vb = b.course; }
    else if (col === "ccnStart") { va = a.ccnStart ?? -Infinity; vb = b.ccnStart ?? -Infinity; }
    else if (col === "ccnEnd")   { va = a.ccnEnd   ?? -Infinity; vb = b.ccnEnd   ?? -Infinity; }
    else if (col === "gain")     { va = gainOf(a) ?? -Infinity;  vb = gainOf(b) ?? -Infinity; }
    else { va = a[col]; vb = b[col]; }
    return va < vb ? -m : va > vb ? m : 0;
  });
}

function tally(surveys) {
  return QUESTIONS.map(q => {
    const vals = surveys.map(s => s.responses[q.id - 1]).filter(Boolean);
    const C = vals.filter(v => v === "C").length;
    const S = vals.filter(v => v === "S").length;
    const N = vals.filter(v => v === "N").length;
    const total = C + S + N;
    return { ...q, C, S, N, total, pctC: pct(C, total), pctS: pct(S, total), pctN: pct(N, total) };
  });
}

function ccnStats(surveys) {
  const valid = surveys.filter(s => s.ccnStart != null && s.ccnEnd != null && s.ccnEnd > 0);
  if (!valid.length) return null;
  const avgGain  = (valid.reduce((a, b) => a + (b.ccnEnd - b.ccnStart), 0) / valid.length).toFixed(1);
  const avgStart = (valid.reduce((a, b) => a + b.ccnStart, 0) / valid.length).toFixed(1);
  const avgEnd   = (valid.reduce((a, b) => a + b.ccnEnd,   0) / valid.length).toFixed(1);
  return { avgGain, avgStart, avgEnd, count: valid.length };
}

function exportCSV(surveys) {
  const headers = ["Course","Date","CCN Start","CCN End","CCN Gain",
    ...QUESTIONS.map(q => `Q${q.id} - ${q.short}`), "Comment"];
  const rows = surveys.map(s => {
    const gain = gainOf(s) ?? "";
    return [s.course, s.date, s.ccnStart ?? "", s.ccnEnd ?? "", gain,
      ...s.responses.map(r => LABEL[r] || r),
      `"${(s.comment || "").replace(/"/g, "'")}"`].join(",");
  });
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = "YW772_Survey_Data.csv"; a.click();
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background:"#fff", borderRadius:10, padding:"16px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.08)", borderLeft:`4px solid ${color}` }}>
      <div style={{ fontSize:13, color:"#64748b", fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color:"#0f172a", margin:"4px 0 2px" }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"#94a3b8" }}>{sub}</div>}
    </div>
  );
}

function QuestionBar({ row }) {
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
        <span style={{ fontSize:11, color:"#64748b", width:22, flexShrink:0 }}>Q{row.id}</span>
        <span style={{ fontSize:13, color:"#1e293b", fontWeight:500, flex:1 }}>{row.short}</span>
        <span style={{ fontSize:12, color:COLORS.C, fontWeight:700, width:36, textAlign:"right" }}>{row.pctC}%</span>
      </div>
      <div style={{ display:"flex", height:10, borderRadius:5, overflow:"hidden", background:"#f1f5f9" }}>
        <div style={{ width:`${row.pctC}%`, background:COLORS.C, transition:"width .4s" }} />
        <div style={{ width:`${row.pctS}%`, background:COLORS.S }} />
        <div style={{ width:`${row.pctN}%`, background:COLORS.N }} />
      </div>
    </div>
  );
}

// Sortable column header
function SortTh({ label, col, sort, onSort, style = {} }) {
  const active = sort.col === col;
  const arrow  = active ? (sort.dir === "desc" ? " ▼" : " ▲") : " ⇅";
  return (
    <th
      onClick={() => onSort(col)}
      style={{ background:"#f1f5f9", padding:"8px 10px", textAlign:"left", fontWeight:700,
               color: active ? "#2563eb" : "#475569", fontSize:12, borderBottom:"2px solid #e2e8f0",
               cursor:"pointer", userSelect:"none", whiteSpace:"nowrap", ...style }}
    >
      {label}<span style={{ opacity: active ? 1 : 0.4, fontSize:10 }}>{arrow}</span>
    </th>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,    setActiveTab]    = useState("overview");
  const [filterCourse, setFilterCourse] = useState("ALL");
  const [ccnSort,      setCcnSort]      = useState({ col:"date", dir:"desc" });
  const [dataSort,     setDataSort]     = useState({ col:"date", dir:"desc" });
  const [cmtSort,      setCmtSort]      = useState({ col:"date", dir:"desc" });

  function toggleSort(setFn, current, col) {
    setFn(prev => prev.col === col
      ? { col, dir: prev.dir === "desc" ? "asc" : "desc" }
      : { col, dir: "desc" });
  }

  const courses = useMemo(() => ["ALL", ...unique(RAW_SURVEYS.map(s => s.course))], []);

  const filtered = useMemo(() =>
    filterCourse === "ALL" ? RAW_SURVEYS : RAW_SURVEYS.filter(s => s.course === filterCourse),
    [filterCourse]);

  const tallied       = useMemo(() => tally(filtered), [filtered]);
  const ccn           = useMemo(() => ccnStats(filtered), [filtered]);
  const totalResponses = filtered.length;
  const overallPctC   = Math.round(tallied.reduce((a, b) => a + b.pctC, 0) / tallied.length);

  const commentRows   = filtered.filter(s => s.comment?.trim());
  const commentsCount = RAW_SURVEYS.filter(s => s.comment?.trim()).length;

  // Sorted datasets
  const sortedCCN  = useMemo(() => sortRows(filtered.filter(s => s.ccnStart != null), ccnSort),  [filtered, ccnSort]);
  const sortedData = useMemo(() => sortRows(filtered, dataSort),  [filtered, dataSort]);
  const sortedCmts = useMemo(() => sortRows(commentRows, cmtSort), [commentRows, cmtSort]);

  const trendData = useMemo(() => {
    const byC = {};
    RAW_SURVEYS.forEach(s => { if (!byC[s.course]) byC[s.course] = []; byC[s.course].push(s); });
    return Object.entries(byC).map(([course, surveys]) => {
      const t = tally(surveys);
      const overall = Math.round(t.reduce((a, b) => a + b.pctC, 0) / t.length);
      const ccns = ccnStats(surveys);
      return { course, overall, avgGain: ccns ? parseFloat(ccns.avgGain) : null, n: surveys.length };
    });
  }, []);

  const sections = unique(QUESTIONS.map(q => q.section));
  const tabs = [
    { id:"overview",  label:"Overview" },
    { id:"questions", label:"By Question" },
    { id:"sections",  label:"By Section" },
    { id:"ccn",       label:"CCN Scores" },
    { id:"comments",  label:`Comments (${commentsCount})` },
    { id:"data",      label:"Raw Data" },
  ];

  const S = {
    page:      { fontFamily:"Arial, sans-serif", background:"#f8fafc", minHeight:"100vh", padding:0 },
    header:    { background:"linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", color:"#fff", padding:"20px 28px 16px" },
    hTitle:    { fontSize:22, fontWeight:800, margin:0, letterSpacing:"-.01em" },
    hSub:      { fontSize:13, opacity:.8, marginTop:4 },
    controls:  { display:"flex", alignItems:"center", gap:12, padding:"12px 28px", background:"#fff", borderBottom:"1px solid #e2e8f0", flexWrap:"wrap" },
    select:    { padding:"6px 12px", borderRadius:6, border:"1px solid #cbd5e1", fontSize:13, background:"#fff" },
    btnExport: { padding:"6px 14px", borderRadius:6, background:"#2563eb", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, marginLeft:"auto" },
    tabs:      { display:"flex", gap:0, padding:"0 28px", background:"#fff", borderBottom:"1px solid #e2e8f0" },
    tab: (a)=> { return { padding:"10px 16px", fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"none", borderBottom: a?"2px solid #2563eb":"2px solid transparent", color: a?"#2563eb":"#64748b" }; },
    body:      { padding:"20px 28px", maxWidth:1200, margin:"0 auto" },
    grid2:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 },
    grid4:     { display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, marginBottom:20 },
    card:      { background:"#fff", borderRadius:10, padding:20, boxShadow:"0 1px 4px rgba(0,0,0,.08)" },
    cardTitle: { fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:14 },
    badge: (c)=>({ display:"inline-block", padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:700,
                   background:c==="C"?"#dbeafe":c==="S"?"#fef3c7":"#fee2e2",
                   color:c==="C"?"#1d4ed8":c==="S"?"#92400e":"#991b1b" }),
    table:     { width:"100%", borderCollapse:"collapse", fontSize:13 },
    th:        { background:"#f1f5f9", padding:"8px 10px", textAlign:"left", fontWeight:700, color:"#475569", fontSize:12, borderBottom:"2px solid #e2e8f0" },
    td:        { padding:"7px 10px", borderBottom:"1px solid #f1f5f9", color:"#334155", verticalAlign:"top" },
  };

  return (
    <div style={S.page}>
      {/* HEADER */}
      <div style={S.header}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            <h1 style={S.hTitle}>YW-772 COMSEC Seminar — Survey Dashboard</h1>
            <div style={S.hSub}>Encryption Services • Student Satisfaction Tracking</div>
          </div>
          <div style={{ textAlign:"right", fontSize:13, opacity:.85 }}>
            <div>{RAW_SURVEYS.length} total surveys</div>
            <div>{unique(RAW_SURVEYS.map(s=>s.course)).length} course iterations</div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={S.controls}>
        <label style={{ fontSize:13, fontWeight:600, color:"#475569" }}>Filter by Course:</label>
        <select style={S.select} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
          {courses.map(c => <option key={c} value={c}>{c==="ALL"?"All Courses":c}</option>)}
        </select>
        <span style={{ fontSize:12, color:"#94a3b8" }}>{totalResponses} surveys shown</span>
        <button style={S.btnExport} onClick={() => exportCSV(filtered)}>⬇ Export CSV</button>
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {tabs.map(t => <button key={t.id} style={S.tab(activeTab===t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>)}
      </div>

      {/* BODY */}
      <div style={S.body}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div style={S.grid4}>
              <StatCard label="Total Responses"   value={totalResponses}              sub={`across ${unique(filtered.map(s=>s.course)).length} course(s)`} color="#2563eb" />
              <StatCard label="Completely %"      value={`${overallPctC}%`}           sub="across all 18 questions" color="#10b981" />
              <StatCard label="Avg CCN Gain"      value={ccn?`+${ccn.avgGain}`:"–"}  sub={ccn?`${ccn.avgStart} → ${ccn.avgEnd} avg`:"no CCN data"} color="#8b5cf6" />
              <StatCard label="Comments Received" value={commentRows.length}          sub="with written feedback" color="#f59e0b" />
            </div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>Response Breakdown by Section</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={sections.map(sec => {
                    const qs = tallied.filter(q => q.section===sec);
                    return { name:sec.replace(" Briefing","").replace(" Training","").replace("COMSEC Fundamentals & ",""),
                             C:Math.round(qs.reduce((a,b)=>a+b.pctC,0)/qs.length),
                             S:Math.round(qs.reduce((a,b)=>a+b.pctS,0)/qs.length),
                             N:Math.round(qs.reduce((a,b)=>a+b.pctN,0)/qs.length) };
                  })} layout="vertical" margin={{ left:90, right:20 }}>
                    <XAxis type="number" domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{ fontSize:11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize:11 }} width={90} />
                    <Tooltip formatter={(v,n)=>[`${v}%`,LABEL[n]]} />
                    <Bar dataKey="C" stackId="a" fill={COLORS.C} name="C" />
                    <Bar dataKey="S" stackId="a" fill={COLORS.S} name="S" />
                    <Bar dataKey="N" stackId="a" fill={COLORS.N} name="N" radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:8, fontSize:12 }}>
                  {["C","S","N"].map(k=><span key={k} style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:12, height:12, borderRadius:2, background:COLORS[k], display:"inline-block" }}/>{LABEL[k]}</span>)}
                </div>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Overall "Completely" % — All Questions</div>
                {tallied.map(row => <QuestionBar key={row.id} row={row} />)}
              </div>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Course-by-Course Trend — Overall "Completely" %</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{ left:10, right:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="course" tick={{ fontSize:11 }} />
                  <YAxis domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{ fontSize:11 }} />
                  <Tooltip formatter={v=>`${v}%`} />
                  <Line type="monotone" dataKey="overall" stroke="#2563eb" strokeWidth={2.5} dot={{ r:5, fill:"#2563eb" }} name="Completely %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ── BY QUESTION ── */}
        {activeTab === "questions" && (
          <div style={S.card}>
            <div style={S.cardTitle}>All 18 Questions — Detailed Results</div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>#</th>
                  <th style={S.th}>Section</th>
                  <th style={S.th}>Question</th>
                  <th style={S.th} title="Completely">C ✓</th>
                  <th style={S.th} title="Somewhat">S ~</th>
                  <th style={S.th} title="Needs Improvement">N ✗</th>
                  <th style={S.th}>Total</th>
                  <th style={S.th}>% Complete</th>
                </tr>
              </thead>
              <tbody>
                {tallied.map((row, i) => (
                  <tr key={row.id} style={{ background:i%2===0?"#fff":"#f8fafc" }}>
                    <td style={S.td}><strong>{row.id}</strong></td>
                    <td style={{ ...S.td, fontSize:11, color:"#64748b" }}>{row.section}</td>
                    <td style={S.td}>{row.text}</td>
                    <td style={{ ...S.td, fontWeight:700, color:COLORS.C }}>{row.C}</td>
                    <td style={{ ...S.td, fontWeight:700, color:COLORS.S }}>{row.S}</td>
                    <td style={{ ...S.td, fontWeight:700, color:COLORS.N }}>{row.N}</td>
                    <td style={S.td}>{row.total}</td>
                    <td style={S.td}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1, height:8, borderRadius:4, background:"#f1f5f9", overflow:"hidden" }}>
                          <div style={{ width:`${row.pctC}%`, height:"100%", background:COLORS.C, borderRadius:4 }} />
                        </div>
                        <span style={{ fontWeight:700, color:COLORS.C, fontSize:13, width:36 }}>{row.pctC}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── BY SECTION ── */}
        {activeTab === "sections" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {sections.map(sec => {
              const rows = tallied.filter(q => q.section===sec);
              const avgC = Math.round(rows.reduce((a,b)=>a+b.pctC,0)/rows.length);
              return (
                <div key={sec} style={S.card}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={S.cardTitle}>{sec}</div>
                    <span style={{ ...S.badge("C"), fontSize:13, padding:"4px 12px" }}>{avgC}% Completely</span>
                  </div>
                  {rows.map(row => <QuestionBar key={row.id} row={row} />)}
                </div>
              );
            })}
          </div>
        )}

        {/* ── CCN SCORES ── */}
        {activeTab === "ccn" && (
          <>
            {ccn && (
              <div style={{ ...S.grid4, marginBottom:20 }}>
                <StatCard label="Surveys w/ CCN" value={ccn.count}            sub="have start & end scores" color="#8b5cf6" />
                <StatCard label="Avg Start CCN"  value={ccn.avgStart}         sub="before class"            color="#64748b" />
                <StatCard label="Avg End CCN"    value={ccn.avgEnd}           sub="after class"             color="#2563eb" />
                <StatCard label="Avg CCN Gain"   value={`+${ccn.avgGain}`}   sub="points improvement"      color="#10b981" />
              </div>
            )}
            <div style={S.card}>
              <div style={S.cardTitle}>CCN Avg Gain by Course</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={trendData.filter(t=>t.avgGain!=null)} margin={{ left:10, right:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="course" tick={{ fontSize:11 }} />
                  <YAxis domain={[0,10]} tick={{ fontSize:11 }} />
                  <Tooltip />
                  <Bar dataKey="avgGain" fill="#8b5cf6" name="Avg CCN Gain" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ ...S.card, marginTop:16 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={S.cardTitle}>Individual CCN Records</div>
                <span style={{ fontSize:12, color:"#94a3b8" }}>Click a column header to sort</span>
              </div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <SortTh label="Course"    col="course"   sort={ccnSort} onSort={col => toggleSort(setCcnSort, ccnSort, col)} />
                    <SortTh label="Date"      col="date"     sort={ccnSort} onSort={col => toggleSort(setCcnSort, ccnSort, col)} />
                    <SortTh label="CCN Start" col="ccnStart" sort={ccnSort} onSort={col => toggleSort(setCcnSort, ccnSort, col)} />
                    <SortTh label="CCN End"   col="ccnEnd"   sort={ccnSort} onSort={col => toggleSort(setCcnSort, ccnSort, col)} />
                    <SortTh label="Gain"      col="gain"     sort={ccnSort} onSort={col => toggleSort(setCcnSort, ccnSort, col)} />
                  </tr>
                </thead>
                <tbody>
                  {sortedCCN.map((s, i) => {
                    const gain = gainOf(s);
                    return (
                      <tr key={i} style={{ background:i%2===0?"#fff":"#f8fafc" }}>
                        <td style={S.td}>{s.course}</td>
                        <td style={S.td}>{s.date}</td>
                        <td style={S.td}>{s.ccnStart}</td>
                        <td style={S.td}>{s.ccnEnd ?? "–"}</td>
                        <td style={{ ...S.td, fontWeight:700, color:gain>0?"#10b981":gain<0?"#ef4444":"#94a3b8" }}>
                          {gain != null ? (gain >= 0 ? `+${gain}` : gain) : "–"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── COMMENTS ── */}
        {activeTab === "comments" && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#475569" }}>Sort:</span>
              {[{col:"date",label:"Date"},{col:"course",label:"Course"}].map(({col,label}) => (
                <button key={col} onClick={() => toggleSort(setCmtSort, cmtSort, col)}
                  style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #cbd5e1", fontSize:12, fontWeight:600,
                           cursor:"pointer", background: cmtSort.col===col?"#2563eb":"#fff",
                           color: cmtSort.col===col?"#fff":"#475569" }}>
                  {label} {cmtSort.col===col ? (cmtSort.dir==="desc"?"▼":"▲") : "⇅"}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {sortedCmts.length === 0 && <div style={{ color:"#94a3b8", padding:20 }}>No comments for selected filter.</div>}
              {sortedCmts.map((s, i) => (
                <div key={i} style={{ ...S.card, borderLeft:"3px solid #2563eb" }}>
                  <div style={{ display:"flex", gap:10, marginBottom:8, fontSize:12, color:"#64748b" }}>
                    <span style={{ fontWeight:700 }}>{s.course}</span>
                    <span>•</span>
                    <span>{s.date}</span>
                  </div>
                  <div style={{ fontSize:14, color:"#1e293b", lineHeight:1.6, whiteSpace:"pre-wrap" }}>{s.comment}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── RAW DATA ── */}
        {activeTab === "data" && (
          <div style={S.card}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={S.cardTitle}>All Survey Records</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:12, color:"#94a3b8" }}>Click a header to sort</span>
                <button style={S.btnExport} onClick={() => exportCSV(filtered)}>⬇ Export CSV</button>
              </div>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ ...S.table, minWidth:900 }}>
                <thead>
                  <tr>
                    <SortTh label="Course" col="course" sort={dataSort} onSort={col => toggleSort(setDataSort, dataSort, col)} />
                    <SortTh label="Date"   col="date"   sort={dataSort} onSort={col => toggleSort(setDataSort, dataSort, col)} />
                    <SortTh label="CCN↑"   col="ccnStart" sort={dataSort} onSort={col => toggleSort(setDataSort, dataSort, col)} />
                    <SortTh label="CCN↓"   col="ccnEnd"   sort={dataSort} onSort={col => toggleSort(setDataSort, dataSort, col)} />
                    {QUESTIONS.map(q => <th key={q.id} style={{ ...S.th, minWidth:32 }} title={q.text}>Q{q.id}</th>)}
                    <th style={S.th}>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((s, i) => (
                    <tr key={i} style={{ background:i%2===0?"#fff":"#f8fafc" }}>
                      <td style={S.td}>{s.course}</td>
                      <td style={S.td}>{s.date}</td>
                      <td style={S.td}>{s.ccnStart ?? "–"}</td>
                      <td style={S.td}>{s.ccnEnd   ?? "–"}</td>
                      {s.responses.map((r, j) => (
                        <td key={j} style={{ ...S.td, textAlign:"center" }}>
                          <span style={S.badge(r)}>{r}</span>
                        </td>
                      ))}
                      <td style={{ ...S.td, maxWidth:200, fontSize:12, color:"#64748b" }}>{s.comment || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
