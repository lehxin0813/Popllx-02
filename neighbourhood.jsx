// PropX Apple kit — Agent & Surveyor Neighbourhood Intelligence layer
// Data model, sample profiles, premium display cards, and the 7-category
// contribution form + area-rating step that only agents/surveyors see.

const { useState: nbS } = React;

// ── Inline Lucide-style icons (1.6 stroke, currentColor) ──────
const NB_ICONS = {
  cart:   "M3 4h2l2.4 11.5a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.8L20 7H6 M9 20a1 1 0 1 0 0 .01 M17 20a1 1 0 1 0 0 .01",
  school: "M3 9l9-5 9 5-9 5-9-5z M7 11v5c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5v-5",
  tree:   "M12 3l4 6h-2.5l3 5H13v5h-2v-5H7.5l3-5H8z",
  train:  "M5 4h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z M5 11h14 M8 21l1.5-2 M16 21l-1.5-2 M9 14h.01 M15 14h.01",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  crane:  "M4 21h16 M6 21V8 M6 8l13-3 M6 8l13 3 M9 21V12 M12 5v3",
  mall:   "M4 9h16l-1 11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z M8 9a4 4 0 0 1 8 0",
  clinic: "M12 6v12 M6 12h12 M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
  road:   "M12 3v3 M12 11v2 M12 18v3 M6 21l1-18 M18 21l-1-18",
  droplet:"M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  volume: "M11 5 6 9H3v6h3l5 4z M16 8a5 5 0 0 1 0 8",
  car:    "M5 13l1.5-5h11L19 13 M5 13h14v4H5z M7 17v2 M17 17v2 M7.5 13.5h.01 M16.5 13.5h.01",
  users:  "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20a6 6 0 0 1 12 0 M16 5.5a3 3 0 0 1 0 5.8 M21 20a6 6 0 0 0-4-5.6",
  sparkle:"M12 3l1.8 4.7L19 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z",
};
function NbIcon({ name, style }) {
  const d = NB_ICONS[name] || NB_ICONS.sparkle;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {d.split(" M").map((seg, i) => <path key={i} d={(i ? "M" : "") + seg} />)}
    </svg>
  );
}

// ── Star rating (display + interactive) ───────────────────────
function StarRating({ value = 0, onChange, size = 18, gold }) {
  const [hover, setHover] = nbS(0);
  const interactive = !!onChange;
  const col = gold ? "var(--apl-gold)" : "var(--apl-gold)";
  return (
    <span className={"apl-stars" + (interactive ? " interactive" : "")} style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => {
        const on = (hover || value) >= i;
        return (
          <span key={i} className="apl-star"
            style={{ color: on ? col : "rgba(150,150,160,0.32)", cursor: interactive ? "pointer" : "default", fontSize: size }}
            onMouseEnter={interactive ? () => setHover(i) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            onClick={interactive ? () => onChange(i) : undefined}>★</span>
        );
      })}
    </span>
  );
}

