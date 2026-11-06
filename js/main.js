// ELS – English Language Space · RougaTech
const WA = "22786848973";
const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

// Mobile menu
const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => menu.classList.toggle("open"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));

document.getElementById("year").textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Books
const books = [
  { t: "Grammar & Vocabulary Book", img: "livre-grammar-vocabulary.jpg" },
  { t: "Pronunciation & Expressions Book", img: "livre-pronunciation-expressions.jpg" },
  { t: "English for Intermediate", img: "livre-english-intermediate.jpg" },
  { t: "English for Proficiency", img: "livre-english-proficiency.jpg" },
  { t: "Workbook – Intermediate & Proficiency", img: "livre-workbook.jpg" },
  { t: "Intermediate Pronunciation & Business Dialogue Book", img: "livre-business-dialogue.jpg" },
];
let booksShown = false;
function renderBooks() {
  const L = I18N.s, txt = BOOKS_TXT[I18N.lang];
  const g = document.getElementById("booksGrid");
  g.innerHTML = books.map((b, k) => `
  <article class="book reveal ${booksShown ? "in" : ""}" style="transition-delay:${k * .09}s">
    <div class="cover"><img src="images/${b.img}" alt="${b.t}" loading="lazy"></div>
    <div class="info">
      <span class="lvl">${txt[k][0]}</span><h3>${b.t}</h3><p>${txt[k][1]}</p>
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="${wa(L("orderMsg")(b.t))}">${L("order")}</a>
    </div>
  </article>`).join("");
  if (!booksShown) g.querySelectorAll(".reveal").forEach(el => io.observe(el));
  booksShown = true;
}

// Lightbox
const lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img");
document.querySelectorAll("#gallery img").forEach(img => img.addEventListener("click", () => { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add("open"); }));
lb.addEventListener("click", e => { if (e.target !== lbImg) lb.classList.remove("open"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });

// Contact form → WhatsApp
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const msg = I18N.s("formMsg")(v("cName"), v("cPhone"), v("cProg"), v("cCampus"), v("cMsg"));
  const num = v("cCampus") === "Maradi" ? "22799998178" : WA;
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
});

// Placement test
const Q = [
  ["She ___ a teacher.", ["is", "are", "am", "be"], 0],
  ["I ___ to school every day.", ["goes", "go", "going", "gone"], 1],
  ["Yesterday, we ___ to the market.", ["go", "went", "gone", "goes"], 1],
  ["This bag is ___ than that one.", ["heavy", "heavier", "heaviest", "more heavy"], 1],
  ["I have lived in Niamey ___ 2019.", ["for", "since", "from", "during"], 1],
  ["If it rains, we ___ at home.", ["stay", "will stay", "stayed", "would stay"], 1],
  ["The report ___ by the manager yesterday.", ["wrote", "was written", "has written", "is writing"], 1],
  ["If I ___ more time, I would travel more.", ["have", "had", "will have", "would have"], 1],
  ["I'm looking forward ___ you soon.", ["to see", "seeing", "to seeing", "see"], 2],
  ["Hardly ___ the room when the phone rang.", ["I had entered", "had I entered", "I entered", "did I entered"], 1],
];
const body = document.getElementById("testBody"), bar = document.getElementById("bar");
let i = 0, ans = [], view = "start";
const levels = s => s <= 2 ? ["Beginner", "A1"] : s <= 4 ? ["Elementary", "A2"] : s <= 6 ? ["Intermediate", "B1"] : s <= 8 ? ["Upper-Intermediate", "B2"] : ["Advanced", "C1"];

