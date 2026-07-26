// Apple UI kit — full app

const { useState: appS, useEffect: appE, useMemo: appUseMemo, useRef: appR } = React;

// ── Leaflet map for Explore by Zone (Google-Maps-style) ──────
function ZoneMap({ sel, setSel, onPick }) {
  const elRef = appR(null);
  const mapRef = appR(null);
  const zoneLayers = appR({});
  const projLayers = appR({});

  // init once
  appE(() => {
    if (mapRef.current || !window.L || !elRef.current) return;
    const L = window.L;
    const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true })
      .setView(window.JB_GEO.mapCenter, window.JB_GEO.mapZoom);
    mapRef.current = map;

    // Google-Maps-style raster tiles (CartoDB Voyager)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 20, crossOrigin: true,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    // anchor markers (infrastructure)
    window.JB_GEO.anchors.forEach(a => {
      const transport = a.type === "transport";
      const icon = L.divIcon({
        className: "apl-anchor-marker",
        html: `<span class="apl-anchor-pin ${transport ? "t" : "n"}">${transport ? "◆" : "●"}</span><span class="apl-anchor-name">${a.label}</span>`,
        iconSize: [0, 0], iconAnchor: [6, 6],
      });
      L.marker(a.latlng, { icon, zIndexOffset: -200 }).addTo(map);
    });

    // zone circles + labels
    window.JB_GEO.zones.forEach(z => {
      const sum = window.zoneSummary(z);
      const circle = L.circleMarker(z.latlng, {
        radius: 16 + Math.min(sum.count, 6) * 3,
        color: z.color, weight: 2, fillColor: z.color, fillOpacity: 0.14,
      }).addTo(map);
      circle.on("click", () => setSel(z.id));
      const label = L.marker(z.latlng, {
        icon: L.divIcon({ className: "apl-zone-marker", html: `<span class="apl-zone-pill" style="--zc:${z.color}">${z.tag}</span>`, iconSize: [0,0], iconAnchor: [0, 0] }),
      }).addTo(map);
      label.on("click", () => setSel(z.id));
      zoneLayers.current[z.id] = circle;
    });

    // project pins
    (window.APL_PROJECTS || []).forEach(p => {
      const ll = window.JB_GEO.projectCoords[p.slug];
      if (!ll) return;
      const icon = L.divIcon({
        className: "apl-proj-marker",
        html: `<span class="apl-proj-pin">RM ${p.netMin}k+</span>`,
        iconSize: [0,0], iconAnchor: [0, 14],
      });
      const m = L.marker(ll, { icon }).addTo(map);
      m.on("click", () => onPick(p));
      m.bindTooltip(`${p.name} · −${p.discAvg}%`, { direction: "top", offset: [0, -14] });
      projLayers.current[p.slug] = m;
    });

    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // fly to selected zone + emphasise its circle
  appE(() => {
    const map = mapRef.current; if (!map) return;
    const z = window.JB_GEO.zones.find(x => x.id === sel);
    if (z) map.flyTo(z.latlng, z.zoom || 13, { duration: 0.8 });
    Object.entries(zoneLayers.current).forEach(([id, c]) => {
      c.setStyle({ fillOpacity: id === sel ? 0.28 : 0.1, weight: id === sel ? 3 : 1.5 });
    });
  }, [sel]);

  return <div ref={elRef} className="apl-leaflet"></div>;
}



// icons (lucide-style)
const IcoSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const IcoCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IcoBuy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9h18l-2 9H5L3 9z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>
  </svg>
);
const IcoInvest = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v18H3z" rx="2"/><path d="M8 12l3 3 5-6"/>
  </svg>
);
const IcoRent = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>
  </svg>
);

function HeroSection({ onSearch }) {
  const [q, setQ] = appS("");
  return (
    <section className="apl-hero">
      <div className="apl-hero-content">
        <div className="apl-hero-eyebrow">Net price research · Johor Bahru</div>
        <h1 className="apl-h1">
          What buyers <span className="accent clay">actually paid.</span>
        </h1>
        <p className="apl-lead apl-hero-sub">
          The SPA price is on the contract. The net price is what was really paid.
          Search any JB project and see both — side by side.
        </p>
        <div className="apl-hero-search-wrap">
          <form className="apl-hero-search" onSubmit={(e) => { e.preventDefault(); onSearch(q); }}>
            <span className="apl-hero-search-icon"><IcoSearch /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search project or area (e.g. R&F Princess Cove…)" />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="apl-hero-pulse">
          <div className="apl-hero-pulse-dot"/>
          <span>Research preview · {(window.JB_PROJECTS || []).length} projects tracked · updated Jun 2026</span>
        </div>
      </div>
    </section>
  );
}

