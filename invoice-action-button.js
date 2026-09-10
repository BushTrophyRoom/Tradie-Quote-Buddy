(function(){
'use strict';
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function paid(x){return String(x&&x.status||'').toLowerCase()==='paid'}
function current(){var view=document.getElementById('invoiceView');if(!view)return null;var n=view.querySelector('.invoice-meta b');var number=n?(n.textContent||'').trim():'';if(!number)return null;return read().find(function(x){return String(x.number||'').toUpperCase()===number.toUpperCase()})||null}
function ensure(){var view=document.getElementById('invoiceView');if(!view)return;var box=view.querySelector('.invoice-actions');if(!box)return;var b=box.querySelector('#markPaidBtn');if(!b){b=document.createElement('button');b.type='button';b.id='markPaidBtn';b.className='primary';b.textContent='💰 Mark as Paid';var send=box.querySelector('#sendInvoiceBtn');if(send&&send.nextSibling)box.insertBefore(b,send.nextSibling);else if(send)box.appendChild(b);else box.insertBefore(b,box.firstChild)}b.type='button';b.disabled=false;b.style.pointerEvents='auto';b.style.cursor='pointer';b.style.opacity='1';var inv=current();if(inv)b.textContent=paid(inv)?'↩ Mark as Unpaid':'💰 Mark as Paid'}
function start(){ensure();new MutationObserver(ensure).observe(document.body,{childList:true,subtree:true});setInterval(ensure,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();