function start() {
  const L = I18N.s; view = "start";
  bar.style.width = "0";
  body.innerHTML = `<div class="test-start">
    <h3 style="font-family:var(--serif);font-size:1.6rem">${L("ready")}</h3>
    <ul><li>📝 ${L("qs")}</li><li>⏱ ${L("time")}</li><li>🎯 ${L("lvls")}</li></ul>
    <button class="btn btn-gold" id="go">${L("start")}</button></div>`;
  document.getElementById("go").onclick = () => { i = 0; ans = []; render(); };
}
function render() {
  const [q, opts] = Q[i]; const L = I18N.s; view = "q";
  bar.style.width = (i / Q.length * 100) + "%";
  body.classList.remove("slide"); void body.offsetWidth; body.classList.add("slide");
  body.innerHTML = `<span class="q-num">${L("question")} ${i + 1} / ${Q.length}</span><h3>${q}</h3>
    <div class="opts">${opts.map((o, k) => `<button class="opt ${ans[i] === k ? "sel" : ""}" data-k="${k}">${String.fromCharCode(65 + k)}. ${o}</button>`).join("")}</div>
    <div class="test-nav"><button class="btn btn-ghost" id="prev" ${i === 0 ? "disabled style='opacity:.4'" : ""}>${L("prev")}</button>
    <button class="btn btn-navy" id="next" ${ans[i] === undefined ? "disabled style='opacity:.4'" : ""}>${i === Q.length - 1 ? L("see") : L("next")}</button></div>`;
  body.querySelectorAll(".opt").forEach(b => b.onclick = () => { ans[i] = +b.dataset.k; render(); });
  document.getElementById("prev").onclick = () => { if (i > 0) { i--; render(); } };
  document.getElementById("next").onclick = () => { if (ans[i] === undefined) return; i < Q.length - 1 ? (i++, render()) : result(); };
}
function result() {
  bar.style.width = "100%";
  const s = ans.reduce((a, v, k) => a + (v === Q[k][2] ? 1 : 0), 0);
  const [name, cefr] = levels(s); const L = I18N.s; view = "result";
  body.classList.remove("slide"); void body.offsetWidth; body.classList.add("slide");
  body.innerHTML = `<div class="result">
    <span class="q-num">${L("yourLevel")}</span>
    <div class="lvl">${name}</div>
    <p class="score">${cefr} · ${s}/${Q.length} ${L("correct")}</p>
    <p style="color:var(--muted);margin-top:10px">${L("note")}</p>
    <form id="resForm">
      <label for="rName">${L("name")}</label><input id="rName" required placeholder="${L("namePh")}">
      <label for="rCampus">${L("campus")}</label><select id="rCampus"><option>Niamey</option><option>Maradi</option></select>
      <button class="btn btn-gold" type="submit">${L("send")}</button>
      <button class="btn btn-ghost" type="button" id="again">${L("again")}</button>
    </form></div>`;
  document.getElementById("again").onclick = start;
  document.getElementById("resForm").onsubmit = e => {
    e.preventDefault();
    const n = document.getElementById("rName").value.trim(), c = document.getElementById("rCampus").value;
    const num = c === "Maradi" ? "22799998178" : WA;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(I18N.s("resMsg")(n, `${name} (${cefr})`, `${s}/${Q.length}`, c))}`, "_blank");
  };
}

// Language init + switch
I18N.collect();
I18N.apply(I18N.lang);
renderBooks();
start();
document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => I18N.apply(b.dataset.lang)));
document.addEventListener("langchange", () => {
  renderBooks();
  if (view === "start") start(); else if (view === "q") render(); else result();
  document.title = I18N.lang === "en" ? "ELS – The future is English | English training centre in Niamey & Maradi" : "ELS – Le futur, c'est l'anglais | Centre de formation en anglais à Niamey & Maradi";
});
document.title = I18N.lang === "en" ? "ELS – The future is English | English training centre in Niamey & Maradi" : document.title;

// Rotating words in hero
const words = ["confidence", "clarity", "fluency", "success"];
const rot = document.getElementById("rotator");
if (rot && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let w = 0, c = words[0].length, del = false;
  const tick = () => {
    const cur = words[w];
    if (!del && c === cur.length) { del = true; return setTimeout(tick, 1800); }
    if (del) { c--; if (c === 0) { del = false; w = (w + 1) % words.length; } }
    else c++;
    rot.textContent = words[w].slice(0, c);
    setTimeout(tick, del ? 60 : 110);
  };
  setTimeout(tick, 2200);
}

// Animated counters
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count; let n = 0;
  const step = () => { n++; el.textContent = n; if (n < end) setTimeout(step, 1200 / end); };
  el.textContent = 0; step(); cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));

// Stagger children in grids
document.querySelectorAll(".prog-grid,.hl-grid,.steps,.campus-grid,.modules,.values").forEach(g =>
  [...g.children].forEach((c, k) => c.style.transitionDelay = (k * 0.09) + "s"));

// Header shadow on scroll
const hdr = document.querySelector("header.nav");
addEventListener("scroll", () => hdr.classList.toggle("scrolled", scrollY > 20), { passive: true });
