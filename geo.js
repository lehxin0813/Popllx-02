// PropX Apple kit — JB geographic hierarchy + schematic map geometry
// Zone → corridor → cluster → project, plus key market anchors.
// Map coordinate system: 1000 × 640 viewBox.

window.JB_GEO = {
  viewBox: "0 0 1000 640",
  // map default view
  mapCenter: [1.492, 103.755],
  mapZoom: 11,

  zones: [
    {
      id: "city-waterfront",
      tag: "Zone 1",
      name: "City Centre & Waterfront",
      blurb: "JB's RTS-anchored core. The Causeway, CIQ and the new RTS terminal sit here — the highest-demand, highest-price corridor in the state.",
      district: "Daerah Johor Bahru",
      mukims: ["Mukim Bandar Johor Bahru", "Bukit Chagar"],
      color: "#0071e3",
      colorSoft: "#e3f0fd",
      latlng: [1.4695, 103.748],
      zoom: 13,
      areaKeys: ["JB CIQ", "Danga Bay"],
      corridors: [
        { name: "JB City Core / CIQ", clusters: ["CIQ Waterfront", "Bukit Chagar (RTS)", "Bukit Senyum", "Wadi Hana", "Taman Pelangi"], areaKeys: ["JB CIQ"] },
        { name: "Danga Bay Waterfront", clusters: ["Danga Bay Promenade", "Country Garden", "Tebrau Bay"], areaKeys: ["Danga Bay"] },
      ],
      anchors: ["RTS Link (2027)", "CIQ / Causeway", "KSL City Mall", "KPJ Specialist Hospital"],
    },
    {
      id: "western-iskandar",
      tag: "Zone 3",
      name: "Western JB / Iskandar Puteri",
      blurb: "The planned-city zone: Second Link, EduCity, Kota Iskandar government hub and the JS-SEZ flagship sites. Lower density, longer commutes, bigger discounts.",
      district: "Daerah Iskandar Puteri + Daerah Pontian",
      mukims: ["Mukim Pulai", "Mukim Sungai Skudai", "Mukim Gelang Patah (Pontian)"],
      color: "#5e5ce6",
      colorSoft: "#ececfb",
      latlng: [1.422, 103.642],
      zoom: 13,
      areaKeys: ["Puteri Harbour", "Iskandar Puteri", "Bukit Indah"],
      corridors: [
        { name: "Nusajaya / Iskandar Puteri", clusters: ["Puteri Harbour", "Medini", "Nusajaya", "Kota Iskandar", "EduCity"], areaKeys: ["Puteri Harbour", "Iskandar Puteri"] },
        { name: "Bukit Indah / Gelang Patah", clusters: ["Bukit Indah", "Forest City", "Gelang Patah"], areaKeys: ["Bukit Indah"] },
      ],
      anchors: ["Second Link (Tuas)", "EduCity universities", "Legoland Malaysia", "JS-SEZ flagship sites"],
    },
    {
      id: "eastern-midring",
      tag: "Zone 2",
      name: "Eastern / Mid-Ring Suburbs",
      blurb: "Mature family suburbs along the Tebrau corridor — owner-occupier heavy, stable rents, the everyday JB market away from the waterfront premium.",
      district: "Daerah Johor Bahru",
      mukims: ["Mukim Tebrau", "Mukim Plentong", "Mukim Sungai Tiram"],
      color: "#1f8a5b",
      colorSoft: "#e1f3ea",
      latlng: [1.545, 103.788],
      zoom: 13,
      areaKeys: ["Mount Austin", "Tebrau", "Adda Heights"],
      corridors: [
        { name: "Tebrau Corridor", clusters: ["Mount Austin", "Setia Tropika", "Adda Heights", "Austin Heights"], areaKeys: ["Mount Austin", "Tebrau"] },
        { name: "Permas / Molek", clusters: ["Taman Molek", "Permas Jaya", "Bandar Baru Permas"], areaKeys: [] },
      ],
      anchors: ["AEON Tebrau City", "Tebrau Highway", "Hospital Sultan Ismail"],
    },
    {
      id: "eastern-industrial",
      tag: "Zone 4",
      name: "Eastern Industrial Corridor",
      blurb: "Port and industry — Pasir Gudang, Masai, Seri Alam. Yield-driven, tenant pool tied to employment nodes rather than the Singapore commute.",
      district: "Daerah Kota Tinggi",
      mukims: ["Mukim Plentong", "Pasir Gudang", "Tanjung Langsat"],
      color: "#d97706",
      colorSoft: "#fbe6d2",
      latlng: [1.468, 103.895],
      zoom: 13,
      areaKeys: ["Pasir Gudang", "Masai"],
      corridors: [
        { name: "Pasir Gudang / Masai", clusters: ["Bandar Seri Alam", "Masai", "Tanjung Langsat", "Kong Kong"], areaKeys: ["Pasir Gudang"] },
      ],
      anchors: ["Pasir Gudang Port", "Senai–Desaru Expressway", "Industrial employment nodes"],
    },
    {
      id: "northern",
      tag: "Zone 5",
      name: "Northern Corridor",
      blurb: "The airport and logistics belt — Senai, Kulai, Indahpura. Earliest-stage market, cheapest entry, growth tied to JS-SEZ industrial spillover.",
      district: "Daerah Kulai",
      mukims: ["Mukim Senai", "Bandar Kulai", "Skudai / UTM"],
      color: "#be123c",
      colorSoft: "#fae0e6",
      latlng: [1.652, 103.642],
      zoom: 12,
      areaKeys: ["Senai", "Kulai", "Saujana"],
      corridors: [
        { name: "Senai / Kulai", clusters: ["Senai", "Kulai", "Indahpura", "Bandar Putra", "Skudai / UTM"], areaKeys: ["Senai", "Kulai"] },
      ],
      anchors: ["Senai International Airport", "North–South Highway", "Sedenak Tech Park (JS-SEZ)"],
    },
  ],

  // key infrastructure anchors (real JB coordinates)
  anchors: [
    { id: "rts",        label: "RTS Link",          type: "transport", latlng: [1.4628, 103.7668] },
    { id: "ciq",        label: "CIQ / Causeway",    type: "transport", latlng: [1.4548, 103.7686] },
    { id: "secondlink", label: "Second Link",       type: "transport", latlng: [1.3530, 103.6360] },
    { id: "senai",      label: "Senai Airport",     type: "transport", latlng: [1.6410, 103.6700] },
    { id: "educity",    label: "EduCity",           type: "node",      latlng: [1.4250, 103.6080] },
    { id: "aeon",       label: "AEON Tebrau City",  type: "node",      latlng: [1.5430, 103.7960] },
    { id: "port",       label: "Pasir Gudang Port", type: "node",      latlng: [1.4400, 103.8900] },
    { id: "ksl",        label: "KSL City Mall",     type: "node",      latlng: [1.4830, 103.7620] },
  ],

  // tracked-project coordinates (real JB locations; ~15 PRECISE, rest APPROX township centroids)
  projectCoords: {
    "rf-princess-cove": [1.46057,103.77356], "the-astaka": [1.47357,103.76443],
    "suasana-iskandar": [1.46050,103.76200], "country-garden-danga-bay": [1.46327,103.73073],
    "setia-sky-88": [1.47712,103.76060], "twin-galaxy-residences": [1.47783,103.76214],
    "rf-princess-cove-p2": [1.46057,103.77356], "mbw-city-veranda-2": [1.46200,103.77200],
    "causewayz-square-exsim": [1.46300,103.76500], "aethera-residence": [1.46000,103.76000],
    "arden-by-astaka": [1.47357,103.76443], "mbw-bay-danga": [1.46200,103.77200],
    "tropicana-danga-bay": [1.47904,103.72332], "danga-view-apartment": [1.47200,103.72000],
    "adison-west-larkinton": [1.49530,103.75510], "joland-ciq-condo": [1.46400,103.77100],
    "casa-almyra-danga": [1.46000,103.76000], "kprj-danga-bay": [1.47200,103.72000],
    "rf-princess-cove-mercu-3": [1.46057,103.77356], "daya-1-residences": [1.55140,103.75950],
    "puncak-premium": [1.46000,103.76000], "paragon-signature-suites": [1.46100,103.75900],
    "asteriaz-kebun-teh": [1.47500,103.76800], "summer-suites-bukit-meldrum": [1.46200,103.77200],
    "seri-austin-shoppes": [1.57916,103.74924], "austin-perdana-terrace": [1.54763,103.78165],
    "mount-austin-semid": [1.56500,103.78000], "setia-tropika-bungalow": [1.55000,103.70000],
    "molek-pine-condo": [1.52758,103.78474], "havona-mount-austin": [1.56080,103.78190],
    "ecospring-duduk-santai": [1.58824,103.75845], "m-minori": [1.56200,103.78300],
    "bae-bandar-dato-onn": [1.56060,103.73711], "desa-tebrau-harp": [1.55500,103.76500],
    "dambience-residences": [1.50200,103.82200], "the-wateredge-senibong": [1.48900,103.81800],
    "straits-view-condo": [1.49000,103.82000], "senibong-cove": [1.48800,103.81680],
    "hillview-senibong-cove": [1.48800,103.81680], "m-aurora-mount-austin": [1.56100,103.78200],
    "austin-duta-ijm": [1.56300,103.78400], "nasa-city-desa-palma": [1.56400,103.78500],
    "eco-summer-tebrau": [1.58840,103.75984], "crest-at-austin": [1.56000,103.78100],
    "ksl-daya-residences": [1.55140,103.75950], "taman-rinting-plenitude": [1.51000,103.80000],
    "ulu-tiram-plenitude": [1.59000,103.82000], "ksl-city-residences": [1.53000,103.68000],
    "sierra-square-mahsing": [1.56000,103.77000], "meridin-bayvue": [1.49600,103.88200],
    "premium-height-dato-onn": [1.56000,103.77500], "the-kews-senibong": [1.49000,103.82000],
    "parkland-plentong": [1.51500,103.80500], "bandar-dato-onn-p13": [1.56060,103.73711],
    "austin-duta-maison-parc": [1.56300,103.78400], "bandar-tiram-3": [1.59000,103.82000],
    "ksl-austin-legacy": [1.56100,103.78200], "kempas-indah-2": [1.58000,103.74000],
    "taman-sentosa-4": [1.48500,103.74500], "aliva-mount-austin": [1.56200,103.78300],
    "tanjong-puteri-resort": [1.46500,103.78000], "bdo-p14-flexihome-1": [1.56060,103.73711],
    "bdo-p8-master": [1.56060,103.73711], "aurinia": [1.55000,103.70000],
    "calliandra-setia-tropika": [1.55000,103.70000], "laman-aluvium": [1.55000,103.70000],
    "longevia": [1.55000,103.70000], "residensi-sinaran": [1.55500,103.76000],
    "sunway-lenang-heights-p1": [1.54000,103.77000], "laman-permata": [1.55500,103.76500],
    "ksl-bukit-gemilang": [1.56000,103.76000], "pinegate-residency": [1.55500,103.76500],
    "residensi-ponderosa": [1.55500,103.76000], "senyum-residences": [1.59000,103.82000],
    "parkland-river-permas-p2": [1.50200,103.82200],
    "teega-suites": [1.41490,103.65356], "forest-city-phoenix": [1.33500,103.59100],
    "horizon-hills-semid": [1.50137,103.64386], "horizon-hills-bungalow": [1.50137,103.64386],
    "bukit-indah-terrace": [1.47999,103.65959], "medini-meridin": [1.42796,103.63464],
    "mansion18-horizon-hills": [1.50137,103.64386], "morrinsville-horizon-hills": [1.50137,103.64386],
    "sky-executive-suites-bukit-indah": [1.48000,103.66000], "the-seed-sutera": [1.52000,103.66000],
    "garden-residences-mutiara-mas": [1.53000,103.65000], "ksl-riveria-garden": [1.44000,103.63000],
    "bee-iskandar-puteri": [1.44000,103.62000], "riverhaus-wawari": [1.44000,103.63000],
    "sunway-sakura-p2": [1.38866,103.62570], "forest-city-island2": [1.33500,103.59100],
    "eco-botanic": [1.44011,103.61836], "eco-botanic-2": [1.44011,103.61836],
    "eco-botanic-3": [1.44011,103.61836], "aspira-hills-uem": [1.41000,103.60000],
    "setia-eco-cascadia": [1.55000,103.72000], "setia-eco-gardens": [1.49400,103.58240],
    "sunway-iskandar": [1.38866,103.62570], "east-ledang-uem": [1.42148,103.61657],
    "wawari-west-park-homes": [1.44000,103.63000], "serimbun-uem": [1.42000,103.62000],
    "aspira-lakehomes": [1.41000,103.60000], "nadi-nusantara-2": [1.42000,103.62000],
    "sky-estadia-medini": [1.48000,103.66000], "palazio-sunway": [1.48000,103.66000],
    "the-trilinq-sunway": [1.48000,103.66000], "pangsapuri-iskandar-perdana": [1.47000,103.60000],
    "laman-tasik-aspira": [1.41000,103.60000], "pangsapuri-sutera": [1.52000,103.66000],
    "taman-nusa-melati": [1.43000,103.62000], "pisonia-ville": [1.44000,103.62000],
    "gen-rise": [1.43000,103.62000], "gen-sphere": [1.43000,103.62000],
    "alam-sutera": [1.52000,103.66000], "laman-bukit": [1.48000,103.66000],
    "residensi-kaze": [1.52000,103.66000], "glenmarie-johor-1d-1": [1.55000,103.72000],
    "glenmarie-johor-1d-2": [1.55000,103.72000],
    "bandar-seri-alam-terrace": [1.49600,103.88200], "scientex-pasir-gudang": [1.50833,103.91201],
    "midas-seri-alam": [1.49600,103.88200], "amansari-residence": [1.49600,103.88200],
    "eco-tropics-pasir-gudang": [1.49104,103.93047], "meridin-east-pg": [1.50500,103.94000],
    "ekotropika-10": [1.49104,103.93047], "meridin-east-jasmine-2": [1.50500,103.94000],
    "taman-pulau-emas": [1.49000,103.90000],
    "bandar-putra-terrace": [1.65639,103.63192], "indahpura-semid": [1.66171,103.63888],
    "scientex-pulai-mutiara": [1.55000,103.60000], "citrine-hills-bbkp": [1.55900,103.59000],
    "genting-indahpura": [1.66171,103.63888], "m-senai-mahsing": [1.59360,103.64590],
    "residensi-saujana-2": [1.55900,103.59000], "bbkp-master": [1.55917,103.58983],
  },
  // PRECISE (verified building GPS); all others are township/area centroids (APPROX).
  preciseCoords: ["rf-princess-cove","the-astaka","country-garden-danga-bay","setia-sky-88","twin-galaxy-residences","rf-princess-cove-p2","arden-by-astaka","tropicana-danga-bay","rf-princess-cove-mercu-3","molek-pine-condo","ecospring-duduk-santai","eco-summer-tebrau","teega-suites","medini-meridin","eco-botanic","eco-botanic-2","east-ledang-uem","bandar-putra-terrace"],
};

