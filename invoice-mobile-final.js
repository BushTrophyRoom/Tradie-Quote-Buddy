(function(){
'use strict';
if(window.__dustyInvoiceMobileFinalLoaded)return;
window.__dustyInvoiceMobileFinalLoaded=true;
function mobile(){return !window.matchMedia||window.matchMedia('(max-width:800px)').matches}
function removeListButtons(){
 if(!mobile())return;
 document.querySelectorAll('#invoices .invoice-card,#invoices .tqb-invoice-bridge-card,#invoices .tqb-mobile-invoice-card,#invoicesData [data-delete-invoice]').forEach(function(node){
  var card=node.matches&&node.matches('[data-delete-invoice]')?node.closest('.tqb-mobile-invoice-card,.invoice-card,.tqb-invoice-bridge-card')||node:node;
  if(card.closest&&card.closest('.tqb-business-invoice,.tqb-invoice-detail,.invoice-paper'))return;
  card.querySelectorAll('button,[data-delete-invoice]').forEach(function(b){b.remove()});
  var open=card.querySelector('.invoice-open-btn,.tqb-invoice-bridge-open,.tqb-open-invoice-fallback');
  if(open)open.remove();
  if(card.dataset.dustyInvoiceFinalClick!=='1'){
   card.dataset.dustyInvoiceFinalClick='1';
   card.style.cursor='pointer';
   card.setAttribute('role','button');
   card.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&e.target.closest('button'))return;
    var id=card.getAttribute('data-invoice-id');
    var list=[];try{list=JSON.parse(localStorage.getItem('tqb_invoices_v1')||'[]')}catch(err){}
    var inv=list.find(function(x){return String(x.id)===String(id)});
    if(inv&&window.tqbOpenBusinessInvoice)window.tqbOpenBusinessInvoice(inv);
    else if(inv){var event=new CustomEvent('tqb-open-invoice',{detail:inv});document.dispatchEvent(event)}
   });
  }
 })
}
function addDeleteInside(){
 if(!mobile())return;
 var detail=document.querySelector('#invoices .tqb-business-invoice,#invoices .tqb-invoice-detail,#invoices .invoice-paper');
 if(!detail||detail.querySelector('.tqb-mobile-final-delete'))return;
 var actions=detail.querySelector('.tqb-business-actions,.tqb-invoice-detail-actions,.invoice-actions');
 if(!actions)return;
 var heading=document.querySelector('#invoices .tqb-business-meta b,#invoices .invoice-meta b,#invoices .section-head h2');
 var number=heading?(heading.textContent||'').trim():'';
 var list=[];try{list=JSON.parse(localStorage.getItem('tqb_invoices_v1')||'[]')}catch(e){}
 var inv=null;for(var i=0;i<list.length;i++){if(String(list[i].number||'')===number){inv=list[i];break}}
 if(!inv)return;
 var b=document.createElement('button');b.type='button';b.className='secondary tqb-mobile-final-delete';b.textContent='🗑️ Delete Invoice';b.style.cssText='width:100%;min-height:50px;background:#fee2e2;color:#b42318;font-weight:800;border:0;border-radius:10px;padding:12px 14px;font:inherit;cursor:pointer;touch-action:manipulation;';
 b.onclick=function(e){e.preventDefault();e.stopPropagation();if(!confirm('Delete '+(inv.number||'this invoice')+'?\n\nThis will permanently remove the invoice from this device.'))return;localStorage.setItem('tqb_invoices_v1',JSON.stringify(list.filter(function(x){return String(x.id)!==String(inv.id)})));location.reload()};
 actions.appendChild(b);
}
function run(){removeListButtons();addDeleteInside()}
function start(){run();if(window.MutationObserver)new MutationObserver(run).observe(document.body,{childList:true,subtree:true});setInterval(run,400)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
