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
  addErrors: {}, removeStage: null, removeReason: '', removeProgress: 0, removeError: '', rlcRemoveStage:null, rlcRemoveReason:'', rlcRemoveProgress:0,
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
const savedAdded=JSON.parse(localStorage.getItem('dnc-demo-added')||'[]');
const savedRemoved=new Set(JSON.parse(localStorage.getItem('dnc-demo-removed')||'[]'));
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
 return `<aside class="sidebar"><div class="user-block"><div class="avatar">VS</div><div><div class="user-name">Vaibhav Sharma</div><div class="user-role">Administrator</div></div></div><nav class="sidebar-nav">${nav.map(([l,i])=>`<button class="nav-row"><span class="nav-row-main">${icon(i)}<span>${l}</span></span>${icon('down',14)}</button>`).join('')}<div class="compliance-group"><div class="nav-row nav-row-active section-row"><span class="nav-row-main">${icon('alert')}<span>Compliance</span></span>${icon('up',14)}</div><div class="compliance-children">${sub.map(([l,v])=>`<button data-route="${v}" class="subnav-row ${state.view===v?'subnav-row-active':''}">${icon('database',14)}<span>${l}</span></button>`).join('')}</div></div><button class="nav-row"><span class="nav-row-main">${icon('invoice')}<span>Invoices</span></span>${icon('down',14)}</button><button class="nav-row"><span class="nav-row-main">${icon('user')}<span>Admin</span></span>${icon('down',14)}</button><button class="nav-row"><span class="nav-row-main">${icon('users')}<span>More</span></span>${icon('down',14)}</button></nav></aside>`;
}
function shell(content){const crumbs={overview:'Home / Master DNC',cdnc:'Home / Master DNC / CDNC',idnc:`Home / Master DNC / IDNC ${state.idncTab||'Expert'}s`,blacklist:'Home / Master DNC / Blacklist',rlc:'Home / Master DNC / RLC',audit:'Home / Master DNC / Audit Log','bulk-import':'Home / Master DNC / Bulk Import','broadcast-queue':'Home / Master DNC / Broadcast Queue',concurrent:'Home / Master DNC / Concurrent Update'};return `<div class="app-frame">${sidebar()}<main class="app-main"><header class="topbar">${crumbs[state.view]||'Home / Master DNC'}</header>${content}</main></div><div class="sr-live" aria-live="polite">${esc(state.announcement||'')}</div>${state.rlcRemoveStage?rlcRemoveModal():state.removeStage?removeModal():state.addType?modal():''}`;}
function stat(label,value,delta){return `<div class="card stat-card"><span class="stat-label">${label}</span><span class="stat-value">${value}</span><span class="stat-delta">${delta}</span></div>`;}
function overview(){
 const activity=[['CDNC restriction added','CDNC','Vaibhav Sharma','Broadcast complete','12 min ago'],['External sync retried','IDNC Expert','Riya Kapoor','Completed','38 min ago'],['Blacklist record removed','Blacklist','Arjun Rao','Effective status recalculated','1 hr ago'],['Bulk import validated','Mixed DNC','Vaibhav Sharma','42 rows need review','2 hrs ago']];
