global.window = {};
require('./flowers.js');
const F = global.window.Flowers;

// coloca una flor (svg completo) como <svg anidado>
function place(shape, hex, x, y, w) {
  const h = w * (200/120);
  const inner = F.svg(shape, hex).replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  return inner;
}

/* ---------- GALERÍA: formas x colores ---------- */
const cols = F.COLORS;
const shapes = F.SHAPES;
const cw = 130, ch = 220, padTop = 30;
let g = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols.length*cw}" height="${shapes.length*ch+padTop}" viewBox="0 0 ${cols.length*cw} ${shapes.length*ch+padTop}">`;
g += `<rect width="100%" height="100%" fill="#eef6fb"/>`;
cols.forEach((c,ci)=>{ g += `<text x="${ci*cw+cw/2}" y="20" font-size="13" text-anchor="middle" fill="#555" font-family="sans-serif">${c.nombre}</text>`; });
shapes.forEach((s,si)=>{
  cols.forEach((c,ci)=>{
    g += place(s.id, c.hex, ci*cw+8, si*ch+padTop+6, cw-26);
  });
  g += `<text x="6" y="${si*ch+padTop+ch/2}" font-size="12" fill="#333" font-family="sans-serif">${s.nombre}</text>`;
});
g += `</svg>`;
require('fs').writeFileSync('_gallery.svg', g);

/* ---------- ESCENA completa ---------- */
let s = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="800" viewBox="0 0 1440 800">`;
s += `<defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#3ea0ff"/><stop offset="0.32" stop-color="#6cbcff"/>
  <stop offset="0.62" stop-color="#a9defb"/><stop offset="1" stop-color="#e8f8ff"/></linearGradient></defs>`;
s += `<rect width="1440" height="800" fill="url(#cielo)"/>`;
// sol
s += `<circle cx="1230" cy="120" r="70" fill="#ffe98a"/><circle cx="1230" cy="120" r="50" fill="#ffd23f"/>`;
// nubes
s += `<g fill="#fff" opacity="0.95"><ellipse cx="300" cy="150" rx="90" ry="30"/><ellipse cx="350" cy="130" rx="55" ry="34"/><ellipse cx="250" cy="135" rx="45" ry="28"/></g>`;
s += `<g fill="#fff" opacity="0.85"><ellipse cx="820" cy="110" rx="70" ry="24"/><ellipse cx="860" cy="95" rx="44" ry="27"/></g>`;
// colinas (trasladadas hacia abajo)
s += `<g transform="translate(0,340)">
  <path d="M0,190 C 260,120 520,160 760,180 C 1000,200 1220,135 1440,168 L1440,460 L0,460 Z" fill="#a4dd6f"/>
  <path d="M0,270 C 300,210 580,255 860,262 C 1090,268 1270,232 1440,255 L1440,460 L0,460 Z" fill="#7ecb4f"/>
  <path d="M0,350 C 280,318 540,356 820,350 C 1080,345 1250,330 1440,346 L1440,460 L0,460 Z" fill="#5cb43c"/>
</g>`;
// flores: [shape,color,x,y,w]
const F2 = (id)=>F.COLORS.find(c=>c.id===id).hex;
const plant = [
  ['margarita','rosa', 70, 600, 120],
  ['tulipan','coral', 200, 560, 110],
  ['girasol','amarillo', 330, 595, 130],
  ['rosa','rojo', 470, 575, 120],
  ['cinco','lila', 600, 600, 110],
  ['margarita','morado', 720, 565, 115],
  ['tulipan','rosa', 845, 590, 120],
  ['rosa','naranja', 980, 575, 125],
  ['cinco','azul', 1100, 600, 110],
  ['girasol','naranja', 1230, 580, 120],
  ['margarita','blanco', 1340, 600, 110],
  ['tulipan','morado', 150, 660, 95],
  ['cinco','rosa', 400, 670, 95],
  ['rosa','lila', 660, 675, 100],
  ['margarita','amarillo', 900, 670, 95],
  ['tulipan','azul', 1180, 672, 95],
];
plant.forEach(p=> s += place(p[0], F2(p[1]), p[2], p[3], p[4]) );
s += `</svg>`;
require('fs').writeFileSync('_scene.svg', s);
console.log('SVGs generados');
