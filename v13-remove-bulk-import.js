/* DNC v13: remove Bulk Import from the product baseline. */
function v13RemoveBulkImportArtifacts(){
  /* Remove the obsolete Needs Attention row. */
  document.querySelectorAll('.attention-row').forEach(row=>{
    if((row.textContent||'').includes('Latest import needs attention')) row.remove();
  });
  /* Recalculate the visible attention count for the remaining 6 broadcasts + 1 concurrent update. */
  document.querySelectorAll('.attention-card .badge-warning').forEach(b=>{ b.textContent='7 items'; });
  /* Remove the obsolete recent-activity event. */
  document.querySelectorAll('.activity-card tbody tr, .activity-table tbody tr').forEach(row=>{
    if((row.textContent||'').includes('Bulk import validated')) row.remove();
  });
  /* Defensive cleanup in case an older navigation variant exposes Bulk Import. */
  document.querySelectorAll('button,a,[data-route]').forEach(el=>{
    const t=(el.textContent||'').trim();
    if(t==='Bulk Import' || el.getAttribute('data-route')==='bulk-import') el.remove();
  });
}

const v13RenderOriginal=render;
render=function(){
  if(state.view==='bulk-import'){
    state.view='overview';
    if(location.hash==='#bulk-import') history.replaceState(null,'',location.pathname+location.search);
  }
  v13RenderOriginal();
  v13RemoveBulkImportArtifacts();
};

/* Direct old links must no longer expose the removed feature. */
window.addEventListener('hashchange',()=>{
  if(location.hash==='#bulk-import' || state.view==='bulk-import'){
    state.view='overview';
    history.replaceState(null,'',location.pathname+location.search);
    render();
  }
});

if(state.view==='bulk-import' || location.hash==='#bulk-import'){
  state.view='overview';
  history.replaceState(null,'',location.pathname+location.search);
  render();
}else{
  v13RemoveBulkImportArtifacts();
}
