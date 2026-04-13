import { useState, useEffect, useRef } from "react";

// ─── Sample articles ───────────────────────────────────────────────────────────
const SAMPLE_ARTICLES = [
  { id: 1, source: "axios", publication: "Axios", size: "large", category: "AI & Tech", headline: "OpenAI's latest model rewrites the rules on reasoning", excerpt: "The new model demonstrates a leap in multi-step logical reasoning, outperforming human experts on several benchmark tests for the first time.", body: "OpenAI's newest model represents a fundamental shift in how large language models approach complex reasoning tasks. Unlike previous iterations that relied heavily on pattern matching, this system employs a novel chain-of-thought architecture that breaks problems into discrete logical steps before synthesising a final answer.\n\nIn independent benchmarks conducted by Stanford researchers, the model outperformed human experts on legal reasoning, advanced mathematics, and scientific hypothesis generation — three domains previously considered safely in human territory.\n\nThe implications for enterprise software are significant. Several Fortune 500 companies are already piloting the model for contract analysis and financial modelling, with early results suggesting 60–70% reductions in analyst time on routine tasks.", time: "2h ago", readTime: "4 min", color: "#FF4D4D" },
  { id: 2, source: "ft", publication: "Financial Times", size: "medium", category: "Markets", headline: "Fed signals cautious path as inflation data surprises", excerpt: "Federal Reserve officials struck a measured tone following better-than-expected CPI figures, suggesting rate cuts remain on the horizon.", body: "Federal Reserve policymakers signalled continued patience on monetary easing after March's consumer price index came in 0.2 percentage points below consensus forecasts. Core inflation fell to 3.1%, its lowest reading since early 2021.\n\nChair Jerome Powell noted the data was encouraging but stopped short of committing to a June cut timeline. Markets rallied on the news, with the S&P 500 closing up 1.4% and the 10-year Treasury yield falling 12 basis points.\n\nAnalysts at Goldman Sachs now put the probability of a June rate reduction at 68%, up from 51% before the data release.", time: "3h ago", readTime: "3 min", color: "#F9A825" },
  { id: 3, source: "nzherald", publication: "NZ Herald", size: "medium", category: "New Zealand", headline: "Govt announces $2.4B infrastructure fund for regional NZ", excerpt: "A major infrastructure package targets regional connectivity, with Northland and the West Coast among the key beneficiaries.", body: "The government unveiled a $2.4 billion regional infrastructure package directing funds toward road upgrades, broadband connectivity, and water infrastructure in areas that have historically missed out on urban-focused spending.\n\nNorthland receives the largest single allocation at $680 million, primarily for State Highway 1 upgrades between Auckland and Whangārei. The West Coast receives $340 million for flood resilience works following last year's extreme weather events.\n\nOpposition parties have questioned the funding timeline, noting that many projects will not break ground until after the next election cycle.", time: "4h ago", readTime: "2 min", color: "#2196F3" },
  { id: 4, source: "substack", publication: "The Generalist", size: "small", category: "Venture", headline: "Why seed-stage valuations are finally correcting", excerpt: "After two years of stubborn resistance, early-stage deal terms are moving back toward pre-2021 norms.", body: "Seed valuations have been the last holdout in a broader venture correction. While Series B and C rounds repriced sharply through 2023 and 2024, seed deals stayed stubbornly elevated — founders held out, angels kept writing cheques.\n\nThat's changing. Data from Carta's Q1 2026 report shows median seed pre-money valuations declining 18% year-over-year, with the most significant compression in SaaS and consumer categories. AI infrastructure remains an exception.", time: "5h ago", readTime: "6 min", color: "#FF6719" },
  { id: 5, source: "economist", publication: "The Economist", size: "small", category: "Global", headline: "The quiet reshaping of global trade routes", excerpt: "Shipping patterns are shifting in ways that will outlast current geopolitical tensions.", body: "The Red Sea crisis has accelerated a restructuring of global trade routes that was already underway. Vessels that once transited the Suez Canal are now rounding the Cape of Good Hope by default, adding 10–14 days to Europe-Asia journeys.\n\nBut the more significant shift is structural. Supply chain managers are diversifying sourcing across Southeast Asia, with Vietnam, Indonesia, and the Philippines capturing manufacturing share previously held by China.", time: "6h ago", readTime: "5 min", color: "#E3120B" },
  { id: 6, source: "techcrunch", publication: "TechCrunch", size: "medium", category: "Startups", headline: "The founders building AI-native companies from day one", excerpt: "A new generation of startups is skipping legacy infrastructure entirely, betting that AI-first architecture is a durable competitive moat.", body: "A cohort of startups founded in the last 18 months share a common architectural philosophy: no legacy code, no retrofitted AI, no 'add AI to existing product' strategy. They're building from a blank slate with AI as the operating system.\n\nContrast this with incumbents spending hundreds of millions integrating AI into systems designed in the 2000s. The AI-native startups' cost structures are fundamentally different — some run engineering teams of 8–12 people at revenue levels that previously required 80–100.", time: "7h ago", readTime: "4 min", color: "#4CAF50" },
  { id: 7, source: "axios", publication: "Axios", size: "small", category: "Policy", headline: "Senate moves on digital asset regulation bill", excerpt: "Bipartisan support is building for a framework that would bring stablecoins under federal oversight.", body: "The Senate Banking Committee advanced a bipartisan stablecoin regulation bill that would require issuers to maintain 1:1 reserves in cash or short-term Treasuries, submit to federal audits, and obtain a federal licence.\n\nThe bill's passage through committee with an 11-5 vote signals meaningful momentum, though House members have flagged concerns about preempting state-level frameworks that are already operational.", time: "8h ago", readTime: "2 min", color: "#FF4D4D" },
  { id: 8, source: "substack", publication: "Not Boring", size: "large", category: "Strategy", headline: "Why the best operators are also the best storytellers", excerpt: "How narrative clarity at the executive level correlates with compounding execution advantage for founders trying to scale.", body: "There's a pattern that shows up repeatedly in the best-run companies: the CEO is also the best communicator of what the company is doing and why. This isn't coincidental.\n\nWhen the leader can articulate strategy with precision and narrative clarity, it cascades. Teams make better decisions autonomously because they understand the 'why' behind priorities. Recruiting improves because candidates can feel the mission. Investors extend more latitude.\n\nThe inverse is equally predictable. When CEOs are fuzzy on strategy, middle management fills the void with their own interpretations. Priorities fragment. Execution becomes political rather than directional.\n\nThe implication for founders: invest in your own communication as deliberately as you invest in product.", time: "9h ago", readTime: "8 min", color: "#FF6719" },
  { id: 9, source: "ft", publication: "Financial Times", size: "small", category: "Private Equity", headline: "Buyout firms face pressure as exit markets remain subdued", excerpt: "LPs are pushing back on long hold periods as distributions slow to a trickle.", body: "Private equity firms are facing mounting pressure from limited partners as exit markets remain sluggish and distributions continue to disappoint.\n\nThe average hold period for buyout-backed companies has stretched to 6.2 years, up from 4.8 years pre-pandemic, according to data from Preqin. For many LPs, this means capital is tied up far longer than modelled in their original commitments.\n\nSeveral large pension funds have begun quietly reducing their PE allocations in secondary markets, accepting discounts of 15–20% to reclaim liquidity.", time: "10h ago", readTime: "3 min", color: "#F9A825" },
  { id: 10, source: "nzherald", publication: "NZ Herald", size: "medium", category: "New Zealand", headline: "Reserve Bank holds rates as housing market shows signs of life", excerpt: "The RBNZ opted for a pause citing global uncertainty, even as domestic indicators point to a gradual recovery.", body: "The Reserve Bank of New Zealand held the Official Cash Rate steady at 3.75% at its April meeting, citing persistent global uncertainty as the primary reason for caution.\n\nGovernor Adrian Orr noted that while domestic inflation is tracking toward target, the external environment — particularly US tariff policy and Chinese demand weakness — warrants a watchful approach.\n\nHousing data released this week showed a 4.2% lift in nationwide median prices over the March quarter, the strongest quarterly gain since mid-2021, suggesting monetary easing is beginning to filter through.", time: "11h ago", readTime: "3 min", color: "#2196F3" },
  { id: 11, source: "techcrunch", publication: "TechCrunch", size: "small", category: "AI & Tech", headline: "Anthropic raises $3.5B at $61B valuation in latest round", excerpt: "The funding round underscores continued investor appetite for frontier AI despite market volatility.", body: "Anthropic has closed a $3.5 billion funding round at a $61 billion post-money valuation, cementing its position as one of the most valuable AI companies globally.\n\nThe round was led by Google, which has now committed over $3 billion to the company across multiple tranches. Amazon also participated, as part of its broader $4 billion commitment announced last year.\n\nThe capital will primarily fund compute infrastructure and expanded safety research, with a portion allocated to international expansion into the UK, Europe, and Asia-Pacific markets.", time: "12h ago", readTime: "3 min", color: "#4CAF50" },
  { id: 12, source: "substack", publication: "The Diff", size: "medium", category: "Finance", headline: "The hidden leverage in modern fintech balance sheets", excerpt: "Off-balance-sheet arrangements are back, and regulators are only beginning to notice.", body: "A quiet structural risk is building across a cohort of consumer fintech companies that have grown rapidly by partnering with chartered banks rather than obtaining their own licences.\n\nThe arrangement — often called the 'bank-as-a-service' model — allows fintechs to offer regulated financial products without holding bank capital requirements. But it creates a complex web of contingent liabilities that don't show up cleanly on either party's balance sheet.\n\nRegulators in the US and UK are now scrutinising these arrangements more closely, with several enforcement actions expected in H2 2026.", time: "13h ago", readTime: "5 min", color: "#FF6719" },
];

