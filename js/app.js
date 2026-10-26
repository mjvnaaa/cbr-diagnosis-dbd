// ===== Router dan halaman =====
const el = document.getElementById("app");
let pasien = null;
let pilih = [];
try {
  pasien = JSON.parse(sessionStorage.getItem("pasien"));
  pilih = JSON.parse(sessionStorage.getItem("pilih")) || [];
} catch (e) {}

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
function ada(kode) { return pilih.indexOf(kode) >= 0; }

function setRail(now) {
  const li = document.querySelectorAll(".steps li");
  for (let i = 0; i < li.length; i++) {
    const s = Number(li[i].getAttribute("data-s"));
    li[i].className = s === now ? "now" : (s < now ? "done" : "");
  }
}

function tampil() {
  const path = location.hash.slice(1) || "/";
  const peta = { "/": halamanAwal, "/identitas": halamanIdentitas, "/gejala": halamanGejala, "/hasil": halamanHasil, "/dataset": halamanDataset };
  const h = (peta[path] || halamanAwal)();
  if (h.pindah) { location.hash = h.pindah; return; }
  el.innerHTML = h.html;
  if (h.init) h.init();
  setRail(h.langkah || 0);
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", tampil);
tampil();

// ----- Awal -----
function halamanAwal() {
  return { html: `
    <h1>Kenali tingkat demam berdarah dari gejala yang dirasakan</h1>
    <p class="lead">Centang gejala pasien. Sistem membandingkannya dengan ${KASUS_LAMA.length} kasus rujukan dari rekam medis, lalu menyebutkan grade yang paling mirip.</p>
    <svg class="curve" viewBox="0 0 600 150" role="img" aria-label="Ilustrasi kurva demam">
      <line class="dasar" x1="0" y1="110" x2="600" y2="110" style="stroke:var(--line);stroke-width:1.5;stroke-dasharray:5 5"/>
      <path d="M0 118 L60 62 L120 30 L190 26 L250 58 L310 104 L370 124 L430 84 L490 44 L550 58 L600 100"/>
      <circle cx="120" cy="30" r="5"/><circle cx="370" cy="124" r="5"/><circle cx="490" cy="44" r="5"/>
    </svg>
    <a class="btn" href="#/identitas">Mulai pemeriksaan</a>
    <a class="btn alt" href="#/dataset">Lihat dataset</a>
    <p class="catatan">Alat bantu belajar berdasarkan data RSUD dr. Soeselo Slawi (Jatmiko dkk., 2017). Hasilnya perlu dikonfirmasi dokter.</p>` };
}

// ----- Identitas -----
function halamanIdentitas() {
  const p = pasien || { nama: "", usia: "", jk: "" };
  return { langkah: 1, html: `
    <div class="panel">
      <h2>Siapa yang diperiksa?</h2>
      <p class="mute">Identitas hanya dicatat di laporan dan tidak memengaruhi hasil.</p>
      <div class="f"><label for="nama">Nama lengkap</label><input type="text" id="nama" value="${esc(p.nama)}" autocomplete="off"></div>
      <div class="f"><label for="usia">Usia (tahun)</label><input type="number" id="usia" min="0" max="120" value="${esc(p.usia)}"></div>
      <div class="f"><p>Jenis kelamin</p>
        <div class="pilihan">
          <label class="chip"><input type="radio" name="jk" value="Laki-laki" ${p.jk === "Laki-laki" ? "checked" : ""}><span>Laki-laki</span></label>
          <label class="chip"><input type="radio" name="jk" value="Perempuan" ${p.jk === "Perempuan" ? "checked" : ""}><span>Perempuan</span></label>
        </div></div>
      <p class="err" id="err"></p>
      <button class="btn" id="next">Pilih gejala</button>
    </div>`,
    init: function () {
      document.getElementById("next").onclick = function () {
        const nama = document.getElementById("nama").value.trim();
        const usia = document.getElementById("usia").value.trim();
        const jk = document.querySelector("input[name=jk]:checked");
        if (!nama || !usia || !jk) {
          document.getElementById("err").textContent = "Nama, usia, dan jenis kelamin wajib diisi.";
          return;
        }
        pasien = { nama: nama, usia: usia, jk: jk.value };
        simpan();
        location.hash = "#/gejala";
      };
    } };
}

// ----- Gejala -----
function halamanGejala() {
  if (!pasien) return { pindah: "#/identitas" };
  let keluhan = "", lab = "";
  for (let j = 0; j < GEJALA.length; j++) {
    const c = `<label class="chip"><input type="checkbox" value="${GEJALA[j].kode}" ${ada(GEJALA[j].kode) ? "checked" : ""}><span>${esc(GEJALA[j].nama)}</span></label>`;
    if (j < 11) keluhan += c; else lab += c;
  }
  return { langkah: 2, html: `
    <div class="panel">
      <h2>Apa yang dirasakan ${esc(pasien.nama)}?</h2>
      <p class="mute">Pilih semua yang sesuai.</p>
      <h3>Keluhan</h3><div class="pilihan">${keluhan}</div>
      <h3>Hasil lab darah (pilih bila ada kelainan)</h3><div class="pilihan">${lab}</div>
      <p class="hitung" id="hitung"></p>
      <p class="err" id="err"></p>
      <button class="btn alt" id="back">Kembali</button>
      <button class="btn" id="go">Lihat hasil</button>
    </div>`,
    init: function () {
      const kotak = document.querySelectorAll(".panel input[type=checkbox]");
      function ambil() {
        const hasil = [];
        for (let i = 0; i < kotak.length; i++) if (kotak[i].checked) hasil.push(kotak[i].value);
        return hasil;
      }
      function ubah() { document.getElementById("hitung").textContent = ambil().length + " gejala dipilih"; }
      for (let i = 0; i < kotak.length; i++) kotak[i].onchange = ubah;
      ubah();
      document.getElementById("back").onclick = function () { location.hash = "#/identitas"; };
      document.getElementById("go").onclick = function () {
        pilih = ambil();
        if (pilih.length === 0) {
          document.getElementById("err").textContent = "Pilih sedikitnya satu gejala.";
          return;
        }
        simpan();
        location.hash = "#/hasil";
      };
    } };
}

// ----- Hasil -----
function halamanHasil() {
  if (!pasien) return { pindah: "#/identitas" };
  if (pilih.length === 0) return { pindah: "#/gejala" };

  const K1 = buatKasusBaru(pilih);
  const r = hitungCBR(K1);
  const t = r.terbaik;
  const cocok = t.cosine > 0;

  let skala = "", namaGrade = "";
  for (let i = 0; i < KASUS_LAMA.length; i++) {
    const aktif = cocok && KASUS_LAMA[i].kode === t.kode;
    if (aktif) namaGrade = KASUS_LAMA[i].nama;
    skala += `<li class="${aktif ? "on" : ""}"><b>${KASUS_LAMA[i].grade.replace("DHF-", "")}</b><small>Grade</small></li>`;
  }
  let tag = "";
  for (let j = 0; j < GEJALA.length; j++) if (K1[j] === 1) tag += `<span class="tag">${esc(GEJALA[j].nama)}</span>`;

  const judul = cocok
    ? `<h1>${namaGrade}</h1><p class="lead">Gejala ${esc(pasien.nama)} paling mirip dengan kasus ${t.grade}.</p>
       <div class="meter" role="img" aria-label="Kemiripan ${persen(t.cosine)}"><i style="width:${(t.cosine * 100).toFixed(1)}%"></i></div>
       <p class="mute">Tingkat kemiripan ${persen(t.cosine)}</p>`
    : `<h1>Belum ada grade yang cocok</h1><p class="lead">Kombinasi gejala ini tidak menyerupai kasus DHF mana pun. Tetap periksakan ke dokter bila keluhan berlanjut.</p>`;

  return { langkah: 3, html: `
    <div class="panel">${judul}<ol class="skala">${skala}</ol>
      <p class="mute">Ini rekomendasi awal, bukan diagnosis akhir. Konfirmasikan ke dokter.</p></div>
    <div class="panel"><h2>Ringkasan pasien</h2>
      <dl><dt>Nama</dt><dd>${esc(pasien.nama)}</dd><dt>Usia</dt><dd>${esc(pasien.usia)} tahun</dd><dt>Jenis kelamin</dt><dd>${esc(pasien.jk)}</dd></dl>
      <h3>Gejala yang dipilih</h3>${tag}</div>
    <a class="btn alt" href="#/gejala">Ubah gejala</a>
    <a class="btn" href="#/identitas" id="baru">Periksa pasien lain</a>`,
    init: function () {
      document.getElementById("baru").onclick = function () { pasien = null; pilih = []; simpan(); };
    } };
}

// ----- Dataset -----
function halamanDataset() {
  let kepala = "", baris = "";
  for (let i = 0; i < KASUS_LAMA.length; i++) kepala += `<th>${KASUS_LAMA[i].grade}</th>`;
  for (let j = 0; j < GEJALA.length; j++) {
    baris += `<tr><td>${GEJALA[j].kode} &nbsp;${esc(GEJALA[j].nama)}</td>`;
    for (let i = 0; i < KASUS_LAMA.length; i++) {
      baris += KASUS_LAMA[i].vektor[j] === 1 ? `<td class="y">&#10003;</td>` : `<td class="n">&ndash;</td>`;
    }
    baris += `</tr>`;
  }
  return { html: `
    <h1>Dataset kasus rujukan</h1>
    <p class="lead">Empat kasus lama yang dipakai sebagai pembanding. Tanda centang berarti gejala ada pada kasus itu.</p>
    <div class="panel scroll"><table><tr><th>Gejala</th>${kepala}</tr>${baris}</table></div>
    <p class="catatan">Sumber: Jatmiko, Junaedi, dan Imrona (2017), Tabel 2-1 sampai 2-3.</p>` };
}
