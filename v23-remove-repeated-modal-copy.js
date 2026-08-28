/* Remove redundant repeated modal helper copy. */
(function(){
  const target='Define the restriction without leaving the current page.';
  function clean(root=document){
    const nodes=root.querySelectorAll?.('.restriction-modal p,.restriction-modal span,.restriction-modal div')||[];
    nodes.forEach(n=>{if((n.textContent||'').trim()===target)n.remove();});
  }
  clean();
  const app=document.getElementById('app');
  if(app){
    const obs=new MutationObserver(muts=>{
      for(const m of muts){for(const n of m.addedNodes){if(n.nodeType===1)clean(n);}}
    });
    obs.observe(app,{childList:true,subtree:true});
  }
})();
