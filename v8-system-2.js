v8ChosenSubtype(); const same=peopleRecords.filter(r=>r.type===subtype);
  const exact=same.find(r=>(name&&v8Norm(r.name)===name)||(email&&v8Norm(`${r.name.toLowerCase().replace(/ /g,'.')}@example.com`)===email));
  if(exact)return {kind:'exact',label:exact.name,type:`IDNC ${subtype}`,record:exact,recordKind:'person'};
  const near=same.find(r=>v8Near(name,r.name)); if(near)return {kind:'possible',label:near.name,type:`IDNC ${subtype}`,record:near,recordKind:'person'};
 }
 if(state.addType==='Blacklist'){
  const exact=blacklistRecords.find(r=>(name&&v8Norm(r.name)===name)||(email&&v8Norm(r.email)===email));
  if(exact)return {kind:'exact',label:exact.name,type:'Blacklist',record:exact,recordKind:'blacklist'};
  const near=blacklistRecords.find(r=>v8Near(name,r.name)||v8Near(email,r.email)); if(near)return {kind:'possible',label:near.name,type:'Blacklist',record:near,recordKind:'blacklist'};
 }
 if(state.addType==='RLC'){
  const exact=state.rlcRecords.find(r=>name&&v8Norm(r.country)===name); if(exact)return {kind:'exact',label:exact.country,type:'RLC',record:exact,recordKind:'rlc'};
  const near=state.rlcRecords.find(r=>v8Near(name,r.country)); if(near)return {kind:'possible',label:near.country,type:'RLC',record:near,recordKind:'rlc'};
 }
 return null;
}
function v8CrossListReason(){
 const name=v8Norm(state.modalCompany), email=v8Norm(state.modalEmail||state.modalPersonEmail), company=v8Norm(state.modalPersonCompany);
 const reasons=[];
 if(state.addType!=='Blacklist'){
  const bl=blacklistRecords.find(r=>(name&&v8Norm(r.name)===name)||(email&&v8Norm(r.email)===email)||(company&&v8Norm(r.company)===company)); if(bl)reasons.push('Blacklist');
 }
 if(state.addType!=='IDNC'){
  const p=peopleRecords.find(r=>(name&&v8Norm(r.name)===name)||(company&&v8Norm(r.company)===company)); if(p)reasons.push(`IDNC ${p.type}`);
 }
 if(state.addType!=='CDNC'){
  const c=state.liveRecords.find(r=>(company&&v8Norm(r.company)===company)||(name&&v8Norm(r.company)===name)); if(c)reasons.push('CDNC');
 }
 return reasons.length?`${[...new Set(reasons)].join(' and ')} restriction${reasons.length>1?'s are':' is'} already active for this record or related entity. Effective contact status will remain based on all active restrictions.`:'';
}

/* Shared validation/duplicate engine for every Add flow. */
modalContinue=async function(){
 if(['duplicate','possible-duplicate'].includes(state.addStage))return;
 const errors={};
 if(!(state.modalCompany||'').trim())errors.company='This field is required.';
 if(state.addType==='CDNC'&&(!(state.modalDomain||'').trim()||!state.modalDomain.includes('.')))errors.domain='Enter a valid company domain.';
 if(state.addType==='RLC'&&state.modalReference&&!/^https?:\/\//i.test(state.modalReference))errors.reference='Enter a valid https:// reference URL.';
 if(state.addType==='Blacklist'&&state.modalEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.modalEmail))errors.email='Enter a valid email address.';
 if(!(state.modalReason||'').trim())errors.reason='Reason for restriction is required.';
 state.addErrors=errors;if(Object.keys(errors).length){render();return}
 state.addStage='checking';state.v8Duplicate=null;render();await new Promise(r=>setTimeout(r,500));
 const match=v8FindDuplicate(); if(match){state.v8Duplicate=match;state.addStage=match.kind==='exact'?'duplicate':'possible-duplicate';state.announcement=match.kind==='exact'?`Active duplicate found for ${match.label}.`:`Possible duplicate found for ${match.label}.`;render();return}
 if(state.addType==='IDNC'&&!state.addSubtype)state.addSubtype=v8ChosenSubtype();state.crossListReason=v8CrossListReason();state.addStage='review';render();
};

/* Keep Overview IDNC selector functional. */
document.addEventListener('change',e=>{if(e.target.id==='modal-idnc-type'){state.v8OverviewIdncSubtype=e.target.value;state.announcement=`IDNC type set to ${state.v8OverviewIdncSubtype}.`;}},true);

/* Dynamic duplicate message and evidence metadata/new-tab action. */
const v8ModalOriginal=modal;
modal=function(){let html=v8ModalOriginal();if(state.addStage==='duplicate'&&state.v8Duplicate){const d=state.v8Duplicate;html=html.replace(/<div class="inline-alert inline-alert-warning"><div class="inline-alert-title">Active duplicate found<\/div>[\s\S]*?<\/div>(?=<div class="form-grid">)/,`<div class="inline-alert inline-alert-warning"><div class="inline-alert-title">Active duplicate found</div>${esc(d.label)} already has an active ${esc(d.type)} restriction. Review the existing record before creating another restriction.</div>`)}if(state.addStage==='possible-duplicate'&&state.v8Duplicate){const d=state.v8Duplicate;html=html.replace('We found a similar existing record. Review the match before deciding whether this is a separate restriction.',`We found a similar existing record: ${esc(d.label)}. Review the match before deciding whether this is a separate restriction.`)}return html};
const v8RecordOriginal=recordDetailModal;
recordDetailModal=function(){let html=v8RecordOriginal();html=html.replace(/data-action="record-evidence-preview"/g,'data-action="v8-evidence-open"').replace(/<div class="evidence-meta">PDF • 428 KB<br>Uploaded for compliance audit<\/div>/g,'<div class="evidence-meta">PDF • 428 KB<span class="v8-evidence-date">(uploaded on 04 Jan 2026)</span><span class="v8-open-hint">Opens in a new tab</span></div>').replace(/<div class="document-preview">[\s\S]*?<\/div><\/div>/g,'');return html};

function v8EvidenceWindow(){const w=window.open('about:blank',