/* DNC v10: deterministic inline SVG country flags */
const v10FlagStyle=document.createElement('style');
v10FlagStyle.textContent=`
.v9-country-flag{width:20px!important;min-width:20px!important;height:14px!important;font-size:0!important;border-radius:2px;overflow:hidden;box-shadow:0 0 0 1px rgba(23,35,45,.12);background:#fff}
.v9-country-title .v9-country-flag{width:24px!important;min-width:24px!important;height:16px!important}
.v9-country-flag svg{display:block;width:100%;height:100%}
`;
document.head.appendChild(v10FlagStyle);

function v10FlagSvg(country){
 const common='viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"';
 const flags={
  'Iran':`<svg ${common}><rect width="30" height="6.67" fill="#239f40"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#da0000"/><circle cx="15" cy="10" r="1.6" fill="#da0000"/></svg>`,
  'North Korea':`<svg ${common}><rect width="30" height="20" fill="#024fa2"/><rect y="3" width="30" height="14" fill="#fff"/><rect y="4" width="30" height="12" fill="#ed1c27"/><circle cx="10" cy="10" r="4" fill="#fff"/><path d="M10 6.7l.8 2.1 2.2.1-1.7 1.4.6 2.2-1.9-1.2-1.9 1.2.6-2.2L7 8.9l2.2-.1z" fill="#ed1c27"/></svg>`,
  'Syria':`<svg ${common}><rect width="30" height="6.67" fill="#007a3d"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#000"/><g fill="#ce1126"><path d="M10 8l.45 1.15 1.25.05-.98.78.35 1.2-1.07-.67-1.07.67.35-1.2-.98-.78 1.25-.05z"/><path d="M15 8l.45 1.15 1.25.05-.98.78.35 1.2-1.07-.67-1.07.67.35-1.2-.98-.78 1.25-.05z"/><path d="M20 8l.45 1.15 1.25.05-.98.78.35 1.2-1.07-.67-1.07.67.35-1.2-.98-.78 1.25-.05z"/></g></svg>`,
  'Cuba':`<svg ${common}><rect width="30" height="20" fill="#fff"/><path d="M0 0h30v4H0zm0 8h30v4H0zm0 16h30v4H0z" fill="#002a8f"/><path d="M0 0l13 10L0 20z" fill="#cf142b"/><path d="M4.4 7.2l.7 1.8 1.9.1-1.5 1.2.5 1.9-1.6-1-1.6 1 .5-1.9-1.5-1.2L3.7 9z" fill="#fff"/></svg>`,
  'Belarus':`<svg ${common}><rect width="30" height="20" fill="#c8313e"/><rect y="13.3" width="30" height="6.7" fill="#4aa657"/><rect width="4" height="20" fill="#fff"/><path d="M1 1h2v2H1zm0 4h2v2H1zm0 4h2v2H1zm0 4h2v2H1zm0 4h2v2H1z" fill="#c8313e"/></svg>`,
  'Russia':`<svg ${common}><rect width="30" height="6.67" fill="#fff"/><rect y="6.67" width="30" height="6.66" fill="#0039a6"/><rect y="13.33" width="30" height="6.67" fill="#d52b1e"/></svg>`,
  'Sudan':`<svg ${common}><rect width="30" height="6.67" fill="#d21034"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#000"/><path d="M0 0l11 10L0 20z" fill="#007229"/></svg>`,
  'Myanmar':`<svg ${common}><rect width="30" height="6.67" fill="#fecb00"/><rect y="6.67" width="30" height="6.66" fill="#34b233"/><rect y="13.33" width="30" height="6.67" fill="#ea2839"/><path d="M15 4.8l1.55 3.95 4.23.2-3.28 2.66 1.12 4.08L15 13.4l-3.62 2.29 1.12-4.08-3.28-2.66 4.23-.2z" fill="#fff"/></svg>`
 };
 return flags[country]||`<svg ${common}><rect width="30" height="20" fill="#eef2f4"/><circle cx="15" cy="10" r="4" fill="#87939c"/></svg>`;
}

/* v9 owns the RLC decoration lifecycle. Replace only its flag renderer. */
v9Flag=function(country){return v10FlagSvg(country)};

/* One guarded refresh handles any RLC rows already present when this patch loads. */
function v10RefreshFlagsOnce(){
 document.querySelectorAll('.v9-country-name').forEach(w=>{
  const name=(w.querySelector('span:last-child')?.textContent||'').trim();
  const flag=w.querySelector('.v9-country-flag');
  if(flag&&name&&!flag.querySelector('svg'))flag.innerHTML=v10FlagSvg(name);
 });
 const title=document.querySelector('.v9-country-title');
 if(title){
  const name=(title.querySelector('span:last-child')?.textContent||'').trim();
  const flag=title.querySelector('.v9-country-flag');
  if(flag&&name&&!flag.querySelector('svg'))flag.innerHTML=v10FlagSvg(name);
 }
}
setTimeout(v10RefreshFlagsOnce,0);
