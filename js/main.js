/* ---- Proyectos: para añadir uno, agrega un objeto a esta lista ----
   Plantilla (todo lo que no uses se puede quitar):
   { titulo: "", area: "CFD", semestre: "5.º", estado: "En curso | Terminado | Planeado",
     resumen: "", herramientas: ["ANSYS"],
     hice: "", resultados: "", validacion: "",
     imagenes: [{ src: "img/archivo.png", pie: "" }],   // la primera es la portada
     video: "video/archivo.mp4",                          // opcional, corto
     enlaces: [{ texto: "Informe", url: "https://..." }] }
*/
var PROYECTOS = [
  { titulo: "Curso y certificación de ANSYS", area: "CFD", semestre: "5.º", estado: "En curso",
    resumen: "Ejercicios del curso de ANSYS. Aquí iré subiendo mis simulaciones, con su geometría, mallado, condiciones de frontera y resultados.",
    herramientas: ["ANSYS"] }
];

var chips = document.getElementById("chips");
var grid = document.getElementById("grid");
var activa = "Todos";
var claseEstado = { "Terminado": "ok", "En curso": "warn", "Planeado": "idle" };

function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}
function pintarChips() {
  chips.textContent = "";
  var areas = ["Todos"];
  PROYECTOS.forEach(function (p) { if (areas.indexOf(p.area) < 0) areas.push(p.area); });
  chips.hidden = areas.length < 3;
  areas.forEach(function (a) {
    var b = el("button", "chip", a);
    b.type = "button";
    b.setAttribute("aria-pressed", a === activa ? "true" : "false");
    b.addEventListener("click", function () { activa = a; pintarChips(); pintarTarjetas(); });
    chips.appendChild(b);
  });
}
function crearVideo(src, poster) {
  var v = document.createElement("video");
  v.src = src; v.controls = true; v.preload = "metadata";
  v.setAttribute("playsinline", "");
  if (poster) v.poster = poster;
  return v;
}
function crearImagen(i, titulo) {
  var im = document.createElement("img");
  im.src = i.src; im.alt = i.pie || titulo; im.loading = "lazy";
  return im;
}
function portada(p) {
  var imgs = p.imagenes || [];
  if (!p.video && !imgs.length) return null;
  var cont = el("div", "media");
  cont.appendChild(p.video ? crearVideo(p.video, imgs.length ? imgs[0].src : "") : crearImagen(imgs[0], p.titulo));
  return cont;
}
function detalle(p, card) {
  var imgs = (p.imagenes || []).slice(p.video ? 0 : 1);
  var enlaces = p.enlaces || [];
  if (!p.hice && !p.resultados && !p.validacion && !imgs.length && !enlaces.length) return null;
  var d = el("details", "more");
  d.appendChild(el("summary", "", "Ver detalle"));
  var body = el("div", "detail");
  [["Qué hice", p.hice], ["Resultados clave", p.resultados], ["Validación", p.validacion]].forEach(function (f) {
    if (!f[1]) return;
    var b = el("div", "bloque");
    b.appendChild(el("h4", "", f[0]));
    b.appendChild(el("p", "", f[1]));
    body.appendChild(b);
  });
  if (imgs.length) {
    var gal = el("div", "gallery");
    imgs.forEach(function (i) {
      var fig = document.createElement("figure");
      fig.appendChild(crearImagen(i, p.titulo));
      if (i.pie) fig.appendChild(el("figcaption", "", i.pie));
      gal.appendChild(fig);
    });
    body.appendChild(gal);
  }
  if (enlaces.length) {
    var ls = el("div", "links");
    enlaces.forEach(function (e) {
      var a = el("a", "", e.texto);
      a.href = e.url; a.target = "_blank"; a.rel = "noopener";
      ls.appendChild(a);
    });
    body.appendChild(ls);
  }
  d.appendChild(body);
  d.addEventListener("toggle", function () { card.classList.toggle("open", d.open); });
  return d;
}
function pintarTarjetas() {
  grid.textContent = "";
  PROYECTOS.filter(function (p) { return activa === "Todos" || p.area === activa; }).forEach(function (p) {
    var c = el("article", "card");
    var m = portada(p);
    if (m) c.appendChild(m);
    var meta = el("div", "meta");
    meta.appendChild(el("span", "status " + (claseEstado[p.estado] || "idle"), p.estado));
    meta.appendChild(el("span", "sample", p.area + " · " + p.semestre + " sem."));
    c.appendChild(meta);
    c.appendChild(el("h3", "", p.titulo));
    c.appendChild(el("p", "", p.resumen));
    var tags = el("div", "tags");
    p.herramientas.forEach(function (h) { tags.appendChild(el("span", "tag", h)); });
    c.appendChild(tags);
    var det = detalle(p, c);
    if (det) c.appendChild(det);
    grid.appendChild(c);
  });
}
pintarChips();
pintarTarjetas();

