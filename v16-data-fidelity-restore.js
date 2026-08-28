/* Restore original DNC data fields without rolling back the redesigned workflows. */
const v16Style=document.createElement('style');v16Style.textContent=`
.v16-link{color:var(--primary);text-decoration:underline;text-underline-offset:2px}.v16-remove-upload{border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--surface-subtle);display:flex;align-items:center;justify-content:space-between;gap:12px}.v16-remove-upload strong{font-size:12px;font-weight:500}.v16-remove-upload span{font-size:11px;color:var(--text-secondary)}
@media(max-width:900px){.data-table{min-width:980px}.table-card{overflow-x:auto}}
`;document.head.appendChild(v16Style);

state.modalKeyword=state.modalKeyword||'';state.modalAliases=state.modalAliases||'';state.modalParentCompany=state.modalParentCompany||'';state.modalSubsidiary=state.modalSubsidiary||'';state.modalWebsite=state.modalWebsite||'';
state.modalBlacklistExpertId=state.modalBlacklistExpertId||'';state.modalBlacklistLinkedIn=state.modalBlacklistLinkedIn||'';
state.modalRlcEngagement=state.modalRlcEngagement||'';state.modalRlcExpertName=state.modalRlcExpertName||'';state.modalRlcExpertEmail=state.modalRlcExpertEmail||'';state.modalRlcExpertId=state.modalRlcExpertId||'';state.modalRlcExpertLinkedIn=state.modalRlcExpertLinkedIn||'';
state.removeEvidence=state.removeEvidence||'';state.removeReference=state.removeReference||'';state.rlcRemoveReference=state.rlcRemoveReference||'';

function v16Slug(name){return String(name||'record').toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.|\.$/g,'')}
function v16LinkedIn(name){return `linkedin.com/in/${String(name||'record').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`}
function v16ExpertId(r){const n=String(r?.id||'').replace(/\D/g,'');return n?`EXP-${String(n).padStart(4,'0')}`:'EXP-1003'}
function v16PersonEmail(r){return `${v16Slug(r?.name)}@example.com`}
function v16RlcDefaults(r,i){if(!r)return;r.engagement=r.engagement||['Research outreach','Expert consultation','Business development','Client engagement'][i%4];r.expert=r.expert||['Aarav Mehta','Riya Kapoor','Kabir Rao','Ananya Iyer'][i%4];r.expertEmail=r.expertEmail||v16PersonEmail({name:r.expert});r.expertId=r.expertId||`EXP-${String(1003+i).padStart(4,'0')}`;r.expertLinkedIn=r.expertLinkedIn||v16LinkedIn(r.expert);r.reason=r.reason||r.source||'Country-level compliance restriction';}
state.rlcRecords.forEach(v16RlcDefaults);

function v16Field(id,label,placeholder,value,wide=false){const x=document.createElement('label');x.className=`field${wide?' field-wide':''}`;x.innerHTML=`<span>${label}</span><input id="${id}" placeholder="${placeholder}" value="${esc(value||'')}">`;return x}
function v16DecorateAdd(){
 if(!state.addType||!['form','checking','duplicate','possible-duplicate','save-error'].includes(state.addStage))return;const grid=document.querySelector('.restriction-modal .form-grid');if(!grid||grid.dataset.v16Fields)return;grid.dataset.v16Fields='1';const reason=grid.querySelector('#modal-reason')?.closest('label.field');
 if(state.addType==='CDNC'){
  const domain=grid.querySelector('#modal-domain')?.closest('label.field');if(domain){domain.querySelector('span').textContent='Website';const old=domain.querySelector('input');old.id='modal-website';old.placeholder='https://company.com';old.value=state.modalWebsite||state.modalDomain||'';}
  const fields=[v16Field('modal-keyword','Keyword','Enter keyword',state.modalKeyword),v16Field('modal-aliases','Aliases','Aliases or alternate names',state.modalAliases),v16Field('modal-parent-company','Parent Company','Enter parent company',state.modalParentCompany),v16Field('modal-subsidiary','Specific Subsidiary','Enter subsidiary',state.modalSubsidiary)];
  fields.forEach(f=>reason?grid.insertBefore(f,reason):grid.appendChild(f));
 }
 if(state.addType==='Blacklist'){
  const email=grid.querySelector('#modal-email')?.closest('label.field');const id=v16Field('modal-blacklist-expert-id','Expert ID','1002',state.modalBlacklistExpertId);const li=v16Field('modal-blacklist-linkedin','Expert LinkedIn','linkedin.com/in/name',state.modalBlacklistLinkedIn,true);if(email?.nextSibling)grid.insertBefore(id,email.nextSibling);else grid.appendChild(id);if(reason)grid.insertBefore(li,reason);else grid.appendChild(li);
 }
 if(state.addType==='RLC'){
  const ref=grid.querySelector('#modal-reference')?.closest('label.field');const fields=[v16Field('modal-rlc-engagement','Nature of Engagement','e.g. Expert consultation',state.modalRlcEngagement),v16Field('modal-rlc-expert-name','Expert Name','Enter expert name',state.modalRlcExpertName),v16Field('modal-rlc-expert-email','Expert E-mail ID','name@company.com',state.modalRlcExpertEmail),v16Field('modal-rlc-expert-id','Expert ID','1003',state.modalRlcExpertId),v16Field('modal-rlc-expert-linkedin','Expert LinkedIn','linkedin.com/in/name',state.modalRlcExpertLinkedIn,true)];fields.forEach(f=>ref?grid.insertBefore(f,ref):grid.appendChild(f));
 }
}

