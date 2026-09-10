(function(){
'use strict';
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function invoiceNumber(){var v=document.getElementById('invoiceView');if(!v)return '';var m=(v.textContent||'').match(/INV-\d+/);return m?m[0]:''}
function markPaid(){var n=invoiceNumber();if(!n)return;var list=read(),inv=null;for(var i=0;i<list.length;i++){if(String(list[i].number)===n){inv=list[i];break}}
if(!inv)return;
if(String(inv.status||'').toLowerCase()==='paid')return;
inv.status='Paid';inv.paidAt=Date.now();inv.paidSource='manual';inv.paidMethod='Manual payment';save(list);
var v=document.getElementById('invoiceView');if(v){v.querySelectorAll('.invoice-status').forEach(function(x){x.textContent='Paid';x.setAttribute('aria-label','Paid');x.style.background='#ecfdf3';x.style.color='#166534'});var b=v.querySelector('#markPaidBtn');if(b){b.textContent='✓ Paid';b.disabled=true;b.style.background='#16a34a';b.style.color='#fff';b.style.opacity='1'}}
if(typeof window.refreshTQBDashboard==='function')window.refreshTQBDashboard();
if(typeof window.renderList==='function')window.renderList();
}
function bind(){document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#invoiceView #markPaidBtn'):null;if(!b)return;e.preventDefault();e.stopPropagation();markPaid()},true);document.addEventListener('pointerup',function(e){var b=e.target&&e.target.closest?e.target.closest('#invoiceView #markPaidBtn'):null;if(!b)return;e.preventDefault();e.stopPropagation();markPaid()},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
