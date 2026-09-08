(function(){
'use strict';
function findCustomerCard(target){
 var card=target.closest&&target.closest('.customers-v2-card');
 return card||null;
}
function openCard(card){
 var id=card.getAttribute('data-customer-id');
 if(!id)return;
 var name=(card.querySelector('.customers-v2-name')||{}).textContent||'';
 var list=document.getElementById('customerList');
 if(!list)return;
 var detail=document.getElementById('customerDetail');
 if(detail){detail.dataset.customerId=id;}
 if(typeof window.tqbOpenCustomer==='function'){window.tqbOpenCustomer(id);return;}
 var buttons=card.querySelectorAll('button');
 for(var i=0;i<buttons.length;i++){
   if(buttons[i].textContent.indexOf('View customer')>=0){buttons[i].click();return;}
 }
 var evt=new CustomEvent('tqb:open-customer',{detail:{id:id,name:name}});
 document.dispatchEvent(evt);
}
function start(){
 document.addEventListener('click',function(e){
   var card=findCustomerCard(e.target);
   if(!card)return;
   if(e.target.closest('button'))return;
   e.preventDefault();e.stopPropagation();
   openCard(card);
 },true);
 document.addEventListener('click',function(e){
   var b=e.target.closest&&e.target.closest('.customer-view-btn');
   if(!b)return;
   var card=b.closest('.customers-v2-card');
   if(!card)return;
   e.preventDefault();e.stopPropagation();openCard(card);
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
