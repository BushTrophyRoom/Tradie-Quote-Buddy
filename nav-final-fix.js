(function(){
'use strict';
if(window.__dustyNavFinalLoaded)return;
window.__dustyNavFinalLoaded=true;
function order(){
  var n=document.querySelector('.bottom-nav');
  if(!n)return;
  var ids=['dashboard','quoteForm','saved','invoices','customers','itemsServices','payments','reports','settings'];
  ids.forEach(function(id){var b=n.querySelector('[data-screen="'+id+'"]');if(b)n.appendChild(b)});
}
function init(){order();setTimeout(order,100);setTimeout(order,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();