// ── Sample neighbourhood intelligence per zone ────────────────
const NB_DATA = {
  "city-waterfront": {
    liveability: 5, recommendation: "Buy", trust: "Cross-checked",
    contributor: "Verified Scout · Faisal R.",
    bestFor: ["Single professional", "Investor", "Upgrader"],
    rows: [
      { icon: "cart",  label: "Supermarket", value: "KSL City Mall · Mydin", meta: "0.9 km" },
      { icon: "school",label: "Schools",     value: "SK Bandar JB, Foon Yew SJKC", meta: "1.1 km" },
      { icon: "train", label: "RTS access",  value: "Bukit Chagar terminal", meta: "5 min drive" },
      { icon: "car",   label: "To CIQ",      value: "Causeway / CIQ", meta: "7 min" },
      { icon: "mall",  label: "Malls",       value: "KSL, Komtar JBCC, City Sq", meta: "Walkable from CIQ; 5–10 min drive from Danga Bay" },
      { icon: "volume",label: "Noise",       value: "Moderate — city + Causeway traffic", meta: "" },
      { icon: "shield",label: "Safety",      value: <StarRating value={4} size={15} />, meta: "agent-assessed" },
      { icon: "crane", label: "Upcoming",    value: "RTS Link opens 2027", meta: "≈600 m" },
    ],
    strength: "Unmatched connectivity — walk to the RTS, Causeway and three malls. The strongest rental-demand corridor in JB for cross-border professionals.",
    weakness: "Premium entry prices and peak-hour congestion near the Causeway. Limited green space and family amenities versus the suburbs.",
  },
  "eastern-midring": {
    liveability: 4, recommendation: "Buy", trust: "Agent-verified",
    contributor: "Trusted Contributor · Mei L.",
    bestFor: ["Family", "First-time buyer", "Upgrader"],
    rows: [
      { icon: "cart",  label: "Supermarket", value: "AEON Tebrau City · Giant", meta: "1.2 km" },
      { icon: "school",label: "Schools",     value: "SMK Taman Daya, Austin Heights", meta: "0.8 km" },
      { icon: "tree",  label: "Park",        value: "Taman Daya Park", meta: "0.5 km" },
      { icon: "clinic",label: "Healthcare",  value: "Hospital Sultan Ismail", meta: "3.4 km" },
      { icon: "car",   label: "To CIQ",      value: "via Tebrau Highway", meta: "22 min" },
      { icon: "users", label: "Community",   value: "Mixed · family-oriented", meta: "" },
      { icon: "shield",label: "Safety",      value: <StarRating value={4} size={15} />, meta: "agent-assessed" },
      { icon: "droplet",label: "Flood risk", value: "Low to moderate — some Sungai Tebrau areas have flood history", meta: "" },
    ],
    strength: "Mature, well-served family suburb with the best mall (AEON Tebrau), good schools and stable owner-occupier demand. Excellent everyday liveability.",
    weakness: "Tebrau Highway congestion at peak hours and a longer commute to the CIQ than the waterfront zone.",
  },
  "western-iskandar": {
    liveability: 4, recommendation: "Watch", trust: "Agent-verified",
    contributor: "Verified Scout · Daniel T.",
    bestFor: ["Investor", "Family", "Retiree"],
    rows: [
      { icon: "cart",  label: "Supermarket", value: "Aeon Bukit Indah · Giant", meta: "2.0 km" },
      { icon: "school",label: "Schools",     value: "Marlborough College, Raffles American School, Newcastle University Medicine", meta: "3.5 km" },
      { icon: "tree",  label: "Recreation",  value: "Puteri Harbour waterfront", meta: "1.5 km" },
      { icon: "train", label: "Link access", value: "Second Link (Tuas)", meta: "15 min" },
      { icon: "car",   label: "To CIQ",      value: "via Coastal Highway", meta: "30 min" },
      { icon: "users", label: "Community",   value: "International mix · expat presence", meta: "" },
      { icon: "shield",label: "Safety",      value: <StarRating value={5} size={15} />, meta: "gated & guarded" },
      { icon: "crane", label: "Upcoming",    value: "JS-SEZ flagship sites", meta: "in-zone" },
    ],
    strength: "Master-planned, low-density and very safe — gated communities, EduCity and Puteri Harbour. The clearest long-term upside from the JS-SEZ.",
    weakness: "Car-dependent with the longest commute to the CIQ, and absorption is slower — discounts are deeper because supply is heavy.",
  },
  "eastern-industrial": {
    liveability: 3, recommendation: "Watch", trust: "Community-contributed",
    contributor: "Agent-assessed · anonymous",
    bestFor: ["Investor", "Single professional"],
    rows: [
      { icon: "cart",  label: "Supermarket", value: "AEON Seri Alam · TF Value", meta: "1.6 km" },
      { icon: "school",label: "Schools",     value: "SMK Seri Alam, Seri Omega", meta: "1.2 km" },
      { icon: "clinic",label: "Healthcare",  value: "Regency Specialist Hospital (Seri Alam)", meta: "4.0 km" },
      { icon: "car",   label: "To CIQ",      value: "via Pasir Gudang Hwy", meta: "28 min" },
      { icon: "users", label: "Community",   value: "Employment-led · tenant pool", meta: "" },
      { icon: "volume",label: "Noise",       value: "Moderate — industrial nearby", meta: "" },
      { icon: "shield",label: "Safety",      value: <StarRating value={3} size={15} />, meta: "agent-assessed" },
      { icon: "crane", label: "Industry",    value: "Tanjung Langsat, PIPC", meta: "yield-led" },
    ],
    strength: "Strong yield play driven by a stable industrial tenant pool around Pasir Gudang and Pengerang — entry prices are low and rents are steady.",
    weakness: "Industrial proximity affects air and noise in parts; liveability and capital growth lag the commute-driven zones.",
  },
  "northern-corridor": {
    liveability: 3, recommendation: "Watch", trust: "Community-contributed",
    contributor: "Agent-assessed · anonymous",
    bestFor: ["First-time buyer", "Investor"],
    rows: [
      { icon: "cart",  label: "Supermarket", value: "AEON Kulaijaya · IOI Mall Kulai", meta: "3.0 km" },
      { icon: "school",label: "Schools",     value: "SMK Bandar Kulai, Excelsior International (Bandar Indahpura)", meta: "1.5 km" },
      { icon: "train", label: "Airport",     value: "Senai International", meta: "10 min" },
      { icon: "road",  label: "Highway",     value: "NSE Senai interchange", meta: "5 min" },
      { icon: "car",   label: "To CIQ",      value: "via NSE", meta: "32 min" },
      { icon: "users", label: "Community",   value: "Mixed · growing", meta: "" },
      { icon: "shield",label: "Safety",      value: <StarRating value={3} size={15} />, meta: "agent-assessed" },
      { icon: "crane", label: "Upcoming",    value: "JS-SEZ industrial spillover", meta: "early stage" },
    ],
    strength: "Cheapest entry in the state with airport and highway access. Early-stage growth tied directly to JS-SEZ industrial expansion around Senai–Kulai.",
    weakness: "Furthest from the Causeway and the least mature amenities — this is a patience-and-pipeline bet, not a today story.",
  },
};

