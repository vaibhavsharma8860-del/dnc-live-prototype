/* Stop modal field decorators from re-moving nodes on every MutationObserver pass. */
try{v19Obs.disconnect()}catch(_){}

v19FixBlacklistAdd=function(grid){
 const name=grid.querySelector('#modal-name')?.closest('label.field')||[...grid.querySelectorAll('label.field')].find(x=>/full name|expert name/i.test(x.textContent));
 if(name)v19LabelField(name,'Expert Name');
 const id=grid.querySelector('#modal-blacklist-expert-id')?.closest('label.field');
 const li=grid.querySelector('#modal-blacklist-linkedin')?.closest('label.field');
 if(id&&li){
  li.classList.remove('field-wide');
  if(id.nextElementSibling!==li)id.after(li);
 }
};

v19FixRlcAdd=function(grid){
 const li=grid.querySelector('#modal-rlc-expert-linkedin')?.closest('label.field');
 const ref=grid.querySelector('#modal-reference')?.closest('label.field');
 if(li&&ref){
  li.classList.remove('field-wide');
  ref.classList.remove('field-wide');
  if(li.nextElementSibling!==ref)li.after(ref);
 }
};

const v21Obs=new MutationObserver(()=>v19Decorate());
v21Obs.observe(document.getElementById('app'),{childList:true,subtree:true});
setTimeout(v19Decorate,0);
