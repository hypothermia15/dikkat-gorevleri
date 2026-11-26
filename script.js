// ============================================
// Dikkat ve İnhibisyon Görevleri — script.js
// Özgün eser: Cognitive Arcade, Anyma-exe (2026), MIT lisansı.
// Türkçe uyarlama: Doç. Dr. Miraç Barış Usta. Değişiklikler UYARLAMA.md dosyasında.
// Hiçbir veri kaydedilmez ya da gönderilmez.
// ============================================
"use strict";

// --- EKRANLAR ARASI GEÇİŞ ---

const menuPrincipal = document.getElementById("menu-principal");
const jeuStroop     = document.getElementById("jeu-stroop");
const jeuNback      = document.getElementById("jeu-nback");
const jeuGonogo     = document.getElementById("jeu-gonogo");

function afficherEcran(ecran) {
  durdurHepsi();
  for (const e of [menuPrincipal, jeuStroop, jeuNback, jeuGonogo]) e.classList.add("cache");
  ecran.classList.remove("cache");
  window.scrollTo(0, 0);
}

// Bir görevi açarken her seferinde giriş ekranından başla
function gorevAc(jeu, accueil, ecranJeu, resultats) {
  accueil.classList.remove("cache");
  ecranJeu.classList.add("cache");
  resultats.classList.add("cache");
  afficherEcran(jeu);
}

function auHasard(tableau) {
  return tableau[Math.floor(Math.random() * tableau.length)];
}

function karistir(tableau) {
  const t = tableau.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function ortalama(dizi) {
  return dizi.length ? Math.round(dizi.reduce((a, b) => a + b, 0) / dizi.length) : null;
}

function ms(v) {
  return v === null ? "ölçülemedi" : v + " ms";
}

function yuzde(pay, payda) {
  return payda > 0 ? Math.round((pay / payda) * 100) : 0;
}

// Sonuç tablosu: [etiket, değer] satırları
function tabloYaz(id, satirlar) {
  const tbody = document.getElementById(id);
  tbody.textContent = "";
  for (const [etiket, deger] of satirlar) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    const td = document.createElement("td");
    th.scope = "row";
    th.textContent = etiket;
    td.textContent = deger;
    tr.append(th, td);
    tbody.append(tr);
  }
}

function geriBildirim(el, metin, sinif) {
  el.textContent = metin;
  el.className = "geri" + (sinif ? " " + sinif : "");
}

// ============================================
// STROOP
// ============================================

const COULEURS = [
  { nom: "KIRMIZI", sinif: "ink-k", touche: "k" },
  { nom: "MAVİ",    sinif: "ink-m", touche: "m" },
  { nom: "SARI",    sinif: "ink-s", touche: "s" }
];
const NOMBRE_ESSAIS_STROOP = 24; // 12 uyumlu + 12 uyumsuz

let listeStroop      = [];
let essaiStroop      = 0;
let tempsDebutStroop = 0;
let enAttenteStroop  = false;
let resultatsStroop  = [];
let timerStroop      = null;

const ecranAccueilStroop   = document.getElementById("ecran-accueil-stroop");
const ecranJeuStroop       = document.getElementById("ecran-jeu-stroop");
const ecranResultatsStroop = document.getElementById("ecran-resultats-stroop");
const motAffiche           = document.getElementById("mot-affiche");
const feedbackStroop       = document.getElementById("feedback-stroop");
const compteurStroop       = document.getElementById("compteur-stroop");

// Dengeli liste: her renk 4 kez uyumlu, 4 kez uyumsuz (iki öteki sözcükle ikişer kez)
function listeStroopKur() {
  const liste = [];
  for (const couleur of COULEURS) {
    for (let i = 0; i < 4; i++) liste.push({ mot: couleur.nom, couleur, type: "uyumlu" });
    for (const autre of COULEURS) {
      if (autre === couleur) continue;
      for (let i = 0; i < 2; i++) liste.push({ mot: autre.nom, couleur, type: "uyumsuz" });
    }
  }
  return karistir(liste);
}

function nouvelEssaiStroop() {
  const essai = listeStroop[essaiStroop];
  motAffiche.textContent     = essai.mot;
  motAffiche.className       = essai.couleur.sinif;
  compteurStroop.textContent = `Deneme ${essaiStroop + 1} / ${NOMBRE_ESSAIS_STROOP}`;
  geriBildirim(feedbackStroop, "");
  tempsDebutStroop = performance.now();
  enAttenteStroop  = true;
}