// Keep zones in official numeric order regardless of source order above
window.JB_GEO.zones.sort((a, b) => parseInt(a.tag.replace(/\D/g, ""), 10) - parseInt(b.tag.replace(/\D/g, ""), 10));

// Corridor/area centroids (real JB locations) — fallback for projects
// without an explicit entry in projectCoords.
window.JB_GEO.corridorCoords = {
  "JB City Core / CIQ":        [1.4615, 103.7625],
  "Danga Bay Waterfront":      [1.4745, 103.7300],
  "Tebrau Corridor":           [1.5430, 103.7900],
  "Permas / Molek":            [1.5010, 103.8170],
  "Nusajaya / Iskandar Puteri":[1.4220, 103.6420],
  "Bukit Indah / Gelang Patah":[1.4530, 103.6420],
  "Horizon Hills / Bukit Indah":[1.4490, 103.6360],
  "Pasir Gudang / Masai":      [1.4680, 103.8950],
  "Senai / Kulai":             [1.6520, 103.6420],
};

// Deterministic per-project lat/lng: exact coord if known, else corridor
// centroid + a small slug-seeded offset so markers don't stack.
window.projectLatLng = function(proj) {
  const exact = window.JB_GEO.projectCoords[proj.slug];
  if (exact) return exact;
  const base = window.JB_GEO.corridorCoords[proj.corridor] || window.JB_GEO.corridorCoords[proj.area] || [1.49, 103.74];
  let h = 0; for (let i = 0; i < proj.slug.length; i++) h = (h * 31 + proj.slug.charCodeAt(i)) >>> 0;
  // Tight slug-seeded scatter (~±0.5 km) so markers don't stack but never
  // drift off-corridor into the Johor Strait or across into Singapore.
  const jLat = (((h % 1000) / 1000) - 0.5) * 0.012;
  const jLng = ((((h >> 10) % 1000) / 1000) - 0.5) * 0.012;
  let lat = base[0] + jLat;
  const lng = base[1] + jLng;
  // Hard clamp: nothing south of the JB shoreline (the strait / Woodlands
  // begin around 1.45) so coastal projects stay on the mainland.
  if (lat < 1.452) lat = 1.452;
  return [lat, lng];
};


