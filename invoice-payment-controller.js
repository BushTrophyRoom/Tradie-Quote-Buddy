(function(){
'use strict';
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function current(){
  var v=document.getElementById('invoiceView')||document.getElementById('invoicesData');
  if(!v)return null;
  var b=v.querySelector('.invoice-meta b,.tqb-business-meta b');
  var n=b&&(b.textContent||'').trim();
  if(!n){
    var m=(v.textContent||'').match(/INV-\d{3}/i);
    n=m?m[0]:'';
  }
  if(!n)return null;
  return read().find(function(x){return String(x.number||'').toUpperCase()===n.toUpperCase()})||null
}
function record(inv,method){
  var list=read(),i=list.findIndex(function(x){return String(x.id)===String(inv.id)});
  if(i<0)return;
  list[i].status='Paid';
  list[i].paidSource='manual';
  list[i].paidMethod=method;
  list[i].paymentMethod=method;
  list[i].paymentDate=new Date().toISOString().slice(0,10);
  list[i].paidAt=Date.now();
  save(list);
  location.reload()
}
function markUnpaid(inv){
  var list=read(),i=list.findIndex(function(x){return String(x.id)===String(inv.id)});
  if(i<0)return;
  if(!confirm('Mark '+(inv.number||'this invoice')+' as unpaid?\n\nThe payment method and paid date will be cleared.'))return;
  list[i].status='Unpaid';
  delete list[i].paidSource;
  delete list[i].paidMethod;
  delete list[i].paymentMethod;
  delete list[i].paymentDate;
  delete list[i].paidAt;
  save(list);
  location.reload()
}
function show(button){
  var old=document.getElementById('dustyboots-payment-menu');
  if(old)old.remove();
  var box=document.createElement('div');
  box.id='dustyboots-payment-menu';
  box.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#fff;width:min(92vw,360px);padding:22px;border-radius:18px;box-shadow:0 20px 60px #0006;font-family:Arial,sans-serif';
  var shade=document.createElement('div');
  shade.id='dustyboots-payment-shade';
  shade.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#0008';
  ['Cash','Bank Transfer','Card / EFTPOS','Other'].forEach(function(method){
    var b=document.createElement('button');
    b.type='button';b.textContent=method;
    b.style.cssText='display:block;width:100%;padding:15px;margin:8px 0;border:1px solid #ddd;border-radius:11px;background:#fff;font:700 16px Arial;color:#172033';
    b.onclick=function(e){e.preventDefault();e.stopPropagation();var inv=current();if(inv)record(inv,method)};
    box.appendChild(b)
  });
  var c=document.createElement('button');
  c.type='button';c.textContent='Cancel';
  c.style.cssText='display:block;width:100%;padding:13px;margin-top:12px;border:0;border-radius:11px;background:#eee;font:700 15px Arial';
  c.onclick=function(){shade.remove();box.remove()};
  box.appendChild(c);
  document.body.appendChild(shade);document.body.appendChild(box);shade.onclick=c.onclick
}
function addUnpaidButton(){
  var inv=current();
  if(!inv||String(inv.status||'').toLowerCase()!=='paid')return;
  if(document.getElementById('tqbMarkUnpaidBtn'))return;
  var actions=document.querySelector('#invoiceView .invoice-actions')||document.querySelector('#invoiceView .action-row');
  if(!actions)return;
  var b=document.createElement('button');
  b.type='button';
  b.id='tqbMarkUnpaidBtn';
  b.className='secondary';
  b.textContent='↩️ Mark as Unpaid';
  b.title='Change this paid invoice back to unpaid';
  actions.appendChild(b);
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();var x=current();if(x)markUnpaid(x)})
}
function handler(e){
  var t=e.target&&e.target.closest?e.target.closest('#markPaidBtn,#tqbManualPayment'):null;
  if(!t)return;
  var inv=current();
  if(!inv||String(inv.status||'').toLowerCase()==='paid')return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();show(t)
}
function start(){
  document.addEventListener('click',handler,true);
  document.addEventListener('pointerup',function(e){var t=e.target&&e.target.closest?e.target.closest('#markPaidBtn,#tqbManualPayment'):null;if(t){e.preventDefault();e.stopPropagation()}},true);
  var v=document.getElementById('invoiceView');
  if(v){new MutationObserver(addUnpaidButton).observe(v,{childList:true,subtree:true});}
  addUnpaidButton();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
