/* Final modal observer hardening. All modal decorators run once per real app render. */
try{v16Obs.disconnect()}catch(_){}
try{v21Obs.disconnect()}catch(_){}
try{v20Obs.disconnect()}catch(_){}
try{v22Observer.disconnect()}catch(_){}
try{v24Observer.disconnect()}catch(_){}
try{v25V6Observer.disconnect()}catch(_){}

function v26DecorateAfterRender(){
 /* Order matters: restore base fields first, then final product-specific corrections. */
 try{v16Decorate()}catch(e){console.error('v16 decorate',e)}
 try{v6Decorate()}catch(e){console.error('v6 decorate',e)}
 try{v19Decorate()}catch(e){console.error('v19 decorate',e)}
 try{if(state.addType==='RLC')v22StripRlcAddFields()}catch(e){console.error('v22 decorate',e)}
 try{v20Decorate()}catch(e){console.error('v20 decorate',e)}
 try{v24Decorate()}catch(e){console.error('v24 decorate',e)}
}

const v26Observer=new MutationObserver(()=>queueMicrotask(v26DecorateAfterRender));
v26Observer.observe(document.getElementById('app'),{childList:true,subtree:false});
setTimeout(v26DecorateAfterRender,0);
