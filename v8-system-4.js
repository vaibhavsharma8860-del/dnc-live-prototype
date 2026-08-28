ton></div>`:''}`}
function v8ClearSelection(){state.selected=new Set();state.allMatching=false;state.personSelected=new Set();state.personAllMatching=false;state.blacklistSelected=new Set();state.blacklistAllMatching=false;state.rlcSelected=new Set();state.auditSelected=new Set();state.auditAllMatching=false;state.v8SelectionMenu=false;state.v8ShowSelected=false;render()}
function v8DecorateSelection(){const c=v8SelectionContext();const bar=document.querySelector('.selection-bar');if(!c||!bar)return;const n=v8SelectedCount(c);if(!n)return;const pageFull=v8PageFullySelected();const sig=[c.kind,n,c.all?1:0,pageFull?1:0,state.v8SelectionMenu?1:0,state.v8ShowSelected?1:0,c.total].join(':');bar.classList.add('v8-selection-bar');if(bar.dataset.v8Sig!==sig){bar.dataset.v8Sig=sig;bar.innerHTML=v8SelectionHtml(c,n)}let notice=bar.nextElementSibling?.classList.contains('v8-scope-notice')?bar.nextElementSibling:null;const needNotice=(pageFull&&!c.all&&c.total>c.pageSize)||c.all;const noticeHtml=c.all?`<span>All ${c.total.toLocaleString()} matching records are selected across all pages.</span><button data-v8-clear-selection>Clear selection</button>`:`<span>All ${Math.min(c.pageSize,n).toLocaleString()} records on this page are selected.</span><button data-action="${c.selectAll}">Select all ${c.total.toLocaleString()} matching</button>`;if(needNotice){if(!notice){notice=document.createElement('div');notice.className='v8-scope-notice';bar.after(notice)}if(notice.innerHTML!==noticeHtml)notice.innerHTML=noticeHtml}else if(notice)notice.remove();document.querySelectorAll('.data-table tbody tr').forEach(row=>{const checked=row.querySelector('.checkbox-target input')?.checked;row.classList.toggle('v8-show-selected-hidden',!!state.v8ShowSelected&&!checked)})}
function v8DecorateEvidence(){document.querySelectorAll('.evidence-meta').forEach(meta=>{if(!/uploaded on/i.test(meta.textContent||'')){meta.insertAdjacentHTML('beforeend','<span class="v8-evidence-date">(uploaded on 04 Jan 2026)</span>')}})}
function v8AuditSpacing(){document.querySelectorAll('.panel-card,.card,.search-card,.record-detail-card').forEach(el=>{if(getComputedStyle(el).boxSizing!=='border-box')el.style.boxSizing='border-box'});}
function v8ProductLanguage(){
 const replacements=[
  ['applied to this mock audit dataset.','applied to the current audit results.'],
  ['Keep this page open while the prototype simulates file transfer.','Keep this page open while the file uploads.'],
  ['No additional restrictions found in this mock example','No additional active restrictions found'],
  ['Evidence snapshot attached to this mock audit event','Evidence snapshot attached to this audit event'],
  ['Read-only mock document. Original evidence remains unchanged.','Read-only document preview. Original evidence remains unchanged.']
 ];
 const walker=document.createTreeWalker(document.getElementById('app'),NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){for(const [a,b] of replacements)if(n.nodeValue&&n.nodeValue.includes(a))n.nodeValue=n.nodeValue.replace(a,b)}
 const type=document.querySelector('#modal-idnc-type');if(type&&state.v8OverviewIdncSubtype&&!state.addSubtype)type.value=state.v8OverviewIdncSubtype;
 const auditBox=[...document.querySelectorAll('.restriction-modal .upload-box')].find(x=>/compliance-evidence\.pdf/i.test(x.textContent||''));if(auditBox&&!auditBox.querySelector('.v8-evidence-date')){const copy=auditBox.querySelector('div');if(copy){const d=document.createElement('span');d.className='v8-evidence-date';d.textContent='(uploaded on 04 Jan 2026)';copy.appendChild(d)}}
}
function v8Decorate(){v8DecorateSelection();v8DecorateEvidence();v8AuditSpacing();v8ProductLanguage()}
const v8Observer=new MutationObserver(()=>v8Decorate());v8Observer.observe(document.getElementById('app'),{childList:true,subtree:true});setTimeout(v8Decorate,0);

document.addEventListener('click',e=>{
 if(e.target.closest('[data-action="audit-document-preview"]')){e.preventDefault();e.stopPropagation();v8EvidenceWindow();return;}

 const dup=e.target.closest('[data-action="duplicate-view"]');if(dup&&state.v8Duplicate?.record){e.preventDefault();e.stopImmediatePropagation();const d=state.v8Duplicate;state.addType=null;state.addSubtype=null;state.recordDetail={...d.record,_kind:d.recordKind};state.v8Duplicate=null;render();return}
 const poss=e.target.closest('[data-action="modal-possible-continue"]');if(poss&&state.addStage==='possible-duplicate'){e.preventDefault();e.stopImmediatePropagation();if(state.addType==='IDNC'&&!state.addSubtype)state.addSubtype=v8ChosenSubtype();state.crossListReason=v8CrossListReason();state.addStage='review';state.announcement='Possible duplicate reviewed. Continue only if this is a separate restriction.';render();return}
 const ev=e.target.closest('[data-action="v8-evidence-open"]');if(ev){e.preventDefault();e.stopImmediatePropagation();v8EvidenceWindow();return}
 if(e.target.closest('[data-v8-selection-menu]')){e.preventDefault();state.v8SelectionMenu=!state.v8SelectionMenu;v8DecorateSelection();return}
 if(e.target.closest('[data-v8-clear-selection]')){e.preventDefault();v8ClearSelection();return}
 if(e.target.closest('[data-v8-show-selected]')){e.preventDefault();state.v8ShowSelected=!state.v8ShowSelected;state.v8SelectionMenu=false;v8DecorateSelection();return}
 if(e.target.closest('[data-action="v8-rlc-select-all"]')){e.preventDefault();state.rlcSelected=new Set(state.rlcRecords.map(r=>r.id));state.v8SelectionMenu=false;render();return}