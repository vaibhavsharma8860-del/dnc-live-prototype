/* DNC v7 product-language + clean create-state patch */
const v7Style=document.createElement('style');
v7Style.textContent=`
/* Breadcrumb is redundant with persistent sidebar + page title. */
.app-main>.topbar{display:none!important}
/* Keep dropdown indicators comfortably inside every control. */
.app-main select,.restriction-modal select{appearance:none!important;-webkit-appearance:none!important;padding-right:42px!important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2317232d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")!important;background-repeat:no-repeat!important;background-position:right 14px center!important;background-size:16px 16px!important}
/* No implementation-context cards in create flows. */
.restriction-modal .context-note{display:none!important}
`;
document.head.appendChild(v7Style);

/* Every create flow starts clean. Context stays internal, not prefilled or explained. */
openModal=function(type,subtype=null){
 state.addType=type;
 state.addSubtype=subtype;
 state.addOrigin=state.view;
 state.addStage=state.role==='View only'?'permission':'form';
 state.addProgress=0;
 state.modalCompany='';
 state.modalDomain='';
 state.modalEmail='';
 state.modalReference='';
 state.modalReason='';
 state.modalPersonCompany='';
 state.modalPersonEmail='';
 state.modalPersonIdentifier='';
 state.uploadState='';
 state.crossListReason='';
 state.addErrors={};
 state.addMenu=false;
 state.announcement=`Add ${subtype?`${subtype} `:''}${type} restriction dialog opened.`;
 render();
 setTimeout(()=>document.querySelector('.restriction-modal input, .restriction-modal select, .restriction-modal textarea')?.focus(),0);
};

/* Replace implementation-facing copy with concise product language. */
const v7ModalOriginal=modal;
modal=function(){
 let html=v7ModalOriginal();
 html=html
  .replace(/<div class="context-note field-wide">[\s\S]*?<\/div>/g,'')
  .replace('Checking existing records','Reviewing existing restrictions')
  .replace('Checking active duplicates and cross-list restrictions before you continue.','We’ll flag any existing restriction that may affect this entry.')
  .replace('Your entered data is preserved. Retry saving or continue to review without discarding the form.','Your information is still here. Try saving again or continue to review.')
  .replace('Your form data is preserved. Retry the failed upload.','Your information is still here. Try uploading the file again.');
 return html;
};

/* Prevent legacy Blacklist email fallback from appearing as a prefilled value. */
const v7Observer=new MutationObserver(()=>{
 const email=document.querySelector('#modal-email');
 if(email&&state.addType==='Blacklist'&&!state.modalEmail&&email.value==='aarav.mehta@example.com') email.value='';
});
v7Observer.observe(document.getElementById('app'),{childList:true,subtree:true});
