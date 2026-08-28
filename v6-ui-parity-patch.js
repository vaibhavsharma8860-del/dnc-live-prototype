/* DNC v6 Figma parity polish */
const v6Style=document.createElement('style');
v6Style.textContent=`
/* Overview coverage: match Figma component, no duplicated legacy content */
.coverage-figma-card{height:270px!important;min-height:270px!important;padding:16px!important;display:flex!important;flex-direction:column!important;gap:0!important}
.coverage-figma-title{font-size:16px;line-height:22px;font-weight:600;color:var(--text);margin:0 0 20px}
.coverage-figma-rows{display:flex;flex-direction:column;gap:20px;min-width:0}
.coverage-figma-row{display:grid;grid-template-columns:92px minmax(80px,1fr) auto;align-items:center;gap:12px;height:22px}
.coverage-figma-label{font-size:12px;line-height:18px;color:var(--text);font-weight:400}
.coverage-figma-track{height:8px;background:var(--border);border-radius:999px;overflow:hidden;min-width:8px}
.coverage-figma-fill{height:8px;border-radius:999px;min-width:8px}
.coverage-figma-value{font-size:12px;line-height:16px;color:var(--text);font-weight:500;font-variant-numeric:tabular-nums;text-align:right;min-width:38px}

/* Step 1 geometry from Figma */
.restriction-modal-body>.inline-alert+.form-grid{margin-top:20px}
.restriction-modal .inline-alert{padding:14px 16px}
.restriction-modal .form-grid{gap:18px 24px}
.restriction-modal .field{gap:8px}
.restriction-modal .field>span{line-height:16px}
.restriction-modal .field input,.restriction-modal .field select{height:42px;padding-left:12px;padding-right:12px}
.restriction-modal .field textarea{min-height:104px;padding:12px;line-height:18px}
.restriction-modal .field select{appearance:none;-webkit-appearance:none;padding-right:40px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2317232d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:16px 16px}
.restriction-modal .form-grid>.field-wide{grid-column:1/-1}

/* Figma compact upload */
.restriction-modal .upload-box{position:relative;min-height:104px;padding:14px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;background:var(--surface-subtle);border:1px solid var(--border);border-radius:8px;color:var(--text-secondary);cursor:pointer;overflow:hidden}
.restriction-modal .upload-box>svg{width:16px!important;height:16px!important;color:var(--primary)}
.restriction-modal .upload-box>div:nth-child(2){flex:0!important;text-align:center}
.restriction-modal .upload-box strong{margin:0 0 2px;font-weight:500;line-height:16px;color:var(--text)}
.restriction-modal .upload-box span{line-height:18px;color:var(--text-muted)}
.restriction-modal .upload-box>div:last-child{position:absolute;inset:0;margin:0}
.restriction-modal .upload-box>div:last-child .button{width:100%;height:100%;opacity:0;cursor:pointer}

/* Unified record affordance */
.clickable-row td:nth-child(2),.clickable-row td:nth-child(2) strong,.clickable-row td:nth-child(2) button{color:var(--primary)!important;font-weight:600!important}
.clickable-row:focus-visible{outline:2px solid var(--primary);outline-offset:-2px}
.record-title-line .badge-success{white-space:nowrap}
`;
document.head.appendChild(v6Style);

function v6CoverageMarkup(){
 const rows=[
  ['CDNC','4,912',100,'#af7016'],
  ['IDNC Expert','1,284',26,'#4f7cac'],
  ['IDNC Lead','1,536',31,'#146e46'],
  ['Blacklist','3,842',78,'#c94a4a'],
  ['RLC','14',2,'#8c5a0a']
 ];
 return `<div class="coverage-figma-title">DNC entries by type</div><div class="coverage-figma-rows">${rows.map(([l,v,w,c])=>`<div class="coverage-figma-row"><span class="coverage-figma-label">${l}</span><div class="coverage-figma-track"><div class="coverage-figma-fill" style="width:max(8px,${w}%);background:${c}"></div></div><span class="coverage-figma-value">${v}</span></div>`).join('')}</div>`;
}