// Three persona KPI tiles (live from the dataset)
function PersonaKPISection({ dirId }) {
  useReveal();
  const k = window.personaKPIs();
  // median yield optionally scoped to a chosen direction
  let medYield = k.medYield;
  if (dirId && dirId !== "any") {
    const ys = window.projectsInDirection(dirId).filter(p => p.gyield).map(p => p.gyield).sort((a, b) => a - b);
    if (ys.length) { const m = Math.floor(ys.length / 2); medYield = (ys.length % 2 ? ys[m] : (ys[m - 1] + ys[m]) / 2).toFixed(1); }
  }
  const tiles = [
    { lab: "For buyers", icon: <IcoBuy />, accent: "clay", val: "−" + k.buyerDisc + "%", cap: "Average net discount vs SPA this month" },
    { lab: "For investors", icon: <IcoInvest />, accent: "teal", val: medYield + "%", cap: "Median gross yield" + (dirId && dirId !== "any" ? " in this direction" : " across JB") },
    { lab: "For agents & surveyors", icon: <IcoCheck />, accent: "blue", val: String(k.strongComparables), cap: "Projects with ≥5 records (strong comparables)" },
  ];
  return (
    <div className="apl-section" style={{ paddingTop: 64, paddingBottom: 24 }}>
      <div className="apl-kpi-row">
        {tiles.map(t => (
          <div key={t.lab} className={"apl-kpi-tile apl-reveal " + t.accent}>
            <div className="apl-kpi-head"><span className="apl-kpi-ico">{t.icon}</span><span className="apl-kpi-lab">{t.lab}</span></div>
            <div className="apl-kpi-val">{t.val}</div>
            <div className="apl-kpi-cap">{t.cap}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// "JB at a glance" — 5 direction cards with property-type aggregate tables
function GlanceSection({ onOpenDirection }) {
  useReveal();
  return (
    <div className="apl-section" style={{ paddingTop: 40 }}>
      <div className="apl-section-head apl-reveal" style={{ maxWidth: 820, margin: "0 auto 44px" }}>
        <div className="apl-eyebrow">JB at a glance · net prices by direction and property type</div>
        <h2 className="apl-h2">Five directions, one market picture.</h2>
        <p className="apl-lead" style={{ fontSize: 17 }}>Across all JB projects on PropX. Price ranges and discounts by property type.</p>
      </div>
      <div className="apl-glance-grid">
        {window.DIRECTIONS.map(d => <GlanceCard key={d.id} dir={d} onOpen={onOpenDirection} />)}
      </div>
    </div>
  );
}

function GlanceCard({ dir, onOpen }) {
  const rows = window.propertyTypeTable(dir.id);
  const stat = window.directionStat(dir.id);
  return (
    <section className="apl-glance-card apl-reveal">
      <header className="apl-glance-head">
        <span className="apl-glance-compass" style={{ background: dir.color }}>{dir.compass}</span>
        <h3 className="apl-glance-heading">{dir.heading}</h3>
      </header>
      <div className="apl-glance-areas">{dir.areas}</div>
      <div className="apl-glance-character">{dir.character}</div>
      <div className="apl-glance-tablewrap">
        <table className="apl-glance-table">
          <thead><tr><th>Property type</th><th>Net min–max</th><th>Avg built-up</th><th>Avg psf</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.type}>
                <td className="ty">{r.type}</td>
                <td className="num net">{fmtRM(r.netMin)}–{fmtRM(r.netMax)}</td>
                <td className="num">{r.avgBuiltUp.toLocaleString()} sf</td>
                <td className="num psf">RM {r.avgPsf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="apl-glance-cta" onClick={() => onOpen && onOpen(dir.id)}>
        {stat.count} projects · {stat.records} records · avg −{stat.discAvg}% →
      </button>
    </section>
  );
}

// "What can I consider with my budget?"
// Budget helper as its own tab/page
function BudgetView({ onPick }) {
  useReveal();
  return (
    <div style={{ background: "var(--apl-bg)", minHeight: "70vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 28px 16px" }}>
        <div className="apl-eyebrow apl-reveal">Budget helper</div>
        <h1 className="apl-h2 apl-reveal" style={{ marginBottom: 12 }}>What can I consider with my budget?</h1>
        <p className="apl-lead apl-reveal" style={{ marginTop: 0, marginLeft: 0, fontSize: 17, maxWidth: 680 }}>
          Set a budget and we'll show what's within reach across JB — grouped by direction and property type, with median net price, average built-up and psf so you can compare like for like.
        </p>
      </div>
      <BudgetSection onPick={onPick} embedded />
    </div>
  );
}

function BudgetSection({ onPick, embedded }) {
  useReveal();
  const [mode, setMode] = appS("buyer");
  const [budget, setBudget] = appS(600);
  const [rentBudget, setRentBudget] = appS(2500);
  const [dir, setDir] = appS("any");
  const estRentP = (p) => Math.round(p.netMedian * 1000 * ((p.gyield || 4) / 100) / 12);
  function renterGroups() {
    let pool = window.JB_PROJECTS.filter(p => estRentP(p) <= Number(rentBudget || 0));
    if (dir !== "any") pool = pool.filter(p => p.direction === dir);
    const byDir = {};
    pool.forEach(p => { (byDir[p.direction] = byDir[p.direction] || []).push(p); });
    const med = (arr) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    return window.DIRECTIONS.filter(d => byDir[d.id]).map(d => {
      const types = {};
      byDir[d.id].forEach(p => { (types[p.dType] = types[p.dType] || []).push(p); });
      const byType = Object.keys(types).map(t => {
        const ps = types[t].sort((a, b) => estRentP(a) - estRentP(b));
        return { type: t, medianNet: med(ps.map(x => x.netMedian)),
          avgBuiltUp: Math.round(ps.reduce((a, x) => a + (x.builtUp || 0), 0) / ps.length),
          avgPsf: Math.round(ps.reduce((a, x) => a + (x.psf || 0), 0) / ps.length), projects: ps };
      });
      return { dir: d, byType };
    });
  }
  const groups = mode === "renter" ? renterGroups() : window.budgetMatch(mode, budget * 1, dir);
  return (
    <div className={embedded ? "" : "apl-section-grey"}>
      <div className="apl-section" style={{ padding: "0 0" }}>
        {!embedded && (
          <div className="apl-section-head apl-reveal" style={{ maxWidth: 820, margin: "0 auto 36px" }}>
            <div className="apl-eyebrow">Budget helper</div>
            <h2 className="apl-h2">What can I consider with my budget?</h2>
          </div>
        )}
        <div className="apl-budget-controls apl-reveal">
          <div className="apl-seg">
            <button className={mode === "buyer" ? "on" : ""} onClick={() => setMode("buyer")}>Buyer</button>
            <button className={mode === "renter" ? "on" : ""} onClick={() => setMode("renter")}>Renter</button>
            <button className={mode === "investor" ? "on" : ""} onClick={() => setMode("investor")}>Investor</button>
          </div>
          {mode === "renter" ? (
            <label className="apl-budget-field">
              <span>Monthly rent budget</span>
              <div className="apl-budget-input">
                <span className="pre">RM</span>
                <input type="number" step="100" value={rentBudget} onChange={e => setRentBudget(e.target.value)} />
                <span className="suf">/mo</span>
              </div>
            </label>
          ) : (
            <label className="apl-budget-field">
              <span>Budget (RM)</span>
              <div className="apl-budget-input">
                <span className="pre">RM</span>
                <input type="number" step="50" value={budget} onChange={e => setBudget(e.target.value)} />
                <span className="suf">k</span>
              </div>
            </label>
          )}
          <label className="apl-budget-field">
            <span>Preferred direction</span>
            <select value={dir} onChange={e => setDir(e.target.value)} className="apl-select">
              <option value="any">Any direction</option>
              {window.DIRECTIONS.map(d => <option key={d.id} value={d.id}>{d.compass}</option>)}
            </select>
          </label>
        </div>

        <div className="apl-budget-result apl-reveal">
          <div className="apl-budget-lead">
            {mode === "buyer"
              ? <>With <b>{fmtRM(budget * 1)}</b> as a buyer, you could consider — with a rough rental guide per direction:</>
              : mode === "renter"
              ? <>With <b>RM {Number(rentBudget || 0).toLocaleString()}/mo</b> to rent, you could consider these per direction:</>
              : <>With <b>{fmtRM(budget * 1)}</b> as an investor, these meet at least <b>4.5%</b> gross yield:</>}
          </div>
          {groups.length === 0 && (
            <div className="apl-budget-empty">No tracked projects match yet. Try a {mode === "renter" ? "higher rent budget" : "higher budget"} or a different direction — or add a record to expand coverage.</div>
          )}
          {groups.map(({ dir: d, byType }) => {
            const estRent = (p) => Math.round(p.netMedian * 1000 * ((p.gyield || 4) / 100) / 12);
            const dirRents = byType.flatMap(g => g.projects.map(estRent));
            const dirRentLo = dirRents.length ? Math.min(...dirRents) : 0;
            const dirRentHi = dirRents.length ? Math.max(...dirRents) : 0;
            return (
            <div key={d.id} className="apl-budget-group">
              <div className="apl-budget-group-head">
                <span className="apl-budget-dot" style={{ background: d.color }}></span>{d.compass} · {d.district}
                <span className="apl-budget-group-rent">est. rent RM {dirRentLo.toLocaleString()}–{dirRentHi.toLocaleString()}/mo</span>
              </div>
              {byType.map(g => {
                const rents = g.projects.map(estRent);
                const rLo = Math.min(...rents), rHi = Math.max(...rents);
                return (
                <div key={g.type} className="apl-budget-type">
                  <div className="apl-budget-type-head">
                    <span className="apl-budget-type-name">{g.type}</span>
                    <span className="apl-budget-type-stat">median net <b>{fmtRM(g.medianNet)}</b> · {g.avgBuiltUp.toLocaleString()} sf · <b>RM {g.avgPsf}</b>/sf · est. rent <b>RM {rLo.toLocaleString()}{rLo !== rHi ? "–" + rHi.toLocaleString() : ""}</b>/mo</span>
                  </div>
                  <div className="apl-budget-cards">
                    {g.projects.map(p => (
                      <button key={p.slug} className="apl-budget-card" onClick={() => onPick && onPick(p)}>
                        <div className="apl-budget-card-name">{p.name}</div>
                        <div className="apl-budget-card-meta">{p.corridor}</div>
                        <div className="apl-budget-card-stats">
                          <span className="net">{fmtRM(p.netMedian)}<small> median net</small></span>
                          <span className="rent">RM {estRent(p).toLocaleString()}<small> est. rent/mo</small></span>
                          {p.gyield && <span className="yld">{p.gyield}%<small> yield</small></span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );})}
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// JB transformation visual band (spec 1.2) — on-brand illustrations
function TransformBand() {
  useReveal();
  const scenes = [
    { key: "rts-core", title: "City core & the RTS link", note: "Bukit Chagar terminal reshaping the waterfront." },
    { key: "iskandar", title: "Iskandar Puteri", note: "Masterplanned golf, EduCity and Medini." },
    { key: "austin", title: "Mount Austin belt", note: "Mature family townships, malls and schools." },
  ];
  return (
    <div className="apl-section" style={{ paddingTop: 8, paddingBottom: 64 }}>
      <div className="apl-transform-grid apl-reveal">
        {scenes.map(s => (
          <figure key={s.key} className="apl-transform-card">
            <div className="apl-transform-img" dangerouslySetInnerHTML={{ __html: window.AplImg.transformScene(s.key) }} />
            <figcaption className="apl-transform-cap">
              <span className="apl-transform-title">{s.title}</span>
              <span className="apl-transform-note">{s.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// Bottom-of-home comparison conclusion (spec 1.4) — type × direction psf matrix
function DirectionsGuide({ onOpenDirection }) {
  useReveal();
  const [view, setView] = appS("map");
  const [hoverZone, setHoverZone] = appS(null);
  return (
    <div className="apl-section">
      <div className="apl-section-head apl-reveal" style={{ maxWidth: 820, margin: "0 auto 24px" }}>
        <div className="apl-eyebrow">Know your JB map</div>
        <h2 className="apl-h2">Where each direction is — and what's there.</h2>
        <p className="apl-lead" style={{ fontSize: 17 }}>JB splits into five broad directions. Here's the district each covers and the areas you'll find inside it.</p>
      </div>
      <div className="apl-mapview-toggle apl-reveal">
        <button className={view === "map" ? "on" : ""} onClick={() => setView("map")}>▦ Map</button>
        <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>≣ List</button>
      </div>
      {view === "map" && (
        <div className="apl-dirmap-wrap apl-reveal">
          <DirectionsMap onOpenDirection={onOpenDirection} highlight={hoverZone} />
        </div>
      )}
      <div className={"apl-dirguide-grid apl-reveal" + (view === "list" ? " list-primary" : "")}>
        {window.DIRECTIONS.map(d => (
          <button key={d.id} className="apl-dirguide-card" style={{ borderTopColor: d.color }}
            onClick={() => onOpenDirection && onOpenDirection(d.id)}
            onMouseEnter={() => setHoverZone(d.zoneId)} onMouseLeave={() => setHoverZone(null)}>
            <div className="apl-dirguide-top">
              <span className="apl-dirguide-dot" style={{ background: d.color }}></span>
              <span className="apl-dirguide-compass" style={{ color: d.color }}>{d.compass}</span>
              <span className="apl-dirguide-district">{d.district}</span>
            </div>
            <div className="apl-dirguide-areas">{d.areas}</div>
            <div className="apl-dirguide-char">{d.character}</div>
            <span className="apl-dirguide-cta">See deals here →</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Home: interactive JB map showing the five cardinal directions
function DirectionsMap({ onOpenDirection, highlight }) {
  const elRef = appR(null);
  const mapRef = appR(null);
  const zoneLayers = appR({});
  const savedLayer = appR(null);
  const [saved] = useAplSaved();
  const [hint, setHint] = appS(() => { try { return !localStorage.getItem("propx_zonemap_hint"); } catch { return true; } });

  const savedProjs = (window.APL_PROJECTS || []).filter(p => saved.includes(p.slug));

  // choropleth styling: hovered zone brightens to 25%, the others dim to 8%
  const styleZones = (hoverId) => {
    Object.entries(zoneLayers.current).forEach(([id, o]) => {
      if (!hoverId) o.setStyle({ fillOpacity: 0.17, opacity: 1, weight: 1.5 });
      else if (id === hoverId) o.setStyle({ fillOpacity: 0.25, opacity: 1, weight: 2 });
      else o.setStyle({ fillOpacity: 0.08, opacity: 0.7, weight: 1.5 });
    });
  };

  appE(() => {
    if (mapRef.current || !window.L || !elRef.current) return;
    const L = window.L;
    const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    mapRef.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 20, crossOrigin: true,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    // fit to the full zone cover so no zone is cropped at the edges
    map.fitBounds([[1.30, 103.50], [1.76, 104.03]], { padding: [4, 4] });

    // choropleth: five polygons TILE the frame, sharing edges (no gaps)
    window.DIRECTIONS.forEach(d => {
      const poly = window.JB_GEO.zonePolygons[d.zoneId];
      if (!poly) return;
      const layer = L.polygon(poly, {
        color: d.color, weight: 1.5, fillColor: d.color, fillOpacity: 0.17, smoothFactor: 1.5, lineJoin: "round",
      }).addTo(map);
      const center = (window.JB_GEO.zoneCentroids || {})[d.zoneId] || poly[0];
      const label = L.marker(center, {
        icon: L.divIcon({ className: "apl-dirmap-marker", html: `<span class="apl-dirmap-pill" style="--zc:${d.color}">${d.compass}</span>`, iconSize: [0,0], iconAnchor: [0,0] }),
      }).addTo(map);
      const go = () => onOpenDirection && onOpenDirection(d.id);
      layer.on("click", go); label.on("click", go);
      layer.on("mouseover", () => styleZones(d.zoneId));
      layer.on("mouseout", () => styleZones(null));
      zoneLayers.current[d.zoneId] = layer;
    });

    // one key landmark per zone (trimmed)
    (window.JB_GEO.keyLandmarks || []).forEach(a => {
      const icon = L.divIcon({ className: "apl-anchor-marker",
        html: `<span class="apl-anchor-pin t">◆</span><span class="apl-anchor-name">${a.label}</span>`,
        iconSize: [0,0], iconAnchor: [5,5] });
      L.marker(a.latlng, { icon, zIndexOffset: -200 }).addTo(map);
    });

    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // saved-project heart pins (re-render when the saved set changes)
  appE(() => {
    const map = mapRef.current; if (!map || !window.L) return;
    const L = window.L;
    if (savedLayer.current) { savedLayer.current.remove(); savedLayer.current = null; }
    const grp = L.layerGroup();
    savedProjs.forEach(p => {
      const ll = window.projectLatLng(p);
      const icon = L.divIcon({ className: "apl-savedpin-marker", html: `<span class="apl-savedpin">♥</span>`, iconSize: [0,0], iconAnchor: [8,20] });
      L.marker(ll, { icon, zIndexOffset: 500 }).addTo(grp).bindTooltip(`${p.name} · saved`, { direction: "top", offset: [0,-18] });
    });
    grp.addTo(map); savedLayer.current = grp;
  }, [saved.join(",")]);

  // external highlight — hovering a zone card lights up its full polygon
  appE(() => { if (mapRef.current) styleZones(highlight || null); }, [highlight]);

  function dismissHint() { setHint(false); try { localStorage.setItem("propx_zonemap_hint", "1"); } catch (e) {} }

  // contextual saved tag naming the zone of the saved projects
  let savedTag = null;
  if (savedProjs.length) {
    const counts = {};
    savedProjs.forEach(p => { const c = (window.DIRECTIONS.find(d => d.id === p.direction) || {}).compass; if (c) counts[c] = (counts[c] || 0) + 1; });
    const zones = Object.keys(counts);
    const where = zones.length === 1 ? ` in the ${zones[0]} zone` : zones.length > 1 ? ` across ${zones.length} zones` : "";
    savedTag = `You have ${savedProjs.length} saved project${savedProjs.length > 1 ? "s" : ""}${where}.`;
  }

  return (
    <div className="apl-dirmap-shell">
      <div ref={elRef} className="apl-dirmap"></div>
      {hint && (
        <div className="apl-map-hint">
          <span className="apl-map-hint-dot"></span>
          Click a zone to see its projects
          <button className="apl-map-hint-x" onClick={dismissHint} aria-label="Dismiss">✕</button>
        </div>
      )}
      {savedTag && <div className="apl-map-savedtag"><span className="apl-map-savedtag-h">♥</span> {savedTag}</div>}
    </div>
  );
}

// Bottom-of-home comparison conclusion (spec 1.4) — type × direction psf matrix
function ComparisonSection() {
  useReveal();
  const grid = window.comparisonGrid();
  const dirs = window.DIRECTIONS;
  return (
    <div className="apl-section-grey">
      <div className="apl-section" style={{ padding: "0" }}>
        <div className="apl-section-head apl-reveal" style={{ maxWidth: 820, margin: "0 auto 36px" }}>
          <div className="apl-eyebrow">The whole market, side by side</div>
          <h2 className="apl-h2">How JB property types compare by direction.</h2>
          <p className="apl-lead" style={{ fontSize: 17 }}>Average net price psf by property type.</p>
        </div>
        <div className="apl-compare-wrap apl-reveal">
          <table className="apl-compare-table">
            <thead>
              <tr>
                <th className="rowhead">Property type</th>
                {dirs.map(d => <th key={d.id} style={{ color: d.color }}>{d.compass}</th>)}
              </tr>
            </thead>
            <tbody>
              {grid.map(row => (
                <tr key={row.type}>
                  <td className="rowhead">{row.type}</td>
                  {dirs.map(d => {
                    const cell = row.cells.find(c => c.dir.id === d.id);
                    if (!cell || !cell.has) return <td key={d.id} className="empty">—</td>;
                    const isLow = row.cheapest && cell.avgPsf === row.cheapest.avgPsf;
                    const isHigh = row.dearest && cell.avgPsf === row.dearest.avgPsf && row.cheapest.avgPsf !== row.dearest.avgPsf;
                    return (
                      <td key={d.id} className={"psfcell" + (isLow ? " low" : "") + (isHigh ? " high" : "")}>
                        RM {cell.avgPsf}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="apl-compare-legend">
            <span><i className="low"></i> lowest psf for that type</span>
            <span><i className="high"></i> highest psf</span>
            <span className="muted">psf = net price ÷ average built-up</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Per-floor (high-rise) / per-lot (landed) submission list, gated on contribution (spec 3.1/3.2)
function ProjectSubmissions({ proj, onContribute, onSale, onRent }) {
  const subs = proj.submissions || [];
  const isLanded = proj.isLanded;
  const unlocked = window.hasContributed();
  const CAP = unlocked ? subs.length : 5; // submit one deal → see every transaction
  if (!subs.length) return null;
  const shown = subs.slice(0, CAP);
  const more = subs.length - shown.length;
  // Freshness (brief A5): newest record's age, from "YYYY-MM" dates.
  const ages = subs.map(s => {
    const [y, m] = (s.date || "").split("-").map(Number);
    return y ? (2026 - y) * 12 + (7 - (m || 1)) : 9999;
  });
  const freshMo = Math.max(0, Math.min(...ages));
  const freshTxt = freshMo <= 0 ? "this month" : freshMo === 1 ? "1 month ago" : freshMo < 12 ? freshMo + " months ago" : Math.floor(freshMo / 12) + (freshMo < 24 ? " year ago" : " years ago");
  const [flagged, setFlagged] = appS({});
  return (
    <div className="apl-subs">
      <div className="apl-subs-head">
        <h3 className="apl-subs-title">What people actually paid, unit by unit</h3>
        <span className="apl-subs-note">
          {isLanded ? "Net price varies by lot position, land size and condition." : "Each transaction shows the floor it sold on — higher floors usually cost more."}
        </span>
        <span className="apl-subs-fresh">Latest record: {freshTxt} · {subs.length} total</span>
      </div>

      {!isLanded && proj.towers && (
        <div className="apl-subs-building">
          <span><b>{proj.towers}</b> tower{proj.towers > 1 ? "s" : ""}</span>
          <span className="sep">·</span>
          <span><b>{proj.totalFloors}</b> floors</span>
          <span className="sep">·</span>
          <span><b>{proj.totalUnits.toLocaleString()}</b> total units</span>
          <span className="sep">·</span>
          <span>showing <b>{shown.length}</b> of {subs.length} transactions</span>
        </div>
      )}

      <div className="apl-subs-list">
        {shown.map((s, i) => (
          <div key={i} className="apl-sub-row">
            <div className="apl-sub-grp">
              <span className="apl-sub-grp-name">{isLanded ? s.group : "Level " + s.floor + (s.unit ? " · " + s.unit : "")}</span>
              <span className="apl-sub-grp-sub">{s.sub}</span>
            </div>
            <div className="apl-sub-figs">
              <span className="apl-sub-fig"><i>Built-up</i>{s.builtUp.toLocaleString()} sf</span>
              <span className="apl-sub-fig"><i>Net</i>{fmtRM(s.net)}</span>
              <span className="apl-sub-fig psf"><i>psf</i>RM {s.psf}</span>
            </div>
            <div className="apl-sub-incentives">
              {s.txn && <span className="apl-sub-chip txn">{s.txn}</span>}
              <span className="apl-sub-chip">{s.rebate}% discount</span>
              {s.legal && <span className="apl-sub-chip">legal absorbed</span>}
              {s.furnished && <span className="apl-sub-chip">furnished</span>}
              {s.condition && <span className="apl-sub-chip cond">{s.condition}</span>}
            </div>
            <div className="apl-sub-meta">
              <span className={"apl-sub-role " + s.role}>{s.role}</span>
              <span className="apl-sub-date">{s.date}</span>
              {flagged[i]
                ? <span className="apl-sub-flagged">✓ Flagged for review</span>
                : <button type="button" className="apl-sub-flag" onClick={() => setFlagged(f => ({ ...f, [i]: true }))}>Flag as wrong</button>}
            </div>
          </div>
        ))}
      </div>

      {more > 0 ? (
        <div className="apl-subs-more">
          <span>{more} more transaction{more > 1 ? "s" : ""} hidden. <a href="#" className="apl-link-text" onClick={e => { e.preventDefault(); onSale && onSale(); }}>Submit a deal</a> or <a href="#" className="apl-link-text" onClick={e => { e.preventDefault(); onRent && onRent(); }}>rental</a> to unlock every transaction across all JB projects for 30 days.</span>
          {onContribute && <button className="apl-btn apl-btn-gold apl-btn-sm" onClick={() => onContribute(null, proj)}>＋ Submit a transaction or rental price for this project</button>}
        </div>
      ) : (
        <div className="apl-subs-more">
          <span>Know a deal or rental here? Help others see the real price.</span>
          {onContribute && <button className="apl-btn apl-btn-gold apl-btn-sm" onClick={() => onContribute(null, proj)}>＋ Submit a transaction or rental price for this project</button>}
        </div>
      )}
    </div>
  );
}

// Floor-premium insight (high-rise) — "each floor up ≈ +RM X"
function FloorPremiumNote({ proj }) {
  const fp = window.floorPremium(proj);
  if (!fp || !fp.perFloor) return null;
  return (
    <div className="apl-floorprem">
      <div className="apl-floorprem-ico">↑</div>
      <div className="apl-floorprem-body">
        <div className="apl-floorprem-head">Going up a level costs about <b>RM {fp.perFloor.toLocaleString()}</b></div>
        <div className="apl-floorprem-sub">
          Across recorded deals, each floor higher adds roughly RM {fp.perFloor.toLocaleString()} to the net price — about <b>RM {fp.spread.toLocaleString()}</b> between level {fp.lo} and level {fp.hi}. Higher floors, harbour or city views command the premium.
        </div>
      </div>
    </div>
  );
}

// Discount trend over time — rebates often grow as a project ages
function DiscountTrend({ proj }) {
  const trend = window.discountTrend(proj);
  if (!trend || trend.length < 2) return null;
  const max = Math.max(...trend.map(t => t.disc));
  const first = trend[0], last = trend[trend.length - 1];
  const grew = last.disc > first.disc;
  return (
    <div className="apl-trend">
      <div className="apl-subs-head" style={{ marginBottom: 4 }}>
        <h3 className="apl-subs-title">Discount trend over time</h3>
        <span className="apl-subs-note">How discounts changed over time.</span>
      </div>
      <div className="apl-trend-chart">
        {trend.map(t => (
          <div key={t.year} className="apl-trend-col">
            <span className="apl-trend-val">−{t.disc}%</span>
            <div className="apl-trend-bar" style={{ height: Math.round((t.disc / max) * 120) + 6 }}></div>
            <span className="apl-trend-yr">{t.year}</span>
          </div>
        ))}
      </div>
      <div className={"apl-trend-verdict " + (grew ? "up" : "down")}>
        {grew
          ? <>This project's average discount grew from <b>{first.disc}%</b> in {first.year} to <b>{last.disc}%</b> now — bigger discounts now, good time to negotiate.</>
          : <>The average discount eased from <b>{first.disc}%</b> in {first.year} to <b>{last.disc}%</b> now — discounts getting smaller, less room to negotiate.</>}
      </div>
    </div>
  );
}

// Ask the community — anonymous Q&A thread, seeded + localStorage posts
function CommunityThread({ proj }) {
  const KEY = "propx_apple_qna";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
  const [mine, setMine] = appS(read);
  const [open, setOpen] = appS(false);
  const [q, setQ] = appS("");
  const [role, setRole] = appS("Buyer");

  const seeded = (window.COMMUNITY_THREADS || []).filter(t => t.slug === proj.slug);
  const local = mine.filter(t => t.slug === proj.slug);
  const threads = [...local, ...seeded];

  function post() {
    if (!q.trim()) return;
    const t = { id: "u" + Date.now(), slug: proj.slug, role, when: "Just now", q: q.trim(), tags: [(window.DIRECTIONS.find(d => d.id === proj.direction) || {}).compass].filter(Boolean), replies: [] };
    const next = [t, ...read()];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setMine(next); setQ(""); setOpen(false);
  }

  return (
    <div className="apl-qna">
      <div className="apl-subs-head" style={{ marginBottom: 8 }}>
        <h3 className="apl-subs-title">Ask the community</h3>
        <span className="apl-subs-note">Got an offer on this project? Ask if it's fair.</span>
      </div>

      {!open ? (
        <button className="apl-qna-ask" onClick={() => setOpen(true)}>
          <span className="apl-qna-ask-ico">＋</span>
          <span>“I was offered {proj.name} at RM ___ with RM ___ discount — is that fair?”</span>
        </button>
      ) : (
        <div className="apl-qna-composer">
          <div className="apl-seg" style={{ marginBottom: 12 }}>
            {["Buyer", "Investor", "Tenant", "Agent"].map(r => (
              <button key={r} className={role === r ? "on" : ""} onClick={() => setRole(r)}>{r}</button>
            ))}
          </div>
          <textarea className="apl-qna-input" rows="3" value={q} onChange={e => setQ(e.target.value)}
            placeholder={`e.g. Offered a mid-floor 2BR at RM 600k with RM 80k discount. Fair vs what others paid?`} />
          <div className="apl-qna-composer-actions">
            <button className="apl-btn apl-btn-secondary apl-btn-sm" onClick={() => { setOpen(false); setQ(""); }}>Cancel</button>
            <button className="apl-btn apl-btn-primary apl-btn-sm" disabled={!q.trim()} onClick={post}>Post anonymously</button>
          </div>
        </div>
      )}

      <div className="apl-qna-list">
        {threads.length === 0 && <div className="apl-qna-empty">No questions yet — be the first to ask whether a deal here is fair.</div>}
        {threads.map(t => (
          <div key={t.id} className="apl-qna-thread">
            <div className="apl-qna-q-head">
              <span className={"apl-qna-role " + t.role.toLowerCase()}>{t.role}</span>
              {(t.tags || []).map(tag => <span key={tag} className="apl-qna-tag">{tag}</span>)}
              <span className="apl-qna-when">{t.when}</span>
            </div>
            <div className="apl-qna-q">{t.q}</div>
            {(t.replies || []).length > 0 ? (
              <div className="apl-qna-replies">
                {t.replies.map((r, i) => (
                  <div key={i} className="apl-qna-reply">
                    <div className="apl-qna-reply-head">
                      <span className="apl-qna-reply-who">{r.who}</span>
                      <TrustBadge label={r.badge} size="sm" />
                      <span className="apl-qna-when">{r.when}</span>
                    </div>
                    <div className="apl-qna-reply-text">{r.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="apl-qna-noreply">No replies yet — buyers and contract-tier contributors can weigh in.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// "How this data works" — quiet, educational trust box (brief §C)
function HowDataWorks() {
  return (
    <div className="apl-howdata">
      <div className="apl-howdata-ico">i</div>
      <div className="apl-howdata-body">
        <div className="apl-howdata-head">About this data</div>
        <ul className="apl-howdata-list">
          <li>No names, IC, or unit numbers shown.</li>
          <li>Records with proof are marked as stronger.</li>
          <li>Always check with your bank and lawyer before signing.</li>
        </ul>
      </div>
    </div>
  );
}

// Preset dropdown with an "Other…" escape hatch that reveals an inline number input.
function LoanPreset({ value, setValue, presets, min, max, step, unit, warnMsg, fallback }) {
  const [mode, setMode] = appS("preset");   // "preset" | "other"
  const [draft, setDraft] = appS(String(value));
  const inRange = value >= min && value <= max;
  const commit = (raw) => {
    const s = String(raw).trim();
    if (s === "") { setValue(fallback); return; }
    const n = parseFloat(s);
    if (isNaN(n)) return;                    // ignore non-numeric, keep previous
    setValue(n);
  };
  if (mode === "other") {
    return (
      <div className="apl-loan-other">
        <div className="apl-loan-other-in">
          <input type="number" inputMode="decimal" min={min} max={max} step={step}
            value={draft} autoFocus
            onChange={e => { setDraft(e.target.value); commit(e.target.value); }}
            onBlur={e => commit(e.target.value)} />
          <span className="apl-loan-other-unit">{unit}</span>
        </div>
        {!inRange && <div className="apl-loan-other-warn">{warnMsg}</div>}
        <button type="button" className="apl-loan-rate-link" onClick={() => setMode("preset")}>Back to presets</button>
      </div>
    );
  }
  const known = presets.some(p => p.v === value);
  return (
    <select value={known ? value : "__other"}
      onChange={e => {
        if (e.target.value === "__other") { setDraft(String(value)); setMode("other"); }
        else setValue(parseFloat(e.target.value));
      }}>
      {presets.map(p => <option key={p.v} value={p.v}>{p.label}</option>)}
      <option value="__other">{known ? "Other…" : `Other (${value}${unit})…`}</option>
    </select>
  );
}

// "What your loan actually buys" — Malaysian banks lend on SPA price, so the
// real risk isn't needing cash upfront (the developer's zero-down scheme works)
// but borrowing more than the property is worth (brief §A.4, rewrite).
function LoanRealityCheck({ proj }) {
  const recCount = (proj.submissions && proj.submissions.length) || proj.records || 0;
  const enough = recCount >= 3;
  // Adjustable assumptions (for 2nd-property / foreigner buyers).
  const [ltv, setLtv] = appS(90);          // % of SPA borrowed
  const [rate, setRate] = appS(4.5);       // annual %
  const [years, setYears] = appS(30);
  const [showRate, setShowRate] = appS(false);
  const [disc, setDisc] = appS(4.5);       // discount rate for present value
  const [cmpMargin, setCmpMargin] = appS(80);   // margin to compare against 90%
  const [showUnder, setShowUnder] = appS(false); // expand underwater explanation (Table 2)
  const monthly = (P) => {
    const r = (rate / 100) / 12, n = years * 12;
    return (P * r) / (1 - Math.pow(1 + r, -n));
  };
  // Present value of a level monthly stream, discounted at `r` (defaults to selected rate).
  const pvStream = (pmt, r = disc) => {
    const rd = (r / 100) / 12, n = years * 12;
    if (rd === 0) return pmt * n;
    return pmt * (1 - Math.pow(1 + rd, -n)) / rd;
  };
  const k = (n) => "RM " + Math.round(n).toLocaleString();
  if (!enough) {
    // #2 empty state removed — always show the table using seed SPA + a typical
    // zone discount to estimate net when no buyer records exist yet.
  }
  const enoughForFooter = enough;
  // Comparable-unit filter — narrows the averaged record set for SPA, real price, discount.
  const [flt, setFlt] = appS({ unit: "any", floor: "any", size: "any" });
  const resetFlt = () => setFlt({ unit: "any", floor: "any", size: "any" });
  const fltActive = flt.unit !== "any" || flt.floor !== "any" || flt.size !== "any";
  const allSubs = proj.submissions || [];
  const unitTypes = [...new Set(allSubs.map(r => r.unit).filter(Boolean))];
  const sizeBand = (bu) => bu < 700 ? "s" : bu < 1200 ? "m" : bu < 1800 ? "l" : "xl";
  const floorBand = (r) => r.floor == null ? null : (r.floor <= 10 ? "low" : r.floor <= 20 ? "mid" : "high");
  const matches = (r) => (flt.unit === "any" || r.unit === flt.unit)
    && (flt.floor === "any" || floorBand(r) === flt.floor)
    && (flt.size === "any" || sizeBand(r.builtUp) === flt.size);
  const filtered = fltActive ? allSubs.filter(matches) : allSubs;
  const usableSet = filtered.length ? filtered : allSubs;   // 0-match fallback
  const fltZeroMatch = fltActive && filtered.length === 0;
  const setForSpa = usableSet.filter(s => s.net > 0 && s.rebate != null);
  const perRecSpa = setForSpa.map(s => (s.net * 1000) / (1 - s.rebate / 100));
  const spaFromSubs = perRecSpa.length ? Math.round(perRecSpa.reduce((a, b) => a + b, 0) / perRecSpa.length) : null;
  const spaEstimated = spaFromSubs == null;
  const spaDefault = spaFromSubs != null ? spaFromSubs : Math.round((proj.spaMin + proj.spaMax) / 2) * 1000;
  const spaMinRange = perRecSpa.length ? Math.round(Math.min(...perRecSpa)) : proj.spaMin * 1000;
  const spaMaxRange = perRecSpa.length ? Math.round(Math.max(...perRecSpa)) : proj.spaMax * 1000;
  // Net (real price) — averaged from the same set
  const netSet = usableSet.filter(s => s.net > 0);
  const netAvg = netSet.length ? Math.round(netSet.reduce((a, b) => a + b.net * 1000, 0) / netSet.length) : proj.netMedian * 1000;
  const netMinRange = netSet.length ? Math.min(...netSet.map(s => s.net * 1000)) : proj.netMin * 1000;
  const netMaxRange = netSet.length ? Math.max(...netSet.map(s => s.net * 1000)) : proj.netMax * 1000;
  const net = netAvg;
  const singleRec = usableSet.length === 1;
  const [spa, setSpa] = appS(spaDefault);
  appE(() => { setSpa(spaDefault); }, [proj.slug, flt.unit, flt.floor, flt.size]);   // reset when project or filter changes
  const spaOutOfRange = spa < spaMinRange * 0.85 || spa > spaMaxRange * 1.15;
  const discount = Math.max(0, spa - net);
  const discPct = spa > 0 ? Math.round(discount / spa * 100) : 0;

  // Rent (median) from PropX yield — same across all margins.
  const rentAmt = proj.gyield ? Math.round(net * (proj.gyield / 100) / 12) : null;
  const grossYield = proj.gyield || (rentAmt ? (rentAmt * 12 / net * 100) : null);
  const cf = (v) => (v < 0 ? "−RM " + Math.abs(v).toLocaleString() : "RM " + v.toLocaleString());

  // The real JB decision: banks lend on SPA; buyer chooses loan MARGIN.
  const MARGIN_LBL = { 90: "first home", 80: "2nd property", 70: "3rd+ / foreigner", 60: "foreigner" };
  const col = (m) => {
    const loan = Math.round(spa * (m / 100));
    const dp = Math.round(spa * (1 - m / 100));
    const cashShort = Math.max(0, dp - discount);          // cash you still pay after rebate
    const freebiesLeft = Math.max(0, discount - dp);       // rebate left once dp is covered
    const dpBand = cashShort === 0 ? "g" : (cashShort <= discount ? "o" : "r");
    const mo = monthly(loan);
    const total = mo * years * 12;                          // nominal total paid
    const cashflow = rentAmt != null ? Math.round(rentAmt - mo) : null;
    const topupYr = cashflow != null && cashflow < 0 ? Math.abs(cashflow) * 12 : 0;
    let cfBand = "g";
    if (cashflow != null && rentAmt) {
      const ratio = cashflow / rentAmt;
      cfBand = cashflow >= 0 ? "g" : ratio > -0.12 ? "sg" : ratio > -0.30 ? "o" : "r";
    }
    const under = loan > net;
    const underBy = Math.max(0, Math.round(loan - net));
    const interest = Math.max(0, Math.round(total - loan));   // interest portion only
    const extraBorrow = Math.max(0, loan - net);              // overborrowing above real price
    const extraInterest = extraBorrow > 0 ? Math.round(monthly(extraBorrow) * years * 12 - extraBorrow) : 0;
    return { m, loan, dp, cashShort, freebiesLeft, dpBand, mo, total, interest, extraBorrow, extraInterest, cashflow, topupYr, cfBand, under, underBy };
  };
  const bandClass = { g: "g", sg: "g", o: "o", r: "r", n: "n" };
  const base = col(ltv);                // Table 1 — user-selected margin
  const t2Base = col(90);                // Table 2 — locked reference at 90%
  const alt = col(cmpMargin);           // comparison margin
  const moSave = Math.round(t2Base.mo - alt.mo);
  const intSave = Math.round(t2Base.interest - alt.interest);
  const cashMore = Math.max(0, alt.dp - t2Base.dp);
  // Underwater explanation per column — case-based, using this project's real numbers.
  const underwaterExplain = (loan) => {
    const buffer = net - loan;
    if (loan > net) {
      const gap = Math.round(loan - net);
      const yrs = Math.max(1, Math.round(gap / (net * 0.04)));
      return { band: "r", label: "Underwater — by " + k(gap) + ". Break even in ~" + yrs + " yr" + (yrs > 1 ? "s" : "") + ".",
        text: <>Your loan (<b>{k(Math.round(loan))}</b>) is more than the property is worth (<b>{k(Math.round(net))}</b>). If you sell today you'd get about {k(Math.round(net))}, but still owe the bank {k(Math.round(loan))} — you'd need to bring <b>{k(gap)} cash</b> to cover the difference. At 4% yearly growth, the value passes your loan in about <b>{yrs} year{yrs > 1 ? "s" : ""}</b>.</> };
    }
    if (buffer < net * 0.05) {
      return { band: "o", label: "Not underwater. " + k(Math.round(buffer)) + " buffer — tight.",
        text: <>Your loan (<b>{k(Math.round(loan))}</b>) is just below the property's value (<b>{k(Math.round(net))}</b>). You have a small buffer of <b>{k(Math.round(buffer))}</b>. You could sell today, but after agent fees (~RM 14,000) and legal costs (~RM 5,000) you'd keep very little. Not trapped, but tight.</> };
    }
    return { band: "g", label: "Not underwater. " + k(Math.round(buffer)) + " buffer. Safe to sell anytime.",
      text: <>Your loan (<b>{k(Math.round(loan))}</b>) is well below the property's value (<b>{k(Math.round(net))}</b>). You have <b>{k(Math.round(buffer))}</b> of room. You can sell anytime, pay off the loan, cover fees and still walk away with cash — and refinance easily.</> };
  };
  const uwBase = underwaterExplain(t2Base.loan);
  const uwAlt = underwaterExplain(alt.loan);
  // Net yield (cap rate) — costs averaged from submitted rental records (read-only display).
  let netYield = null, noi = null, yrRent = null, costs = null, spread = null;
  const costDefaults = rentAmt != null
    ? { maint: 2400, sinking: 600, assessment: 500, vacancy: rentAmt, repairs: 500 }
    : { maint: 0, sinking: 0, assessment: 0, vacancy: 0, repairs: 0 };
  const rentalSubCount = allSubs.filter(s => s.role === "tenant").length || allSubs.length;
  const cost = costDefaults;
  if (rentAmt != null) {
    yrRent = rentAmt * 12;
    costs = cost.maint + cost.sinking + cost.assessment + cost.vacancy + cost.repairs;
    noi = yrRent - costs;
    netYield = noi / net * 100;
    spread = netYield - rate;   // yield minus loan rate
  }

  return (
    <div className="apl-loan">
      <div className="apl-loan-head"><span className="apl-loan-ico">⚖</span> The full picture on your loan</div>
      <details className="apl-loan-101">
        <summary>New to property? Read this first</summary>
        <div className="apl-loan-101-body">
          <div className="apl-loan-101-h">How property loans work in Malaysia</div>
          <ul>
            <li>Banks lend a share of the <b>SPA price</b> — you pay the rest as down payment.</li>
            <li>Your monthly is based on the <b>loan</b>, not the property's real price.</li>
            <li>Bigger loan → less cash at signing.</li>
            <li>But → higher monthly payment for longer.</li>
          </ul>
        </div>
      </details>

      <details className="apl-cmpfilt">
        <summary>Compare to a specific unit type {fltActive ? <span className="apl-cmpfilt-badge">{filtered.length}/{allSubs.length} records</span> : null} ▾</summary>
        <div className="apl-cmpfilt-body">
          <label className="apl-cmpfilt-field"><span>Unit type</span>
            <select value={flt.unit} onChange={e => setFlt(f => ({ ...f, unit: e.target.value }))}>
              <option value="any">Any</option>
              {unitTypes.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>
          <label className="apl-cmpfilt-field"><span>Floor</span>
            <select value={flt.floor} onChange={e => setFlt(f => ({ ...f, floor: e.target.value }))}>
              <option value="any">Any</option>
              <option value="low">Low (1–10)</option>
              <option value="mid">Mid (11–20)</option>
              <option value="high">High (21+)</option>
            </select>
          </label>
          <label className="apl-cmpfilt-field"><span>Built-up (sqft)</span>
            <select value={flt.size} onChange={e => setFlt(f => ({ ...f, size: e.target.value }))}>
              <option value="any">Any</option>
              <option value="s">Under 700</option>
              <option value="m">700–1,200</option>
              <option value="l">1,200–1,800</option>
              <option value="xl">1,800+</option>
            </select>
          </label>
          {fltActive && <button type="button" className="apl-cmpfilt-reset" onClick={resetFlt}>Reset filter</button>}
        </div>
        {fltZeroMatch && (
          <p className="apl-cmpfilt-note">
            No exact match for this filter — showing project average.
            <span className="apl-cmpfilt-caption"> SPA price and real price are averaged across all {allSubs.length} submitted record{allSubs.length !== 1 ? "s" : ""} for this project.</span>
          </p>
        )}
        {fltActive && !fltZeroMatch && (
          <p className="apl-cmpfilt-note">
            Averaged across {filtered.length} matching record{filtered.length !== 1 ? "s" : ""}.
            <span className="apl-cmpfilt-caption"> {filtered.length === 1
              ? "Based on 1 buyer submission matching this unit type, floor, and size — SPA price, real price, and discount are that record's actual figures."
              : "SPA price and real price are each averaged across the " + filtered.length + " matching submissions. Discount % is calculated from these two averages, not averaged separately."}</span>
          </p>
        )}
      </details>

      <div className="apl-loan-context">
        {!fltActive && (
          <p className="apl-cmpfilt-caption apl-cmpfilt-default">Showing the average across all {allSubs.length} submitted record{allSubs.length !== 1 ? "s" : ""}. Use the filter above to compare a specific unit type, floor, and size.</p>
        )}
        <label className="apl-spa-edit">
          <span className="apl-spa-edit-lbl">SPA price {fltActive && !fltZeroMatch ? "(filtered)" : ""}</span>
          <div className="apl-spa-edit-in">
            <span className="apl-spa-edit-pre">RM</span>
            <input type="number" inputMode="numeric" step={1000}
              value={spa}
              onChange={e => setSpa(Math.max(0, parseInt(e.target.value, 10) || 0))} />
            {spa !== spaDefault && <button type="button" className="apl-spa-reset" onClick={() => setSpa(spaDefault)} title="Reset to average">↺</button>}
          </div>
          {!singleRec && (
            <span className="apl-spa-edit-help">
              Range from records: <b>RM {Math.round(spaMinRange / 1000).toLocaleString()}k–RM {Math.round(spaMaxRange / 1000).toLocaleString()}k</b>
              {spaEstimated && <span className="apl-spa-est"> · estimated (no SPA records yet)</span>}
              {spaOutOfRange && <span className="apl-spa-warn"> · outside typical range</span>}
            </span>
          )}
        </label>
        <span className="apl-spa-derived">
          Real price: <b>{k(net)}</b>
          {!singleRec && netSet.length > 1 && <span className="apl-spa-edit-help"> (range {k(netMinRange)}–{k(netMaxRange)})</span>}
          {" · "}Developer discount: <b>{k(discount)} ({discPct}%)</b>
        </span>
      </div>

      <div className="apl-loan-adjust-grid apl-loan-adjust-top">
        <label>Loan margin
          <LoanPreset value={ltv} setValue={setLtv} fallback={90} min={50} max={90} step={5} unit="%"
            warnMsg="Malaysian banks offer 50%–90% loan margin."
            presets={[{v:90,label:"90% — first home"},{v:80,label:"80% — 2nd property"},{v:70,label:"70% — 3rd+ property"},{v:60,label:"60% — foreigner"}]} />
        </label>
        <label>Interest rate
          <LoanPreset value={rate} setValue={setRate} fallback={4.5} min={3.0} max={6.0} step={0.1} unit="%"
            warnMsg="Malaysian home loan rates are typically 3.0%–6.0%."
            presets={[{v:3.5,label:"3.5%"},{v:4.0,label:"4.0%"},{v:4.5,label:"4.5%"},{v:5.0,label:"5.0%"}]} />
        </label>
        <label>Tenure
          <LoanPreset value={years} setValue={setYears} fallback={30} min={5} max={35} step={1} unit=" years"
            warnMsg="Malaysian home loans are typically 5–35 years."
            presets={[{v:15,label:"15 years"},{v:20,label:"20 years"},{v:25,label:"25 years"},{v:30,label:"30 years"},{v:35,label:"35 years"}]} />
        </label>
      </div>

      {/* TABLE 1 — default 90% view, one column, always visible */}
      <table className="apl-loan-uni apl-loan-t1">
        <thead><tr><th>Your loan at {ltv}%</th><th></th></tr></thead>
        <tbody>
          <tr><td>Loan amount</td><td><b>{k(base.loan)}</b><span className="apl-loan-work">{k(spa)} × {ltv}%</span></td></tr>
          <tr><td>Down payment ({100 - ltv}%)</td><td>{base.cashShort === 0 ? <><b>No cash needed</b> — {k(base.dp)}, covered by developer</> : <><b>{k(base.dp)}</b> — pay {k(base.cashShort)} cash</>}<span className="apl-loan-work">{k(spa)} × 10% = {k(base.dp)}</span></td></tr>
          <tr><td>Cash back to you</td><td className="g"><b>{k(base.freebiesLeft)}</b> (furniture, legal fees, or cash)<span className="apl-loan-work">{k(discount)} developer discount − {k(base.dp)} down payment</span></td></tr>
          <tr><td>Monthly payment</td><td><b>{k(base.mo)}</b> for {years} years<span className="apl-loan-work">{k(base.loan)} at {rate.toFixed(1)}% for {years * 12} months</span></td></tr>
          <tr><td>Total interest you pay</td><td><b>{k(base.interest)}</b> over {years} years<span className="apl-loan-work">{k(base.mo)} × {years * 12} − {k(base.loan)} loan</span></td></tr>
        </tbody>
      </table>
      {rentAmt != null && (
        <table className="apl-loan-uni apl-loan-t1 apl-loan-t1-rent">
          <thead><tr><th>Can rent cover your loan?</th><th></th></tr></thead>
          <tbody>
            <tr><td>Rent (from PropX)</td><td><b>{k(rentAmt)}</b>/mo<span className="apl-loan-work">average of {recCount} rental record{recCount !== 1 ? "s" : ""}</span></td></tr>
            <tr className={"apl-loan-topup " + bandClass[base.cfBand]}>
              <td>{base.cashflow >= 0 ? "Rent covers, spare" : "You top up"}</td>
              <td><b>{base.cashflow >= 0 ? cf(base.cashflow) + "/mo" : "RM " + Math.abs(base.cashflow).toLocaleString() + "/mo"}</b>{base.topupYr > 0 ? " (" + k(base.topupYr) + "/year)" : ""}<span className="apl-loan-work">{k(base.mo)} loan − {k(rentAmt)} rent</span></td>
            </tr>
            <tr className="sec sec-flex"><td colSpan={2}>Yield on real price</td></tr>
            <tr><td>Gross yield</td><td><b>{grossYield != null ? grossYield.toFixed(1) + "%" : "—"}</b> <span className="apl-loan-yield-note">(rent ÷ real price)</span><span className="apl-loan-work">{k(rentAmt)} × 12 ÷ {k(net)}</span></td></tr>
            <tr><td>Net yield <span className="apl-loan-info" tabIndex={0}>(cap rate)<span className="apl-loan-tip">Net yield = (yearly rent − yearly costs) ÷ real price<br/>Costs shown are the average of {rentalSubCount} submitted record{rentalSubCount !== 1 ? "s" : ""} — edit any figure below to see how your net yield changes.<br/><br/>Yearly rent: {k(rentAmt)} × 12 = {k(yrRent)}<br/>Yearly costs: maintenance {k(cost.maint)} + sinking fund {k(cost.sinking)} + assessment {k(cost.assessment)} + vacancy {k(cost.vacancy)} + repairs {k(cost.repairs)} = {k(costs)}<br/>NOI: {k(yrRent)} − {k(costs)} = {k(noi)}<br/>Net yield: {k(noi)} ÷ {k(net)} = {netYield.toFixed(1)}%</span></span></td><td><b>{netYield.toFixed(1)}%</b> <span className="apl-loan-yield-note">(after costs)</span><span className="apl-loan-work">({k(rentAmt)} × 12 − {k(costs)} costs) ÷ {k(net)}</span></td></tr>
          </tbody>
        </table>
      )}
      {rentAmt != null && (
        <div className="apl-costs apl-costs-ro">
          <div className="apl-costs-head">
            <span>Yearly costs breakdown</span>
            <span className="apl-costs-src">Averaged from {rentalSubCount} rental submission{rentalSubCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="apl-costs-ro-line" style={{ position: "relative" }}>
            <span className="apl-ct">Maintenance<span className="apl-ct-tip">Monthly fee you pay to the building management for cleaning, security, lift, pool, and shared areas. Paid every month whether you have a tenant or not.</span></span> <b>{k(cost.maint)}</b> + <span className="apl-ct">Sinking fund<span className="apl-ct-tip">Savings fund for big future repairs — like repainting the building, replacing lifts, or fixing the roof. Paid monthly on top of maintenance; you can't opt out.</span></span> <b>{k(cost.sinking)}</b> + <span className="apl-ct">Assessment<span className="apl-ct-tip">Yearly council tax (cukai pintu) to MBJB for rubbish collection, drains, and street lights. You pay it once or twice a year.</span></span> <b>{k(cost.assessment)}</b> + <span className="apl-ct">Vacancy<span className="apl-ct-tip">The months your unit sits empty between tenants — no rent coming in, but you still pay maintenance and sinking fund. We estimate 1 month empty per year.</span></span> <b>{k(cost.vacancy)}</b> + <span className="apl-ct">Repairs<span className="apl-ct-tip">Small fixes you pay for as landlord — aircon servicing, leaking taps, broken switches, repainting between tenants. Not covered by the maintenance fee.</span></span> <b>{k(cost.repairs)}</b>
          </div>
          <div className="apl-costs-total">
            <span>Total yearly costs</span>
            <b>{k(costs)}</b>
          </div>
        </div>
      )}
      <div className="apl-loan-takeaways">
        <p className="apl-loan-takeaway"><b>Homeowner?</b> You borrow <b>{k(base.underBy)} more</b> than the property is worth. Extra interest: <b>~{k(base.extraInterest)}</b> over {years} years.<span className="apl-loan-work">{k(base.loan)} loan − {k(net)} real price = {k(base.underBy)}; interest on that over {years} yrs</span><span className="apl-loan-underwater-note">{base.underBy > 0
          ? "If your loan is more than the property's real price, you're 'underwater' — you'd need to bring extra cash to sell, and you're paying years of interest on value that isn't really there."
          : "Your loan doesn't exceed the property's real price, so you're not paying interest on borrowed value that isn't there — you're not underwater."}</span></p>
        {rentAmt != null && (
          <p className="apl-loan-takeaway"><b>Investor?</b> You earn <b>{netYield.toFixed(1)}%</b>, you pay <b>{rate.toFixed(1)}%</b> — {spread < 0
            ? <><b>negative spread of {Math.abs(spread).toFixed(1)}%</b>. You top up RM {Math.abs(base.cashflow).toLocaleString()}/mo.</>
            : <><b>positive spread of {spread.toFixed(1)}%</b>. Rent covers the loan.</>}</p>
        )}
      </div>

      {/* TABLE 2 — opt-in margin comparison */}
      <details className="apl-loan-cmp2">
        <summary>What if I put more cash down? Compare ›</summary>
        <div className="apl-loan-cmp2-body">
          <label className="apl-loan-cmp2-pick">Compare 90% loan with:
            <LoanPreset value={cmpMargin} setValue={setCmpMargin} fallback={80} min={50} max={90} step={5} unit="%"
              warnMsg="Malaysian banks offer 50%–90% loan margin."
              presets={[{v:85,label:"85%"},{v:80,label:"80% — 2nd property"},{v:70,label:"70% — 3rd+ property"},{v:60,label:"60% — foreigner"}]} />
          </label>
          <table className="apl-loan-uni apl-loan-margins apl-loan-cmp3">
            <thead><tr><th></th><th>90% (current)</th><th>{cmpMargin}% (your choice)</th><th>Difference</th></tr></thead>
            <tbody>
              <tr><td>Loan amount</td><td>{k(t2Base.loan)}</td><td>{k(alt.loan)}</td><td className="g">{k(t2Base.loan - alt.loan)} less</td></tr>
              <tr><td>Down payment</td><td>{k(t2Base.dp)}{t2Base.cashShort === 0 ? " (covered)" : ""}</td><td>{k(alt.dp)}</td><td className="o">{k(cashMore)} more cash</td></tr>
              <tr><td>Monthly payment</td><td>{k(t2Base.mo)}</td><td>{k(alt.mo)}</td><td className="g"><b>Save RM {moSave.toLocaleString()}/mo</b></td></tr>
              <tr><td>Total interest over {years} years</td><td>{k(t2Base.interest)}</td><td>{k(alt.interest)}</td><td className="g"><b>Save {k(intSave)}</b></td></tr>
              {rentAmt != null && <tr><td>Monthly cashflow (after rent)</td><td className={bandClass[t2Base.cfBand]}>{cf(t2Base.cashflow)}<span className="apl-loan-work">{k(rentAmt)} rent − {k(t2Base.mo)} = {cf(t2Base.cashflow)}</span></td><td className={bandClass[alt.cfBand]}>{cf(alt.cashflow)}<span className="apl-loan-work">{k(rentAmt)} rent − {k(alt.mo)} = {cf(alt.cashflow)}</span></td><td className="g"><b>RM {moSave.toLocaleString()}/mo less top-up</b></td></tr>}
              <tr><td>Underwater? <button className="apl-uw-toggle" onClick={() => setShowUnder(s => !s)} aria-expanded={showUnder}>ⓘ</button></td>
                <td className={t2Base.under ? "r" : "g"}>{t2Base.under ? "Yes — by " + k(t2Base.underBy) : "No"}</td>
                <td className={alt.under ? "o" : "g"}>{alt.under ? "Yes — by " + k(alt.underBy) : "No"}</td>
                <td className={alt.under ? "n" : "g"}>{alt.under ? "Still underwater" : "Safe to sell/refinance"}</td></tr>
              {showUnder && (
                <tr className="apl-uw-explain-row"><td colSpan={4}>
                  <div className="apl-uw-grid">
                    <div className={"apl-uw-box " + uwBase.band}><div className="apl-uw-h">At 90%</div>{uwBase.text}</div>
                    <div className={"apl-uw-box " + uwAlt.band}><div className="apl-uw-h">At {cmpMargin}%</div>{uwAlt.text}</div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
          <p className="apl-loan-uni-note">Put <b>{k(cashMore)}</b> more cash down today, save <b>RM {moSave.toLocaleString()}/mo</b> and <b>{k(intSave)}</b> in interest over {years} years.</p>
        </div>
      </details>

      <div className="apl-loan-note">{enoughForFooter
        ? `Based on ${recCount} buyer-submitted prices. Assumes ${rate.toFixed(1)}% rate, ${years} years.`
        : `Estimated from area averages. No buyer prices yet.`}</div>
    </div>
  );
}

// Rental yield card — achieved rent & net yield (brief §A.5)
function RentalYieldCard({ proj, onRent }) {
  const hasRent = !!proj.gyield;
  if (!hasRent) {
    return (
      <div className="apl-rental apl-rental-empty">
        <div className="apl-rental-head">Rental yield</div>
        <p className="apl-rental-empty-msg">No rent data yet. {onRent ? <b className="apl-rental-cta" onClick={onRent} style={{ cursor: "pointer", color: "var(--apl-teal)" }}>Renting here? Share what you pay</b> : <b>Renting here? Share what you pay</b>} — takes 30 seconds.</p>
      </div>
    );
  }
  const net = proj.netMedian * 1000;
  const rent = Math.round(net * (proj.gyield / 100) / 12);
  const nRecords = Math.max(2, Math.round(proj.records * 0.4));
  const contractBacked = Math.max(1, Math.round(nRecords * 0.45));
  return (
    <div className="apl-rental">
      <div className="apl-rental-head">Rental yield</div>
      <div className="apl-rental-figs">
        <div className="apl-rental-fig">
          <span className="apl-rental-fig-v">RM {rent.toLocaleString()}<i>/mo</i></span>
          <span className="apl-rental-fig-l">Median achieved rent</span>
        </div>
        <div className="apl-rental-fig">
          <span className="apl-rental-fig-v" style={{ color: "var(--apl-teal)" }}>{proj.gyield}%</span>
          <span className="apl-rental-fig-l">Median net yield</span>
        </div>
      </div>
      <div className="apl-rental-meta">Assumes {proj.isLanded ? "partly furnished" : "fully furnished"} · Based on {nRecords} rental records, {contractBacked} contract-backed.</div>
    </div>
  );
}

function ProjectDetail({ proj, onBack, onArea, onContribute, onPick }) {
  const [saved, toggle] = useAplSaved();
  const isSaved = saved.includes(proj.slug);
  const [addRec, setAddRec] = appS(false);
  const [chooseKind, setChooseKind] = appS(false);
  const unlocked = window.hasContributed();
  const daysLeft = window.unlockDaysLeft ? window.unlockDaysLeft() : 0;
  // map this project's area → its zone, for the neighbourhood panel
  const projZoneId = (window.JB_GEO?.zones.find(z => z.corridors.some(c => c.areaKeys.includes(proj.area))) || {}).id;
  const openSale = () => onContribute && onContribute({ id: "buyer", kind: "sale", name: "Home buyer", badge: "Buyer Contributor", teaser: "" }, proj);
  const openRent = () => onContribute && onContribute({ id: "tenant", kind: "rent", name: "Tenant / Landlord", badge: "Rental Contributor", teaser: "" }, proj);
  return (
    <div style={{ padding: "32px 22px 80px", maxWidth: 900, margin: "0 auto" }}>
      {addRec && <window.SubmitDealModal onClose={() => setAddRec(false)} onDone={() => setAddRec(false)} />}
      {chooseKind && (
        <div className="apl-modal-scrim" onClick={() => setChooseKind(false)}>
          <div className="apl-choose-kind" onClick={e => e.stopPropagation()}>
            <button className="apl-modal-close" onClick={() => setChooseKind(false)} aria-label="Close">✕</button>
            <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>{proj.name} · contribute</div>
            <h2 className="apl-h3 apl-choose-title">Which are you?</h2>
            <p className="apl-choose-sub">This helps us ask the right questions and skip the ones that don't apply.</p>
            <div className="apl-choose-grid">
              <button className="apl-choose-card" onClick={() => { setChooseKind(false); openSale(); }}>
                <span className="apl-choose-ico" aria-hidden="true">🏠</span>
                <span className="apl-choose-h">I bought here</span>
                <span className="apl-choose-d">Share the SPA price, real price, discount, unit type, floor and size.</span>
              </button>
              <button className="apl-choose-card" onClick={() => { setChooseKind(false); openRent(); }}>
                <span className="apl-choose-ico" aria-hidden="true">🔑</span>
                <span className="apl-choose-h">I'm renting here</span>
                <span className="apl-choose-d">Share the monthly rent, unit type, floor, size, plus the five yearly costs.</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12 }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.06)", border: "0.5px solid rgba(0,0,0,0.08)", padding: "8px 16px 8px 12px", borderRadius: 980, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          ‹ Back
        </button>
      </div>
      <div style={{ background: "var(--apl-surface)", borderRadius: 18, boxShadow: "var(--apl-shadow)", overflow: "hidden", border: "1px solid var(--apl-line)" }}>
        <div style={{ aspectRatio: "21/9", position: "relative" }} dangerouslySetInnerHTML={{ __html: window.AplImg.projectPhoto(proj.slug) }}></div>
        <div style={{ padding: "28px 32px" }}>
          <div className="apl-eyebrow" style={{ marginBottom: 8 }}>{proj.corridor} · {proj.propertyType}</div>
          <h1 className="apl-h2" style={{ margin: "0 0 6px" }}>{proj.name}</h1>
          <div style={{ fontSize: 14, color: "var(--apl-ink-3)", marginBottom: 24 }}>{proj.developer}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="apl-proj-kpis">
            <div style={{ background: "var(--apl-teal-soft)", borderRadius: 14, padding: "20px 22px" }}>
              <div className="apl-eyebrow" style={{ color: "var(--apl-teal)", marginBottom: 10 }}>Net range</div>
              <div style={{ fontFamily: "var(--apl-serif)", fontSize: 26, letterSpacing: "-0.02em", color: "var(--apl-teal)", fontFeatureSettings: '"tnum"', lineHeight: 1.05 }}>{fmtRM(proj.netMin)}–{fmtRM(proj.netMax)}</div>
              <div style={{ fontSize: 11.5, color: "var(--apl-ink-3)", marginTop: 8 }}>across {proj.records} records</div>
            </div>
            <div style={{ background: "var(--apl-bg-2)", borderRadius: 14, padding: "20px 22px" }}>
              <div className="apl-eyebrow" style={{ color: "var(--apl-ink-3)", marginBottom: 10 }}>SPA range</div>
              <div style={{ fontFamily: "var(--apl-serif)", fontSize: 26, letterSpacing: "-0.02em", fontFeatureSettings: '"tnum"', lineHeight: 1.05 }}>{fmtRM(proj.spaMin)}–{fmtRM(proj.spaMax)}</div>
              <div style={{ fontSize: 11.5, color: "var(--apl-ink-3)", marginTop: 8 }}>on the contract</div>
            </div>
            <div style={{ background: "var(--apl-clay-soft)", borderRadius: 14, padding: "20px 22px" }}>
              <div className="apl-eyebrow" style={{ color: "var(--apl-clay)", marginBottom: 10 }}>Avg discount</div>
              <div style={{ fontFamily: "var(--apl-serif)", fontStyle: "italic", fontSize: 26, color: "var(--apl-clay)", letterSpacing: "-0.01em", fontFeatureSettings: '"tnum"', lineHeight: 1.05 }}>−{proj.discAvg}%</div>
              {(() => {
                const t = window.discountTrend ? window.discountTrend(proj) : null;
                if (t && t.length >= 2) {
                  const d = t[t.length - 1].disc - t[0].disc;
                  if (d !== 0) return <div style={{ fontSize: 11.5, color: "var(--apl-ink-3)", marginTop: 8 }}>{d > 0 ? "↑" : "↓"} {Math.abs(d)}pt vs {t[0].year}</div>;
                }
                return <div style={{ fontSize: 11.5, color: "var(--apl-ink-3)", marginTop: 8 }}>{proj.gyield ? proj.gyield + "% gross yield" : "SPA vs net"}</div>;
              })()}
            </div>
            <div style={{ background: "var(--apl-bg-2)", borderRadius: 14, padding: "20px 22px" }}>
              <div className="apl-eyebrow" style={{ color: "var(--apl-ink-3)", marginBottom: 10 }}>Records</div>
              <div style={{ fontFamily: "var(--apl-serif)", fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{proj.records}</div>
              <div style={{ fontSize: 11.5, color: "var(--apl-ink-3)", marginTop: 8 }}>from buyers</div>
            </div>
          </div>
          <div className="apl-builtup-row">
            <div><span className="l">Avg built-up</span><span className="v">{proj.builtUp.toLocaleString()} sf</span></div>
            <div><span className="l">Avg psf (net)</span><span className="v">RM {proj.psf}</span></div>
            <div><span className="l">psf range</span><span className="v">RM {proj.psfMin}–{proj.psfMax}</span></div>
            {proj.towers && <div><span className="l">Building</span><span className="v">{proj.towers} tower{proj.towers > 1 ? "s" : ""} · {proj.totalFloors} floors</span></div>}
          </div>
          <LoanRealityCheck proj={proj} />
          <div className="apl-detail-twoup apl-detail-twoup-rental">
            <RentalYieldCard proj={proj} onRent={openRent} />
          </div>
          <HowDataWorks />
          {unlocked && daysLeft > 0 && (
            <div className="apl-unlock-banner">
              <span className="apl-unlock-dot"></span>
              <span>Full access active · <b>{daysLeft} day{daysLeft === 1 ? "" : "s"} remaining</b></span>
              <a href="#submit" className="apl-unlock-extend">Submit another deal to extend →</a>
            </div>
          )}
          <ProjectSubmissions proj={proj} onContribute={() => setChooseKind(true)} onSale={openSale} onRent={openRent} />
          <FloorPremiumNote proj={proj} />
          <DiscountTrend proj={proj} />
          <ProjectMap proj={proj} />
          <ProjectNeighbourhood proj={proj} />
          <SimilarProjects proj={proj} onPick={onPick} />
        </div>
      </div>
    </div>
  );
}

// "Similar projects in this zone" rail (brief D) — keeps buyers exploring.
function SimilarProjects({ proj, onPick }) {
  const all = window.JB_PROJECTS || [];
  const sameZone = all.filter(p => p.slug !== proj.slug && p.direction === proj.direction);
  const sameType = sameZone.filter(p => p.isLanded === proj.isLanded);
  const pool = (sameType.length >= 3 ? sameType : sameZone).slice(0, 3);
  if (!pool.length) return null;
  return (
    <div className="apl-similar">
      <h3 className="apl-subs-title" style={{ marginBottom: 4 }}>Similar projects in this zone</h3>
      <span className="apl-subs-note" style={{ marginBottom: 14, display: "block" }}>Same area and property type — compare the real price next door.</span>
      <div className="apl-similar-grid">
        {pool.map(p => {
          const spa = Math.round((p.spaMin + p.spaMax) / 2) * 1000;
          const net = p.netMedian * 1000;
          const disc = spa > 0 ? Math.round((spa - net) / spa * 100) : 0;
          return <SimilarCard key={p.slug} p={p} disc={disc} onPick={onPick} />;
        })}
      </div>
    </div>
  );
}

function SimilarCard({ p, disc, onPick }) {
  const ref = appR(null);
  appE(() => { if (ref.current) ref.current.innerHTML = window.AplImg.projectPhoto(p.slug); }, [p.slug]);
  return (
    <button className="apl-similar-card" onClick={() => onPick && onPick(p)}>
      <div className="apl-similar-img" ref={ref}></div>
      <div className="apl-similar-body">
        <div className="apl-similar-name">{p.name}</div>
        <div className="apl-similar-area">{p.area}</div>
        <div className="apl-similar-figs">
          <span><b>RM {p.psf}</b> psf net</span>
          <span className="apl-similar-disc">{disc}% discount</span>
        </div>
        <span className="apl-similar-link">View project →</span>
      </div>
    </button>
  );
}

// Per-project Leaflet map — project location + nearby amenities by category
function ProjectMap({ proj }) {
  const elRef = appR(null);
  const mapRef = appR(null);
  const layerRef = appR(null);
  const [cat, setCat] = appS("schools");

  // amenity categories, names sourced from the neighbourhood profile
  const n = proj.neighbourhood || {};
  const AMEN = [
    { id: "schools", label: "Schools", color: "#2a6fdb", ico: "🎓",
      items: schoolList(n.schools) },
    { id: "health", label: "Clinics & hospital", color: "#ff7675", ico: "✚",
      items: [n.hospital && n.hospital !== "—" ? { name: n.hospital, d: (n.hospitalMins || 8) * 80 } : null,
              { name: "Klinik Kesihatan", d: 420 }, { name: "Private clinic", d: 760 }].filter(Boolean) },
    { id: "malls", label: "Malls & shops", color: "#00b894", ico: "🛍️",
      items: [n.mall && n.mall !== "—" ? { name: n.mall, d: (n.mallMins || 6) * 90 } : null,
              n.supermarket && n.supermarket !== "—" ? { name: n.supermarket, d: 540 } : null].filter(Boolean) },
    { id: "parks", label: "Parks", color: "#1f8a5b", ico: "🌳",
      items: [n.parks && n.parks !== "—" ? { name: n.parks, d: 480 } : null, { name: "Community green", d: 920 }].filter(Boolean) },
    { id: "transport", label: "Transport", color: "#d9a225", ico: "🚌",
      items: [n.highway && n.highway !== "—" ? { name: n.highway + " access", d: 700 } : null,
              n.busStop ? { name: "Bus stop", d: 280 } : null,
              n.ciqMins ? { name: "To CIQ / RTS", d: n.ciqMins * 280 } : null].filter(Boolean) },
  ].filter(c => c.items.length);

  function schoolList(str) {
    if (!str || str === "—") return [];
    // pull a named school if the profile flags one ("incl. Austin Intl", "EduCity", "Forest City intl school on-site")
    const named = [];
    const inclM = str.match(/incl\.?\s*([^)]+)/i);
    if (inclM) named.push(inclM[1].trim());
    if (/educity/i.test(str)) named.push("EduCity campus");
    if (/forest city intl/i.test(str)) named.push("Forest City Int'l School");
    // count, if the profile states one
    const cntM = str.match(/(\d+)\s*within\s*([\d.]+)\s*km/i);
    const out = [];
    if (cntM) out.push({ name: `${cntM[1]} schools within ${cntM[2]}km`, d: 350 });
    else out.push({ name: str, d: 350 });
    named.forEach((nm, i) => out.push({ name: nm, d: 620 + i * 340 }));
    if (out.length < 2) out.push({ name: "Sekolah Kebangsaan nearby", d: 780 });
    return out.slice(0, 4);
  }
  function amenList(str, fallback, count) {
    if (!str || str === "—") return [];
    return Array.from({ length: count }, (_, i) => ({ name: i === 0 ? str : fallback + " " + (i + 1), d: 350 + i * 320 }));
  }
  // deterministic scatter around the project so pins are stable per render
  function scatter(ll, idx, dist) {
    const ang = (idx * 73 + dist) % 360 * Math.PI / 180;
    const r = Math.min(dist, 1600) / 111000; // metres → deg approx
    return [ll[0] + Math.cos(ang) * r, ll[1] + Math.sin(ang) * r * 1.1];
  }

  appE(() => {
    if (mapRef.current || !window.L || !elRef.current) return;
    const L = window.L;
    const ll = window.projectLatLng(proj);
    const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(ll, 15);
    mapRef.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 20, crossOrigin: true,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);
    const dir = (window.DIRECTIONS || []).find(d => d.id === proj.direction) || {};
    const color = dir.color || "#00b894";
    const icon = L.divIcon({
      className: "apl-projpin",
      html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
      iconSize: [24, 24], iconAnchor: [12, 24],
    });
    L.marker(ll, { icon, zIndexOffset: 1000 }).addTo(map).bindPopup(`<b>${proj.name}</b><br>${proj.corridor}`);
    layerRef.current = L.layerGroup().addTo(map);
    setTimeout(() => map.invalidateSize(), 200);
  }, []);

  // redraw amenity pins when category changes
  appE(() => {
    const L = window.L, map = mapRef.current, layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    const ll = window.projectLatLng(proj);
    const c = AMEN.find(x => x.id === cat);
    if (!c) return;
    c.items.forEach((it, i) => {
      const pos = scatter(ll, i + 1, it.d);
      const pin = L.divIcon({
        className: "apl-amenpin",
        html: `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#fff;border:2px solid ${c.color};box-shadow:0 1px 5px rgba(0,0,0,0.25);font-size:13px;">${c.ico}</div>`,
        iconSize: [26, 26], iconAnchor: [13, 13],
      });
      L.marker(pos, { icon: pin }).addTo(layer).bindPopup(`<b>${it.name}</b><br>~${it.d < 1000 ? it.d + " m" : (it.d / 1000).toFixed(1) + " km"}`);
    });
  }, [cat]);

  const active = AMEN.find(x => x.id === cat) || {};
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 className="apl-subs-title" style={{ marginBottom: 6 }}>Location &amp; amenities</h3>
      <p className="apl-subs-note" style={{ marginBottom: 12 }}>{proj.corridor} · {(window.DIRECTIONS.find(d => d.id === proj.direction) || {}).compass}. Approximate positions — confirm exact distances with the developer.</p>
      <div className="apl-amen-tabs">
        {AMEN.map(c => (
          <button key={c.id} className={"apl-amen-tab" + (cat === c.id ? " on" : "")} onClick={() => setCat(c.id)}
            style={cat === c.id ? { borderColor: c.color, color: c.color } : null}>
            <span>{c.ico}</span> {c.label}
          </button>
        ))}
      </div>
      <div className="apl-amen-map-wrap">
        <div className="apl-amen-list">
          {(active.items || []).map((it, i) => (
            <div key={i} className="apl-amen-item">
              <span className="apl-amen-item-ico" style={{ borderColor: active.color }}>{active.ico}</span>
              <span className="apl-amen-item-name">{it.name}</span>
              <span className="apl-amen-item-d">{it.d < 1000 ? it.d + " m" : (it.d / 1000).toFixed(1) + " km"}</span>
            </div>
          ))}
        </div>
        <div ref={elRef} className="apl-leaflet" style={{ height: 360, borderRadius: 16, overflow: "hidden", border: "1px solid var(--apl-line)" }}></div>
      </div>
    </div>
  );
}

// Project-level neighbourhood profile ("Google review, but structured")
function ProjectNeighbourhood({ proj }) {
  const n = proj.neighbourhood;
  if (!n) return null;
  const summary = window.neighbourhoodSummary(proj);
  const rows = [
    ["Schools", n.schools], ["Supermarket", n.supermarket], ["Nearest mall", n.mall + (n.mallMins ? " · " + n.mallMins + " mins" : "")],
    ["Parks", n.parks], ["Hospital", n.hospital + (n.hospitalMins ? " · " + n.hospitalMins + " mins" : "")],
    ["Highway", n.highway], ["To CIQ / RTS", n.ciqMins ? n.ciqMins + " mins" : "—"], ["Bus stop <500m", n.busStop ? "Yes" : "No"],
  ];
  const env = [
    ["Safety", n.safety.toFixed(1) + "/5 (" + n.safetyN + ")"], ["Noise", n.noise], ["Flood risk", n.flood], ["Industrial", n.industrial],
  ];
  return (
    <div className="apl-pn">
      <div className="apl-pn-head">Neighbourhood</div>
      <div className="apl-pn-summary">{summary}</div>
      <div className="apl-pn-grid">
        {rows.map(([k, v]) => (
          <div key={k} className="apl-pn-row"><span className="k">{k}</span><span className="v">{v}</span></div>
        ))}
      </div>
      <div className="apl-pn-env">
        {env.map(([k, v]) => (
          <div key={k} className={"apl-pn-env-chip " + (k === "Flood risk" || k === "Industrial" ? "warn-" + String(v).split(" ")[0] : "")}>
            <span className="k">{k}</span><span className="v">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Explore by Zone ──────────────────────────────────────────
function ZonesView({ onPick, onBackToDeals }) {
  const [dirId, setDirId] = appS(window.__exploreDir || null);
  appE(() => { if (window.__exploreDir) window.__exploreDir = null; }, []);
  // landing: 5 direction cards
  if (!dirId) {
    return (
      <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 28px 100px" }}>
          {onBackToDeals && <button className="apl-back-link" onClick={onBackToDeals}>‹ Community deals</button>}
          <div className="apl-eyebrow" style={{ marginTop: onBackToDeals ? 14 : 0 }}>Explore by direction</div>
          <h1 className="apl-h2" style={{ marginBottom: 12 }}>Johor Bahru, by cardinal direction.</h1>
          <p className="apl-lead" style={{ marginTop: 0, marginLeft: 0, fontSize: 17, maxWidth: 660 }}>
            Five directions across the JB districts. Pick one to see its corridors and every project PropX tracks there.
          </p>
          <div className="apl-dir-cards">
            {window.DIRECTIONS.map(d => {
              const s = window.directionStat(d.id);
              return (
                <button key={d.id} className="apl-dir-card" onClick={() => setDirId(d.id)}>
                  <span className="apl-dir-compass" style={{ background: d.color }}>{d.compass}</span>
                  <span className="apl-dir-heading">{d.heading}</span>
                  <span className="apl-dir-areas">{d.areas}</span>
                  <span className="apl-dir-stat">{s.count} projects · {s.records} records · avg net discount <b>−{s.discAvg}%</b></span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // corridor page for a direction
  const dir = window.dirOf(dirId);
  const projs = window.projectsInDirection(dirId);
  const corridors = [...new Set(projs.map(p => p.corridor))];
  return (
    <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 28px 100px" }}>
        <button className="apl-back-btn" onClick={() => setDirId(null)}>‹ All directions</button>
        <div className="apl-eyebrow" style={{ marginTop: 18, color: dir.color }}>{dir.compass} · {dir.district}</div>
        <h1 className="apl-h2" style={{ marginBottom: 10 }}>{dir.heading.split("·")[0].trim()}</h1>
        <p className="apl-lead" style={{ marginTop: 0, marginLeft: 0, fontSize: 16, maxWidth: 720 }}>{dir.character}</p>
        <div className="apl-dir-areas" style={{ marginTop: 8, marginBottom: 8 }}>{dir.areas}</div>

        {corridors.map(cor => (
          <section key={cor} className="apl-corridor-block">
            <header className="apl-corridor-block-head">
              <h3 className="apl-corridor-block-name">{cor}</h3>
              <span className="apl-corridor-block-count">{projs.filter(p => p.corridor === cor).length} projects</span>
            </header>
            <div className="apl-corridor-projects">
              {projs.filter(p => p.corridor === cor).map(p => (
                <ExploreProjectCard key={p.slug} proj={p} onClick={onPick} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// full project card used in Explore corridor lists (image + built-up/psf, gated detail)
function ExploreProjectCard({ proj, onClick }) {
  const [saved, toggle] = useAplSaved();
  const isSaved = saved.includes(proj.slug);
  const nbSummary = window.neighbourhoodSummary(proj);
  const unlocked = window.hasContributed();
  const daysLeft = window.unlockDaysLeft ? window.unlockDaysLeft() : 0;
  const imgRef = appR(null);
  appE(() => { if (imgRef.current) imgRef.current.innerHTML = window.AplImg.projectPhoto(proj.slug); }, [proj.slug]);
  return (
    <div className="apl-exp-card" onClick={() => onClick && onClick(proj)}>
      <div className="apl-exp-thumb" ref={imgRef}></div>
      <div className="apl-exp-main">
        <div className="apl-exp-top">
          <div>
            <div className="apl-exp-name">{proj.name}</div>
            <div className="apl-exp-meta">{proj.developer} · {proj.dType}</div>
          </div>
          <button className={"apl-save-dot " + (isSaved ? "on" : "")} onClick={(e) => { e.stopPropagation(); toggle(proj.slug); }}>{isSaved ? "♥" : "♡"}</button>
        </div>
        <div className="apl-exp-stats">
          <div className="apl-exp-stat"><div className="l">Net</div><div className="v net">{fmtRM(proj.netMin)}–{fmtRM(proj.netMax)}</div></div>
          <div className="apl-exp-stat"><div className="l">Avg built-up</div><div className="v">{proj.builtUp.toLocaleString()} sf</div></div>
          <div className="apl-exp-stat"><div className="l">Avg psf (net)</div><div className="v psf">RM {proj.psf}</div></div>
          <div className="apl-exp-stat"><div className="l">Discount</div><div className="v disc">−{proj.discAvg}%</div></div>
          {unlocked && proj.gyield && <div className="apl-exp-stat"><div className="l">Yield</div><div className="v yld">{proj.gyield}%</div></div>}
        </div>
        {nbSummary && <div className="apl-exp-nb">{nbSummary}</div>}
        <div className="apl-exp-foot">
          {unlocked
            ? <span className="apl-exp-unlocked">{proj.records} records · floor & lot detail unlocked →</span>
            : <span className="apl-exp-locked">🔒 {proj.records} records · contribute once to unlock floor & lot detail</span>}
        </div>
      </div>
    </div>
  );
}

// ── My List ──────────────────────────────────────────────────
function MyListView({ onPick, setPage }) {
  const [saved, toggle] = useAplSaved();
  const items = APL_PROJECTS.filter(p => saved.includes(p.slug));
  const [compareMode, setCompareMode] = appS(false);
  const [picked, setPicked] = appS([]);

  function togglePick(slug) {
    setPicked(ps => ps.includes(slug) ? ps.filter(s => s !== slug) : ps.length >= 3 ? ps : [...ps, slug]);
  }
  const compareItems = items.filter(p => picked.includes(p.slug));

  return (
    <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 22px 100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="apl-eyebrow">My list</div>
            <h1 className="apl-h2" style={{ marginBottom: 12 }}>Your saved projects.</h1>
            <p className="apl-lead" style={{ marginTop: 0, marginLeft: 0, fontSize: 18, maxWidth: 640 }}>
              Saved in this browser — no account needed. Tap ♡ on any project to add it here.
            </p>
          </div>
          {items.length >= 2 && (
            <button className={"apl-btn " + (compareMode ? "apl-btn-primary" : "apl-btn-secondary")}
                    onClick={() => { setCompareMode(m => !m); setPicked([]); }}>
              {compareMode ? "Done comparing" : "⇄ Compare projects"}
            </button>
          )}
        </div>

        {compareMode && (
          <div className="apl-cmp-hint">
            Pick <b>2–3</b> projects to compare side by side — net PSF, yield, furnishing value, discount and distance to the RTS link.
            {picked.length > 0 && <span className="apl-cmp-count"> · {picked.length} selected</span>}
          </div>
        )}

        {items.length === 0 ? (
          <div className="apl-empty">
            <div className="apl-empty-icon">♡</div>
            <div className="apl-empty-title">Nothing saved yet</div>
            <p className="apl-empty-sub">Browse projects and tap the heart to start building your shortlist.</p>
            <button className="apl-btn apl-btn-primary" onClick={() => setPage("home")}>Browse projects →</button>
          </div>
        ) : (
          <>
            {compareMode && compareItems.length >= 2 && <CompareTable items={compareItems} onPick={onPick} />}
            <div className="apl-feat-rail" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gridAutoFlow: "row", overflow: "visible", marginTop: 40 }}>
              {items.map(p => (
                compareMode
                  ? <CompareSelectCard key={p.slug} proj={p} checked={picked.includes(p.slug)}
                      disabled={!picked.includes(p.slug) && picked.length >= 3}
                      onToggle={() => togglePick(p.slug)} />
                  : <FeatCard key={p.slug} proj={p} onClick={onPick} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// selectable card shown while comparing
function CompareSelectCard({ proj, checked, disabled, onToggle }) {
  const photoRef = appR(null);
  appE(() => { if (photoRef.current) photoRef.current.innerHTML = window.AplImg.projectPhoto(proj.slug); }, [proj.slug]);
  return (
    <button className={"apl-cmp-card" + (checked ? " on" : "") + (disabled ? " disabled" : "")} onClick={disabled ? null : onToggle} disabled={disabled}>
      <span className="apl-cmp-check">{checked ? "✓" : ""}</span>
      <span className="apl-cmp-thumb" ref={photoRef}></span>
      <span className="apl-cmp-info">
        <span className="apl-cmp-name">{proj.name}</span>
        <span className="apl-cmp-meta">{proj.corridor} · {proj.dType}</span>
        <span className="apl-cmp-stat">{fmtRM(proj.netMin)}–{fmtRM(proj.netMax)} · RM {proj.psf}/sf</span>
      </span>
    </button>
  );
}

// side-by-side comparison table — the shortlist "killer feature"
function CompareTable({ items, onPick }) {
  const ciq = (p) => (p.neighbourhood && p.neighbourhood.ciqMins) || null;
  const fv = (p) => window.furnishingValue(p);
  // metric rows: label, accessor, formatter, best = "low" | "high"
  const rows = [
    { k: "Net price range", get: p => p.netMedian, fmt: p => `${fmtRM(p.netMin)}–${fmtRM(p.netMax)}`, best: "low", sub: "median" },
    { k: "Net PSF", get: p => p.psf, fmt: p => `RM ${p.psf}`, best: "low", sub: "RM / sqft" },
    { k: "Rental yield", get: p => p.gyield || 0, fmt: p => p.gyield ? `${p.gyield}%` : "—", best: "high", sub: "gross" },
    { k: "Furnishing value", get: p => fv(p), fmt: p => `RM ${(fv(p) / 1000).toFixed(0)}k`, best: "high", sub: "typical package" },
    { k: "Discount vs SPA", get: p => p.discAvg, fmt: p => `−${p.discAvg}%`, best: "high", sub: "off contract" },
    { k: "To RTS / CIQ", get: p => ciq(p) || 999, fmt: p => ciq(p) ? `${ciq(p)} min` : "—", best: "low", sub: "drive time" },
    { k: "Avg built-up", get: p => p.builtUp, fmt: p => `${p.builtUp.toLocaleString()} sf`, best: "high", sub: "size" },
  ];
  function bestSlug(r) {
    const vals = items.map(p => ({ slug: p.slug, v: r.get(p) })).filter(x => x.v != null && x.v !== 0 && x.v !== 999);
    if (vals.length < 2) return null;
    return (r.best === "low" ? vals.reduce((a, b) => b.v < a.v ? b : a) : vals.reduce((a, b) => b.v > a.v ? b : a)).slug;
  }
  return (
    <div className="apl-cmptable-wrap">
      <table className="apl-cmptable">
        <thead>
          <tr>
            <th className="apl-cmptable-corner">Compare</th>
            {items.map(p => {
              const dir = window.DIRECTIONS.find(d => d.id === p.direction) || {};
              return (
                <th key={p.slug}>
                  <button className="apl-cmptable-proj" onClick={() => onPick && onPick(p)}>
                    <span className="apl-cmptable-dot" style={{ background: dir.color }}></span>
                    <span className="apl-cmptable-name">{p.name}</span>
                    <span className="apl-cmptable-sub">{dir.compass} · {p.dType}</span>
                    <span className="apl-cmptable-open">Open →</span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const win = bestSlug(r);
            return (
              <tr key={r.k}>
                <td className="apl-cmptable-rowlab"><span>{r.k}</span><i>{r.sub}</i></td>
                {items.map(p => (
                  <td key={p.slug} className={"apl-cmptable-cell" + (win === p.slug ? " win" : "")}>
                    {r.fmt(p)}
                    {win === p.slug && <span className="apl-cmptable-badge">best</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="apl-cmptable-note">“Best” marks the most favourable value in each row for a typical buyer — lower price, PSF and travel time; higher yield, furnishing value and discount. Furnishing value and distances are illustrative.</div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────
function AboutView() {
  return (
    <div style={{ background: "var(--apl-bg)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 22px 100px" }}>
        <div className="apl-eyebrow">About PropX</div>
        <h1 className="apl-h2" style={{ marginBottom: 24 }}>The price on the contract isn't the price people pay.</h1>
        <div className="apl-prose">
          <p className="apl-lead" style={{ marginLeft: 0, fontSize: 21, marginBottom: 36 }}>
            PropX surfaces the <strong style={{ color: "var(--apl-ink)" }}>net price</strong> of Johor Bahru property — what buyers actually paid after discounts and freebies — not just the headline SPA figure.
          </p>
          <h3 className="apl-about-h">SPA price vs net price</h3>
          <p>The <strong style={{ color: "var(--apl-ink)" }}>SPA price</strong> is the official value on the contract — what shows up on Brickz and EdgeProp. The <strong style={{ color: "var(--apl-ink)" }}>net price</strong> is what was really paid, after the developer's discounts and freebies (cash rebates, absorbed legal fees, furniture packages). For a JB serviced apartment in 2024, the gap is commonly 10–20%.</p>
          <h3 className="apl-about-h">Where does the data come from?</h3>
          <p>A hand-curated research dataset from buyer reports, agent submissions, and publicly observed launches. For reference only — use it to inform negotiation, not as a substitute for due diligence.</p>

          <window.SpjbExplainer />
        </div>
      </div>
    </div>
  );
}

// ── Trust system ──────────────────────────────────────────────
const TRUST = {
  "Community-contributed":   { c: "#6e6e73", bg: "#eceef2", desc: "Self-reported. No supporting evidence attached yet." },
  "Context-supported":       { c: "#0071e3", bg: "#e3f0fd", desc: "Backed by brochure / showroom / launch context." },
  "Evidence review pending": { c: "#b8860b", bg: "#fbf0d6", desc: "Supporting documents uploaded — awaiting moderation." },
  "Cross-checked":           { c: "#0f766e", bg: "#d7efec", desc: "Consistent with other records for this project." },
  "Evidence-backed":         { c: "#1f8a5b", bg: "#e1f3ea", desc: "Checked against uploaded proof." },
  "Community":               { c: "#6e6e73", bg: "#eceef2", desc: "Self-reported. No supporting evidence attached yet." },
  "Listing-backed":          { c: "#0071e3", bg: "#e3f0fd", desc: "Backed by a listing, agent chat or advertisement." },
  "Agreement-backed":        { c: "#1f8a5b", bg: "#e1f3ea", desc: "Checked against a masked tenancy agreement." },
  "Flagged":                 { c: "#be123c", bg: "#fae0e6", desc: "Disputed or inconsistent — under review." },
};
function TrustBadge({ label, size }) {
  const t = TRUST[label] || TRUST["Community-contributed"];
  return (
    <span className="apl-trust-badge" style={{ color: t.c, background: t.bg, fontSize: size === "sm" ? 11 : 12.5, padding: size === "sm" ? "3px 9px" : "5px 12px" }}>
      <span className="apl-trust-dot" style={{ background: t.c }}></span>{label}
    </span>
  );
}
function trustForEvidence(tier, kind) {
  if (kind === "rent") {
    return tier === 0 ? "Community" : tier === 2 ? "Listing-backed" : "Agreement-backed";
  }
  return tier === 0 ? "Community-contributed"
    : tier === 1 ? "Context-supported"
    : tier === 2 ? "Evidence review pending"
    : "Evidence-backed";
}

// Project selection drills: Direction → Property type → Project
// Sets form.project (name), form.area (corridor), form.slug (id) on pick.
function ProjectDrilldown({ form, set }) {
  const projects = window.APL_PROJECTS || window.JB_PROJECTS || [];
  const [dir, setDir] = appS(() => {
    const p = projects.find(p => p.name === form.project); return p ? p.direction : null;
  });
  const [type, setType] = appS(() => {
    const p = projects.find(p => p.name === form.project); return p ? p.dType : null;
  });
  const inDir = dir ? projects.filter(p => p.direction === dir) : [];
  const typesInDir = [...new Set(inDir.map(p => p.dType))].sort();
  const inType = type ? inDir.filter(p => p.dType === type) : [];
  const sel = projects.find(p => p.name === form.project);

  function pickDir(id) { setDir(id); setType(null); if (sel && sel.direction !== id) { set("project", ""); set("area", ""); set("slug", ""); } }
  function pickType(t) { setType(t); if (sel && sel.dType !== t) { set("project", ""); set("area", ""); set("slug", ""); } }
  function pickProject(p) { set("project", p.name); set("area", p.corridor); set("slug", p.slug); set("community", false); }
  const [adding, setAdding] = appS(false);
  const [np, setNp] = appS({ name: "", developer: "", address: "", postcode: "" });
  const [npZoneOv, setNpZoneOv] = appS(null);
  const npSet = (k, v) => setNp(s => ({ ...s, [k]: v }));
  const zoneFromPostcode = (pc) => {
    const n = parseInt(pc, 10);
    if (!n || String(pc).length !== 5) return null;
    if (n >= 80000 && n <= 80400) return "south-core";
    if (n >= 80500 && n <= 81100) return "east";
    if (n === 81200) return "east";
    if ((n >= 79000 && n <= 79250) || (n >= 79500 && n <= 79550)) return "west";
    if (n >= 81700 && n <= 81760) return "south-east";
    if (n >= 81000 && n <= 81020) return "north";
    return null;
  };
  const npZone = npZoneOv || zoneFromPostcode(np.postcode);
  const saveNew = () => {
    set("project", np.name); set("area", np.address); set("slug", "new-" + np.name.toLowerCase().replace(/\s+/g, "-"));
    set("community", true); set("newDeveloper", np.developer); set("newPostcode", np.postcode); set("newZone", npZone);
    setAdding(false);
  };

  return (
    <div className="apl-drill">
      {/* Step 1 · Direction */}
      <div className="apl-drill-step">
        <div className="apl-drill-lab"><b>1.</b> Cardinal direction</div>
        <div className="apl-drill-row">
          {window.DIRECTIONS.map(d => (
            <button type="button" key={d.id} className={"apl-drill-chip" + (dir === d.id ? " on" : "")} onClick={() => pickDir(d.id)}>
              <span className="apl-drill-dot" style={{ background: d.color }}></span>{d.compass}
            </button>
          ))}
        </div>
      </div>
      {/* Step 2 · Property type */}
      {dir && (
        <div className="apl-drill-step">
          <div className="apl-drill-lab"><b>2.</b> Property type</div>
          <div className="apl-drill-row">
            {typesInDir.map(t => (
              <button type="button" key={t} className={"apl-drill-chip" + (type === t ? " on" : "")} onClick={() => pickType(t)}>{t}</button>
            ))}
            {typesInDir.length === 0 && <span className="apl-drill-empty">No tracked projects in this direction yet.</span>}
          </div>
        </div>
      )}
      {/* Step 3 · Project */}
      {dir && type && !adding && (
        <div className="apl-drill-step">
          <div className="apl-drill-lab"><b>3.</b> Project <span className="apl-drill-count">({inType.length})</span></div>
          <div className="apl-drill-projgrid">
            {inType.map(p => (
              <button type="button" key={p.slug} className={"apl-drill-proj" + (form.project === p.name ? " on" : "")} onClick={() => pickProject(p)}>
                <span className="apl-drill-proj-name">{p.name}</span>
                <span className="apl-drill-proj-meta">{p.corridor}</span>
              </button>
            ))}
            {inType.length === 0 && <span className="apl-drill-empty">No projects match.</span>}
          </div>
          <button type="button" className="apl-newproj-cta" onClick={() => setAdding(true)}>Can't find your project? Add it here ›</button>
        </div>
      )}
      {/* Step 3b · Add a community project */}
      {dir && type && adding && (
        <div className="apl-drill-step">
          <button type="button" className="apl-back-link" onClick={() => setAdding(false)}>‹ Back to project list</button>
          <div className="apl-drill-lab" style={{ marginTop: 8 }}><b>3.</b> Add a new project</div>
          <div className="apl-newproj-fields">
            <label className="apl-field"><span>Project name <b className="apl-req">*</b></span><input value={np.name} onChange={e => npSet("name", e.target.value)} placeholder="e.g. Skypark Kepler" /></label>
            <label className="apl-field"><span>Developer <b className="apl-req">*</b></span><input value={np.developer} onChange={e => npSet("developer", e.target.value)} placeholder="e.g. Tropicana Corporation" /></label>
            <label className="apl-field"><span>Address <b className="apl-req">*</b></span><input value={np.address} onChange={e => npSet("address", e.target.value)} placeholder="e.g. Jalan Ekoflora 1, Taman Ekoflora" /></label>
            <label className="apl-field"><span>Postcode <b className="apl-req">*</b></span><input type="number" value={np.postcode} onChange={e => { npSet("postcode", e.target.value); setNpZoneOv(null); }} placeholder="e.g. 81100" /></label>
          </div>
          {np.postcode.length === 5 && (
            <div className="apl-zone-suggest">
              {npZone ? <>Based on postcode {np.postcode}, we placed this in <b>{(window.DIRECTIONS.find(d => d.id === npZone) || {}).compass}</b>. Wrong?{" "}</> : <>Pick the zone:{" "}</>}
              <span className="apl-zone-opts">{window.DIRECTIONS.map(d => (
                <button type="button" key={d.id} className={"apl-zone-opt" + (npZone === d.id ? " on" : "")} onClick={() => setNpZoneOv(d.id)}>{d.compass}</button>
              ))}</span>
            </div>
          )}
          <button type="button" className="apl-btn apl-btn-primary apl-btn-sm" style={{ marginTop: 12 }} disabled={!(np.name && np.developer && np.address && np.postcode.length === 5 && npZone)} onClick={saveNew}>Use this project →</button>
        </div>
      )}
      {form.project && (
        <div className="apl-drill-picked">
          <span className="apl-drill-picked-lab">Selected</span>
          <span className="apl-drill-picked-name">{form.project}{form.community && <span className="apl-badge-comm" style={{ marginLeft: 8 }}>Community-added</span>}</span>
          <span className="apl-drill-picked-area">· {form.area}</span>
        </div>
      )}
    </div>
  );
}

// ── Submit a deal — accountable contribution flow ─────────────
function SubmitView({ setPage, role }) {
  // mock auth persisted in localStorage
  const [user, setUser] = appS(() => { try { return localStorage.getItem("propx_apple_user") || ""; } catch { return ""; } });
  const [step, setStep] = appS(user ? "deal" : "auth");
  const [done, setDone] = appS(false);

  // role config drives heading, default form kind, which fields show, and the reward badge
  const ROLE = role || { id: "general", kind: "sale", name: "Contributor", badge: "Contributor", teaser: "" };
  const ROLE_HEAD = {
    buyer:    "Share what you actually paid.",
    investor: "Share your entry price and yield.",
    tenant:   "Share your rent.",
    agent:    "Share your field data.",
    general:  "Tell us the numbers.",
  };

  // deal state
  const [kind, setKind] = appS(ROLE.kind || "sale");
  const [form, setForm] = appS({ project: "", area: "", spa: "", net: "", rent: "", unit: "2BR", size: "", date: new Date().toISOString().slice(0, 7), furnishing: "Partial", notes: "", confidence: "Medium", subType: "Sale", floor: "", totalFloors: "", furnishValue: "" });
  const [incentives, setIncentives] = appS({ rebate: true, spaLegal: false, loanLegal: false, furniture: false, maintenance: false });
  const [furniture, setFurniture] = appS({ aircon: false, kitchen: false, wardrobes: false, beds: false, sofa: false, fridge: false, washer: false, curtains: false });
  const [tier, setTier] = appS(0);
  const [mask, setMask] = appS({ name: true, ic: true, unitNo: true, address: true, signature: true, phone: true, bank: true });
  // agent-only neighbourhood intelligence + area rating
  const [nb, setNb] = appS({});
  const [rating, setRating] = appS({ bestFor: [], recommendation: "", confidence: "Medium" });
  const setNbField = (k, v) => setNb(s => ({ ...s, [k]: v }));
  const setRatingField = (k, v) => setRating(s => ({ ...s, [k]: v }));

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function signIn(method) { const u = method; localStorage.setItem("propx_apple_user", u); setUser(u); setStep("deal"); }
  const label = trustForEvidence(tier, kind);
  const grossYield = (form.net && form.rent) ? ((Number(form.rent) * 12) / Number(form.net) * 100).toFixed(2) : null;

  // agents get two extra steps: neighbourhood intelligence + area rating
  const isAgent = ROLE.id === "agent";
  const steps = isAgent ? ["deal", "evidence", "area", "rating", "review"] : ["deal", "evidence", "review"];
  const stepIdx = steps.indexOf(step);
  const STEP_LABEL = { deal: "Deal", evidence: "Evidence", area: "Area", rating: "Rating", review: "Review" };
  const STEP_HEAD = { deal: ROLE_HEAD[ROLE.id], evidence: "Add evidence (optional).", area: "Map the neighbourhood.", rating: "Rate the area.", review: "Review & submit." };
  const go = (dir) => { const n = steps[stepIdx + dir]; if (n) setStep(n); };
  const nbFilled = Object.values(nb).filter(x => x && x !== "").length;

  // ----- DONE -----
  if (done) {
    return (
      <div style={{ background: "var(--apl-bg)", minHeight: "70vh" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 22px 100px", textAlign: "center" }}>
          <div className="apl-submit-check">✓</div>
          <h1 className="apl-h2" style={{ marginBottom: 10 }}>Contribution received.</h1>
          <p className="apl-lead" style={{ marginLeft: 0, fontSize: 17, marginBottom: 22 }}>You've unlocked full transaction data across all JB projects for the next 30 days. Every deal you share extends this.</p>

          <div style={{ margin: "0 0 6px" }}>
            <span className="apl-reward-badge"><span className="ico">★</span>You're now a {kind === "rent" ? "Rental Contributor" : (ROLE.badge || "Buyer Contributor")}</span>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
            <button className="apl-btn apl-btn-primary" onClick={() => setPage("home")}>See what others contributed</button>
            <button className="apl-btn apl-btn-secondary" onClick={() => { setDone(false); setStep("deal"); setTier(0); setForm({ project: "", area: "", spa: "", net: "", rent: "", unit: "2BR", size: "", date: new Date().toISOString().slice(0,7), furnishing: "Partial", notes: "", confidence: "Medium", subType: "Sale" }); }}>Share another</button>
          </div>
        </div>
      </div>
    );
  }

  // ----- SIGN-IN GATE -----
  if (step === "auth") {
    return (
      <div style={{ background: "var(--apl-bg)", minHeight: "70vh" }}>
        <div style={{ maxWidth: 460, margin: "0 auto", padding: "80px 22px 100px" }}>
          <div className="apl-eyebrow">{ROLE.id !== "general" ? `Continuing as ${ROLE.name.toLowerCase()}` : "Submit a deal"}</div>
          <h1 className="apl-h2" style={{ marginBottom: 12 }}>One step to lock in your contribution.</h1>
          <p className="apl-lead" style={{ marginLeft: 0, fontSize: 17, marginBottom: 28 }}>
            Browsing PropX is open to everyone. Submitting a price or rent needs a quick sign-in — it keeps the dataset accountable and every record traceable to a contributor.
          </p>
          <div className="apl-auth-card">
            <button className="apl-auth-btn" onClick={() => signIn("Google account")}>
              <span className="apl-auth-g">G</span> Continue with Google
            </button>
            <button className="apl-auth-btn" onClick={() => signIn("Apple ID")}>
               Continue with Apple
            </button>
            <div className="apl-auth-or"><span>or</span></div>
            <input className="apl-auth-input" placeholder="name@email.com" id="apl-email" />
            <button className="apl-btn apl-btn-primary apl-btn-large" style={{ width: "100%" }} onClick={() => signIn("Email")}>Continue with email</button>
          </div>
        </div>
      </div>
    );
  }

  // ----- MAIN FLOW (deal / evidence / review) -----
  return (
    <div style={{ background: "var(--apl-bg)", minHeight: "70vh" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "56px 22px 100px" }}>
        <div className="apl-eyebrow">{ROLE.id !== "general" ? `${ROLE.name} · contribution` : "Submit a deal"}</div>
        <h1 className="apl-h2" style={{ marginBottom: 8 }}>
          {STEP_HEAD[step]}
        </h1>
        <div className="apl-submit-meta">Signed in via {user}</div>

        {/* step indicator */}
        <div className="apl-steps">
          {steps.map((s, i) => (
            <div key={s} className={"apl-step " + (i === stepIdx ? "active " : "") + (i < stepIdx ? "done " : "")}>
              <span className="apl-step-num">{i < stepIdx ? "✓" : i + 1}</span>
              <span className="apl-step-label">{STEP_LABEL[s]}</span>
            </div>
          ))}
        </div>

        {/* STEP: DEAL */}
        {step === "deal" && (
          <div className="apl-submit-card">
            {/* loss-aversion: the data this contribution unlocks */}
            {ROLE.teaser && (
              <div className="apl-role-unlock">
                <span className="apl-role-unlock-ico">🔓</span>
                <span className="apl-role-unlock-txt"><b>{ROLE.teaser}</b> Add one record below and it opens for you.</span>
              </div>
            )}
            {/* segmented control only when the role doesn't fix the kind */}
            {(ROLE.id === "general" || ROLE.id === "investor" || ROLE.id === "agent") && (
              <div className="apl-seg" style={{ marginBottom: 20 }}>
                <button className={kind === "sale" ? "on" : ""} onClick={() => setKind("sale")}>Sale price</button>
                <button className={kind === "rent" ? "on" : ""} onClick={() => setKind("rent")}>Rental</button>
              </div>
            )}
            {ROLE.id === "tenant" && (
              <div className="apl-role-unlock" style={{ marginBottom: 20 }}>
                <span className="apl-role-unlock-ico"></span>
                <span className="apl-role-unlock-txt">You're sharing a <b>rental record</b>. Just four quick fields below.</span>
              </div>
            )}
            {ROLE.id === "agent" && (
              <label className="apl-field" style={{ marginBottom: 16 }}><span>Submission type</span>
                <select value={form.subType} onChange={e => set("subType", e.target.value)} className="apl-select">
                  {["Sale","Rent","Launch package","Field observation"].map(u => <option key={u}>{u}</option>)}
                </select>
              </label>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {/* Project selection drills: Direction → Property type → Project */}
              <div className="apl-field" style={{ gridColumn: "1 / -1" }}>
                <span>Project</span>
                <ProjectDrilldown form={form} set={set} />
              </div>
              <label className="apl-field"><span>Unit type</span>
                <select value={form.unit} onChange={e => set("unit", e.target.value)} className="apl-select">
                  {["Studio","1BR","2BR","3BR","4BR+"].map(u => <option key={u}>{u}</option>)}
                </select>
              </label>
              {kind === "sale" ? (
                <>
                  <label className="apl-field"><span>{ROLE.id === "agent" ? "SPA price observed (RM)" : "SPA price (RM)"}</span><input type="number" value={form.spa} onChange={e => set("spa", e.target.value)} placeholder="650000" /></label>
                  <label className="apl-field"><span>{ROLE.id === "investor" ? "Net entry price (RM)" : ROLE.id === "agent" ? "Net price estimate (RM)" : "Net price paid (RM)"}</span><input type="number" value={form.net} onChange={e => set("net", e.target.value)} placeholder="520000" /></label>
                </>
              ) : (
                <label className="apl-field"><span>Monthly rent (RM)</span><input type="number" value={form.rent} onChange={e => set("rent", e.target.value)} placeholder="2500" /></label>
              )}
              {/* investor also captures rent on a sale, to compute yield */}
              {ROLE.id === "investor" && kind === "sale" && (
                <label className="apl-field"><span>Current monthly rent (RM)</span><input type="number" value={form.rent} onChange={e => set("rent", e.target.value)} placeholder="2500" /></label>
              )}
              {/* tenant / rental furnishing */}
              {kind === "rent" && (
                <label className="apl-field"><span>Furnishing</span>
                  <select value={form.furnishing} onChange={e => set("furnishing", e.target.value)} className="apl-select">
                    {["Unfurnished","Partial","Fully furnished"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </label>
              )}
              <label className="apl-field"><span>Size (sqft)</span><input type="number" value={form.size} onChange={e => set("size", e.target.value)} placeholder="720" /></label>
              <label className="apl-field"><span>{kind === "rent" ? "Lease start" : "Deal month"}</span><input value={form.date} onChange={e => set("date", e.target.value)} placeholder="2025-09" /></label>
              {kind === "sale" && (
                <>
                  <label className="apl-field"><span>Floor sold <i style={{ fontWeight: 400, color: "var(--apl-ink-3)" }}>(if high-rise)</i></span><input type="number" value={form.floor} onChange={e => set("floor", e.target.value)} placeholder="e.g. 18" /></label>
                  <label className="apl-field"><span>Total floors in block</span><input type="number" value={form.totalFloors} onChange={e => set("totalFloors", e.target.value)} placeholder="e.g. 34" /></label>
                </>
              )}
              {ROLE.id === "agent" && (
                <label className="apl-field"><span>Confidence</span>
                  <select value={form.confidence} onChange={e => set("confidence", e.target.value)} className="apl-select">
                    {["Low","Medium","High"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </label>
              )}
            </div>

            {/* rental: optional detail fields (don't block submission) */}
            {kind === "rent" && (
              <details className="apl-loan-101" style={{ marginTop: 16 }}>
                <summary>More details (optional)</summary>
                <div style={{ padding: "4px 2px 2px" }}>
                  <div className="apl-field-label">Tenant type</div>
                  <div className="apl-incentive-grid" style={{ marginBottom: 14 }}>
                    {["Local","Singaporean","Expat","Student"].map(t => (
                      <button key={t} type="button" className={"apl-inc-chip " + (form.tenantType === t ? "on" : "")} onClick={() => set("tenantType", form.tenantType === t ? "" : t)}>{form.tenantType === t ? "✓ " : "+ "}{t}</button>
                    ))}
                  </div>
                  <div className="apl-field-label">Lease length</div>
                  <div className="apl-incentive-grid" style={{ marginBottom: 14 }}>
                    {["6 months","1 year","2 years"].map(t => (
                      <button key={t} type="button" className={"apl-inc-chip " + (form.leaseLen === t ? "on" : "")} onClick={() => set("leaseLen", form.leaseLen === t ? "" : t)}>{form.leaseLen === t ? "✓ " : "+ "}{t}</button>
                    ))}
                  </div>
                  <div className="apl-field-label">Floor level</div>
                  <div className="apl-incentive-grid" style={{ marginBottom: 14 }}>
                    {["Low (1–10)","Mid (11–20)","High (21+)"].map(t => (
                      <button key={t} type="button" className={"apl-inc-chip " + (form.floorBand === t ? "on" : "")} onClick={() => set("floorBand", form.floorBand === t ? "" : t)}>{form.floorBand === t ? "✓ " : "+ "}{t}</button>
                    ))}
                  </div>
                  <div className="apl-field-label">Yearly costs (help refine net-yield averages)</div>
                  <p className="apl-costs-hint">Enter what you actually pay. Toggle each field between monthly and yearly — monthly figures are multiplied by 12 on save so everything is stored annually.</p>
                  <div className="apl-costs-grid">
                    {[
                      { k: "costMaint", lbl: "Maintenance" },
                      { k: "costSinking", lbl: "Sinking fund" },
                      { k: "costAssessment", lbl: "Assessment" },
                      { k: "costVacancy", lbl: "Vacancy" },
                      { k: "costRepairs", lbl: "Repairs / misc" },
                    ].map(f => {
                      const modeKey = f.k + "Mode";
                      const mode = form[modeKey] || "yr";
                      return (
                        <label key={f.k} className="apl-costs-field">
                          <span className="apl-costs-lbl">{f.lbl}</span>
                          <div className="apl-costs-in">
                            <span className="apl-spa-edit-pre">RM</span>
                            <input type="number" inputMode="numeric" step={50}
                              value={form[f.k] || ""}
                              onChange={e => set(f.k, e.target.value)}
                              placeholder="0" />
                            <div className="apl-costs-toggle">
                              <button type="button" className={mode === "mo" ? "on" : ""} onClick={() => set(modeKey, "mo")}>/mo</button>
                              <button type="button" className={mode === "yr" ? "on" : ""} onClick={() => set(modeKey, "yr")}>/yr</button>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </details>
            )}

            {/* investor live yield readout */}
            {ROLE.id === "investor" && grossYield && (
              <div className="apl-role-unlock" style={{ marginTop: 16, marginBottom: 0, background: "var(--apl-accent-soft)", borderColor: "rgba(0,113,227,0.25)" }}>
                <span className="apl-role-unlock-ico" style={{ background: "var(--apl-accent)", color: "#fff" }}>%</span>
                <span className="apl-role-unlock-txt" style={{ color: "var(--apl-ink-2)" }}>Implied <b>gross yield {grossYield}%</b> — auto-calculated from your entry price and rent.</span>
              </div>
            )}

            {kind === "sale" && ROLE.id !== "agent" && (
              <div style={{ marginTop: 18 }}>
                <div className="apl-field-label">Incentives in the package</div>
                <div className="apl-incentive-grid">
                  {[["rebate","Cash rebate"],["spaLegal","Free SPA legal"],["loanLegal","Free loan legal"],["furniture","Furniture pkg"],["maintenance","Free maintenance"]].map(([k,l]) => (
                    <button key={k} className={"apl-inc-chip " + (incentives[k] ? "on" : "")} onClick={() => setIncentives(s => ({ ...s, [k]: !s[k] }))}>
                      {incentives[k] ? "✓ " : "+ "}{l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* furnishing detail — how much & what furniture (sale) */}
            {kind === "sale" && ROLE.id !== "agent" && (
              <div style={{ marginTop: 20 }}>
                <div className="apl-field-label">Furnishing — what came with the unit</div>
                <div className="apl-incentive-grid">
                  {[["aircon","Air-cond"],["kitchen","Kitchen cabinets"],["wardrobes","Wardrobes"],["beds","Beds"],["sofa","Sofa set"],["fridge","Fridge"],["washer","Washer"],["curtains","Curtains / blinds"]].map(([k,l]) => (
                    <button key={k} className={"apl-inc-chip " + (furniture[k] ? "on" : "")} onClick={() => setFurniture(s => ({ ...s, [k]: !s[k] }))}>
                      {furniture[k] ? "✓ " : "+ "}{l}
                    </button>
                  ))}
                </div>
                <label className="apl-field" style={{ marginTop: 14 }}>
                  <span>Estimated furnishing value (RM) <i style={{ fontWeight: 400, color: "var(--apl-ink-3)" }}>— roughly what the package is worth</i></span>
                  <input type="number" value={form.furnishValue} onChange={e => set("furnishValue", e.target.value)} placeholder="e.g. 30000" />
                </label>
              </div>
            )}

            {/* notes for investor + agent */}
            {(ROLE.id === "investor" || ROLE.id === "agent") && (
              <label className="apl-field" style={{ marginTop: 18 }}><span>{ROLE.id === "agent" ? "Source & notes (e.g. sales gallery visit, field survey)" : "Notes on market context"}</span>
                <textarea value={form.notes} onChange={e => set("notes", e.target.value)} className="apl-select" rows="2" style={{ resize: "vertical", fontFamily: "inherit" }} placeholder={ROLE.id === "agent" ? "Showroom visit, May 2026 — package valid till launch close…" : "Tenanted, 2-year lease, renewing soon…"} />
              </label>
            )}

            <button className="apl-btn apl-btn-primary apl-btn-large" style={{ width: "100%", marginTop: 24 }}
                    disabled={!form.project || (kind === "sale" ? (!form.spa || !form.net) : !form.rent)}
                    onClick={() => go(1)}>Continue →</button>
          </div>
        )}

        {/* STEP: EVIDENCE */}
        {step === "evidence" && (
          <div className="apl-submit-card">

            <div className="apl-tiers">
              {[
                { t: 0, name: "No proof", ex: "Just the numbers above." },
                { t: 2, name: "Soft proof", ex: kind === "rent" ? "Listing screenshot, agent chat, or advertisement." : "Brochure, rebate sheet or booking summary (masked)." },
                { t: 3, name: "Strong proof", ex: kind === "rent" ? "Stamped tenancy agreement (masked)." : "Masked SPA side-letter, tenancy or valuation snippet." },
              ].map(o => (
                <button key={o.t} className={"apl-tier " + (tier === o.t ? "active" : "")} onClick={() => setTier(o.t)}>
                  <div className="apl-tier-head">
                    <span className="apl-tier-radio">{tier === o.t ? "●" : "○"}</span>
                    <span className="apl-tier-name">{o.name}</span>
                  </div>
                  <div className="apl-tier-ex">{o.ex}</div>
                </button>
              ))}
            </div>

            {tier > 0 && (
              <div className="apl-dropzone">
                <div className="apl-dropzone-ico">⤓</div>
                <div>Drop files or <span className="apl-link-text">browse</span></div>
                <div className="apl-dropzone-sub">PDF, JPG or PNG · we auto-mask your personal details</div>
              </div>
            )}
            {/* trust preview moved to review step */}

            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button className="apl-btn apl-btn-secondary" onClick={() => go(-1)}>← Back</button>
              <button className="apl-btn apl-btn-primary" style={{ flex: 1 }} onClick={() => go(1)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP: AREA — neighbourhood intelligence (agents only) */}
        {step === "area" && (
          <>
            <NeighbourhoodForm value={nb} set={setNbField} />
            <div style={{ display: "flex", gap: 12, marginTop: 22, maxWidth: 640 }}>
              <button className="apl-btn apl-btn-secondary" onClick={() => go(-1)}>← Back</button>
              <button className="apl-btn apl-btn-primary" style={{ flex: 1 }} onClick={() => go(1)}>
                {nbFilled > 0 ? `Continue with ${nbFilled} field${nbFilled > 1 ? "s" : ""} →` : "Skip for now →"}
              </button>
            </div>
          </>
        )}

        {/* STEP: RATING — overall area rating (agents only) */}
        {step === "rating" && (
          <>
            <AreaRatingForm value={rating} set={setRatingField} />
            <div style={{ display: "flex", gap: 12, marginTop: 22, maxWidth: 640 }}>
              <button className="apl-btn apl-btn-secondary" onClick={() => go(-1)}>← Back</button>
              <button className="apl-btn apl-btn-primary" style={{ flex: 1 }} onClick={() => go(1)}>Continue →</button>
            </div>
          </>
        )}

        {/* STEP: REVIEW */}
        {step === "review" && (
          <div className="apl-submit-card">
            <div className="apl-trust-preview">
              <span>This record will publish as</span>
              <TrustBadge label={label} />
            </div>
            <div className="apl-review-row"><span className="l">Type</span><span className="v">{kind === "sale" ? "Sale price" : "Rental"}</span></div>
            <div className="apl-review-row"><span className="l">Project</span><span className="v">{form.project || "—"}</span></div>
            <div className="apl-review-row"><span className="l">Area</span><span className="v">{form.area || "—"}</span></div>
            <div className="apl-review-row"><span className="l">Unit</span><span className="v">{form.unit}{form.size ? ` · ${form.size} sf` : ""}</span></div>
            {kind === "sale" ? (
              <>
                <div className="apl-review-row"><span className="l">SPA price</span><span className="v">RM {Number(form.spa).toLocaleString()}</span></div>
                <div className="apl-review-row"><span className="l">Net price</span><span className="v" style={{ color: "var(--apl-accent)" }}>RM {Number(form.net).toLocaleString()}</span></div>
                <div className="apl-review-row"><span className="l">Implied discount</span><span className="v" style={{ color: "var(--apl-orange)" }}>{form.spa && form.net ? "−" + ((1 - form.net / form.spa) * 100).toFixed(1) + "%" : "—"}</span></div>
                {form.floor && <div className="apl-review-row"><span className="l">Floor</span><span className="v">Level {form.floor}{form.totalFloors ? ` of ${form.totalFloors}` : ""}</span></div>}
                {(Object.values(furniture).some(Boolean) || form.furnishValue) && (
                  <div className="apl-review-row"><span className="l">Furnishing</span><span className="v" style={{ textAlign: "right", maxWidth: 320 }}>
                    {Object.entries(furniture).filter(([, v]) => v).map(([k]) => ({ aircon: "Air-cond", kitchen: "Kitchen", wardrobes: "Wardrobes", beds: "Beds", sofa: "Sofa", fridge: "Fridge", washer: "Washer", curtains: "Curtains" }[k])).join(", ") || "—"}
                    {form.furnishValue ? ` · ~RM ${Number(form.furnishValue).toLocaleString()}` : ""}
                  </span></div>
                )}
              </>
            ) : (
              <>
                <div className="apl-review-row"><span className="l">Monthly rent</span><span className="v" style={{ color: "var(--apl-accent)" }}>RM {Number(form.rent).toLocaleString()}</span></div>
                <div className="apl-review-row"><span className="l">Furnished</span><span className="v">{form.furnishing}</span></div>
                {form.tenantType && <div className="apl-review-row"><span className="l">Tenant type</span><span className="v">{form.tenantType}</span></div>}
                {form.leaseLen && <div className="apl-review-row"><span className="l">Lease length</span><span className="v">{form.leaseLen}</span></div>}
                {form.floorBand && <div className="apl-review-row"><span className="l">Floor level</span><span className="v">{form.floorBand}</span></div>}
              </>
            )}
            <div className="apl-review-row"><span className="l">{kind === "rent" ? "Lease start" : "Deal month"}</span><span className="v">{form.date}</span></div>
            <div className="apl-review-row"><span className="l">Trust label</span><span className="v"><TrustBadge label={label} size="sm" /></span></div>
            <div className="apl-review-row"><span className="l">Privacy</span><span className="v" style={{ fontSize: 13, color: "var(--apl-ink-3)" }}>{tier > 0 ? Object.values(mask).filter(Boolean).length + " fields auto-masked" : "No documents attached"}</span></div>

            {/* agent neighbourhood summary */}
            {isAgent && (nbFilled > 0 || rating.liveability) && (
              <>
                <div className="apl-review-divider">Neighbourhood intelligence</div>
                {rating.liveability ? (
                  <div className="apl-review-row"><span className="l">Liveability</span><span className="v"><StarRating value={rating.liveability} size={14} /> {rating.liveability.toFixed(1)}</span></div>
                ) : null}
                {rating.recommendation ? (
                  <div className="apl-review-row"><span className="l">Recommendation</span><span className="v" style={{ color: (REC_STYLE[rating.recommendation]||{}).c }}>{rating.recommendation}</span></div>
                ) : null}
                {nbFilled > 0 ? (
                  <div className="apl-review-row"><span className="l">Area fields</span><span className="v">{nbFilled} contributed</span></div>
                ) : null}
                <div className="apl-review-row"><span className="l">Earns</span><span className="v" style={{ color: "var(--apl-gold-ink, #b8860b)" }}>Neighbourhood Expert badge</span></div>
              </>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="apl-btn apl-btn-secondary" onClick={() => go(-1)}>← Back</button>
              <button className="apl-btn apl-btn-primary" style={{ flex: 1 }} onClick={() => { window.markContributed && window.markContributed(); setDone(true); }}>Submit record</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [persona, setPersona] = appS(null);
  const [detail, setDetail] = appS(null);
  const VALID_PAGES = ["home", "budget", "zones", "resources", "list", "about", "submit"];
  const hashPage = () => { const h = (location.hash || "").replace("#", ""); return VALID_PAGES.includes(h) ? h : "home"; };
  const [page, setPage] = appS(hashPage());
  const [submitRole, setSubmitRole] = appS(null);
  const [exploreTab, setExploreTab] = appS("deals"); // deals | browse

  // navigating via nav clears any open detail; keep URL hash in sync
  function navTo(p) { setDetail(null); setPage(p); try { history.replaceState(null, "", "#" + p); } catch (e) {} }
  // identity-card selection → carry the role (and optional project) into the submission flow
  function chooseRole(roleObj, proj) { setSubmitRole(roleObj); setDetail(null); setPage("submit"); }
  // empty-zone "add the first record" → submission flow, role picked there
  function contributeToZone(zone) { setSubmitRole(null); setDetail(null); setPage("submit"); }

  appE(() => { window.scrollTo(0, 0); }, [page, detail]);
  appE(() => {
    const onHash = () => { setDetail(null); setPage(hashPage()); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (detail) return (
    <>
      <AppleNav page={page} setPage={navTo} />
      <ProjectDetail proj={detail} onBack={() => setDetail(null)} onArea={() => navTo("zones")} onContribute={chooseRole} onPick={(p) => { setDetail(p); window.scrollTo(0, 0); }} />
      <AppleFooter />
    </>
  );

  return (
    <>
      <AppleNav page={page} setPage={navTo} />
      {page === "home" && (
        <>
          <HeroSection onSearch={(q) => { const m = APL_PROJECTS.find(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.area.toLowerCase().includes(q.toLowerCase())); if (m) setDetail(m); }} />
          <DirectionsGuide onOpenDirection={(dirId) => { window.__exploreDir = dirId; navTo("zones"); }} />
          <ComparisonSection />
        </>
      )}
      {page === "budget" && <BudgetView onPick={setDetail} />}
      {page === "zones" && (exploreTab === "deals"
        ? <window.ExploreDealsView onPick={setDetail} openBrowse={() => setExploreTab("browse")} />
        : <ZonesView onPick={setDetail} onBackToDeals={() => setExploreTab("deals")} />)}
      {page === "resources" && <window.ResourcesView onPick={setDetail} />}
      {page === "list"   && <MyListView onPick={setDetail} setPage={navTo} />}
      {page === "about"  && <AboutView />}
      {page === "submit" && <SubmitView setPage={navTo} role={submitRole} />}
      <AppleFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
