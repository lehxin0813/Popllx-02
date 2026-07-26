// PropX — Resources tab: amenity / infrastructure news feed.
// Each entry links an amenity or infra development to the directions, districts
// and projects it affects — and can update neighbourhood fields downstream.

(function () {
  const { useState: rS } = React;

  const AMENITY_ICON = {
    mall: "Ml", supermarket: "Sm", school: "Sc", university: "Un", hospital: "Hs",
    clinic: "Cl", park: "Pk", recreation: "Rc", transport: "Tr", "JS-SEZ": "Ez", infrastructure: "In",
  };

  const RESOURCES = [
    { id: 1, type: "mall", name: "New Bukit Indah lifestyle mall", direction: "west", district: "Iskandar Puteri District",
      affects: ["Horizon Hills", "Bukit Indah", "Nusa Bestari"], status: "Under construction", date: "Q4 2026",
      note: "New mall in Bukit Indah likely to improve retail convenience and rentals for Horizon Hills, Bukit Indah and Nusa Bestari." },
    { id: 2, type: "transport", name: "RTS Link Bukit Chagar terminal", direction: "south-core", district: "Johor Bahru District",
      affects: ["R&F Princess Cove", "The Astaka", "Suasana Iskandar"], status: "Under construction", date: "Jan 2027",
      note: "Cross-border rail terminal at Bukit Chagar; expected to lift demand and rents across the CIQ waterfront cluster on completion." },
    { id: 3, type: "JS-SEZ", name: "Sedenak Tech Park expansion (JS-SEZ)", direction: "north", district: "Kulai District",
      affects: ["Bandar Putra Kulai", "Indahpura", "Senai Airport City"], status: "Announced", date: "2026–2028",
      note: "Special Economic Zone industrial expansion near Senai; a medium-term driver of tenant demand for the Kulai corridor." },
    { id: 4, type: "hospital", name: "Gleneagles Medini bed expansion", direction: "west", district: "Iskandar Puteri District",
      affects: ["Teega Suites", "Meridin Medini", "Forest City Phoenix"], status: "Completed", date: "Mar 2026",
      note: "Specialist capacity expansion at Gleneagles Medini improves healthcare access scores for the Nusajaya / Medini cluster." },
    { id: 5, type: "school", name: "Austin international school campus", direction: "east", district: "Johor Bahru District",
      affects: ["Austin Heights", "Mount Austin", "Setia Tropika"], status: "Completed", date: "Feb 2026",
      note: "New international campus strengthens the family-township appeal of the Tebrau corridor." },
    { id: 6, type: "transport", name: "Coastal Highway Southern Link", direction: "south-core", district: "Johor Bahru District",
      affects: ["Danga Bay", "Country Garden Danga Bay"], status: "Under construction", date: "2027",
      note: "Southern link improves Danga Bay connectivity to the CBD and Second Link; watch for travel-time improvements." },
    { id: 7, type: "supermarket", name: "AEON Seri Alam refurbishment", direction: "south-east", district: "Pasir Gudang District",
      affects: ["Bandar Seri Alam", "Masai"], status: "Completed", date: "Apr 2026",
      note: "Refurbished AEON anchor lifts everyday retail convenience for the Pasir Gudang / Masai belt." },
    { id: 8, type: "infrastructure", name: "Pasir Gudang air-quality monitoring upgrade", direction: "south-east", district: "Pasir Gudang District",
      affects: ["Taman Scientex", "Pasir Gudang"], status: "Announced", date: "2026",
      note: "Expanded monitoring around the industrial belt; relevant to flood-risk and industrial-exposure fields for nearby projects." },
    { id: 9, type: "policy", name: "Federal 10% home-purchase discount during AREC 2026", direction: "any", district: "Federal (nationwide, applies in Johor)",
      affects: ["All KPKT / REHDA participating developers"], status: "Announced", date: "29 Jul – 1 Aug 2026",
      source: "The Star (2 Jul 2026)",
      sourceUrl: "https://www.thestar.com.my/news/nation/2026/07/02/govt-offers-10-home-purchase-discount-during-asean-real-estate-conference-2026",
      note: "KPKT and REHDA are offering a 10% discount on home purchases during the ASEAN Real Estate Conference (AREC) 2026 at MITEC. Aims to ease the 10% SPA deposit burden. PM Anwar to officiate; National Housing Policy launches 30 Jul. Buyers signing an SPA during the event window should confirm eligibility with the developer, as some JB launches are expected to participate." },
  ];

  // News cards — clickable rows with 2–3 bullets + source link.
  const NEWS = [
    { cat: "transport", head: "RTS Link 90% done — opens Jan 2027", when: "Apr 2026",
      bullets: ["JB to Singapore in 5 minutes by rail", "10,000 passengers per hour each way", "Rent near Bukit Chagar already up ~12%"],
      url: "https://en.wikipedia.org/wiki/Johor_Bahru%E2%80%93Singapore_Rapid_Transit_System", src: "wikipedia.org" },
    { cat: "transport", head: "RM 2.6B Bukit Chagar hub starts building", when: "Feb 2026",
      bullets: ["Sunway + MRT Corp project next to RTS station", "Towers, mall, health centre, 1,550-car park-and-ride", "First phase (parking) opens Nov 2026"],
      url: "https://bernama.com/en/news.php?id=2392074", src: "bernama.com" },
    { cat: "transport", head: "KL–JB electric train now running", when: "Jun 2026",
      bullets: ["KL to JB cut from 7 hours to 4 hours", "Two trains already in service", "10 more trains ordered, worth RM 200M+"],
      url: "https://www.nst.com.my/amp/business/corporate/2026/06/1473836/road-and-rail-infrastructure-projects-fuel-johors-economic", src: "nst.com.my" },
    { cat: "transport", head: "E-ART elevated rail still at tender stage", when: "Jun 2026",
      bullets: ["Would connect RTS Bukit Chagar to Senai Airport", "Could start construction 2026", "No contractor selected yet — still a plan"],
      url: "https://jssezmonitor.substack.com/p/rts-without-a-city-johor-bahrus-missing", src: "jssezmonitor.substack.com" },
    { cat: "transport", head: "RM 200M road upgrades around RTS", when: "2026–2027",
      bullets: ["Flyovers on Jalan Tebrau and Jalan Tun Razak", "Direct RTS access from major roads"],
      url: "https://bernama.com/en/news.php?id=2392074", src: "bernama.com" },
    { cat: "mall", head: "SKS City Mall JBCC opened", when: "May 2026",
      bullets: ["280,000 sqft under Sheraton hotel", "4 minutes from JB checkpoint", "Tenants: KKV, Village Grocer, Matsumoto Kiyoshi"],
      url: "https://thesmartlocal.com/read/new-jb-malls/", src: "thesmartlocal.com" },
    { cat: "mall", head: "Horizon Mall opening in Iskandar Puteri", when: "Mid–late 2026",
      bullets: ["150,000 sqft green mall near LEGOLAND", "Open-air design with gardens", "10 minutes from Second Link"],
      url: "https://www.timeout.com/singapore/news/horizon-mall-new-greenery-filled-shopping-mall-in-johor-bahru-to-open-in-2026-050826", src: "timeout.com" },
    { cat: "mall", head: "JB City Square expanding to 300+ shops", when: "Q4 2027",
      bullets: ["Adding 15,000 sqft Kids Adventure Park", "Adding 41,300 sqft Health & Wellness Hub", "Hotel apartments above, done Q2 2028"],
      url: "https://sethlui.com/upcoming-malls-johor-bahru-malaysia-dec-2025/", src: "sethlui.com" },
    { cat: "hospital", head: "KPJ Heart & Lung Centre with Mayo Clinic", when: "Jan 2026",
      bullets: ["First Centre of Excellence at KPJ Johor Specialist Hospital", "Collaboration with Mayo Clinic Global Consulting", "First of 15 CoEs planned by 2030"],
      url: "https://www.prnewswire.com/apac/news-releases/kpj-healthcare-launches-first-centre-of-excellence-at-johor-specialist-hospital-302629097.html", src: "prnewswire.com" },
    { cat: "policy", head: "10% home discount during AREC 2026", when: "Jul 2026",
      bullets: ["KPKT + REHDA offering 10% off during ASEAN Real Estate Conference", "Event: 29 Jul – 1 Aug 2026 at MITEC", "Ask your developer if they're participating"],
      url: "https://www.thestar.com.my/news/nation/2026/07/02/govt-offers-10-home-purchase-discount-during-asean-real-estate-conference-2026", src: "thestar.com.my" },
    { cat: "market", head: "JB prices up 5.3%/yr — 5× national average", when: "Mar 2026",
      bullets: ["Fastest-rising: Bukit Chagar 8–10%, Medini 7–9%, Mt Austin 6–8%", "Transaction volumes up 16%, total value up 36%"],
      url: "https://www.businesstoday.com.my/2026/03/17/johor-named-malaysias-top-property-investment-hotspot-for-2026/", src: "businesstoday.com.my" },
    { cat: "market", head: "JB named #1 property investment spot 2026", when: "Mar 2026",
      bullets: ["Ranked by Juwai IQI, March 2026", "RM 400k property projected to reach RM 530k by 2031"],
      url: "https://www.klpropertytalk.com/2026/03/why-johor-is-malaysias-2026-investment-apex/", src: "klpropertytalk.com" },
    { cat: "policy", head: "Foreign stamp duty doubled to 8%", when: "Jan 2026",
      bullets: ["From January 2026 (was 4%)", "All non-citizens affected", "PRs are exempt"],
      url: "https://ringgitplus.com/en/blog/budget-2026/budget-2026-stamp-duty-exemptions-extended-for-homebuyers.html", src: "ringgitplus.com" },
    { cat: "policy", head: "Johor foreign levy now 3% (min RM 30k)", when: "Jul 2025",
      bullets: ["From July 2025", "Serviced apartments below RM 1M: minimum RM 50k", "Lower than Singapore's ABSD"],
      url: "https://hhq.com.my/posts/johor-property-boom-the-new-property-legal-tax-framework-for-foreign-acquisitions/", src: "hhq.com.my" },
    { cat: "policy", head: "RPGT 30% for foreigners (first 5 years)", when: "Current",
      bullets: ["Drops to 10% from year 6 onwards", "No exemption for foreigners", "Plan for a 6+ year hold"],
      url: "https://propcashflow.my/blog/johor-bahru-property-investment-guide-singaporean/", src: "propcashflow.my" },
    { cat: "policy", head: "Foreigners: RM 1M minimum (except Medini)", when: "Current",
      bullets: ["Applies across all of Johor", "Only exception: Medini zone has no minimum price", "Good entry point for Singaporean buyers on a budget"],
      url: "https://www.iproperty.com.my/guides/foreigners-buying-property-malaysia-complete-guide-12332", src: "iproperty.com.my" },
    { cat: "policy", head: "Rental income tax 30% for non-residents", when: "Current",
      bullets: ["Flat rate for non-Malaysian landlords", "Can deduct: maintenance, assessment, insurance, repairs, agent fees", "File via Form M (non-resident individual)"],
      url: "https://propcashflow.my/blog/johor-bahru-property-investment-guide-singaporean/", src: "propcashflow.my" },
  ];
  const CAT_LABEL = { transport: "Transport", mall: "Mall", hospital: "Hospital", policy: "Policy", market: "Market" };

  function ResourcesNews({ onPick, onBack }) {
    const infraCats = ["transport", "mall", "hospital"];
    const infra = NEWS.filter(n => infraCats.includes(n.cat) || n.head.includes("AREC"));
    const policy = NEWS.filter(n => !infra.includes(n));
    const NewsCard = ({ n }) => (
      <a href={n.url} target="_blank" rel="noopener noreferrer" className="apl-news-card">
        <div className="apl-news-top">
          <span className={"apl-news-pill cat-" + n.cat}>{CAT_LABEL[n.cat]}</span>
          <span className="apl-news-when">{n.when}</span>
        </div>
        <div className="apl-news-head">{n.head}</div>
        <ul className="apl-news-bullets">
          {n.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
        <div className="apl-news-src">{n.src} <span className="apl-news-arrow">→</span></div>
      </a>
    );
    return (
      <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 28px 100px" }}>
          <button className="apl-back-link" onClick={onBack}>‹ Resources</button>
          <div className="apl-res-checked">Last checked: July 2026</div>
          <div className="apl-eyebrow">What's changing</div>
          <h1 className="apl-h2" style={{ marginBottom: 12 }}>What's changing around JB.</h1>
          <p className="apl-lead" style={{ marginTop: 0, marginLeft: 0, fontSize: 17, maxWidth: 640 }}>
            Things happening now that could affect your property. Tap any card to read the source.
          </p>

          <div className="apl-ref-sec-head"><h2 className="apl-ref-sec-title">What's changing</h2></div>
          <div className="apl-news-list">{infra.map((n, i) => <NewsCard key={i} n={n} />)}</div>

          <div className="apl-ref-sec-head"><h2 className="apl-ref-sec-title">Market &amp; policy</h2></div>
          <div className="apl-news-list">{policy.map((n, i) => <NewsCard key={i} n={n} />)}</div>
        </div>
      </div>
    );
  }

  // ── Resources hub: two cards → news feed or incentives finder ──
  function ResourcesView({ onPick }) {
    const [view, setView] = rS("hub"); // hub | news | incentives

    if (view === "news") return <ResourcesNews onPick={onPick} onBack={() => setView("hub")} />;
    if (view === "incentives") return <window.IncentiveFinder onExit={() => setView("hub")} />;

    const newsCount = "17 updates · tap any card to read the source";
    const incCount = (window.INCENTIVES || []).length;

    return (
      <div style={{ minHeight: "70vh", background: "var(--apl-bg)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 28px 100px" }}>
          <div className="apl-eyebrow">Resources</div>
          <h1 className="apl-h2" style={{ marginBottom: 12 }}>Two ways to get ahead on your JB home.</h1>
          <p className="apl-lead" style={{ marginTop: 0, marginLeft: 0, fontSize: 17, maxWidth: 640 }}>
            Understand what's reshaping the market — and find the money-saving incentives you personally qualify for.
          </p>

          <div className="apl-res-hub">
            <button className="apl-res-tile a" onClick={() => setView("news")}>
              <div className="apl-res-tile-ico">◷</div>
              <div className="apl-res-tile-body">
                <div className="apl-res-tile-kicker">What's changing</div>
                <h2 className="apl-res-tile-title">See what's reshaping JB.</h2>
                <p className="apl-res-tile-desc">RTS, new malls, policy changes — and how they affect your property.</p>
                <span className="apl-res-tile-meta">{newsCount}</span>
              </div>
              <span className="apl-res-tile-cta">Explore updates →</span>
            </button>

            <button className="apl-res-tile b" onClick={() => setView("incentives")}>
              <div className="apl-res-tile-ico">RM</div>
              <div className="apl-res-tile-body">
                <div className="apl-res-tile-kicker">Incentives for JB buyers</div>
                <h2 className="apl-res-tile-title">Find money you could save.</h2>
                <p className="apl-res-tile-desc">Stamp duty exemptions, loan help, and developer deals — see what applies to you.</p>
                <span className="apl-res-tile-meta">{incCount} incentives</span>
              </div>
              <span className="apl-res-tile-cta gold">Find my incentives →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { ResourcesView, ResourcesNews, RESOURCES });
})();