const REC_STYLE = {
  Buy:   { c: "#1f8a5b", bg: "#e1f3ea" },
  Rent:  { c: "#0071e3", bg: "#e3f0fd" },
  Watch: { c: "#b8860b", bg: "#fbf0d6" },
  Avoid: { c: "#be123c", bg: "#fae0e6" },
};

// ── Full premium neighbourhood card (zone page) ───────────────
function NeighbourhoodCard({ data }) {
  if (!data) return null;
  const rec = REC_STYLE[data.recommendation] || REC_STYLE.Watch;
  return (
    <div className="apl-nb-card">
      <div className="apl-nb-head">
        <div>
          <div className="apl-nb-eyebrow"><NbIcon name="sparkle" style={{ width: 14, height: 14 }} /> Neighbourhood intelligence</div>
          <div className="apl-nb-score">
            <StarRating value={data.liveability} size={22} />
            <span className="apl-nb-score-num">{data.liveability.toFixed(1)}</span>
            <span className="apl-nb-score-lab">liveability</span>
          </div>
        </div>
        <span className="apl-nb-rec" style={{ color: rec.c, background: rec.bg }}>{data.recommendation}</span>
      </div>

      <div className="apl-nb-rows">
        {data.rows.map((r, i) => (
          <div key={i} className="apl-nb-row">
            <span className="apl-nb-row-ico"><NbIcon name={r.icon} /></span>
            <span className="apl-nb-row-label">{r.label}</span>
            <span className="apl-nb-row-value">{r.value}</span>
            {r.meta && <span className="apl-nb-row-meta">{r.meta}</span>}
          </div>
        ))}
      </div>

      <div className="apl-nb-sw">
        <div className="apl-nb-sw-item">
          <div className="apl-nb-sw-lab pos">Biggest strength</div>
          <p>{data.strength}</p>
        </div>
        <div className="apl-nb-sw-item">
          <div className="apl-nb-sw-lab neg">Biggest weakness</div>
          <p>{data.weakness}</p>
        </div>
      </div>

      <div className="apl-nb-bestfor">
        <span className="apl-nb-bestfor-lab">Best suited for</span>
        {data.bestFor.map(b => <span key={b} className="apl-nb-tag">{b}</span>)}
      </div>

      <div className="apl-nb-foot">
        <TrustBadge label={data.trust} size="sm" />
        <span className="apl-nb-attrib">{data.contributor}</span>
      </div>
    </div>
  );
}

