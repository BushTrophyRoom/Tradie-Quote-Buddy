(function(){
'use strict';
function attach(){
  var v=document.getElementById('invoiceView');
  if(!v)return false;
  var a=v.querySelector('.invoice-actions');
  if(!a)return false;
  var b=a.querySelector('#invoiceEditBtn');
  if(!b){
    b=document.createElement('button');
    b.type='button';
    b.id='invoiceEditBtn';
    b.textContent='✏️ Edit Invoice';
    b.style.cssText='background:#eef0f4;color:#172033;border:0;border-radius:12px;min-height:52px;font-size:15px;font-weight:800;width:100%;cursor:pointer;';
    a.appendChild(b);
  }
  if(b.dataset.dbLauncher==='2')return true;
  b.dataset.dbLauncher='2';
  b.onclick=function(e){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    var old=document.querySelector('script[data-invoice-editor-loader]');
    if(old)try{old.remove()}catch(err){}
    var sc=document.createElement('script');
    sc.src='./invoice-edit.js?v=12&load='+Date.now();
    sc.dataset.invoiceEditorLoader='1';
    sc.onload=function(){
      setTimeout(function(){
        var fresh=document.getElementById('invoiceEditBtn');
        if(fresh&&fresh!==b)try{fresh.click()}catch(err){}
      },150);
    };
    document.head.appendChild(sc);
  };
  return true;
}
function start(){
  attach();
  var mo=new MutationObserver(function(){attach()});
  mo.observe(document.body,{childList:true,subtree:true});
  setInterval(attach,300);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
