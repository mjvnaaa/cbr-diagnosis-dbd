"use strict";
/* Tampilan: gejala, hasil, mode dokter (Revision dan Retain) */

/* ===== Tampilan gejala ===== */
function renderChips(){
  const q=$("q").value.trim().toLowerCase();
  $("chips").innerHTML=SYMPTOMS.filter(s=>!q||s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q)).map(s=>
    `<button type="button" class="chip" data-id="${s.id}" aria-pressed="${selected.has(s.id)}">${s.id} ${esc(s.name)}${s.lab?"<small>hasil lab</small>":""}</button>`).join("")||`<span class="hint">Tidak ada gejala yang cocok.</span>`;
  $("count").textContent=selected.size+" dipilih";
}
$("chips").addEventListener("click",e=>{
  const b=e.target.closest(".chip");if(!b)return;
  const id=b.dataset.id;selected.has(id)?selected.delete(id):selected.add(id);
  b.setAttribute("aria-pressed",selected.has(id));$("count").textContent=selected.size+" dipilih";
  $("vmsg").innerHTML="";hideResult();
});
$("q").addEventListener("input",renderChips);
$("clear").onclick=()=>{selected.clear();$("q").value="";renderChips();$("vmsg").innerHTML="";hideResult();};

function hideResult(){$("res").hidden=true;last=null;saved=revised=false;setSteps();docPanel();}
function setSteps(){
  $("st1").className=$("st2").className=last?"on":"";
  $("st3").className=last&&revised?"on":"";$("st4").className=last&&saved?"on":"";
}

