const __ls={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]}};
const state = {
  view: ({'#cdnc':'cdnc','#idnc':'idnc','#blacklist':'blacklist','#audit':'audit','#bulk-import':'bulk-import','#broadcast-queue':'broadcast-queue','#concurrent':'concurrent','#rlc':'rlc'}[location.hash] || 'overview'),
  addType: null,
  addSubtype: null,
  addOrigin: 'overview',
  addStage: 'form',
  addProgress: 0,
  addMenu: false,
  query: '', submittedQuery: '', searchLoading: false, searchError: false, correction: '', matchLogic: '',
  status: 'All statuses', sector: 'All sectors', sort: 'Recently updated', page: 1, pageSize: 50,
  selected: new Set(), allMatching: false, toast: '',
  addErrors: {}, removeStage: null, removeReason: '', removeProgress: 0, removeError: '', rlcRemoveStage:null, rlcRemoveReason:'', rlcRemoveProgress:0, role:'Administrator', roleMenu:false,
  recordDetail:null, auditPreview:null, queueDetail:null, auditCustomFrom:'2026-08-01', auditCustomTo:'2026-08-14',
};

const featured = [
  ['Flipkart','E-commerce','flipkart.com','Active',['Flipkart Internet Pvt Ltd']],
  ['Amazon','E-commerce','amazon.in','Active',['Amazon India']],
  ['Myntra','Fashion','myntra.com','Active',[]],
  ['Meesho','E-commerce','meesho.com','Active',[]],
  ['Ajio','Fashion','ajio.com','Review',[]],
  ['Nykaa','Retail','nykaa.com','Active',[]],
  ['Zepto','Quick commerce','zeptonow.com','Active',['Zepto Marketplace']],
  ['Swiggy','Food tech','swiggy.com','Active',[]],
];
const names=['Acme','Aster','BluePeak','Coreline','Delta','Evergreen','Finverse','GreenArc','Hypernova','Indigo','Jupiter','Kiteworks','Lumina','Metroline','Northstar','Orbit','Pioneer','Quickship','Redwood','Skyline'];
const sectors=['Technology','Financial services','E-commerce','Retail','Professional services','Logistics'];
const allRecords=featured.map((r,i)=>({id:`cdnc-${i+1}`,company:r[0],sector:r[1],domain:r[2],website:r[2],status:r[3],aliases:r[4],updatedAt:Date.now()-i*7000000}));
for(let i=featured.length;i<4912;i++){const base=names[i%names.length],domain=`${base.toLowerCase()}-${i+1}.com`;allRecords.push({id:`cdnc-${i+1}`,company:`${base} ${String(i+1).padStart(4,'0')}`,sector:sectors[i%sectors.length],domain,website:domain,status:i%17===0?'Review':'Active',aliases:[],updatedAt:Date.now()-i*1000000});}
const savedAdded=JSON.parse(__ls.getItem('dnc-demo-added')||'[]');
const savedRemoved=new Set(JSON.parse(__ls.getItem('dnc-demo-removed')||'[]'));
state.liveRecords=[...savedAdded,...allRecords.filter(r=>!savedRemoved.has(r.id))];
state.records=state.liveRecords;

