(function(){
'use strict';
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch(e){}}
function currentInvoice(){var v=document.getElementById('invoiceView');if(!v)return null;var m=(v.textContent||'').match(/INV-\d+/);if(!m)return null;var list=read();for(var i=0;i<list.length;i++)if(String(list[i].number)===m[0])return list[i];return null}
function updateScreen(inv,b){var v=document.getElementById('invoiceView');if(!v)return;v.querySelectorAll('.invoice-status').forEach(function(x){x.textContent=inv.status;x.setAttribute('aria-label',inv.status);if(String(inv.status).toLowerCase()==='paid'){x.style.background='#ecfdf3';x.style.color='#166534'}});if(b){b.textContent=String(inv.status).toLowerCase()==='paid'?'✓ Paid':'💰 Mark as Paid';b.disabled=false;b.style.pointerEvents='auto';b.style.cursor='pointer';b.style.opacity='1';b.style.background='#16a34a';b.style.color='#fff'}}
function markPaid(b){var inv=currentInvoice();if(!inv){alert('Invoice could not be found.');return}var list=read();var live=null;for(var i=0;i<list.length;i++)if(String(list[i].number)===String(inv.number)){live=list[i];break}if(!live)return;if(String(live.status||'').toLowerCase()==='paid')return;live.status='Paid';live.paidAt=Date.now();live.paidSource='manual';live.paidMethod='Manual payment';save(list);updateScreen(live,b);if(typeof window.refreshTQBDashboard==='function')window.refreshTQBDashboard();if(typeof window.renderList==='function')window.renderList()}
function bind(){var v=document.getElementById('invoiceView');if(!v)return;var b=v.querySelector('#markPaidBtn');if(!b)return;b.type='button';b.onclick=function(e){e.preventDefault();e.stopPropagation();markPaid(b);};b.ontouchend=function(e){e.preventDefault();e.stopPropagation();markPaid(b);};b.onpointerup=function(e){e.preventDefault();e.stopPropagation();markPaid(b);};b.disabled=false;b.style.pointerEvents='auto';}
function start(){bind();setInterval(bind,300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
