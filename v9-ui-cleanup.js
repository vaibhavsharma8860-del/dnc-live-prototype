/* DNC v9: search/filter layout, evidence copy cleanup, RLC flags, modal spacing */
const v9Style=document.createElement('style');
v9Style.textContent=`
/* Search + filters share one responsive discovery row. */
.search-card .search-controls{display:flex!important;flex-wrap:wrap!important;align-items:flex-end!important;column-gap:16px!important;row-gap:12px!important;width:100%}
.search-card .search-field{flex:1 1 360px!important;min-width:260px!important}
.search-card .search-controls>.filter-field{flex:0 1 170px;min-width:150px!important}
.search-card .search-controls>.filter-field select{width:100%}
.search-card .search-controls>.button{flex:0 0 auto;align-self:flex-end}
.search-card .filters-row{display:none!important;margin:0!important;padding:0!important;border:0!important}
/* Selection bar keeps the Shopify-style structure without a filled strip. */
.selection-bar.v8-selection-bar{background:transparent!important;border-radius:0!important;padding-left:16px!important;padding-right:16px!important}
/* Give modal headings more breathing room. */
.restriction-modal-header{padding:28px 30px 22px!important}
.restriction-modal-header .modal-title-row{gap:24px!important}
.restriction-modal-header .modal-title-row h2{line-height:1.2!important;margin:0 0 8px!important}
.restriction-modal-header .modal-title-row p{margin:0!important;line-height:1.5!important}
/* Country identity treatment. */
.v9-country-name,.v9-country-title{display:inline-flex;align-items:center;gap:8px;min-width:0}
.v9-country-flag{display:inline-flex;align-items:center;justify-content:center;width:20px;min-width:20px;font-size:16px;line-height:1}
.v9-country-title .v9-country-flag{width:22px;min-width:22px;font-size:18px}
/* Keep evidence metadata concise. */
.v8-open-hint{display:none!important}
@media(max-width:760px){
 .search-card .search-field{flex:1 1 100%!important;min-width:100%!important}
 .search-card .search-controls>.filter-field{flex:1 1 160px;min-width:140px!important}
 .restriction-modal-header{padding:24px 22px 20px!important}
}
@media(max-width:520px){
 .search-card .search-controls>.filter-field{flex:1 1 100%;min-width:100%!important}
 .search-card .search-controls>.button{width:auto}
}
`;
document.head.appendChild(v9Style);

const v9Flags={
 'Iran':'🇮🇷','North Korea':'🇰🇵','Syria':'🇸🇾','Cuba':'🇨🇺','Belarus':'🇧🇾','Russia':'🇷🇺','Sudan':'🇸🇩','Myanmar':'🇲🇲'
};
function v9Flag(country){return v9Flags[country]||'🌐'}

/* Preserve all existing search state logic, but use Enter instead of a button. */
document.addEventListener('keydown',e=>{
 if(e.key!=='Enter'||e.isComposing)return;
 if(e.target?.id==='search-input'){e.preventDefault();runSearch();return}
 if(e.target?.id==='idnc-search'){e.preventDefault();runPersonSearch();return}
 if(e.target?.id==='blacklist-search'){e.preventDefault();runBlacklistSearch();return}
 if(e.target?.id==='audit-search'){e.preventDefault();runAuditSearch();return}
},true);

function v9MergeSearchAndFilters(){
 document.querySelectorAll('.search-card').forEach(card=>{
  const controls=card.querySelector('.search-controls');
  if(!controls)return;
  controls.querySelectorAll('[data-action="search"],[data-action="idnc-search"],[data-action="blacklist-search"],[data-action="audit-search"]').forEach(b=>b.remove());
  const filters=card.querySelector('.filters-row');
  if(filters){
   [...filters.children].forEach(child=>controls.appendChild(child));
   filters.remove();
  }
 });
}
function v9CleanEvidenceCopy(){
 document.querySelectorAll('.v8-open-hint').forEach(x=>x.remove());
 const walker=document.createTreeWalker(document.getElementById('app'),NodeFilter.SHOW_TEXT);
 const remove=[];let n;
 while(n=walker.nextNode()){
  const t=(n.nodeValue||'').trim();
  if(t==='Evidence retained for compliance audit.'||t==='Opens in a new tab')remove.push(n);
 }
 remove.forEach(n=>{
  const p=n.parentElement;
  if(p&&p.textContent.trim()===n.nodeValue.trim())p.remove();else n.nodeValue='';
 });
}
function v9DecorateRlcFlags(){
 if(state.view==='rlc'){
  document.querySelectorAll('.data-table tbody tr').forEach(row=>{
   const cell=row.cells?.[1];if(!cell||cell.querySelector('.v9-country-name'))return;
   const recordId=row.dataset.v5Record;
   const rec=state.rlcRecords.find(r=>r.id===recordId)||state.rlcRecords.find(r=>(cell.textContent||'').trim()===r.country);
   if(!rec)return;
   const clickable=cell.querySelector('button,strong,a')||cell;
   const name=rec.country;
   clickable.innerHTML=`<span class="v9-country-name"><span class="v9-country-flag" aria-hidden="true">${v9Flag(name)}</span><span>${esc(name)}</span></span>`;
   if(clickable!==cell)clickable.setAttribute('aria-label',`${name} record details`);
  });
 }
}

/* Add the same flag to an open RLC record modal. */
const v9RecordDetailOriginal=recordDetailModal;
recordDetailModal=function(){
 let html=v9RecordDetailOriginal();
 const r=state.recordDetail;
 if(r?._kind==='rlc'){
  const title=v5RecordTitle(r), flag=v9Flag(title);
  html=html.replace(`<h2 id="record-detail-title">${esc(title)}</h2>`,`<h2 id="record-detail-title"><span class="v9-country-title"><span class="v9-country-flag" aria-hidden="true">${flag}</span><span>${esc(title)}</span></span></h2>`);
 }
 html=html.replace(/<span class="v8-open-hint">Opens in a new tab<\/span>/g,'');
 html=html.replace(/<p class="results-logic" style="margin-top:10px">Evidence retained for compliance audit\.<\/p>/g,'');
 return html;
};

function v9Decorate(){v9MergeSearchAndFilters();v9CleanEvidenceCopy();v9DecorateRlcFlags()}
const v9Observer=new MutationObserver(()=>v9Decorate());
v9Observer.observe(document.getElementById('app'),{childList:true,subtree:true});
setTimeout(v9Decorate,0);
