/* RLC Add is country-level only: remove expert/engagement fields from form and review. */
function v22StripRlcAddFields(){
  if(state.addType!=='RLC')return;
  const modalEl=document.querySelector('.restriction-modal');
  if(!modalEl)return;
  const ids=['modal-rlc-engagement','modal-rlc-expert-name','modal-rlc-expert-email','modal-rlc-expert-id','modal-rlc-expert-linkedin'];
  ids.forEach(id=>modalEl.querySelector('#'+id)?.closest('label.field')?.remove());
  const labels=['Nature of Engagement','Expert','Expert e-mail','Expert ID','Expert LinkedIn'];
  modalEl.querySelectorAll('.review-card dl > div').forEach(row=>{
    const dt=(row.querySelector('dt')?.textContent||'').trim();
    if(labels.includes(dt))row.remove();
  });
}
const v22Observer=new MutationObserver(()=>{if(state.addType==='RLC')v22StripRlcAddFields()});
v22Observer.observe(document.getElementById('app'),{childList:true,subtree:true});
setTimeout(v22StripRlcAddFields,0);
