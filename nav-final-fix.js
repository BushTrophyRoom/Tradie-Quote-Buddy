(function(){
'use strict';
if(window.__dustyNavFinalLoaded)return;
window.__dustyNavFinalLoaded=true;
function $(id){return document.getElementById(id)}
function setActive(id){document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('active',s.id===id)});document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.getAttribute('data-screen')===id)});window.scrollTo(0,0)}
function invoiceNav(){if(window.tqbActivateInvoices){window.tqbActivateInvoices();return}var s=$('invoices');if(!s)return;setActive('invoices');var r=$('invoiceRefresh');if(r)r.click()}
function customerNav(){if(window.tqbShowCustomers){window.tqbShowCustomers();return}var s=$('customers');if(s)setActive('customers')}
function businessNav(id){if(window.tqbOpenBusiness){window.tqbOpenBusiness(id);return}var s=$(id);if(s){setActive(id);var r=$(id+'Refresh');if(r)r.click()}}
function handle(e){var b=e.target.closest&&e.target.closest('.bottom-nav .nav[data-screen]');if(!b)return;var id=b.getAttribute('data-screen');if(id==='customers'){e.preventDefault();e.stopImmediatePropagation();customerNav();return}if(id==='invoices'){e.preventDefault();e.stopImmediatePropagation();invoiceNav();return}if(id==='itemsServices'||id==='payments'||id==='reports'){e.preventDefault();e.stopImmediatePropagation();businessNav(id);return}}
function order(){var n=document.querySelector('.bottom-nav');if(!n)return;var ids=['dashboard','quoteForm','saved','invoices','customers','itemsServices','payments','reports','settings'];ids.forEach(function(id){var b=n.querySelector('[data-screen="'+id+'"]');if(b)n.appendChild(b)})}
function init(){order();document.addEventListener('click',handle,true);setTimeout(order,100);setTimeout(order,500);setInterval(order,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();