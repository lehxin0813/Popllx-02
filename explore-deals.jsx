// PropX — Explore: global community deals table + integrated submit-deal flow.
// Free preview = first 30 deals; contribute one deal to unlock everything.

(function () {
  const { useState: eS, useMemo: eM, useRef: eR, useEffect: eE } = React;
  const fmtRM = (k) => { const n = k >= 1000 ? (k / 1000).toFixed(k % 1000 === 0 ? 0 : 2) + "M" : k + "k"; return "RM " + n; };
  const fmtFull = (n) => "RM " + Math.round(n).toLocaleString();

  // ── Submit-deal modal (guided, no free-typing for key fields) ──
  function SubmitDealModal({ presetProject, onClose, onDone }) {
    const projects = window.JB_PROJECTS;
    const [step, setStep] = eS(presetProject ? "form" : "category");
    const [txn, setTxn] = eS("New launch");
    const [proj, setProj] = eS(presetProject || null);
    const [selDir, setSelDir] = eS(null);
    const [selType, setSelType] = eS(null);
    const [q, setQ] = eS("");
    const [f, setF] = eS({ date: "2026-05", unit: "2BR", size: "", spa: "", net: "" });
    const [inc, setInc] = eS({ rebate: true, spaLegal: false, loanLegal: false, maintenance: false, furniture: false, other: false });
    const [otherTxt, setOtherTxt] = eS("");
    const [rebateAmt, setRebateAmt] = eS("");
    const [furnitureTxt, setFurnitureTxt] = eS("");
    const [photos, setPhotos] = eS([]);
    const [proofType, setProofType] = eS("offer");
    function addPhotos(fileList) {
      const files = Array.from(fileList || []);
      Promise.all(files.slice(0, 6).map(f => new Promise(res => {
        const r = new FileReader(); r.onload = () => res({ name: f.name, url: r.result }); r.readAsDataURL(f);
      }))).then(imgs => setPhotos(p => [...p, ...imgs].slice(0, 6)));
    }
    const [source, setSource] = eS("Buyer");
    // New-project (community-added) flow
    const [np, setNp] = eS({ name: "", developer: "", address: "", postcode: "", ptype: "Service apartment", floors: "", completion: "", tenure: "" });
    const setNpF = (k, v) => setNp(s => ({ ...s, [k]: v }));
    const [addrEdit, setAddrEdit] = eS("");
    // JB postcode → cardinal direction
    const zoneFromPostcode = (pc) => {
      const n = parseInt(pc, 10);
      if (!n || String(pc).length !== 5) return null;
      if (n >= 80000 && n <= 80400) return "south-core";
      if (n >= 80500 && n <= 81100) return "east";
      if ((n >= 79000 && n <= 79250) || (n >= 79500 && n <= 79550)) return "west";
      if (n >= 81700 && n <= 81750) return "south-east";
      if (n >= 81000 && n <= 81020) return "north";
      return null;
    };
    const npZone = zoneFromPostcode(np.postcode);
    const [npZoneOverride, setNpZoneOverride] = eS(null);
    const effectiveNpZone = npZoneOverride || npZone;
    const set = (k, v) => setF(s => ({ ...s, [k]: v }));
    const discount = (f.spa && f.net && Number(f.spa) > 0) ? ((1 - Number(f.net) / Number(f.spa)) * 100) : null;
    const catOf3 = (p) => (p.dType === "Service apartment / condo" ? "apartment" : p.dType.startsWith("Shop") ? "retail" : "landed");
    const matches = projects.filter(p => (!selDir || p.direction === selDir) && (!selType || catOf3(p) === selType) && (p.name.toLowerCase().includes(q.toLowerCase()) || p.corridor.toLowerCase().includes(q.toLowerCase())));

    eE(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

    function submit() { window.markContributed && window.markContributed(); setStep("done"); }

    return (
      <div className="apl-modal-scrim" onClick={onClose}>
        <div className="apl-modal" onClick={e => e.stopPropagation()}>
          <button className="apl-modal-x" onClick={onClose}>✕</button>

          {/* STEP 1 — category */}
          {step === "category" && (
            <div className="apl-modal-body">
              <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Add your JB deal · step 1 of 5</div>
              <h2 className="apl-modal-title">What kind of deal is this?</h2>
              <p className="apl-modal-sub">This helps us explain net price and incentives the right way.</p>
              <div className="apl-modal-cat">
                {[["New launch", "Developer unit", "Bought directly from the developer, often with rebates & incentives."],
                  ["Subsale", "From another owner", "Bought from an existing owner on the secondary market."],
                  ["Auction", "Auctioned unit", "Won at a bank or court auction below market."]].map(([t, h, d]) => (
                  <button key={t} className={"apl-cat-card" + (txn === t ? " on" : "")} onClick={() => setTxn(t)}>
                    {txn === t && <span className="apl-cat-tick">✓</span>}
                    <span className="apl-cat-name">{t}</span>
                    <span className="apl-cat-h">{h}</span>
                    <span className="apl-cat-d">{d}</span>
                  </button>
                ))}
              </div>
              <button className="apl-btn apl-btn-primary apl-btn-large" style={{ marginTop: 8 }} onClick={() => setStep("direction")}>Continue →</button>
            </div>
          )}

          {/* STEP 2 — cardinal direction */}
          {step === "direction" && (
            <div className="apl-modal-body">
              <button className="apl-back-link" onClick={() => setStep("category")}>‹ Back</button>
              <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Add your JB deal · step 2 of 5</div>
              <h2 className="apl-modal-title">Which part of JB?</h2>
              <p className="apl-modal-sub">Pick the cardinal direction your project sits in — we'll show its projects next.</p>
              <div className="apl-modal-dirs">
                {window.DIRECTIONS.map(d => (
                  <button key={d.id} className={"apl-modal-dir" + (selDir === d.id ? " on" : "")} style={selDir === d.id ? { borderColor: d.color } : null}
                    onClick={() => { setSelDir(d.id); setProj(null); }}>
                    <span className="apl-modal-dir-dot" style={{ background: d.color }}></span>
                    <span className="apl-modal-dir-name" style={selDir === d.id ? { color: d.color } : null}>{d.compass}</span>
                    <span className="apl-modal-dir-areas">{d.district}</span>
                    {selDir === d.id && <span className="apl-modal-projtick">✓</span>}
                  </button>
                ))}
              </div>
              <button className="apl-btn apl-btn-primary apl-btn-large" disabled={!selDir} onClick={() => { setSelType(null); setStep("ptype"); }}>Continue →</button>
            </div>
          )}

          {/* STEP 3 — landed vs apartment */}
          {step === "ptype" && (
            <div className="apl-modal-body">
              <button className="apl-back-link" onClick={() => setStep("direction")}>‹ Back</button>
              <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Add your JB deal · step 3 of 5</div>
              <h2 className="apl-modal-title">What type of property?</h2>
              <p className="apl-modal-sub">Pick the property type — we'll show matching projects in {(window.DIRECTIONS.find(d => d.id === selDir) || {}).compass || "this area"} next.</p>
              <div className="apl-modal-cat">
                {[["apartment", "Service apartment / condo", "High-rise units in a tower block."],
                  ["landed", "Landed residential", "Terrace, semi-D or bungalow on its own lot."],
                  ["retail", "Retail shop / office", "Shoplot or office unit, 2- or 3-storey."]].map(([t, h, d]) => (
                  <button key={t} className={"apl-cat-card" + (selType === t ? " on" : "")} onClick={() => { setSelType(t); setProj(null); }}>
                    {selType === t && <span className="apl-cat-tick">✓</span>}
                    <span className="apl-cat-name">{h}</span>
                    <span className="apl-cat-d">{d}</span>
                  </button>
                ))}
              </div>
              <button className="apl-btn apl-btn-primary apl-btn-large" disabled={!selType} onClick={() => { setQ(""); setStep("project"); }}>Continue →</button>
            </div>
          )}

          {/* STEP 3 — project picker (filtered to the chosen direction) */}
          {step === "project" && (
            <div className="apl-modal-body">
              <button className="apl-back-link" onClick={() => setStep("ptype")}>‹ Back</button>
              <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Add your JB deal · step 4 of 5</div>
              <h2 className="apl-modal-title">Which project?</h2>
              <p className="apl-modal-sub">Pick from the projects we track in {(window.DIRECTIONS.find(d => d.id === selDir) || {}).compass || "this area"}. We only accept submissions for listed projects, so the data stays clean.</p>
              <input className="apl-modal-search" placeholder="Search project or area…" value={q} onChange={e => setQ(e.target.value)} autoFocus />
              <div className="apl-modal-projlist">
                {matches.map(p => (
                  <button key={p.slug} className={"apl-modal-projrow" + (proj && proj.slug === p.slug ? " on" : "")} onClick={() => setProj(p)}>
                    <span className="apl-modal-projname">{p.name}</span>
                    <span className="apl-modal-projmeta">{p.developer} · {p.corridor} · {p.dType}</span>
                    {proj && proj.slug === p.slug && <span className="apl-modal-projtick">✓</span>}
                  </button>
                ))}
                {!matches.length && (
                  <div className="apl-modal-noproj">
                    No tracked projects match here yet — add yours below.
                  </div>
                )}
              </div>
              <button className="apl-newproj-cta" onClick={() => { setProj(null); setStep("newproj"); }}>My project isn't listed → Add a new one</button>
              <button className="apl-btn apl-btn-primary apl-btn-large" disabled={!proj} onClick={() => { setAddrEdit(proj && proj.address ? proj.address : ""); setStep("form"); }}>Continue →</button>
            </div>
          )}

          {/* STEP 3b — add a community project */}
          {step === "newproj" && (
            <div className="apl-modal-body">
              <button className="apl-back-link" onClick={() => setStep("project")}>‹ Back to list</button>
              <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Add your JB deal · new project</div>
              <h2 className="apl-modal-title">Add a project we don't have yet</h2>
              <p className="apl-modal-sub">You'll be the first to put this on PropX. We review new projects weekly — your deal still publishes now and unlocks your access.</p>
              <div className="apl-modal-grid">
                <label className="apl-field" style={{ gridColumn: "1 / -1" }}><span>Project name <b className="apl-req">*</b></span>
                  <input className="apl-select" value={np.name} onChange={e => setNpF("name", e.target.value)} placeholder="Skypark Kepler" />
                </label>
                <label className="apl-field"><span>Developer <b className="apl-req">*</b></span>
                  <input className="apl-select" value={np.developer} onChange={e => setNpF("developer", e.target.value)} placeholder="Tropicana Corporation" />
                </label>
                <label className="apl-field"><span>Property type <b className="apl-req">*</b></span>
                  <select className="apl-select" value={np.ptype} onChange={e => setNpF("ptype", e.target.value)}>
                    {["Service apartment", "Terrace", "Semi-D", "Bungalow", "Shop"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="apl-field" style={{ gridColumn: "1 / -1" }}><span>Address <b className="apl-req">*</b></span>
                  <input className="apl-select" value={np.address} onChange={e => setNpF("address", e.target.value)} placeholder="Jalan Dato Abdullah Tahir, Taman Pelangi" />
                </label>
                <label className="apl-field"><span>Postcode <b className="apl-req">*</b></span>
                  <input className="apl-select" type="number" value={np.postcode} onChange={e => { setNpF("postcode", e.target.value); setNpZoneOverride(null); }} placeholder="80400" />
                </label>
                <label className="apl-field"><span>Floors <span className="apl-opt">(apartments)</span></span>
                  <input className="apl-select" type="number" value={np.floors} onChange={e => setNpF("floors", e.target.value)} placeholder="38" />
                </label>
                <label className="apl-field"><span>Completion <span className="apl-opt">(optional)</span></span>
                  <select className="apl-select" value={np.completion} onChange={e => setNpF("completion", e.target.value)}>
                    {["", "Completed", "Under construction", "Not started"].map(c => <option key={c} value={c}>{c || "—"}</option>)}
                  </select>
                </label>
                <label className="apl-field"><span>Tenure <span className="apl-opt">(optional)</span></span>
                  <div className="apl-chiprow">
                    {["Freehold", "Leasehold"].map(t => (
                      <button key={t} type="button" className={"apl-minichip" + (np.tenure === t ? " on" : "")} onClick={() => setNpF("tenure", np.tenure === t ? "" : t)}>{t}</button>
                    ))}
                  </div>
                </label>
              </div>
              {np.postcode.length === 5 && (
                <div className="apl-zone-suggest">
                  {effectiveNpZone
                    ? <>Based on postcode {np.postcode}, we've placed this in <b>{(window.DIRECTIONS.find(d => d.id === effectiveNpZone) || {}).compass}</b>. Wrong?{" "}
                        <span className="apl-zone-opts">{window.DIRECTIONS.map(d => (
                          <button key={d.id} className={"apl-zone-opt" + (effectiveNpZone === d.id ? " on" : "")} onClick={() => setNpZoneOverride(d.id)}>{d.compass}</button>
                        ))}</span></>
                    : <>Postcode not recognised as JB — pick the zone:{" "}
                        <span className="apl-zone-opts">{window.DIRECTIONS.map(d => (
                          <button key={d.id} className={"apl-zone-opt" + (npZoneOverride === d.id ? " on" : "")} onClick={() => setNpZoneOverride(d.id)}>{d.compass}</button>
                        ))}</span></>}
                </div>
              )}
              <div className="apl-newproj-note">New projects are tagged <span className="apl-badge-comm">Community-added</span> until we verify them.</div>
              <button className="apl-btn apl-btn-primary apl-btn-large"
                disabled={!(np.name && np.developer && np.address && np.postcode.length === 5 && effectiveNpZone)}
                onClick={() => { setProj({ slug: "new-" + np.name.toLowerCase().replace(/\s+/g, "-"), name: np.name, developer: np.developer, corridor: np.address, dType: np.ptype, address: np.address, community: true, direction: effectiveNpZone }); setAddrEdit(np.address); setStep("form"); }}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 4 — controlled fields */}
          {step === "form" && (
            <div className="apl-modal-body">
              {!presetProject && <button className="apl-back-link" onClick={() => setStep("project")}>‹ Back</button>}
              <div className="apl-eyebrow" style={{ color: "var(--apl-teal)" }}>Add your JB deal · step 5 of 5</div>
              <h2 className="apl-modal-title">Your deal details</h2>
              <div className="apl-modal-projpill">
                <span>{proj ? proj.name : "—"}{proj && proj.community && <span className="apl-badge-comm" style={{ marginLeft: 8 }}>Community-added</span>}</span>
                <span className="apl-modal-projpill-tag">{txn}{presetProject ? " · project locked" : ""}</span>
              </div>
              <label className="apl-field" style={{ marginBottom: 4 }}><span>Address {proj && proj.community ? <b className="apl-req">*</b> : <span className="apl-opt">— does this look right? edit if needed</span>}</span>
                <input className="apl-select" value={addrEdit} onChange={e => setAddrEdit(e.target.value)} placeholder="Jalan …, Taman …" />
              </label>

              <div className="apl-modal-grid">
                <label className="apl-field"><span>Deal month</span>
                  <input className="apl-select" value={f.date} onChange={e => set("date", e.target.value)} placeholder="2026-05" />
                </label>
                <label className="apl-field"><span>Unit type</span>
                  <select className="apl-select" value={f.unit} onChange={e => set("unit", e.target.value)}>
                    {["Studio", "1BR", "2BR", "3BR", "Terrace", "Semi-D", "Bungalow"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </label>
                <label className="apl-field"><span>Built-up size (sf)</span>
                  <input className="apl-select" type="number" value={f.size} onChange={e => set("size", e.target.value)} placeholder="720" />
                </label>
                <label className="apl-field"><span>SPA price (RM)</span>
                  <input className="apl-select" type="number" value={f.spa} onChange={e => set("spa", e.target.value)} placeholder="650000" />
                </label>
                <label className="apl-field"><span>Net price paid (RM)</span>
                  <input className="apl-select" type="number" value={f.net} onChange={e => set("net", e.target.value)} placeholder="560000" />
                </label>
                <div className="apl-field">
                  <span>Live discount</span>
                  <div className={"apl-live-disc" + (discount !== null ? (discount >= 0 ? " pos" : " neg") : " empty")}>
                    {discount !== null ? `${discount.toFixed(1)}% from SPA → net` : "Fill SPA & net to see"}
                  </div>
                </div>
              </div>

              <div className="apl-field-label" style={{ marginTop: 8 }}>Incentives in the package</div>
              <div className="apl-modal-inc">
                {[["rebate", "Rebate %"], ["spaLegal", "Free SPA legal"], ["loanLegal", "Free loan legal"], ["maintenance", "Free maintenance"], ["furniture", "Furniture package"], ["other", "Other"]].map(([k, l]) => (
                  <button key={k} className={"apl-inc-chip2" + (inc[k] ? " on" : "")} onClick={() => setInc(s => ({ ...s, [k]: !s[k] }))}>
                    {inc[k] ? "✓ " : "+ "}{l}
                  </button>
                ))}
              </div>
              {inc.rebate && <input className="apl-select" type="number" style={{ marginTop: 10 }} value={rebateAmt} onChange={e => setRebateAmt(e.target.value)} placeholder="Cash rebate amount (RM) — e.g. 20000" />}
              {inc.furniture && <input className="apl-select" style={{ marginTop: 10 }} value={furnitureTxt} onChange={e => setFurnitureTxt(e.target.value)} placeholder="What furniture? — e.g. fridge, sofa, beds, kitchen cabinets" />}
              {inc.other && <input className="apl-select" style={{ marginTop: 10 }} value={otherTxt} onChange={e => setOtherTxt(e.target.value)} placeholder="Describe the other incentive (optional)" />}

              <div className="apl-field-label" style={{ marginTop: 18 }}>What proof can you share? <span style={{ fontWeight: 400, color: "var(--apl-ink-3)" }}>(optional)</span></div>
              <div className="apl-proof-seg">
                {[
                  ["offer", "Proof of offer", "What was offered"],
                  ["deal", "Proof of deal", "Booking stage"],
                  ["contract", "Proof of contract", "Final & signed"],
                ].map(([id, title, tag]) => (
                  <button key={id} className={"apl-proof-pill" + (proofType === id ? " on" : "")} onClick={() => setProofType(id)}>
                    <span className="apl-proof-pill-title">{title}</span>
                    <span className="apl-proof-pill-tag">{tag}</span>
                  </button>
                ))}
              </div>
              <table className="apl-proof-table">
                <tbody>
                  {[
                    ["offer", "Brochure, promo image, or site-visit photo showing price or incentives.", "Still viewing / shortlisting — log what was offered to you."],
                    ["deal", "Booking form, rebate/package sheet, or price summary (personal details masked).", "Paid booking fees or considering — record the deal on the table."],
                    ["contract", "SPA front page, side letter, tenancy excerpt or valuation page — values visible, name / IC / unit masked.", "Confirms your final price or incentives."],
                  ].map(([id, ex, use]) => (
                    <tr key={id} className={proofType === id ? "on" : ""}>
                      <th>{id === "offer" ? "Offer" : id === "deal" ? "Deal" : "Contract"}</th>
                      <td>{ex}<span className="apl-proof-use">{use}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {proofType === "contract" && <div className="apl-proof-hint">Please cover your name, IC and unit number before uploading.</div>}

              <div className="apl-field-label" style={{ marginTop: 18 }}>Upload proof <span style={{ fontWeight: 400, color: "var(--apl-ink-3)" }}>(optional)</span></div>
              <div className="apl-photo-up">
                <label className="apl-photo-add">
                  <input type="file" accept="image/*" multiple onChange={e => addPhotos(e.target.files)} style={{ display: "none" }} />
                  <span className="apl-photo-add-ico">+</span>
                  <span>Add photos</span>
                </label>
                {photos.map((p, i) => (
                  <div key={i} className="apl-photo-thumb" style={{ backgroundImage: "url(" + p.url + ")" }}>
                    <button className="apl-photo-x" onClick={() => setPhotos(ph => ph.filter((_, j) => j !== i))}>✕</button>
                  </div>
                ))}
              </div>
              <div className="apl-photo-note">Up to 6 images. Please mask anything identifying — name, IC, unit number, faces.</div>

              <div className="apl-field-label" style={{ marginTop: 18 }}>I'm submitting as</div>
              <div className="apl-modal-source">
                {["Buyer", "Agent", "Other"].map(s => (
                  <button key={s} className={"apl-src-chip" + (source === s ? " on" : "")} onClick={() => setSource(s)}>{s}</button>
                ))}
              </div>

              <div className="apl-modal-reassure">🔒 Shared anonymised — we never store unit numbers, names or personal data. Figures are approximate and for community research only.</div>
              <button className="apl-btn apl-btn-primary apl-btn-large" style={{ width: "100%", marginTop: 18 }}
                disabled={!f.spa || !f.net} onClick={submit}>Submit deal &amp; unlock full data</button>
            </div>
          )}

          {/* DONE */}
          {step === "done" && (
            <div className="apl-modal-body apl-modal-done">
              <div className="apl-modal-check">✓</div>
              <h2 className="apl-modal-title">Thanks for contributing.</h2>
              <p className="apl-modal-sub" style={{ maxWidth: 380, margin: "0 auto 6px" }}>
                Your record may be lightly checked before inclusion. You've unlocked <b>full access</b> to every community-submitted deal.
              </p>
              <div className="apl-contrib-badge" style={{ margin: "16px auto" }}><span className="dot"></span>Community contributor · Full access unlocked</div>
              <button className="apl-btn apl-btn-primary apl-btn-large" onClick={() => onDone && onDone()}>See all deals →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Explore: drill-down by cardinal direction ────────────────
  // Level 1: pick a direction. Level 2: that direction's projects, each
  // showing a few transactions free; submit to unlock the rest.
  function ExploreDealsView({ onPick, openBrowse }) {
    const all = window.ALL_DEALS;
    const [modal, setModal] = eS(false);
    const [modalProject, setModalProject] = eS(null);
    const [unlocked, setUnlocked] = eS(window.hasContributed());
    // Re-read the flag whenever it changes elsewhere (SubmitView, another tab,
    // page becoming visible again) so navigating back doesn't require a refresh.
    eE(() => {
      const refresh = () => setUnlocked(window.hasContributed());
      window.addEventListener("storage", refresh);
      window.addEventListener("focus", refresh);
      document.addEventListener("visibilitychange", refresh);
      // also poll once per second in case a same-tab write bypassed the storage event
      const t = setInterval(refresh, 1000);
      return () => {
        window.removeEventListener("storage", refresh);
        window.removeEventListener("focus", refresh);
        document.removeEventListener("visibilitychange", refresh);
        clearInterval(t);
      };
    }, []);
    const [selDir, setSelDir] = eS(null);
    const [selCat, setSelCat] = eS(null); // "apartment" | "landed" | "retail"
    const [projQuery, setProjQuery] = eS("");
    const [projOpen, setProjOpen] = eS(false);

    const FREE_TXNS = 30; // total free transactions per direction+category before the gate
    const catOf = (p) => (p.dType === "Service apartment / condo" ? "apartment" : p.dType.startsWith("Shop") ? "retail" : "landed");
    function openModal(proj) { setModalProject(proj || null); setModal(true); }
    function afterSubmit() { setUnlocked(true); setModal(false); setModalProject(null); }
    function backToDir() { setSelCat(null); setSelDir(null); }

    // ===== LEVEL 1 — direction selector =====
    if (!selDir) {
      return (
        <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
          {modal && <SubmitDealModal presetProject={modalProject} onClose={() => setModal(false)} onDone={afterSubmit} />}
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 28px 100px" }}>
            <div className="apl-exp-hero">
              <div>
                <div className="apl-eyebrow">Explore · community deals</div>
                <h1 className="apl-h2" style={{ marginBottom: 10 }}>Where in JB are you looking?</h1>
                <p className="apl-lead" style={{ marginTop: 0, marginLeft: 0, fontSize: 17, maxWidth: 600 }}>
                  Pick a direction to see its projects and what people actually paid. A few deals are free — add your own to unlock the rest.
                </p>
              </div>
              <div className="apl-exp-hero-actions">
                {unlocked
                  ? <span className="apl-contrib-badge"><span className="dot"></span>Community contributor · Full access</span>
                  : <button className="apl-btn apl-btn-primary apl-btn-large" onClick={() => openModal(null)}>Submit your deal</button>}
              </div>
            </div>

            <div className="apl-dirpick-grid">
              {window.DIRECTIONS.map(dir => {
                const rows = all.filter(d => d.direction === dir.id);
                const projects = new Set(rows.map(r => r.slug)).size;
                const s = window.dealsSummary(rows);
                return (
                  <button key={dir.id} className="apl-dirpick" style={{ borderColor: dir.color }} onClick={() => setSelDir(dir.id)}>
                    <div className="apl-dirpick-art" dangerouslySetInnerHTML={{ __html: window.AplImg.directionScene(dir.id, dir.color) }} />
                    <div className="apl-dirpick-body">
                      <div className="apl-dirpick-top">
                        <span className="apl-deal-banner-dot" style={{ background: dir.color }}></span>
                        <span className="apl-dirpick-compass" style={{ color: dir.color }}>{dir.compass}</span>
                      </div>
                      <div className="apl-dirpick-district">{dir.district}</div>
                      <div className="apl-dirpick-areas">{dir.areas}</div>
                      <div className="apl-dirpick-stats">
                        <span><b>{projects}</b> projects</span><span className="sep">·</span>
                        <span><b>{s.count}</b> deals</span>
                      </div>
                      <span className="apl-dirpick-cta" style={{ color: dir.color }}>View deals →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // ===== LEVEL 2 — picked direction, choose property category =====
    const dir = window.DIRECTIONS.find(d => d.id === selDir);
    const dirDeals = all.filter(d => d.direction === selDir);

    if (!selCat) {
      const apartmentSlugs = new Set(dirDeals.filter(d => { const p = window.JB_PROJECTS.find(x => x.slug === d.slug); return p && catOf(p) === "apartment"; }).map(d => d.slug));
      const landedSlugs = new Set(dirDeals.filter(d => { const p = window.JB_PROJECTS.find(x => x.slug === d.slug); return p && catOf(p) === "landed"; }).map(d => d.slug));
      const retailSlugs = new Set(dirDeals.filter(d => { const p = window.JB_PROJECTS.find(x => x.slug === d.slug); return p && catOf(p) === "retail"; }).map(d => d.slug));
      const aptDeals = dirDeals.filter(d => apartmentSlugs.has(d.slug)).length;
      const lndDeals = dirDeals.filter(d => landedSlugs.has(d.slug)).length;
      const rtlDeals = dirDeals.filter(d => retailSlugs.has(d.slug)).length;
      return (
        <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
          {modal && <SubmitDealModal presetProject={modalProject} onClose={() => setModal(false)} onDone={afterSubmit} />}
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 28px 100px" }}>
            <button className="apl-back-link" onClick={backToDir}>‹ All directions</button>
            <div className="apl-deal-banner" style={{ borderColor: dir.color, marginTop: 14, marginBottom: 28 }}>
              <div className="apl-deal-banner-art" dangerouslySetInnerHTML={{ __html: window.AplImg.directionScene(dir.id, dir.color) }} />
              <div className="apl-deal-banner-body">
                <div className="apl-deal-banner-top">
                  <span className="apl-deal-banner-dot" style={{ background: dir.color }}></span>
                  <span className="apl-deal-banner-compass" style={{ color: dir.color }}>{dir.compass}</span>
                  <span className="apl-deal-banner-district">{dir.district}</span>
                </div>
                <div className="apl-deal-banner-areas">{dir.areas}</div>
              </div>
            </div>

            <h2 className="apl-h3" style={{ marginBottom: 6 }}>What kind of property?</h2>
            <p className="apl-lead" style={{ marginTop: 0, marginLeft: 0, fontSize: 16, marginBottom: 24 }}>Pick a category to see its projects and community deals in {dir.compass}.</p>
            <div className="apl-catpick-grid three">
              <button className="apl-catpick" style={{ borderTopColor: dir.color }} onClick={() => setSelCat("apartment")} disabled={!apartmentSlugs.size}>
                <div className="apl-catpick-ico">🏢</div>
                <div className="apl-catpick-name">Service apartment / condo</div>
                <div className="apl-catpick-desc">High-rise units — serviced apartments and condominiums.</div>
                <div className="apl-catpick-stats"><b>{apartmentSlugs.size}</b> projects · <b>{aptDeals}</b> deals</div>
                <span className="apl-catpick-cta" style={{ color: dir.color }}>{apartmentSlugs.size ? "View →" : "None tracked yet"}</span>
              </button>
              <button className="apl-catpick" style={{ borderTopColor: dir.color }} onClick={() => setSelCat("landed")} disabled={!landedSlugs.size}>
                <div className="apl-catpick-ico">🏘️</div>
                <div className="apl-catpick-name">Landed residential</div>
                <div className="apl-catpick-desc">Terraces, semi-Ds and bungalows on their own lots.</div>
                <div className="apl-catpick-stats"><b>{landedSlugs.size}</b> projects · <b>{lndDeals}</b> deals</div>
                <span className="apl-catpick-cta" style={{ color: dir.color }}>{landedSlugs.size ? "View →" : "None tracked yet"}</span>
              </button>
              <button className="apl-catpick" style={{ borderTopColor: dir.color }} onClick={() => setSelCat("retail")} disabled={!retailSlugs.size}>
                <div className="apl-catpick-ico">🏬</div>
                <div className="apl-catpick-name">Retail shop / office</div>
                <div className="apl-catpick-desc">Shoplots and office units, 2- and 3-storey.</div>
                <div className="apl-catpick-stats"><b>{retailSlugs.size}</b> projects · <b>{rtlDeals}</b> deals</div>
                <span className="apl-catpick-cta" style={{ color: dir.color }}>{retailSlugs.size ? "View →" : "None tracked yet"}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ===== LEVEL 3 — direction + category → projects, 30 free transactions =====
    const catDeals = dirDeals.filter(d => { const p = window.JB_PROJECTS.find(x => x.slug === d.slug); return p && catOf(p) === selCat; });
    const allProjSlugs = [...new Set(catDeals.map(d => d.slug))];
    const pq = projQuery.trim().toLowerCase();
    const projSlugs = pq
      ? allProjSlugs.filter(s => { const p = window.JB_PROJECTS.find(x => x.slug === s); return p && (p.name.toLowerCase().includes(pq) || p.corridor.toLowerCase().includes(pq) || (p.developer || "").toLowerCase().includes(pq)); })
      : allProjSlugs;
    const ds = window.dealsSummary(catDeals);
    const catLabel = selCat === "apartment" ? "Service apartment / condo" : selCat === "retail" ? "Retail shop / office" : "Landed residential";
    const PER_PROJECT = 5; // locked preview: 5 per project; submit unlocks the full 22+

    return (
      <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
        {modal && <SubmitDealModal presetProject={modalProject} onClose={() => setModal(false)} onDone={afterSubmit} />}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 28px 100px" }}>
          <button className="apl-back-link" onClick={() => { setSelCat(null); setProjQuery(""); }}>‹ {dir.compass} categories</button>

          {/* selected direction banner */}
          <div className="apl-deal-banner" style={{ borderColor: dir.color, marginTop: 14, marginBottom: 14 }}>
            <div className="apl-deal-banner-art" dangerouslySetInnerHTML={{ __html: window.AplImg.directionScene(dir.id, dir.color) }} />
            <div className="apl-deal-banner-body">
              <div className="apl-deal-banner-top">
                <span className="apl-deal-banner-dot" style={{ background: dir.color }}></span>
                <span className="apl-deal-banner-compass" style={{ color: dir.color }}>{dir.compass}</span>
                <span className="apl-deal-banner-district">{dir.district}</span>
              </div>
              <div className="apl-deal-banner-areas">{dir.areas}</div>
              <div className="apl-deal-banner-stats">
                <span className="apl-deal-cat-tag">{catLabel}</span><span className="sep">·</span>
                <span><b>{projSlugs.length}</b> projects</span><span className="sep">·</span>
                <span><b>{ds.count}</b> deals</span>
              </div>
            </div>
            {unlocked
              ? <span className="apl-contrib-badge" style={{ alignSelf: "center", marginRight: 18 }}><span className="dot"></span>Full access</span>
              : null}
          </div>

          {/* map of all projects in this direction + category */}
          <CatMap projSlugs={allProjSlugs} dir={dir} onPick={onPick} />

          {/* search projects within this direction + category */}
          <div className="apl-projsearch-wrap">
            <div className="apl-projsearch">
              <span className="apl-projsearch-ico">⌕</span>
              <input className="apl-projsearch-input" placeholder={"Search projects in " + dir.compass + " (name, area or developer)…"}
                value={projQuery}
                onChange={e => { setProjQuery(e.target.value); setProjOpen(true); }}
                onFocus={() => setProjOpen(true)}
                onBlur={() => setTimeout(() => setProjOpen(false), 160)} />
              {projQuery && <button className="apl-projsearch-clear" onClick={() => { setProjQuery(""); setProjOpen(false); }}>✕</button>}
            </div>
            {projOpen && (
              <div className="apl-projsearch-list">
                {projSlugs.length === 0 && <div className="apl-projsearch-listempty">No projects match “{projQuery}”.</div>}
                {projSlugs.map(slug => {
                  const p = window.JB_PROJECTS.find(x => x.slug === slug);
                  if (!p) return null;
                  const n = catDeals.filter(d => d.slug === slug).length;
                  return (
                    <button key={slug} className="apl-projsearch-item" onMouseDown={() => onPick && onPick(p)}>
                      <span className="apl-projsearch-item-name">{p.name}</span>
                      <span className="apl-projsearch-item-meta">{p.developer} · {p.corridor}</span>
                      <span className="apl-projsearch-item-n">{n} deal{n !== 1 ? "s" : ""} ›</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {pq && <div className="apl-projsearch-count">{projSlugs.length} of {allProjSlugs.length} projects match “{projQuery}”.</div>}

          {/* projects in this direction + category */}
          <div className="apl-projdeals">
            {projSlugs.length === 0 && (
              <div className="apl-projsearch-empty">No projects match “{projQuery}” here. <button className="apl-linkbtn" onClick={() => setProjQuery("")}>Clear search</button></div>
            )}
            {projSlugs.map(slug => {
              const proj = window.JB_PROJECTS.find(p => p.slug === slug);
              const pdeals = catDeals.filter(d => d.slug === slug);
              const take = unlocked ? pdeals.length : Math.min(pdeals.length, PER_PROJECT);
              const shown = pdeals.slice(0, take);
              const hidden = pdeals.length - shown.length;
              if (!shown.length && !unlocked) {
                // budget exhausted — show a locked stub row instead of an empty table
                return (
                  <section key={slug} className="apl-projdeal">
                    <div className="apl-projdeal-head">
                      <div>
                        <div className="apl-projdeal-name">{proj ? proj.name : slug}</div>
                        <div className="apl-projdeal-meta">{proj ? (proj.developer + " · " + proj.corridor + " · " + proj.dType) : ""}</div>
                      </div>
                      <div className="apl-projdeal-headstats">
                        <span>avg net <b style={{ color: "var(--apl-teal)" }}>{proj ? fmtRM(Math.round((proj.netMin + proj.netMax) / 2)) : "—"}</b></span>
                        <span className="apl-projdeal-rec">{pdeals.length} record{pdeals.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <button className="apl-projdeal-more locked" onClick={() => openModal(proj)}>
                      🔒 {pdeals.length} transaction{pdeals.length !== 1 ? "s" : ""} hidden · submit a deal to unlock
                    </button>
                  </section>
                );
              }
              return (
                <section key={slug} className="apl-projdeal">
                  <div className="apl-projdeal-head">
                    <div>
                      <div className="apl-projdeal-name">{proj ? proj.name : slug}</div>
                      <div className="apl-projdeal-meta">{proj ? (proj.developer + " · " + proj.corridor + " · " + proj.dType) : ""}</div>
                    </div>
                    <div className="apl-projdeal-headstats">
                      <span>avg net <b style={{ color: "var(--apl-teal)" }}>{proj ? fmtRM(Math.round((proj.netMin + proj.netMax) / 2)) : "—"}</b></span>
                      <span className="apl-projdeal-rec">{pdeals.length} record{pdeals.length !== 1 ? "s" : ""}</span>
                      <button className="apl-btn apl-btn-secondary apl-btn-sm" onClick={() => proj && onPick && onPick(proj)}>View project →</button>
                    </div>
                  </div>
                  <div className="apl-deal-tablewrap">
                    <table className="apl-deal-table">
                      <thead>
                        <tr><th>Date</th><th>Txn</th><th>Unit</th><th className="num">Size</th><th className="num">SPA</th><th className="num">Net</th><th className="num">Disc.</th><th>Source</th></tr>
                      </thead>
                      <tbody>
                        {shown.map(d => (
                          <tr key={d.id} onClick={() => proj && onPick && onPick(proj)}>
                            <td className="mono">{d.date}</td>
                            <td className="muted">{d.txn}</td>
                            <td><span className="apl-unit-pill">{d.unit}</span></td>
                            <td className="num mono">{d.size.toLocaleString()}</td>
                            <td className="num mono">{fmtFull(d.spa * 1000)}</td>
                            <td className="num mono net">{fmtFull(d.net * 1000)}</td>
                            <td className="num mono disc">−{d.discount}%</td>
                            <td><span className={"apl-src-tag " + d.source.toLowerCase()}>{d.source}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>

          {/* direction+category gate */}
          {!unlocked && (
            <div className="apl-deal-gate standalone" style={{ marginTop: 24 }}>
              <div className="apl-deal-gate-card">
                <div className="apl-deal-gate-lock">🔒</div>
                <h3 className="apl-deal-gate-title">Want every {catLabel.toLowerCase()} deal in {dir.compass}?</h3>
                <p className="apl-deal-gate-sub">You're seeing the first <b>{FREE_TXNS}</b> transactions free. Add one of your own JB deals to unlock all <b>{ds.count}</b> records here — and across every direction.</p>
                <button className="apl-btn apl-btn-primary apl-btn-large" onClick={() => openModal(null)}>Submit my deal to unlock full data →</button>
                <p className="apl-deal-gate-note">Shared, anonymised JB deals · research only, not a sales portal.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function CatMap({ projSlugs, dir, onPick }) {
    const elRef = eR(null);
    const mapRef = eR(null);
    const pickRef = eR(onPick);
    pickRef.current = onPick;
    eE(() => {
      if (mapRef.current || !window.L || !elRef.current || !projSlugs.length) return;
      const L = window.L;
      const projs = projSlugs.map(s => window.JB_PROJECTS.find(p => p.slug === s)).filter(Boolean);
      const pts = projs.map(p => ({ p, ll: window.projectLatLng(p) }));
      const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true }).setView(pts[0].ll, 12);
      mapRef.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd", maxZoom: 20, crossOrigin: true, attribution: "&copy; OpenStreetMap &copy; CARTO",
      }).addTo(map);
      const color = dir.color || "#00b894";
      const precise = window.JB_GEO.preciseCoords || [];
      const group = [];
      pts.forEach(({ p, ll }) => {
        const isPrecise = precise.indexOf(p.slug) !== -1;
        const sz = isPrecise ? 18 : 14;
        const op = isPrecise ? 1 : 0.62;
        const bw = isPrecise ? 2.5 : 1.5;
        const icon = L.divIcon({
          className: "apl-projpin",
          html: `<div style="width:${sz}px;height:${sz}px;border-radius:50% 50% 50% 0;background:${color};opacity:${op};transform:rotate(-45deg);border:${bw}px solid #fff;box-shadow:0 2px 7px rgba(0,0,0,0.30);"></div>`,
          iconSize: [sz, sz], iconAnchor: [sz / 2, sz],
        });
        const avgNet = Math.round((p.netMin + p.netMax) / 2);
        const recs = (p.submissions && p.submissions.length) || p.records || 0;
        const tag = isPrecise ? "" : `<span style="color:#9a8f80;font-size:10px;"> · approx</span>`;
        const popup = `<div class="apl-projpop"><b>${p.name}</b>${tag}<br><span style="color:#6b6459;font-size:11px;">${p.corridor}</span><br><span style="font-size:12px;">avg net <b>RM ${avgNet}k</b> · ${recs} record${recs !== 1 ? "s" : ""}</span><br><a href="#" data-slug="${p.slug}" class="apl-projpop-link" style="color:${color};font-weight:600;font-size:12px;">View project ›</a></div>`;
        L.marker(ll, { icon, opacity: 1 }).addTo(map)
          .bindTooltip(p.name, { direction: "top", offset: [0, -sz] })
          .bindPopup(popup);
        group.push(ll);
      });
      map.on("popupopen", (e) => {
        const link = e.popup.getElement().querySelector(".apl-projpop-link");
        if (!link) return;
        link.onclick = (ev) => {
          ev.preventDefault();
          const proj = window.JB_PROJECTS.find(x => x.slug === link.dataset.slug);
          if (proj && pickRef.current) pickRef.current(proj);
        };
      });
      if (group.length > 1) map.fitBounds(group, { padding: [40, 40], maxZoom: 14 });
      setTimeout(() => map.invalidateSize(), 200);
    }, []);
    if (!projSlugs.length) return null;
    return (
      <div style={{ marginBottom: 24 }}>
        <div ref={elRef} className="apl-leaflet" style={{ height: 300, borderRadius: 16, overflow: "hidden", border: "1px solid var(--apl-line)" }}></div>
        <p className="apl-subs-note" style={{ marginTop: 8 }}>{projSlugs.length} project{projSlugs.length !== 1 ? "s" : ""} in {dir.compass}. Faded pins are approximate (township centroid); solid pins are verified locations.</p>
      </div>
    );
  }

  function FilterSel({ label, value, onChange, opts, disabled }) {
    return (
      <label className="apl-filter">
        <span className="apl-filter-lab">{label}</span>
        <select className="apl-filter-sel" value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
          {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
    );
  }

  Object.assign(window, { ExploreDealsView, SubmitDealModal });
})();
