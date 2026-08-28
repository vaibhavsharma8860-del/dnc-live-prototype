/* DNC v11: force chevron-down in Shopify-style selection menu trigger */
const v11Chevron='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const v11SelectionHtmlOriginal=v8SelectionHtml;
v8SelectionHtml=function(c,n){
 const html=v11SelectionHtmlOriginal(c,n);
 return html.replace(/(<button class="v8-selection-dropdown"[^>]*>)[\s\S]*?(<\/button>)/,`$1${v11Chevron}$2`);
};
