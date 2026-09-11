(function(){
'use strict';
function attach(){
  var v=document.getElementById('invoiceView');
  if(!v)return;
  var a=v.querySelector('.invoice-actions');
  if(!a)return;
  var b=a.querySelector('#invoiceEditBtn');
  if(!b){
    b=document.createElement('button');
    b.type='button';
    b.id='invoiceEditBtn';
    b.textContent='✏️ Edit Invoice';
    a.appendChild(b);
  }
  if(b.dataset.dbLauncher==='1')return;
  b.dataset.dbLauncher='1';
  b.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    b.removeAttribute('data-db-launcher');
    var old=document.querySelector('script[data-invoice-editor-loader]');
    if(old){try{old.remove()}catch(err){}}
    var sc=document.createElement('script');
    sc.src='./invoice-edit.js?v=12';
    sc.dataset.invoiceEditorLoader='1';
    sc.onload=function(){
      setTimeout(function(){
        var fresh=document.getElementById('invoiceEditBtn');
        if(fresh&&fresh!==b){try{fresh.click()}catch(err){}}
      },100);
    };
    document.head.appendChild(sc);
  };
}
function start(){
  attach();
  new MutationObserver(attach).observe(document.body,{childList:true,subtree:true});
  setInterval(attach,500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