// Choropleth zone cover — the five zones TILE the whole visible frame with
// no gaps. Adjacent zones share identical edge vertices (a vertex reused by
// two polygons = a shared border, no unlabelled strip between them). Interior
// dividers undulate along real features (Sungai Skudai / Second Link approach
// for West|Core, Sungai Tebrau for Core|East, the coastal highway + Johor
// river mouth for East|South-East); the North|south divider follows the
// Skudai valley / Senai district line. Frame: lat 1.28–1.78, lng 103.48–104.05.
window.JB_GEO.zonePolygons = {
  // NORTH — Kulai / Senai / Skudai upper; touches top of frame
  "northern": [
    [1.78,103.48],[1.585,103.48],[1.578,103.60],[1.592,103.66],[1.600,103.74],
    [1.588,103.80],[1.590,103.90],[1.590,104.05],[1.78,104.05],
  ],
  // WEST — Iskandar Puteri / Second Link / Pekan Nanas–Kukup coast; touches Malacca Strait
  "western-iskandar": [
    [1.585,103.48],[1.578,103.60],[1.592,103.66],[1.520,103.655],[1.450,103.660],
    [1.350,103.665],[1.280,103.670],[1.280,103.48],
  ],
  // SOUTH / CORE — city, CIQ, waterfront; touches the Straits of Johor
  "city-waterfront": [
    [1.592,103.66],[1.600,103.74],[1.588,103.80],[1.530,103.795],[1.500,103.800],
    [1.440,103.805],[1.280,103.810],[1.280,103.670],[1.350,103.665],[1.450,103.660],[1.520,103.655],
  ],
  // EAST — Tebrau / Ulu Tiram; extends to the eastern frame edge
  "eastern-midring": [
    [1.588,103.80],[1.590,103.90],[1.590,104.05],[1.470,104.050],[1.485,103.900],
    [1.500,103.800],[1.530,103.795],
  ],
  // SOUTH-EAST — Pasir Gudang / port; Singapore-facing SE coastline
  "eastern-industrial": [
    [1.500,103.800],[1.440,103.805],[1.280,103.810],[1.280,104.05],[1.470,104.050],[1.485,103.900],
  ],
};