function traiterReponseStroop(toucheAppuyee) {
  if (!enAttenteStroop) return;
  enAttenteStroop = false;

  const tempsReaction = Math.round(performance.now() - tempsDebutStroop);
  const essai   = listeStroop[essaiStroop];
  const correct = (toucheAppuyee === essai.couleur.touche);

  geriBildirim(feedbackStroop, correct ? "Doğru" : "Yanlış", correct ? "ok" : "hata");
  resultatsStroop.push({ type: essai.type, correct, tempsReaction });

  essaiStroop++;
  motAffiche.textContent = "";
  timerStroop = setTimeout(
    essaiStroop >= NOMBRE_ESSAIS_STROOP ? afficherResultatsStroop : nouvelEssaiStroop,
    600
  );
}

function afficherResultatsStroop() {
  ecranJeuStroop.classList.add("cache");
  ecranResultatsStroop.classList.remove("cache");

  const uyumlu  = resultatsStroop.filter(r => r.type === "uyumlu");
  const uyumsuz = resultatsStroop.filter(r => r.type === "uyumsuz");
  const trU  = ortalama(uyumlu.filter(r => r.correct).map(r => r.tempsReaction));
  const trUs = ortalama(uyumsuz.filter(r => r.correct).map(r => r.tempsReaction));
  const fark = (trU !== null && trUs !== null) ? trUs - trU : null;

  tabloYaz("tablo-stroop", [
    ["Uyumlu denemeler: doğru",  `${uyumlu.filter(r => r.correct).length} / ${uyumlu.length}`],
    ["Uyumsuz denemeler: doğru", `${uyumsuz.filter(r => r.correct).length} / ${uyumsuz.length}`],
    ["Uyumlu: ortalama tepki süresi",  ms(trU)],
    ["Uyumsuz: ortalama tepki süresi", ms(trUs)],
    ["Girişim etkisi (uyumsuz − uyumlu)", fark === null ? "hesaplanamadı" : (fark > 0 ? "+" : "") + fark + " ms"]
  ]);

  let yorum;
  if (fark === null) {
    yorum = "Doğru yanıt sayısı fark hesaplamaya yetmedi. Tepki süreleri yalnızca doğru denemelerden hesaplanır.";
  } else if (fark > 0) {
    yorum = "Uyumsuz denemelerde yavaşladınız: bu, Stroop girişim etkisidir ve hemen herkeste görülür. Farkın büyüklüğü 12 denemelik bir ortalamaya dayanır. Birkaç yavaş deneme sonucu belirgin biçimde değiştirir.";
  } else {
    yorum = "Bu oturumda uyumsuz denemelerde yavaşlama görülmedi. 12 denemelik ortalamalar oynaktır. Etki grup düzeyinde çok sağlamdır ama tek oturumda her zaman ortaya çıkmaz.";
  }
  document.getElementById("diagnostic-stroop").textContent = yorum;
}

function demarrerStroop() {
  clearTimeout(timerStroop);
  listeStroop     = listeStroopKur();
  essaiStroop     = 0;
  resultatsStroop = [];

  ecranAccueilStroop.classList.add("cache");
  ecranResultatsStroop.classList.add("cache");
  ecranJeuStroop.classList.remove("cache");

  motAffiche.textContent = "";
  geriBildirim(feedbackStroop, "");
  compteurStroop.textContent = "Hazır olun";
  timerStroop = setTimeout(nouvelEssaiStroop, 1000);
}

document.getElementById("bouton-start-stroop").addEventListener("click", demarrerStroop);
document.getElementById("bouton-restart-stroop").addEventListener("click", demarrerStroop);
// pointerdown: dokunmatik ekranda tıklama gecikmesi tepki süresine eklenmesin; click klavyeyle etkinleştirme içindir
for (const olay of ["pointerdown", "click"]) {
  document.getElementById("dugmeler-stroop").addEventListener(olay, e => {
    const b = e.target.closest("button[data-touche]");
    if (b) traiterReponseStroop(b.dataset.touche);
  });
}

// ============================================
// N-GERİ
// ============================================

// Türkçe klavyede ve seslendirmede karışmayan sessiz harfler
const LETTRES             = ["B", "D", "F", "H", "K", "M", "R", "T"];
const NOMBRE_ESSAIS_NBACK = 25;
const DUREE_LETTRE        = 1500; // harfin ekranda kalma ve yanıt süresi
const DUREE_PAUSE         = 700;

let nSeviye        = 1;
let diziNback      = [];
let essaiNback     = 0;
let enAttenteNback = false;
let aRepondu       = false;
let timerNback     = null;
let resultatsNback = [];

