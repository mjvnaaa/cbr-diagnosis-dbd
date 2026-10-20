"use strict";
/* Logika CBR: toVector, euclidean, jaccard, retrieve, reuse (replika cbr_dbd.ipynb) */

function toVector(ids){return SYMPTOMS.map(s=>ids.has(s.id)?1:0);}
function diffCount(a,b){return a.reduce((n,x,i)=>n+(x!==b[i]?1:0),0);}
function euclidean(a,b){return Math.sqrt(a.reduce((n,x,i)=>n+(x-b[i])**2,0));}
function jaccard(a,b){const same=a.reduce((n,x,i)=>n+(x&&b[i]?1:0),0);const u=a.reduce((n,x)=>n+x,0)+b.reduce((n,x)=>n+x,0)-same;return u?same/u:0;}
function retrieve(vec){
  return allCases().map(c=>{
    const d=euclidean(vec,c.vec);
    return{c,same:vec.reduce((n,x,i)=>n+(x&&c.vec[i]?1:0),0),diff:diffCount(vec,c.vec),d,sim:1/(1+d),sv:jaccard(vec,c.vec)};
  }).sort((a,b)=>a.diff-b.diff||GORDER.indexOf(a.c.grade)-GORDER.indexOf(b.c.grade));
}
function reuse(rows,n){
  const byGrade=GORDER.map(g=>rows.find(r=>r.c.grade===g)).filter(Boolean)
    .sort((a,b)=>a.diff-b.diff||GORDER.indexOf(a.c.grade)-GORDER.indexOf(b.c.grade));
  const ties=byGrade.filter(r=>r.diff===byGrade[0].diff);
  const tie=ties.length>1;
  return{byGrade,best:byGrade[0],tie,ties,vague:tie||n<=2,far:byGrade[0].d>2.5};
}
