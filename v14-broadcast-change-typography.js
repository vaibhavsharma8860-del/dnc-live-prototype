/* DNC v14: normalize Broadcast Queue Change column typography */
const v14Style=document.createElement('style');
v14Style.textContent=`
.v12-broadcast-table .data-table th:first-child{font-weight:500!important;color:var(--text-secondary)!important;}
.v12-broadcast-table .data-table td:first-child,
.v12-broadcast-table .data-table td:first-child *,
.v12-broadcast-table .data-table td:first-child strong,
.v12-broadcast-table .data-table td:first-child b{
  font-size:12px!important;
  font-weight:400!important;
  line-height:18px!important;
  color:var(--text-primary)!important;
  letter-spacing:0!important;
}
.v12-broadcast-table .data-table th:first-child,
.v12-broadcast-table .data-table td:first-child{width:260px!important;min-width:260px!important;}
`;
document.head.appendChild(v14Style);