const ecranAccueilNback   = document.getElementById("ecran-accueil-nback");
const ecranJeuNback       = document.getElementById("ecran-jeu-nback");
const ecranResultatsNback = document.getElementById("ecran-resultats-nback");
const lettrAffichee       = document.getElementById("lettre-affichee");
const feedbackNback       = document.getElementById("feedback-nback");
const compteurNback       = document.getElementById("compteur-nback");

// Hedeflerin yaklaşık üçte biri: konumları önceden seçilir, dizi ona göre üretilir
function diziNbackKur(n) {
  const uygun = [];
  for (let i = n; i < NOMBRE_ESSAIS_NBACK; i++) uygun.push(i);
  const hedefler = new Set(karistir(uygun).slice(0, Math.round(uygun.length * 0.33)));
  const dizi = [];
  for (let i = 0; i < NOMBRE_ESSAIS_NBACK; i++) {
    if (hedefler.has(i)) {
      dizi.push({ lettre: dizi[i - n].lettre, estCible: true });
    } else {
      let lettre;
      do { lettre = auHasard(LETTRES); } while (i >= n && lettre === dizi[i - n].lettre);
      dizi.push({ lettre, estCible: false });
    }
  }
  return dizi;
}

function nouvelEssaiNback() {
  if (essaiNback >= NOMBRE_ESSAIS_NBACK) {
    afficherResultatsNback();
    return;
  }
  lettrAffichee.textContent = diziNback[essaiNback].lettre;
  geriBildirim(feedbackNback, "");
  aRepondu       = false;
  enAttenteNback = true;
  compteurNback.textContent = `Harf ${essaiNback + 1} / ${NOMBRE_ESSAIS_NBACK}`;
  if (essaiNback < nSeviye) geriBildirim(feedbackNback, "Bu harfi aklınızda tutun. Henüz karşılaştırma yok.");
  timerNback = setTimeout(evaluerReponseNback, DUREE_LETTRE);
}

function reponseNback() {
  if (!enAttenteNback || aRepondu || essaiNback < nSeviye) return;
  aRepondu = true;
  const estCible = diziNback[essaiNback].estCible;
  geriBildirim(feedbackNback, estCible ? "Doğru" : "Yanlış alarm", estCible ? "ok" : "hata");
}

function evaluerReponseNback() {
  enAttenteNback = false;
  const estCible = diziNback[essaiNback].estCible;
  lettrAffichee.textContent = "";
  if (estCible && !aRepondu) geriBildirim(feedbackNback, "Kaçtı", "uyar");

  if (essaiNback >= nSeviye) resultatsNback.push({ estCible, aRepondu });
  essaiNback++;
  timerNback = setTimeout(nouvelEssaiNback, DUREE_PAUSE);
}

function afficherResultatsNback() {
  ecranJeuNback.classList.add("cache");
  ecranResultatsNback.classList.remove("cache");

  const cibles       = resultatsNback.filter(r => r.estCible);
  const nonCibles    = resultatsNback.filter(r => !r.estCible);
  const isabet       = cibles.filter(r => r.aRepondu).length;
  const yanlisAlarm  = nonCibles.filter(r => r.aRepondu).length;

  tabloYaz("tablo-nback", [
    ["Düzey", `${nSeviye}-geri`],
    ["Puanlanan karşılaştırmalar", `${resultatsNback.length} / ${diziNback.length} harf`],
    ["İsabet (yakalanan hedef)", `${isabet} / ${cibles.length} (%${yuzde(isabet, cibles.length)})`],
    ["Kaçırılan hedef", `${cibles.length - isabet} / ${cibles.length}`],
    ["Yanlış alarm (hedef olmayana yanıt)", `${yanlisAlarm} / ${nonCibles.length} (%${yuzde(yanlisAlarm, nonCibles.length)})`]
  ]);

  let yorum = "İsabet ve yanlış alarm birlikte okunur: çok isabet, çok da yanlış alarm varsa kişi ayırt etmiyor, sık basıyordur.";
  if (nSeviye === 1) yorum += " 1-geri çoğu erişkin için kolaydır. Güncelleme yükünü görmek için 2-geri düzeyini deneyin.";
  else yorum += " 2-geri düzeyinde her yeni harfte akılda tutulan ikiliyi yenilemek gerekir. Hataların artması beklenen bir bulgudur.";
  document.getElementById("diagnostic-nback").textContent = yorum;
}

