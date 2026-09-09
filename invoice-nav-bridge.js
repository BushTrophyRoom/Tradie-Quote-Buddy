(function(){
'use strict';
if(window.__tqbInvoiceNavBridgeLoaded)return;
window.__tqbInvoiceNavBridgeLoaded=true;
var handlers={};
function readInvoices(){try{var x=JSON.parse(localStorage.getItem('tqb_invoices_v1')||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function capture(){
  var cards=document.querySelectorAll('#invoiceList .invoice-card');
  for(var i=0;i<cards.length;i++){
    var id=cards[i].getAttribute('data-invoice-id');
    if(id&&typeof cards[i].onclick==='function')handlers[String(id)]=cards[i].onclick;
  }
}
function styles(){
  if(document.getElementById('tqb-invoice-bridge-style'))return;
  var s=document.createElement('style');s.id='tqb-invoice-bridge-style';
  s.textContent='.tqb-invoice-bridge-list{display:grid;gap:12px}.tqb-invoice-bridge-card{background:#fff;border:1px solid #e6eaf0;border-radius:14px;padding:18px;box-shadow:0 3px 14px #1720330b}.tqb-invoice-bridge-card .row{display:flex;justify-content:space-between;gap:12px}.tqb-invoice-bridge-card small{display:block;color:#667085;margin-top:5px}.tqb-invoice-bridge-open{display:block!important;width:100%!important;margin-top:14px!important;border:0!important;border-radius:10px!important;padding:13px 14px!important;background:#172033!important;color:#fff!important;font:inherit!important;font-weight:800!important;min-height:50px!important;cursor:pointer!important;touch-action:manipulation!important;pointer-events:auto!important}';
  document.head.appendChild(s);
}
function restore(){
  capture();
  var section=document.getElementById('invoices');
  if(!section)return;
  var staticPage=section.querySelector('.db-data-page');
  if(!staticPage)return;
  styles();
  var list=readInvoices();
  var html='<div class="section-head"><h2>Invoices</h2></div><div class="tqb-invoice-bridge-list">';
  if(!list.length)html+='<div class="empty">No invoices yet.</div>';
  for(var i=0;i<list.length;i++){
    var x=list[i];
    html+='<div class="tqb-invoice-bridge-card" data-invoice-id="'+String(x.id||'').replace(/"/g,'&quot;')+'"><div class="row"><b>'+String(x.number||'Invoice')+'</b><b>$'+Number(x.total||0).toLocaleString('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2})+'</b></div><small>'+String(x.customerName||'Unnamed customer')+' · '+String(x.invoiceDate||'')+'</small><div style="margin-top:8px">'+String(x.status||'Unpaid')+'</div><button type="button" class="tqb-invoice-bridge-open">📄 Open Invoice</button></div>';
  }
  html+='</div>';
  section.innerHTML=html;
  section.classList.add('active');
  document.querySelectorAll('.screen').forEach(function(s){if(s.id!=='invoices')s.classList.remove('active')});
  document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.getAttribute('data-screen')==='invoices')});
  section.querySelectorAll('.tqb-invoice-bridge-card').forEach(function(card){
    var id=card.getAttribute('data-invoice-id');
    var handler=handlers[String(id)];
    function open(){
      if(handler){handler.call(card,{target:card,preventDefault:function(){},stopPropagation:function(){}});return}
      var original=document.querySelector('#invoiceList .invoice-card[data-invoice-id="'+id.replace(/"/g,'\\"')+'"]');
      if(original&&typeof original.onclick==='function'){original.onclick.call(card,{target:card,preventDefault:function(){},stopPropagation:function(){}});return}
      alert('Please refresh the app and try opening the invoice again.');
    }
    card.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.tqb-invoice-bridge-open'))return;open()});
    var b=card.querySelector('.tqb-invoice-bridge-open');
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();open()});
    card.addEventListener('touchend',function(e){if(e.target.closest&&e.target.closest('.tqb-invoice-bridge-open'))return;e.preventDefault();e.stopPropagation();open()},{passive:false});
  });
}
function watch(){
  capture();
  if(window.MutationObserver){var o=new MutationObserver(function(){capture();var section=document.getElementById('invoices');if(section&&section.querySelector('.db-data-page'))restore()});o.observe(document.body,{childList:true,subtree:true});}
  setInterval(function(){capture();var section=document.getElementById('invoices');if(section&&section.classList.contains('active')&&section.querySelector('.db-data-page'))restore()},500);
}
styles();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();
