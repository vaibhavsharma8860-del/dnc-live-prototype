/* DNC v15: Broadcast Queue typography fix independent of removed Bulk Import patch */
const v15PrevBroadcastQueue=broadcastQueue;
broadcastQueue=function(){
  const html=v15PrevBroadcastQueue();
  return html.replace('class="page-inner"','class="page-inner v15-broadcast-table"');
};
const v15Style=document.createElement('style');
v15Style.textContent=`
.v15-broadcast-table .data-table th:first-child{font-weight:500!important;color:var(--text-secondary)!important;}
.v15-broadcast-table .data-table td:first-child,
.v15-broadcast-table .data-table td:first-child *,
.v15-broadcast-table .data-table td:first-child strong,
.v15-broadcast-table .data-table td:first-child b{
  font-size:12px!important;
  font-weight:400!important;
  line-height:18px!important;
  color:var(--text-primary)!important;
  letter-spacing:0!important;
}
.v15-broadcast-table .data-table th:first-child,
.v15-broadcast-table .data-table td:first-child{width:260px!important;min-width:260px!important;}
`;
document.head.appendChild(v15Style);