/* ---- Copiar correo ---- */
document.getElementById("copy").addEventListener("click", function () {
  var mail = document.getElementById("mail");
  var out = document.getElementById("copied");
  function seleccionar() {
    var r = document.createRange(); r.selectNodeContents(mail);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    out.textContent = "Selecciona y copia el texto.";
  }
  try {
    navigator.clipboard.writeText(mail.textContent).then(function () {
      out.textContent = "Copiado.";
    }, seleccionar);
  } catch (e) { seleccionar(); }
});

/* ---- Campo de flujo: flujo potencial alrededor de un cilindro (a = 1, U = 1) ---- */
(function () {
  var cv = document.getElementById("flow");
  var cy = document.getElementById("cyl");
  var ctx = cv.getContext("2d");
  var cctx = cy.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, S = 1, dpr = 1, color = "#1B87B8";
  var HALF_H = 1.6, N = 150, parts = [], frame = 0;

  function vars() {
    var cs = getComputedStyle(document.documentElement);
    color = cs.getPropertyValue("--flow").trim() || color;
    return cs;
  }
  function vel(x, y) {
    var r2 = x * x + y * y, r4 = r2 * r2;
    return [1 - (x * x - y * y) / r4, -2 * x * y / r4];
  }
  function spawn(p, anywhere) {
    p.x = anywhere ? (Math.random() * 8 - 4) : -4.1;
    p.y = (Math.random() * 2 - 1) * HALF_H;
    p.px = p.x; p.py = p.y; p.age = 0;
    if (p.x * p.x + p.y * p.y < 1.02) { p.x = -4.1; p.px = p.x; }
  }
  function toX(x) { return W / 2 + x * S; }
  function toY(y) { return H / 2 - y * S; }

  function drawCylinder() {
    var cs = vars();
    cctx.clearRect(0, 0, W, H);
    cctx.beginPath();
    cctx.arc(toX(0), toY(0), S, 0, Math.PI * 2);
    cctx.fillStyle = cs.getPropertyValue("--fg").trim();
    cctx.globalAlpha = 0.9;
    cctx.fill();
    cctx.globalAlpha = 1;
  }
  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = color; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.75;
    for (var i = 0; i < 27; i++) {
      var x = -4.1, y = -1.5 + i * (3 / 26);
      ctx.beginPath(); ctx.moveTo(toX(x), toY(y));
      for (var k = 0; k < 2500; k++) {
        var v = vel(x, y);
        x += v[0] * 0.01; y += v[1] * 0.01;
        if (x * x + y * y < 1.0 || x > 4.2) break;
        ctx.lineTo(toX(x), toY(y));
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    if (!W || !H) return;
    [cv, cy].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S = H / (2 * HALF_H);
    vars(); drawCylinder();
    if (reduce) drawStatic();
  }
  function tick() {
    requestAnimationFrame(tick);
    if (document.hidden || !W) return;
    frame++;
    if (frame % 30 === 0) { vars(); drawCylinder(); }
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.07)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.lineCap = "round";
    ctx.beginPath();
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var v = vel(p.x, p.y);
      p.px = p.x; p.py = p.y;
      p.x += v[0] * 0.016; p.y += v[1] * 0.016; p.age++;
      if (p.x * p.x + p.y * p.y < 1.0 || p.x > 4.2 || p.age > 700) { spawn(p, false); continue; }
      ctx.moveTo(toX(p.px), toY(p.py)); ctx.lineTo(toX(p.x), toY(p.y));
    }
    ctx.stroke();
  }

  for (var i = 0; i < N; i++) { var p = {}; spawn(p, true); parts.push(p); }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(cv); else window.addEventListener("resize", resize);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { vars(); drawCylinder(); if (reduce) drawStatic(); });
  if (!reduce) requestAnimationFrame(tick);
})();