const ALL_SOURCES = [...new Map(SAMPLE_ARTICLES.map(a => [a.source, { id: a.source, name: a.publication, color: a.color }])).values()];

const DEFAULT_PROFILE = {
  id: "default",
  name: "Morning VC Briefing",
  context: "I'm the CEO of NZGCP, a New Zealand Crown-owned venture capital entity. We run a seed fund (Aspire) and a VC fund of funds (Elevate). I have an investment and financial background. Frame briefings through the lens of what matters for the NZ startup ecosystem, venture capital trends, and global macro relevant to our portfolio.",
  tone: "analytical", length: "standard", schedule: "weekdays",
  scheduleTime: "07:00", delivery: ["app"], email: "", whatsapp: "", scope: "email",
};

// ─── Card size grid rules ──────────────────────────────────────────────────────
const CARD_SIZES = {
  large:  { gridColumn: "span 2", gridRow: "span 2", minHeight: 280 },
  medium: { gridColumn: "span 1", gridRow: "span 2", minHeight: 220 },
  small:  { gridColumn: "span 1", gridRow: "span 1", minHeight: 140 },
};

// ─── Themes ────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#080808", cardBg: (color) => `linear-gradient(145deg, #111 0%, #181818 100%)`,
  header: "#080808ee", sidebar: "#080808",
  text: "#ffffff", textMuted: "#ffffff60", textFaint: "#ffffff28",
  border: "#ffffff12", border2: "#ffffff08",
  chip: "#ffffff10", chipBorder: "#ffffff18",
  active: "#ffffff10", activeBorder: "#ffffff20",
  inputBg: "#111", summaryBg: "#0d0d0d",
  modalBg: "#0c0c0c", cardBg2: "#0f0f0f",
};
const LIGHT = {
  bg: "#f0ebe0", cardBg: (color) => `linear-gradient(145deg, #ffffff 0%, #f5f0e8 100%)`,
  header: "#f0ebe0ee", sidebar: "#f0ebe0",
  text: "#1a1208", textMuted: "#1a120870", textFaint: "#1a120840",
  border: "#1a120814", border2: "#1a12080a",
  chip: "#1a12080c", chipBorder: "#1a120818",
  active: "#1a120810", activeBorder: "#1a12081a",
  inputBg: "#fff", summaryBg: "#e8e2d5",
  modalBg: "#fff", cardBg2: "#faf6ef",
};

const mono = "'Space Mono', monospace";
const serif = "'Playfair Display', Georgia, serif";
const lora = "'Lora', serif";