function demarrerNback() {
  clearTimeout(timerNback);
  diziNback      = diziNbackKur(nSeviye);
  essaiNback     = 0;
  resultatsNback = [];
  enAttenteNback = false;

  ecranAccueilNback.classList.add("cache");
  ecranResultatsNback.classList.add("cache");
  ecranJeuNback.classList.remove("cache");

  document.getElementById("consigne-nback").textContent =
    nSeviye === 1 ? "Bir önceki harfle aynıysa yanıt verin" : "İki önceki harfle aynıysa yanıt verin";
  lettrAffichee.textContent = "";
  geriBildirim(feedbackNback, "");
  compteurNback.textContent = "Hazır olun";
  timerNback = setTimeout(nouvelEssaiNback, 1000);
}

document.getElementById("bouton-start-nback").addEventListener("click", demarrerNback);
document.getElementById("bouton-restart-nback").addEventListener("click", demarrerNback);
document.getElementById("yanit-nback").addEventListener("click", reponseNback);

for (const b of document.querySelectorAll(".seviye .sec")) {
  b.addEventListener("click", () => {
    nSeviye = Number(b.dataset.n);
    for (const x of document.querySelectorAll(".seviye .sec")) {
      const on = x === b;
      x.classList.toggle("is-on", on);
      x.setAttribute("aria-pressed", String(on));
    }
    document.getElementById("n-metin").textContent = nSeviye === 1 ? "bir önceki" : "iki önceki";
  });
}

// ============================================
// GO/NO-GO
// ============================================

const SYMBOLE_GO           = "⭐";
const SYMBOLE_NOGO         = "❌";
const NOMBRE_ESSAIS_GONOGO = 40;   // 30 Go + 10 No-Go
const NOMBRE_NOGO          = 10;
const DUREE_SYMBOLE        = 800;  // uyaranın ekranda kalma ve yanıt süresi
const PAUSE_MIN            = 700;  // denemeler arası süre 700-1100 ms arasında değişir
const PAUSE_MAX            = 1100;

let listeGonogo      = [];
let essaiGonogo      = 0;
let enAttenteGonogo  = false;
let aReponduGonogo   = false;
let tempsDebutGonogo = 0;
let tempsRepActuel   = null;
let timerGonogo      = null;
let resultatsGonogo  = [];

const ecranAccueilGonogo   = document.getElementById("ecran-accueil-gonogo");
const ecranJeuGonogo       = document.getElementById("ecran-jeu-gonogo");
const ecranResultatsGonogo = document.getElementById("ecran-resultats-gonogo");
const symboleAffiche       = document.getElementById("symbole-affiche");
const feedbackGonogo       = document.getElementById("feedback-gonogo");
const compteurGonogo       = document.getElementById("compteur-gonogo");

// İlk üç deneme Go olur (basma yanıtı yerleşsin), No-Go'lar art arda gelmez
function listeGonogoKur() {
  for (let deneme = 0; deneme < 200; deneme++) {
    const kalan = karistir(
      Array(NOMBRE_ESSAIS_GONOGO - 3 - NOMBRE_NOGO).fill(true).concat(Array(NOMBRE_NOGO).fill(false))
    );
    const liste = [true, true, true].concat(kalan);
    if (!liste.some((go, i) => i > 0 && !go && !liste[i - 1])) return liste;
  }
  return [true, true, true].concat(
    Array(NOMBRE_ESSAIS_GONOGO - 3).fill(true).map((_, i) => (i % 3 !== 2 || i >= NOMBRE_NOGO * 3))
  );
}

function nouvelEssaiGonogo() {
  if (essaiGonogo >= NOMBRE_ESSAIS_GONOGO) {
    afficherResultatsGonogo();
    return;
  }
  aReponduGonogo  = false;
  tempsRepActuel  = null;
  symboleAffiche.textContent = listeGonogo[essaiGonogo] ? SYMBOLE_GO : SYMBOLE_NOGO;
  geriBildirim(feedbackGonogo, "");
  compteurGonogo.textContent = `Deneme ${essaiGonogo + 1} / ${NOMBRE_ESSAIS_GONOGO}`;
  tempsDebutGonogo = performance.now();
  enAttenteGonogo  = true;
  timerGonogo = setTimeout(evaluerReponseGonogo, DUREE_SYMBOLE);
}

function reponseGonogo() {
  if (!enAttenteGonogo || aReponduGonogo) return;
  aReponduGonogo = true;
  tempsRepActuel = Math.round(performance.now() - tempsDebutGonogo);
  const estGo = listeGonogo[essaiGonogo];
  geriBildirim(feedbackGonogo, estGo ? "Doğru" : "Yanlış basma", estGo ? "ok" : "hata");
  if (estGo) symboleAffiche.textContent = "";
}

