// Apple UI kit — inline SVG imagery for project cards + JB skyline

window.AplImg = {

  // JB skyline silhouette (used as hero background layer)
  jbSkyline() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 300" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
      <g fill="#1d1d1f" opacity="0.06">
        <rect x="60" y="140" width="28" height="160"/>
        <rect x="92" y="100" width="20" height="200"/>
        <rect x="116" y="120" width="36" height="180"/>
        <rect x="156" y="80" width="22" height="220"/>
        <rect x="182" y="50" width="18" height="250"/>
        <rect x="204" y="90" width="30" height="210"/>
        <rect x="238" y="110" width="24" height="190"/>
        <rect x="266" y="130" width="40" height="170"/>
        <rect x="310" y="70" width="16" height="230"/>
        <rect x="330" y="60" width="20" height="240"/>
        <rect x="354" y="100" width="28" height="200"/>
        <rect x="386" y="120" width="14" height="180"/>
        <rect x="404" y="85" width="32" height="215"/>
        <rect x="440" y="110" width="18" height="190"/>
        <rect x="462" y="130" width="26" height="170"/>
        <rect x="640" y="50" width="26" height="250"/>
        <rect x="670" y="30" width="20" height="270"/>
        <rect x="694" y="70" width="34" height="230"/>
        <rect x="732" y="90" width="18" height="210"/>
        <rect x="754" y="110" width="28" height="190"/>
        <rect x="786" y="60" width="16" height="240"/>
        <rect x="806" y="80" width="22" height="220"/>
        <rect x="832" y="100" width="38" height="200"/>
        <rect x="874" y="120" width="14" height="180"/>
        <rect x="892" y="50" width="20" height="250"/>
        <rect x="916" y="140" width="30" height="160"/>
        <rect x="1100" y="100" width="26" height="200"/>
        <rect x="1130" y="70" width="18" height="230"/>
        <rect x="1152" y="90" width="32" height="210"/>
        <rect x="1188" y="110" width="20" height="190"/>
        <rect x="1212" y="50" width="16" height="250"/>
        <rect x="1232" y="80" width="28" height="220"/>
        <rect x="1264" y="120" width="24" height="180"/>
        <rect x="1292" y="140" width="40" height="160"/>
        <rect x="1336" y="60" width="18" height="240"/>
        <rect x="1358" y="100" width="30" height="200"/>
        <rect x="1392" y="120" width="22" height="180"/>
      </g>
    </svg>`;
  },

  // Project card abstract photo — each project gets a seeded colour scheme
  projectPhoto(slug) {
    // Real project renders, when available, override the generated SVG.
    const realPhotos = {
      "adison-west-larkinton": (window.__resources && window.__resources.adisonWest) || "assets/adison-west-larkinton.png",
    };
    if (realPhotos[slug]) {
      return `<img src="${realPhotos[slug]}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
    }
    const palettes = {
      "rf-princess-cove":          { sky: "#c8dcf0", mid: "#7aa8d0", bld: "#4a6fa5", acc: "#e8c84a" },
      "teega-suites":               { sky: "#c0e8f0", mid: "#6ab5c8", bld: "#3a7a8a", acc: "#f0d060" },
      "the-astaka":                 { sky: "#d0c8e8", mid: "#8a78c0", bld: "#4a3a8a", acc: "#f0c040" },
      "tropez-residences":          { sky: "#d8e8c8", mid: "#88b878", bld: "#4a7850", acc: "#e8a840" },
      "country-garden-danga-bay":   { sky: "#f0d8c8", mid: "#d0987a", bld: "#8a5840", acc: "#f0c850" },
      "forest-city-phoenix":        { sky: "#c8e8d8", mid: "#70b898", bld: "#3a7860", acc: "#e8d040" },
      "suasana-iskandar":           { sky: "#d8dce8", mid: "#8898c0", bld: "#4a5888", acc: "#f0b840" },
      "paragon-residences":         { sky: "#e8d8c8", mid: "#c09878", bld: "#806048", acc: "#e8c840" },
    };
    const p = palettes[slug] || { sky: "#d0dce8", mid: "#8898b0", bld: "#485870", acc: "#e8c840" };
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 255" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-${slug}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${p.sky}"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0.4"/>
        </linearGradient>
      </defs>
      <rect width="340" height="255" fill="url(#sky-${slug})"/>
      <!-- water -->
      <ellipse cx="170" cy="270" rx="220" ry="60" fill="${p.mid}" opacity="0.35"/>
      <!-- buildings -->
      <rect x="40" y="110" width="30" height="145" rx="2" fill="${p.bld}" opacity="0.85"/>
      <rect x="74" y="80" width="22" height="175" rx="2" fill="${p.bld}" opacity="0.9"/>
      <rect x="100" y="100" width="40" height="155" rx="2" fill="${p.bld}" opacity="0.75"/>
      <rect x="144" y="60" width="18" height="195" rx="2" fill="${p.bld}" opacity="0.95"/>
      <rect x="166" y="88" width="28" height="167" rx="2" fill="${p.bld}" opacity="0.7"/>
      <rect x="198" y="75" width="20" height="180" rx="2" fill="${p.bld}" opacity="0.85"/>
      <rect x="222" y="105" width="32" height="150" rx="2" fill="${p.bld}" opacity="0.65"/>
      <rect x="258" y="90" width="16" height="165" rx="2" fill="${p.bld}" opacity="0.8"/>
      <rect x="278" y="120" width="24" height="135" rx="2" fill="${p.bld}" opacity="0.7"/>
      <!-- accent dot / sun -->
      <circle cx="290" cy="55" r="18" fill="${p.acc}" opacity="0.7"/>
    </svg>`;
  },

  // JB transformation band scenes — on-brand illustrations (warm, calm)
  transformScene(key) {
    const S = {
      "rts-core": { sky: "#dfeae6", water: "#bcd6cf", bld: "#1f5c52", acc: "#e3b341",
        label: "City core & RTS link", tall: true },
      "iskandar": { sky: "#e4e7f2", water: "#c6cee8", bld: "#2a6fdb", acc: "#7a5cc9",
        label: "Iskandar Puteri", tall: false },
      "austin":   { sky: "#efe7da", water: "#e2d2bb", bld: "#c2872e", acc: "#1f5c52",
        label: "Mount Austin belt", tall: false },
    };
    const p = S[key] || S["rts-core"];
    const towers = p.tall
      ? `<rect x="120" y="60" width="34" height="200" rx="3" fill="${p.bld}"/>
         <rect x="160" y="30" width="26" height="230" rx="3" fill="${p.bld}" opacity="0.9"/>
         <rect x="192" y="80" width="40" height="180" rx="3" fill="${p.bld}" opacity="0.8"/>
         <rect x="240" y="50" width="22" height="210" rx="3" fill="${p.bld}" opacity="0.95"/>
         <rect x="268" y="100" width="34" height="160" rx="3" fill="${p.bld}" opacity="0.75"/>`
      : `<rect x="90" y="150" width="44" height="110" rx="3" fill="${p.bld}" opacity="0.85"/>
         <rect x="140" y="120" width="36" height="140" rx="3" fill="${p.bld}"/>
         <rect x="182" y="140" width="50" height="120" rx="3" fill="${p.bld}" opacity="0.75"/>
         <rect x="240" y="125" width="34" height="135" rx="3" fill="${p.bld}" opacity="0.9"/>
         <rect x="280" y="155" width="40" height="105" rx="3" fill="${p.bld}" opacity="0.7"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="280" fill="${p.sky}"/>
      <circle cx="330" cy="60" r="26" fill="${p.acc}" opacity="0.55"/>
      ${towers}
      <path d="M0 248 Q 100 236 200 248 T 400 248 L400 280 L0 280 Z" fill="${p.water}"/>
      <path d="M0 262 Q 120 252 240 262 T 400 262 L400 280 L0 280 Z" fill="${p.water}" opacity="0.7"/>
    </svg>`;
  },

  // Wide direction banner — one per cardinal direction, tinted to its colour.
  // Used as the section header in Explore (grouped by direction).
  directionScene(dirId, color) {
    const P = {
      "south-core": { sky: "#dfeae6", water: "#c4ddd5", bld: color || "#1f5c52", acc: "#fdcb6e", tall: true },
      "east":       { sky: "#dde6f5", water: "#c6d4ec", bld: color || "#2a6fdb", acc: "#fdcb6e", tall: false },
      "west":       { sky: "#e7e2f3", water: "#d3cae8", bld: color || "#7a5cc9", acc: "#00b894", tall: false },
      "south-east": { sky: "#f2e8d6", water: "#e4d4b6", bld: color || "#c2872e", acc: "#1f5c52", tall: false },
      "north":      { sky: "#f3dede", water: "#ecc9c9", bld: color || "#be123c", acc: "#fdcb6e", tall: false },
    };
    const p = P[dirId] || P["south-core"];
    // repeating skyline across a wide 16:5 banner
    const bars = [];
    const heights = p.tall
      ? [120, 78, 150, 60, 132, 96, 168, 84, 140, 70, 158, 102]
      : [150, 118, 165, 132, 178, 140, 158, 122, 170, 136, 162, 128];
    let x = 40;
    heights.forEach((h, i) => {
      const w = 26 + (i % 3) * 8;
      const op = 0.7 + (i % 4) * 0.08;
      bars.push(`<rect x="${x}" y="${230 - h}" width="${w}" height="${h}" rx="3" fill="${p.bld}" opacity="${op.toFixed(2)}"/>`);
      x += w + 18;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" preserveAspectRatio="xMidYMax slice">
      <rect width="640" height="230" fill="${p.sky}"/>
      <circle cx="560" cy="52" r="26" fill="${p.acc}" opacity="0.5"/>
      ${bars.join("")}
      <path d="M0 206 Q 160 196 320 206 T 640 206 L640 230 L0 230 Z" fill="${p.water}"/>
      <path d="M0 218 Q 200 210 400 218 T 640 218 L640 230 L0 230 Z" fill="${p.water}" opacity="0.65"/>
    </svg>`;
  },

};