// ─── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({ article, onClick, isSaved, onSave, T, dark }) {
  const [hovered, setHovered] = useState(false);
  const sz = CARD_SIZES[article.size || "medium"];
  const accent = article.color || "#888";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...sz,
        background: T.cardBg(accent),
        borderRadius: 8,
        padding: article.size === "small" ? "16px" : "22px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,${dark ? 0.6 : 0.15}), 0 0 0 1px ${accent}40`
          : `0 2px 12px rgba(0,0,0,${dark ? 0.4 : 0.08}), 0 0 0 1px ${dark ? "#ffffff0a" : "#1a12080a"}`,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: "8px 8px 0 0" }} />

      {/* Decorative circle */}
      <div style={{ position: "absolute", bottom: -50, right: -50, width: 150, height: 150, borderRadius: "50%", background: `${accent}10`, transition: "transform 0.4s", transform: hovered ? "scale(1.5)" : "scale(1)" }} />

      {/* Save button */}
      <button onClick={e => { e.stopPropagation(); onSave(article); }} style={{
        position: "absolute", top: 14, right: 14, zIndex: 2,
        background: isSaved ? accent : dark ? "#ffffff18" : "#1a120810",
        border: `1px solid ${isSaved ? accent : dark ? "#ffffff20" : "#1a120818"}`,
        borderRadius: 4, padding: "3px 8px",
        color: isSaved ? "#fff" : T.textMuted,
        fontFamily: mono, fontSize: 9, fontWeight: 700, cursor: "pointer",
        opacity: hovered || isSaved ? 1 : 0, transition: "opacity 0.2s",
      }}>{isSaved ? "✓ SAVED" : "+ SAVE"}</button>

      {/* Content */}
      <div onClick={() => onClick(article)}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10, marginTop: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: mono, letterSpacing: "0.1em", textTransform: "uppercase" }}>{article.publication}</span>
          <span style={{ color: T.textFaint }}>·</span>
          <span style={{ fontSize: 10, color: T.textMuted, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.06em" }}>{article.category}</span>
        </div>
        <h3 style={{ fontFamily: serif, fontSize: article.size === "large" ? 22 : article.size === "medium" ? 17 : 14, fontWeight: 700, color: T.text, lineHeight: 1.35, margin: "0 0 10px 0" }}>
          {article.headline}
        </h3>
        {article.size !== "small" && (
          <p style={{ fontFamily: lora, fontSize: 12, color: T.textMuted, lineHeight: 1.75, margin: 0 }}>
            {article.excerpt}
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, position: "relative", zIndex: 1 }} onClick={() => onClick(article)}>
        <span style={{ fontSize: 10, color: T.textFaint, fontFamily: mono }}>{article.time}</span>
        <span style={{ fontSize: 10, color: accent, fontFamily: mono, opacity: hovered ? 1 : 0.5, transition: "opacity 0.2s" }}>{article.readTime} →</span>
      </div>
    </div>
  );
}

