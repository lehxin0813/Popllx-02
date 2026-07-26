// PropX Apple — Identity-first contribution funnel
// Behavioural mechanics: identity commitment, social proof, loss aversion,
// reduced friction (role-based forms), instant micro-reward, endowment.

const { useState: idS } = React;

// ── Role definitions ──────────────────────────────────────────
// `kind`     → which base form the submission flow opens in
// `proof`    → social-proof signal (commitment that others like you contribute)
// `teaser`   → loss-aversion line: the data they can't see yet
// `badge`    → contributor identity earned on submission (consistency + endowment)
const IDENTITIES = [
  {
    id: "buyer", tag: "buyer", kind: "sale",
    name: "Home buyers",
    desc: "See what others actually paid and compare projects fairly — instead of anchoring to a brochure price.",
    proof: "47 buyers contributed this month",
    teaser: "See what this unit type actually sold for after rebates.",
    badge: "Home-buyer contributor",
    cta: "I'm buying", continueAs: "a home buyer",
  },
  {
    id: "investor", tag: "investor", kind: "sale",
    name: "Investors",
    desc: "Calculate real yield using real rent and a real entry price — not optimistic figures from a sales gallery.",
    proof: "12 investor records this week",
    teaser: "See real net yield for this corridor. Contribute one record to unlock comparables.",
    badge: "Investor contributor",
    cta: "I'm investing", continueAs: "an investor",
  },
  {
    id: "tenant", tag: "renter", kind: "rent",
    name: "Tenants & landlords",
    desc: "A realistic rental benchmark drawn from actual lettings — not an agent's asking price.",
    proof: "31 rent records added recently",
    teaser: "See actual rental rates in this area. Add a rent record to see the full range.",
    badge: "Rental contributor",
    cta: "I rent or let", continueAs: "a tenant or landlord",
  },
  {
    id: "agent", tag: "agent", kind: "sale",
    name: "Agents & surveyors",
    desc: "Contribute neighbourhood intelligence — schools, safety, transport, amenities — and unlock the deepest area data on PropX as a Verified Scout.",
    proof: "8 verified scouts active in your zone",
    teaser: "Unlock full area intelligence — schools, safety, transport, infrastructure — plus comparables across unit types.",
    badge: "Verified Scout",
    cta: "I work the market", continueAs: "an agent or surveyor",
  },
];

const ID_ICON = {
  buyer:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18l-2 9H5L3 9z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/></svg>,
  investor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5"/><path d="M4 15l5-5 4 3 6-7"/><path d="M19 6h-3M19 6v3"/></svg>,
  tenant:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>,
  agent:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
};

