function removeModal(){const ctx=state.removeContext||'CDNC'; const count=ctx==='CDNC'?(state.allMatching?filteredRecords().length:state.selected.size):ctx.startsWith('IDNC')?(state.personAllMatching?peopleRecords.filter(r=>r.type===state.idncTab&&(!(state.personQuery||'').trim()||`${r.name} ${r.company} ${r.region}`.toLowerCase().includes((state.personQuery||'').trim().toLowerCase()))).length:state.personSelected.size):(state.blacklistAllMatching?blacklistRecords.filter(r=>!(state.blacklistQuery||'').trim()||`${r.name} ${r.company} ${r.email} ${r.reason}`.toLowerCase().includes((state.blacklistQuery||'').trim().toLowerCase())).length:state.blacklistSelected.size),stage=state.removeStage;let body='',footer='';if(stage==='reason'){body=`<div class="review-stack"><div class="inline-alert inline-alert-warning"><div class="inline-alert-title">Removal changes one restriction only</div>Master DNC will recalculate effective contact status from every remaining active restriction.</div><div class="review-card"><h3>Selected records</h3><p>${count.toLocaleString()} ${ctx==='CDNC'?'CDNC record':ctx.startsWith('IDNC')?`IDNC ${state.idncTab.toLowerCase()} record`:'blacklist record'}${count===1?'':'s'} will be removed.</p></div><label class="field"><span>Reason for removal</span><textarea id="remove-reason" class="${state.removeError?'input-error':''}" placeholder="Document why these records should be removed.">${esc(state.removeReason)}</textarea>${state.removeError?`<small>${state.removeError}</small>`:''}</label></div>`;footer=`${button('Cancel','secondary','data-action="remove-close"')}${button('Review & continue','primary','data-action="remove-review"')}`;}else if(stage==='confirm'){body=`<div class="review-stack"><div class="effective-card"><span class="eyebrow">EFFECTIVE STATUS AFTER THIS CHANGE</span><strong>RECALCULATED PER RECORD</strong><p>Removing this restriction does not imply contact is permitted. Other Master DNC restrictions may still apply.</p></div><div class="review-card"><h3>Removal summary</h3><dl><div><dt>Restriction</dt><dd>${ctx}</dd></div><div><dt>Records</dt><dd>${count.toLocaleString()}</dd></div><div><dt>Reason</dt><dd>${esc(state.removeReason)}</dd></div></dl></div><div class="review-card"><h3>Broadcast scope</h3><div class="scope-grid"><span>DNC directory</span><span>Contact suppression controls</span><span>Directory search</span><span>External compliance sync</span></div></div></div>`;footer=`${button('Back','secondary','data-action="remove-back"')}${button('Remove & broadcast','primary','data-action="remove-confirm"')}`;}else{const systems=['CDNC directory','Effective status','Contact suppression controls','External compliance sync'];body=`<div class="processing-stack"><div class="inline-alert inline-alert-${stage==='success'?'success':'info'}"><div class="inline-alert-title">${stage==='success'?'Removal completed':'Removal and broadcast in progress'}</div>${stage==='success'?'The selected CDNC records were removed. Effective contact status was recalculated independently for each record.':'Successful updates are preserved while downstream compliance workflows are updated.'}</div><div class="system-card">${systems.map((s,i)=>{const done=stage==='success'||state.removeProgress>i,active=stage==='processing'&&state.removeProgress===i;return `<div class="system-row"><span>${s}</span><span class="system-status ${done?'system-complete':active?'system-active':''}">${done?'Updated':active?'Updating…':'Pending'}</span></div>`}).join('')}</div></div>`;footer=stage==='success'?button('Done','primary','data-action="remove-done"'):button('Processing…','primary','disabled');}return `<div class="modal-layer" role="dialog" aria-modal="true" aria-label="${esc(ctx)} removal workflow"><button class="modal-scrim" data-action="remove-close"></button><div class="restriction-modal"><div class="restriction-modal-header"><div class="modal-title-row"><div><h2>${stage==='reason'?`Remove from ${ctx}`:stage==='confirm'?'Review removal & broadcast':stage==='success'?'Removal complete':'Applying removal'}</h2><p>${stage==='reason'?'Provide an auditable reason before changing these records.':stage==='confirm'?'Confirm the consequence before organisation-wide propagation.':'The database change and broadcast are tracked separately.'}</p></div><button class="icon-button" data-action="remove-close">${icon('x')}</button></div></div><div class="restriction-modal-body">${body}</div><div class="restriction-modal-footer">${footer}</div></div></div>`;}



