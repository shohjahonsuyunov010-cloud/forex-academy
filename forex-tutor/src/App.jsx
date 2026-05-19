import { useState, useRef, useEffect } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const LESSONS = [
  {
    id: 1, module: "Asoslar", title: "Forex bozori nima?",
    duration: "8 daq", icon: "🌍", videoUrl: "https://www.youtube.com/embed/GBP-o4hADiA",
    content: `Forex (Foreign Exchange) — bu dunyodagi eng katta moliyaviy bozor. Har kuni $7 trillion dan ortiq pul aylanadi.

Asosiy tushunchalar:
• Valyuta juftliklari: EUR/USD, GBP/USD, USD/JPY
• Base valyuta / Quote valyuta
• Bid va Ask narxlar
• Spread — broker daromadi`,
    quiz: [
      { q: "Forex bozorida kunlik aylanma qancha?", opts: ["$1 trillion", "$7 trillion", "$500 billion", "$3 trillion"], ans: 1 },
      { q: "EUR/USD juftida qaysi valyuta 'base'?", opts: ["USD", "EUR", "Ikkalasi", "Hech biri"], ans: 1 },
    ]
  },
  {
    id: 2, module: "Asoslar", title: "Pip va Lot tushunchalari",
    duration: "10 daq", icon: "📏", videoUrl: "https://www.youtube.com/embed/oKKb0BIFDtU",
    content: `Pip — narxning eng kichik o'zgarishi birligi.

EUR/USD: 1.08420 → 1.08430 = 1 pip

Lot turlari:
• Standart lot: 100,000 birlik = $10/pip
• Mini lot: 10,000 birlik = $1/pip  
• Mikro lot: 1,000 birlik = $0.10/pip

Yangi boshlovchilar uchun mikro lot tavsiya etiladi!`,
    quiz: [
      { q: "1 pip standart lotda necha dollar?", opts: ["$1", "$5", "$10", "$100"], ans: 2 },
      { q: "Yangi boshlovchi uchun qaysi lot eng xavfsiz?", opts: ["Standart", "Mini", "Mikro", "Nano"], ans: 2 },
    ]
  },
  {
    id: 3, module: "Texnik Tahlil", title: "Support va Resistance",
    duration: "12 daq", icon: "📊", videoUrl: "https://www.youtube.com/embed/pMFuZPZ2eH4",
    content: `Support (Tayanch) — narx tushib, qayta ko'tarilgan daraja.
Resistance (To'siq) — narx ko'tarilib, qayta tushgan daraja.

Qoida:
• Narx supportni sindirsа → u resistance ga aylanadi
• Narx resistanceni sindirsа → u supportga aylanadi

Ular qayerdan topiladi?
1. Grafikda narx ko'p marta to'xtagan joylar
2. Round numbers (1.0800, 1.0900)
3. Oldingi high va low nuqtalar`,
    quiz: [
      { q: "Support daraja nima?", opts: ["Narx to'xtagan tepa", "Narx tushib qaytgan past daraja", "Random chiziq", "Trend chizig'i"], ans: 1 },
      { q: "Support sindirilsa nima bo'ladi?", opts: ["Support kuchayadi", "Resistance ga aylanadi", "Narx tezlashadi", "Hech narsa"], ans: 1 },
    ]
  },
  {
    id: 4, module: "Risk Menejment", title: "Stop-Loss va Take-Profit",
    duration: "15 daq", icon: "🛡️", videoUrl: "https://www.youtube.com/embed/JcRfhfmwZEQ",
    content: `Risk menejment — muvaffaqiyatli treyderning eng muhim quroli!

Stop-Loss (SL):
• Yo'qotishni cheklovchi buyruq
• Har savdoda kapitalning MAX 1-2% xavf qiling

Take-Profit (TP):
• Foydani qulflovchi buyruq
• Risk/Reward: kamida 1:2 bo'lsin

Misol: $1000 kapital
• Max yo'qotish: $20 (2%)
• Stop-Loss: 20 pip
• Take-Profit: 40 pip (1:2 RR)`,
    quiz: [
      { q: "Bir savdoda kapitalning necha % xavf qilish tavsiya etiladi?", opts: ["10%", "5%", "1-2%", "50%"], ans: 2 },
      { q: "1:2 Risk/Reward nima degani?", opts: ["1 dollar xavf, 2 dollar foyda", "2 dollar xavf, 1 dollar foyda", "Teng", "Farqi yo'q"], ans: 0 },
    ]
  },
  {
    id: 5, module: "Amaliyot", title: "Demo Savdo Strategiyasi",
    duration: "20 daq", icon: "🎯", videoUrl: "https://www.youtube.com/embed/7vSFxFUjSnc",
    content: `Demo hisob — haqiqiy bozorda, lekin virtual pul bilan mashq.

Nima uchun demo muhim?
1. Xatolaringiz uchun haqiqiy pul yo'qotmaysiz
2. Strategiyangizni sinab ko'rasiz
3. Emotsiyalarni boshqarishni o'rganasiz

Demo savdo qoidalari:
• Kamida 3 oy demo ishlating
• Haqiqiy pul kabi munosabatda bo'ling
• Savdo kundaligi yuring
• Har hafta natijalarni tahlil qiling`,
    quiz: [
      { q: "Qancha vaqt demo savdo qilish tavsiya etiladi?", opts: ["1 hafta", "1 oy", "3+ oy", "Demo shart emas"], ans: 2 },
      { q: "Demo savdoning asosiy afzalligi nima?", opts: ["Tez boyish", "Xatosiz o'rganish", "Real foyda olish", "Broker tanish"], ans: 1 },
    ]
  },
];

