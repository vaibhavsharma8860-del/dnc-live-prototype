/* Run modal field decorators once per app render. Never observe decorator-owned subtree mutations. */
try{v19Obs.disconnect()}catch(_){}
try{v21Obs?.disconnect()}catch(_){}

v19FixBlacklistAdd=function(grid){
 const name=grid.querySelector('#modal-name')?.closest('label.field')||[...grid.querySelectorAll('label.field')].find(x=>/full name|expert name/i.test(x.textContent));
 if(name){const label=name.querySelector(':scope > span');if(label&&label.textContent!=='Expert Name')label.textContent='Expert Name';}
 const id=grid.querySelector('#modal-blacklist-expert-id')?.closest('label.field');
 const li=grid.querySelector('#modal-blacklist-linkedin')?.closest('label.field');
 if(id&&li){
  if(li.classList.contains('field-wide'))li.classList.remove('field-wide');
  if(id.nextElementSibling!==li)id.after(li);
 }
};

v19FixIdncAdd=function(grid){
 const subtype=v19Subtype();
 const isLead=/lead/i.test(subtype);
 const name=grid.querySelector('#modal-name')?.closest('label.field')||[...grid.querySelectorAll('label.field')].find(x=>/full name|name/i.test(x.querySelector('span')?.textContent||''));
 if(name){const label=name.querySelector(':scope > span');const wanted=isLead?'Lead Full Name':'Expert Full Name';if(label&&label.textContent!==wanted)label.textContent=wanted;}
 const idField=[...grid.querySelectorAll('label.field')].find(x=>/expert id|lead linkedin/i.test(x.querySelector('span')?.textContent||''));
 if(idField){
  const wantedDisplay=isLead?'none':'';
  if(idField.style.display!==wantedDisplay)idField.style.display=wantedDisplay;
  if(!isLead){const label=idField.querySelector(':scope > span');if(label&&label.textContent!=='Expert ID')label.textContent='Expert ID';const inp=idField.querySelector('input');if(inp&&inp.placeholder!=='Enter expert ID')inp.placeholder='Enter expert ID';}
 }
};

v19FixRlcAdd=function(grid){
 const li=grid.querySelector('#modal-rlc-expert-linkedin')?.closest('label.field');
 const ref=grid.querySelector('#modal-reference')?.closest('label.field');
 if(li&&ref){
  if(li.classList.contains('field-wide'))li.classList.remove('field-wide');
  if(ref.classList.contains('field-wide'))ref.classList.remove('field-wide');
  if(li.nextElementSibling!==ref)li.after(ref);
 }
};

/* render() replaces children directly under #app. Watching only that level means decorators
   run after a real application render, but never recurse because of their own modal edits. */
const v21Obs=new MutationObserver(()=>queueMicrotask(v19Decorate));
v21Obs.observe(document.getElementById('app'),{childList:true,subtree:false});
setTimeout(v19Decorate,0);
