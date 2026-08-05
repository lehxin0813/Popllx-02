// Apple UI kit — components

const { useState: aS, useEffect: aE, useRef: aR } = React;

// Shared data — authoritative dataset lives in dataset.js (window.JB_PROJECTS).
// Falls back to a minimal inline set only if dataset.js failed to load.
const APL_PROJECTS = window.JB_PROJECTS || [];

const fmtRM = (n) => n >= 1000 ? "RM " + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 2) + "M" : "RM " + n + "k";

// ── Saved-list store (localStorage) ────────────────────────────
const APL_LS = "propx_apple_saved";
function aplGetSaved() { try { return JSON.parse(localStorage.getItem(APL_LS) || "[]"); } catch { return []; } }
function aplSetSaved(arr) { localStorage.setItem(APL_LS, JSON.stringify(arr)); window.dispatchEvent(new Event("apl:saved")); }
function useAplSaved() {
  const [list, setList] = aS(aplGetSaved());
  aE(() => {
    const h = () => setList(aplGetSaved());
    window.addEventListener("apl:saved", h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener("apl:saved", h); window.removeEventListener("storage", h); };
  }, []);
  const toggle = (slug) => {
    const cur = aplGetSaved();
    aplSetSaved(cur.includes(slug) ? cur.filter(s => s !== slug) : [slug, ...cur]);
  };
  return [list, toggle];
}

// Nav
function AppleNav({ page, setPage }) {
  const [saved] = useAplSaved();
  const [open, setOpen] = React.useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "budget", label: "Budget" },
    { id: "zones", label: "Explore" },
    { id: "resources", label: "Resources" },
    { id: "list", label: "My List" },
    { id: "about", label: "About" },
  ];
  const go = (id) => { setPage(id); setOpen(false); };
  return (
    <nav className="apl-nav">
      <div className="apl-nav-inner">
        <a className="apl-nav-logo" onClick={() => go("home")} style={{ cursor: "pointer" }}>Prop<span className="dot">·</span>X</a>
        <div className="apl-nav-links">
          {links.map(l => (
            <a key={l.id}
               className={"apl-nav-link " + (page === l.id ? "active" : "")}
               onClick={() => go(l.id)}
               style={{ cursor: "pointer" }}>
              {l.label}{l.id === "list" && saved.length > 0 ? ` (${saved.length})` : ""}
            </a>
          ))}
        </div>
        <button className="apl-nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? "✕" : "☰"}</button>
      </div>
      {open && (
        <div className="apl-nav-mobile">
          {links.map(l => (
            <a key={l.id}
               className={"apl-nav-mobile-link " + (page === l.id ? "active" : "")}
               onClick={() => go(l.id)}>
              {l.label}{l.id === "list" && saved.length > 0 ? ` (${saved.length})` : ""}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function AppleFooter() {
  return (
    <footer className="apl-foot">
      <div className="apl-foot-inner">
        <div>Copyright © 2026 PropX Research. Net prices are illustrative.</div>
        <div>JB · Malaysia · Updated May 2026</div>
      </div>
    </footer>
  );
}

// Skyline parallax via useEffect
function useSkyline() {
  aE(() => {
    const back = document.querySelector(".apl-hero-skyline-back");
    const mid  = document.querySelector(".apl-hero-skyline-mid");
    if (back) back.innerHTML = window.AplImg.jbSkyline();
    if (mid)  mid.innerHTML  = window.AplImg.jbSkyline();
    const onScroll = () => {
      const y = window.scrollY;
      if (back) back.style.transform = `translateY(${y * 0.12}px)`;
      if (mid)  mid.style.transform  = `translateY(${y * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

// Reveal-on-scroll via IntersectionObserver
function useReveal() {
  aE(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".apl-reveal:not(.in)").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

// Project photo card
function FeatCard({ proj, onClick }) {
  const photoRef = aR(null);
  const [saved, toggle] = useAplSaved();
  const isSaved = saved.includes(proj.slug);
  aE(() => {
    if (photoRef.current) photoRef.current.innerHTML = window.AplImg.projectPhoto(proj.slug);
  }, [proj.slug]);
  return (
    <div className="apl-feat-card" onClick={() => onClick && onClick(proj)}>
      <div className="apl-feat-photo">
        <div className="apl-feat-photo-svg" ref={photoRef}></div>
        <button className={"apl-save-dot " + (isSaved ? "on" : "")}
                onClick={(e) => { e.stopPropagation(); toggle(proj.slug); }}
                title={isSaved ? "Remove from list" : "Save to list"}>
          {isSaved ? "♥" : "♡"}
        </button>
      </div>
      <div className="apl-feat-body">
        <div className="apl-feat-area">{proj.area}</div>
        <div className="apl-feat-name">{proj.name}</div>
        <div className="apl-feat-stats">
          <div className="apl-feat-stat">
            <div className="lab">Net price</div>
            <div className="val accent">{fmtRM(proj.netMin)}–{fmtRM(proj.netMax)}</div>
          </div>
          <div className="apl-feat-stat">
            <div className="lab">Avg discount</div>
            <div className="val green">−{proj.discAvg}%</div>
          </div>
          <div className="apl-feat-stat">
            <div className="lab">Records</div>
            <div className="val">{proj.records}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Persona card
function PersonaCard({ icon, name, desc, tag, active, onClick }) {
  return (
    <div className={"apl-persona-card " + (active ? "active" : "")} onClick={onClick}>
      <div className={"apl-persona-icon " + tag}>
        {icon}
      </div>
      <div className="apl-persona-name">{name}</div>
      <div className="apl-persona-desc">{desc}</div>
      <button className="apl-btn-link" style={{ background: "none", border: 0, cursor: "pointer", color: "var(--apl-accent)", fontSize: 14, padding: 0, fontFamily: "inherit" }}>
        See what I see ›
      </button>
    </div>
  );
}

Object.assign(window, { AppleNav, AppleFooter, FeatCard, PersonaCard, APL_PROJECTS, fmtRM, useSkyline, useReveal, useAplSaved });