/* ===== Hasil ===== */
$("go").onclick=()=>{
  if(!selected.size){$("vmsg").innerHTML=`<div class="msg er">Belum ada gejala yang dipilih. Pilih minimal satu gejala terlebih dahulu.</div>`;return;}
  $("vmsg").innerHTML="";
  const vec=toVector(selected),rows=retrieve(vec),r=reuse(rows,selected.size);
  last={vec,rows,r,n:selected.size,grade:r.tie?r.ties[0].c.grade:r.best.c.grade};
  saved=revised=false;renderResult();setSteps();docPanel();
  $("res").scrollIntoView({behavior:"smooth",block:"start"});
};
function renderResult(){
  const{vec,rows,r,n}=last,b=r.best;
  const names=ids=>ids.map(i=>`${SYMPTOMS[i].id} ${SYMPTOMS[i].name}`);
  const idx=vec.map((x,i)=>i);
  const cocok=idx.filter(i=>vec[i]&&b.c.vec[i]);
  const extra=idx.filter(i=>vec[i]&&!b.c.vec[i]);
  const miss=idx.filter(i=>!vec[i]&&b.c.vec[i]);
  const tags=(a,cls)=>a.length?names(a).map(t=>`<span class="tg ${cls}">${esc(t)}</span>`).join(""):`<span class="hint">—</span>`;
  const head=r.tie
    ?`Gejala belum cukup spesifik`
    :`Kemungkinan terdekat: DBD ${GRADES[b.c.grade].label}`;
  let html=`<p class="hint tight">Gejala Anda:</p><div>${tags(idx.filter(i=>vec[i]),"")}</div><h2 class="big spaced">${head}</h2>`;
  if(r.tie)html+=`<p>Jarak sama untuk: <b>${r.ties.map(t=>"DBD "+GRADES[t.c.grade].label).join("</b> dan <b>")}</b> Sistem tidak memaksa satu jawaban (perlu konfirmasi pakar). Tambahkan gejala yang dialami agar lebih spesifik.</p>`;
  html+=r.byGrade.map((x,i)=>`<div class="bar${i===0?" top":""}"><div class="t"><span>DBD ${GRADES[x.c.grade].label}</span><span>${(x.sim*100).toFixed(1).replace(".",",")}%</span></div><div class="tr"><div class="f" data-w="${(x.sim*100).toFixed(1)}"></div></div></div>`).join("");
  html+=`<p class="hint">Persen = tingkat kemiripan dengan kasus terdekat tiap grade.</p>`;
  if(!r.tie)html+=`<p>${esc(GRADES[b.c.grade].desc)}</p>`;
  html+=`<div class="lists"><div><h3>Gejala cocok dengan kasus ${esc(b.c.code)}</h3>${tags(cocok,"ok")}</div>
   <div><h3>Gejala tidak cocok</h3>${extra.length?`<div class="hint">Dipilih, tidak ada pada kasus:</div>${tags(extra,"no")}`:""}${miss.length?`<div class="hint">Ada pada kasus, tidak dipilih:</div>${tags(miss,"no")}`:""}${!extra.length&&!miss.length?`<span class="hint">Tidak ada.</span>`:""}</div></div>`;
  if(r.vague)html+=`<div class="warn">Gejala belum cukup spesifik${r.tie?": dua grade memiliki jarak yang sama.":": hanya "+n+" gejala dipilih, hasil ini sangat tentatif."}</div>`;
  if(r.far)html+=`<div class="warn">Gejala kurang cocok dengan pola DBD pada basis kasus.</div>`;
  html+=`<p class="hint">Perlu disimpan ke basis kasus? Dokter dapat merevisi grade (Revision) lalu menyimpannya (Retain) di Mode dokter.</p><div class="acts"><button class="btn" id="opendoc">Buka Mode dokter</button><button class="btn ghost" id="calc" aria-expanded="false">Lihat perhitungan</button></div>
   <div id="calcbox" class="tw" hidden><table><thead><tr><th>Peringkat</th><th>Kasus / Grade</th><th>Gejala sama</th><th>Gejala beda</th><th>Jarak d</th><th>Similarity 1/(1+d)</th><th>SV Jaccard</th></tr></thead><tbody>
   ${rows.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.c.code)} (Grade ${x.c.grade})</td><td>${x.same}</td><td>${x.diff}</td><td>${f3(x.d)}</td><td>${f3(x.sim)}</td><td>${f3(x.sv)}</td></tr>`).join("")}
   </tbody></table></div>`;
  const box=$("res");box.innerHTML=html;box.hidden=false;
  box.querySelectorAll(".f").forEach(el=>{el.style.width=el.dataset.w+"%";});
  $("opendoc").onclick=()=>{$("doc").open=true;$("doc").scrollIntoView({behavior:"smooth"});};
  $("calc").onclick=e=>{const o=$("calcbox").hidden;$("calcbox").hidden=!o;e.target.setAttribute("aria-expanded",o);};
}

/* ===== Mode dokter ===== */
function docPanel(){
  const el=$("docbody");
  if(!last){el.innerHTML="<p>Jalankan “Cek Tingkat DBD” lebih dulu, lalu tinjau hasilnya di sini.</p>";return;}
  const names=SYMPTOMS.filter((s,i)=>last.vec[i]).map(s=>`<span class="tg">${s.id} ${esc(s.name)}</span>`).join("");
  el.innerHTML=`<p>Kasus saat ini: ${names}</p>
   <p>Hasil sistem: <b>${last.r.tie?"Seri — "+last.r.ties.map(t=>"Grade "+t.c.grade).join(" / "):GRADES[last.r.best.c.grade].label}</b></p>
   <label for="rev">Revision: grade menurut dokter</label>
   <select id="rev">${GORDER.map(g=>`<option value="${g}"${g===last.grade?" selected":""}>${GRADES[g].label}</option>`).join("")}</select>
   <div class="acts"><button class="btn ghost" id="agree">Setuju</button><button class="btn" id="retain">Simpan ke Basis Kasus</button></div><div id="dmsg" role="status"></div>`;
  $("rev").onchange=e=>{last.grade=e.target.value;revised=true;setSteps();};
  $("agree").onclick=()=>{last.grade=last.r.tie?last.r.ties[0].c.grade:last.r.best.c.grade;$("rev").value=last.grade;revised=true;setSteps();$("dmsg").innerHTML=`<div class="msg ok">Hasil disetujui: Grade ${last.grade}.</div>`;};
  $("retain").onclick=()=>{
    const n=retained.reduce((m,c)=>Math.max(m,parseInt(c.code.slice(1),10)||0),0)+1;
    retained.push({code:"K"+n,grade:last.grade,vec:last.vec.slice()});persist();
    revised=saved=true;setSteps();renderBase();
    $("dmsg").innerHTML=`<div class="msg ok">Tersimpan sebagai K${n} (Grade ${last.grade}). Dipakai pada perhitungan berikutnya.</div>`;
  };
}
function renderBase(){
  $("storewarn").innerHTML=memOnly?`<div class="msg wn">localStorage tidak tersedia. Kasus hanya disimpan di memori dan hilang saat halaman ditutup.</div>`:"";
  $("cb").innerHTML=`<thead><tr><th>Kode</th><th>Diagnosis</th><th>Gejala</th><th>Aksi</th></tr></thead><tbody>`+allCases().map(c=>{
    const own=!DEFAULT_CASES.includes(c);
    return `<tr><td>${esc(c.code)}</td><td>Grade ${c.grade}</td><td class="w">${SYMPTOMS.filter((s,i)=>c.vec[i]).map(s=>`<span class="tg">${s.id}</span>`).join("")}</td><td>${own?`<button class="btn ghost sm" data-del="${esc(c.code)}" aria-label="Hapus kasus ${esc(c.code)}">Hapus</button>`:"—"}</td></tr>`;}).join("")+"</tbody>";
}
$("cb").addEventListener("click",e=>{
  const b=e.target.closest("[data-del]");if(!b)return;
  retained=retained.filter(c=>c.code!==b.dataset.del);persist();renderBase();
});
$("reset").onclick=()=>{
  if(!confirm("Reset basis kasus ke bawaan? Semua kasus hasil Retain akan dihapus."))return;
  retained=[];persist();renderBase();
};

/* ===== Mulai ===== */
load();renderChips();renderBase();setSteps();
