/* Modal stability pass: prevent legacy IDNC decorator recursion and make its field logic final. */
try{v6Observer.disconnect()}catch(_){}

v6EnsureIdncFields=function(){
 if(state.addType!=='IDNC'||!['form','checking','duplicate','possible-duplicate','save-error'].includes(state.addStage))return;
 const grid=document.querySelector('.restriction-modal .form-grid');if(!grid)return;
 const subtype=state.addSubtype||document.querySelector('#modal-idnc-type')?.value||'Expert';
 const isLead=/lead/i.test(subtype);
 const nameLabel=document.querySelector('#modal-company')?.closest('label.field');
 const typeLabel=document.querySelector('#modal-idnc-type')?.closest('label.field');
 if(typeLabel&&nameLabel&&grid.firstElementChild!==typeLabel)grid.insertBefore(typeLabel,nameLabel);

 let company=grid.querySelector('#modal-person-company')?.closest('label.field');
 let email=grid.querySelector('#modal-person-email')?.closest('label.field');
 if(!company){company=document.createElement('label');company.className='field';company.innerHTML=`<span>Current Company</span><input id="modal-person-company" placeholder="Enter current company" value="${esc(state.modalPersonCompany||'')}">`;}
 if(!email){email=document.createElement('label');email.className='field';email.innerHTML=`<span>E-mail</span><input id="modal-person-email" placeholder="name@company.com" value="${esc(state.modalPersonEmail||'')}">`;}
 if(!company.isConnected||!email.isConnected){const after=nameLabel||typeLabel;if(after?.nextSibling){grid.insertBefore(company,after.nextSibling);grid.insertBefore(email,company.nextSibling);}else{grid.append(company,email);}}

 let identifier=grid.querySelector('#modal-person-identifier')?.closest('label.field');
 if(isLead){if(identifier)identifier.remove();}
 else{
  if(!identifier){identifier=document.createElement('label');identifier.className='field field-wide';identifier.innerHTML=`<span>Expert ID</span><input id="modal-person-identifier" placeholder="Enter expert ID" value="${esc(state.modalPersonIdentifier||'')}">`;const reason=grid.querySelector('#modal-reason')?.closest('label.field');if(reason)grid.insertBefore(identifier,reason);else grid.append(identifier);}
  else{const label=identifier.querySelector(':scope > span');if(label&&label.textContent!=='Expert ID')label.textContent='Expert ID';const input=identifier.querySelector('input');if(input&&input.placeholder!=='Enter expert ID')input.placeholder='Enter expert ID';}
 }
 const nameSpan=nameLabel?.querySelector(':scope > span');const wanted=isLead?'Lead Full Name':'Expert Full Name';if(nameSpan&&nameSpan.textContent!==wanted)nameSpan.textContent=wanted;
};

/* Only react to a real render replacing #app children. Internal decorator edits cannot recurse. */
const v25V6Observer=new MutationObserver(()=>queueMicrotask(v6Decorate));
v25V6Observer.observe(document.getElementById('app'),{childList:true,subtree:false});
setTimeout(v6Decorate,0);