// Label pill anchor = geographic centroid of each polygon (never on a landmark)
window.JB_GEO.zoneCentroids = {
  "northern": [1.688, 103.76],
  "western-iskandar": [1.435, 103.575],
  "city-waterfront": [1.452, 103.732],
  "eastern-midring": [1.548, 103.895],
  "eastern-industrial": [1.382, 103.905],
};

// One key landmark per zone (trimmed from the full anchor list so the map
// stays legible — top transport/anchor only).
window.JB_GEO.keyLandmarks = [
  { label: "RTS Link",       latlng: [1.4628, 103.7668] },
  { label: "AEON Tebrau",    latlng: [1.5430, 103.7960] },
  { label: "Second Link",    latlng: [1.3530, 103.6360] },
  { label: "Pasir Gudang Port", latlng: [1.4680, 103.8900] },
  { label: "Senai Airport",  latlng: [1.6410, 103.6700] },
];

// Build zone summaries from APL_PROJECTS (loaded via components.jsx)
window.zoneSummary = function(zone) {
  const projs = (window.APL_PROJECTS || []).filter(p => zone.areaKeys.includes(p.area));
  if (!projs.length) return { projects: [], count: 0 };
  const netMin = Math.min(...projs.map(p => p.netMin));
  const netMax = Math.max(...projs.map(p => p.netMax));
  const discAvg = Math.round(projs.reduce((s, p) => s + p.discAvg, 0) / projs.length);
  return { projects: projs, count: projs.length, netMin, netMax, discAvg };
};

// Group tracked projects by zone (zones already in official numeric order).
// Returns ALL zones — including ones with no tracked projects yet, so the
// home page always shows the full five-zone JB map. Empty zones render a
// "be the first to add a record" state downstream.
window.projectsByZone = function() {
  const projs = window.APL_PROJECTS || [];
  return window.JB_GEO.zones
    .map(z => ({ zone: z, projects: projs.filter(p => z.areaKeys.includes(p.area)) }));
};
