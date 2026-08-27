document.addEventListener('keydown',e=>{if(e.key==='Enter'&&document.activeElement?.id==='search-input')runSearch();if(e.key==='Escape'&&(state.addType||state.removeStage||state.rlcRemoveStage)){state.addType=null;state.removeStage=null;state.rlcRemoveStage=null;render();}});
window.addEventListener('hashchange',()=>{state.view=({'#cdnc':'cdnc','#idnc':'idnc','#blacklist':'blacklist','#audit':'audit','#bulk-import':'bulk-import','#broadcast-queue':'broadcast-queue','#concurrent':'concurrent','#rlc':'rlc'}[location.hash]||'overview');render();});
render();