function evaluerReponseGonogo() {
  enAttenteGonogo = false;
  const estGo = listeGonogo[essaiGonogo];
  symboleAffiche.textContent = "";
  if (estGo && !aReponduGonogo) geriBildirim(feedbackGonogo, "Kaçtı", "uyar");

  resultatsGonogo.push({ estGo, aRepondu: aReponduGonogo, tempsReaction: tempsRepActuel });
  essaiGonogo++;
  timerGonogo = setTimeout(nouvelEssaiGonogo, PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN));
}

function afficherResultatsGonogo() {
  ecranJeuGonogo.classList.add("cache");
  ecranResultatsGonogo.classList.remove("cache");

  const go     = resultatsGonogo.filter(r => r.estGo);
  const nogo   = resultatsGonogo.filter(r => !r.estGo);
  const dogru  = go.filter(r => r.aRepondu);
  const yanlis = nogo.filter(r => r.aRepondu).length;
  const kacan  = go.length - dogru.length;

  tabloYaz("tablo-gonogo", [
    ["Yanlış basma (No-Go’da yanıt)", `${yanlis} / ${nogo.length} (%${yuzde(yanlis, nogo.length)})`],
    ["Kaçırma (Go’da yanıt yok)", `${kacan} / ${go.length} (%${yuzde(kacan, go.length)})`],
    ["Go: ortalama tepki süresi", ms(ortalama(dogru.map(r => r.tempsReaction)))]
  ]);

  document.getElementById("diagnostic-gonogo").textContent =
    "Yanlış basma tepkiyi tutamamayı, kaçırma dikkatin kaymasını gösterir. Ikisi ayrı okunur. Hız ile doğruluk arasında bir alışveriş vardır: çok hızlı yanıt veren kişi daha çok yanlış basar. 10 No-Go denemesinde tek bir hata oranı 10 puan oynatır.";
}

function demarrerGonogo() {
  clearTimeout(timerGonogo);
  listeGonogo     = listeGonogoKur();
  essaiGonogo     = 0;
  resultatsGonogo = [];
  enAttenteGonogo = false;

  ecranAccueilGonogo.classList.add("cache");
  ecranResultatsGonogo.classList.add("cache");
  ecranJeuGonogo.classList.remove("cache");

  symboleAffiche.textContent = "";
  geriBildirim(feedbackGonogo, "");
  compteurGonogo.textContent = "Hazır olun";
  timerGonogo = setTimeout(nouvelEssaiGonogo, 1000);
}

document.getElementById("bouton-start-gonogo").addEventListener("click", demarrerGonogo);
document.getElementById("bouton-restart-gonogo").addEventListener("click", demarrerGonogo);
document.getElementById("yanit-gonogo").addEventListener("pointerdown", e => { e.preventDefault(); reponseGonogo(); });
document.getElementById("yanit-gonogo").addEventListener("click", reponseGonogo);

// ============================================
// ORTAK: durdurma, gezinme, klavye
// ============================================

function durdurHepsi() {
  clearTimeout(timerStroop);
  clearTimeout(timerNback);
  clearTimeout(timerGonogo);
  enAttenteStroop = enAttenteNback = enAttenteGonogo = false;
}

document.getElementById("btn-stroop").addEventListener("click", () => gorevAc(jeuStroop, ecranAccueilStroop, ecranJeuStroop, ecranResultatsStroop));
document.getElementById("btn-nback").addEventListener("click",  () => gorevAc(jeuNback, ecranAccueilNback, ecranJeuNback, ecranResultatsNback));
document.getElementById("btn-gonogo").addEventListener("click", () => gorevAc(jeuGonogo, ecranAccueilGonogo, ecranJeuGonogo, ecranResultatsGonogo));

for (const id of ["retour-stroop", "retour-nback", "retour-gonogo", "retour-resultats-stroop", "retour-resultats-nback", "retour-resultats-gonogo"]) {
  document.getElementById(id).addEventListener("click", () => afficherEcran(menuPrincipal));
}

document.addEventListener("keydown", function (event) {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  // Türkçe klavye: İ/ı dönüşümüne takılmamak için fiziksel tuş kodu kullanılır
  if (enAttenteStroop) {
    const harita = { KeyK: "k", KeyM: "m", KeyS: "s" };
    if (harita[event.code]) traiterReponseStroop(harita[event.code]);
    return;
  }
  if (event.code === "Space" && (enAttenteNback || enAttenteGonogo)) {
    event.preventDefault();
    if (enAttenteNback) reponseNback();
    else reponseGonogo();
  }
});