const v16ModalOriginal=modal;modal=function(){let html=v16ModalOriginal();if(state.addStage==='review'){
 let rows='';if(state.addType==='CDNC')rows=`<div><dt>Keyword</dt><dd>${esc(state.modalKeyword||'—')}</dd></div><div><dt>Aliases</dt><dd>${esc(state.modalAliases||'—')}</dd></div><div><dt>Parent company</dt><dd>${esc(state.modalParentCompany||'—')}</dd></div><div><dt>Specific subsidiary</dt><dd>${esc(state.modalSubsidiary||'—')}</dd></div><div><dt>Website</dt><dd>${esc(state.modalWebsite||state.modalDomain||'—')}</dd></div>`;
 if(state.addType==='Blacklist')rows=`<div><dt>Expert ID</dt><dd>${esc(state.modalBlacklistExpertId||'—')}</dd></div><div><dt>LinkedIn</dt><dd>${esc(state.modalBlacklistLinkedIn||'—')}</dd></div>`;
 if(state.addType==='RLC')rows=`<div><dt>Nature of engagement</dt><dd>${esc(state.modalRlcEngagement||'—')}</dd></div><div><dt>Expert</dt><dd>${esc(state.modalRlcExpertName||'—')}</dd></div><div><dt>Expert e-mail</dt><dd>${esc(state.modalRlcExpertEmail||'—')}</dd></div><div><dt>Expert ID</dt><dd>${esc(state.modalRlcExpertId||'—')}</dd></div><div><dt>Expert LinkedIn</dt><dd>${esc(state.modalRlcExpertLinkedIn||'—')}</dd></div><div><dt>Reference</dt><dd>${esc(state.modalReference||'—')}</dd></div>`;
 if(rows)html=html.replace(/(<div class="review-card"><h3>Restriction summary<\/h3><dl>[\s\S]*?<\/dl>)/,m=>m.replace('</dl>',rows+'</dl>'));
 }return html};

function v16DecorateTables(){const table=document.querySelector('.data-table');if(!table||table.dataset.v16Table)return;
 if(state.view==='idnc'){
  const h=table.tHead?.rows[0]?.cells;if(!h||h.length<7)return;h[2].textContent='E-mail';h[4].textContent='LinkedIn';[...table.tBodies[0].rows].forEach(row=>{const rec=peopleRecords.find(r=>r.id===row.dataset.v5Record)||peopleRecords.find(r=>r.name===(row.cells[1]?.textContent||'').trim());if(!rec)return;row.cells[2].textContent=v16PersonEmail(rec);row.cells[4].innerHTML=`<span class="v16-link">${esc(v16LinkedIn(rec.name))}</span>`;});table.dataset.v16Table='idnc';
 }
 if(state.view==='blacklist'){
  const h=table.tHead?.rows[0]?.cells;if(!h||h.length<7)return;const idh=document.createElement('th');idh.textContent='Expert ID';h[1].after(idh);h[5].textContent='LinkedIn';[...table.tBodies[0].rows].forEach(row=>{const rec=blacklistRecords.find(r=>r.id===row.dataset.v5Record)||blacklistRecords.find(r=>r.name===(row.cells[1]?.textContent||'').trim());if(!rec)return;const td=document.createElement('td');td.textContent=v16ExpertId(rec);row.cells[1].after(td);row.cells[5].innerHTML=`<span class="v16-link">${esc(v16LinkedIn(rec.name))}</span>`;});table.dataset.v16Table='blacklist';
 }
 if(state.view==='rlc'){
  const h=table.tHead?.rows[0]?.cells;if(!h||h.length<6)return;h[3].textContent='Nature of engagement';const eh=document.createElement('th');eh.textContent='Associated expert';h[3].after(eh);[...table.tBodies[0].rows].forEach((row,i)=>{const rec=state.rlcRecords.find(r=>r.id===row.dataset.v5Record)||state.rlcRecords.find(r=>r.country===(row.cells[1]?.textContent||'').trim());if(!rec)return;v16RlcDefaults(rec,i);row.cells[3].textContent=rec.engagement;const td=document.createElement('td');td.textContent=rec.expert;row.cells[3].after(td);});table.dataset.v16Table='rlc';
 }}

