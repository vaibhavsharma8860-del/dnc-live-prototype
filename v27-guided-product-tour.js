/* Guided product tour for first-time visitors. Lives outside #app so product renders cannot destroy it. */
const v27TourKey='dnc-guided-tour-complete-v1';
let v27TourIndex=-1;
let v27TourActive=false;
let v27TourTarget=null;

const v27Style=document.createElement('style');v27Style.textContent=`
#v27-tour-root{position:fixed;inset:0;z-index:12000;pointer-events:none;font-family:inherit}.v27-tour-spotlight{position:fixed;border:2px solid #0f7f98;border-radius:12px;box-shadow:0 0 0 9999px rgba(16,31,40,.58),0 0 0 5px rgba(15,127,152,.14);transition:all .22s ease;pointer-events:none}.v27-tour-card{position:fixed;width:min(360px,calc(100vw - 32px));background:#fff;border:1px solid #d8e1e6;border-radius:12px;box-shadow:0 16px 42px rgba(17,36,46,.22);padding:18px;pointer-events:auto;color:#17232d}.v27-tour-eyebrow{font-size:12px;font-weight:600;color:#0f7f98;margin-bottom:8px}.v27-tour-card h3{margin:0 0 8px;font-size:17px;line-height:23px}.v27-tour-card p{margin:0;color:#617482;font-size:13px;line-height:20px}.v27-tour-controls{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}.v27-tour-progress{font-size:12px;color:#6b7c87;font-weight:600;white-space:nowrap}.v27-tour-actions{display:flex;gap:8px;align-items:center}.v27-tour-btn{height:36px;padding:0 13px;border-radius:7px;border:1px solid #bccbd3;background:#fff;color:#17232d;font:600 12px inherit;cursor:pointer}.v27-tour-btn.primary{background:#087f98;color:#fff;border-color:#087f98}.v27-tour-btn.text{border-color:transparent;color:#617482;padding:0 5px}.v27-tour-intro-wrap{position:fixed;inset:0;background:rgba(16,31,40,.58);display:grid;place-items:center;pointer-events:auto;padding:20px}.v27-tour-intro{width:min(470px,100%);background:#fff;border-radius:14px;padding:28px;box-shadow:0 22px 60px rgba(0,0,0,.24)}.v27-tour-intro-badge{display:inline-flex;padding:5px 9px;border-radius:999px;background:#eaf7f8;color:#087f98;font-size:12px;font-weight:700;margin-bottom:14px}.v27-tour-intro h2{font-size:24px;line-height:30px;margin:0 0 10px;color:#17232d}.v27-tour-intro p{font-size:14px;line-height:22px;color:#617482;margin:0}.v27-tour-intro .v27-tour-actions{justify-content:flex-end;margin-top:22px}.v27-tour-launch{position:fixed;left:18px;bottom:18px;z-index:11000;height:34px;border:1px solid #cbd8de;border-radius:8px;background:#fff;color:#425560;padding:0 11px;font:600 12px inherit;box-shadow:0 4px 14px rgba(17,36,46,.1);cursor:pointer}.v27-tour-launch:hover{border-color:#087f98;color:#087f98}@media(max-width:760px){.v27-tour-card{left:16px!important;right:16px!important;bottom:16px!important;top:auto!important;width:auto}.v27-tour-launch{left:auto;right:14px;bottom:14px}}
`;document.head.appendChild(v27Style);

const v27Root=document.createElement('div');v27Root.id='v27-tour-root';document.body.appendChild(v27Root);
const v27Launch=document.createElement('button');v27Launch.className='v27-tour-launch';v27Launch.type='button';v27Launch.textContent='? Product tour';v27Launch.setAttribute('aria-label','Restart product tour');document.body.appendChild(v27Launch);

