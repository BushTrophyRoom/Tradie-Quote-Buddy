(function(){
'use strict';
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function write(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
function paid(x){return String(x&&x.status||'').toLowerCase()==='paid'}
function numberFromView(){var v=document.getElementById('invoiceView');if(!v)return '';var el=v.querySelector('[data-invoice-number],.invoice-number,#invoiceNumber');var t=el?(el.textContent||el.value||''):(v.textContent||'');var m=t.match(/INV-\d+/i);return m?m[0]:''}
function current(){var n=numberFromView();if(!n)return null;return read().find(function(x){return String(x.number).toUpperCase()===String(n).toUpperCase()})||null}
function buttons(v){return Array.from(v.querySelectorAll('button'))}
function findButton(v,rx,id){return v.querySelector(id)||buttons(v).find(function(b){return rx.test((b.textContent||'').trim())})}
function injectStyle(){if(document.getElementById('dusty-invoice-layout'))return;var s=document.createElement('style');s.id='dusty-invoice-layout';s.textContent='.dusty-invoice-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;width:100%!important;max-width:680px!important;margin:0 auto 14px!important}.dusty-invoice-actions>button{width:100%!important;min-height:52px!important;border:0!important;border-radius:12px!important;font-weight:800!important;font-size:15px!important;cursor:pointer!important}.dusty-invoice-actions .dusty-send{grid-column:1/-1!important;background:#ffb000!important;color:#111!important}.dusty-invoice-actions .dusty-paid{background:#16a34a!important;color:#fff!important}.dusty-invoice-actions .dusty-delete{background:#ffe8e8!important;color:#b42318!important}.dusty-invoice-actions .dusty-more{grid-column:1/-1!important;background:#eef0f4!important;color:#172033!important}.dusty-more-menu{display:none!important;grid-column:1/-1!important;background:#f7f8fa!important;border-radius:12px!important;padding:8px!important;gap:8px!important}.dusty-more-menu.open{display:grid!important;grid-template-columns:1fr 1fr!important}.dusty-more-menu button{background:#fff!important;color:#172033!important;border:1px solid #ddd!important}.dusty-more-menu .dusty-full{grid-column:1/-1!important}@media(max-width:600px){.dusty-invoice-actions{gap:8px!important}.dusty-more-menu.open{grid-template-columns:1fr!important}.dusty-more-menu button{grid-column:1/-1!important}}';document.head.appendChild(s)}
function layout(v){
 injectStyle();
 var send=findButton(v,/^\s*(send invoice|send)\b/i,'#sendInvoiceBtn');
 if(!send)return;
 var box=send.parentElement;
 if(!box)return;
 box.classList.add('dusty-invoice-actions');
 var paidBtn=findButton(v,/(mark as paid|mark paid|paid)/i,'#markPaidBtn');
 var del=findButton(v,/(delete invoice|delete)/i,'#deleteInvoiceBtn');
 send.classList.add('dusty-send');send.type='button';
 if(paidBtn){paidBtn.classList.add('dusty-paid');paidBtn.type='button';paidBtn.disabled=false;paidBtn.style.pointerEvents='auto'}
 if(del){del.classList.add('dusty-delete');del.type='button'}
 var more=box.querySelector('.dusty-more');
 if(!more){more=document.createElement('button');more.type='button';more.className='dusty-more';more.textContent='••• More';box.appendChild(more)}
 var menu=box.querySelector('.dusty-more-menu');
 if(!menu){menu=document.createElement('div');menu.className='dusty-more-menu';box.appendChild(menu)}
 Array.from(box.children).forEach(function(el){if(el.tagName==='BUTTON'&&el!==send&&el!==paidBtn&&el!==del&&el!==more&&!menu.contains(el))menu.appendChild(el)});
 more.onclick=function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();menu.classList.toggle('open');more.textContent=menu.classList.contains('open')?'✕ Less':'••• More'};
 update(v,current());
}
function update(v,inv){if(!v||!inv)return;v.querySelectorAll('.invoice-status').forEach(function(s){s.textContent=inv.status||'Unpaid';s.setAttribute('aria-label',inv.status||'Unpaid')});var b=findButton(v,/(mark as paid|mark paid|paid)/i,'#markPaidBtn');if(b)b.textContent=paid(inv)?'↩ Mark as Unpaid':'💰 Mark as Paid'}
function togglePaid(){var inv=current();if(!inv)return;var list=read();var x=list.find(function(i){return String(i.number).toUpperCase()===String(inv.number).toUpperCase()});if(!x)return;if(paid(x)){x.status='Unpaid';delete x.paidAt;delete x.paidSource;delete x.paidMethod}else{x.status='Paid';x.paidAt=Date.now();x.paidSource='manual';x.paidMethod='Manual payment'}if(!write(list))return;var v=document.getElementById('invoiceView');update(v,x);if(typeof window.renderList==='function')window.renderList();if(typeof window.refreshTQBDashboard==='function')window.refreshTQBDashboard()}
function handler(e){var t=e.target&&e.target.closest?e.target.closest('button'):null;if(!t)return;var label=(t.textContent||'').trim();if(t.id==='markPaidBtn'||/^(💰\s*)?mark as paid$/i.test(label)||/^(↩\s*)?mark as unpaid$/i.test(label)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();togglePaid()}}
function patch(){var v=document.getElementById('invoiceView');if(!v)return;layout(v)}
function start(){document.addEventListener('click',handler,true);patch();new MutationObserver(patch).observe(document.body,{childList:true,subtree:true});setInterval(patch,1000);try{if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js?v=61',{updateViaCache:'none'}).then(function(reg){try{reg.update()}catch(e){}}).catch(function(){})}}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