const v16InfoOriginal=v5InfoRows;v5InfoRows=function(r){let rows=v16InfoOriginal(r);if(r._kind==='cdnc')rows.splice(1,0,['Keyword / aliases',r.keyword||r.aliases?.join?.(', ')||'Company name and known aliases'],['Parent company',r.parentCompany||'—'],['Specific subsidiary',r.subsidiary||'—']);if(r._kind==='blacklist')rows.splice(1,0,['Expert ID',v16ExpertId(r)],['Expert LinkedIn',v16LinkedIn(r.name)]);if(r._kind==='rlc'){const i=Math.max(0,state.rlcRecords.findIndex(x=>x.id===r.id));v16RlcDefaults(r,i);rows=[['Restriction reason',r.reason],['Nature of engagement',r.engagement],['Associated expert',r.expert],['Expert e-mail',r.expertEmail],['Expert ID',r.expertId],['Expert LinkedIn',r.expertLinkedIn],['Reference',r.source],['Region',r.region],['Last broadcast',r.broadcast],['Policy state',r.status]];}return rows};

function v16DecorateRemoval(){const modalEl=document.querySelector('.restriction-modal');if(!modalEl)return;
 if(state.removeStage==='reason'&&!modalEl.querySelector('[data-v16-remove-field]')){const reason=document.querySelector('#remove-reason')?.closest('label.field');if(!reason)return;let el;if((state.removeContext||'CDNC')==='Blacklist'){el=v16Field('v16-remove-reference','Reference / evidence URL','https://',state.removeReference,true);}else{el=document.createElement('div');el.className='v16-remove-upload';el.dataset.v16RemoveField='1';el.innerHTML=`<div><strong>Supporting evidence</strong><br><span>${esc(state.removeEvidence||'PDF, DOCX or image · 10 MB max')}</span></div><button class="button button-secondary" data-action="v16-remove-evidence">${state.removeEvidence?'Replace file':'Choose file'}</button>`;}el.dataset.v16RemoveField='1';reason.after(el);}
 if(state.removeStage==='confirm'){const dl=modalEl.querySelector('.review-card dl');if(dl&&!dl.querySelector('[data-v16-confirm-extra]')){const d=document.createElement('div');d.dataset.v16ConfirmExtra='1';const isB=(state.removeContext||'CDNC')==='Blacklist';d.innerHTML=`<dt>${isB?'Reference':'Evidence'}</dt><dd>${esc(isB?(state.removeReference||'—'):(state.removeEvidence||'—'))}</dd>`;dl.appendChild(d);}}
 if(state.rlcRemoveStage==='reason'&&!modalEl.querySelector('#v16-rlc-remove-reference')){const reason=document.querySelector('#rlc-remove-reason')?.closest('label.field');if(reason)reason.after(v16Field('v16-rlc-remove-reference','Reference / evidence URL','https://',state.rlcRemoveReference,true));}
 if(state.rlcRemoveStage==='review'){const dl=modalEl.querySelector('.review-card dl');if(dl&&!dl.querySelector('[data-v16-rlc-extra]')){const d=document.createElement('div');d.dataset.v16RlcExtra='1';d.innerHTML=`<dt>Reference</dt><dd>${esc(state.rlcRemoveReference||'—')}</dd>`;dl.appendChild(d);}}
}

function v16Decorate(){v16DecorateAdd();v16DecorateTables();v16DecorateRemoval()}
const v16Obs=new MutationObserver(v16Decorate);v16Obs.observe(document.getElementById('app'),{childList:true,subtree:true});setTimeout(v16Decorate,0);

document.addEventListener('input',e=>{const t=e.target;const map={'modal-keyword':'modalKeyword','modal-aliases':'modalAliases','modal-parent-company':'modalParentCompany','modal-subsidiary':'modalSubsidiary','modal-website':'modalWebsite','modal-blacklist-expert-id':'modalBlacklistExpertId','modal-blacklist-linkedin':'modalBlacklistLinkedIn','modal-rlc-engagement':'modalRlcEngagement','modal-rlc-expert-name':'modalRlcExpertName','modal-rlc-expert-email':'modalRlcExpertEmail','modal-rlc-expert-id':'modalRlcExpertId','modal-rlc-expert-linkedin':'modalRlcExpertLinkedIn','v16-remove-reference':'removeReference','v16-rlc-remove-reference':'rlcRemoveReference'};if(map[t.id])state[map[t.id]]=t.value;if(t.id==='modal-website'){state.modalWebsite=t.value;state.modalDomain=t.value.replace(/^https?:\/\//,'').replace(/\/.*$/,'');}},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-action="v16-remove-evidence"]');if(!b)return;e.preventDefault();e.stopPropagation();state.removeEvidence='unlock-evidence.pdf';render();},true);