const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const icon=(name,size=16)=>{
 const paths={
  home:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  folder:'<path d="M3 7.5h6l2-2h4l2 2h4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 10h18"/>',
  database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-3.5 2.5-5 5.5-5s5 1.5 5.5 5"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.5c2.8-.5 4.6.8 5 3.5"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 17h.01"/>',
  invoice:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  user:'<circle cx="12" cy="8" r="3"/><path d="M5 20c.6-4.3 3-6.5 7-6.5s6.4 2.2 7 6.5"/>',
  down:'<path d="m7 10 5 5 5-5"/>', up:'<path d="m7 14 5-5 5 5"/>', left:'<path d="m14 7-5 5 5 5"/>', right:'<path d="m10 7 5 5-5 5"/>', plus:'<path d="M12 5v14M5 12h14"/>', x:'<path d="m7 7 10 10M17 7 7 17"/>', check:'<path d="m6 12 4 4 8-9"/>', upload:'<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v5h16v-5"/>'};
 return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.database}</svg>`;
};
const button=(label,variant='primary',attrs='')=>`<button class="button button-${variant}" ${attrs}>${label}</button>`;

function sidebar(){
 const nav=[['Home','home'],['Projects','folder'],['JPMS','database'],['Experts/Leads','users']];
 const sub=[['Master DNC','overview'],['CDNC','cdnc'],['IDNC','idnc'],['Blacklist','blacklist'],['RLC','rlc'],['Audit Log','audit']];
 return `<aside class="sidebar"><div class="user-wrap"><button class="user-block user-block-button" data-action="toggle-role-menu"><div class="avatar">VS</div><div><div class="user-name">Vaibhav Sharma</div><div class="user-role">${state.role}</div></div></button>${state.roleMenu?`<div class="role-menu card"><button data-action="role-admin">Administrator</button><button data-action="role-viewer">View only</button></div>`:''}</div><nav class="sidebar-nav">${nav.map(([l,i])=>`<button class="nav-row"><span class="nav-row-main">${icon(i)}<span>${l}</span></span>${icon('down',14)}</button>`).join('')}<div class="compliance-group"><div class="nav-row nav-row-active section-row"><span class="nav-row-main">${icon('alert')}<span>Compliance</span></span>${icon('up',14)}</div><div class="compliance-children">${sub.map(([l,v])=>`<button data-route="${v}" class="subnav-row ${state.view===v?'subnav-row-active':''}">${icon('database',14)}<span>${l}</span></button>`).join('')}</div></div><button class="nav-row"><span class="nav-row-main">${icon('invoice')}<span>Invoices</span></span>${icon('down',14)}</button><button class="nav-row"><span class="nav-row-main">${icon('user')}<span>Admin</span></span>${icon('down',14)}</button><button class="nav-row"><span class="nav-row-main">${icon('users')}<span>More</span></span>${icon('down',14)}</button></nav></aside>`;
}
function shell(content){const crumbs={overview:'Home / Master DNC',cdnc:'Home / Master DNC / CDNC',idnc:`Home / Master DNC / IDNC ${state.idncTab||'Expert'}s`,blacklist:'Home / Master DNC / Blacklist',rlc:'Home / Master DNC / RLC',audit:'Home / Master DNC / Audit Log','bulk-import':'Home / Master DNC / Bulk Import','broadcast-queue':'Home / Master DNC / Broadcast Queue',concurrent:'Home / Master DNC / Concurrent Update'};return `<div class="app-frame">${sidebar()}<main class="app-main"><header class="topbar">${crumbs[state.view]||'Home / Master DNC'}</header>${content}</main></div><div class="sr-live" aria-live="polite">${esc(state.announcement||'')}</div>${state.rlcRemoveStage?rlcRemoveModal():state.removeStage?removeModal():state.addType?modal():''}${state.recordDetail?recordDetailModal():''}${state.auditPreview?auditPreviewModal():''}${state.queueDetail?queueDetailModal():''}`;}
function stat(label,value,delta){return `<div class="card stat-card"><span class="stat-label">${label}</span><span class="stat-value">${value}</span><span class="stat-delta">${delta}</span></div>`;}
function overview(){
 const activity=[['CDNC restriction added','CDNC','Vaibhav Sharma','Broadcast complete','12 min ago'],['External sync retried','IDNC Expert','Riya Kapoor','Completed','38 min ago'],['Blacklist record removed','Blacklist','Arjun Rao','Effective status recalculated','1 hr ago'],['Bulk import validated','Mixed DNC','Vaibhav Sharma','42 rows need review','2 hrs ago']];
 return shell(`<section class="page-body"><div class="page-inner"><header class="page-header"><div class="page-header-row"><h1>Master DNC Overview</h1><div class="add-menu-wrap">${button(`${icon('plus')} Add`,'primary','data-action="toggle-add-menu"')}${state.addMenu?`<div class="add-menu card">${['CDNC','IDNC','Blacklist','RLC'].map(t=>`<button data-add="${t}">Add ${t}</button>`).join('')}</div>`:''}</div></div><p class="page-subtitle">Monitor effective restrictions, recent changes and compliance actions across Master DNC.</p></header>${state.toast?`<div class="inline-alert inline-alert-success"><div class="inline-alert-title">Restriction created</div>${esc(state.toast)}</div>`:''}<div class="kpi-grid">${stat('Restricted companies','1,240','+24 this month')}${stat('Restricted experts & leads','3,493','+41 this month')}${stat('Blacklisted experts','526','+8 this month')}${stat('Red Light Countries','14','No change')}</div><div class="overview-grid"><section class="card panel-card"><div class="panel-head"><div><div class="panel-title">Coverage</div><p class="panel-copy">Active restrictions across the Master DNC decision engine.</p></div></div><div class="coverage-bars">${[['CDNC',78,'1,240'],['IDNC',62,'3,493'],['Blacklist',33,'526'],['RLC',18,'14']].map(([l,v,c])=>`<div class="coverage-row"><strong>${l}</strong><div class="coverage-track"><div class="coverage-fill" style="width:${v}%"></div></div><span>${c}</span></div>`).join('')}</div></section><section class="card panel-card"><div class="panel-head"><div><div class="panel-title">Needs Attention</div><p class="panel-copy">Operational items that require a compliance decision or retry.</p></div><span class="badge badge-warning">9 items</span></div><div class="attention-list">${[['6 broadcasts queued','2 are waiting on external compliance sync','View queue','broadcast-queue'],['Latest import needs attention','42 rows are excluded pending review','Review issues','bulk-import'],['1 concurrent update','A CDNC record changed while being edited','Review','concurrent']].map(r=>`<div class="attention-row"><div><strong>${r[0]}</strong><span>${r[1]}</span></div>${button(r[2],'text',`data-route="${r[3]}"`)}</div>`).join('')}</div></section></div><section class="card activity-card"><div class="panel-head"><div><div class="panel-title">Recent Activity</div><p class="panel-copy">Immutable compliance activity from the latest operations.</p></div>${button('View Audit Log','text','data-route="audit"')}</div><table class="activity-table"><thead><tr><th>Activity</th><th>Type</th><th>Owner</th><th>Status</th><th>Updated</th></tr></thead><tbody>${activity.map(r=>`<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table></section></div></section>`);
}
function filteredRecords(){let r=state.records;if(state.status!=='All statuses')r=r.filter(x=>x.status===state.status);if(state.sector!=='All sectors')r=r.filter(x=>x.sector===state.sector);r=[...r].sort((a,b)=>state.sort==='Company A–Z'?a.company.localeCompare(b.company):b.updatedAt-a.updatedAt);return r;}
function cdnc(){
 const filtered=filteredRecords(), start=(state.page-1)*state.pageSize, rows=filtered.slice(start,start+state.pageSize), pageIds=rows.map(r=>r.id), pageSelected=pageIds.length&&pageIds.every(id=>state.selected.has(id)), count=state.allMatching?filtered.length:state.selected.size;
 const q=state.query.trim().toLowerCase(); const sugg=q.length>=2&&!state.submittedQuery?state.liveRecords.filter(r=>`${r.company} ${r.domain} ${r.aliases.join(' ')}`.toLowerCase().includes(q)).slice(0,4):[];
 return shell(`<section class="page-body"><div class="page-inner"><header class="page-header"><div class="page-header-row"><h1>CDNC Directory</h1>${button('+ Add CDNC','primary','data-add="CDNC"')}</div><p class="page-subtitle">Review company suppression records and open any result for details or removal actions.</p></header>${state.toast?`<div 