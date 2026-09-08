(function(){
'use strict';
function addButtons(){
  var list=document.getElementById('customerList');
  if(!list)return;
  list.querySelectorAll('.customers-v2-card').forEach(function(card){
    if(card.querySelector('.customer-view-btn'))return;
    var id=card.getAttribute('data-customer-id');
    if(!id)return;
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='customer-view-btn';
    btn.textContent='View customer →';
    btn.style.cssText='display:block;width:100%;margin-top:14px;padding:10px 12px;border:1px solid #dfe4e9;border-radius:9px;background:#f7f9fb;color:#111;font-weight:800;cursor:pointer;position:relative;z-index:20;pointer-events:auto';
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();open(id)},false);
    btn.addEventListener('pointerup',function(e){e.preventDefault();e.stopPropagation();open(id)},false);
    card.appendChild(btn);
  });
}
function open(id){
  var list=document.getElementById('customerList');
  if(!list)return;
  var card=Array.prototype.find.call(list.querySelectorAll('.customers-v2-card'),function(x){return x.getAttribute('data-customer-id')===String(id)});
  if(!card)return;
  var old=card.onclick;
  if(typeof old==='function'){old.call(card);return;}
  if(typeof window.tqbShowCustomer==='function'){window.tqbShowCustomer(id);return;}
  var name=card.querySelector('.customers-v2-name');
  if(name&&typeof window.tqbShowCustomers==='function')window.tqbShowCustomers();
}
function start(){addButtons();setInterval(addButtons,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
