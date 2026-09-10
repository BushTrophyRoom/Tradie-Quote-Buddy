(function(){
  'use strict';
  var KEY='dustyboots-build-seen';
  var BUILD='2026-09-10-2';
  try{localStorage.setItem(KEY,BUILD)}catch(e){}
  var sc=document.createElement('script');
  sc.src='./invoice-fix.js?v=1';
  sc.defer=true;
  document.head.appendChild(sc);
  if(!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./sw.js?v=60',{updateViaCache:'none'}).then(function(reg){
    try{return reg.update()}catch(e){}
  }).catch(function(){});
})();