// ── The identity section (replaces the old 3-persona block) ───
function IdentitySection({ onChoose, onLearnMarket }) {
  useReveal();
  const [sel, setSel] = idS(null);
  const chosen = IDENTITIES.find(i => i.id === sel);

  return (
    <div className="apl-section-dark apl-identity-sec">
      <div className="apl-section-head apl-reveal" style={{ maxWidth: 860, margin: "0 auto 52px" }}>
        <div className="apl-eyebrow">Who are you?</div>
        <h2 className="apl-h2">The market gets fairer when you add what you know.</h2>
        <p className="apl-lead" style={{ marginTop: 16 }}>
          Pick how you use PropX. We'll show you the data you're missing — and ask only for the few details that matter to your role.
        </p>
      </div>

      <div className="apl-identity-grid apl-reveal">
        {IDENTITIES.map(idn => {
          const active = sel === idn.id;
          const dim = sel && !active;
          return (
            <button
              key={idn.id}
              className={"apl-id-card" + (active ? " active" : "") + (dim ? " dim" : "")}
              onClick={() => setSel(active ? null : idn.id)}
              aria-pressed={active}
            >
              <span className="apl-id-check" aria-hidden="true">✓</span>
              <span className={"apl-id-icon " + idn.id}>{ID_ICON[idn.id]}</span>
              <span className="apl-id-name">{idn.name}</span>
              <span className="apl-id-desc">{idn.desc}</span>
              <span className="apl-id-proof"><span className="apl-id-proof-dot"></span>{idn.proof}</span>
            </button>
          );
        })}
      </div>

      {/* Loss-aversion window + identity-commitment CTA */}
      <div className={"apl-id-continue" + (chosen ? " show" : "")}>
        {chosen && (
          <div className="apl-loss">
            <div className="apl-loss-frost">
              <div className="apl-loss-row"><span>2BR · 720 sf · net</span><b>RM ▒▒▒,▒▒▒</b></div>
              <div className="apl-loss-row"><span>Avg discount from SPA</span><b>▒▒.▒%</b></div>
              <div className="apl-loss-row"><span>Gross yield estimate</span><b>▒.▒▒%</b></div>
              <span className="apl-loss-lock">🔒</span>
            </div>
            <div className="apl-loss-copy">
              <div className="apl-loss-teaser">{chosen.teaser}</div>
              <button className="apl-btn apl-btn-gold apl-btn-large" onClick={() => onChoose(chosen)}>
                Continue as {chosen.continueAs} →
              </button>
              <div className="apl-loss-note">Takes about 60 seconds · your identity stays private</div>
            </div>
          </div>
        )}
      </div>

      {/* 5th identity — the market itself (systemic / mission, not a contributor form) */}
      <div className="apl-market-card apl-reveal">
        <div className="apl-market-glow"></div>
        <div className="apl-market-inner">
          <div className="apl-market-text">
            <div className="apl-eyebrow" style={{ color: "var(--apl-gold)" }}>The Johor Bahru market</div>
            <h3 className="apl-market-h">Every record chips away at information asymmetry.</h3>
            <p className="apl-market-p">
              Pricing transparency steadily makes the whole market fairer over time — for the people who live and invest here, not just the ones who sell.
            </p>
          </div>
          <button className="apl-btn apl-btn-ghost-light" onClick={onLearnMarket}>How transparency helps →</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { IdentitySection, IDENTITIES });

// ── Project-level contribute band ─────────────────────────────
// Lives at the bottom of a project detail. Frames the figures above as a
// ROUGH picture, then invites the visitor to identify their role and add
// what they know — which is what refines the data. This is where the
// "market gets fairer when you add what you know" message now lives
// (moved off the home page so it appears in-context, per-project).
function ProjectContribute({ proj, onChoose }) {
  const [sel, setSel] = idS(null);
  const chosen = IDENTITIES.find(i => i.id === sel);
  return (
    <div className="apl-pc">
      <div className="apl-pc-head">
        <div className="apl-eyebrow" style={{ color: "var(--apl-gold)" }}>Roughly accurate · help refine it</div>
        <h3 className="apl-pc-title">The market gets fairer when you add what you know.</h3>
        <p className="apl-pc-sub">
          The figures above for <b>{proj.name}</b> are a rough picture from {proj.records} community record{proj.records === 1 ? "" : "s"}.
          Add a price, a rent, or what the area's really like — and the numbers sharpen for everyone shopping here.
        </p>
      </div>

      <div className="apl-pc-rough">
        <div className="apl-pc-rough-row"><span>Net price range</span><b>{window.fmtRM(proj.netMin)}–{window.fmtRM(proj.netMax)}</b><span className="apl-pc-conf low">rough</span></div>
        <div className="apl-pc-rough-row"><span>Avg discount</span><b>−{proj.discAvg}%</b><span className="apl-pc-conf low">rough</span></div>
        <div className="apl-pc-rough-row"><span>Records behind these numbers</span><b>{proj.records}</b><span className="apl-pc-conf">{proj.records >= 5 ? "fair" : "thin"}</span></div>
        <div className="apl-pc-arrow">＋ your record →<span>refines to a tighter, confidence-rated figure</span></div>
      </div>

      <div className="apl-pc-roles-label">Add what you know as…</div>
      <div className="apl-pc-roles">
        {IDENTITIES.map(idn => (
          <button key={idn.id}
            className={"apl-pc-role" + (sel === idn.id ? " active" : "") + (sel && sel !== idn.id ? " dim" : "")}
            onClick={() => setSel(sel === idn.id ? null : idn.id)}>
            <span className={"apl-pc-role-ico " + idn.id}>{ID_ICON[idn.id]}</span>
            <span className="apl-pc-role-name">{idn.name}</span>
          </button>
        ))}
      </div>

      <div className={"apl-pc-go" + (chosen ? " show" : "")}>
        {chosen && (
          <>
            <span className="apl-pc-go-teaser">{chosen.teaser}</span>
            <button className="apl-btn apl-btn-gold apl-btn-large" onClick={() => onChoose(chosen, proj)}>
              Continue as {chosen.continueAs} →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ProjectContribute });
