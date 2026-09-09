(function(){
'use strict';
if(window.__dustyMobileInvoiceCleanupLoaded)return;
window.__dustyMobileInvoiceCleanupLoaded=true;
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function deleteInvoice(id){var list=read(),inv=null;for(var i=0;i<list.length;i++)if(String(list[i].id)===String(id)){inv=list[i];break}if(!inv)return;if(!confirm('Delete invoice '+(inv.number||'')+'?\n\nThis will permanently remove the invoice from this device.'))return;localStorage.setItem(KEY,JSON.stringify(list.filter(function(x){return String(x.id)!==String(id)})));location.reload()}
function removeQuickActions(){document.querySelectorAll('.db-mobile-quick').forEach(function(x){x.remove()})}
function cleanCards(){
 document.querySelectorAll('.tqb-invoice-bridge-card,.invoice-card').forEach(function(card){
  card.querySelectorAll('.tqb-invoice-bridge-open,.invoice-open-btn,.tqb-open-invoice-fallback').forEach(function(b){b.style.display='none';b.setAttribute('aria-hidden','true')});
  card.querySelectorAll('button').forEach(function(b){if(b.style.display!=='none')b.remove()});
  if(card.dataset.mobileInvoiceClick!=='1'){card.dataset.mobileInvoiceClick='1';card.style.cursor='pointer';card.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('button'))return;var b=card.querySelector('.tqb-invoice-bridge-open,.invoice-open-btn,.tqb-open-invoice-fallback');if(b)b.click();})}
 })
}
function findInvoice(){var section=document.getElementById('invoices');if(!section)return null;var num='';var h=section.querySelector('.tqb-business-meta b,.invoice-meta b');if(h)num=(h.textContent||'').trim();if(!num){var sh=section.querySelector('.section-head h2');num=sh?(sh.textContent||'').trim():''}var list=read();for(var i=0;i<list.length;i++)if(String(list[i].number||'')===num)return list[i];return null}
function addDelete(){
 var section=document.getElementById('invoices');if(!section)return;
 var actions=section.querySelector('.tqb-invoice-detail-actions,.tqb-business-actions,.invoice-actions');if(!actions||actions.querySelector('.tqb-mobile-delete-invoice'))return;
 var inv=findInvoice();if(!inv)return;
 var b=document.createElement('button');b.type='button';b.className='secondary tqb-mobile-delete-invoice';b.textContent='🗑️ Delete Invoice';b.style.cssText='width:100%;min-height:50px;background:#fee2e2;color:#b42318;font-weight:800;border:0;border-radius:10px;padding:12px 14px;font:inherit;cursor:pointer;touch-action:manipulation;';b.onclick=function(e){e.preventDefault();e.stopPropagation();deleteInvoice(inv.id)};actions.appendChild(b)
}
function run(){if(!window.matchMedia||window.matchMedia('(max-width:800px)').matches){removeQuickActions();cleanCards();addDelete()}}
function start(){run();if(window.MutationObserver)new MutationObserver(run).observe(document.body,{childList:true,subtree:true});setInterval(run,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