function v27Delay(ms=90){return new Promise(r=>setTimeout(r,ms))}
function v27TextEl(regex,selector='button,div,section,header,h1,h2,h3,strong,span'){
 return [...document.querySelectorAll(selector)].find(el=>regex.test((el.textContent||'').trim()));
}
function v27CardForText(regex){const el=v27TextEl(regex);return el?.closest('.card,.panel-card,.activity-card,.attention-row,.page-header')||el}
function v27ResetProduct(){
 try{state.addType=null;state.addMenu=false;state.addStage='form';state.recordDetail=null;state.removeStage=null;state.rlcRemoveStage=null;state.auditPreview=null;state.queueDetail=null;}catch(_){}
}
function v27Go(view){try{v27ResetProduct();state.view=view;location.hash=view==='overview'?'':`#${view}`;render();}catch(e){console.error('tour navigation',e)}}
function v27OpenFirstCdncRecord(){const row=document.querySelector('.data-table tbody tr.clickable-row,.data-table tbody tr[data-id]');if(row)row.click()}
function v27OpenCdncAdd(){try{v27ResetProduct();state.view='cdnc';state.addType='CDNC';state.addOrigin='cdnc';state.addStage='form';render();}catch(e){console.error('tour add',e)}}

const v27Steps=[
 {title:'Master DNC Overview',body:'This is the control centre for company, individual, blacklist and country-level Do Not Contact restrictions.',prepare:()=>v27Go('overview'),target:()=>document.querySelector('.page-header')||document.querySelector('.page-inner')},
 {title:'Needs Attention',body:'Operational work that needs a compliance decision appears here, including failed updates, drafts and queued actions.',prepare:()=>v27Go('overview'),target:()=>v27CardForText(/Needs Attention/i)},
 {title:'DNC Types',body:'Use Compliance navigation to move between CDNC companies, IDNC experts and leads, Blacklist records, RLC countries and the Audit Log.',prepare:()=>v27Go('overview'),target:()=>document.querySelector('.compliance-group')||document.querySelector('.sidebar')},
 {title:'Search and filters',body:'Directories are built for large datasets. Search, filter, sort and paginate to find the exact restriction you need.',prepare:()=>v27Go('cdnc'),target:()=>{const i=document.querySelector('input[type="search"],input[placeholder*="Search" i]');return i?.closest('.search-row,.filters-row,.toolbar,.table-toolbar,.card')||i||document.querySelector('.page-inner')}},
 {title:'Record details',body:'Open a row to inspect restriction information, evidence and the actions available for that specific record.',prepare:async()=>{v27Go('cdnc');await v27Delay(80);v27OpenFirstCdncRecord();await v27Delay(120)},target:()=>document.querySelector('.restriction-modal,.record-modal')||document.querySelector('.data-table')},
 {title:'Add a restriction',body:'New restrictions use the same guided creation pattern. Required fields change depending on CDNC, IDNC, Blacklist or RLC.',prepare:()=>{v27Go('cdnc')},target:()=>v27TextEl(/Add CDNC/i,'button')||document.querySelector('.page-header-row button')},
 {title:'Review before broadcast',body:'Every new restriction is reviewed before it is committed and sent to connected systems. This prevents accidental compliance changes.',prepare:async()=>{v27OpenCdncAdd();await v27Delay(100)},target:()=>document.querySelector('.restriction-modal')||document.querySelector('[class*="step"]')},
 {title:'Audit and downstream tracking',body:'Audit Log preserves compliance history, while the Broadcast Queue shows downstream updates, failures and retries without repeating successful work.',prepare:()=>v27Go('audit'),target:()=>document.querySelector('.page-header')||document.querySelector('.page-inner')}
];

