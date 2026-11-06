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
  { t: "Grammar & Vocabulary Book", l: "Fondamentaux", d: "Les bases de la grammaire et le vocabulaire essentiel, expliqués simplement.", img: "livre-grammar-vocabulary.jpg" },
  { t: "Pronunciation & Expressions Book", l: "Oral", d: "Améliorer son accent, sa clarté et maîtriser les expressions courantes.", img: "livre-pronunciation-expressions.jpg" },
  { t: "English for Intermediate", l: "Intermédiaire", d: "Consolider ses acquis et gagner en aisance à l'écrit comme à l'oral.", img: "livre-english-intermediate.jpg" },
  { t: "English for Proficiency", l: "Avancé", d: "Atteindre un niveau avancé et s'exprimer avec précision.", img: "livre-english-proficiency.jpg" },
  { t: "Workbook – Intermediate & Proficiency", l: "Exercices", d: "Des exercices pratiques pour s'entraîner et valider chaque notion.", img: "livre-workbook.jpg" },
  { t: "Intermediate Pronunciation & Business Dialogue Book", l: "Professionnel", d: "Prononciation et dialogues pour le monde des affaires.", img: "livre-business-dialogue.jpg" },
];
document.getElementById("booksGrid").innerHTML = books.map(b => `
  <article class="book reveal">
    <div class="cover"><img src="images/${b.img}" alt="${b.t}" loading="lazy"></div>
    <div class="info">
      <span class="lvl">${b.l}</span><h3>${b.t}</h3><p>${b.d}</p>
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="${wa(`Bonjour ELS, je souhaite commander le manuel « ${b.t} ».`)}">Commander via WhatsApp</a>
    </div>
  </article>`).join("");
document.querySelectorAll("#booksGrid .reveal").forEach(el => io.observe(el));

// Lightbox
const lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img");
document.querySelectorAll("#gallery img").forEach(img => img.addEventListener("click", () => { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add("open"); }));
lb.addEventListener("click", e => { if (e.target !== lbImg) lb.classList.remove("open"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });

// Contact form → WhatsApp
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const msg = `Bonjour ELS 👋\n\nNom : ${v("cName")}\nTéléphone : ${v("cPhone")}\nProgramme : ${v("cProg")}\nCampus : ${v("cCampus")}\n\n${v("cMsg")}`;
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
let i = 0, ans = [];
const levels = s => s <= 2 ? ["Beginner", "A1"] : s <= 4 ? ["Elementary", "A2"] : s <= 6 ? ["Intermediate", "B1"] : s <= 8 ? ["Upper-Intermediate", "B2"] : ["Advanced", "C1"];

function start() {
  bar.style.width = "0";
  body.innerHTML = `<div class="test-start">
    <h3 style="font-family:var(--serif);font-size:1.6rem">Ready to start?</h3>
    <ul><li>📝 10 questions</li><li>⏱ ~4 minutes</li><li>🎯 Niveau A1 à C1</li></ul>
    <button class="btn btn-gold" id="go">Commencer le test</button></div>`;
  document.getElementById("go").onclick = () => { i = 0; ans = []; render(); };
}
function render() {
  const [q, opts] = Q[i];
  bar.style.width = (i / Q.length * 100) + "%";
  body.classList.remove("slide"); void body.offsetWidth; body.classList.add("slide");
  body.innerHTML = `<span class="q-num">Question ${i + 1} / ${Q.length}</span><h3>${q}</h3>
    <div class="opts">${opts.map((o, k) => `<button class="opt ${ans[i] === k ? "sel" : ""}" data-k="${k}">${String.fromCharCode(65 + k)}. ${o}</button>`).join("")}</div>
    <div class="test-nav"><button class="btn btn-ghost" id="prev" ${i === 0 ? "disabled style='opacity:.4'" : ""}>← Précédent</button>
    <button class="btn btn-navy" id="next" ${ans[i] === undefined ? "disabled style='opacity:.4'" : ""}>${i === Q.length - 1 ? "Voir mon résultat" : "Suivant →"}</button></div>`;
  body.querySelectorAll(".opt").forEach(b => b.onclick = () => { ans[i] = +b.dataset.k; render(); });
  document.getElementById("prev").onclick = () => { if (i > 0) { i--; render(); } };
  document.getElementById("next").onclick = () => { if (ans[i] === undefined) return; i < Q.length - 1 ? (i++, render()) : result(); };
}
function result() {
  bar.style.width = "100%";
  const s = ans.reduce((a, v, k) => a + (v === Q[k][2] ? 1 : 0), 0);
  const [name, cefr] = levels(s);
  body.classList.remove("slide"); void body.offsetWidth; body.classList.add("slide");
  body.innerHTML = `<div class="result">
    <span class="q-num">Votre niveau estimé</span>
    <div class="lvl">${name}</div>
    <p class="score">${cefr} · ${s}/${Q.length} bonnes réponses</p>
    <p style="color:var(--muted);margin-top:10px">Ce résultat est indicatif. Un formateur ELS confirmera votre niveau lors de l'inscription.</p>
    <form id="resForm">
      <label for="rName">Nom complet</label><input id="rName" required placeholder="Votre nom">
      <label for="rCampus">Campus souhaité</label><select id="rCampus"><option>Niamey</option><option>Maradi</option></select>
      <button class="btn btn-gold" type="submit">Envoyer mon résultat à ELS</button>
      <button class="btn btn-ghost" type="button" id="again">Refaire le test</button>
    </form></div>`;
  document.getElementById("again").onclick = start;
  document.getElementById("resForm").onsubmit = e => {
    e.preventDefault();
    const n = document.getElementById("rName").value.trim(), c = document.getElementById("rCampus").value;
    const num = c === "Maradi" ? "22799998178" : WA;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(`Bonjour ELS 👋\nJ'ai fait le test de niveau en ligne.\n\nNom : ${n}\nRésultat : ${name} (${cefr}) – ${s}/${Q.length}\nCampus : ${c}\n\nJe souhaite m'inscrire.`)}`, "_blank");
  };
}
start();

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
document.querySelectorAll(".prog-grid,.books-grid,.steps,.campus-grid,.modules,.values").forEach(g =>
  [...g.children].forEach((c, k) => c.style.transitionDelay = (k * 0.09) + "s"));

// Header shadow on scroll
const hdr = document.querySelector("header.nav");
addEventListener("scroll", () => hdr.classList.toggle("scrolled", scrollY > 20), { passive: true });