// ── Condensed panel (project page right column) ───────────────
function NeighbourhoodPanel({ data, onMore }) {
  if (!data) return null;
  const rec = REC_STYLE[data.recommendation] || REC_STYLE.Watch;
  const rows = data.rows.slice(0, 4);
  return (
    <div className="apl-nbp">
      <div className="apl-nbp-head">
        <div className="apl-nb-eyebrow"><NbIcon name="sparkle" style={{ width: 13, height: 13 }} /> Area intelligence</div>
        <span className="apl-nb-rec" style={{ color: rec.c, background: rec.bg, fontSize: 11, padding: "3px 9px" }}>{data.recommendation}</span>
      </div>
      <div className="apl-nbp-score">
        <StarRating value={data.liveability} size={16} />
        <span>{data.liveability.toFixed(1)} liveability</span>
      </div>
      <div className="apl-nbp-rows">
        {rows.map((r, i) => (
          <div key={i} className="apl-nbp-row">
            <span className="apl-nbp-ico"><NbIcon name={r.icon} style={{ width: 15, height: 15 }} /></span>
            <span className="apl-nbp-lab">{r.label}</span>
            <span className="apl-nbp-val">{typeof r.value === "string" ? r.value : "★ rated"}{r.meta ? ` · ${r.meta}` : ""}</span>
          </div>
        ))}
      </div>
      <button className="apl-nbp-more" onClick={onMore}>See full area intelligence →</button>
      <div className="apl-nbp-foot"><TrustBadge label={data.trust} size="sm" /></div>
    </div>
  );
}

