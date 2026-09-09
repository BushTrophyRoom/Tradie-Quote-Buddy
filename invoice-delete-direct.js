(function(){
'use strict';
if(window.__dustyMobileInvoiceCleanupLoaded)return;
window.__dustyMobileInvoiceCleanupLoaded=true;
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function deleteInvoice(id){var list=read(),inv=null;for(var i=0;i<list.length;i++)if(String(list[i].id)===String(id)){inv=list[i];break}if(!inv)return;if(!confirm('Delete invoice '+(inv.number||'')+'?\n\nThis will permanently remove the invoice from this device.'))return;localStorage.setItem(KEY,JSON.stringify(list.filter(function(x){return String(x.id)!==String(id)})));location.reload()}
function removeQuickActions(){document.querySelectorAll('.db-mobile-quick').forEach(function(x){x.remove()})}
function cleanCards(){document.querySelectorAll('.tqb-invoice-bridge-card').forEach(function(card){var open=card.querySelector('.tqb-invoice-bridge-open');if(open)open.remove();card.querySelectorAll('button').forEach(function(b){b.remove()});if(card.dataset.mobileInvoiceClick!=='1'){card.dataset.mobileInvoiceClick='1';card.style.cursor='pointer';card.addEventListener('click',function(){var id=card.getAttribute('data-invoice-id');if(id&&window.__tqbOpenInvoiceFromMobile)window.__tqbOpenInvoiceFromMobile(id);else{var event=document.createEvent('MouseEvents');event.initEvent('click',true,true);card.dispatchEvent(event)}})}})}
function findInvoice(){var section=document.getElementById('invoices');if(!section)return null;var h=section.querySelector('.section-head h2');var num=h?(h.textContent||'').trim():'';var list=read();for(var i=0;i<list.length;i++)if(String(list[i].number||'')===num)return list[i];return null}
function addDelete(){var section=document.getElementById('invoices');if(!section)return;var actions=section.querySelector('.tqb-invoice-detail-actions');if(!actions||actions.querySelector('.tqb-mobile-delete-invoice'))return;var inv=findInvoice();if(!inv)return;var b=document.createElement('button');b.type='button';b.className='secondary tqb-mobile-delete-invoice';b.textContent='🗑️ Delete Invoice';b.style.cssText='width:100%;min-height:50px;background:#fee2e2;color:#b42318;font-weight:800;border:0;border-radius:10px;padding:12px 14px;font:inherit;cursor:pointer;touch-action:manipulation;';b.onclick=function(e){e.preventDefault();e.stopPropagation();deleteInvoice(inv.id)};actions.appendChild(b)}
function run(){if(!window.matchMedia||window.matchMedia('(max-width:800px)').matches){removeQuickActions();cleanCards();addDelete()}}
function start(){run();if(window.MutationObserver)new MutationObserver(run).observe(document.body,{childList:true,subtree:true});setInterval(run,700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
