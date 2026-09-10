(function(){
  'use strict';
  var KEY='dustyboots-build-seen';
  var BUILD='2026-09-11-1';
  try{localStorage.setItem(KEY,BUILD)}catch(e){}
  var sc=document.createElement('script');
  sc.src='./invoice-fix.js?v=65';
  sc.defer=true;
  document.head.appendChild(sc);
  if(!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./sw.js?v=70',{updateViaCache:'none'}).then(function(reg){
    if(reg.waiting){try{reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(e){}}
    try{return reg.update()}catch(e){}
  }).catch(function(){});
  navigator.serviceWorker.addEventListener('controllerchange',function(){
    try{window.location.reload()}catch(e){}
  });
})();
