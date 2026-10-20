"use strict";
/* Data gejala dan basis kasus (identik dengan data_cbr.json) */

const SYMPTOMS=[
 ["G1","Demam"],["G2","Mual"],["G3","Muntah"],["G4","Lemas"],["G5","Mencret"],["G6","Kejang"],["G7","Tenggorokan Sakit"],
 ["G8","Bintik Merah"],["G9","Mimisan"],["G10","Nyeri Sendi"],["G11","Pusing"],["G12","Leukosit",1],["G13","Hematokrit",1],["G14","Trombosit",1]
].map(s=>({id:s[0],name:s[1],lab:!!s[2]}));
const v=s=>s.split("").map(Number);
const DEFAULT_CASES=[
 {code:"DHF-I",grade:"I",vec:v("10000001000111")},
 {code:"DHF-II",grade:"II",vec:v("10000001100111")},
 {code:"DHF-III",grade:"III",vec:v("10000001110111")},
 {code:"DHF-IV",grade:"IV",vec:v("10000100010111")}];
const GRADES={
 I:{label:"Grade I (Ringan)",desc:"Demam disertai gejala tidak khas; satu-satunya tanda perdarahan biasanya uji bendung (torniket) positif."},
 II:{label:"Grade II (Sedang)",desc:"Seperti Grade I, ditambah perdarahan spontan, misalnya di kulit, mimisan, atau gusi berdarah."},
 III:{label:"Grade III (Berat)",desc:"Mulai ada tanda gangguan sirkulasi: nadi cepat dan lemah, tekanan nadi menyempit, kulit dingin, gelisah."},
 IV:{label:"Grade IV (Sangat Berat)",desc:"Syok berat dengan nadi dan tekanan darah tidak teraba. Memerlukan penanganan darurat."}};
const GORDER=["I","II","III","IV"];
const KEY="cbr-dbd-retained";
