(function(){
'use strict';
if(window.__dustyMobileInvoiceCleanupLoaded)return;
window.__dustyMobileInvoiceCleanupLoaded=true;
function removeQuickActions(){document.querySelectorAll('.db-mobile-quick').forEach(function(x){x.remove()})}
function installStyles(){if(document.getElementById('dusty-mobile-invoice-cleanup-style'))return;var s=document.createElement('style');s.id='dusty-mobile-invoice-cleanup-style';s.textContent='@media(max-width:800px){#invoices .invoice-card button,#invoices .tqb-invoice-bridge-card button{display:none!important}#invoices .invoice-card .invoice-open-btn,#invoices .invoice-card .tqb-invoice-bridge-open,#invoices .invoice-card .tqb-open-invoice-fallback,#invoices .tqb-invoice-bridge-card .invoice-open-btn,#invoices .tqb-invoice-bridge-card .tqb-invoice-bridge-open,#invoices .tqb-invoice-bridge-card .tqb-open-invoice-fallback{display:none!important}}';document.head.appendChild(s)}
function cleanCards(){
 document.querySelectorAll('#invoices .tqb-invoice-bridge-card,#invoices .invoice-card').forEach(function(card){
  var open=card.querySelector('.tqb-invoice-bridge-open,.invoice-open-btn,.tqb-open-invoice-fallback');
  if(open){open.style.setProperty('display','none','important');open.setAttribute('aria-hidden','true')}
  card.querySelectorAll('button').forEach(function(b){b.remove()});
  if(card.dataset.mobileInvoiceClick!=='1'){
   card.dataset.mobileInvoiceClick='1';card.style.cursor='pointer';card.setAttribute('role','button');card.setAttribute('tabindex','0');
   var openCard=function(){var b=card.querySelector('.tqb-invoice-bridge-open,.invoice-open-btn,.tqb-open-invoice-fallback');if(b)b.click()};
   card.addEventListener('click',function(){openCard()});
   card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard()}});
  }
 })
}
function run(){if(!window.matchMedia||window.matchMedia('(max-width:800px)').matches){installStyles();removeQuickActions();cleanCards()}}
function start(){run();if(window.MutationObserver)new MutationObserver(run).observe(document.body,{childList:true,subtree:true});setInterval(run,300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
