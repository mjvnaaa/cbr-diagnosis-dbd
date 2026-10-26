// ===== BASIS PENGETAHUAN =====
// Sumber: Jatmiko dkk. (2017), Tabel 2-2 (gejala), Tabel 2-1 (klasifikasi), Tabel 2-3 (gejala per grade).
const GEJALA = [
  { kode: "G1", nama: "Demam" },
  { kode: "G2", nama: "Mual" },
  { kode: "G3", nama: "Muntah" },
  { kode: "G4", nama: "Lemas" },
  { kode: "G5", nama: "Mencret" },
  { kode: "G6", nama: "Kejang" },
  { kode: "G7", nama: "Tenggorokan Sakit" },
  { kode: "G8", nama: "Bintik Merah" },
  { kode: "G9", nama: "Mimisan" },
  { kode: "G10", nama: "Nyeri Sendi" },
  { kode: "G11", nama: "Pusing" },
  { kode: "G12", nama: "Leukosit" },
  { kode: "G13", nama: "Hematokrit" },
  { kode: "G14", nama: "Trombosit" }
];

// Kasus lama: 1 = gejala ada, 0 = tidak ada
const KASUS_LAMA = [
  { kode: "DHF1", grade: "DHF-I", nama: "Demam Berdarah Grade I",   vektor: [1,0,0,0,0,0,0,1,0,0,0,1,1,1] },
  { kode: "DHF2", grade: "DHF-II", nama: "Demam Berdarah Grade II",  vektor: [1,0,0,0,0,0,0,1,1,0,0,1,1,1] },
  { kode: "DHF3", grade: "DHF-III", nama: "Demam Berdarah Grade III", vektor: [1,0,0,0,0,0,0,1,1,1,0,1,1,1] },
  { kode: "DHF4", grade: "DHF-IV", nama: "Demam Berdarah Grade IV",  vektor: [1,0,0,0,0,1,0,0,0,1,0,1,1,1] }
];