function v6EnsureIdncFields(){
 if(state.addType!=='IDNC'||!['form','checking','duplicate','possible-duplicate','save-error'].includes(state.addStage)) return;
 const grid=document.querySelector('.restriction-modal .form-grid'); if(!grid) return;
 const nameLabel=document.querySelector('#modal-company')?.closest('label.field');
 const typeLabel=document.querySelector('#modal-idnc-type')?.closest('label.field');
 if(typeLabel&&nameLabel&&grid.firstElementChild!==typeLabel) grid.insertBefore(typeLabel,nameLabel);
 if(!grid.querySelector('#modal-person-company')){
  const after=nameLabel||typeLabel;
  const company=document.createElement('label'); company.className='field'; company.innerHTML=`<span>Current Company</span><input id="modal-person-company" placeholder="Enter current company" value="${esc(state.modalPersonCompany||'')}">`;
  const email=document.createElement('label'); email.className='field'; email.innerHTML=`<span>E-mail</span><input id="modal-person-email" placeholder="name@company.com" value="${esc(state.modalPersonEmail||'')}">`;
  const identifier=document.createElement('label'); identifier.className='field field-wide'; identifier.innerHTML=`<span>Expert ID / Lead LinkedIn</span><input id="modal-person-identifier" placeholder="1003 or linkedin.com/in/name" value="${esc(state.modalPersonIdentifier||'')}">`;
  if(after&&after.nextSibling){grid.insertBefore(company,after.nextSibling);grid.insertBefore(email,company.nextSibling);}else{grid.append(company,email);}
  const reason=grid.querySelector('#modal-reason')?.closest('label.field'); if(reason) grid.insertBefore(identifier,reason); else grid.append(identifier);
 }
 const nameSpan=nameLabel?.querySelector(':scope > span'); if(nameSpan&&nameSpan.textContent!=='Full Name') nameSpan.textContent='Full Name';
}

function v6PolishUpload(){
 document.querySelectorAll('.restriction-modal .upload-box').forEach(box=>{
  const strong=box.querySelector('strong');
  if(strong&&state.uploadState!=='complete'&&state.uploadState!=='failed'&&strong.textContent!=='Drop a file or browse') strong.textContent='Drop a file or browse';
  box.setAttribute('role','button'); box.tabIndex=0; box.setAttribute('aria-label','Upload evidence document');
 });
}

function v6Decorate(){
 if(state.view==='overview'){
  const card=[...document.querySelectorAll('.panel-card')].find(c=>/coverage|entries by type/i.test(c.textContent||''));
  if(card&&!card.dataset.v6Coverage){card.classList.add('coverage-figma-card');card.innerHTML=v6CoverageMarkup();card.dataset.v6Coverage='1';}
 }
 document.querySelectorAll('.data-table tbody tr.clickable-row').forEach(row=>{row.tabIndex=0;row.setAttribute('aria-label',`${(row.cells[1]?.textContent||'Record').trim()} details`);});
 v6EnsureIdncFields(); v6PolishUpload();
}

/* Header shows restriction state, effective contact status appears once below. */
const v6RecordDetailOriginal=recordDetailModal;
recordDetailModal=function(){
 let html=v6RecordDetailOriginal();
 html=html.replace(/<span class="badge badge-success">[\s\S]*?<\/span>/,'<span class="badge badge-success">ACTIVE</span>');
 return html;
};

document.addEventListener('input',e=>{
 if(e.target.id==='modal-person-company') state.modalPersonCompany=e.target.value;
 if(e.target.id==='modal-person-email') state.modalPersonEmail=e.target.value;
 if(e.target.id==='modal-person-identifier') state.modalPersonIdentifier=e.target.value;
},true);

document.addEventListener('keydown',e=>{
 const row=e.target.closest?.('tr.clickable-row');
 if(row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();row.click();}
 const upload=e.target.closest?.('.upload-box');
 if(upload&&(e.key==='Enter'||e.key===' ')){e.preventDefault();upload.querySelector('[data-action="modal-upload"]')?.click();}
},true);

const v6Observer=new MutationObserver(()=>v6Decorate());
v6Observer.observe(document.getElementById('app'),{childList:true,subtree:true});
setTimeout(v6Decorate,0);
