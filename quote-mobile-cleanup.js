(function(){
'use strict';
if(window.__dustybootsQuoteMobileCleanupLoaded)return;
window.__dustybootsQuoteMobileCleanupLoaded=true;

function isMobile(){return window.matchMedia&&window.matchMedia('(max-width:700px)').matches}

function moveQuoteExtras(){
  if(!isMobile())return false;
  var form=document.getElementById('quoteFormEl');
  if(!form)return false;
  var customerSec=form.querySelector('.quote-mobile-customer');
  var itemsSec=form.querySelector('.quote-mobile-items');
  if(!customerSec||!itemsSec)return false;

  // The saved-customer picker can be injected after the main form is sectioned.
  // Find its top-level form wrapper by its visible heading, then place it first
  // inside the Customer section without changing any existing IDs or handlers.
  var existing=null;
  Array.prototype.some.call(form.children,function(el){
    if(el.classList.contains('quote-mobile-section'))return false;
    if(/existing\s+customer/i.test(el.textContent||'') && el.querySelector('select')){existing=el;return true}
    return false;
  });
  if(existing){
    customerSec.insertBefore(existing,customerSec.children[1]||null);
  }

  // Keep the pricing explanation with the Items & Labour section.
  var note=form.querySelector('.pricing-note');
  if(note && note.parentElement!==itemsSec)itemsSec.insertBefore(note,itemsSec.querySelector('.item-head')||null);

  return true;
}

function start(){
  var tries=0;
  function run(){
    tries++;
    if(moveQuoteExtras() || tries>=80)return;
    setTimeout(run,100);
  }
  run();
  if(window.MutationObserver){
    var observer=new MutationObserver(function(){moveQuoteExtras()});
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(function(){observer.disconnect()},10000);
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
