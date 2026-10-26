// ===== PERHITUNGAN CBR (Cosine Similarity, logika dasar tanpa library) =====

// Mengubah gejala terpilih (array kode) menjadi vektor kasus baru K1
function buatKasusBaru(terpilih) {
  let k1 = [];
  for (let j = 0; j < GEJALA.length; j++) {
    let ada = 0;
    for (let t = 0; t < terpilih.length; t++) {
      if (terpilih[t] === GEJALA[j].kode) { ada = 1; }
    }
    k1.push(ada);
  }
  return k1;
}

// Menghitung similarity K1 terhadap seluruh kasus lama
function hitungCBR(K1) {
  let hasil = [];

  for (let i = 0; i < KASUS_LAMA.length; i++) {
    let dot = 0;
    let kuadrat_k1 = 0;
    let kuadrat_dhf = 0;

    for (let j = 0; j < GEJALA.length; j++) {
      dot = dot + K1[j] * KASUS_LAMA[i].vektor[j];
      kuadrat_k1 = kuadrat_k1 + K1[j] * K1[j];
      kuadrat_dhf = kuadrat_dhf + KASUS_LAMA[i].vektor[j] * KASUS_LAMA[i].vektor[j];
    }

    let panjang_k1 = Math.sqrt(kuadrat_k1);
    let panjang_dhf = Math.sqrt(kuadrat_dhf);
    let cosine = dot / (panjang_k1 * panjang_dhf);

    hasil.push({
      kode: KASUS_LAMA[i].kode,
      grade: KASUS_LAMA[i].grade,
      dot: dot,
      kuadrat_k1: kuadrat_k1,
      kuadrat_dhf: kuadrat_dhf,
      panjang_k1: panjang_k1,
      panjang_dhf: panjang_dhf,
      cosine: cosine
    });
  }

  // Mencari nilai tertinggi
  let posisi = 0;
  for (let i = 1; i < hasil.length; i++) {
    if (hasil[i].cosine > hasil[posisi].cosine) { posisi = i; }
  }

  // Urutkan dari similarity tertinggi (bubble sort sederhana pada salinan)
  let urut = hasil.slice();
  for (let a = 0; a < urut.length - 1; a++) {
    for (let b = 0; b < urut.length - 1 - a; b++) {
      if (urut[b].cosine < urut[b + 1].cosine) {
        let tmp = urut[b]; urut[b] = urut[b + 1]; urut[b + 1] = tmp;
      }
    }
  }

  return { hasil: hasil, urut: urut, terbaik: hasil[posisi] };
}
