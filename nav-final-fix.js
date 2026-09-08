(function(){
'use strict';
if(window.__dustyNavFinalLoaded)return;
window.__dustyNavFinalLoaded=true;
function $(id){return document.getElementById(id)}
function setActive(id){document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('active',s.id===id)});document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.getAttribute('data-screen')===id)});window.scrollTo(0,0)}
function invoiceNav(){try{if(window.tqbActivateInvoices){window.tqbActivateInvoices();return}}catch(e){console.error('DustyBoots invoice navigation',e)}var s=$('invoices');if(!s){return}setActive('invoices');var r=$('invoiceRefresh');if(r){try{r.click()}catch(e){console.error('DustyBoots invoice refresh',e)}}}
function customerNav(){try{if(window.tqbShowCustomers){window.tqbShowCustomers();return}}catch(e){console.error('DustyBoots customer navigation',e)}var s=$('customers');if(s)setActive('customers')}
function businessNav(id){try{if(window.tqbOpenBusiness){window.tqbOpenBusiness(id);return}}catch(e){console.error('DustyBoots business page',id,e)}var s=$(id);if(s){setActive(id);var r=$(id+'Refresh');if(r){try{r.click()}catch(e){}}}}
function handle(e){var b=e.target.closest&&e.target.closest('.bottom-nav .nav[data-screen]');if(!b)return;var id=b.getAttribute('data-screen');if(id==='customers'||id==='invoices'||id==='itemsServices'||id==='payments'||id==='reports'){e.preventDefault();e.stopImmediatePropagation();if(id==='customers')customerNav();else if(id==='invoices')invoiceNav();else businessNav(id)}}
function order(){var n=document.querySelector('.bottom-nav');if(!n)return;var ids=['dashboard','quoteForm','saved','invoices','customers','itemsServices','payments','reports','settings'];ids.forEach(function(id){var b=n.querySelector('[data-screen="'+id+'"]');if(b)n.appendChild(b)})}
function warmPages(){try{if(window.tqbOpenBusiness){window.tqbOpenBusiness('itemsServices');window.tqbOpenBusiness('payments');window.tqbOpenBusiness('reports')}}catch(e){console.error('DustyBoots page warmup',e)}var active=document.querySelector('.screen.active');document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('active',s===active)});document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.getAttribute('data-screen')===active&&active?active.id:n.getAttribute('data-screen')===('dashboard'&&active?active.id:'') )})}
function init(){order();document.addEventListener('click',handle,true);setTimeout(order,100);setTimeout(order,500);setTimeout(function(){if(window.tqbOpenBusiness){['itemsServices','payments','reports'].forEach(function(id){try{window.tqbOpenBusiness(id)}catch(e){}});order()}},700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();