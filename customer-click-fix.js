(function(){
'use strict';
function getCard(e){
  var card=e.target&&e.target.closest?e.target.closest('.customers-v2-card'):null;
  if(card)return card;
  if(document.elementsFromPoint&&typeof e.clientX==='number'){
    var els=document.elementsFromPoint(e.clientX,e.clientY);
    for(var i=0;i<els.length;i++){if(els[i].matches&&els[i].matches('.customers-v2-card'))return els[i];if(els[i].closest){var c=els[i].closest('.customers-v2-card');if(c)return c}}
  }
  return null;
}
function openCard(card){
  if(!card)return;
  var fn=card.onclick;
  if(typeof fn==='function'){fn.call(card);return}
  card.dispatchEvent(new MouseEvent('click',{bubbles:false,cancelable:true,view:window}));
}
function start(){
  var style=document.createElement('style');style.textContent='.customers-v2-grid,.customers-v2-card{position:relative;z-index:20}.customers-v2-card{pointer-events:auto!important;cursor:pointer!important}';document.head.appendChild(style);
  document.addEventListener('click',function(e){var card=getCard(e);if(!card)return;e.preventDefault();e.stopImmediatePropagation();openCard(card)},true);
  document.addEventListener('pointerup',function(e){var card=getCard(e);if(!card)return;if(e.button!==0)return;openCard(card)},true);
  document.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var card=e.target.closest&&e.target.closest('.customers-v2-card');if(!card)return;e.preventDefault();openCard(card)},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
