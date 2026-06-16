/* =========================================================
   Nuestro Jardín · generador de flores en SVG
   Expone: window.Flowers = { COLORS, SHAPES, svg(shape,hex) }
   ========================================================= */
(function () {
  // Paleta de colores disponible para plantar
  const COLORS = [
    { id: "rosa",     nombre: "Rosa",     hex: "#ff5ba0" },
    { id: "rojo",     nombre: "Rojo",     hex: "#ff4d5e" },
    { id: "coral",    nombre: "Coral",    hex: "#ff7a52" },
    { id: "naranja",  nombre: "Naranja",  hex: "#ff9e2c" },
    { id: "amarillo", nombre: "Amarillo", hex: "#ffce3a" },
    { id: "lila",     nombre: "Lila",     hex: "#b07cff" },
    { id: "morado",   nombre: "Morado",   hex: "#8a5cf6" },
    { id: "azul",     nombre: "Azul",     hex: "#5aa7ff" },
    { id: "blanco",   nombre: "Blanco",   hex: "#ffffff" },
  ];

  const SHAPES = [
    { id: "margarita", nombre: "Margarita" },
    { id: "cinco",     nombre: "Florecita" },
    { id: "tulipan",   nombre: "Tulipán"  },
    { id: "rosa",      nombre: "Rosa"     },
    { id: "girasol",   nombre: "Girasol"  },
  ];

  // ---- utilidades de color ----
  function clamp(v) { return Math.max(0, Math.min(255, v)); }
  function shade(hex, p) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (p >= 0) { r += (255 - r) * p; g += (255 - g) * p; b += (255 - b) * p; }
    else { const q = 1 + p; r *= q; g *= q; b *= q; }
    const h = x => clamp(Math.round(x)).toString(16).padStart(2, "0");
    return "#" + h(r) + h(g) + h(b);
  }

  // anillo de pétalos (elipses) alrededor de un centro
  function ring(n, cx, cy, rx, ry, reach, fill, stroke, rot) {
    rot = rot || 0;
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = rot + (360 / n) * i;
      s += `<ellipse cx="${cx}" cy="${cy - reach}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="1" transform="rotate(${a} ${cx} ${cy})"/>`;
    }
    return s;
  }

  function stem(topY) {
    topY = topY || 98;
    return `
      <path d="M60 200 C 56 ${topY + 58}, 64 ${topY + 28}, 60 ${topY}" stroke="#3da35a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M60 154 C 43 152, 32 139, 27 122 C 45 124, 57 134, 61 152 Z" fill="#49b863"/>
      <path d="M60 170 C 78 168, 90 158, 96 143 C 78 143, 65 151, 59 168 Z" fill="#3da35a"/>
    `;
  }

  function seeds(cx, cy) {
    let s = "";
    [[6, 7], [11, 13], [15, 18]].forEach(function (rc) {
      const rad = rc[0], count = rc[1];
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 / count) * i + rad;
        const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#5a3a1c"/>`;
      }
    });
    return s;
  }

  // ---- formas ----
  function margarita(hex) {
    const edge = shade(hex, -0.14);
    return stem(96) +
      ring(12, 60, 72, 10, 23, 22, hex, edge, 0) +
      ring(12, 60, 72, 6.5, 15, 14, shade(hex, 0.16), edge, 15) +
      `<circle cx="60" cy="72" r="15" fill="#ffcf3a"/>` +
      `<circle cx="56.5" cy="68.5" r="8" fill="#ffe487"/>`;
  }

  function cinco(hex) {
    const edge = shade(hex, -0.14);
    return stem(98) +
      ring(5, 60, 78, 18, 21, 17, hex, edge, 0) +
      ring(5, 60, 78, 9, 12, 11, shade(hex, 0.18), edge, 0) +
      `<circle cx="60" cy="78" r="9" fill="#ffe066"/>` +
      `<circle cx="60" cy="78" r="4" fill="#ffb43a"/>`;
  }

  function girasol(hex) {
    const edge = shade(hex, -0.16);
    return stem(96) +
      ring(20, 60, 72, 5.5, 28, 26, hex, edge, 0) +
      ring(20, 60, 72, 5, 24, 23, shade(hex, -0.08), edge, 9) +
      `<circle cx="60" cy="72" r="19" fill="#6e4a25"/>` +
      `<circle cx="60" cy="72" r="15" fill="#7d5530"/>` +
      seeds(60, 72);
  }

  function tulipan(hex) {
    const edge = shade(hex, -0.12);
    return stem(106) + `
      <path d="M42 58 C 42 96, 52 106, 60 106 C 68 106, 78 96, 78 58 C 78 58, 72 70, 60 70 C 48 70, 42 58, 42 58 Z" fill="${hex}" stroke="${edge}" stroke-width="1"/>
      <path d="M42 58 C 44 45, 53 43, 57 56 C 52 63, 46 63, 42 58 Z" fill="${shade(hex, 0.12)}" stroke="${edge}" stroke-width="1"/>
      <path d="M78 58 C 76 45, 67 43, 63 56 C 68 63, 74 63, 78 58 Z" fill="${shade(hex, 0.12)}" stroke="${edge}" stroke-width="1"/>
      <path d="M56 56 C 57 43, 63 43, 64 56 C 62 64, 58 64, 56 56 Z" fill="${shade(hex, 0.2)}" stroke="${edge}" stroke-width="1"/>
    `;
  }

  function rosa(hex) {
    const edge = shade(hex, -0.14);
    return stem(98) +
      ring(8, 60, 76, 13, 15, 20, hex, edge, 0) +
      ring(6, 60, 76, 12, 13, 13, shade(hex, 0.1), edge, 22) +
      ring(5, 60, 76, 9, 10, 7, shade(hex, 0.2), edge, 10) +
      `<circle cx="60" cy="76" r="6" fill="${shade(hex, 0.28)}"/>` +
      `<path d="M60 76 m -5 0 a 5 5 0 1 1 10 0" fill="none" stroke="${shade(hex, -0.12)}" stroke-width="2" stroke-linecap="round"/>`;
  }

  const builders = { margarita, cinco, tulipan, rosa, girasol };

  function svg(shape, hex) {
    const build = builders[shape] || margarita;
    return `<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">${build(hex)}</svg>`;
  }

  window.Flowers = { COLORS: COLORS, SHAPES: SHAPES, svg: svg, shade: shade };
})();
