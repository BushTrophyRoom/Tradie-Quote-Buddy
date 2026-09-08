(function(){
'use strict';
var IDS=['itemsServices','payments','reports'];
function openBusiness(id,btn){
  var screen=document.getElementById(id);
  if(screen){
    document.querySelectorAll('.screen').forEach(function(x){x.classList.toggle('active',x.id===id)});
    document.querySelectorAll('.nav').forEach(function(x){x.classList.toggle('active',x.getAttribute('data-screen')===id)});
    window.scrollTo(0,0);
    if(id==='itemsServices'&&window.renderItems)window.renderItems();
    if(id==='payments'&&window.renderPayments)window.renderPayments();
    if(id==='reports'&&window.renderReports)window.renderReports();
    return true;
  }
  return false;
}
function install(){
  IDS.forEach(function(id){
    var b=document.querySelector('.nav[data-screen="'+id+'"]');
    if(!b||b.dataset.dbNavFix)return;
    b.dataset.dbNavFix='1';
    b.addEventListener('click',function(e){
      if(openBusiness(id,b)){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },true);
  });
}
function start(){
  install();
  setTimeout(install,100);
  setTimeout(install,500);
  setTimeout(install,1200);
  setInterval(install,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
