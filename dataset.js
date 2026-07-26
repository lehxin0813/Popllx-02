// PropX — unified JB dataset
// Every aggregate + listing in the app computes from THIS file (all projects,
// never a hero subset). Prices are in RM thousands (442 = RM 442k, 1465 = RM 1.465M).
//
// Five cardinal DIRECTIONS map 1:1 onto the five market zones in geo.js.
// Each PROJECT carries: direction, corridor, propertyType, price + discount,
// gross yield (if rent data), records, trust, and a structured neighbourhood
// profile ("Google review, but structured for property").

(function () {

  // ── Cardinal directions (1:1 with geo zones) ───────────────────
  const DIRECTIONS = [
    { id: "south-core", zoneId: "city-waterfront", compass: "South / Core",
      heading: "South / Core · Johor Bahru District (city core)",
      district: "Johor Bahru District",
      areas: "JB City Centre · Bukit Chagar · Stulang · Danga Bay · Pelangi · Larkin · Sentosa",
      character: "Waterfront and CBD high-rises with strong Singapore commuter focus.",
      color: "#1f5c52" },
    { id: "east", zoneId: "eastern-midring", compass: "East",
      heading: "East · Johor Bahru District (Tebrau / Plentong belt)",
      district: "Johor Bahru District",
      areas: "Molek · Johor Jaya · Taman Daya · Mount Austin · Desa Tebrau · Permas · Masai · Seri Alam",
      character: "Family townships with malls, schools, and mid-range condos.",
      color: "#2a6fdb" },
    { id: "west", zoneId: "western-iskandar", compass: "West",
      heading: "West · Iskandar Puteri District",
      district: "Iskandar Puteri District",
      areas: "Medini · Puteri Harbour · Horizon Hills · Bukit Indah · Nusa Bestari · Nusajaya · Gelang Patah",
      character: "Masterplanned golf, waterfront and Legoland belt with large launch cohorts.",
      color: "#7a5cc9" },
    { id: "south-east", zoneId: "eastern-industrial", compass: "South-East",
      heading: "South-East · Pasir Gudang District",
      district: "Pasir Gudang District",
      areas: "Pasir Gudang · Tanjung Langsat · Taman Scientex · Masai industrial belt",
      character: "Port and industry; yield-led, tenant pool tied to employment nodes.",
      color: "#c2872e" },
    { id: "north", zoneId: "northern", compass: "North",
      heading: "North · Kulai District",
      district: "Kulai District",
      areas: "Skudai · Taman Universiti · Senai · Kulai · Sedenak",
      character: "Airport and logistics belt; earliest-stage market, cheapest entry.",
      color: "#b0473a" },
  ];

  const PROP_TYPES = [
    "Terrace (2/3-storey)",
    "Semi-D",
    "Bungalow",
    "Shop (2/3-storey)",
    "Service apartment / condo",
  ];

  // ── Neighbourhood profile factory ──────────────────────────────
  // Compact but structured; the summary strip + detail panel read these.
  function nb(o) {
    return Object.assign({
      schools: "—", mall: "—", mallMins: null, parks: "—",
      hospital: "—", hospitalMins: null, highway: "—", ciqMins: null,
      busStop: false, supermarket: "—",
      safety: 4.0, safetyN: 12, noise: "moderate", flood: "low", industrial: "none",
    }, o);
  }

  // ── Projects (full coverage across directions + property types) ─
  // Helper rows: [slug, name, developer, corridor, type, netMin, netMax, disc, records, yield, nb]
  const D = {
    sc: "south-core", e: "east", w: "west", se: "south-east", n: "north",
  };

  const PROJECTS = [
    // ── SOUTH / CORE ───────────────────────────────────────────
    p("rf-princess-cove", "R&F Princess Cove", "R&F Properties", D.sc, "JB City Core / CIQ", "Service apartment / condo", 442, 762, 18, 6, 4.3,
      nb({ schools: "2 within 1.5km", mall: "KSL City Mall", mallMins: 6, parks: "Lido waterfront 600m", hospital: "KPJ JB", hospitalMins: 9, highway: "EDL / Tebrau", ciqMins: 5, busStop: true, supermarket: "KSL hypermarket", safety: 4.1, safetyN: 37, noise: "moderate", flood: "low", industrial: "none" })),
    p("the-astaka", "The Astaka", "Astaka Holdings", D.sc, "JB City Core / CIQ", "Service apartment / condo", 1465, 2720, 11, 3, 3.4,
      nb({ schools: "3 within 2km", mall: "Johor Bahru City Square", mallMins: 4, parks: "Istana Gardens 1.2km", hospital: "KPJ JB", hospitalMins: 7, highway: "EDL", ciqMins: 4, busStop: true, supermarket: "City Square", safety: 4.4, safetyN: 21, noise: "quiet", flood: "none", industrial: "none" })),
    p("suasana-iskandar", "Suasana Iskandar", "UMLand", D.sc, "JB City Core / CIQ", "Service apartment / condo", 615, 798, 16, 2, 4.0,
      nb({ schools: "2 within 1km", mall: "Komtar JBCC", mallMins: 5, parks: "Merdeka park 900m", hospital: "Hospital Sultanah Aminah", hospitalMins: 8, highway: "Jln Wong Ah Fook", ciqMins: 6, busStop: true, supermarket: "Komtar", safety: 4.0, safetyN: 18, noise: "moderate", flood: "low", industrial: "none" })),
    p("country-garden-danga-bay", "Country Garden Danga Bay", "Country Garden", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 388, 845, 25, 3, 4.6,
      nb({ schools: "1 within 2km", mall: "The Mall Mid Valley Southkey", mallMins: 12, parks: "Danga Bay promenade adjacent", hospital: "Gleneagles Medini", hospitalMins: 18, highway: "Coastal Highway", ciqMins: 12, busStop: true, supermarket: "Danga City Mall", safety: 3.8, safetyN: 44, noise: "moderate", flood: "low", industrial: "none" })),
    // TODO: verify real project / developer
    p("seri-austin-shoppes", "Seri Austin Shoppes", "Tiland Group", D.e, "Tebrau Corridor", "Shop (2/3-storey)", 1280, 2350, 9, 2, 5.2,
      nb({ schools: "—", mall: "Mid Valley Southkey", mallMins: 9, parks: "—", hospital: "KPJ JB", hospitalMins: 10, highway: "EDL", ciqMins: 8, busStop: true, supermarket: "Lotus's", safety: 3.9, safetyN: 8, noise: "noisy", flood: "low", industrial: "none" })),

    // ── EAST (Tebrau / Plentong) ───────────────────────────────
    p("austin-perdana-terrace", "Austin Perdana", "Tebrau Land", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 720, 980, 12, 4, 3.6,
      nb({ schools: "4 within 2km", mall: "AEON Tebrau City", mallMins: 6, parks: "Austin Heights park 500m", hospital: "Hospital Sultan Ismail", hospitalMins: 8, highway: "Tebrau Hwy", ciqMins: 22, busStop: true, supermarket: "AEON", safety: 4.2, safetyN: 53, noise: "quiet", flood: "low", industrial: "none" })),
    // TODO: verify real project / developer
    p("mount-austin-semid", "Austin Heights Semi-D", "IBraco", D.e, "Tebrau Corridor", "Semi-D", 1150, 1880, 10, 3, 3.1,
      nb({ schools: "5 within 2km (incl. Austin Intl)", mall: "AEON Tebrau City", mallMins: 7, parks: "Austin Heights golf 1km", hospital: "Hospital Sultan Ismail", hospitalMins: 9, highway: "Tebrau Hwy", ciqMins: 23, busStop: false, supermarket: "AEON", safety: 4.4, safetyN: 31, noise: "quiet", flood: "none", industrial: "none" })),
    p("setia-tropika-bungalow", "Setia Tropika Bungalow", "SP Setia", D.e, "Tebrau Corridor", "Bungalow", 2200, 3900, 8, 2, 2.6,
      nb({ schools: "3 within 3km", mall: "Setia Tropika Shoppes", mallMins: 5, parks: "Setia central park adjacent", hospital: "Hospital Sultan Ismail", hospitalMins: 12, highway: "Tebrau Hwy", ciqMins: 25, busStop: false, supermarket: "Jaya Grocer", safety: 4.6, safetyN: 22, noise: "quiet", flood: "none", industrial: "none" })),
    p("molek-pine-condo", "Molek Pine", "Mutiara Rini", D.e, "Permas / Molek", "Service apartment / condo", 480, 760, 14, 3, 4.4,
      nb({ schools: "4 within 1.5km", mall: "Plaza Pelangi", mallMins: 8, parks: "Molek lake park 700m", hospital: "Regency Specialist", hospitalMins: 10, highway: "Pasir Gudang Hwy", ciqMins: 18, busStop: true, supermarket: "Pelangi Leisure Mall", safety: 4.1, safetyN: 40, noise: "moderate", flood: "low", industrial: "none" })),

    // ── WEST (Iskandar Puteri) ─────────────────────────────────
    p("teega-suites", "Teega Suites", "UEM Sunrise", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 565, 998, 13, 4, 4.1,
      nb({ schools: "EduCity 4km", mall: "Puteri Harbour Mall", mallMins: 5, parks: "Puteri Harbour marina park", hospital: "Gleneagles Medini", hospitalMins: 8, highway: "Coastal Hwy", ciqMins: 20, busStop: true, supermarket: "Mall of Medini", safety: 4.3, safetyN: 27, noise: "quiet", flood: "none", industrial: "none" })),
    p("forest-city-phoenix", "Forest City Phoenix", "Country Garden", D.w, "Bukit Indah / Gelang Patah", "Service apartment / condo", 380, 522, 28, 2, 5.1,
      nb({ schools: "Forest City intl school on-site", mall: "Forest City mall", mallMins: 3, parks: "Beachfront promenade", hospital: "Gleneagles Medini", hospitalMins: 15, highway: "Second Link", ciqMins: 28, busStop: true, supermarket: "Forest City retail", safety: 3.6, safetyN: 33, noise: "quiet", flood: "low", industrial: "none" })),
    p("horizon-hills-semid", "Horizon Hills Semi-D", "Gamuda Land", D.w, "Horizon Hills / Bukit Indah", "Semi-D", 1380, 2400, 9, 3, 3.0,
      nb({ schools: "5 within 3km (incl. intl)", mall: "Bukit Indah AEON", mallMins: 8, parks: "Horizon Hills golf adjacent", hospital: "Gleneagles Medini", hospitalMins: 12, highway: "Second Link", ciqMins: 26, busStop: false, supermarket: "AEON Bukit Indah", safety: 4.7, safetyN: 41, noise: "quiet", flood: "none", industrial: "none" })),
    p("horizon-hills-bungalow", "Horizon Hills Golf Bungalow", "Gamuda Land", D.w, "Horizon Hills / Bukit Indah", "Bungalow", 3200, 5200, 7, 2, 2.4,
      nb({ schools: "intl schools 3km", mall: "Bukit Indah AEON", mallMins: 9, parks: "Golf course frontage", hospital: "Gleneagles Medini", hospitalMins: 13, highway: "Second Link", ciqMins: 27, busStop: false, supermarket: "Village Grocer", safety: 4.8, safetyN: 19, noise: "quiet", flood: "none", industrial: "none" })),
    p("bukit-indah-terrace", "Bukit Indah Terrace", "IOI Properties", D.w, "Horizon Hills / Bukit Indah", "Terrace (2/3-storey)", 680, 1050, 12, 4, 3.7,
      nb({ schools: "4 within 2km", mall: "AEON Bukit Indah", mallMins: 5, parks: "Bukit Indah park 600m", hospital: "Gleneagles Medini", hospitalMins: 14, highway: "Second Link", ciqMins: 25, busStop: true, supermarket: "AEON", safety: 4.4, safetyN: 36, noise: "quiet", flood: "low", industrial: "none" })),
    p("medini-meridin", "Meridin Medini", "Mah Sing", D.w, "Medini core", "Service apartment / condo", 420, 690, 19, 3, 4.5,
      nb({ schools: "EduCity 2km", mall: "Mall of Medini", mallMins: 4, parks: "Medini central park", hospital: "Gleneagles Medini", hospitalMins: 6, highway: "Coastal Hwy", ciqMins: 24, busStop: true, supermarket: "Mall of Medini", safety: 4.2, safetyN: 25, noise: "quiet", flood: "none", industrial: "none" })),

    // ── SOUTH-EAST (Pasir Gudang) ──────────────────────────────
    p("meridin-east-pg", "Meridin East", "Mah Sing", D.se, "Pasir Gudang / Masai", "Service apartment / condo", 320, 490, 17, 2, 5.2, nb({ schools: "3 within 2km", mall: "AEON Seri Alam", mallMins: 8, parks: "Meridin East park", hospital: "Hospital Pasir Gudang", hospitalMins: 12, highway: "Senai-Desaru Expy", ciqMins: 30, busStop: true, supermarket: "Giant Masai", safety: 3.8, safetyN: 9, noise: "moderate", flood: "low", industrial: "high" }), "Completed"),
    p("bandar-seri-alam-terrace", "Bandar Seri Alam Terrace", "UMLand", D.se, "Pasir Gudang / Masai", "Terrace (2/3-storey)", 480, 720, 15, 3, 4.7,
      nb({ schools: "4 within 2km", mall: "AEON Seri Alam", mallMins: 6, parks: "Seri Alam rec park 500m", hospital: "Hospital Pasir Gudang", hospitalMins: 12, highway: "Pasir Gudang Hwy", ciqMins: 28, busStop: true, supermarket: "AEON Seri Alam", safety: 3.9, safetyN: 29, noise: "moderate", flood: "medium", industrial: "moderate" })),
    p("scientex-pasir-gudang", "Taman Scientex Pasir Gudang", "Scientex", D.se, "Pasir Gudang / Masai", "Terrace (2/3-storey)", 380, 560, 14, 4, 5.0,
      nb({ schools: "3 within 1.5km", mall: "Pasir Gudang City Mall", mallMins: 8, parks: "Scientex linear park", hospital: "Hospital Pasir Gudang", hospitalMins: 9, highway: "Senai-Desaru Expy", ciqMins: 32, busStop: true, supermarket: "Lotus's Pasir Gudang", safety: 3.7, safetyN: 21, noise: "moderate", flood: "medium", industrial: "high · note: port-adjacent air quality" })),

    // ── NORTH (Kulai) ──────────────────────────────────────────
    p("bandar-putra-terrace", "Bandar Putra Kulai Terrace", "IOI Properties", D.n, "Senai / Kulai", "Terrace (2/3-storey)", 420, 640, 13, 4, 4.6,
      nb({ schools: "5 within 2km", mall: "AEON Kulai", mallMins: 6, parks: "Bandar Putra central park", hospital: "Kulai Hospital", hospitalMins: 9, highway: "North-South Hwy", ciqMins: 35, busStop: true, supermarket: "AEON Kulai", safety: 4.1, safetyN: 34, noise: "quiet", flood: "low", industrial: "moderate" })),
    p("indahpura-semid", "Indahpura Semi-D", "Gabungan", D.n, "Senai / Kulai", "Semi-D", 720, 1120, 10, 3, 4.0,
      nb({ schools: "3 within 2km", mall: "AEON Kulai", mallMins: 8, parks: "Indahpura park 500m", hospital: "Kulai Hospital", hospitalMins: 11, highway: "Senai Airport link", ciqMins: 33, busStop: false, supermarket: "AEON Kulai", safety: 4.2, safetyN: 18, noise: "quiet", flood: "low", industrial: "moderate" })),

    // ════════ ADDED — township coverage (status: Completed / Ongoing / Future) ════════

    // ── SOUTH / CORE · CIQ City Core (Mukim Bandar JB) ─────────
    p("setia-sky-88", "Setia Sky 88", "SP Setia", D.sc, "JB City Core / CIQ", "Service apartment / condo", 540, 980, 14, 3, 4.0,
      nb({ schools: "2 within 1.5km", mall: "KSL City Mall", mallMins: 5, parks: "Lido waterfront 700m", hospital: "KPJ JB", hospitalMins: 8, highway: "EDL", ciqMins: 6, busStop: true, supermarket: "KSL hypermarket", safety: 4.2, safetyN: 26, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("twin-galaxy-residences", "Twin Galaxy Residences", "MB World", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 480, 820, 16, 3, 4.4,
      nb({ schools: "2 within 1.5km", mall: "Galleria @ Kotaraya", mallMins: 6, parks: "Istana Gardens 1km", hospital: "Hospital Sultanah Aminah", hospitalMins: 7, highway: "EDL", ciqMins: 5, busStop: true, supermarket: "City Square", safety: 4.0, safetyN: 19, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("rf-princess-cove-p2", "R&F Princess Cove · New Casa Suites (Ph 2–3)", "R&F Properties", D.sc, "JB City Core / CIQ", "Service apartment / condo", 430, 720, 20, 2, 4.4,
      nb({ schools: "2 within 1.5km", mall: "KSL City Mall", mallMins: 6, parks: "Lido waterfront 600m", hospital: "KPJ JB", hospitalMins: 9, highway: "EDL", ciqMins: 5, busStop: true, supermarket: "R&F retail podium", safety: 4.1, safetyN: 18, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("mbw-city-veranda-2", "MBW City · Veranda 2", "MB World", D.sc, "JB City Core / CIQ", "Service apartment / condo", 380, 560, 18, 2, 4.7,
      nb({ schools: "3 within 2km", mall: "Mid Valley Southkey", mallMins: 8, parks: "—", hospital: "KPJ JB", hospitalMins: 10, highway: "EDL", ciqMins: 7, busStop: true, supermarket: "Lotus's", safety: 3.9, safetyN: 10, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("causewayz-square-exsim", "Causewayz Square (EXSIM CIQ)", "EXSIM", D.sc, "JB City Core / CIQ", "Service apartment / condo", 500, 780, 15, 2, 4.2,
      nb({ schools: "2 within 1.5km", mall: "Komtar JBCC", mallMins: 4, parks: "Merdeka park 800m", hospital: "Hospital Sultanah Aminah", hospitalMins: 6, highway: "EDL", ciqMins: 3, busStop: true, supermarket: "Komtar", safety: 4.1, safetyN: 7, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("aethera-residence", "Aethera Residence", "UOA", D.sc, "JB City Core / CIQ", "Service apartment / condo", 600, 900, 11, 1, 3.8,
      nb({ schools: "2 within 1.5km", mall: "Komtar JBCC", mallMins: 5, parks: "Bukit Senyum green 500m", hospital: "KPJ JB", hospitalMins: 8, highway: "EDL", ciqMins: 4, busStop: true, supermarket: "City Square", safety: 4.3, safetyN: 3, noise: "quiet", flood: "none", industrial: "none" }), "Future"),
    p("arden-by-astaka", "Arden by Astaka", "Astaka Holdings", D.sc, "JB City Core / CIQ", "Service apartment / condo", 650, 1150, 10, 1, 3.6,
      nb({ schools: "3 within 2km", mall: "JB City Square", mallMins: 5, parks: "Istana Gardens 1km", hospital: "KPJ JB", hospitalMins: 7, highway: "EDL", ciqMins: 6, busStop: true, supermarket: "City Square", safety: 4.4, safetyN: 3, noise: "quiet", flood: "none", industrial: "none" }), "Future"),
    // TODO: verify real project / developer
    p("mbw-bay-danga", "MBW Bay", "MB World", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 420, 760, 17, 1, 4.5,
      nb({ schools: "1 within 2km", mall: "The Mall Mid Valley Southkey", mallMins: 12, parks: "Danga Bay promenade adjacent", hospital: "Gleneagles Medini", hospitalMins: 18, highway: "Coastal Highway", ciqMins: 12, busStop: true, supermarket: "Danga City Mall", safety: 3.8, safetyN: 3, noise: "moderate", flood: "low", industrial: "none" }), "Future"),

    // ── EAST · Mount Austin / Tebrau / Bandar Dato' Onn ────────
    p("havona-mount-austin", "Havona @ Mount Austin", "Maxland", D.e, "Tebrau Corridor", "Service apartment / condo", 420, 620, 15, 3, 4.5,
      nb({ schools: "5 within 2km", mall: "AEON Tebrau City", mallMins: 5, parks: "Mount Austin sports hub 600m", hospital: "Hospital Sultan Ismail", hospitalMins: 9, highway: "Tebrau Hwy", ciqMins: 22, busStop: true, supermarket: "AEON", safety: 4.1, safetyN: 31, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("ecospring-duduk-santai", "Eco Spring Duduk @ Santai", "EcoWorld", D.e, "Tebrau Corridor", "Service apartment / condo", 450, 680, 13, 2, 4.2,
      nb({ schools: "4 within 2km", mall: "AEON Tebrau City", mallMins: 8, parks: "Eco Spring central park", hospital: "Hospital Sultan Ismail", hospitalMins: 12, highway: "Tebrau Hwy", ciqMins: 24, busStop: false, supermarket: "Jaya Grocer", safety: 4.4, safetyN: 14, noise: "quiet", flood: "none", industrial: "none" }), "Ongoing"),
    p("m-minori", "M Minori", "Mah Sing", D.e, "Tebrau Corridor", "Service apartment / condo", 480, 720, 14, 2, 4.3,
      nb({ schools: "5 within 2km", mall: "AEON Tebrau City", mallMins: 7, parks: "Seri Austin park 800m", hospital: "Hospital Sultan Ismail", hospitalMins: 10, highway: "Tebrau Hwy", ciqMins: 23, busStop: true, supermarket: "AEON", safety: 4.2, safetyN: 9, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("bae-bandar-dato-onn", "Bae @ Bandar Dato' Onn", "Faire Development", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 650, 950, 11, 2, 3.6,
      nb({ schools: "3 within 2km", mall: "AEON Tebrau City", mallMins: 12, parks: "Bandar Dato Onn central park", hospital: "Hospital Sultan Ismail", hospitalMins: 13, highway: "Tebrau Hwy", ciqMins: 26, busStop: false, supermarket: "Lotus's", safety: 4.3, safetyN: 8, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("desa-tebrau-harp", "Desa Tebrau HARP (Precinct 12)", "UMLand", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 580, 880, 12, 2, 3.8,
      nb({ schools: "4 within 2km", mall: "AEON Tebrau City", mallMins: 10, parks: "Desa Tebrau linear park", hospital: "Hospital Sultan Ismail", hospitalMins: 11, highway: "Tebrau Hwy", ciqMins: 24, busStop: true, supermarket: "Lotus's", safety: 4.1, safetyN: 7, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),

    // ── EAST · Permas Jaya / Senibong / Seri Alam (Plentong) ───
    p("dambience-residences", "D'Ambience Residences", "Tebrau Bay", D.e, "Permas / Molek", "Service apartment / condo", 350, 520, 17, 3, 4.8,
      nb({ schools: "3 within 1.5km", mall: "Plaza Sutera", mallMins: 7, parks: "Permas central park 500m", hospital: "Regency Specialist", hospitalMins: 9, highway: "Pasir Gudang Hwy", ciqMins: 17, busStop: true, supermarket: "Giant Permas", safety: 3.9, safetyN: 27, noise: "moderate", flood: "medium", industrial: "moderate" }), "Completed"),
    p("the-wateredge-senibong", "The WaterEdge @ Senibong", "Country Garden", D.e, "Permas / Molek", "Service apartment / condo", 480, 720, 14, 2, 4.3,
      nb({ schools: "2 within 2km", mall: "Plaza Sutera", mallMins: 9, parks: "Senibong waterfront adjacent", hospital: "Regency Specialist", hospitalMins: 12, highway: "Pasir Gudang Hwy", ciqMins: 18, busStop: true, supermarket: "Giant Permas", safety: 4.0, safetyN: 16, noise: "moderate", flood: "medium", industrial: "none" }), "Completed"),
    p("straits-view-condo", "The Straits View Condominium", "Tebrau Teguh", D.e, "Permas / Molek", "Service apartment / condo", 420, 650, 15, 2, 4.4,
      nb({ schools: "2 within 2km", mall: "Plaza Sutera", mallMins: 8, parks: "Permas golf adjacent", hospital: "Regency Specialist", hospitalMins: 11, highway: "Pasir Gudang Hwy", ciqMins: 17, busStop: true, supermarket: "Giant Permas", safety: 4.0, safetyN: 13, noise: "moderate", flood: "medium", industrial: "none" }), "Completed"),
    p("senibong-cove", "Senibong Cove", "Front Concept", D.e, "Permas / Molek", "Semi-D", 900, 1700, 10, 2, 3.2,
      nb({ schools: "2 within 3km", mall: "Plaza Sutera", mallMins: 12, parks: "Resort waterfront marina", hospital: "Regency Specialist", hospitalMins: 14, highway: "Pasir Gudang Hwy", ciqMins: 16, busStop: false, supermarket: "Village Grocer", safety: 4.5, safetyN: 21, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("hillview-senibong-cove", "Hillview @ Senibong Cove", "Front Concept", D.e, "Permas / Molek", "Service apartment / condo", 500, 780, 13, 1, 4.2,
      nb({ schools: "2 within 3km", mall: "Plaza Sutera", mallMins: 12, parks: "Senibong Cove marina", hospital: "Regency Specialist", hospitalMins: 14, highway: "Pasir Gudang Hwy", ciqMins: 16, busStop: false, supermarket: "Village Grocer", safety: 4.5, safetyN: 4, noise: "quiet", flood: "low", industrial: "none" }), "Future"),
    p("midas-seri-alam", "Midas @ Seri Alam", "UMLand", D.se, "Pasir Gudang / Masai", "Service apartment / condo", 330, 490, 18, 2, 5.1,
      nb({ schools: "4 within 2km", mall: "AEON Seri Alam", mallMins: 5, parks: "Seri Alam rec park 600m", hospital: "Hospital Pasir Gudang", hospitalMins: 11, highway: "Pasir Gudang Hwy", ciqMins: 28, busStop: true, supermarket: "AEON Seri Alam", safety: 3.8, safetyN: 18, noise: "moderate", flood: "medium", industrial: "moderate" }), "Completed"),
    p("amansari-residence", "Amansari Residence Resort", "Amansari", D.se, "Pasir Gudang / Masai", "Service apartment / condo", 360, 540, 16, 2, 4.9,
      nb({ schools: "3 within 2km", mall: "AEON Seri Alam", mallMins: 8, parks: "Amansari resort grounds", hospital: "Hospital Pasir Gudang", hospitalMins: 13, highway: "Senai-Desaru Expy", ciqMins: 30, busStop: true, supermarket: "Giant Masai", safety: 3.8, safetyN: 14, noise: "moderate", flood: "low", industrial: "moderate" }), "Completed"),

    // ── WEST · Horizon Hills / Bukit Indah / Skudai / Iskandar Puteri ──
    p("mansion18-horizon-hills", "Mansion18 @ Horizon Hills", "Gamuda Land", D.w, "Horizon Hills / Bukit Indah", "Bungalow", 3500, 6000, 7, 2, 2.3,
      nb({ schools: "intl schools 3km", mall: "AEON Bukit Indah", mallMins: 10, parks: "Golf course frontage", hospital: "Gleneagles Medini", hospitalMins: 13, highway: "Second Link", ciqMins: 27, busStop: false, supermarket: "Village Grocer", safety: 4.8, safetyN: 14, noise: "quiet", flood: "none", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("morrinsville-horizon-hills", "Morrinsville @ Horizon Hills", "Gamuda Land", D.w, "Horizon Hills / Bukit Indah", "Semi-D", 1500, 2400, 9, 1, 2.9,
      nb({ schools: "intl schools 3km", mall: "AEON Bukit Indah", mallMins: 9, parks: "Horizon Hills golf adjacent", hospital: "Gleneagles Medini", hospitalMins: 12, highway: "Second Link", ciqMins: 26, busStop: false, supermarket: "Village Grocer", safety: 4.7, safetyN: 4, noise: "quiet", flood: "none", industrial: "none" }), "Future"),
    p("sky-executive-suites-bukit-indah", "The Sky Executive Suites", "Tan & Tan", D.w, "Horizon Hills / Bukit Indah", "Service apartment / condo", 420, 620, 14, 2, 4.3,
      nb({ schools: "4 within 2km", mall: "AEON Bukit Indah", mallMins: 3, parks: "Bukit Indah park 500m", hospital: "Gleneagles Medini", hospitalMins: 14, highway: "Second Link", ciqMins: 25, busStop: true, supermarket: "AEON", safety: 4.3, safetyN: 17, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("the-seed-sutera", "The Seed @ Taman Sutera Utama", "KSL", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 350, 520, 16, 3, 4.7,
      nb({ schools: "4 within 2km", mall: "Sutera Mall", mallMins: 4, parks: "Sutera lake park 600m", hospital: "Hospital Sultanah Aminah", hospitalMins: 14, highway: "Skudai Hwy", ciqMins: 24, busStop: true, supermarket: "Sutera Mall", safety: 4.0, safetyN: 23, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("garden-residences-mutiara-mas", "The Garden Residences @ Mutiara Mas", "Dynasty View", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 380, 560, 15, 2, 4.5,
      nb({ schools: "3 within 2km", mall: "Sutera Mall", mallMins: 7, parks: "Mutiara Mas park", hospital: "Hospital Sultanah Aminah", hospitalMins: 15, highway: "Skudai Hwy", ciqMins: 25, busStop: true, supermarket: "Sutera Mall", safety: 4.0, safetyN: 12, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("ksl-riveria-garden", "KSL Riveria Garden @ Iskandar Puteri", "KSL", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 550, 900, 12, 2, 3.7,
      nb({ schools: "EduCity 5km", mall: "Mall of Medini", mallMins: 10, parks: "Riveria central park", hospital: "Gleneagles Medini", hospitalMins: 12, highway: "Coastal Hwy", ciqMins: 22, busStop: false, supermarket: "Mall of Medini", safety: 4.2, safetyN: 9, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("bee-iskandar-puteri", "Bee @ Iskandar Puteri", "Faire Development", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 650, 980, 11, 2, 3.6,
      nb({ schools: "EduCity 4km", mall: "Mall of Medini", mallMins: 9, parks: "Iskandar Puteri green", hospital: "Gleneagles Medini", hospitalMins: 11, highway: "Coastal Hwy", ciqMins: 21, busStop: false, supermarket: "Mall of Medini", safety: 4.3, safetyN: 6, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("riverhaus-wawari", "RiverHaus @ Wawari", "KSL", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 450, 720, 14, 1, 4.4,
      nb({ schools: "EduCity 5km", mall: "Mall of Medini", mallMins: 10, parks: "Riveria waterfront", hospital: "Gleneagles Medini", hospitalMins: 12, highway: "Coastal Hwy", ciqMins: 22, busStop: false, supermarket: "Mall of Medini", safety: 4.2, safetyN: 4, noise: "quiet", flood: "low", industrial: "none" }), "Future"),
    p("sunway-sakura-p2", "Sunway Sakura Phase 2", "Sunway", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 900, 1400, 10, 1, 3.3,
      nb({ schools: "intl schools 4km", mall: "Mall of Medini", mallMins: 11, parks: "Sunway City green spine", hospital: "Gleneagles Medini", hospitalMins: 10, highway: "Coastal Hwy", ciqMins: 23, busStop: false, supermarket: "Sunway Big Box", safety: 4.5, safetyN: 4, noise: "quiet", flood: "none", industrial: "none" }), "Future"),
    p("forest-city-island2", "Forest City · Island Phases", "Country Garden", D.w, "Bukit Indah / Gelang Patah", "Service apartment / condo", 360, 540, 26, 2, 5.0,
      nb({ schools: "Forest City intl school on-site", mall: "Forest City mall", mallMins: 4, parks: "Beachfront promenade", hospital: "Gleneagles Medini", hospitalMins: 16, highway: "Second Link", ciqMins: 28, busStop: true, supermarket: "Forest City retail", safety: 3.6, safetyN: 12, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),

    // ════════ ADDED — developer-list coverage (June 2026) ════════

    // ── SOUTH / CORE · City Centre / CIQ / Danga Bay / Larkin ──
    p("tropicana-danga-bay", "Tropicana Danga Bay", "Tropicana", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 430, 760, 18, 2, 4.5,
      nb({ schools: "1 within 2km", mall: "The Mall Mid Valley Southkey", mallMins: 11, parks: "Danga Bay promenade adjacent", hospital: "Gleneagles Medini", hospitalMins: 17, highway: "Coastal Hwy", ciqMins: 12, busStop: true, supermarket: "Danga City Mall", safety: 3.9, safetyN: 16, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    // TODO: verify real project / developer
    p("danga-view-apartment", "Danga View Apartment", "Iskandar Waterfront (IWH)", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 360, 620, 17, 2, 4.7,
      nb({ schools: "1 within 2km", mall: "Danga City Mall", mallMins: 5, parks: "Danga Bay waterfront adjacent", hospital: "KPJ JB", hospitalMins: 12, highway: "Coastal Hwy", ciqMins: 13, busStop: true, supermarket: "Danga City Mall", safety: 3.8, safetyN: 11, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("adison-west-larkinton", "Adison West @ W City Larkinton", "WCT Land", D.sc, "JB City Core / CIQ", "Service apartment / condo", 380, 580, 16, 1, 4.6,
      nb({ schools: "3 within 2km", mall: "Larkin Sentral", mallMins: 5, parks: "Johor Golf & Country Club adjacent", hospital: "KPJ JB", hospitalMins: 8, highway: "Skudai Hwy", ciqMins: 11, busStop: true, supermarket: "Larkin Sentral", safety: 4.0, safetyN: 5, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("joland-ciq-condo", "Joland CIQ Residences", "Joland Group", D.sc, "JB City Core / CIQ", "Service apartment / condo", 530, 700, 12, 1, 4.0,
      nb({ schools: "2 within 1.5km", mall: "Komtar JBCC", mallMins: 5, parks: "Merdeka park 700m", hospital: "Hospital Sultanah Aminah", hospitalMins: 7, highway: "EDL", ciqMins: 3, busStop: true, supermarket: "Komtar", safety: 4.1, safetyN: 3, noise: "moderate", flood: "low", industrial: "none" }), "Future"),

    // ── EAST · Mount Austin / Tebrau / Nasa City / Ulu Tiram ──
    p("m-aurora-mount-austin", "M Aurora", "Mah Sing", D.e, "Tebrau Corridor", "Service apartment / condo", 420, 600, 14, 2, 4.6,
      nb({ schools: "5 within 2km", mall: "AEON Tebrau City", mallMins: 6, parks: "Mount Austin sports hub 700m", hospital: "Hospital Sultan Ismail", hospitalMins: 9, highway: "Tebrau Hwy", ciqMins: 23, busStop: true, supermarket: "AEON", safety: 4.1, safetyN: 12, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("austin-duta-ijm", "Austin Duta", "IJM Land", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 620, 920, 12, 2, 3.7,
      nb({ schools: "5 within 2km", mall: "AEON Tebrau City", mallMins: 7, parks: "Austin Heights park 800m", hospital: "Hospital Sultan Ismail", hospitalMins: 9, highway: "Tebrau Hwy", ciqMins: 22, busStop: true, supermarket: "AEON", safety: 4.2, safetyN: 9, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("nasa-city-desa-palma", "Nasa City · Desa Palma", "IJM Land", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 560, 820, 13, 3, 3.9,
      nb({ schools: "4 within 2km", mall: "AEON Tebrau City", mallMins: 10, parks: "Nasa City linear park", hospital: "Hospital Sultan Ismail", hospitalMins: 12, highway: "North-South Hwy", ciqMins: 26, busStop: false, supermarket: "Lotus's", safety: 4.1, safetyN: 8, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("eco-summer-tebrau", "Eco Summer", "EcoWorld", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 650, 980, 11, 2, 3.6,
      nb({ schools: "4 within 2km", mall: "AEON Tebrau City", mallMins: 9, parks: "Eco Summer garden park", hospital: "Hospital Sultan Ismail", hospitalMins: 12, highway: "Tebrau Hwy", ciqMins: 25, busStop: false, supermarket: "Jaya Grocer", safety: 4.4, safetyN: 6, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("crest-at-austin", "Crest @ Austin", "WM Senibong", D.e, "Tebrau Corridor", "Service apartment / condo", 400, 600, 15, 2, 4.5,
      nb({ schools: "5 within 2km", mall: "AEON Tebrau City", mallMins: 6, parks: "Taman Austin park 600m", hospital: "Hospital Sultan Ismail", hospitalMins: 9, highway: "Tebrau Hwy", ciqMins: 23, busStop: true, supermarket: "AEON", safety: 4.1, safetyN: 8, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("ksl-daya-residences", "KSL Daya Residences", "KSL Holdings", D.e, "Tebrau Corridor", "Service apartment / condo", 210, 440, 19, 3, 5.4,
      nb({ schools: "4 within 2km", mall: "KSL City Mall", mallMins: 8, parks: "Taman Daya park 500m", hospital: "Hospital Sultan Ismail", hospitalMins: 10, highway: "Tebrau Hwy", ciqMins: 20, busStop: true, supermarket: "KSL hypermarket", safety: 3.8, safetyN: 21, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("taman-rinting-plenitude", "Taman Rinting", "Plenitude", D.e, "Permas / Molek", "Terrace (2/3-storey)", 420, 640, 14, 2, 4.4,
      nb({ schools: "3 within 2km", mall: "Plaza Sutera", mallMins: 10, parks: "Rinting town park", hospital: "Regency Specialist", hospitalMins: 12, highway: "Pasir Gudang Hwy", ciqMins: 19, busStop: true, supermarket: "Giant Masai", safety: 3.9, safetyN: 10, noise: "moderate", flood: "medium", industrial: "moderate" }), "Ongoing"),
    // TODO: verify real project / developer
    p("ulu-tiram-plenitude", "Ulu Tiram Residences", "Plenitude", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 480, 720, 13, 1, 4.1,
      nb({ schools: "3 within 2km", mall: "AEON Tebrau City", mallMins: 14, parks: "Ulu Tiram rec park", hospital: "Hospital Sultan Ismail", hospitalMins: 16, highway: "Tebrau Hwy", ciqMins: 30, busStop: false, supermarket: "Lotus's", safety: 4.0, safetyN: 4, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),

    // ── WEST · Iskandar Puteri / Gerbang Nusajaya / Medini ──
    p("eco-botanic", "Eco Botanic", "EcoWorld", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 700, 1100, 11, 3, 3.5,
      nb({ schools: "EduCity 3km, intl schools", mall: "Mall of Medini", mallMins: 8, parks: "Eco Botanic central park", hospital: "Gleneagles Medini", hospitalMins: 9, highway: "Second Link", ciqMins: 24, busStop: false, supermarket: "Village Grocer", safety: 4.5, safetyN: 14, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("eco-botanic-2", "Eco Botanic 2", "EcoWorld", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 600, 900, 12, 2, 3.7,
      nb({ schools: "EduCity 3km", mall: "Mall of Medini", mallMins: 9, parks: "Eco Botanic green spine", hospital: "Gleneagles Medini", hospitalMins: 10, highway: "Second Link", ciqMins: 25, busStop: false, supermarket: "Village Grocer", safety: 4.4, safetyN: 8, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("aspira-hills-uem", "Aspira Hills", "UEM Sunrise", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 700, 1000, 10, 2, 3.6,
      nb({ schools: "EduCity 5km, Gleneagles nearby", mall: "Mall of Medini", mallMins: 12, parks: "6-acre Aspira Central Park", hospital: "Gleneagles Medini", hospitalMins: 11, highway: "Tuas link 15min", ciqMins: 26, busStop: false, supermarket: "Village Grocer", safety: 4.5, safetyN: 7, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("setia-eco-cascadia", "Setia Eco Cascadia", "SP Setia", D.w, "Nusajaya / Iskandar Puteri", "Semi-D", 1200, 2100, 9, 2, 3.0,
      nb({ schools: "intl schools 4km", mall: "AEON Bukit Indah", mallMins: 12, parks: "Eco Cascadia waterway park", hospital: "Gleneagles Medini", hospitalMins: 14, highway: "Second Link", ciqMins: 23, busStop: false, supermarket: "Village Grocer", safety: 4.6, safetyN: 9, noise: "quiet", flood: "none", industrial: "none" }), "Completed"),
    p("setia-eco-gardens", "Setia Eco Gardens", "SP Setia", D.w, "Bukit Indah / Gelang Patah", "Terrace (2/3-storey)", 600, 980, 12, 3, 3.7,
      nb({ schools: "intl schools 5km", mall: "Gelang Patah town", mallMins: 8, parks: "Eco Gardens central park", hospital: "Gleneagles Medini", hospitalMins: 15, highway: "Second Link", ciqMins: 30, busStop: false, supermarket: "Giant Gelang Patah", safety: 4.3, safetyN: 11, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("sunway-iskandar", "Sunway Iskandar", "Sunway", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 450, 760, 14, 2, 4.3,
      nb({ schools: "intl schools 4km", mall: "Sunway Big Box", mallMins: 6, parks: "Sunway Emerald Lake park", hospital: "Gleneagles Medini", hospitalMins: 11, highway: "Second Link", ciqMins: 24, busStop: false, supermarket: "Sunway Big Box", safety: 4.4, safetyN: 10, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("east-ledang-uem", "East Ledang", "UEM Sunrise", D.w, "Nusajaya / Iskandar Puteri", "Bungalow", 2200, 4200, 8, 2, 2.6,
      nb({ schools: "intl schools 2km", mall: "Mall of Medini", mallMins: 10, parks: "East Ledang nature trails", hospital: "Gleneagles Medini", hospitalMins: 9, highway: "Coastal Hwy", ciqMins: 23, busStop: false, supermarket: "Village Grocer", safety: 4.7, safetyN: 8, noise: "quiet", flood: "none", industrial: "none" }), "Completed"),
    p("wawari-west-park-homes", "Wawari West Park Homes", "IIB Land", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 580, 880, 12, 1, 3.8,
      nb({ schools: "EduCity 5km", mall: "Mall of Medini", mallMins: 11, parks: "Wawari nature community park", hospital: "Gleneagles Medini", hospitalMins: 12, highway: "Coastal Hwy", ciqMins: 22, busStop: false, supermarket: "Mall of Medini", safety: 4.3, safetyN: 4, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),

    // ── SOUTH-EAST · Pasir Gudang / Masai ──────────────────────
    p("eco-tropics-pasir-gudang", "Eco Tropics", "EcoWorld", D.se, "Pasir Gudang / Masai", "Terrace (2/3-storey)", 400, 600, 14, 2, 4.8,
      nb({ schools: "primary school on-site", mall: "AEON Seri Alam", mallMins: 10, parks: "30-acre West Lake Gardens", hospital: "Hospital Pasir Gudang", hospitalMins: 12, highway: "Senai-Desaru Expy", ciqMins: 29, busStop: false, supermarket: "Giant Masai", safety: 4.0, safetyN: 9, noise: "moderate", flood: "low", industrial: "moderate" }), "Ongoing"),

    // ── NORTH · Pulai / Skudai / Kulai / Kangkar Pulai ─────────
    p("scientex-pulai-mutiara", "Taman Pulai Mutiara", "Scientex", D.n, "Senai / Kulai", "Terrace (2/3-storey)", 330, 500, 14, 3, 5.2,
      nb({ schools: "4 within 2km", mall: "Sutera Mall", mallMins: 10, parks: "Pulai Mutiara linear park", hospital: "Hospital Sultanah Aminah", hospitalMins: 16, highway: "Skudai Hwy", ciqMins: 28, busStop: true, supermarket: "Giant Pulai", safety: 3.9, safetyN: 16, noise: "moderate", flood: "low", industrial: "moderate" }), "Ongoing"),
    p("citrine-hills-bbkp", "Citrine Hills @ BBKP", "Keck Seng", D.n, "Senai / Kulai", "Terrace (2/3-storey)", 480, 760, 12, 2, 4.0,
      nb({ schools: "3 within 3km", mall: "AEON Kulai", mallMins: 12, parks: "50-acre hilltop nature park", hospital: "Kulai Hospital", hospitalMins: 14, highway: "North-South Hwy", ciqMins: 32, busStop: false, supermarket: "Giant Kangkar Pulai", safety: 4.4, safetyN: 7, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("genting-indahpura", "Genting Indahpura", "Genting Property", D.n, "Senai / Kulai", "Terrace (2/3-storey)", 350, 560, 13, 2, 4.7,
      nb({ schools: "4 within 2km", mall: "AEON Kulai", mallMins: 8, parks: "Indahpura central park", hospital: "Kulai Hospital", hospitalMins: 10, highway: "North-South Hwy", ciqMins: 34, busStop: true, supermarket: "AEON Kulai", safety: 4.0, safetyN: 13, noise: "moderate", flood: "low", industrial: "moderate" }), "Ongoing"),
    p("m-senai-mahsing", "M Senai", "Mah Sing", D.n, "Senai / Kulai", "Service apartment / condo", 300, 470, 16, 1, 5.3,
      nb({ schools: "2 within 2km", mall: "AEON Kulai", mallMins: 9, parks: "Senai town park", hospital: "Kulai Hospital", hospitalMins: 11, highway: "Senai Airport link", ciqMins: 33, busStop: true, supermarket: "Giant Senai", safety: 3.9, safetyN: 4, noise: "moderate", flood: "low", industrial: "moderate" }), "Future"),

    // ════════ ADDED — full developer-matrix residential coverage ════════
    // ── SOUTH / CORE ──
    p("casa-almyra-danga", "Casa Almyra", "Iskandar Waterfront (IWH)", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 360, 560, 16, 2, 4.8, nb({ schools: "1 within 2km", mall: "Danga City Mall", mallMins: 6, parks: "Danga Bay waterfront", hospital: "KPJ JB", hospitalMins: 12, highway: "Coastal Hwy", ciqMins: 13, busStop: true, supermarket: "Danga City Mall", safety: 3.9, safetyN: 9, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("kprj-danga-bay", "KPRJ Danga Bay", "KPRJ (Kumpulan Prasarana Rakyat Johor)", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 340, 520, 17, 2, 4.9, nb({ schools: "1 within 2km", mall: "Danga City Mall", mallMins: 7, parks: "Danga Bay promenade", hospital: "KPJ JB", hospitalMins: 13, highway: "Coastal Hwy", ciqMins: 14, busStop: true, supermarket: "Danga City Mall", safety: 3.8, safetyN: 5, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),

    // ── EAST ──
    p("ksl-city-residences", "KSL City Residences", "KSL Holdings", D.e, "Permas / Molek", "Service apartment / condo", 360, 560, 16, 3, 4.9, nb({ schools: "4 within 2km", mall: "KSL City Mall", mallMins: 2, parks: "Taman Daya park 600m", hospital: "Hospital Sultan Ismail", hospitalMins: 10, highway: "Tebrau Hwy", ciqMins: 19, busStop: true, supermarket: "KSL hypermarket", safety: 3.9, safetyN: 22, noise: "moderate", flood: "low", industrial: "none" }), "Completed"),
    p("sierra-square-mahsing", "Sierra Square", "Mah Sing", D.e, "Permas / Molek", "Terrace (2/3-storey)", 480, 720, 13, 2, 4.1, nb({ schools: "3 within 2km", mall: "Plaza Sutera", mallMins: 9, parks: "Sierra Perdana park", hospital: "Regency Specialist", hospitalMins: 12, highway: "Pasir Gudang Hwy", ciqMins: 20, busStop: true, supermarket: "Giant Masai", safety: 4.0, safetyN: 7, noise: "moderate", flood: "low", industrial: "moderate" }), "Completed"),
    p("meridin-bayvue", "Meridin Bayvue", "Mah Sing", D.e, "Permas / Molek", "Service apartment / condo", 330, 500, 17, 2, 5.0, nb({ schools: "3 within 2km", mall: "Plaza Sutera", mallMins: 10, parks: "Sierra Perdana green", hospital: "Regency Specialist", hospitalMins: 13, highway: "Pasir Gudang Hwy", ciqMins: 22, busStop: true, supermarket: "Giant Masai", safety: 3.8, safetyN: 11, noise: "moderate", flood: "medium", industrial: "moderate" }), "Completed"),
    // TODO: verify real project / developer
    p("premium-height-dato-onn", "Premium Height Residence", "MJK Group", D.e, "Tebrau Corridor", "Service apartment / condo", 420, 620, 14, 2, 4.5, nb({ schools: "4 within 2km", mall: "AEON Tebrau City", mallMins: 11, parks: "Bandar Dato Onn central park", hospital: "Hospital Sultan Ismail", hospitalMins: 13, highway: "Tebrau Hwy", ciqMins: 25, busStop: false, supermarket: "Lotus's", safety: 4.2, safetyN: 6, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("the-kews-senibong", "The Kews", "WM Senibong", D.e, "Permas / Molek", "Terrace (2/3-storey)", 700, 1050, 11, 2, 3.6, nb({ schools: "2 within 3km", mall: "Plaza Sutera", mallMins: 11, parks: "Senibong Cove marina", hospital: "Regency Specialist", hospitalMins: 13, highway: "Pasir Gudang Hwy", ciqMins: 16, busStop: false, supermarket: "Village Grocer", safety: 4.5, safetyN: 9, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("parkland-plentong", "Parkland Residences Plentong", "Parkland Southern", D.e, "Permas / Molek", "Service apartment / condo", 330, 510, 16, 1, 5.0, nb({ schools: "3 within 2km", mall: "Plaza Sutera", mallMins: 9, parks: "Plentong rec park", hospital: "Regency Specialist", hospitalMins: 11, highway: "Pasir Gudang Hwy", ciqMins: 20, busStop: true, supermarket: "Giant Masai", safety: 3.8, safetyN: 4, noise: "moderate", flood: "medium", industrial: "moderate" }), "Future"),

    // ── WEST ──
    p("serimbun-uem", "Serimbun", "UEM Sunrise", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 600, 900, 12, 2, 3.7, nb({ schools: "EduCity 4km", mall: "Mall of Medini", mallMins: 10, parks: "Serimbun linear park", hospital: "Gleneagles Medini", hospitalMins: 12, highway: "Coastal Hwy", ciqMins: 23, busStop: false, supermarket: "Village Grocer", safety: 4.4, safetyN: 8, noise: "quiet", flood: "low", industrial: "none" }), "Completed"),
    p("aspira-lakehomes", "Aspira LakeHomes", "UEM Sunrise", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 680, 980, 11, 2, 3.6, nb({ schools: "EduCity 4km, Gleneagles", mall: "Mall of Medini", mallMins: 11, parks: "Aspira lake park", hospital: "Gleneagles Medini", hospitalMins: 11, highway: "Tuas link", ciqMins: 25, busStop: false, supermarket: "Village Grocer", safety: 4.5, safetyN: 9, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("nadi-nusantara-2", "Nadi Nusantara 2", "UEM Sunrise", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 350, 520, 13, 1, 4.6, nb({ schools: "3 within 3km", mall: "Mall of Medini", mallMins: 13, parks: "Senadi Hills park", hospital: "Gleneagles Medini", hospitalMins: 14, highway: "Second Link", ciqMins: 27, busStop: false, supermarket: "Village Grocer", safety: 4.2, safetyN: 5, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("eco-botanic-3", "Eco Botanic 3", "EcoWorld", D.w, "Nusajaya / Iskandar Puteri", "Terrace (2/3-storey)", 620, 920, 12, 1, 3.7, nb({ schools: "EduCity 3km", mall: "Mall of Medini", mallMins: 9, parks: "Eco Botanic park", hospital: "Gleneagles Medini", hospitalMins: 10, highway: "Second Link", ciqMins: 25, busStop: false, supermarket: "Village Grocer", safety: 4.4, safetyN: 5, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    p("setia-indah-jb", "Setia Indah", "SP Setia", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 520, 820, 12, 2, 3.9, nb({ schools: "4 within 2km", mall: "Setia Tropika Shoppes", mallMins: 6, parks: "Setia Indah park", hospital: "Hospital Sultan Ismail", hospitalMins: 12, highway: "Tebrau Hwy", ciqMins: 22, busStop: true, supermarket: "Lotus's", safety: 4.2, safetyN: 9, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("sky-estadia-medini", "Sky Estadia", "SP Setia", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 480, 720, 14, 1, 4.3, nb({ schools: "EduCity 3km", mall: "Mall of Medini", mallMins: 6, parks: "Medini central park", hospital: "Gleneagles Medini", hospitalMins: 8, highway: "Coastal Hwy", ciqMins: 22, busStop: true, supermarket: "Mall of Medini", safety: 4.3, safetyN: 6, noise: "quiet", flood: "low", industrial: "none" }), "Completed"),
    p("palazio-sunway", "Palazio", "Sunway", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 450, 700, 14, 2, 4.4, nb({ schools: "intl schools 4km", mall: "Sunway Big Box", mallMins: 6, parks: "Sunway Emerald Lake", hospital: "Gleneagles Medini", hospitalMins: 11, highway: "Second Link", ciqMins: 24, busStop: false, supermarket: "Sunway Big Box", safety: 4.4, safetyN: 8, noise: "quiet", flood: "low", industrial: "none" }), "Completed"),
    // TODO: verify real project / developer
    p("the-trilinq-sunway", "The Trilinq", "Sunway", D.w, "Nusajaya / Iskandar Puteri", "Service apartment / condo", 480, 760, 13, 1, 4.3, nb({ schools: "intl schools 4km", mall: "Sunway Big Box", mallMins: 7, parks: "Sunway central park", hospital: "Gleneagles Medini", hospitalMins: 11, highway: "Second Link", ciqMins: 24, busStop: false, supermarket: "Sunway Big Box", safety: 4.4, safetyN: 5, noise: "quiet", flood: "low", industrial: "none" }), "Ongoing"),
    // TODO: verify real project / developer
    p("pangsapuri-iskandar-perdana", "Pangsapuri Iskandar Perdana", "Marcus Group", D.w, "Bukit Indah / Gelang Patah", "Service apartment / condo", 300, 460, 16, 2, 5.2, nb({ schools: "3 within 2km", mall: "AEON Bukit Indah", mallMins: 10, parks: "Iskandar Perdana park", hospital: "Gleneagles Medini", hospitalMins: 15, highway: "Second Link", ciqMins: 28, busStop: true, supermarket: "AEON", safety: 3.8, safetyN: 6, noise: "moderate", flood: "low", industrial: "none" }), "Ongoing"),
    p("rf-princess-cove-mercu-3", "R&F Princess Cove Mercu 3", "R&F Properties", D.sc, "JB City Core / CIQ", "Service apartment / condo", 847, 1300, 8, 2, null,
      nb({ schools: "2 within 1.5km", mall: "KSL City Mall", mallMins: 6, parks: "Lido waterfront 600m", hospital: "KPJ JB", hospitalMins: 9, ciqMins: 5, busStop: true, supermarket: "KSL hypermarket", safety: 4.1, safetyN: 12, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2028 }),
    p("daya-1-residences", "Daya 1 Residences", "KSL Holdings", D.sc, "Danga Bay Waterfront", "Service apartment / condo", 376, 679, 8, 2, null,
      nb({ schools: "2 within 2km", mall: "R&F Mall", mallMins: 8, hospital: "Regency Specialist", hospitalMins: 12, ciqMins: 8, busStop: true, supermarket: "AEON", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    // TODO: verify real project / developer
    p("puncak-premium", "Puncak Premium", "MJK Group", D.sc, "JB City Core / CIQ", "Service apartment / condo", 195, 716, 8, 2, null,
      nb({ schools: "2 within 2km", mall: "City Square", mallMins: 7, hospital: "KPJ JB", hospitalMins: 8, ciqMins: 6, busStop: true, supermarket: "City Square", safety: 3.9, safetyN: 5, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),

    // East
    p("bandar-dato-onn-p13", "Bandar Dato' Onn, Perjiranan 13", "JLand Group (Johor Land Berhad)", D.e, "Bandar Dato' Onn", "Terrace (2/3-storey)", 1200, 1900, 6, 2, null,
      nb({ schools: "4 within 2km", mall: "AEON Tebrau", mallMins: 12, parks: "Bandar Dato' Onn linear park", hospital: "Columbia Asia", hospitalMins: 15, ciqMins: 22, busStop: true, supermarket: "Giant", safety: 4.3, safetyN: 14, noise: "quiet", flood: "low", industrial: "none" }), "New launch",
      { completing: 2027 }),
    p("austin-duta-maison-parc", "Austin Duta Maison Parc", "IJM Land", D.e, "Mount Austin / Austin Heights", "Terrace (2/3-storey)", 1900, 2200, 5, 2, null,
      nb({ schools: "5 within 2km incl. Austin Heights Intl", mall: "AEON Tebrau", mallMins: 8, parks: "Austin lake park", hospital: "Columbia Asia", hospitalMins: 10, ciqMins: 20, busStop: true, supermarket: "Village Grocer", safety: 4.5, safetyN: 18, noise: "quiet", flood: "none", industrial: "none" }), "New launch",
      { completing: 2027 }),
    p("bandar-tiram-3", "Bandar Tiram 3", "JLG Land (JCorp)", D.e, "Ulu Tiram", "Terrace (2/3-storey)", 1100, 1800, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "AEON Bandar Dato' Onn", mallMins: 14, hospital: "Pantai Hospital", hospitalMins: 16, ciqMins: 28, busStop: false, supermarket: "Mydin", safety: 4.1, safetyN: 9, noise: "quiet", flood: "low" }), "New launch",
      { tenure: "leasehold", leaseYears: 99, completing: 2026 }),
    p("ksl-austin-legacy", "KSL Austin Legacy", "KSL Holdings", D.e, "Mount Austin / Austin Heights", "Service apartment / condo", 290, 573, 8, 2, null,
      nb({ schools: "4 within 2km", mall: "AEON Tebrau", mallMins: 9, hospital: "Columbia Asia", hospitalMins: 11, ciqMins: 22, busStop: true, supermarket: "AEON", safety: 4.2, safetyN: 10, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2030 }),
    // TODO: verify real project / developer
    p("kempas-indah-2", "Pangsapuri Kempas Indah 2 (D'Seret Garden 2)", "TBC", D.e, "Kempas", "Service apartment / condo", 225, 549, 8, 2, null,
      nb({ schools: "3 within 2km", mall: "AEON Tebrau", mallMins: 14, hospital: "KPJ Puteri", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "Giant", safety: 3.9, safetyN: 5, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2028 }),
    // TODO: verify real project / developer
    p("taman-sentosa-4", "Taman Sentosa 4", "TBC", D.e, "Taman Sentosa", "Terrace (2/3-storey)", 383, 500, 5, 2, null,
      nb({ schools: "3 within 1.5km", mall: "Sutera Mall", mallMins: 9, hospital: "Regency Specialist", hospitalMins: 8, ciqMins: 10, busStop: true, supermarket: "Sutera Mall", safety: 4.0, safetyN: 8, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2027 }),
    // TODO: verify real project / developer
    p("laman-bukit", "Laman Bukit", "TBC", D.w, "Horizon Hills / Bukit Indah", "Terrace (2/3-storey)", 1900, 2700, 5, 2, null,
      nb({ schools: "4 within 2km", mall: "AEON Bukit Indah", mallMins: 8, hospital: "Gleneagles Medini", hospitalMins: 18, ciqMins: 22, busStop: true, supermarket: "AEON", safety: 4.4, safetyN: 6, noise: "quiet", flood: "none" }), "New launch",
      { completing: 2028 }),
    // TODO: verify real project / developer
    p("residensi-kaze", "Residensi Kaze", "TBC", D.w, "Skudai / Sutera", "Service apartment / condo", 150, 180, 4, 2, null,
      nb({ schools: "3 within 2km", mall: "Paradigm Mall JB", mallMins: 10, hospital: "KPJ Puteri", hospitalMins: 8, ciqMins: 14, busStop: true, supermarket: "Giant", safety: 3.8, safetyN: 4, noise: "moderate", flood: "low" }), "New launch",
      { tenure: "leasehold", leaseYears: 99, completing: 2028 }),

    // West
    p("laman-tasik-aspira", "Laman Tasik Aspira", "UEM Sunrise", D.w, "Iskandar Puteri / Gerbang Nusajaya", "Terrace (2/3-storey)", 810, 1500, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "AEON Bukit Indah", mallMins: 12, parks: "Nusajaya lake", hospital: "Gleneagles Medini", hospitalMins: 10, ciqMins: 25, busStop: true, supermarket: "Village Grocer", safety: 4.3, safetyN: 8, noise: "quiet", flood: "low" }), "New launch",
      { tenure: "leasehold", leaseYears: 99, completing: 2027 }),
    // TODO: verify real project / developer
    p("pangsapuri-sutera", "Pangsapuri Sutera", "Tanah Sutera", D.w, "Sutera Utama", "Service apartment / condo", 748, 918, 6, 2, null,
      nb({ schools: "4 within 2km incl. Sunway Intl", mall: "Sutera Mall", mallMins: 4, hospital: "Regency Specialist", hospitalMins: 6, ciqMins: 12, busStop: true, supermarket: "Sutera Mall", safety: 4.3, safetyN: 9, noise: "quiet", flood: "low" }), "New launch",
      { completing: 2028 }),
    // TODO: verify real project / developer
    p("taman-nusa-melati", "Taman Nusa Melati", "TBC", D.w, "Nusajaya", "Terrace (2/3-storey)", 966, 2300, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "AEON Bukit Indah", mallMins: 10, hospital: "Gleneagles Medini", hospitalMins: 12, ciqMins: 25, busStop: true, supermarket: "AEON", safety: 4.2, safetyN: 6, noise: "quiet", flood: "low" }), "New launch",
      { completing: 2027 }),
    p("pisonia-ville", "Pisonia Ville", "UDA Land (South)", D.w, "Bukit Indah", "Terrace (2/3-storey)", 800, 1100, 6, 2, null,
      nb({ schools: "4 within 2km", mall: "AEON Bukit Indah", mallMins: 6, hospital: "Gleneagles Medini", hospitalMins: 14, ciqMins: 20, busStop: true, supermarket: "AEON", safety: 4.3, safetyN: 10, noise: "quiet", flood: "low" })),

    // South-East
    p("ekotropika-10", "Ekotropika 10", "EcoWorld (Eco Tropics Development)", D.se, "Pasir Gudang / Kong Kong", "Terrace (2/3-storey)", 743, 1100, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "AEON Pasir Gudang", mallMins: 10, parks: "Eco Tropics park", hospital: "KPJ Pasir Gudang", hospitalMins: 12, ciqMins: 30, busStop: true, supermarket: "Giant", safety: 4.1, safetyN: 8, noise: "moderate", flood: "low", industrial: "some (port belt)" }), "New launch",
      { completing: 2028 }),
    p("meridin-east-jasmine-2", "Meridin East Jasmine 2", "Mah Sing", D.se, "Pasir Gudang / Bandar Seri Alam", "Terrace (2/3-storey)", 745, 989, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "Bandar Seri Alam mall", mallMins: 8, hospital: "KPJ Pasir Gudang", hospitalMins: 10, ciqMins: 28, busStop: true, supermarket: "Village Grocer", safety: 4.2, safetyN: 9, noise: "quiet", flood: "low", industrial: "none" }), "New launch",
      { completing: 2027 }),
    // TODO: verify real project / developer
    p("taman-pulau-emas", "Taman Pulau Emas", "TBC", D.se, "Pasir Gudang", "Terrace (2/3-storey)", 150, 247, 5, 2, null,
      nb({ schools: "2 within 2km", mall: "AEON Pasir Gudang", mallMins: 14, hospital: "KPJ Pasir Gudang", hospitalMins: 14, ciqMins: 34, busStop: true, supermarket: "Mydin", safety: 3.8, safetyN: 4, noise: "moderate", flood: "moderate", industrial: "some (port belt)" }), "New launch",
      { tenure: "leasehold", leaseYears: 99, completing: 2026 }),

    // North
    // TODO: verify real project / developer
    p("residensi-saujana-2", "Residensi Saujana Fasa 2", "TBC", D.n, "Kulai / Senai", "Terrace (2/3-storey)", 689, 1100, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "Senai City Square", mallMins: 8, hospital: "KPJ Kulai", hospitalMins: 10, ciqMins: 32, busStop: true, supermarket: "Mydin", safety: 4.0, safetyN: 6, noise: "quiet", flood: "low", industrial: "none" }), "New launch",
      { completing: 2028 }),
    // ── EdgeProp new-launch batch (rows 21–60, 37 net additions) ──
    // TODO: verify real project / developer
    p("parkland-river-permas-p2", "Parkland By The River (Permas) – Phase 2", "Parkland Southern", D.e, "Permas Jaya", "Service apartment / condo", 422, 786, 7, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    // TODO: verify real project / developer
    p("pinegate-residency", "Pinegate Residency", "Pinegate Development", D.e, "Tebrau", "Service apartment / condo", 345, 478, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2028 }),
    p("residensi-ponderosa", "Residensi Ponderosa", "Prinsip Alpha", D.e, "Tebrau", "Service apartment / condo", 405, 1212, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    p("senyum-residences", "Senyum Residences", "Crescendo Landmark", D.e, "Ulu Tiram", "Service apartment / condo", 513, 1500, 7, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    // TODO: verify real project / developer
    p("gen-rise", "Gen Rise", "Majestic Gen", D.w, "Iskandar Puteri", "Service apartment / condo", 563, 2140, 7, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    // TODO: verify real project / developer
    p("gen-sphere", "Gen Sphere (Residensi Gen Sfera)", "Majestic Gen", D.w, "Iskandar Puteri", "Service apartment / condo", 609, 1120, 7, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    // TODO: verify real project / developer
    p("paragon-signature-suites", "Paragon Signature Suites", "Paragon Urban", D.sc, "JB City Core / CIQ", "Service apartment / condo", 581, 650, 7, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    p("asteriaz-kebun-teh", "The Asteriaz @ Kebun Teh", "Exsim Kebun Teh", D.sc, "Kebun Teh", "Service apartment / condo", 475, 793, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { tenure: "leasehold", leaseYears: 99, completing: 2029 }),
    p("summer-suites-bukit-meldrum", "Summer Suites (Bukit Meldrum)", "Connoisseur Properties", D.sc, "JB City Core / CIQ", "Service apartment / condo", 620, 1068, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2029 }),
    p("bdo-p14-flexihome-1", "Bandar Dato' Onn, Perjiranan 14 (Flexihome Fasa 1)", "JLand Group (Johor Land Berhad)", D.e, "Bandar Dato' Onn", "Terrace (2/3-storey)", 559, 882, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2025 }),
    p("alam-sutera", "Alam Sutera", "Tanah Sutera Development", D.w, "Sutera Utama", "Terrace (2/3-storey)", 1298, 2331, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2027 }),
    p("aliva-mount-austin", "Aliva Mount Austin", "Astaka Development", D.e, "Mount Austin / Austin Heights", "Service apartment / condo", 445, 781, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2026 }),
    p("tanjong-puteri-resort", "Tanjong Puteri Resort", "Keck Seng (Malaysia)", D.e, "Tanjong Puteri", "Service apartment / condo", 304, 518, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2025 }),
    p("aurinia", "Aurinia", "Setia Indah", D.e, "Setia Tropika", "Terrace (2/3-storey)", 1963, 2487, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2026 }),
    p("bbkp-master", "Bandar Baru Kangkar Pulai", "Keck Seng (Malaysia)", D.n, "Kangkar Pulai", "Terrace (2/3-storey)", 525, 891, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { tenure: "leasehold", leaseYears: 99, completing: 2025 }),
    p("bdo-p8-master", "Bandar Dato' Onn, Perjiranan 8", "JLand Group (Johor Land Berhad)", D.e, "Bandar Dato' Onn", "Semi-D", 1353, 1903, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2027 }),
    p("calliandra-setia-tropika", "Calliandra", "Setia Indah", D.e, "Setia Tropika", "Terrace (2/3-storey)", 1252, 1608, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2025 }),
    // TODO: verify real project / developer
    p("residensi-sinaran", "Residensi Sinaran", "Solusi Kelana", D.e, "Tebrau", "Service apartment / condo", 157, 640, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2026 }),
    p("ekoflora-4-eco-spring", "Ekoflora 4 @ Eco Spring", "Eco Summer", D.e, "Tebrau Corridor", "Semi-D", 1836, 2218, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2026 }),
    p("sunway-lenang-heights-p1", "Sunway Lenang Heights (Phase 1)", "Sunway City (JB)", D.e, "Tebrau / Lenang", "Bungalow", 2682, 4281, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2026 }),
    p("santai-eco-spring-p2", "Santai D'Eco Spring (Phase 2)", "Eco Summer", D.e, "Tebrau Corridor", "Service apartment / condo", 528, 574, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2028 }),
    p("santai-eco-spring-p1", "Santai D'Eco Spring", "Eco Summer", D.e, "Tebrau Corridor", "Service apartment / condo", 528, 575, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2028 }),
    // TODO: verify real project / developer
    p("glenmarie-johor-1d-1", "Glenmarie Johor 1d-1", "Sime Darby Property", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 1507, 1860, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch"),
    // TODO: verify real project / developer
    p("glenmarie-johor-1d-2", "Glenmarie Johor Fasa 1D-2", "Sime Darby Property", D.e, "Tebrau Corridor", "Terrace (2/3-storey)", 1025, 1211, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch"),
    p("laman-aluvium", "Laman Aluvium", "Setia Indah", D.e, "Setia Tropika", "Terrace (2/3-storey)", 926, 1259, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2026 }),
    // TODO: verify real project / developer
    p("laman-permata", "Laman Permata", "Faire Development", D.e, "Tebrau", "Terrace (2/3-storey)", 876, 1363, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2026 }),
    p("longevia", "Longevia", "Setia Indah", D.e, "Setia Tropika", "Bungalow", 4399, 5084, 5, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { completing: 2025 }),
    p("ksl-bukit-gemilang", "Pangsapuri KSL Bukit Gemilang", "Khoo Soon Lee Realty", D.e, "Tebrau", "Service apartment / condo", 378, 573, 6, 2, null,
      nb({ schools: "3 within 2km", mall: "nearest mall", mallMins: 10, hospital: "nearest hospital", hospitalMins: 12, ciqMins: 20, busStop: true, supermarket: "supermarket nearby", safety: 4.0, safetyN: 6, noise: "moderate", flood: "low" }), "New launch",
      { tenure: "leasehold", leaseYears: 99, completing: 2026 }),

  ];

  // builds a project record; spa derived from net + discount band
  function p(slug, name, developer, direction, corridor, propertyType, netMin, netMax, disc, records, gyield, neighbourhood, status, opts) {
    const spaMin = Math.round(netMin / (1 - disc / 100));
    const spaMax = Math.round(netMax / (1 - disc / 100));
    const o = opts || {};
    return { slug, name, developer, direction, corridor, propertyType,
      netMin, netMax, spaMin, spaMax, discAvg: disc, records,
      gyield, area: corridor, neighbourhood,
      status: status || "Completed",
      // tenure defaults to freehold; explicit leasehold projects pass opts.tenure
      tenure: o.tenure || "freehold",
      leaseYears: o.leaseYears || null,
      completing: o.completing || null,
      // back-compat fields used by older components:
      netMedian: Math.round((netMin + netMax) / 2) };
  }

  // ── Built-up / psf / storey augmentation + per-record submissions ──
  // Display property types split 2-storey vs 3-storey (per spec 1.3/1.4).
  const DISPLAY_TYPES = [
    "Terrace 2-storey", "Terrace 3-storey", "Semi-D", "Bungalow",
    "Shop 2-storey", "Shop 3-storey", "Service apartment / condo",
  ];
  // storey override for landed/shop projects (default 2)
  const STOREY = {
    "austin-perdana-terrace": 2, "johor-jaya-terrace": 2, "bukit-indah-terrace": 2,
    "bandar-seri-alam-terrace": 2, "scientex-pasir-gudang": 2, "bandar-putra-terrace": 2,
    "seri-austin-shoppes": 3, "permas-jaya-shop": 2, "nusa-bestari-shop": 3,
    "pasir-gudang-shop": 2, "taman-universiti-shop": 2,
    // a couple of premium terraces read as 3-storey
    "bukit-indah-terrace_alt": 3,
  };
  // deterministic display type + built-up + psf
  function displayType(p) {
    const s = STOREY[p.slug] || 2;
    if (p.propertyType.startsWith("Terrace")) return "Terrace " + s + "-storey";
    if (p.propertyType.startsWith("Shop")) return "Shop " + s + "-storey";
    return p.propertyType;
  }
  function builtUpFor(p) {
    const t = displayType(p), m = p.netMedian;
    if (t === "Service apartment / condo") return 700 + Math.round(m / 8);
    if (t === "Terrace 2-storey") return 1750 + Math.round(m / 4);
    if (t === "Terrace 3-storey") return 2550 + Math.round(m / 5);
    if (t === "Semi-D")           return 3100 + Math.round(m / 3);
    if (t === "Bungalow")         return 4800 + Math.round(m / 3);
    if (t === "Shop 2-storey")    return 2900 + Math.round(m / 10);
    if (t === "Shop 3-storey")    return 4300 + Math.round(m / 10);
    return 1500;
  }
  const psfOf = (netK, builtUp) => Math.round((netK * 1000) / builtUp);

  // per-record submissions: floor bands for high-rise, lot positions for landed
  function buildSubmissions(p) {
    const isHighrise = p.dType === "Service apartment / condo";
    const roles = ["buyer", "investor", "agent", "tenant"];
    const txns = ["New launch", "Subsale", "Subsale", "Subsale"];
    const out = [];
    // small deterministic PRNG so the same project always builds the same set
    let s = 0; for (let i = 0; i < p.slug.length; i++) s = (s * 31 + p.slug.charCodeAt(i)) % 100000;
    const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };

    if (isHighrise) {
      // deterministic building profile
      const tProfiles = [
        { towers: 1, top: 28 }, { towers: 2, top: 34 }, { towers: 3, top: 40 },
        { towers: 4, top: 38 }, { towers: 2, top: 44 }, { towers: 1, top: 22 },
      ];
      const prof = tProfiles[s % tProfiles.length];
      p.towers = prof.towers;
      p.totalFloors = prof.top;
      // total units across the whole development (units/floor × floors × towers)
      const unitsPerFloor = 6 + (s % 7); // 6–12
      p.totalUnits = unitsPerFloor * prof.top * prof.towers;
      p.unitsPerFloor = unitsPerFloor;

      // generate ~22 transactions spread across floors & towers
      const N = 22;
      const ym = ["2026-05", "2026-04", "2026-03", "2026-02", "2026-01", "2025-12", "2025-11",
        "2025-10", "2025-09", "2025-08", "2025-07", "2025-06", "2025-05", "2025-04",
        "2025-03", "2025-02", "2025-01", "2024-12", "2024-11", "2024-10", "2024-09", "2024-08"];
      const units = ["Studio", "1BR", "2BR", "2BR", "3BR"];
      for (let i = 0; i < N; i++) {
        const fl = 3 + Math.floor(rnd() * (prof.top - 3)); // floor 3..top
        const tFrac = (fl - 3) / Math.max(1, prof.top - 3); // higher floor → higher price
        const net = Math.round(p.netMin + (p.netMax - p.netMin) * (0.15 + 0.8 * tFrac + (rnd() - 0.5) * 0.12));
        const bu = Math.round(p.builtUp * (0.9 + 0.18 * rnd()));
        const tower = 1 + Math.floor(rnd() * prof.towers);
        const band = fl <= prof.top * 0.33 ? "Low" : fl <= prof.top * 0.66 ? "Mid" : "High";
        out.push({
          group: "Level " + fl,
          sub: "Level " + fl + " of " + prof.top + (prof.towers > 1 ? " · Tower " + tower + "/" + prof.towers : "") + " · " + band + " floor",
          floor: fl, totalFloors: prof.top, tower, towers: prof.towers,
          unit: units[Math.floor(rnd() * units.length)],
          builtUp: bu, net: Math.max(p.netMin, Math.min(p.netMax, net)), psf: psfOf(net, bu),
          rebate: 4 + Math.floor(rnd() * 8), legal: rnd() > 0.4, furnished: rnd() > 0.55,
          txn: txns[Math.floor(rnd() * txns.length)],
          role: roles[Math.floor(rnd() * roles.length)], date: ym[i % ym.length],
        });
      }
      // newest first by floor-agnostic date order already roughly descending
      out.sort((a, b) => (a.date < b.date ? 1 : -1));
    } else {
      const lots = [
        { group: "Intermediate", t: 0.0,  buK: 1.0 },
        { group: "End lot",      t: 0.5,  buK: 1.12 },
        { group: "Corner lot",   t: 1.0,  buK: 1.35 },
      ];
      const dates = ["2026-04", "2026-01", "2025-10", "2025-07", "2025-03"];
      lots.forEach((l, i) => {
        const net = Math.round(p.netMin + (p.netMax - p.netMin) * l.t);
        const bu = Math.round(p.builtUp * l.buK);
        out.push({
          group: l.group + " " + p.dType.toLowerCase(),
          sub: i === 0 ? "Standard frontage" : i === 1 ? "Extra side land" : "Double frontage, largest land",
          builtUp: bu, net, psf: psfOf(net, bu),
          rebate: 5 + i * 2, legal: i >= 1, furnished: i >= 1,
          condition: i === 0 ? "Original" : i === 1 ? "Lightly renovated" : "Renovated + extended",
          role: roles[(i + 1) % roles.length], date: dates[i + 1],
        });
      });
    }
    return out;
  }

  // augment every project in place
  PROJECTS.forEach(p => {
    p.dType = displayType(p);
    p.isLanded = !(p.dType === "Service apartment / condo");
    p.builtUp = builtUpFor(p);
    p.psf = psfOf(p.netMedian, p.builtUp);
    p.psfMin = psfOf(p.netMin, Math.round(p.builtUp * 1.08));
    p.psfMax = psfOf(p.netMax, Math.round(p.builtUp * 0.94));
    p.submissions = buildSubmissions(p);
  });


  // ── Aggregates (always over the FULL dataset) ──────────────────
  const dirOf = (id) => DIRECTIONS.find(d => d.id === id);
  const projectsInDirection = (id) => PROJECTS.filter(p => p.direction === id);

  // property-type summary rows for a direction's card (full: min/max net, built-up, psf)
  function propertyTypeTable(dirId) {
    const projs = projectsInDirection(dirId);
    return DISPLAY_TYPES.map(type => {
      const rows = projs.filter(p => p.dType === type);
      if (!rows.length) return null;
      const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
      return {
        type,
        netMin: Math.min(...rows.map(r => r.netMin)),
        netMax: Math.max(...rows.map(r => r.netMax)),
        avgBuiltUp: avg(rows.map(r => r.builtUp)),
        avgPsf: avg(rows.map(r => r.psf)),
        discMin: Math.min(...rows.map(r => r.discAvg)),
        discMax: Math.max(...rows.map(r => r.discAvg)),
        count: rows.length,
      };
    }).filter(Boolean);
  }

  // cross-compare property type × direction (spec 1.4) — psf matrix + verdicts
  function comparisonGrid() {
    const matrix = DISPLAY_TYPES.map(type => {
      const cells = DIRECTIONS.map(d => {
        const rows = projectsInDirection(d.id).filter(p => p.dType === type);
        if (!rows.length) return { dir: d, has: false };
        const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
        return {
          dir: d, has: true,
          avgPsf: avg(rows.map(r => r.psf)),
          avgBuiltUp: avg(rows.map(r => r.builtUp)),
          netMin: Math.min(...rows.map(r => r.netMin)),
          netMax: Math.max(...rows.map(r => r.netMax)),
        };
      });
      const present = cells.filter(c => c.has);
      let cheapest = null, dearest = null;
      if (present.length) {
        cheapest = present.reduce((a, b) => (b.avgPsf < a.avgPsf ? b : a));
        dearest = present.reduce((a, b) => (b.avgPsf > a.avgPsf ? b : a));
      }
      return { type, cells, cheapest, dearest };
    });
    return matrix;
  }


  function directionStat(dirId) {
    const projs = projectsInDirection(dirId);
    const records = projs.reduce((s, p) => s + p.records, 0);
    const disc = projs.length ? Math.round(projs.reduce((s, p) => s + p.discAvg, 0) / projs.length) : 0;
    return { count: projs.length, records, discAvg: disc };
  }

  // persona KPIs for the home tiles
  function personaKPIs() {
    const all = PROJECTS;
    const buyerDisc = (all.reduce((s, p) => s + p.discAvg, 0) / all.length);
    const withYield = all.filter(p => p.gyield);
    const med = (arr) => { const s = [...arr].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
    const medYield = med(withYield.map(p => p.gyield));
    const strong = all.filter(p => p.records >= 5).length;
    return {
      buyerDisc: buyerDisc.toFixed(1),
      medYield: medYield.toFixed(1),
      strongComparables: strong,
      totalProjects: all.length,
    };
  }

  // budget helper — groups matches by direction, each project carries type/built-up/psf
  function budgetMatch(mode, budget, dirId) {
    let pool = PROJECTS.filter(p => p.netMedian <= budget);
    if (dirId && dirId !== "any") pool = pool.filter(p => p.direction === dirId);
    if (mode === "investor") pool = pool.filter(p => p.gyield && p.gyield >= 4.5);
    const groups = {};
    pool.forEach(p => { (groups[p.direction] = groups[p.direction] || []).push(p); });
    return DIRECTIONS
      .filter(d => groups[d.id])
      .map(d => ({
        dir: d,
        // within a direction, group by display property type
        byType: DISPLAY_TYPES.map(t => {
          const rows = groups[d.id].filter(p => p.dType === t);
          if (!rows.length) return null;
          const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
          return {
            type: t, count: rows.length,
            medianNet: avg(rows.map(r => r.netMedian)),
            avgBuiltUp: avg(rows.map(r => r.builtUp)),
            avgPsf: avg(rows.map(r => r.psf)),
            projects: rows.sort((a, b) => (mode === "investor" ? b.gyield - a.gyield : a.netMedian - b.netMedian)),
          };
        }).filter(Boolean),
      }));
  }

  // contribution gating (spec 2.2) — submit one deal, unlock full transaction
  // access across ALL projects for 30 days. Cross-project, not per-project.
  const UNLOCK_MS = 30 * 24 * 60 * 60 * 1000;
  function contributionMs() {
    try { const v = localStorage.getItem("propx_last_submit"); return v ? +v : 0; } catch { return 0; }
  }
  function hasContributed() {
    return (Date.now() - contributionMs()) < UNLOCK_MS;
  }
  function unlockDaysLeft() {
    const ms = contributionMs(); if (!ms) return 0;
    const left = UNLOCK_MS - (Date.now() - ms);
    return Math.max(0, Math.ceil(left / (24 * 60 * 60 * 1000)));
  }
  function markContributed() {
    try { localStorage.setItem("propx_last_submit", String(Date.now())); localStorage.setItem("propx_contributed", "1"); } catch {}
  }


  function neighbourhoodSummary(p) {
    const n = p.neighbourhood; if (!n) return "";
    const bits = [];
    if (n.schools && n.schools !== "—") bits.push("Schools: " + n.schools);
    if (n.mall && n.mall !== "—") bits.push("Mall: " + n.mall + (n.mallMins ? " (" + n.mallMins + " mins)" : ""));
    if (n.parks && n.parks !== "—") bits.push("Parks: " + n.parks);
    if (n.hospital && n.hospital !== "—") bits.push("Hospital: " + n.hospital + (n.hospitalMins ? " (" + n.hospitalMins + " mins)" : ""));
    bits.push("Safety: " + n.safety.toFixed(1) + "/5 (" + n.safetyN + " ratings)");
    return bits.join(" · ");
  }

  // ── Global community deals (spec: cross-project "Recorded deals") ──
  // Flatten every project's submissions into individual deal rows with the
  // fields the Explore table needs. Newest first. Deterministic order.
  const UNIT_BY_BU = (bu, isLanded) => {
    if (isLanded) return bu > 3600 ? "Bungalow" : bu > 2600 ? "Semi-D" : "Terrace";
    return bu < 600 ? "Studio" : bu < 850 ? "1BR" : bu < 1100 ? "2BR" : "3BR";
  };
  function buildGlobalDeals() {
    const rows = [];
    PROJECTS.forEach(p => {
      (p.submissions || []).forEach((s, i) => {
        const disc = p.spaMin ? Math.round((1 - s.net / Math.round(s.net / (1 - p.discAvg / 100))) * 1000) / 10 : p.discAvg;
        const spa = Math.round(s.net / (1 - p.discAvg / 100));
        rows.push({
          id: p.slug + "-" + i,
          slug: p.slug,
          project: p.name,
          area: p.corridor,
          direction: p.direction,
          dirCompass: (DIRECTIONS.find(d => d.id === p.direction) || {}).compass || "",
          txn: i === 0 ? "New launch" : i === 1 ? "Subsale" : "Subsale",
          date: s.date,
          unit: UNIT_BY_BU(s.builtUp, p.isLanded),
          size: s.builtUp,
          spa,
          net: s.net,
          discount: Math.round((1 - s.net / spa) * 1000) / 10,
          source: s.role === "tenant" ? "Other" : s.role === "agent" ? "Agent" : "Buyer",
        });
      });
    });
    // sort newest first (date desc), stable by id
    return rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (a.id < b.id ? -1 : 1)));
  }
  const ALL_DEALS = buildGlobalDeals();

  function dealsSummary(rows) {
    if (!rows.length) return { count: 0 };
    const nets = rows.map(r => r.net), spas = rows.map(r => r.spa), discs = rows.map(r => r.discount);
    const med = (arr) => { const s = [...arr].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
    return {
      count: rows.length,
      netMin: Math.min(...nets), netMax: Math.max(...nets), netMed: med(nets),
      spaMin: Math.min(...spas), spaMax: Math.max(...spas), spaMed: med(spas),
      discMed: med(discs),
    };
  }

  const FREE_LIMIT = 30;

  // ── Floor premium (high-rise): RM added per floor up ───────────
  // Linear fit of net price (RM k) against floor across a project's
  // submissions. Returns null for landed.
  function floorPremium(p) {
    if (p.isLanded || !p.submissions) return null;
    const pts = p.submissions.filter(s => s.floor).map(s => [s.floor, s.net]);
    if (pts.length < 3) return null;
    const n = pts.length;
    const sx = pts.reduce((a, [x]) => a + x, 0);
    const sy = pts.reduce((a, [, y]) => a + y, 0);
    const sxy = pts.reduce((a, [x, y]) => a + x * y, 0);
    const sxx = pts.reduce((a, [x]) => a + x * x, 0);
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx); // RM k per floor
    const floors = pts.map(p => p[0]);
    const lo = Math.min(...floors), hi = Math.max(...floors);
    return {
      perFloor: Math.max(0, Math.round(slope * 1000)),   // RM per floor
      lo, hi,
      spread: Math.round(slope * (hi - lo) * 1000),       // RM low→high
    };
  }

  // ── Discount trend over time (per project) ─────────────────────
  // Illustrative: rebates tend to grow as a project ages / nears sell-out.
  // Anchored so the latest year equals the project's current avg discount.
  function discountTrend(p) {
    const endYear = 2026;
    const years = [2023, 2024, 2025, 2026];
    let s = 0; for (let i = 0; i < p.slug.length; i++) s = (s * 31 + p.slug.charCodeAt(i)) % 100000;
    const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    const end = p.discAvg;
    const start = Math.max(3, Math.round(end * (0.5 + rnd() * 0.15))); // ~50–65% of today
    return years.map((y, i) => {
      const t = i / (years.length - 1);
      const base = start + (end - start) * t;
      const noise = i === years.length - 1 ? 0 : (rnd() - 0.5) * 1.6;
      return { year: y, disc: Math.max(2, Math.round((base + noise) * 10) / 10) };
    }).map((d, i, arr) => (i === arr.length - 1 ? { year: d.year, disc: end } : d));
  }

  // ── Furnishing value estimate (RM) by display type ─────────────
  function furnishingValue(p) {
    const t = p.dType;
    if (t === "Service apartment / condo") return p.netMedian > 800 ? 45000 : 28000;
    if (t.startsWith("Terrace")) return 35000;
    if (t === "Semi-D") return 60000;
    if (t === "Bungalow") return 90000;
    return 20000;
  }

  // ── "Ask the community" — seeded anonymous threads ─────────────
  const COMMUNITY_THREADS = [
    { id: "t1", slug: "rf-princess-cove", role: "Buyer", when: "3 days ago",
      q: "Offered R&F Princess Cove 2BR (≈710 sf) at RM 600k with RM 80k cash rebate. Fair, or can I push more?",
      tags: ["South / Core", "New launch"],
      replies: [
        { who: "Contract-backed buyer", badge: "Evidence-backed", when: "2 days ago", text: "Got mine in 2025 at net ~RM 540k for a similar mid-floor 2BR. RM 600k after an 80k rebate sounds high — that's roughly net 520k, which is OK, but ask for absorbed legal + 1 year maintenance on top." },
        { who: "Agent", badge: "Context-supported", when: "1 day ago", text: "Stack and floor matter a lot here. High floor harbour-facing commands a premium; low floor you should get more rebate. RM 600k headline is negotiable in this market." },
      ] },
    { id: "t2", slug: "forest-city-phoenix", role: "Investor", when: "1 week ago",
      q: "Forest City Phoenix — agent quoting 28% rebate. Is the net price actually sustainable for rental?",
      tags: ["West", "Yield"],
      replies: [
        { who: "Investor", badge: "Community-contributed", when: "5 days ago", text: "Rebate is real but occupancy/rental demand is the risk, not the entry price. Model your yield on conservative rent." },
      ] },
    { id: "t3", slug: "austin-perdana-terrace", role: "Buyer", when: "2 weeks ago",
      q: "End-lot 2-storey terrace in Austin Perdana — how much premium over intermediate is normal?",
      tags: ["East", "Landed"],
      replies: [
        { who: "Agent", badge: "Cross-checked", when: "12 days ago", text: "Typically 10–18% over intermediate depending on extra land width. Corner can be 30%+." },
      ] },
  ];

  Object.assign(window, {
    DIRECTIONS, PROP_TYPES, DISPLAY_TYPES, JB_PROJECTS: PROJECTS,
    dirOf, projectsInDirection, propertyTypeTable, directionStat,
    personaKPIs, budgetMatch, neighbourhoodSummary,
    comparisonGrid, hasContributed, markContributed, unlockDaysLeft,
    ALL_DEALS, dealsSummary, FREE_LIMIT,
    floorPremium, discountTrend, furnishingValue, COMMUNITY_THREADS,
  });

})();