// ─── Reading Modal ─────────────────────────────────────────────────────────────
function ReadingModal({ article, onClose, isSaved, onSave, T, dark }) {
  const [mode, setMode] = useState("rich"); // rich | plain
  if (!article) return null;
  const paras = (article.body || article.excerpt || "No content available.").split("\n\n");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: mode === "plain" ? "#f5f1e8" : dark ? "#0e0e0e" : "#fff", border: `1px solid ${mode === "plain" ? "#d4c9b0" : article.color + "40"}`, borderRadius: 10, maxWidth: 680, width: "100%", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>

        {/* Toolbar */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${mode === "plain" ? "#d4c9b0" : dark ? "#ffffff10" : "#0000000a"}`, display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {["rich", "plain"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ background: mode === m ? (m === "rich" ? article.color : "#8B7355") : "transparent", border: `1px solid ${mode === m ? (m === "rich" ? article.color : "#8B7355") : dark ? "#ffffff20" : "#00000015"}`, color: mode === m ? "#fff" : dark ? "#ffffff50" : "#00000050", borderRadius: 4, padding: "5px 12px", cursor: "pointer", fontSize: 10, fontFamily: mono, fontWeight: 700, textTransform: "uppercase" }}>{m}</button>
          ))}
          <button onClick={() => onSave(article)} style={{ background: isSaved ? "#4CAF50" : "transparent", border: `1px solid ${isSaved ? "#4CAF50" : dark ? "#ffffff20" : "#00000015"}`, color: isSaved ? "#fff" : dark ? "#ffffff50" : "#00000050", borderRadius: 4, padding: "5px 12px", cursor: "pointer", fontSize: 10, fontFamily: mono, fontWeight: 700 }}>{isSaved ? "✓ SAVED" : "+ SAVE"}</button>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: dark ? "#ffffff40" : "#00000040" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 40px", overflowY: "auto", flex: 1 }}>
          {mode === "rich" ? (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: article.color, textTransform: "uppercase", fontFamily: mono }}>{article.publication}</span>
                <span style={{ color: dark ? "#ffffff20" : "#00000020" }}>·</span>
                <span style={{ fontSize: 11, color: dark ? "#ffffff40" : "#00000045", textTransform: "uppercase", fontFamily: mono }}>{article.category}</span>
              </div>
              <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: dark ? "#fff" : "#1a1208", lineHeight: 1.3, marginBottom: 20 }}>{article.headline}</h2>
              <div style={{ width: 36, height: 3, background: article.color, borderRadius: 2, marginBottom: 24 }} />
              {paras.map((p, i) => <p key={i} style={{ fontFamily: lora, fontSize: 16, color: dark ? "#ffffffcc" : "#2a2218", lineHeight: 1.9, marginBottom: 18 }}>{p}</p>)}
            </>
          ) : (
            <>
              <p style={{ fontFamily: mono, fontSize: 10, color: "#8B7355", marginBottom: 14, letterSpacing: "0.1em" }}>{article.publication?.toUpperCase()} · {article.category?.toUpperCase()} · {article.time?.toUpperCase()}</p>
              <h2 style={{ fontFamily: "'Courier New', monospace", fontSize: 22, fontWeight: 700, color: "#2c2010", lineHeight: 1.4, marginBottom: 20, borderBottom: "2px solid #8B7355", paddingBottom: 16 }}>{article.headline}</h2>
              {paras.map((p, i) => <p key={i} style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: "#3a2c18", lineHeight: 1.95, marginBottom: 18 }}>{p}</p>)}
            </>
          )}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${mode === "plain" ? "#d4c9b0" : dark ? "#ffffff10" : "#0000000a"}` }}>
            <span style={{ fontSize: 10, color: mode === "plain" ? "#8B7355" : dark ? "#ffffff25" : "#00000030", fontFamily: mono }}>{article.time} · {article.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Podcast Player ────────────────────────────────────────────────────────────
function PodcastPlayer({ script, isGenerating, profileName, T, dark }) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wordIdx, setWordIdx] = useState(-1);
  const words = script ? script.split(" ") : [];
  const duration = Math.max(1, Math.ceil(words.length / 150));

  const startPlay = () => {
    if (!script) return;
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(script);
    u.rate = 0.88; u.pitch = 1.0;
    const voices = window.speechSynthesis?.getVoices() || [];
    const v = voices.find(v => v.name.includes("Daniel") || v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Moira"));
    if (v) u.voice = v;
    u.onboundary = e => {
      if (e.name === "word") {
        const i = script.substring(0, e.charIndex).split(" ").length - 1;
        setWordIdx(i);
        setProgress(Math.round((i / words.length) * 100));
      }
    };
    u.onend = () => { setPlaying(false); setPaused(false); setProgress(100); };
    window.speechSynthesis?.speak(u);
    setPlaying(true); setPaused(false);
  };

  const togglePause = () => {
    if (paused) { window.speechSynthesis?.resume(); setPaused(false); setPlaying(true); }
    else { window.speechSynthesis?.pause(); setPaused(true); setPlaying(false); }
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false); setPaused(false); setProgress(0); setWordIdx(-1);
  };

  const elapsed = Math.ceil((progress / 100) * duration * 60);

  return (
    <div style={{ background: dark ? "linear-gradient(135deg,#111,#181818)" : "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: dark ? "none" : "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: (isGenerating || !script) ? 0 : 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg,#FF6719,#FF4D4D)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: "0 6px 20px rgba(255,103,25,0.35)" }}>🎙</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 2 }}>{profileName || "Morning Briefing"}</div>
          <div style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, letterSpacing: "0.1em" }}>AI-GENERATED · ~{duration} MIN · {words.length} WORDS</div>
        </div>
        {!isGenerating && script && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={playing ? togglePause : startPlay} style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#FF6719,#FF4D4D)", border: "none", cursor: "pointer", fontSize: 16, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(255,103,25,0.4)" }}>
              {playing ? "⏸" : paused ? "▶" : "▶"}
            </button>
            <button onClick={stop} style={{ width: 44, height: 44, borderRadius: 10, background: T.chip, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 14, color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>⏹</button>
          </div>
        )}
      </div>

      {isGenerating && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", paddingTop: 16 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6719", animation: `pulse ${1.2}s ${i*0.2}s infinite ease-in-out` }} />)}
          <span style={{ fontFamily: mono, fontSize: 11, color: T.textFaint, marginLeft: 8 }}>Writing your briefing...</span>
        </div>
      )}

      {!isGenerating && script && (
        <>
          {/* Progress */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ background: T.chip, borderRadius: 4, height: 4, marginBottom: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#FF6719,#FF4D4D)", width: `${progress}%`, transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: T.textFaint, fontFamily: mono }}>{Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,"0")}</span>
              <span style={{ fontSize: 9, color: T.textFaint, fontFamily: mono }}>{duration}:00</span>
            </div>
          </div>
          {/* Transcript */}
          <div style={{ maxHeight: 160, overflowY: "auto", fontFamily: lora, fontSize: 13, lineHeight: 1.9, borderTop: `1px solid ${T.border2}`, paddingTop: 14 }}>
            {words.map((w, i) => (
              <span key={i} style={{ color: i === wordIdx ? "#FF6719" : i < wordIdx ? T.textFaint : T.textMuted, fontWeight: i === wordIdx ? 700 : 400, transition: "color 0.1s" }}>{w}{" "}</span>
            ))}
          </div>
        </>
      )}

      {!isGenerating && !script && (
        <div style={{ paddingTop: 16, fontFamily: mono, fontSize: 11, color: T.textFaint }}>
          Select a profile and hit Generate ↓
        </div>
      )}
    </div>
  );
}

