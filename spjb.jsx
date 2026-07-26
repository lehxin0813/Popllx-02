// PropX — SPJB vs Net Price explainer: info card, 3-price comparison,
// inline net-price calculator, and a negotiation side note.
// Embedded in About; also reusable on a project detail page.

(function () {
  const { useState: sS } = React;
  const fmtRM = (n) => "RM" + Math.round(n || 0).toLocaleString();

  // ── PART 1 — Info card ─────────────────────────────────────────
  function SpjbInfoCard() {
    return (
      <div className="apl-spjb-card">
        <div className="apl-spjb-card-kicker">SPJB vs net price · harga sebenar</div>
        <h3 className="apl-spjb-card-h">The SPJB price isn't the full story of what you pay.</h3>
        <p className="apl-spjb-card-sum">
          On portals like TEDUH, a unit shows a <b>Selling Price</b> (harga jualan) and an <b>SPJB price</b> — the contract figure
          after standard discounts. But the SPJB price leaves out the "side" freebies a developer throws in. PropX estimates
          your <b>net price</b> (harga bersih) — what you effectively pay once those extras are counted.
        </p>
        <div className="apl-spjb-card-cols">
          <div className="apl-spjb-col include">
            <div className="apl-spjb-col-h"><span className="apl-spjb-col-ico ok">✓</span>What SPJB price already includes</div>
            <ul>
              <li>The standard developer discount (often ~10%)</li>
              <li>Bumi discount, for Bumi-quota units</li>
              <li>The figure your bank &amp; lawyer use (harga dalam SPA/SPJB)</li>
            </ul>
          </div>
          <div className="apl-spjb-col miss">
            <div className="apl-spjb-col-h"><span className="apl-spjb-col-ico add">+</span>What it still misses — PropX net captures this</div>
            <ul>
              <li>Cashback / move-in money after VP</li>
              <li>Furniture, renovation, vouchers, free kitchen or wardrobes</li>
              <li>Free SPA &amp; loan legal fees, or other absorbed costs</li>
            </ul>
          </div>
        </div>
        <div className="apl-spjb-card-note">
          The <b>SPJB price stays the legal contract price</b> used by your bank and lawyer. PropX net price is for
          understanding and negotiation — not a legal replacement. This is general information, not legal or tax advice.
        </div>
      </div>
    );
  }

  // ── PART 2 — 3-price comparison ───────────────────────────────
  function ThreePriceCompare({ selling = 720000, spjb = 648000, net = 560000 }) {
    const max = Math.max(selling, spjb, net) || 1;
    const rows = [
      { key: "sell", label: "Selling Price", tag: "Brochure / katalog", val: selling, cls: "sell" },
      { key: "spjb", label: "SPJB / SPA Price", tag: "Contract price", badge: "Gov / Contract", val: spjb, cls: "spjb" },
      { key: "net", label: "Estimated Net Price", tag: "Harga bersih", badge: "After incentives", val: net, cls: "net" },
    ];
    return (
      <div className="apl-3price">
        {rows.map(r => (
          <div key={r.key} className={"apl-3price-row " + r.cls}>
            <div className="apl-3price-label">
              <span className="apl-3price-name">{r.label}</span>
              <span className="apl-3price-tag">{r.tag}</span>
            </div>
            <div className="apl-3price-barwrap">
              <div className={"apl-3price-bar " + r.cls} style={{ width: (r.val / max * 100).toFixed(1) + "%" }}></div>
            </div>
            <div className="apl-3price-val">
              {fmtRM(r.val)}
              {r.badge && <span className={"apl-3price-badge " + r.cls}>{r.badge}</span>}
            </div>
          </div>
        ))}
        <div className="apl-3price-foot">
          Gap from SPJB to net: <b style={{ color: "var(--apl-teal)" }}>{fmtRM(spjb - net)}</b> ({((1 - net / spjb) * 100).toFixed(1)}%) in extra incentives not shown on the contract.
        </div>
      </div>
    );
  }

  // ── PART 3 — Net price calculator ─────────────────────────────
  function NetPriceCalculator() {
    const [v, setV] = sS({ spjb: 648000, cashback: 20000, furniture: 25000, legal: 12000, other: 0 });
    const set = (k) => (e) => setV(s => ({ ...s, [k]: e.target.value === "" ? "" : Number(e.target.value) }));
    const num = (x) => Number(x) || 0;
    const extras = num(v.cashback) + num(v.furniture) + num(v.legal) + num(v.other);
    const net = Math.max(0, num(v.spjb) - extras);

    const fields = [
      { k: "spjb", label: "SPJB / SPA Price (RM)", help: "The contract price from your SPA — the figure on TEDUH after standard discounts.", primary: true },
      { k: "cashback", label: "Cashback / move-in incentives (RM)", help: "If the developer promised RM20,000 cashback when you get keys, key it here." },
      { k: "furniture", label: "Furniture / reno package (RM)", help: "Rough value of free furniture, renovation, kitchen, wardrobes or vouchers." },
      { k: "legal", label: "Legal fees absorbed (RM)", help: "SPA &amp; loan legal fees the developer pays for you." },
      { k: "other", label: "Other incentives (RM)", help: "Any other freebie with a cash value not listed above." },
    ];

    return (
      <div className="apl-calc">
        <div className="apl-calc-form">
          {fields.map(f => (
            <label key={f.k} className={"apl-calc-field" + (f.primary ? " primary" : "")}>
              <span className="apl-calc-label">{f.label}</span>
              <input className="apl-calc-input" type="number" inputMode="numeric" value={v[f.k]} onChange={set(f.k)} placeholder="0" />
              <span className="apl-calc-help" dangerouslySetInnerHTML={{ __html: f.help }} />
            </label>
          ))}
        </div>
        <div className="apl-calc-result">
          <div className="apl-calc-result-main">
            <div className="apl-calc-result-l">Estimated Net Price</div>
            <div className="apl-calc-result-v">{fmtRM(net)}</div>
            <div className="apl-calc-result-sub">harga bersih you effectively pay</div>
          </div>
          <div className="apl-calc-result-row">
            <span>Total extra incentives above SPJB</span>
            <b>{fmtRM(extras)}</b>
          </div>
          {num(v.spjb) > 0 && (
            <div className="apl-calc-result-row">
              <span>That's a discount of</span>
              <b style={{ color: "var(--apl-teal)" }}>{((extras / num(v.spjb)) * 100).toFixed(1)}%</b>
            </div>
          )}
          <div className="apl-calc-result-note">
            Estimate only — confirm every figure with your lawyer and bank before you rely on it.
          </div>
        </div>
      </div>
    );
  }

  // ── PART 4 — Negotiation side note ────────────────────────────
  function NegotiationNote() {
    return (
      <div className="apl-negnote">
        <span className="apl-negnote-ico">💬</span>
        <div>
          <b>Negotiating with an agent?</b> Many freebies and cashbacks never show up on TEDUH — they live in side agreements.
          List every promised incentive in the calculator above to see your true <i>harga bersih</i>. Then double-check it all
          with your lawyer and banker before you sign.
        </div>
      </div>
    );
  }

  // ── Combined section for the About page ───────────────────────
  function SpjbExplainer() {
    return (
      <div className="apl-spjb-section">
        <h3 className="apl-about-h" style={{ marginTop: 8 }}>SPJB price vs net price (harga bersih)</h3>
        <SpjbInfoCard />

        <h3 className="apl-about-h">The three numbers, side by side</h3>
        <p style={{ marginBottom: 16 }}>An example JB serviced apartment — see how the figure drops from brochure to contract to what you actually pay:</p>
        <ThreePriceCompare />
      </div>
    );
  }

  Object.assign(window, { SpjbInfoCard, ThreePriceCompare, NetPriceCalculator, NegotiationNote, SpjbExplainer });
})();
