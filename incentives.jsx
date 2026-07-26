// PropX — "Incentives you can use in Johor Bahru" (IncentiFind-style finder).
// Flow: questionnaire (3 short screens) → personalised results → incentive detail.
// Friendly "money coach" tone. All figures are illustrative estimates, not advice.

(function () {
  const { useState: iS } = React;

  // price-range midpoints (RM) used for rough saving estimates
  const PRICE_MID = { "<=300": 250000, "300-500": 420000, "500-800": 650000, ">800": 1100000 };
  const PRICE_LABEL = { "<=300": "≤ RM300k", "300-500": "RM300k–500k", "500-800": "RM500k–800k", ">800": "> RM800k" };
  const fmtRM0 = (n) => "RM" + Math.round(n).toLocaleString();

  // ── Incentive catalogue (JB-focused) ──────────────────────────
  // eligible(a) → { status: "eligible"|"maybe"|"no", reason }
  // saving(a)   → { text } rough RM range string
  const INCENTIVES = [
    {
      id: "stampduty",
      name: "Stamp duty exemption for first-time buyers",
      tags: ["Federal", "First Home", "Budget 2026"],
      group: "first-home",
      short: "No stamp duty on the transfer (MOT) and loan agreement for your first home.",
      who: "Malaysian citizens, first-time buyer, never owned any property before (including inheritance or gift).",
      conditions: [
        "Malaysian citizen buying your very first property.",
        "Never owned property before — including inherited or gifted.",
        "Residential, priced RM500,000 or below.",
        "Valid until 31 December 2027.",
      ],
      apply: [
        "Tell your lawyer you're a first-time buyer when they prepare the SPA.",
        "Your lawyer applies the exemption — you don't file anything yourself.",
        "Keep a simple declaration that you've never owned property.",
      ],
      source: "Budget 2026 (PropertyGuru, RinggitPlus)",
      saving(a) {
        const price = PRICE_MID[a.price] || 420000;
        if (price <= 500000) { const duty = Math.round(price * 0.02); return { lo: Math.round(duty * 0.9), hi: Math.round(duty * 1.2) }; }
        return { lo: 10000, hi: 12000 };
      },
      eligible(a) {
        if (a.citizenship !== "my") return { status: "no", reason: "This federal exemption is for Malaysian citizens only." };
        if (a.first !== "yes") return { status: "no", reason: "First-time buyers only — you indicated you've owned property before." };
        if (a.ptype === "commercial") return { status: "no", reason: "Residential property only, not commercial." };
        if (a.price === ">800" || a.price === "500-800") return { status: "maybe", reason: "Above RM500k the full exemption doesn't apply — you may still get partial relief on the first RM500k." };
        return { status: "eligible", reason: "First home, residential, within RM500k — you likely get full exemption." };
      },
    },
    {
      id: "sjkp",
      name: "Housing Credit Guarantee Scheme (SJKP)",
      tags: ["Federal", "Loan Help", "Budget 2026"],
      group: "first-home",
      short: "Government guarantees your loan if you don't have a fixed salary.",
      who: "Malaysian citizens without fixed payslips — freelancers, gig workers, self-employed.",
      conditions: [
        "Malaysian citizen without a fixed monthly salary.",
        "You can service a loan but lack standard payslip proof.",
        "Buying an eligible residential home.",
      ],
      apply: [
        "Ask your bank whether your loan can be guaranteed under SJKP.",
        "Prepare income records — bank statements, business income, e-wallet history.",
        "The guarantee lets the bank approve a loan it otherwise couldn't.",
      ],
      source: "Budget 2026 (Hartamas)",
      saving() { return { lo: 0, hi: 0, text: "Loan access" }; },
      eligible(a) {
        if (a.citizenship !== "my") return { status: "no", reason: "SJKP is for Malaysian citizens." };
        return { status: "maybe", reason: "Most useful if you're self-employed or without fixed payslips — ask your bank." };
      },
    },
    {
      id: "rto",
      name: "Rent-to-Own (RTO) schemes",
      tags: ["Federal", "Deposit Help", "RMK13"],
      group: "first-home",
      short: "Live in the property first, buy it later — no big deposit upfront.",
      who: "Malaysians who can't afford a down payment yet.",
      conditions: [
        "Malaysian citizen, typically first-time buyer.",
        "Buying through a participating bank or developer RTO plan.",
        "You rent for an agreed period, then buy at a pre-set price.",
      ],
      apply: [
        "Ask developers of your shortlisted projects if they offer RTO.",
        "Check bank RTO products (e.g. through the housing agencies).",
        "Confirm the buy-later price and how much rent counts toward it.",
      ],
      source: "13th Malaysia Plan (RMK13)",
      saving() { return { lo: 0, hi: 0, text: "No big deposit" }; },
      eligible(a) {
        if (a.citizenship !== "my") return { status: "no", reason: "RTO schemes here are aimed at Malaysian citizens." };
        if (a.purpose === "invest") return { status: "maybe", reason: "RTO is designed for own-stay buyers, not investors." };
        return { status: "maybe", reason: "Useful if the deposit is your main hurdle — availability is developer-by-developer." };
      },
    },
    {
      id: "medini-nomin",
      name: "Medini zone — no minimum price for foreigners",
      tags: ["Foreigner", "Medini", "Johor"],
      group: "foreigner",
      short: "Foreigners can buy in Medini with no RM1M minimum price threshold.",
      who: "Singaporeans and other foreign buyers looking for an affordable entry.",
      conditions: [
        "Property is inside the Medini zone (Iskandar Puteri).",
        "Open to foreign buyers with no RM1M floor.",
        "8% foreign-buyer stamp duty still applies.",
      ],
      apply: [
        "Shortlist projects located within Medini.",
        "Confirm the unit is in the exempt zone with the developer.",
        "Budget for the 8% stamp duty even though the price floor is waived.",
      ],
      source: "Medini exemption (PropCashflow, iProperty)",
      saving() { return { lo: 0, hi: 0, text: "Entry below RM1M" }; },
      eligible(a) {
        if (a.citizenship === "my") return { status: "no", reason: "This matters for foreigners — Malaysians have no RM1M floor anywhere." };
        return { status: "eligible", reason: "As a foreign buyer, Medini lets you buy below the usual RM1M minimum." };
      },
    },
    {
      id: "dev-stampshare",
      name: "Developer stamp-duty sharing",
      tags: ["Foreigner", "Developer Deal"],
      group: "foreigner",
      short: "Some JB developers absorb part of the 8% foreign-buyer stamp duty to keep sales moving.",
      who: "Foreign buyers negotiating directly with developers.",
      conditions: [
        "Not government policy — offered developer-by-developer.",
        "Usually on new launches the developer wants to move.",
        "Ask during price negotiation, get it in writing.",
      ],
      apply: [
        "Ask the sales team if they share or absorb the 8% stamp duty.",
        "Compare offers across projects — some absorb more than others.",
        "Put any absorption into the SPA or a side letter.",
      ],
      source: "mymalaysiaprop.com",
      saving(a) {
        const price = PRICE_MID[a.price] || 650000;
        return { lo: Math.round(price * 0.02), hi: Math.round(price * 0.04) };
      },
      eligible(a) {
        if (a.citizenship === "my") return { status: "no", reason: "This offsets the 8% foreign-buyer duty — Malaysians don't pay it." };
        return { status: "maybe", reason: "Worth asking every developer — it's negotiable, not guaranteed." };
      },
    },
    {
      id: "comm-resi",
      name: "Commercial-to-residential conversion deduction",
      tags: ["Federal", "Supply", "Budget 2026"],
      group: "supply",
      short: "Developers converting underused commercial buildings to homes get a 10% tax deduction (capped RM10M).",
      who: "Developers — but buyers benefit through more affordable housing supply.",
      conditions: [
        "Applies to developers, not individual buyers.",
        "Converting underused commercial buildings to residential.",
        "10% tax deduction, capped at RM10M.",
      ],
      apply: [
        "This is a developer-side incentive — nothing for buyers to file.",
        "Watch for converted-building homes coming to market.",
        "More supply can mean more choice and softer prices for buyers.",
      ],
      source: "Budget 2026 (iProperty)",
      saving() { return { lo: 0, hi: 0, text: "More supply" }; },
      eligible() { return { status: "maybe", reason: "Benefits buyers indirectly — more affordable homes as commercial buildings convert." }; },
    },
  ];

  const STATUS_RANK = { eligible: 0, maybe: 1, no: 2 };
  const GROUP_LABEL = { "first-home": "First-home programmes", "foreigner": "For foreign & Singaporean buyers", "supply": "Market & supply" };

  function evaluate(answers) {
    return INCENTIVES.map(inc => {
      const e = inc.eligible(answers);
      const s = inc.saving(answers);
      return { inc, status: e.status, reason: e.reason, saveLo: s.lo, saveHi: s.hi, saveText: s.text || null };
    }).sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || b.saveHi - a.saveHi);
  }

  // ── Questionnaire ─────────────────────────────────────────────
  const QUESTIONS = [
    {
      screen: 1, title: "What are you looking for?", sub: "This takes less than a minute. We'll only use this to find incentives for you.",
      fields: [
        { key: "purpose", label: "I'm looking for…", opts: [["live", "A home to live in"], ["invest", "An investment property"], ["unsure", "Not sure yet"]] },
        { key: "first", label: "Is this your first property purchase?", opts: [["yes", "Yes, my first"], ["no", "No, I own property"]] },
      ],
    },
    {
      screen: 2, title: "A bit about you.", sub: "Income helps us match the right assistance schemes. Nothing is stored or shared.",
      fields: [
        { key: "income", label: "Rough monthly household income", opts: [["<3", "Below RM3k"], ["3-8", "RM3k – RM8k"], ["8-15", "RM8k – RM15k"], [">15", "Above RM15k"]] },
        { key: "citizenship", label: "Citizenship", opts: [["my", "Malaysian citizen"], ["pr", "Permanent Resident"], ["foreigner", "Foreigner"]] },
      ],
    },
    {
      screen: 3, title: "The property you have in mind.", sub: "Almost done — this helps us check price and location rules.",
      fields: [
        { key: "ptype", label: "Property type", opts: [["residential", "Residential"], ["commercial", "Commercial"], ["both", "Both / open"]] },
        { key: "price", label: "Price range you're targeting", opts: [["<=300", "≤ RM300k"], ["300-500", "RM300k–500k"], ["500-800", "RM500k–800k"], [">800", "> RM800k"]] },
        { key: "loc", label: "Location", opts: [["jb", "Johor Bahru"], ["other", "Other parts of Johor"]] },
      ],
    },
  ];

  function IncentiveFinder({ onExit }) {
    const [stage, setStage] = iS("intro"); // intro | q | results | detail
    const [screen, setScreen] = iS(0);
    const [answers, setAnswers] = iS({});
    const [active, setActive] = iS(null);

    const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
    const curr = QUESTIONS[screen];
    const screenComplete = curr && curr.fields.every(f => answers[f.key]);

    // ----- INTRO -----
    if (stage === "intro") {
      return (
        <div className="apl-inc-wrap">
          <button className="apl-back-link" onClick={onExit}>‹ Resources</button>
          <div className="apl-inc-intro">
            <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Incentives finder</div>
            <h1 className="apl-h2" style={{ marginBottom: 12 }}>Money you could save.</h1>
            <p className="apl-lead" style={{ marginLeft: 0, fontSize: 18, maxWidth: 600 }}>
              Government incentives for JB property buyers. Answer a few quick questions and check which ones apply to you.
            </p>
            <div className="apl-inc-intro-points">
              <div><span className="apl-inc-tick">✓</span> Takes less than 1 minute</div>
              <div><span className="apl-inc-tick">✓</span> Nothing is stored or shared</div>
              <div><span className="apl-inc-tick">✓</span> Plain language, no legal jargon</div>
            </div>
            <button className="apl-btn apl-btn-primary apl-btn-large" onClick={() => { setStage("q"); setScreen(0); }}>Start — it's free →</button>
            <p className="apl-inc-disclaimer">These are general estimates to guide you, not legal or tax advice. Always confirm with your lawyer, tax agent and official government sources.</p>
          </div>
        </div>
      );
    }

    // ----- QUESTIONNAIRE -----
    if (stage === "q") {
      return (
        <div className="apl-inc-wrap">
          <button className="apl-back-link" onClick={() => (screen === 0 ? setStage("intro") : setScreen(screen - 1))}>‹ Back</button>
          <div className="apl-inc-q">
            <div className="apl-inc-progress">
              {QUESTIONS.map((_, i) => <span key={i} className={"apl-inc-prog-dot" + (i <= screen ? " on" : "")}></span>)}
              <span className="apl-inc-prog-lab">Step {screen + 1} of {QUESTIONS.length}</span>
            </div>
            <h1 className="apl-h2" style={{ marginBottom: 6 }}>{curr.title}</h1>
            <p className="apl-inc-q-sub">{curr.sub}</p>

            {curr.fields.map(f => (
              <div key={f.key} className="apl-inc-field">
                <div className="apl-inc-q-label">{f.label}</div>
                <div className="apl-inc-opts">
                  {f.opts.map(([val, lab]) => (
                    <button key={val} className={"apl-inc-opt" + (answers[f.key] === val ? " on" : "")} onClick={() => set(f.key, val)}>
                      {answers[f.key] === val && <span className="apl-inc-opt-tick">✓</span>}{lab}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="apl-inc-q-actions">
              {screen < QUESTIONS.length - 1
                ? <button className="apl-btn apl-btn-primary apl-btn-large" disabled={!screenComplete} onClick={() => setScreen(screen + 1)}>Continue →</button>
                : <button className="apl-btn apl-btn-primary apl-btn-large" disabled={!screenComplete} onClick={() => setStage("results")}>See my incentives →</button>}
            </div>
          </div>
        </div>
      );
    }

    // ----- RESULTS -----
    if (stage === "results") {
      const evald = evaluate(answers);
      const eligible = evald.filter(e => e.status !== "no");
      const totalLo = eligible.reduce((s, e) => s + e.saveLo, 0);
      const totalHi = eligible.reduce((s, e) => s + e.saveHi, 0);
      const groups = {};
      evald.forEach(e => { (groups[e.inc.group] = groups[e.inc.group] || []).push(e); });

      return (
        <div className="apl-inc-wrap">
          <button className="apl-back-link" onClick={() => { setStage("q"); setScreen(0); }}>‹ Edit answers</button>

          <div className="apl-inc-summary">
            <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Your personalised incentives</div>
            <h1 className="apl-h2" style={{ marginBottom: 10 }}>
              You may be able to save around <span style={{ color: "var(--apl-teal)" }}>{fmtRM0(totalLo)}–{fmtRM0(totalHi)}</span> across {eligible.length} incentive{eligible.length !== 1 ? "s" : ""}.
            </h1>
            <p className="apl-lead" style={{ marginLeft: 0, fontSize: 16 }}>Based on a {PRICE_LABEL[answers.price] || "—"} {answers.ptype === "commercial" ? "commercial" : "residential"} purchase in {answers.loc === "jb" ? "Johor Bahru" : "Johor"}. Check the details below.</p>
          </div>

          {Object.keys(groups).map(g => (
            <div key={g} className="apl-inc-group">
              <h2 className="apl-inc-group-title">{GROUP_LABEL[g] || g}</h2>
              <div className="apl-inc-cards">
                {groups[g].map(e => (
                  <button key={e.inc.id} className={"apl-inc-card status-" + e.status} onClick={() => { setActive(e); setStage("detail"); }}>
                    <div className="apl-inc-card-head">
                      <span className={"apl-inc-status apl-inc-status-" + e.status}>
                        {e.status === "eligible" ? "Likely eligible" : e.status === "maybe" ? "Maybe eligible" : "Not eligible"}
                      </span>
                      {e.status !== "no" && <span className="apl-inc-save">{e.saveText ? e.saveText : "~" + fmtRM0(e.saveLo) + "–" + fmtRM0(e.saveHi)}</span>}
                    </div>
                    <div className="apl-inc-card-name">{e.inc.name}</div>
                    <div className="apl-inc-tags">
                      {e.inc.tags.map(t => <span key={t} className="apl-inc-tag">{t}</span>)}
                    </div>
                    <p className="apl-inc-card-short">{e.inc.short}</p>
                    <div className="apl-inc-reason"><span className={"apl-inc-reason-dot " + e.status}></span>{e.reason}</div>
                    <span className="apl-inc-card-cta">See details &amp; steps ›</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <p className="apl-inc-disclaimer big">These figures are rough estimates to help you plan — not legal or tax advice. Confirm every incentive with your lawyer, tax agent and official government sources before relying on it.</p>
        </div>
      );
    }

    // ----- DETAIL -----
    if (stage === "detail" && active) {
      const e = active, inc = e.inc;
      return (
        <div className="apl-inc-wrap">
          <button className="apl-back-link" onClick={() => setStage("results")}>‹ Back to my incentives</button>
          <div className="apl-inc-detail">
            <div className="apl-inc-detail-head">
              <span className={"apl-inc-status apl-inc-status-" + e.status}>
                {e.status === "eligible" ? "Likely eligible" : e.status === "maybe" ? "Maybe eligible" : "Not eligible"}
              </span>
              <div className="apl-inc-tags">{inc.tags.map(t => <span key={t} className="apl-inc-tag">{t}</span>)}</div>
            </div>
            <h1 className="apl-h2" style={{ margin: "10px 0 8px" }}>{inc.name}</h1>
            <p className="apl-inc-detail-short">{inc.short}</p>

            {e.status !== "no" && (
              <div className="apl-inc-detail-save">
                <span className="l">{e.saveText ? "What you get" : "Estimated saving"}</span>
                <span className="v">{e.saveText ? e.saveText : "~" + fmtRM0(e.saveLo) + "–" + fmtRM0(e.saveHi)}</span>
                <span className="n">{e.saveText ? "benefit, not a cash saving" : "on a " + (PRICE_LABEL[answers.price] || "typical") + " purchase · rough estimate"}</span>
              </div>
            )}

            <div className="apl-inc-detail-grid">
              <section>
                <h3 className="apl-inc-h3">Who it's for</h3>
                <p className="apl-inc-p">{inc.who}</p>
                <h3 className="apl-inc-h3">Main conditions</h3>
                <ul className="apl-inc-list">{inc.conditions.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </section>
              <section>
                <h3 className="apl-inc-h3">How to claim it</h3>
                <ul className="apl-inc-list">{inc.apply.map((c, i) => <li key={i}>{c}</li>)}</ul>
                <div className="apl-inc-nextbox">
                  <div className="apl-inc-nextbox-title">Your next steps</div>
                  <ol className="apl-inc-steps">
                    <li>Confirm the property price and type with your lawyer or agent.</li>
                    <li>Ask whether you qualify based on your existing properties and income.</li>
                    <li>Make sure your SPA and loan are signed within any scheme deadline.</li>
                  </ol>
                </div>
              </section>
            </div>

            <div className="apl-inc-riskbox">
              <span className="apl-inc-risk-ico">!</span>
              <div>This is a general estimate. Eligibility, amounts and deadlines change. Please confirm with your lawyer, tax agent, and official government sources before relying on it.{inc.source ? " Source: " + inc.source + "." : ""}</div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  Object.assign(window, { IncentiveFinder, INCENTIVES });
})();