// ── Small form primitives ─────────────────────────────────────
function NbText({ label, hint, value, onChange, placeholder }) {
  return (
    <label className="apl-field"><span>{label}{hint && <em className="apl-field-hint"> · {hint}</em>}</span>
      <input value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}
function NbSeg({ label, options, value, onChange }) {
  return (
    <div className="apl-nbf-field">
      <div className="apl-field-label">{label}</div>
      <div className="apl-nbf-seg">
        {options.map(o => (
          <button key={o} type="button" className={"apl-nbf-seg-btn" + (value === o ? " on" : "")} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}
function NbCategory({ icon, n, title, children }) {
  return (
    <div className="apl-nbf-cat">
      <div className="apl-nbf-cat-head">
        <span className="apl-nbf-cat-ico"><NbIcon name={icon} /></span>
        <span className="apl-nbf-cat-n">{n}</span>
        <span className="apl-nbf-cat-title">{title}</span>
      </div>
      <div className="apl-nbf-cat-body">{children}</div>
    </div>
  );
}

// ── Step 3 — Neighbourhood intelligence form (agents only) ────
function NeighbourhoodForm({ value, set }) {
  const v = value;
  return (
    <div className="apl-submit-card">
      <div className="apl-nbf-intro">
        <NbIcon name="sparkle" style={{ width: 18, height: 18, color: "var(--apl-gold)", flexShrink: 0 }} />
        <p>You know this area better than anyone. Your neighbourhood notes help buyers and investors understand what the data cannot show. <b>Every field is optional</b> — fill what you know.</p>
      </div>

      <NbCategory icon="cart" n="01" title="Retail & daily amenities">
        <div className="apl-nbf-grid">
          <NbText label="Nearest supermarket" hint="name + distance" value={v.superm} onChange={x => set("superm", x)} placeholder="AEON Tebrau — 1.2 km" />
          <NbText label="Convenience stores <500m" hint="count" value={v.convCount} onChange={x => set("convCount", x)} placeholder="3" />
          <NbText label="Nearest pharmacy / clinic" value={v.pharmacy} onChange={x => set("pharmacy", x)} placeholder="Guardian — 600 m" />
          <NbText label="Nearest mall" hint="+ drive time" value={v.mall} onChange={x => set("mall", x)} placeholder="AEON — 5 min" />
        </div>
        <NbSeg label="F&B / restaurant density" options={["Low", "Medium", "High"]} value={v.fnb} onChange={x => set("fnb", x)} />
      </NbCategory>

      <NbCategory icon="school" n="02" title="Education">
        <div className="apl-nbf-grid">
          <NbText label="Nearest national school" hint="SK / SMK" value={v.school} onChange={x => set("school", x)} placeholder="SMK Taman Daya — 0.8 km" />
          <NbText label="Nearest Chinese / private" hint="SJKC / intl" value={v.schoolPrivate} onChange={x => set("schoolPrivate", x)} placeholder="Foon Yew — 1.1 km" />
        </div>
        <NbSeg label="School quality perception" options={["Below avg", "Average", "Good", "Excellent"]} value={v.schoolQ} onChange={x => set("schoolQ", x)} />
      </NbCategory>

      <NbCategory icon="tree" n="03" title="Parks & recreation">
        <div className="apl-nbf-grid">
          <NbText label="Nearest public park" value={v.park} onChange={x => set("park", x)} placeholder="Taman Daya Park — 0.5 km" />
          <NbText label="Sports complex / gym" value={v.gym} onChange={x => set("gym", x)} placeholder="—" />
        </div>
        <NbSeg label="Green space density" options={["Low", "Medium", "High"]} value={v.green} onChange={x => set("green", x)} />
      </NbCategory>

      <NbCategory icon="train" n="04" title="Transport & connectivity">
        <div className="apl-nbf-grid">
          <NbText label="Nearest rail (RTS/KTM/MRT)" hint="+ distance" value={v.rail} onChange={x => set("rail", x)} placeholder="Bukit Chagar RTS — 18 min" />
          <NbText label="Highway access" value={v.highway} onChange={x => set("highway", x)} placeholder="Tebrau Hwy interchange" />
          <NbText label="Drive to CIQ" hint="minutes" value={v.toCIQ} onChange={x => set("toCIQ", x)} placeholder="22" />
          <NbText label="Drive to Senai Airport" hint="minutes" value={v.toAirport} onChange={x => set("toAirport", x)} placeholder="25" />
        </div>
        <div className="apl-nbf-segrow">
          <NbSeg label="Peak-hour congestion" options={["Low", "Moderate", "Heavy"]} value={v.traffic} onChange={x => set("traffic", x)} />
          <NbSeg label="Parking availability" options={["Abundant", "Adequate", "Tight"]} value={v.parking} onChange={x => set("parking", x)} />
        </div>
      </NbCategory>

      <NbCategory icon="shield" n="05" title="Safety & neighbourhood character">
        <div className="apl-nbf-field">
          <div className="apl-field-label">Overall safety perception</div>
          <StarRating value={v.safety || 0} onChange={x => set("safety", x)} size={28} gold />
        </div>
        <div className="apl-nbf-segrow">
          <NbSeg label="Noise level" options={["Quiet", "Moderate", "Noisy"]} value={v.noise} onChange={x => set("noise", x)} />
          <NbSeg label="Cleanliness" options={["Poor", "Average", "Good", "Very good"]} value={v.clean} onChange={x => set("clean", x)} />
        </div>
        <NbSeg label="Community demographics" options={["Mixed", "Malay-majority", "Chinese-majority", "International mix"]} value={v.demo} onChange={x => set("demo", x)} />
      </NbCategory>

      <NbCategory icon="crane" n="06" title="Infrastructure & future development">
        <div className="apl-nbf-grid">
          <NbText label="Upcoming rail station" hint="name if any" value={v.upRail} onChange={x => set("upRail", x)} placeholder="RTS Link 2027" />
          <NbText label="New commercial / retail coming" value={v.upCommercial} onChange={x => set("upCommercial", x)} placeholder="—" />
        </div>
        <div className="apl-nbf-segrow">
          <NbSeg label="JS-SEZ relevance" options={["Inside SEZ", "Adjacent", "Not relevant"]} value={v.sez} onChange={x => set("sez", x)} />
          <NbSeg label="Flood risk" options={["None", "Low", "Moderate", "High"]} value={v.flood} onChange={x => set("flood", x)} />
        </div>
      </NbCategory>
    </div>
  );
}

// ── Step 4 — Agent's overall area rating (the satisfying finish)
function AreaRatingForm({ value, set }) {
  const v = value;
  const recs = ["Buy", "Rent", "Watch", "Avoid"];
  const bestForOpts = ["First-time buyer", "Upgrader", "Investor", "Family", "Single professional", "Retiree"];
  return (
    <div className="apl-submit-card apl-rating-card">
      <div className="apl-rating-hero">
        <div className="apl-field-label" style={{ textAlign: "center", marginBottom: 14 }}>Overall liveability score</div>
        <StarRating value={v.liveability || 0} onChange={x => set("liveability", x)} size={46} gold />
        <div className="apl-rating-hero-num">{v.liveability ? v.liveability.toFixed(1) : "—"}<span>/ 5</span></div>
      </div>

      <div className="apl-nbf-field">
        <div className="apl-field-label">Best suited for</div>
        <div className="apl-nbf-seg apl-nbf-seg-wrap">
          {bestForOpts.map(o => {
            const on = (v.bestFor || []).includes(o);
            return <button key={o} type="button" className={"apl-nbf-seg-btn" + (on ? " on" : "")}
              onClick={() => { const cur = v.bestFor || []; set("bestFor", on ? cur.filter(x => x !== o) : [...cur, o]); }}>{o}</button>;
          })}
        </div>
      </div>

      <label className="apl-field"><span>Biggest strength of this area <em className="apl-field-hint">· 100 words</em></span>
        <textarea value={v.strength || ""} onChange={e => set("strength", e.target.value)} className="apl-select" rows="2" style={{ resize: "vertical", fontFamily: "inherit" }} placeholder="Walkable to RTS and three malls; strongest cross-border rental demand…" />
      </label>
      <label className="apl-field"><span>Biggest weakness or risk <em className="apl-field-hint">· 100 words</em></span>
        <textarea value={v.weakness || ""} onChange={e => set("weakness", e.target.value)} className="apl-select" rows="2" style={{ resize: "vertical", fontFamily: "inherit" }} placeholder="Premium entry prices; peak-hour congestion near the Causeway…" />
      </label>

      <div className="apl-nbf-segrow">
        <div className="apl-nbf-field">
          <div className="apl-field-label">Your recommendation</div>
          <div className="apl-nbf-seg">
            {recs.map(o => {
              const st = REC_STYLE[o];
              const on = v.recommendation === o;
              return <button key={o} type="button" className={"apl-nbf-seg-btn" + (on ? " on" : "")}
                style={on ? { background: st.c, borderColor: st.c, color: "#fff" } : {}}
                onClick={() => set("recommendation", o)}>{o}</button>;
            })}
          </div>
        </div>
        <NbSeg label="Confidence level" options={["Low", "Medium", "High"]} value={v.confidence} onChange={x => set("confidence", x)} />
      </div>

      <div className="apl-rating-reward">
        <NbIcon name="sparkle" style={{ width: 16, height: 16, color: "var(--apl-gold)" }} />
        Completing a full area profile fast-tracks you to <b>Verified Scout</b> and earns the <b>Neighbourhood Expert</b> badge for this zone.
      </div>
    </div>
  );
}

Object.assign(window, { NbIcon, StarRating, NeighbourhoodCard, NeighbourhoodPanel, NeighbourhoodForm, AreaRatingForm, NB_DATA });

