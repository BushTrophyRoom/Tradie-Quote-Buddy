(function(){
'use strict';
function openCard(card){
  if(!card)return;
  var id=card.getAttribute('data-customer-id');
  if(!id)return;
  var list=document.getElementById('customerList');
  if(!list)return;
  var cards=list.querySelectorAll('.customers-v2-card');
  for(var i=0;i<cards.length;i++){
    if(cards[i].getAttribute('data-customer-id')===id){
      if(typeof cards[i].onclick==='function'){
        cards[i].onclick();
        return;
      }
    }
  }
}
function start(){
  document.addEventListener('click',function(e){
    var card=e.target.closest&&e.target.closest('.customers-v2-card');
    if(!card)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openCard(card);
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var card=e.target.closest&&e.target.closest('.customers-v2-card');
    if(!card)return;
    e.preventDefault();
    openCard(card);
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
