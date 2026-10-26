// ===== UI: router, ikon (Lucide), halaman =====
const el = document.getElementById("app");
let pasien = null;
let pilih = [];
try {
  pasien = JSON.parse(sessionStorage.getItem("pasien"));
  pilih = JSON.parse(sessionStorage.getItem("pilih")) || [];
} catch (e) {}

const IK = {
  "activity": '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "check": '<path d="M20 6 9 17l-5-5"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  "clipboard-list": '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  "stethoscope": '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  "user-round": '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  "calculator": '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/><path d="M16 18h.01"/>',
  "bar-chart": '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'
};
function ic(n, s) {
  s = s || 20;
  return '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IK[n] + "</svg>";
}
document.getElementById("brandIc").innerHTML = ic("activity", 24);

function simpan() {
  try {
    sessionStorage.setItem("pasien", JSON.stringify(pasien));
    sessionStorage.setItem("pilih", JSON.stringify(pilih));
  } catch (e) {}
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function persen(x) { return (x * 100).toFixed(1) + "%"; }
function ada(k) { return pilih.indexOf(k) >= 0; }


function vs(n) {
  const nm = [["Identitas", "Data pasien"], ["Gejala", "Pilih keluhan"], ["Hasil", "Kemiripan kasus"]];
  let s = '<ol class="vs">';
  for (let i = 0; i < 3; i++) {
    const c = i + 1 < n ? "done" : (i + 1 === n ? "now" : "");
    s += '<li class="' + c + '"><span class="dt">' + (i + 1 < n ? ic("check", 14) : i + 1) + "</span><div><b>" + nm[i][0] + "</b><small>" + nm[i][1] + "</small></div></li>";
  }
  return s + "</ol>";
}
function romawi(g) { return g.replace("DHF-", ""); }

function tampil() {
  const path = location.hash.slice(1) || "/";
  const peta = { "/": halamanAwal, "/identitas": halamanIdentitas, "/gejala": halamanGejala, "/hasil": halamanHasil, "/dataset": halamanDataset };
  const h = (peta[path] || halamanAwal)();
  if (h.pindah) { location.hash = h.pindah; return; }
  el.innerHTML = h.html;
  if (h.init) h.init();
  const a = document.querySelectorAll(".links a");
  for (let i = 0; i < a.length; i++) a[i].className = Number(a[i].getAttribute("data-n")) === (h.nav || 0) ? "on" : "";
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", tampil);

// ----- Beranda -----
function halamanAwal() {
  const info = [
    ["user-round", "Langkah 1", "Isi identitas", "Catat nama, usia, dan jenis kelamin pasien untuk laporan pemeriksaan."],
    ["clipboard-list", "Langkah 2", "Pilih gejala", "Centang keluhan dan kelainan hasil lab darah yang dialami pasien."],
    ["file-text", "Langkah 3", "Baca hasil", "Lihat grade DHF yang paling mirip beserta tingkat kemiripannya."]
  ];
  let kartu = "", kipas = "", bit = "";
  for (let i = 0; i < info.length; i++) {
    kartu += '<div class="st"><div class="stt"><small>' + info[i][1] + "</small>" + ic(info[i][0], 26) + "</div><h3>" + info[i][2] + "</h3><p>" + info[i][3] + "</p></div>";
  }
  for (let i = 0; i < KASUS_LAMA.length; i++) kipas += "<div><b>" + romawi(KASUS_LAMA[i].grade) + "</b><small>Grade</small></div>";
  for (let j = 0; j < GEJALA.length; j++) bit += '<i class="' + (KASUS_LAMA[1].vektor[j] === 1 ? "on" : "") + '" title="' + esc(GEJALA[j].nama) + '"></i>';
  return { nav: 0, html: `
    <section class="wrap" style="padding-top:8px"><div class="hero2">
      <div>
        <span class="pill">${ic("shield-check", 16)} Case-Based Reasoning</span>
        <h1>Gejala yang kamu rasakan, dicocokkan dengan kasus nyata.</h1>
        <p class="lead">Sistem membandingkan gejala pasien dengan ${KASUS_LAMA.length} kasus rujukan dari rekam medis RSUD dr. Soeselo Slawi, lalu menunjukkan grade demam berdarah yang paling mirip.</p>
        <div class="cta"><a class="btn light" href="#/identitas">Mulai Pemeriksaan ${ic("arrow-right", 18)}</a><a class="btn ghostw" href="#/dataset">Lihat dataset</a></div>
      </div>
      <div class="fan" aria-hidden="true">${kipas}</div>
    </div></section>
    <section class="wrap blok"><h2>Cara kerjanya</h2><p class="mute" style="margin:6px 0 20px">Tiga langkah, tanpa perlu memahami perhitungannya.</p><div class="g3">${kartu}</div></section>
    <section class="wrap blok"><div class="metode">
      <div><h2>Gejala diubah menjadi pola</h2><p class="mute" style="margin-top:8px">Setiap gejala bernilai 1 bila ada dan 0 bila tidak. Pola pasien dibandingkan dengan pola tiap kasus rujukan memakai Cosine Similarity. Nilainya menunjukkan kemiripan kasus, bukan peluang pasti diagnosis.</p></div>
      <div><div class="bits">${bit}</div><p class="mute" style="font-size:.82rem;margin-top:10px">Contoh pola gejala kasus ${KASUS_LAMA[1].grade}. Kotak terang berarti gejala ada.</p></div>
    </div></section>` };
}

// ----- Identitas -----
function halamanIdentitas() {
  const p = pasien || { nama: "", usia: "", jk: "" };
  function jk(v) { return '<label class="' + (p.jk === v ? "on" : "") + '"><input type="radio" name="jk" value="' + v + '" ' + (p.jk === v ? "checked" : "") + ">" + v + "</label>"; }
  return { nav: 1, html: `
    <div class="wrap page split">
      <aside class="card side"><h3>Alur pemeriksaan</h3>${vs(1)}</aside>
      <section class="card">
        <h2>Data pasien</h2><p class="mute" style="margin-top:4px">Identitas hanya untuk melengkapi laporan dan tidak ikut dihitung.</p>
        <div class="fg" style="margin-top:22px">
          <div class="full"><label for="nama">Nama lengkap</label><input type="text" id="nama" value="${esc(p.nama)}" autocomplete="off" placeholder="Contoh: Azhar"></div>
          <div><label for="usia">Usia (tahun)</label><input type="number" id="usia" min="0" max="120" value="${esc(p.usia)}" placeholder="34"></div>
          <div><label>Jenis kelamin</label><div class="seg">${jk("Laki-laki")}${jk("Perempuan")}</div></div>
        </div>
        <p class="err" id="err" role="alert"></p>
        <button class="btn" id="next">Lanjut pilih gejala ${ic("arrow-right", 18)}</button>
      </section>
    </div>`,
    init: function () {
      const r = document.querySelectorAll("input[name=jk]");
      for (let i = 0; i < r.length; i++) r[i].onchange = function () {
        for (let k = 0; k < r.length; k++) r[k].parentNode.classList.toggle("on", r[k].checked);
      };
      document.getElementById("next").onclick = function () {
        const nama = document.getElementById("nama").value.trim();
        const usia = document.getElementById("usia").value.trim();
        const j = document.querySelector("input[name=jk]:checked");
        if (!nama || !usia || !j) { document.getElementById("err").textContent = "Nama, usia, dan jenis kelamin wajib diisi."; return; }
        pasien = { nama: nama, usia: usia, jk: j.value };
        simpan();
        location.hash = "#/gejala";
      };
    } };
}

// ----- Gejala -----
function halamanGejala() {
  if (!pasien) return { pindah: "#/identitas" };
  let a = "", b = "";
  for (let j = 0; j < GEJALA.length; j++) {
    const on = ada(GEJALA[j].kode);
    const c = '<label class="tile ' + (on ? "on" : "") + '"><input type="checkbox" value="' + GEJALA[j].kode + '" ' + (on ? "checked" : "") + '><span class="kd">' + GEJALA[j].kode + '</span><span class="ck">' + ic("check", 13) + '</span><span class="nm">' + esc(GEJALA[j].nama) + "</span></label>";
    if (j < 11) a += c; else b += c;
  }
  return { nav: 1, html: `
    <div class="wrap page split">
      <section class="card">
        <h2>Apa yang dirasakan ${esc(pasien.nama)}?</h2><p class="mute" style="margin-top:4px">Ketuk kartu untuk memilih gejala.</p>
        <h3 class="gh">Keluhan</h3><div class="tiles">${a}</div>
        <h3 class="gh">Hasil lab darah <span class="mute" style="font-weight:500">(pilih bila ada kelainan)</span></h3><div class="tiles">${b}</div>
      </section>
      <aside class="card side late">
        <h3>Alur pemeriksaan</h3>${vs(2)}
        <div class="meter"><div class="mn"><b id="n">0</b><span>/ ${GEJALA.length}<em> gejala</em></span></div><div class="prog"><i id="prog"></i></div></div>
        <div class="sb"><button class="btn" id="go">Lihat hasil ${ic("arrow-right", 18)}</button><button class="btn sec" id="back" aria-label="Kembali ke identitas">${ic("arrow-left", 18)}<span class="tx">Kembali</span></button></div>
        <p class="err" id="err" role="alert"></p>
      </aside>
    </div>`,
    init: function () {
      const kotak = document.querySelectorAll(".tiles input");
      function ambil() { const h = []; for (let i = 0; i < kotak.length; i++) if (kotak[i].checked) h.push(kotak[i].value); return h; }
      function ubah() {
        const n = ambil().length;
        document.getElementById("n").textContent = n;
        document.getElementById("prog").style.width = (n / GEJALA.length * 100) + "%";
      }
      for (let i = 0; i < kotak.length; i++) kotak[i].onchange = function () { this.parentNode.classList.toggle("on", this.checked); ubah(); };
      ubah();
      document.getElementById("back").onclick = function () { location.hash = "#/identitas"; };
      document.getElementById("go").onclick = function () {
        pilih = ambil();
        if (pilih.length === 0) { document.getElementById("err").textContent = "Pilih sedikitnya satu gejala."; return; }
        simpan();
        location.hash = "#/hasil";
      };
    } };
}

// ----- Hasil (lembar laporan) -----
function halamanHasil() {
  if (!pasien) return { pindah: "#/identitas" };
  if (pilih.length === 0) return { pindah: "#/gejala" };
  const K1 = buatKasusBaru(pilih);
  const r = hitungCBR(K1);
  const t = r.terbaik;
  const cocok = t.cosine > 0;

  let namaGrade = "", skala = "", kolom = "";
  for (let i = 0; i < KASUS_LAMA.length; i++) {
    const top = cocok && KASUS_LAMA[i].kode === t.kode;
    if (top) namaGrade = KASUS_LAMA[i].nama;
    skala += '<div class="' + (top ? "on" : "") + '">' + romawi(KASUS_LAMA[i].grade) + "</div>";
    kolom += '<div class="col ' + (top ? "top" : "") + '"><div class="area"><span class="v">' + persen(r.hasil[i].cosine) + '</span><div class="b" data-h="' + (r.hasil[i].cosine * 120).toFixed(0) + '"></div></div><small>' + KASUS_LAMA[i].grade + "</small></div>";
  }
  let tag = "";
  for (let j = 0; j < GEJALA.length; j++) if (K1[j] === 1) tag += '<span class="tag">' + esc(GEJALA[j].nama) + "</span>";

  let rin = "", vek = "", kep = "";
  for (let i = 0; i < r.hasil.length; i++) {
    const h = r.hasil[i];
    rin += "<tr><td>" + h.grade + "</td><td>" + h.dot + "</td><td>" + h.panjang_k1.toFixed(4) + "</td><td>" + h.panjang_dhf.toFixed(4) + "</td><td><b>" + h.cosine.toFixed(4) + "</b></td></tr>";
    kep += "<th>" + KASUS_LAMA[i].kode + "</th>";
  }
  for (let j = 0; j < GEJALA.length; j++) {
    vek += "<tr><td>" + GEJALA[j].kode + " " + esc(GEJALA[j].nama) + "</td><td>" + K1[j] + "</td>";
    for (let i = 0; i < KASUS_LAMA.length; i++) vek += "<td>" + KASUS_LAMA[i].vektor[j] + "</td>";
    vek += "</tr>";
  }
  const tgl = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const utama = cocok
    ? `<div><p class="lbl">Kasus paling mirip</p><div class="big">${t.grade}</div><p style="margin-top:8px;font-weight:600;color:var(--deep-twilight)">${namaGrade}</p><div class="scale">${skala}</div></div>
       <div class="pc"><p class="lbl">Tingkat kemiripan</p><div class="pct">${persen(t.cosine)}</div><p class="mute" style="font-size:.85rem">dengan kasus ${t.kode}</p></div>`
    : `<div><p class="lbl">Hasil</p><div class="big" style="font-size:clamp(1.8rem,6vw,2.6rem)">Belum ada grade yang cocok</div><p class="mute" style="margin-top:10px">Gejala ini tidak menyerupai kasus DHF mana pun. Periksakan ke dokter bila keluhan berlanjut.</p></div>`;

  return { nav: 1, html: `
    <div class="wrap page" style="max-width:920px">
      <article class="sheet">
        <div class="sh-top"><b>${ic("file-text", 16)} Laporan pemeriksaan</b><span>${tgl}</span></div>
        <div class="sh-main">${utama}</div>
        <div class="sh-body">
          <div class="blk"><h3>Data pasien</h3><dl><dt>Nama</dt><dd>${esc(pasien.nama)}</dd><dt>Usia</dt><dd>${esc(pasien.usia)} tahun</dd><dt>Jenis kelamin</dt><dd>${esc(pasien.jk)}</dd></dl></div>
          <div class="blk"><h3>Gejala yang dipilih (${pilih.length})</h3>${tag}</div>
        </div>
        <div class="blk" style="border-top:1.5px dashed var(--line)"><h3>Perbandingan dengan tiap grade</h3><div class="chart">${kolom}</div></div>
      </article>
      <div class="note">${ic("info", 18)}<span>Nilai kemiripan menunjukkan seberapa dekat gejala pasien dengan kasus rujukan, bukan peluang pasti diagnosis. Hasil ini rekomendasi awal dan perlu dikonfirmasi dokter.</span></div>
      <details><summary>${ic("calculator", 20)} Detail perhitungan CBR ${ic("chevron-down", 20)}</summary><div>
        <p class="mute" style="margin-bottom:12px">Cosine = dot product / (panjang K1 x panjang kasus rujukan)</p>
        <div class="scroll"><table><thead><tr><th>Kasus</th><th>Dot product</th><th>Panjang K1</th><th>Panjang kasus</th><th>Cosine</th></tr></thead><tbody>${rin}</tbody></table></div>
        <h3 style="margin:20px 0 10px">Pola gejala yang dibandingkan</h3>
        <div class="scroll"><table><thead><tr><th>Gejala</th><th>K1</th>${kep}</tr></thead><tbody>${vek}</tbody></table></div>
      </div></details>
      <div class="acts"><a class="btn sec" href="#/gejala">${ic("arrow-left", 18)} Ubah gejala</a><a class="btn" id="baru" href="#/identitas">${ic("rotate-ccw", 18)} Periksa pasien lain</a></div>
    </div>`,
    init: function () {
      document.getElementById("baru").onclick = function () { pasien = null; pilih = []; simpan(); };
      const bar = document.querySelectorAll(".chart .b");
      setTimeout(function () { for (let i = 0; i < bar.length; i++) bar[i].style.height = bar[i].getAttribute("data-h") + "px"; }, 80);
    } };
}

// ----- Dataset -----
function halamanDataset() {
  let kep = "", tot = "";
  for (let i = 0; i < KASUS_LAMA.length; i++) {
    kep += "<th>" + KASUS_LAMA[i].grade + "</th>";
    let n = 0;
    for (let j = 0; j < GEJALA.length; j++) n += KASUS_LAMA[i].vektor[j];
    tot += "<td><b>" + n + "</b></td>";
  }
  function isi(q) {
    let s = "", n = 0;
    q = q.toLowerCase();
    for (let j = 0; j < GEJALA.length; j++) {
      if ((GEJALA[j].nama + " " + GEJALA[j].kode).toLowerCase().indexOf(q) < 0) continue;
      n++;
      s += "<tr><td><b>" + GEJALA[j].kode + "</b> &nbsp;" + esc(GEJALA[j].nama) + "</td>";
      for (let i = 0; i < KASUS_LAMA.length; i++) s += '<td><span class="dot ' + (KASUS_LAMA[i].vektor[j] === 1 ? "y" : "n") + '" role="img" aria-label="' + (KASUS_LAMA[i].vektor[j] === 1 ? "ada" : "tidak ada") + '"></span></td>';
      s += "</tr>";
    }
    return n ? s : '<tr><td colspan="' + (KASUS_LAMA.length + 1) + '" class="kosong">Gejala tidak ditemukan.</td></tr>';
  }
  return { nav: 2, html: `
    <div class="wrap page"><h1 class="jd">Dataset kasus rujukan</h1>
      <p class="mute" style="margin-top:8px;max-width:40em">Empat kasus lama sebagai pembanding. Titik terisi berarti gejala ada pada grade tersebut.</p>
      <div class="tools">${ic("search", 18)}<input type="search" id="cari" placeholder="Cari gejala..." aria-label="Cari gejala"></div>
      <div class="card" style="padding:8px"><div class="scroll"><table class="mat"><thead><tr><th>Gejala</th>${kep}</tr></thead><tbody id="isi">${isi("")}</tbody><tfoot><tr><td>Jumlah gejala</td>${tot}</tr></tfoot></table></div></div>
      <p class="mute" style="margin-top:14px;font-size:.88rem">Sumber: Jatmiko, Junaedi, dan Imrona (2017), Tabel 2-1 sampai 2-3.</p></div>`,
    init: function () { document.getElementById("cari").oninput = function () { document.getElementById("isi").innerHTML = isi(this.value); }; } };
}

tampil();