const baseRlcRecords = [
 {id:'rlc-1',country:'Iran',region:'Middle East',source:'Compliance policy 2026',broadcast:'Today, 10:42 AM',status:'Active'},
 {id:'rlc-2',country:'North Korea',region:'East Asia',source:'Compliance policy 2026',broadcast:'Yesterday',status:'Active'},
 {id:'rlc-3',country:'Syria',region:'Middle East',source:'Legal directive',broadcast:'Yesterday',status:'Active'},
 {id:'rlc-4',country:'Cuba',region:'Caribbean',source:'Compliance policy 2026',broadcast:'Aug 25',status:'Active'},
 {id:'rlc-5',country:'Belarus',region:'Eastern Europe',source:'Risk committee decision',broadcast:'Aug 23',status:'Active'},
 {id:'rlc-6',country:'Russia',region:'Eastern Europe',source:'Risk committee decision',broadcast:'Aug 23',status:'Active'},
 {id:'rlc-7',country:'Sudan',region:'Africa',source:'Legal directive',broadcast:'Aug 21',status:'Active'},
 {id:'rlc-8',country:'Myanmar',region:'Southeast Asia',source:'Compliance policy 2026',broadcast:'Aug 18',status:'Review'}
];
state.rlcRecords=state.rlcRecords||[...baseRlcRecords]; state.rlcSelected=state.rlcSelected||new Set();
const peopleRecords = [
 {id:'idnc-1',name:'Aarav Mehta',type:'Expert',company:'Northstar Advisory',region:'India',status:'Do not contact',updated:'18 min ago'},
 {id:'idnc-2',name:'Riya Kapoor',type:'Expert',company:'Finverse',region:'India',status:'Do not contact',updated:'32 min ago'},
 {id:'idnc-3',name:'Kabir Rao',type:'Lead',company:'BluePeak Systems',region:'UAE',status:'Review',updated:'1 hr ago'},
 {id:'idnc-4',name:'Ananya Iyer',type:'Expert',company:'Orbit Health',region:'India',status:'Do not contact',updated:'2 hrs ago'},
 {id:'idnc-5',name:'Arjun Nair',type:'Lead',company:'Lumina Labs',region:'Singapore',status:'Do not contact',updated:'3 hrs ago'},
 {id:'idnc-6',name:'Meera Shah',type:'Expert',company:'Coreline Capital',region:'UK',status:'Do not contact',updated:'5 hrs ago'},
 {id:'idnc-7',name:'Vihaan Singh',type:'Lead',company:'Quickship',region:'India',status:'Review',updated:'Yesterday'},
 {id:'idnc-8',name:'Ishita Verma',type:'Expert',company:'Aster Group',region:'UAE',status:'Do not contact',updated:'Yesterday'}
];
const blacklistRecords = [
 {id:'bl-1',name:'Dev Malhotra',company:'Independent',email:'dev.m@example.com',reason:'Legal escalation',status:'Do not contact',updated:'22 min ago'},
 {id:'bl-2',name:'Neha Arora',company:'Redwood Consulting',email:'neha.a@example.com',reason:'Compliance breach',status:'Do not contact',updated:'41 min ago'},
 {id:'bl-3',name:'Kunal Sethi',company:'Metroline',email:'kunal.s@example.com',reason:'Client request',status:'Review',updated:'2 hrs ago'},
 {id:'bl-4',name:'Aditi Joshi',company:'Northstar Advisory',email:'aditi.j@example.com',reason:'Legal escalation',status:'Do not contact',updated:'4 hrs ago'},
 {id:'bl-5',name:'Rahul Batra',company:'Pioneer Labs',email:'rahul.b@example.com',reason:'Compliance breach',status:'Do not contact',updated:'Yesterday'},
 {id:'bl-6',name:'Naina Gupta',company:'Orbit Health',email:'naina.g@example.com',reason:'Client request',status:'Review',updated:'Yesterday'}
];

// Expand representative large datasets without storing selection IDs for all-matching operations.
const personFirstNames=['Aarav','Riya','Kabir','Ananya','Arjun','Meera','Vihaan','Ishita','Aditya','Nisha','Rahul','Kavya','Rohan','Sana','Dev','Tanya','Karan','Aditi','Neil','Priya'];
const personLastNames=['Mehta','Kapoor','Rao','Iyer','Nair','Shah','Singh','Verma','Malhotra','Arora','Sethi','Joshi','Batra','Gupta','Khanna','Menon'];
const personCompanies=['Northstar Advisory','Finverse','BluePeak Systems','Orbit Health','Quickship','Lumina Labs','Aster Group','Coreline Capital'];
const personRegions=['India','UAE','UK','Singapore'];
let expertCount=peopleRecords.filter(r=>r.type==='Expert').length, leadCount=peopleRecords.filter(r=>r.type==='Lead').length;
for(let i=peopleRecords.length; expertCount<1284 || leadCount<1536; i++){
  const type=expertCount<1284 && (leadCount>=1536 || i%2===0)?'Expert':'Lead';
  const idx=type==='Expert'?expertCount:leadCount;
  const first=personFirstNames[idx%personFirstNames.length], last=personLastNames[(idx*3)%personLastNames.length];
  peopleRecords.push({id:`idnc-${i+1}`,name:`${first} ${last} ${String(idx+1).padStart(4,'0')}`,type,company:personCompanies[idx%personCompanies.length],region:personRegions[idx%personRegions.length],status:idx%19===0?'Review':'Do not contact',updated:idx%3===0?'Today':'This week'});