const SYSTEM_PROMPT = `Siz "Forex Academy" platformasining AI trading ustozi/mentori siz. O'zbek tilida professional darajada javob bering.

Qoidalar:
- FAQAT o'zbek tilida javob bering
- Har bir tushunchani chart yoki diagram bilan izohlang
- Real misollar bilan tushuntiring (sonlar bilan)
- Yangi boshlovchiga tushunarli til ishlating
- Chart kerak bo'lsa \`\`\`chart ... \`\`\` formatida ASCII chart chizing
- Har javob oxirida 1 ta savol bering

Mavzular: Pip, Lot, Leverage, Support/Resistance, Trend, Candlestick, Stop-Loss, Take-Profit, Risk menejment, Demo savdo, Valyuta juftliklari, Texnik indikatorlar (MA, RSI, MACD, Bollinger)`;

// ─── TRADE SIMULATOR DATA ────────────────────────────────────────────────────

const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF"];
function getRandPrice(pair) {
  const base = { "EUR/USD": 1.0842, "GBP/USD": 1.2654, "USD/JPY": 149.32, "AUD/USD": 0.6521, "USD/CHF": 0.8934 };
  return (base[pair] + (Math.random() - 0.5) * 0.002).toFixed(4);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function parseMsg(text) {
  const parts = [];
  const re = /```chart([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", content: text.slice(last, m.index) });
    parts.push({ type: "chart", content: m[1].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
}

// ─── MINI CANDLESTICK ────────────────────────────────────────────────────────

function MiniChart({ pair }) {
  const candles = Array.from({ length: 12 }, (_, i) => {
    const o = 100 + Math.sin(i * 0.8) * 15 + Math.random() * 5;
    const c = o + (Math.random() - 0.45) * 8;
    return { o, c, h: Math.max(o, c) + Math.random() * 3, l: Math.min(o, c) - Math.random() * 3 };
  });
  const min = Math.min(...candles.map(c => c.l));
  const max = Math.max(...candles.map(c => c.h));
  const H = 60, W = 180;
  const toY = v => H - ((v - min) / (max - min)) * H;
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      {candles.map((c, i) => {
        const x = i * (W / candles.length) + 4;
        const bull = c.c >= c.o;
        const col = bull ? "#34d399" : "#f87171";
        const top = toY(Math.max(c.o, c.c)), bot = toY(Math.min(c.o, c.c));
        return (
          <g key={i}>
            <line x1={x + 4} y1={toY(c.h)} x2={x + 4} y2={toY(c.l)} stroke={col} strokeWidth={1} />
            <rect x={x} y={top} width={8} height={Math.max(bot - top, 1)} fill={bull ? col : "none"} stroke={col} strokeWidth={1} rx={1} />
          </g>
        );
      })}
    </svg>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = "#6366f1" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function ForexAcademy() {
  const [tab, setTab] = useState("dashboard");
  const [completed, setCompleted] = useState([]);
  const [scores, setScores] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizState, setQuizState] = useState(null); // { lessonId, q, chosen, done }
  const [chatMsgs, setChatMsgs] = useState([{ role: "assistant", content: "Assalomu alaykum! 👋 Men sizning shaxsiy Forex ustozingizman.\n\nIstalgan savol bering — diagrammalar bilan tushuntiraman! 📊" }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottom = useRef(null);

  // Simulator state
  const [simPair, setSimPair] = useState("EUR/USD");
  const [simPrice, setSimPrice] = useState(getRandPrice("EUR/USD"));
  const [simLot, setSimLot] = useState("mikro");
  const [simSL, setSimSL] = useState(20);
  const [simTP, setSimTP] = useState(40);
  const [simTrades, setSimTrades] = useState([]);
  const [simBalance, setSimBalance] = useState(10000);
  const [simOpen, setSimOpen] = useState(null);
  const [simTick, setSimTick] = useState(0);
  const [prices, setPrices] = useState([parseFloat(getRandPrice("EUR/USD"))]);

  // Live price tick
  useEffect(() => {
    const t = setInterval(() => {
      setSimPrice(p => {
        const next = (parseFloat(p) + (Math.random() - 0.5) * 0.0006).toFixed(4);
        setPrices(prev => [...prev.slice(-29), parseFloat(next)]);
        return next;
      });
      setSimTick(t => t + 1);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { chatBottom.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs, chatLoading]);

  const totalLessons = LESSONS.length;
  const completedCount = completed.length;
  const avgScore = Object.values(scores).length ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) : 0;

  // ── SEND CHAT ──
  async function sendChat(text) {
    if (!text.trim() || chatLoading) return;
    const userMsg = { role: "user", content: text };
    const newMsgs = [...chatMsgs, userMsg];
    setChatMsgs(newMsgs);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("\n") || "Xato yuz berdi.";
      setChatMsgs(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMsgs(prev => [...prev, { role: "assistant", content: "Ulanish xatosi. Qayta urinib ko'ring." }]);
    } finally { setChatLoading(false); }
  }

  // ── SIMULATOR ──
  const lotPip = { mikro: 0.1, mini: 1, standart: 10 };
  function openTrade(dir) {
    if (simOpen) return;
    setSimOpen({ dir, entry: parseFloat(simPrice), sl: simSL, tp: simTP, lot: simLot, time: new Date().toLocaleTimeString() });
  }
  function closeTrade(result) {
    if (!simOpen) return;
    const pip = lotPip[simOpen.lot];
    const pips = result === "tp" ? simOpen.tp : -simOpen.sl;
    const pnl = pips * pip;
    setSimBalance(b => parseFloat((b + pnl).toFixed(2)));
    setSimTrades(prev => [{
      pair: simPair, dir: simOpen.dir, pnl: pnl.toFixed(2),
      result: result === "tp" ? "✅ Foyda" : "❌ Zarar",
      time: simOpen.time
    }, ...prev.slice(0, 9)]);
    setSimOpen(null);
  }

  // ── QUIZ ──
  function startQuiz(lesson) {
    setQuizState({ lessonId: lesson.id, q: 0, chosen: null, done: false, correct: 0 });
  }
  function answerQuiz(idx) {
    const lesson = LESSONS.find(l => l.id === quizState.lessonId);
    const correct = lesson.quiz[quizState.q].ans === idx;
    const newCorrect = quizState.correct + (correct ? 1 : 0);
    const isLast = quizState.q === lesson.quiz.length - 1;
    if (isLast) {
      const sc = Math.round((newCorrect / lesson.quiz.length) * 100);
      setScores(s => ({ ...s, [lesson.id]: sc }));
      if (sc >= 50 && !completed.includes(lesson.id)) setCompleted(c => [...c, lesson.id]);
      setQuizState(q => ({ ...q, chosen: idx, done: true, correct: newCorrect, total: lesson.quiz.length, score: sc }));
    } else {
      setQuizState(q => ({ ...q, chosen: idx, correct: newCorrect }));
      setTimeout(() => setQuizState(q => ({ ...q, q: q.q + 1, chosen: null })), 800);
    }
  }

  // ── PRICE CHART ──
  const chartH = 80, chartW = 300;
  const pMin = Math.min(...prices), pMax = Math.max(...prices);
  const pRange = pMax - pMin || 0.001;
  const pts = prices.map((p, i) => `${(i / (prices.length - 1)) * chartW},${chartH - ((p - pMin) / pRange) * (chartH - 8) - 4}`).join(" ");
  const lastDir = prices.length > 1 ? (prices[prices.length - 1] >= prices[prices.length - 2] ? "#34d399" : "#f87171") : "#34d399";

  // ── RENDER ──
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "⚡" },
    { id: "lessons", label: "Darslar", icon: "📚" },
    { id: "simulator", label: "Simulator", icon: "💹" },
    { id: "chat", label: "AI Ustoz", icon: "🤖" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 40%, #24243e 100%)", fontFamily: "'Segoe UI', sans-serif", color: "#e2e8f0" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 20px #6366f150" }}>📈</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forex Academy</div>
          <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>AI-powered • O'zbek tilida</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#a78bfa", fontFamily: "monospace" }}>
            💰 ${simBalance.toLocaleString()}
          </div>
          <div style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#34d399", fontFamily: "monospace" }}>
            {completedCount}/{totalLessons} dars
          </div>
        </div>
      </div>

      {/* ── NAV TABS ── */}
      <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setActiveLesson(null); setQuizState(null); }}
            style={{ flex: 1, minWidth: 80, padding: "12px 8px", background: tab === t.id ? "rgba(99,102,241,0.2)" : "transparent", border: "none", borderBottom: tab === t.id ? "2px solid #6366f1" : "2px solid transparent", color: tab === t.id ? "#a78bfa" : "#64748b", fontSize: 12, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px" }}>

        {/* ══════════════ DASHBOARD ══════════════ */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Welcome */}
            <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Xush kelibsiz! 🎓</div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>Forex savdosini professionallar kabi o'rganamiz.</div>
              <ProgressBar value={completedCount} max={totalLessons} color="linear-gradient(90deg,#6366f1,#8b5cf6)" />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#64748b" }}>
                <span>Umumiy progress</span>
                <span>{Math.round((completedCount / totalLessons) * 100)}%</span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Tugatilgan", val: completedCount, icon: "✅", color: "#34d399" },
                { label: "O'rt. ball", val: `${avgScore}%`, icon: "🏆", color: "#fbbf24" },
                { label: "Balans", val: `$${simBalance.toLocaleString()}`, icon: "💰", color: "#60a5fa" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Live market */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399" }} />
                Jonli bozor
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PAIRS.map(pair => {
                  const pr = getRandPrice(pair);
                  const up = Math.random() > 0.5;
                  return (
                    <div key={pair} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>{pair}</span>
                      <MiniChart pair={pair} />
                      <span style={{ fontFamily: "monospace", fontSize: 13, color: up ? "#34d399" : "#f87171" }}>{pr} {up ? "▲" : "▼"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick start */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>⚡ Tez boshlash</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {LESSONS.slice(0, 3).map(l => (
                  <button key={l.id} onClick={() => { setTab("lessons"); setActiveLesson(l); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, background: completed.includes(l.id) ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${completed.includes(l.id) ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", textAlign: "left", color: "#e2e8f0", fontFamily: "inherit" }}>
                    <span style={{ fontSize: 20 }}>{l.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{l.title}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{l.module} • {l.duration}</div>
                    </div>
                    {completed.includes(l.id) ? <span style={{ color: "#34d399", fontSize: 16 }}>✓</span> : <span style={{ color: "#6366f1", fontSize: 14 }}>→</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ LESSONS ══════════════ */}
        {tab === "lessons" && !activeLesson && !quizState && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>📚 Barcha Darslar</div>
            {["Asoslar", "Texnik Tahlil", "Risk Menejment", "Amaliyot"].map(mod => (
              <div key={mod}>
                <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, marginTop: 8 }}>{mod}</div>
                {LESSONS.filter(l => l.module === mod).map(l => (
                  <button key={l.id} onClick={() => setActiveLesson(l)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${completed.includes(l.id) ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", marginBottom: 8, color: "#e2e8f0", fontFamily: "inherit", textAlign: "left" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: completed.includes(l.id) ? "rgba(52,211,153,0.15)" : "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{l.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{l.title}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{l.duration} • {l.quiz.length} savol</div>
                      {scores[l.id] && <div style={{ fontSize: 11, color: "#fbbf24", marginTop: 2 }}>Ball: {scores[l.id]}%</div>}
                    </div>
                    {completed.includes(l.id) ? <div style={{ color: "#34d399", fontSize: 18 }}>✓</div> : <div style={{ color: "#6366f1", fontSize: 18 }}>›</div>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── LESSON DETAIL ── */}
        {tab === "lessons" && activeLesson && !quizState && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={() => setActiveLesson(null)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Orqaga</button>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden" }}>
              {/* Video */}
              <div style={{ position: "relative", paddingBottom: "52%", background: "#000" }}>
                <iframe src={activeLesson.videoUrl} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen title={activeLesson.title} />
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{activeLesson.module}</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, marginBottom: 14 }}>{activeLesson.title}</div>
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 14, fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, color: "#cbd5e1", whiteSpace: "pre-wrap" }}>{activeLesson.content}</div>
                <button onClick={() => startQuiz(activeLesson)}
                  style={{ width: "100%", marginTop: 16, padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px #6366f140" }}>
                  🎯 Testni boshlash ({activeLesson.quiz.length} savol)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {tab === "lessons" && quizState && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {quizState.done ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{quizState.score >= 50 ? "🏆" : "📖"}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                  {quizState.score >= 50 ? "Ajoyib!" : "Qayta o'rganing"}
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: quizState.score >= 50 ? "#34d399" : "#f87171", marginBottom: 16 }}>{quizState.score}%</div>
                <div style={{ color: "#94a3b8", marginBottom: 24 }}>{quizState.correct}/{quizState.total} to'g'ri javob</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setQuizState(null); setActiveLesson(null); }}
                    style={{ flex: 1, padding: 14, background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 12, color: "#a78bfa", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Darslarga qaytish</button>
                  <button onClick={() => startQuiz(LESSONS.find(l => l.id === quizState.lessonId))}
                    style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Qayta urinish</button>
                </div>
              </div>
            ) : (() => {
              const lesson = LESSONS.find(l => l.id === quizState.lessonId);
              const question = lesson.quiz[quizState.q];
              return (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700 }}>Savol {quizState.q + 1}/{lesson.quiz.length}</div>
                    <ProgressBar value={quizState.q} max={lesson.quiz.length} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, lineHeight: 1.5 }}>{question.q}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {question.opts.map((opt, i) => {
                      const chosen = quizState.chosen === i;
                      const correct = i === question.ans;
                      let bg = "rgba(255,255,255,0.05)", border = "rgba(255,255,255,0.1)", color = "#e2e8f0";
                      if (quizState.chosen !== null) {
                        if (correct) { bg = "rgba(52,211,153,0.15)"; border = "#34d399"; color = "#34d399"; }
                        else if (chosen) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; color = "#f87171"; }
                      }
                      return (
                        <button key={i} onClick={() => quizState.chosen === null && answerQuiz(i)}
                          style={{ padding: "14px 16px", background: bg, border: `1px solid ${border}`, borderRadius: 12, color, fontSize: 14, fontWeight: 600, cursor: quizState.chosen === null ? "pointer" : "default", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s" }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══════════════ SIMULATOR ══════════════ */}
        {tab === "simulator" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>💹 Demo Savdo Simulyatori</div>

            {/* Live price chart */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <select value={simPair} onChange={e => { setSimPair(e.target.value); setSimPrice(getRandPrice(e.target.value)); setPrices([parseFloat(getRandPrice(e.target.value))]); }}
                    style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 8, color: "#a78bfa", padding: "6px 10px", fontSize: 13, fontFamily: "monospace", cursor: "pointer" }}>
                    {PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 900, color: lastDir }}>{simPrice}</div>
              </div>
              <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ display: "block" }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={lastDir} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={lastDir} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline points={pts} fill="none" stroke={lastDir} strokeWidth="2" />
                <polygon points={`0,${chartH} ${pts} ${chartW},${chartH}`} fill="url(#grad)" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
                <span>Min: {pMin.toFixed(4)}</span>
                <span style={{ color: "#64748b" }}>● Jonli</span>
                <span>Max: {pMax.toFixed(4)}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Lot</div>
                  <select value={simLot} onChange={e => setSimLot(e.target.value)}
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", padding: "8px", fontSize: 12, fontFamily: "monospace" }}>
                    <option value="mikro">Mikro</option>
                    <option value="mini">Mini</option>
                    <option value="standart">Standart</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Stop-Loss (pip)</div>
                  <input type="number" value={simSL} onChange={e => setSimSL(+e.target.value)} min={5} max={100}
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, color: "#f87171", padding: "8px", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Take-Profit (pip)</div>
                  <input type="number" value={simTP} onChange={e => setSimTP(+e.target.value)} min={5} max={200}
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 8, color: "#34d399", padding: "8px", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Risk calc */}
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 10, marginBottom: 14, fontFamily: "monospace", fontSize: 11, color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                <span>Risk: <span style={{ color: "#f87171" }}>${(simSL * lotPip[simLot]).toFixed(2)}</span></span>
                <span>Potensial foyda: <span style={{ color: "#34d399" }}>${(simTP * lotPip[simLot]).toFixed(2)}</span></span>
                <span>RR: <span style={{ color: "#fbbf24" }}>1:{(simTP / simSL).toFixed(1)}</span></span>
              </div>

              {simOpen ? (
                <div>
                  <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, padding: 12, marginBottom: 10, fontFamily: "monospace", fontSize: 12 }}>
                    <div style={{ color: "#a78bfa", fontWeight: 700 }}>Ochiq pozitsiya: {simOpen.dir === "buy" ? "📈 BUY" : "📉 SELL"}</div>
                    <div style={{ color: "#64748b", marginTop: 4 }}>Kirish: {simOpen.entry} | {simOpen.time}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button onClick={() => closeTrade("tp")} style={{ padding: 14, background: "rgba(52,211,153,0.2)", border: "1px solid #34d399", borderRadius: 12, color: "#34d399", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✅ TP yopish</button>
                    <button onClick={() => closeTrade("sl")} style={{ padding: 14, background: "rgba(248,113,113,0.2)", border: "1px solid #f87171", borderRadius: 12, color: "#f87171", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>❌ SL yopish</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button onClick={() => openTrade("buy")} style={{ padding: 14, background: "linear-gradient(135deg,#059669,#34d399)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px #34d39940" }}>📈 BUY</button>
                  <button onClick={() => openTrade("sell")} style={{ padding: 14, background: "linear-gradient(135deg,#dc2626,#f87171)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px #f8717140" }}>📉 SELL</button>
                </div>
              )}
            </div>

            {/* Trade history */}
            {simTrades.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📋 Savdo tarixi</div>
                {simTrades.map((t, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < simTrades.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", fontSize: 12, fontFamily: "monospace" }}>
                    <span style={{ color: "#64748b" }}>{t.pair} {t.dir === "buy" ? "▲" : "▼"}</span>
                    <span>{t.result}</span>
                    <span style={{ color: parseFloat(t.pnl) >= 0 ? "#34d399" : "#f87171", fontWeight: 700 }}>{parseFloat(t.pnl) >= 0 ? "+" : ""}${t.pnl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ AI CHAT ══════════════ */}
        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>🤖 AI Ustoz bilan suhbat</div>

            {/* Quick questions */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {["Pip nima?", "Leverage tushuntir", "Trend qanday aniqlanadi?", "Stop-loss misol bilan"].map(q => (
                <button key={q} onClick={() => sendChat(q)}
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, color: "#a78bfa", padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
              {chatMsgs.map((m, i) => {
                const isBot = m.role === "assistant";
                const parts = parseMsg(m.content);
                return (
                  <div key={i} style={{ display: "flex", gap: 10, flexDirection: isBot ? "row" : "row-reverse", alignItems: "flex-start" }}>
                    {isBot && <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>}
                    <div style={{ maxWidth: "82%", background: isBot ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.07)", border: `1px solid ${isBot ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.1)"}`, borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px", padding: "12px 14px", fontSize: 13, lineHeight: 1.7 }}>
                      {parts.map((p, j) => p.type === "chart"
                        ? <pre key={j} style={{ background: "#0a0a1a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "10px 12px", color: "#34d399", fontFamily: "monospace", fontSize: 11, overflowX: "auto", margin: "8px 0", whiteSpace: "pre" }}>{p.content}</pre>
                        : <span key={j} style={{ whiteSpace: "pre-wrap" }}>{p.content}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                  <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "4px 14px 14px 14px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
                    {[0, 1, 2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${d * 0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatBottom} />
            </div>

            {/* Input */}
            <div style={{ position: "sticky", bottom: 0, background: "linear-gradient(to top, #0f0c29 80%, transparent)", paddingTop: 10 }}>
              <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 14, padding: "8px 8px 8px 16px" }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat(chatInput)}
                  placeholder="Savolingizni yozing..."
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit" }} />
                <button onClick={() => sendChat(chatInput)} disabled={chatLoading || !chatInput.trim()}
                  style={{ background: chatLoading || !chatInput.trim() ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, width: 40, height: 40, cursor: chatLoading || !chatInput.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, boxShadow: chatLoading || !chatInput.trim() ? "none" : "0 0 16px #6366f140" }}>
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        * { box-sizing: border-box; }
        select option { background: #1a1a4e; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.5; }
      `}</style>
    </div>
  );
}
