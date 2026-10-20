"use strict";
/* State aplikasi, helper, dan penyimpanan (localStorage dengan fallback memori) */

let retained=[],selected=new Set(),last=null,memOnly=false,saved=false,revised=false;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const f3=n=>n.toFixed(3).replace(".",",");

/* ===== Penyimpanan ===== */
function load(){try{const r=localStorage.getItem(KEY);retained=r?JSON.parse(r):[];}catch(e){memOnly=true;retained=[];}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(retained));}catch(e){memOnly=true;}}
const allCases=()=>DEFAULT_CASES.concat(retained);
