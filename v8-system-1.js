/* DNC v8: shared duplicate engine, Shopify selection parity, evidence metadata/new-tab preview, spacing audit */
const v8Style=document.createElement('style');
v8Style.textContent=`
/* Figma selection bar: contextual table header pattern */
.selection-bar.v8-selection-bar{position:relative;min-height:48px;height:auto;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 16px;background:var(--surface-subtle,#f8fafb);border:0;border-radius:12px 12px 0 0;color:var(--text);}
.v8-selection-left,.v8-selection-right{display:flex;align-items:center;gap:10px;min-width:0}.v8-selection-left{flex-wrap:wrap}.v8-selection-label{font-size:12px;line-height:16px;font-weight:500;white-space:nowrap}.v8-selection-dropdown{width:32px;height:32px;border:0;background:transparent;border-radius:6px;display:grid;place-items:center;cursor:pointer;color:var(--text)}.v8-selection-dropdown:hover,.v8-selection-dropdown:focus-visible{background:#eef2f4;outline:2px solid transparent}.v8-selection-dropdown svg{width:16px;height:16px}.v8-selection-action{min-height:34px;padding:8px 12px;border:1px solid var(--control-border,#87939c);background:white;border-radius:8px;font:500 12px/16px inherit;color:var(--text);cursor:pointer}.v8-selection-action:hover{background:#f8fafb}.v8-selection-right{gap:8px;color:var(--text-secondary);font-size:12px;white-space:nowrap}.v8-toggle{width:32px;height:18px;border:0;border-radius:999px;background:#d8e2e7;padding:2px;cursor:pointer;display:flex;align-items:center;justify-content:flex-start;transition:.15s ease}.v8-toggle::after{content:"";width:14px;height:14px;background:white;border-radius:50%;box-shadow:0 1px 2px rgba(10,31,41,.18)}.v8-toggle[aria-checked="true"]{background:var(--primary);justify-content:flex-end}.v8-selection-menu{position:absolute;left:42px;top:43px;z-index:30;min-width:220px;padding:4px;background:white;border:1px solid var(--border);border-radius:8px;box-shadow:0 12px 28px rgba(10,31,41,.14)}.v8-selection-menu button{width:100%;height:40px;padding:0 12px;border:0;background:white;text-align:left;border-radius:6px;font:400 12px/16px inherit;color:var(--text);cursor:pointer}.v8-selection-menu button:hover,.v8-selection-menu button:focus-visible{background:#f3f7f9}.v8-scope-notice{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:42px;margin-top:-12px;margin-bottom:-8px;padding:0 0 0 0;font-size:13px;line-height:20px;color:var(--text)}.v8-scope-notice button{border:0;background:transparent;color:var(--primary);font:500 12px/16px inherit;cursor:pointer;padding:8px 0;white-space:nowrap}.v8-show-selected-hidden{display:none!important}
/* Controls and cards: consistent breathing room */
.search-card,.panel-card,.card{box-sizing:border-box}.filters-row{column-gap:20px;row-gap:12px}.filter-field,.sort-control{min-width:0}.app-main select,.restriction-modal select{padding-left:12px!important;padding-right:44px!important;background-position:right 14px center!important}.restriction-modal-body{padding:24px!important}.restriction-modal-footer{padding:14px 24px!important}.record-detail-card{padding:16px!important}.evidence-file-row{padding:10px 12px!important}.evidence-meta{line-height:18px!important}.v8-evidence-date{display:block;margin-top:4px;color:var(--text-secondary);font-size:12px;line-height:16px}.v8-open-hint{display:block;margin-top:2px;color:var(--text-secondary);font-size:11px;line-height:16px}

/* Final geometry audit corrections */
.data-table .table-link{min-width:32px;min-height:32px;display:inline-flex;align-items:center;padding-top:0;padding-bottom:0}
.card.panel-card:not(.coverage-figma-card),.compare-card{padding:16px!important}
.app-main .page-body{min-height:100vh}
@media(max-width:780px){.selection-bar.v8-selection-bar{align-items:flex-start;flex-direction:column}.v8-selection-right{align-self:flex-end}.v8-scope-notice{align-items:flex-start;flex-direction:column;gap:4px}.restriction-modal-body{padding:20px!important}}
`;
document.head.appendChild(v8Style);

function v8Norm(v){return String(v||'').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/,'').replace(/[^a-z0-9@.]+/g,' ').replace(/\s+/g,' ').trim()}
function v8Lev(a,b){a=v8Norm(a);b=v8Norm(b);if(!a||!b)return 99;const m=Array(b.length+1).fill(0).map((_,i)=>i);for(let i=1;i<=a.length;i++){let prev=m[0];m[0]=i;for(let j=1;j<=b.length;j++){const old=m[j];m[j]=Math.min(m[j]+1,m[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old}}return m[b.length]}
function v8Near(a,b){a=v8Norm(a);b=v8Norm(b);if(!a||!b||Math.min(a.length,b.length)<5)return false;return a.includes(b)||b.includes(a)||v8Lev(a,b)<=Math.max(1,Math.floor(Math.min(a.length,b.length)/6))}
function v8ChosenSubtype(){return state.addSubtype||state.v8OverviewIdncSubtype||document.querySelector('#modal-idnc-type')?.value||'Expert'}
function v8FindDuplicate(){
 const name=v8Norm(state.modalCompany), domain=v8Norm(state.modalDomain), email=v8Norm(state.modalEmail||state.modalPersonEmail);
 if(state.addType==='CDNC'){
  const exact=state.liveRecords.find(r=>(name&&v8Norm(r.company)===name)||(domain&&[r.domain,r.website].some(x=>v8Norm(x)===domain)));
  if(exact)return {kind:'exact',label:exact.company,type:'CDNC',record:exact,recordKind:'cdnc'};
  const near=state.liveRecords.find(r=>v8Near(name,r.company)||v8Near(domain,r.domain)); if(near)return {kind:'possible',label:near.company,type:'CDNC',record:near,recordKind:'cdnc'};
 }
 if(state.addType==='IDNC'){
  const subtype=