/* =========================================================
   Nuestro Jardín · lógica de la app
   ========================================================= */
(function () {
  const CFG = window.JARDIN_CONFIG || {};
  const F = window.Flowers;
  const COLORS = F.COLORS, SHAPES = F.SHAPES;

  // ---------- utilidades ----------
  const $  = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const norm = s => (s || "").toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(16).slice(2));
  const colorHex = id => { const c = COLORS.find(c => c.id === id); return c ? c.hex : id; };

  // ---------- estado ----------
  let flores = [];
  const vistos = new Set();
  let sel = { color: COLORS[0], shape: SHAPES[0] };
  let yo = localStorage.getItem("jardin_nombre") || "";

  // ---------- capa de datos (Supabase o demo) ----------
  const hasSupa = !!(CFG.supabaseUrl && CFG.supabaseAnonKey &&
                     /^https:\/\//.test(CFG.supabaseUrl) && window.supabase);
  let supa = null;
  if (hasSupa) {
    try { supa = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey); }
    catch (e) { console.warn("Supabase no inició:", e); }
  }
  const MODO_DEMO = !supa;
  const LS_KEY = "jardin_flores_demo";

  async function fetchFlowers() {
    if (supa) {
      const { data, error } = await supa.from("flowers").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    }
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  }
  async function plantFlower(f) {
    if (supa) {
      const { data, error } = await supa.from("flowers")
        .insert({ author: f.author, color: f.color, shape: f.shape, message: f.message, x: f.x, depth: f.depth })
        .select().single();
      if (error) throw error;
      return data;
    }
    const rec = Object.assign({ id: uuid(), created_at: new Date().toISOString() }, f);
    const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    all.push(rec);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
    return rec;
  }
  function subscribe(onInsert) {
    if (supa) {
      const ch = supa.channel("flores")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "flowers" }, p => onInsert(p.new))
        .subscribe();
      return () => supa.removeChannel(ch);
    }
    const h = e => { if (e.key === LS_KEY) onInsert(null); };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }

  // ---------- pintar flores ----------
  function posStyle(f) {
    const depth = Number(f.depth) || 0;
    const bottoms = [5, 15, 25];
    const scales  = [1, 0.82, 0.66];
    const widths  = ["clamp(46px,12vw,86px)", "clamp(40px,10vw,72px)", "clamp(34px,8.5vw,60px)"];
    const b = bottoms[depth] || 5, sc = scales[depth] || 1, w = widths[depth] || widths[0];
    const x = Math.max(5, Math.min(95, Number(f.x) || 50));
    return `left:${x}%; bottom:${b}svh; width:${w}; transform:translateX(-50%) scale(${sc}); z-index:${30 - depth * 10};`;
  }
  function pintarFlor(f, animar) {
    if (!f.id || vistos.has(f.id)) return;
    vistos.add(f.id);
    const btn = document.createElement("button");
    btn.className = "flor";
    btn.style.cssText = posStyle(f);
    btn.style.setProperty("--dur", (4 + Math.random() * 3).toFixed(2) + "s");
    btn.style.setProperty("--delay", (-Math.random() * 4).toFixed(2) + "s");
    btn.setAttribute("aria-label", "Flor de " + (f.author || "alguien"));
    const span = document.createElement("span");
    span.className = "brote";
    if (!animar) span.style.animation = "none";
    span.innerHTML = F.svg(f.shape, colorHex(f.color));
    btn.appendChild(span);
    btn.addEventListener("click", () => abrirTarjeta(f));
    $("#campo").appendChild(btn);
  }
  function actualizarConteo() {
    $("#conteo").textContent = flores.length + (flores.length === 1 ? " flor" : " flores");
  }

  // ---------- modal plantar ----------
  function renderColores() {
    const cc = $("#colores"); cc.innerHTML = "";
    COLORS.forEach(c => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "swatch"; b.style.background = c.hex; b.title = c.nombre;
      b.setAttribute("aria-pressed", String(c.id === sel.color.id));
      if (c.id === "blanco") b.style.boxShadow = "inset 0 0 0 1px #e0e0e0, 0 2px 6px rgba(0,0,0,.14)";
      b.addEventListener("click", () => { sel.color = c; renderColores(); renderFormas(); actualizarPrevio(); });
      cc.appendChild(b);
    });
  }
  function renderFormas() {
    const ff = $("#formas"); ff.innerHTML = "";
    SHAPES.forEach(s => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "forma";
      b.setAttribute("aria-pressed", String(s.id === sel.shape.id));
      b.innerHTML = F.svg(s.id, sel.color.hex) + `<span>${s.nombre}</span>`;
      b.addEventListener("click", () => { sel.shape = s; renderFormas(); actualizarPrevio(); });
      ff.appendChild(b);
    });
  }
  function actualizarPrevio() { $("#previoFlor").innerHTML = F.svg(sel.shape.id, sel.color.hex); }

  async function sembrar() {
    const msg = $("#inputMensaje").value.trim();
    const nuevo = {
      author: yo, color: sel.color.id, shape: sel.shape.id, message: msg,
      x: +(6 + Math.random() * 88).toFixed(2), depth: pickDepth()
    };
    cerrar("modalPlantar");
    $("#inputMensaje").value = ""; $("#contMsg").textContent = "0";
    let saved;
    try { saved = await plantFlower(nuevo); }
    catch (e) { alert("No se pudo plantar la flor 😢\n" + (e.message || e)); return; }
    flores.push(saved); pintarFlor(saved, true); actualizarConteo();
  }
  function pickDepth() { const r = Math.random(); return r < 0.5 ? 0 : r < 0.82 ? 1 : 2; }

  // ---------- tarjeta de mensaje ----------
  function abrirTarjeta(f) {
    $("#mensajeFlor").innerHTML = F.svg(f.shape, colorHex(f.color));
    const m = (f.message || "").trim();
    $("#mensajeTexto").textContent = m ? "“" + m + "”" : "🌸";
    $("#mensajeFirma").textContent = "— " + (f.author || "Alguien") + " · " + fechaBonita(f.created_at);
    abrir("tarjeta");
  }
  function fechaBonita(iso) {
    try {
      return new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
        .format(new Date(iso));
    } catch (e) { return ""; }
  }

  // ---------- overlays ----------
  function abrir(id) { document.getElementById(id).hidden = false; }
  function cerrar(id) { document.getElementById(id).hidden = true; }

  // ---------- flujo de entrada ----------
  function entrar() {
    sessionStorage.setItem("jardin_entrada", "1");
    cerrar("porton");
    if (!yo) { abrir("nombre"); setTimeout(() => $("#inputNombre").focus(), 100); }
    else mostrarJardin();
  }
  async function mostrarJardin() {
    $("#miNombre").textContent = yo;
    $("#barra").hidden = false;
    $("#btnPlantar").hidden = false;
    try { flores = await fetchFlowers(); } catch (e) { flores = []; console.warn(e); }
    flores.forEach(f => pintarFlor(f, false));
    actualizarConteo();
    subscribe(async nuevo => {
      if (nuevo) {
        if (!vistos.has(nuevo.id)) { flores.push(nuevo); pintarFlor(nuevo, true); actualizarConteo(); }
      } else {
        const data = await fetchFlowers();
        data.forEach(f => { if (!vistos.has(f.id)) { flores.push(f); pintarFlor(f, true); } });
        actualizarConteo();
      }
    });
  }

  // ---------- init ----------
  function init() {
    if (CFG.titulo) { $("#tituloPorton").textContent = CFG.titulo; document.title = CFG.titulo + " 🌸"; }
    $("#portonFlor").innerHTML = F.svg("margarita", "#ff5ba0");
    $("#nombreFlor").innerHTML = F.svg("tulipan", "#ff7a52");

    if (MODO_DEMO) {
      const nota = document.createElement("p");
      nota.textContent = "🌱 Modo demo · conéctalo en config.js para compartir";
      nota.style.cssText = "font-size:12px;opacity:.55;margin:14px 0 0;";
      $("#subPorton").after(nota);
    }

    $("#formPorton").addEventListener("submit", e => {
      e.preventDefault();
      const ok = norm($("#inputFrase").value) === norm(CFG.fraseSecreta || "");
      if (ok) { $("#errorFrase").hidden = true; entrar(); }
      else { $("#errorFrase").hidden = false; $("#inputFrase").select(); }
    });
    $("#formNombre").addEventListener("submit", e => {
      e.preventDefault();
      const n = $("#inputNombre").value.trim();
      if (!n) return;
      yo = n; localStorage.setItem("jardin_nombre", n);
      cerrar("nombre"); mostrarJardin();
    });
    $("#btnPlantar").addEventListener("click", () => {
      renderColores(); renderFormas(); actualizarPrevio();
      abrir("modalPlantar"); setTimeout(() => $("#inputMensaje").focus(), 120);
    });
    $("#btnSembrar").addEventListener("click", sembrar);
    $("#inputMensaje").addEventListener("input", e => $("#contMsg").textContent = e.target.value.length);
    $("#btnSalir").addEventListener("click", () => { sessionStorage.removeItem("jardin_entrada"); location.reload(); });

    $$("[data-cerrar]").forEach(b => b.addEventListener("click", () => cerrar(b.getAttribute("data-cerrar"))));
    $$(".overlay").forEach(ov => ov.addEventListener("click", e => {
      if (e.target === ov && !ov.classList.contains("overlay--solido")) cerrar(ov.id);
    }));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") ["modalPlantar", "tarjeta"].forEach(id => { const el = document.getElementById(id); if (el && !el.hidden) el.hidden = true; });
    });

    if (sessionStorage.getItem("jardin_entrada") === "1") {
      cerrar("porton");
      if (!yo) { abrir("nombre"); } else mostrarJardin();
    } else {
      setTimeout(() => $("#inputFrase").focus(), 300);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