// ─── Briefing View ─────────────────────────────────────────────────────────────
function BriefingView({ articles, profiles, userProfile, T, dark }) {
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(profiles[0]?.id || "default");
  const [lastTime, setLastTime] = useState(null);
  const profile = profiles.find(p => p.id === selectedId) || profiles[0];

  const TONE_MAP = {
    analytical: "data-driven, precise, investment-focused — highlight numbers, trends, and implications",
    executive:  "high-level, strategic, concise — lead with the 'so what'",
    conversational: "warm, intelligent, like a well-read friend — insightful but never stiff",
  };
  const LENGTH_MAP = { quick: 200, standard: 420, deep: 820 };

  const generate = async () => {
    if (!profile) return;
    setIsGenerating(true); setScript(""); setError("");
    try {
      const articleText = articles.slice(0, 12).map(a =>
        `SOURCE: ${a.publication} (${a.category})\nHEADLINE: ${a.headline}\nDETAIL: ${a.body || a.excerpt}`
      ).join("\n\n---\n\n");

      const wordTarget = LENGTH_MAP[profile.length] || 420;
      const toneDesc = TONE_MAP[profile.tone] || TONE_MAP.analytical;
      const name = userProfile?.name || "the reader";
      const context = userProfile?.context || "";
      const profileCtx = profile.context || "";

      const system = `You are writing a personal morning briefing podcast script.
ABOUT THE LISTENER: ${name}. ${context}
THIS BRIEFING'S INSTRUCTIONS: ${profileCtx}
STYLE: ${toneDesc} tone. ~${wordTarget} words. Pure flowing spoken prose — no bullet points, no headers, no markdown. Open with a compelling hook. Cover each story with insight and context, not just facts. Where relevant, connect to the listener's world. Close with a brief forward look. Sound natural when read aloud.`;

      const prompt = profile.scope === "web"
        ? `Here are today's newsletter stories. Write the briefing and weave in broader global context — markets, AI, geopolitics, NZ business:\n\n${articleText}`
        : `Here are today's newsletter stories. Write the briefing tailored for ${name}:\n\n${articleText}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          system,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      if (!text) throw new Error("Empty response");
      setScript(text);
      setLastTime(new Date().toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError(e.message || "Generation failed. Check connection and try again.");
    }
    setIsGenerating(false);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 820 }}>
      <h2 style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 4 }}>Briefings</h2>
      <p style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, marginBottom: 24, letterSpacing: "0.15em" }}>AI-GENERATED PODCAST · LISTEN OR READ</p>

      <PodcastPlayer script={script} isGenerating={isGenerating} profileName={profile?.name} T={T} dark={dark} />

      {/* Profile selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, marginBottom: 10, letterSpacing: "0.15em" }}>BRIEFING PROFILE</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {profiles.map(p => (
            <button key={p.id} onClick={() => { setSelectedId(p.id); setScript(""); }} style={{ background: selectedId === p.id ? T.active : "transparent", border: `1px solid ${selectedId === p.id ? T.activeBorder : T.border}`, color: selectedId === p.id ? T.text : T.textMuted, borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontFamily: mono, fontSize: 11, transition: "all 0.15s" }}>
              {p.name}
              {p.schedule !== "manual" && <span style={{ marginLeft: 6, fontSize: 9, color: "#FF6719" }}>● {p.schedule}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Scope + delivery badges + generate */}
      <div style={{ display: "flex", gap: 8, marginBottom: error ? 14 : 24, flexWrap: "wrap", alignItems: "center" }}>
        {[["email","📧","Newsletters only"],["web","🌐","Newsletters + broader news"]].map(([id,icon,label]) => (
          <span key={id} style={{ fontFamily: mono, fontSize: 10, color: profile?.scope === id ? T.text : T.textFaint, background: profile?.scope === id ? T.active : "transparent", border: `1px solid ${profile?.scope === id ? T.activeBorder : T.border2}`, borderRadius: 6, padding: "6px 12px" }}>{icon} {label}</span>
        ))}
        {profile?.delivery?.includes("email") && profile?.email && (
          <span style={{ fontFamily: mono, fontSize: 9, color: "#4CAF50", background: "#4CAF5015", border: "1px solid #4CAF5030", padding: "4px 10px", borderRadius: 20 }}>📧 {profile.email}</span>
        )}
        {profile?.delivery?.includes("whatsapp") && profile?.whatsapp && (
          <span style={{ fontFamily: mono, fontSize: 9, color: "#25D366", background: "#25D36615", border: "1px solid #25D36630", padding: "4px 10px", borderRadius: 20 }}>💬 {profile.whatsapp}</span>
        )}
        <button onClick={generate} disabled={isGenerating} style={{ marginLeft: "auto", background: isGenerating ? T.chip : "linear-gradient(135deg,#FF6719,#FF4D4D)", border: "none", color: isGenerating ? T.textFaint : "#fff", padding: "9px 22px", borderRadius: 6, cursor: isGenerating ? "not-allowed" : "pointer", fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", boxShadow: isGenerating ? "none" : "0 4px 18px rgba(255,103,25,0.35)", transition: "all 0.2s" }}>
          {isGenerating ? "GENERATING..." : "GENERATE"}
        </button>
      </div>

      {error && <div style={{ background: "#FF4D4D12", border: "1px solid #FF4D4D30", borderRadius: 6, padding: "11px 14px", marginBottom: 20 }}><span style={{ fontFamily: mono, fontSize: 11, color: "#FF6666" }}>{error}</span></div>}
      {lastTime && <div style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, marginBottom: 20 }}>Generated at {lastTime}</div>}

      {/* Article list */}
      <div style={{ borderTop: `1px solid ${T.border2}`, paddingTop: 20 }}>
        <div style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, marginBottom: 14, letterSpacing: "0.12em" }}>{articles.length} STORIES IN THIS BRIEFING</div>
        {articles.map(a => (
          <div key={a.id} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: `1px solid ${T.border2}`, alignItems: "flex-start" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color || "#888", marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, marginBottom: 2 }}>{a.publication} · {a.category}</div>
              <div style={{ fontFamily: lora, fontSize: 13, color: T.textMuted }}>{a.headline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Saved View ────────────────────────────────────────────────────────────────
function SavedView({ savedIds, allArticles, onOpen, onRemove, T, dark }) {
  const saved = allArticles.filter(a => savedIds.includes(a.id));
  if (!saved.length) return (
    <div style={{ padding: "100px 32px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📌</div>
      <div style={{ fontFamily: mono, fontSize: 11, color: T.textFaint, lineHeight: 1.9 }}>No saved articles yet.<br />Hover any card and hit + SAVE.</div>
    </div>
  );
  return (
    <div style={{ padding: "28px 32px" }}>
      <h2 style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 6 }}>Saved</h2>
      <p style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, marginBottom: 24, letterSpacing: "0.12em" }}>{saved.length} ARTICLE{saved.length !== 1 ? "S" : ""} FOR LATER</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {saved.map(a => (
          <div key={a.id} style={{ background: T.cardBg2, border: `1px solid ${T.border2}`, borderLeft: `3px solid ${a.color}`, borderRadius: 8, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onOpen(a)}>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: a.color, fontFamily: mono }}>{a.publication}</span>
                <span style={{ color: T.textFaint }}>·</span>
                <span style={{ fontSize: 10, color: T.textFaint, fontFamily: mono }}>{a.category} · {a.readTime}</span>
              </div>
              <h3 style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.4, marginBottom: 6 }}>{a.headline}</h3>
              <p style={{ fontFamily: lora, fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>{a.excerpt}</p>
            </div>
            <button onClick={() => onRemove(a.id)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 4, color: T.textFaint, padding: "4px 10px", cursor: "pointer", fontSize: 10, fontFamily: mono, flexShrink: 0 }}>REMOVE</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings View ─────────────────────────────────────────────────────────────
function SettingsView({ userProfile, setUserProfile, profiles, setProfiles, T, dark, onSaveAll, justSaved }) {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(null);

  const upd = (id, field, val) => setProfiles(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  const ep = editing ? profiles.find(p => p.id === editing) : null;

  const Btn = ({ label, active, onClick, color }) => (
    <button onClick={onClick} style={{ background: active ? (color ? `${color}20` : T.active) : "transparent", border: `1px solid ${active ? (color || T.activeBorder) : T.border}`, color: active ? (color || T.text) : T.textMuted, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontFamily: mono, fontSize: 10, transition: "all 0.15s" }}>{label}</button>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );

  const inputStyle = { width: "100%", background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "10px 14px", color: T.text, fontFamily: mono, fontSize: 11, outline: "none" };
  const taStyle = { ...inputStyle, fontFamily: lora, fontSize: 13, resize: "vertical", lineHeight: 1.7 };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Sidebar */}
      <div style={{ width: 180, borderRight: `1px solid ${T.border2}`, padding: "28px 0 28px 32px", flexShrink: 0 }}>
        <div style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, letterSpacing: "0.18em", marginBottom: 16 }}>SETTINGS</div>
        {[["profile","👤","My Profile"],["briefings","🎙","Briefings"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: "block", width: "100%", padding: "9px 0 9px 14px", background: "none", border: "none", borderLeft: tab === id ? "2px solid #FF6719" : "2px solid transparent", color: tab === id ? T.text : T.textMuted, textAlign: "left", cursor: "pointer", fontFamily: mono, fontSize: 11, marginLeft: -14, transition: "all 0.12s" }}>{icon} {label}</button>
        ))}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${T.border2}` }}>
          <button onClick={onSaveAll} style={{ background: justSaved ? "#4CAF50" : "linear-gradient(135deg,#FF6719,#FF4D4D)", border: "none", color: justSaved ? "#000" : "#fff", padding: "9px 16px", borderRadius: 6, cursor: "pointer", fontFamily: mono, fontSize: 10, fontWeight: 700, width: "100%", transition: "all 0.2s" }}>{justSaved ? "✓ SAVED" : "SAVE ALL"}</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {tab === "profile" && (
          <>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 6 }}>My Profile</h3>
            <p style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, marginBottom: 28, letterSpacing: "0.1em" }}>THIS CONTEXT IS INJECTED INTO EVERY BRIEFING CLAUDE GENERATES FOR YOU</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
              <Field label="Your name"><input style={inputStyle} value={userProfile.name} onChange={e => setUserProfile(p => ({...p, name: e.target.value}))} placeholder="e.g. James" /></Field>
              <Field label="Role"><input style={inputStyle} value={userProfile.role} onChange={e => setUserProfile(p => ({...p, role: e.target.value}))} placeholder="e.g. CEO, NZGCP" /></Field>
            </div>
            <Field label="Context for Claude">
              <p style={{ fontFamily: lora, fontSize: 12, color: T.textMuted, lineHeight: 1.7, marginBottom: 10 }}>Tell Claude who you are. The more specific, the better briefing you get.</p>
              <textarea rows={6} style={taStyle} value={userProfile.context} onChange={e => setUserProfile(p => ({...p, context: e.target.value}))} placeholder="e.g. I'm the CEO of NZGCP, a NZ Crown-owned VC entity. We run Aspire (seed) and Elevate (fund of funds). I care about the NZ startup ecosystem, global VC trends, AI, and macro conditions affecting risk capital." />
            </Field>
            <Field label="Key interests"><input style={inputStyle} value={userProfile.interests} onChange={e => setUserProfile(p => ({...p, interests: e.target.value}))} placeholder="e.g. Venture capital, AI/ML, NZ economy, fintech, climate tech" /></Field>
          </>
        )}

        {tab === "briefings" && !editing && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 4 }}>Briefing Profiles</h3>
                <p style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, letterSpacing: "0.1em" }}>MULTIPLE BRIEFINGS, DIFFERENT CONTEXTS & SCHEDULES</p>
              </div>
              <button onClick={() => { const id = `p-${Date.now()}`; setProfiles(prev => [...prev, {...DEFAULT_PROFILE, id, name: "New Briefing"}]); setEditing(id); }} style={{ background: T.active, border: `1px solid ${T.border}`, color: T.text, padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontFamily: mono, fontSize: 10, fontWeight: 700 }}>+ NEW</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {profiles.map(p => (
                <div key={p.id} style={{ background: T.cardBg2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>{p.name}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {[p.tone, p.length, p.schedule].map(tag => <span key={tag} style={{ fontFamily: mono, fontSize: 9, color: T.textFaint, background: T.chip, padding: "3px 8px", borderRadius: 20, border: `1px solid ${T.border}` }}>{tag}</span>)}
                      {p.schedule !== "manual" && <span style={{ fontFamily: mono, fontSize: 9, color: "#FF6719", background: "#FF671912", padding: "3px 8px", borderRadius: 20 }}>{p.scheduleTime}</span>}
                      {p.delivery?.includes("email") && p.email && <span style={{ fontFamily: mono, fontSize: 9, color: "#4CAF50", background: "#4CAF5012", padding: "3px 8px", borderRadius: 20 }}>📧</span>}
                      {p.delivery?.includes("whatsapp") && p.whatsapp && <span style={{ fontFamily: mono, fontSize: 9, color: "#25D366", background: "#25D36612", padding: "3px 8px", borderRadius: 20 }}>💬</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditing(p.id)} style={{ background: T.active, border: `1px solid ${T.border}`, color: T.text, padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontFamily: mono, fontSize: 10 }}>EDIT</button>
                    {profiles.length > 1 && <button onClick={() => setProfiles(prev => prev.filter(x => x.id !== p.id))} style={{ background: "none", border: "1px solid #FF4D4D30", color: "#FF7070", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontFamily: mono, fontSize: 10 }}>DELETE</button>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "briefings" && editing && ep && (
          <>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontFamily: mono, fontSize: 11, marginBottom: 20, padding: 0 }}>← Back to profiles</button>
            <Field label="Profile name"><input style={inputStyle} value={ep.name} onChange={e => upd(ep.id,"name",e.target.value)} placeholder="e.g. Morning VC Briefing" /></Field>
            <Field label="Claude instructions for this briefing">
              <textarea rows={5} style={taStyle} value={ep.context} onChange={e => upd(ep.id,"context",e.target.value)} placeholder="e.g. Focus on venture capital and anything relevant to the NZ startup ecosystem. Flag anything that might affect our Elevate or Aspire portfolios." />
            </Field>
            <Field label="Tone">
              <div style={{ display: "flex", gap: 10 }}>
                {[["analytical","Analytical","Data-driven, precise"],["executive","Executive","High-level, strategic"],["conversational","Conversational","Warm, like a friend"]].map(([id,label,desc]) => (
                  <button key={id} onClick={() => upd(ep.id,"tone",id)} style={{ flex: 1, padding: "12px", borderRadius: 8, cursor: "pointer", textAlign: "left", background: ep.tone === id ? T.active : T.inputBg, border: `1px solid ${ep.tone === id ? T.activeBorder : T.border}` }}>
                    <div style={{ fontFamily: mono, fontSize: 11, color: ep.tone === id ? T.text : T.textMuted, fontWeight: 700, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: lora, fontSize: 11, color: T.textFaint }}>{desc}</div>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Length">
              <div style={{ display: "flex", gap: 10 }}>
                {[["quick","Quick","~2 min"],["standard","Standard","~5 min"],["deep","Deep Dive","~10 min"]].map(([id,label,desc]) => (
                  <button key={id} onClick={() => upd(ep.id,"length",id)} style={{ flex: 1, padding: "12px", borderRadius: 8, cursor: "pointer", textAlign: "left", background: ep.length === id ? T.active : T.inputBg, border: `1px solid ${ep.length === id ? T.activeBorder : T.border}` }}>
                    <div style={{ fontFamily: mono, fontSize: 11, color: ep.length === id ? T.text : T.textMuted, fontWeight: 700, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: lora, fontSize: 11, color: T.textFaint }}>{desc}</div>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Scope">
              <div style={{ display: "flex", gap: 10 }}>
                {[["email","📧 Newsletters only"],["web","🌐 Newsletters + broader news"]].map(([id,label]) => (
                  <button key={id} onClick={() => upd(ep.id,"scope",id)} style={{ flex: 1, padding: "11px", borderRadius: 8, cursor: "pointer", background: ep.scope === id ? T.active : T.inputBg, border: `1px solid ${ep.scope === id ? T.activeBorder : T.border}`, color: ep.scope === id ? T.text : T.textMuted, fontFamily: mono, fontSize: 11 }}>{label}</button>
                ))}
              </div>
            </Field>
            <Field label="Schedule">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {[["daily","Every day"],["weekdays","Weekdays"],["weekly","Weekly (Mon)"],["manual","Manual"]].map(([id,label]) => (
                  <button key={id} onClick={() => upd(ep.id,"schedule",id)} style={{ background: ep.schedule === id ? T.active : "transparent", border: `1px solid ${ep.schedule === id ? T.activeBorder : T.border}`, color: ep.schedule === id ? T.text : T.textMuted, borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: mono, fontSize: 10 }}>{label}</button>
                ))}
              </div>
              {ep.schedule !== "manual" && <input type="time" style={{...inputStyle, width: 160}} value={ep.scheduleTime} onChange={e => upd(ep.id,"scheduleTime",e.target.value)} />}
            </Field>
            <Field label="Delivery channels">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[["app","📱 In-app","Always available in Briefings tab","#FF6719"],["email","📧 Email","Via SendGrid (requires deployed backend)","#4CAF50"],["whatsapp","💬 WhatsApp","Via Twilio (requires deployed backend)","#25D366"]].map(([id,label,desc,color]) => (
                  <div key={id} style={{ background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ep.delivery?.includes(id) && id !== "app" ? 12 : 0 }}>
                      <div>
                        <div style={{ fontFamily: mono, fontSize: 11, color: T.text, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontFamily: lora, fontSize: 12, color: T.textFaint }}>{desc}</div>
                      </div>
                      <div onClick={() => { const next = ep.delivery?.includes(id) ? ep.delivery.filter(d=>d!==id) : [...(ep.delivery||[]),id]; upd(ep.id,"delivery",next); }} style={{ width: 40, height: 22, borderRadius: 11, background: ep.delivery?.includes(id) ? color : T.chip, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                        <div style={{ position: "absolute", top: 3, left: ep.delivery?.includes(id) ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                      </div>
                    </div>
                    {ep.delivery?.includes(id) && id === "email" && <input style={inputStyle} type="email" value={ep.email} onChange={e => upd(ep.id,"email",e.target.value)} placeholder="your@email.com" />}
                    {ep.delivery?.includes(id) && id === "whatsapp" && <input style={inputStyle} type="tel" value={ep.whatsapp} onChange={e => upd(ep.id,"whatsapp",e.target.value)} placeholder="+64 21 123 4567" />}
                  </div>
                ))}
              </div>
            </Field>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { onSaveAll(); setEditing(null); }} style={{ background: "linear-gradient(135deg,#FF6719,#FF4D4D)", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 6, cursor: "pointer", fontFamily: mono, fontSize: 11, fontWeight: 700 }}>SAVE PROFILE</button>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: `1px solid ${T.border}`, color: T.textMuted, padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontFamily: mono, fontSize: 11 }}>CANCEL</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [view, setView] = useState("feed");
  const [source, setSource] = useState("all");
  const [article, setArticle] = useState(null);
  const [saved, setSaved] = useState([]);
  const [richMode, setRichMode] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", role: "", context: "", interests: "" });
  const [profiles, setProfiles] = useState([DEFAULT_PROFILE]);

  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    (async () => {
      try {
        const d = await window.storage.get("dark-mode");
        if (d?.value !== undefined) setDark(JSON.parse(d.value));
        const s = await window.storage.get("saved-ids");
        if (s?.value) setSaved(JSON.parse(s.value));
        const u = await window.storage.get("user-profile");
        if (u?.value) setUserProfile(JSON.parse(u.value));
        const p = await window.storage.get("briefing-profiles");
        if (p?.value) setProfiles(JSON.parse(p.value));
      } catch (_) {}
    })();
  }, []);

  const toggleSave = async (a) => {
    const next = saved.includes(a.id) ? saved.filter(id => id !== a.id) : [...saved, a.id];
    setSaved(next);
    try { await window.storage.set("saved-ids", JSON.stringify(next)); } catch (_) {}
  };

  const toggleDark = async () => {
    const next = !dark;
    setDark(next);
    try { await window.storage.set("dark-mode", JSON.stringify(next)); } catch (_) {}
  };

  const saveAll = async () => {
    try {
      await window.storage.set("user-profile", JSON.stringify(userProfile));
      await window.storage.set("briefing-profiles", JSON.stringify(profiles));
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (_) {}
  };

  const filtered = source === "all" ? SAMPLE_ARTICLES : SAMPLE_ARTICLES.filter(a => a.source === source);
  const today = new Date().toLocaleDateString("en-NZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const NAV = [
    { id: "feed",     icon: "◉", label: "Feed" },
    { id: "saved",    icon: "📌", label: saved.length > 0 ? `Saved (${saved.length})` : "Saved" },
    { id: "briefing", icon: "🎙", label: "Briefings" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:wght@400;500&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: ${T.bg}; min-height: 100%; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "#333" : "#c0b8ae"}; border-radius: 2px; }
        @keyframes pulse { 0%,100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-6px); opacity: 1; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: mono, transition: "background 0.25s, color 0.25s" }}>

        {/* ── Header ── */}
        <header style={{ height: 56, borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, background: T.header, backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 900, background: dark ? "linear-gradient(135deg,#fff 20%,#777 100%)" : "linear-gradient(135deg,#1a1208 20%,#6b5c40 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Briefing</span>
            <span style={{ fontSize: 9, color: T.textFaint, letterSpacing: "0.18em" }}>YOUR DIGEST</span>
          </div>
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setView(n.id)} style={{ background: view === n.id ? T.active : "none", border: `1px solid ${view === n.id ? T.activeBorder : "transparent"}`, borderRadius: 6, padding: "6px 14px", color: view === n.id ? T.text : T.textMuted, cursor: "pointer", fontSize: 11, fontFamily: mono, transition: "all 0.15s" }}>{n.icon} {n.label}</button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={toggleDark} style={{ background: T.chip, border: `1px solid ${T.chipBorder}`, borderRadius: 6, padding: "5px 12px", color: T.textMuted, cursor: "pointer", fontFamily: mono, fontSize: 10, transition: "all 0.2s" }}>{dark ? "☀ Light" : "◑ Dark"}</button>
            <span style={{ fontSize: 9, color: T.textFaint, display: "none" }}>{today}</span>
          </div>
        </header>

        {/* ── Summary strip ── */}
        {view === "feed" && (
          <div onClick={() => setSummaryOpen(!summaryOpen)} style={{ background: T.summaryBg, borderBottom: `1px solid ${T.border2}`, padding: "11px 24px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", transition: "background 0.25s" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: T.textFaint, whiteSpace: "nowrap", paddingTop: 2 }}>TODAY</span>
            <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.75, fontFamily: lora, overflow: "hidden", maxHeight: summaryOpen ? 120 : 20, transition: "max-height 0.3s ease", flex: 1 }}>
              Markets steadied after Fed commentary eased inflation fears. AI competition intensified with new model releases. Reserve Bank holds rates as NZ housing shows signs of recovery. Seed-stage valuations finally correcting toward pre-2021 norms.
            </p>
            <span style={{ color: T.textFaint, fontSize: 10, whiteSpace: "nowrap" }}>{summaryOpen ? "▲" : "▼"}</span>
          </div>
        )}

        <div style={{ display: "flex" }}>
          {/* ── Sidebar ── */}
          {view === "feed" && (
            <aside style={{ width: 158, padding: "18px 0", borderRight: `1px solid ${T.border2}`, position: "sticky", top: 56, height: "calc(100vh - 56px)", flexShrink: 0, overflowY: "auto", background: T.sidebar, transition: "background 0.25s" }}>
              <div style={{ fontSize: 9, color: T.textFaint, letterSpacing: "0.2em", padding: "0 14px 10px" }}>SOURCES</div>
              {[{ id: "all", name: "All Stories", color: T.text }, ...ALL_SOURCES].map(s => (
                <button key={s.id} onClick={() => setSource(s.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", background: source === s.id ? T.active : "none", border: "none", borderLeft: source === s.id ? `2px solid ${s.color}` : "2px solid transparent", cursor: "pointer", color: source === s.id ? T.text : T.textMuted, fontSize: 11, fontFamily: mono, textAlign: "left", transition: "all 0.12s" }}>
                  {s.id !== "all" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0, opacity: source === s.id ? 1 : 0.4 }} />}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                </button>
              ))}
              <div style={{ padding: "18px 14px 0" }}>
                <div style={{ fontSize: 9, color: T.textFaint, lineHeight: 1.9 }}>{filtered.length} STORIES<br /><span style={{ opacity: 0.6 }}>Sample data</span></div>
              </div>
            </aside>
          )}

          {/* ── Main ── */}
          <main style={{ flex: 1, overflowX: "hidden", transition: "background 0.25s" }}>
            {view === "feed" && (
              <div style={{ padding: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, gridAutoRows: "minmax(68px, auto)" }}>
                  {filtered.map(a => (
                    <ArticleCard key={a.id} article={a} onClick={setArticle} isSaved={saved.includes(a.id)} onSave={toggleSave} T={T} dark={dark} />
                  ))}
                </div>
              </div>
            )}
            {view === "saved" && <SavedView savedIds={saved} allArticles={SAMPLE_ARTICLES} onOpen={setArticle} onRemove={id => toggleSave(SAMPLE_ARTICLES.find(a => a.id === id))} T={T} dark={dark} />}
            {view === "briefing" && <BriefingView articles={filtered} profiles={profiles} userProfile={userProfile} T={T} dark={dark} />}
            {view === "settings" && <SettingsView userProfile={userProfile} setUserProfile={setUserProfile} profiles={profiles} setProfiles={setProfiles} T={T} dark={dark} onSaveAll={saveAll} justSaved={justSaved} />}
          </main>
        </div>
      </div>

      <ReadingModal article={article} onClose={() => setArticle(null)} isSaved={article ? saved.includes(article.id) : false} onSave={toggleSave} T={T} dark={dark} />
    </>
  );
}