function v27Position(target){
 const spot=v27Root.querySelector('.v27-tour-spotlight'),card=v27Root.querySelector('.v27-tour-card');if(!spot||!card)return;
 let r=target?.getBoundingClientRect?.();if(!r||r.width<2||r.height<2)r={left:24,top:80,right:innerWidth-24,bottom:210,width:innerWidth-48,height:130};
 const pad=7;spot.style.left=`${Math.max(6,r.left-pad)}px`;spot.style.top=`${Math.max(6,r.top-pad)}px`;spot.style.width=`${Math.min(innerWidth-12,r.width+pad*2)}px`;spot.style.height=`${Math.min(innerHeight-12,r.height+pad*2)}px`;
 const cw=Math.min(360,innerWidth-32),gap=14;let left=Math.min(innerWidth-cw-16,Math.max(16,r.left));let top=r.bottom+gap;if(top+210>innerHeight)top=Math.max(16,r.top-224);card.style.left=`${left}px`;card.style.top=`${top}px`;
}
async function v27ShowStep(i){
 if(i<0||i>=v27Steps.length)return v27Finish();v27TourIndex=i;v27TourActive=true;const s=v27Steps[i];
 v27Root.innerHTML='';try{await s.prepare?.()}catch(e){console.error('tour prepare',e)}await v27Delay(120);
 v27TourTarget=s.target?.()||document.querySelector('.app-main')||document.getElementById('app');try{v27TourTarget?.scrollIntoView?.({block:'nearest',behavior:'smooth'})}catch(_){}await v27Delay(80);
 v27Root.innerHTML=`<div class="v27-tour-spotlight"></div><section class="v27-tour-card" role="dialog" aria-live="polite"><div class="v27-tour-eyebrow">Guided product tour</div><h3>${s.title}</h3><p>${s.body}</p><div class="v27-tour-controls"><span class="v27-tour-progress">${i+1} / ${v27Steps.length}</span><div class="v27-tour-actions"><button class="v27-tour-btn text" data-v27="skip">Skip</button>${i?'<button class="v27-tour-btn" data-v27="back">Back</button>':''}<button class="v27-tour-btn primary" data-v27="next">${i===v27Steps.length-1?'Finish':'Next'}</button></div></div></section>`;
 v27Position(v27TourTarget);
}
function v27CompleteFlag(){try{localStorage.setItem(v27TourKey,'1')}catch(_){}}
function v27Finish(){v27CompleteFlag();v27TourActive=false;v27TourIndex=-1;v27Root.innerHTML='';v27ResetProduct();try{state.view='overview';location.hash='';render()}catch(_){} }
function v27Skip(){v27Finish()}
function v27Intro(){
 v27Root.innerHTML=`<div class="v27-tour-intro-wrap"><section class="v27-tour-intro" role="dialog" aria-modal="true"><div class="v27-tour-intro-badge">60–90 second walkthrough</div><h2>Welcome to Master DNC</h2><p>See how compliance teams find restrictions, inspect evidence, add new DNC records, review impact and track downstream updates.</p><div class="v27-tour-actions"><button class="v27-tour-btn" data-v27="intro-skip">Skip</button><button class="v27-tour-btn primary" data-v27="start">Start tour</button></div></section></div>`;
}
function v27Start(){v27Root.innerHTML='';v27ShowStep(0)}

v27Root.addEventListener('click',e=>{const a=e.target.closest('[data-v27]')?.dataset.v27;if(!a)return;if(a==='start')v27Start();if(a==='intro-skip'||a==='skip')v27Skip();if(a==='back')v27ShowStep(v27TourIndex-1);if(a==='next')v27TourIndex===v27Steps.length-1?v27Finish():v27ShowStep(v27TourIndex+1)});
v27Launch.addEventListener('click',()=>{v27ResetProduct();try{state.view='overview';render()}catch(_){}v27Intro()});
window.addEventListener('resize',()=>{if(v27TourActive)v27Position(v27TourTarget)});
document.addEventListener('keydown',e=>{if(!v27TourActive)return;if(e.key==='Escape')v27Skip();if(e.key==='ArrowRight')v27ShowStep(Math.min(v27Steps.length-1,v27TourIndex+1));if(e.key==='ArrowLeft'&&v27TourIndex>0)v27ShowStep(v27TourIndex-1)});

setTimeout(()=>{let done=false;try{done=localStorage.getItem(v27TourKey)==='1'}catch(_){}if(!done)v27Intro()},700);
